// 拾伴免费版修复：每条 reaction 仅一个 NODE / BACK / CLOSE，无变量与条件动作。
(async()=>{
const p=figma.currentPage,key='shiban.search.free.v1';
if(p.getPluginData(key)==='complete'){figma.notify('免费版搜索已完成');return;}
const sec=p.findOne(n=>n.type==='SECTION'&&n.name==='08 · 搜索与筛选 v2');
const home=await figma.getNodeByIdAsync('16:8524'),publish=await figma.getNodeByIdAsync('16:8931');
if(!sec||!home||!publish)throw Error('缺少已创建的搜索区或首页');
const find=s=>p.findOne(n=>n.type==='FRAME'&&n.name===s);
const old={initial:find('P03v2-搜索-初始与输入'),loading:find('P03v2-搜索-查询中'),u:find('P03v2-搜索-雨伞结果'),k:find('P03v2-搜索-钥匙结果'),c:find('P03v2-搜索-水杯结果'),empty:find('P03v2-搜索-无匹配'),keyboard:find('覆盖层-搜索输入'),campus:find('覆盖层-校区下拉'),filter:find('覆盖层-筛选草稿')};
if(Object.values(old).some(n=>!n))throw Error('9个搜索基础画板不完整');
const detail={u:find('P04-招领详情-蓝伞'),other:find('P04-招领详情-另一候选'),k:find('P04-招领详情-银色钥匙'),c:find('P04-寻物详情-黑色保温杯')};
if(Object.values(detail).some(n=>!n))throw Error('缺少物品详情');
const fontMap=new Map();for(const t of p.findAll(n=>n.type==='TEXT')){const a=t.fontName===figma.mixed?t.getRangeAllFontNames(0,t.characters.length):[t.fontName];for(const f of a)fontMap.set(JSON.stringify(f),f);}
await Promise.all([...fontMap.values()].map(f=>figma.loadFontAsync(f)));
const font=home.findOne(n=>n.type==='TEXT'&&n.fontSize===14&&n.fontName!==figma.mixed).fontName;
const jobs=[],back={type:'BACK'},close={type:'CLOSE'},created=[],touched=new Set();
const nav=(n,how='NAVIGATE')=>({type:'NODE',destinationId:n.id,navigation:how,transition:null,resetScrollPosition:true});
function on(n,a,trigger={type:'ON_CLICK'}){if(!n)return;if(a?.type==='NODE')for(let ancestor=n;ancestor;ancestor=ancestor.parent)if(ancestor.id===a.destinationId){a=null;break;}touched.add(n.id);jobs.push(n.setReactionsAsync(a?[{trigger,actions:[a]}]:[]));}
const all=n=>[n,...n.findAll(()=>true)];
function unbind(n){if(n.boundVariables)for(const k of Object.keys(n.boundVariables)){if(k==='characters'||k==='visible')n.setBoundVariable(k,null);}}
const clear=[];for(const n of all(sec)){unbind(n);if('reactions'in n&&n.reactions.length)clear.push(n.setReactionsAsync([]));}for(const n of all(home))unbind(n);
await Promise.all(clear);
// 保留首页原有业务入口，仅重新接线搜索相关控件。
const rgb=h=>({r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255});
const fill=(n,h)=>n.fills=h?[{type:'SOLID',color:rgb(h)}]:[];
function box(name,w,h=null,dir='VERTICAL',pad=0,gap=0,bg=null){const n=figma.createFrame();n.name=name;n.resize(w,h||1);n.layoutMode=dir;n.primaryAxisSizingMode=dir==='HORIZONTAL'?'FIXED':h?'FIXED':'AUTO';n.counterAxisSizingMode=dir==='HORIZONTAL'?(h?'FIXED':'AUTO'):'FIXED';n.paddingLeft=n.paddingRight=n.paddingTop=n.paddingBottom=pad;n.itemSpacing=gap;n.clipsContent=false;fill(n,bg);if(dir==='HORIZONTAL')n.counterAxisAlignItems='CENTER';return n;}
const add=(p,n)=>(p.appendChild(n),n);
function text(s,w=326,size=14){const n=figma.createText();n.name=s;n.fontName=font;n.fontSize=size;n.lineHeight={unit:'PIXELS',value:size===14?20:Math.round(size*1.5)};n.characters=s;n.resize(w,20);n.textAutoResize='HEIGHT';fill(n,'252B32');return n;}
function button(s,w=358,bg='FFFFFF'){const n=box('操作 / '+s,w,44,'HORIZONTAL',10,0,bg);n.cornerRadius=16;n.primaryAxisAlignItems='CENTER';const t=add(n,text(s,w-20));t.textAlignHorizontal='CENTER';return n;}
function card(title,body){const n=box('卡片 / '+title,358,null,'VERTICAL',16,8,'FFFFFF');n.cornerRadius=24;add(n,text(title,326,18));if(body)add(n,text(body));return n;}
const node=(f,name)=>f.findOne(n=>n.name===name),named=(f,s)=>f.findOne(n=>n.name.includes(s));
let at=sec.children.filter(n=>n.type==='FRAME').length;
function clone(f,name){let n=sec.children.find(n=>n.name===name);if(!n){n=f.clone();sec.appendChild(n);n.name=name;n.x=32+(at%5)*470;n.y=48+Math.floor(at++/5)*940;created.push(n);}for(const x of all(n))unbind(x);return n;}
function rewrite(f,from,to){for(const t of f.findAll(n=>n.type==='TEXT'&&n.characters===from))t.characters=to;}
function scope(f,s='旗山校区'){for(const t of f.findAll(n=>n.type==='TEXT'&&n.name==='变量 / 校区'))t.characters=s;}
function content(f){return node(f,'内容容器 / 自动布局');}
function emptyChildren(n){for(const c of [...n.children])c.remove();}
// 失败的收费动作可能使9个根节点只剩空壳；保留ID、完整重建内容。
function base(f){emptyChildren(f);f.layoutMode='VERTICAL';f.resize(390,844);f.primaryAxisSizingMode=f.counterAxisSizingMode='FIXED';f.paddingLeft=f.paddingRight=f.paddingTop=f.paddingBottom=0;f.itemSpacing=0;fill(f,'F4F5F6');f.clipsContent=true;
const status=node(home,'系统状态栏');if(status)add(f,status.clone());else{const s=add(f,box('系统状态栏',390,42,'HORIZONTAL',16));add(s,text('9:41',358));}
const h=add(f,box('搜索顶栏',390,64,'HORIZONTAL',16,10));h.paddingTop=h.paddingBottom=10;add(h,button('‹',44));const input=add(h,box('搜索输入框',224,44,'HORIZONTAL',10,4,'FFFFFF'));input.cornerRadius=22;const holder=add(input,box('关键词与占位',146,24));add(holder,text('搜索物品名称',146));const q=add(holder,text('',146));q.name='变量 / 关键词';q.visible=false;add(input,button('×',44));add(h,button('搜索',70,'C7EE38'));const disabled=add(h,button('搜索',70,'E2E5E8'));disabled.opacity=.55;
const vp=add(f,box('内容视口 / 纵向滚动',390,844-h.height-f.children[0].height));vp.clipsContent=true;vp.overflowDirection='VERTICAL';const b=add(vp,box('内容容器 / 自动布局',390,null,'VERTICAL',16,12));b.paddingBottom=32;return b;}
function label(p,name,s,w=358,size=14){const t=add(p,text(s,w,size));t.name=name;return t;}
function overlay(f,w,y){emptyChildren(f);f.layoutMode='NONE';f.resize(390,844);fill(f,null);f.clipsContent=true;const shade=figma.createRectangle();shade.name='遮罩 / 关闭当前层';shade.resize(390,844);shade.fills=[{type:'SOLID',color:rgb('252B32'),opacity:.12}];add(f,shade);const s=add(f,box('浮层内容',w,null,'VERTICAL',16,12,'FFFFFF'));s.cornerRadius=24;s.x=w===192?122:0;s.y=y;return s;}
const first=base(old.initial);add(first,text('找找你的校园小物',358,24));add(first,text('先选择物品名称，再点搜索。',358));const recent=add(first,card('最近搜索','点一下填入搜索框，再按搜索。'));
for(const row of [['雨伞','钥匙'],['保温杯','耳机']]){const r=add(recent,box('关键词一行',326,null,'HORIZONTAL',0,10));for(const q of row)add(r,button(q,158,'F4F5F6'));}const range=add(first,card('当前查找范围','当前校区内查找，可在结果页进一步筛选。'));label(range,'变量 / 校区','旗山校区',326);
const loadingBody=base(old.loading);add(loadingBody,card('正在查找…','正在查找当前校区的物品信息。'));label(loadingBody,'变量 / 已检索词','雨伞',358,24);
for(const [f,k,title,items]of [[old.u,'u','找到 2 条雨伞信息',[['浅蓝折叠伞 · 招领','图书馆东侧｜9月26日｜服务点已接收'],['蓝色长柄伞 · 招领','教学区连廊｜9月26日｜伞型不同']]],[old.k,'k','找到 1 条钥匙信息',[['一串银色钥匙 · 招领','教学区连廊｜9月28日｜保管编号 TS-026']]],[old.c,'c','找到 1 条水杯信息',[['黑色保温杯 · 寻物','食堂附近｜9月27日｜失主本人发布']]]]){const b=base(f),r=add(b,box('结果与筛选',358,null,'HORIZONTAL',0,8));label(r,k==='u'?'变量 / 雨伞结果数':'结果数量',title,260,20);add(r,button('筛选',90));label(b,'变量 / 校区','旗山校区');for(const [title,body]of items)add(b,card(title,body));}
const emptyBody=base(old.empty);add(emptyBody,card('暂时没有匹配结果','当前条件下没有匹配信息，可修改名称或重置筛选。'));label(emptyBody,'变量 / 已检索词','耳机',358,24);label(emptyBody,'变量 / 校区','旗山校区');add(emptyBody,button('修改关键词',358,'C7EE38'));add(emptyBody,button('放宽筛选条件'));add(emptyBody,button('去发布寻物'));
const keyboardBody=overlay(old.keyboard,390,474),kr=add(keyboardBody,box('输入标题',358,44,'HORIZONTAL',0,14));add(kr,text('选择物品名称',300,20));add(kr,button('×',44));label(keyboardBody,'变量 / 关键词','选择要查找的物品');add(keyboardBody,text('选择物品名称后再点搜索',358));for(const row of [['雨伞','钥匙'],['保温杯','耳机']]){const r=add(keyboardBody,box('候选词键盘',358,44,'HORIZONTAL',0,12));for(const q of row)add(r,button(q,173,'F4F5F6'));}add(keyboardBody,button('清空输入',358,'F4F5F6'));
const campusBody=overlay(old.campus,192,104);add(campusBody,text('选择校区',160,16));for(const name of ['旗山校区','铜盘校区'])add(campusBody,button(name,160,'F4F5F6'));add(campusBody,text('铜盘暂未覆盖',160));overlay(old.filter,390,338);
const qmap={u:'雨伞',k:'钥匙',c:'保温杯',e:'耳机'},filled={},load={},result={u:old.u,k:old.k,c:old.c,e:old.empty},emptyQ={};
for(const [k,q]of Object.entries(qmap)){filled[k]=clone(old.initial,'P03免费-已输入-'+q);load[k]=k==='u'?old.loading:clone(old.loading,'P03免费-查询中-'+q);emptyQ[k]=k==='e'?old.empty:clone(old.empty,'P03免费-无匹配-'+q);}
const resultFiltered={u:clone(old.u,'P03免费-雨伞-图书馆筛选'),k:clone(old.k,'P03免费-钥匙-教学区筛选'),c:clone(old.c,'P03免费-水杯-食堂筛选')};
const homeFiltered={all:home,u:clone(home,'P01免费-首页-雨伞筛选'),k:clone(home,'P01免费-首页-钥匙筛选'),c:clone(home,'P01免费-首页-水杯筛选')},homeTP=clone(home,'P01免费-首页-铜盘空态');
const campusEmpty=clone(old.empty,'P03免费-搜索-铜盘未覆盖');
const presets={all:['全部','不限','不限','全部校园信息'],u:['雨伞','图书馆','近7天','雨伞 · 图书馆 · 近7天'],k:['钥匙','教学区','今天','钥匙 · 教学区 · 今天'],c:['水杯','食堂','近7天','水杯 · 食堂 · 近7天']};
const filters={};
// 以组合式快捷筛选表达有限状态；选一整组条件，避免暗中丢失独立选项。
for(const context of ['home','u','k','c','e']){filters[context]={};for(const preset of Object.keys(presets)){filters[context][preset]=context==='home'&&preset==='all'?old.filter:clone(old.filter,'覆盖层免费-筛选-'+context+'-'+preset);}}
function iconButton(b,type){if(!b)return;emptyChildren(b);b.primaryAxisAlignItems=b.counterAxisAlignItems='CENTER';b.paddingLeft=b.paddingRight=b.paddingTop=b.paddingBottom=0;const d=type==='back'?'M12.5 5L7.5 10L12.5 15':'M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5';const v=figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#252B32" stroke-width="2" stroke-linecap="round"><path d="${d}"/></svg>`);v.name=type==='back'?'返回 / 矢量箭头':'关闭 / 矢量叉号';b.appendChild(v);}
function header(f,q,k,loading=false){const h=node(f,'搜索顶栏');if(!h)return;const b=h.children[0];iconButton(b,'back');on(b,back);
const input=node(h,'搜索输入框'),holder=node(input,'关键词与占位');holder.clipsContent=true;for(const t of holder.children){if(t.type!=='TEXT')continue;t.visible=t.name==='变量 / 关键词'?!!q:!q;if(t.name==='变量 / 关键词')t.characters=q;}
const x=node(input,'操作 / ×');iconButton(x,'close');x.visible=!!q;on(x,loading||!q?null:nav(old.initial,'SWAP'));on(input,loading?null:nav(old.keyboard,'OVERLAY'));
const buttons=h.children.filter(n=>n.name==='操作 / 搜索');if(buttons[0]){buttons[0].visible=!!q;buttons[0].opacity=loading?.55:1;on(buttons[0],loading?null:nav(load[k]));}if(buttons[1]){buttons[1].visible=!q;on(buttons[1],null);}
}
function landing(f,q='',k='u'){header(f,q,k);scope(f);for(const [key,word]of Object.entries(qmap))on(node(f,'操作 / '+word),f===filled[key]?null:nav(filled[key]));const setup=node(f,'操作 / 设置筛选条件');if(setup)setup.remove();rewrite(f,'输入名称，也可以先选一个关键词。','先选择物品名称，再点搜索。');rewrite(f,'校区与筛选只影响本校信息。','当前校区内查找，可在结果页进一步筛选。');}
landing(old.initial);for(const k of Object.keys(qmap))landing(filled[k],qmap[k],k);
for(const [k,f]of Object.entries(load)){header(f,qmap[k],k,true);scope(f);const t=node(f,'变量 / 已检索词');if(t)t.characters=qmap[k];on(f,nav(result[k],'SWAP'),{type:'AFTER_TIMEOUT',timeout:0.5});}
function filterEntry(f,k,preset='all'){const b=node(f,'操作 / 筛选');if(b){const t=b.findOne(n=>n.type==='TEXT');if(t)t.characters=preset==='all'?'筛选':'已筛选';on(b,nav(filters[k][preset],'OVERLAY'));}}
function resultPage(f,k,preset='all'){header(f,qmap[k],k);scope(f);filterEntry(f,k,preset);const a=node(f,'卡片 / 浅蓝折叠伞 · 招领'),b=node(f,'卡片 / 蓝色长柄伞 · 招领');if(a){a.visible=true;on(a,nav(detail.u));}if(b){b.visible=preset==='all';on(b,nav(detail.other));}const count=node(f,'变量 / 雨伞结果数');if(count)count.characters=preset==='all'?'找到 2 条雨伞信息':'找到 1 条雨伞信息';on(node(f,'卡片 / 一串银色钥匙 · 招领'),nav(detail.k));on(node(f,'卡片 / 黑色保温杯 · 寻物'),nav(detail.c));}
for(const k of ['u','k','c']){resultPage(result[k],k);resultPage(resultFiltered[k],k,k);}
function noResults(f,k){header(f,qmap[k],k);scope(f);const t=node(f,'变量 / 已检索词');if(t)t.characters=qmap[k];rewrite(f,'保留这些条件，换个关键词或放宽范围试试。','当前条件下没有匹配信息，可修改名称或重置筛选。');on(node(f,'操作 / 修改关键词'),nav(old.keyboard,'OVERLAY'));on(node(f,'操作 / 放宽筛选条件'),nav(filters[k].all,'OVERLAY'));on(node(f,'操作 / 去发布寻物'),nav(publish));}
for(const k of Object.keys(qmap))noResults(emptyQ[k],k);
// 搜索输入以可点击关键词构成；不保留声称可自由输入的文字或键盘反应。
const ks=node(old.keyboard,'浮层内容');const kt=node(ks,'变量 / 关键词');if(kt)kt.characters='选择要查找的物品';rewrite(old.keyboard,'支持英文输入，也可选常用词','选择物品名称后再点搜索');rewrite(old.keyboard,'输入物品名称','选择物品名称');iconButton(node(ks,'操作 / ×'),'close');
on(old.keyboard,null);on(node(old.keyboard,'遮罩 / 关闭当前层'),close);on(node(ks,'操作 / ×'),close);for(const [k,q]of Object.entries(qmap))on(node(ks,'操作 / '+q),nav(filled[k]));on(node(ks,'操作 / 清空输入'),nav(old.initial));
function configureHome(f,preset='all',tp=false){for(const n of all(f))unbind(n);const feed=node(f,'双列信息流');let blank=node(f,'首页空态 / 校区与筛选');if(!blank){blank=card('这里还没有消息','');blank.name='首页空态 / 校区与筛选';label(blank,'变量 / 空态原因','铜盘校区暂未覆盖，切换校区或稍后再来。',326);feed.parent.insertChild(feed.parent.children.indexOf(feed)+1,blank);}feed.visible=!tp;blank.visible=tp;const reason=node(blank,'变量 / 空态原因');if(reason)reason.characters='铜盘校区暂未覆盖，切换校区或稍后再来。';
const service=node(f,'物品卡 / 一份顺手的善意');if(service)service.remove();const tabs=node(f,'信息类型切换');if(tabs)tabs.remove();
for(const c of f.findAll(n=>n.type==='FRAME'&&n.name.startsWith('物品卡 / '))){const k=c.name.includes('伞')?'u':c.name.includes('钥匙')?'k':c.name.includes('杯')?'c':null;c.visible=!!k&&(preset==='all'||preset===k);if(k)on(c,nav(detail[k]));}
for(const col of feed.children)col.visible=col.children.some(c=>c.visible);feed.primaryAxisAlignItems='CENTER';
const campus=named(f,'校区选择 /'),search=named(f,'搜索入口 /'),filter=named(f,'筛选入口 /');if(campus){const t=campus.findOne(n=>n.type==='TEXT');if(t){t.characters=tp?'铜盘校区':'旗山校区';t.textAutoResize='WIDTH_AND_HEIGHT';}on(campus,nav(old.campus,'OVERLAY'));}on(search,nav(tp?campusEmpty:old.initial));
if(filter){const t=filter.findOne(n=>n.type==='TEXT');if(t){t.characters=preset==='all'?'筛选':'已筛选';t.fontSize=14;t.lineHeight={unit:'PIXELS',value:20};t.textAutoResize='WIDTH_AND_HEIGHT';}filter.itemSpacing=6;filter.primaryAxisAlignItems='CENTER';on(filter,tp?nav(old.campus,'OVERLAY'):nav(filters.home[preset],'OVERLAY'));}
const mine=awaitNode('16:8778');for(const b of f.findAll(n=>n.type==='FRAME'&&(n.name.includes('导航项 /')||n.name.includes('独立圆形按钮')))){const tx=b.findOne(n=>n.type==='TEXT');if(b.name.includes('发布')||b.name.includes('独立圆形按钮'))on(b,nav(publish));else if(tx?.characters==='我的'&&mine)on(b,nav(mine));else if(tx?.characters==='首页')on(b,f===home?null:nav(home));}
}
const nodeCache=new Map();for(const id of ['16:8778'])nodeCache.set(id,await figma.getNodeByIdAsync(id));function awaitNode(id){return nodeCache.get(id);}
for(const [k,f]of Object.entries(homeFiltered))configureHome(f,k);configureHome(homeTP,'all',true);
// 铜盘没有伪造搜索结果；提供独立范围空态和切换入口。
header(campusEmpty,'','u');const ce=content(campusEmpty);emptyChildren(ce);add(ce,card('铜盘校区暂未覆盖','当前校区还没有可搜索的信息，可以切换到旗山校区查看。'));on(add(ce,button('选择校区',358,'C7EE38')),nav(old.campus,'OVERLAY'));const ch=node(campusEmpty,'搜索输入框');on(ch,null);
const cs=node(old.campus,'浮层内容');on(node(old.campus,'遮罩 / 关闭当前层'),close);on(node(cs,'操作 / 旗山校区'),nav(home));on(node(cs,'操作 / 铜盘校区'),nav(homeTP));
for(const [context,states]of Object.entries(filters))for(const [preset,f]of Object.entries(states)){
const sheet=node(f,'浮层内容');emptyChildren(sheet);sheet.y=338;sheet.paddingLeft=sheet.paddingRight=16;sheet.itemSpacing=10;
const title=add(sheet,box('筛选标题',358,44,'HORIZONTAL',0,14));add(title,text('快捷筛选',300,20));const x=add(title,button('关闭',44));iconButton(x,'close');on(x,close);on(node(f,'遮罩 / 关闭当前层'),close);
add(sheet,text('选择一组类别、区域和时间',358));for(const [k,v]of Object.entries(presets)){const b=add(sheet,button((k===preset?'✓ ':'')+v[3],358,k===preset?'C7EE38':'F4F5F6'));on(b,k===preset?null:nav(states[k],'SWAP'));}
add(sheet,text('当前：'+presets[preset].slice(0,3).join(' / '),358));const r=add(sheet,box('筛选操作',358,44,'HORIZONTAL',0,12));on(add(r,button('重置',112,'F4F5F6')),preset==='all'?null:nav(states.all,'SWAP'));
const target=context==='home'?homeFiltered[preset]:preset==='all'?result[context]:preset===context?resultFiltered[context]:emptyQ[context];on(add(r,button('应用筛选',234,'C7EE38')),nav(target));
}
for(const d of Object.values(detail)){const h=node(d,'顶部导航');if(h)on(h.children[0],back);on(node(d,'操作 / 返回原搜索'),back);}
// 恢复首页原本其他入口与底栏。只替换搜索，不改业务状态详情。
for(const f of [home,...Object.values(homeFiltered).filter(f=>f!==home),homeTP]){
const navRoot=f.findOne(n=>n.name.startsWith('底部安全区 / '));if(navRoot){for(const b of navRoot.findAll(n=>n.type==='FRAME')){const own=b.children.find(n=>n.type==='TEXT');if(own?.characters==='我的')on(b,nav(nodeCache.get('16:8778')));if(own?.characters==='首页')on(b,f===home?null:nav(home));if(b.name.includes('发布 / 独立圆形按钮'))on(b,nav(publish));}}
}
const legacy=[find('P03-搜索-相似雨伞'),find('P03-搜索-无结果')].filter(Boolean).map(n=>n.id);
const sectionIds=new Set(all(sec).map(n=>n.id));for(const n of p.findAll(n=>'reactions'in n&&n.reactions.length&&!sectionIds.has(n.id)&&!touched.has(n.id))){for(const r of n.reactions){const a=r.actions&&r.actions[0];if(a?.type==='NODE'&&legacy.includes(a.destinationId)){if(n.name.includes('返回原搜索'))on(n,back);else on(n,nav(n.name.includes('相似')?filled.u:old.initial));}}}
await Promise.all(jobs);sec.resizeWithoutConstraints(2410,Math.max(2040,Math.ceil(at/5)*940+80));const s9=p.children.find(n=>n.type==='SECTION'&&n.name.startsWith('09 ·')),s10=p.children.find(n=>n.type==='SECTION'&&n.name.startsWith('10 ·'));if(s9)s9.y=sec.y+sec.height+140;if(s10)s10.y=(s9?s9.y+s9.height:sec.y+sec.height)+140;p.setPluginData(key,'complete');p.setPluginData('shiban.search.v2','free-repaired');
console.log(JSON.stringify({revision:key,frames:sec.children.filter(n=>n.type==='FRAME').length,created:created.length,reactions:jobs.length,limits:'关键词选择与四组快捷筛选；无自由输入、变量或条件动作'}));figma.notify('免费版搜索已修复：4关键词、正确结果、铜盘空态与可取消的快捷筛选',{timeout:12000});
})().catch(e=>{console.error(e);figma.notify('免费版搜索修复中断：'+String(e),{error:true,timeout:15000});});
