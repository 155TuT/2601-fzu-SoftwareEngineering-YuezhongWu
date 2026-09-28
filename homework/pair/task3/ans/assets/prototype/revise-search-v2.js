// 拾伴 v2：搜索、校区与筛选；在现有文件运行，不删除旧画板。
(async()=>{
const P=figma.currentPage,K='shiban.search.v2';
if(P.getPluginData(K)==='complete'){figma.notify('搜索 v2 已存在，无需重复运行');return;}
if(P.findOne(n=>n.type==='SECTION'&&n.name==='08 · 搜索与筛选 v2'))throw Error('发现未完成的搜索 v2，请定点修复，避免重复创建');
const home=await figma.getNodeByIdAsync('16:8524'),publish=await figma.getNodeByIdAsync('16:8931');
if(!home||!publish)throw Error('找不到首页或发布入口');
const find=s=>P.findOne(n=>n.type==='FRAME'&&n.name===s);
const dest={umbrella:find('P04-招领详情-蓝伞'),other:find('P04-招领详情-另一候选'),keys:find('P04-招领详情-银色钥匙'),cup:find('P04-寻物详情-黑色保温杯')};
if(Object.values(dest).some(x=>!x))throw Error('缺少对应物品详情，停止创建');
const hooks={campus:home.findOne(n=>n.name==='校区选择 / 下拉按钮'),search:home.findOne(n=>n.name==='搜索入口 / 圆形按钮'),filter:home.findOne(n=>n.name.startsWith('筛选入口 /')),feed:home.findOne(n=>n.name==='双列信息流')};
if(Object.values(hooks).some(x=>!x))throw Error('请先运行首页布局 v2，保留校区、搜索、筛选和信息流节点');
const fonts=await figma.listAvailableFontsAsync(),sample=home.findOne(n=>n.type==='TEXT'&&n.fontName!==figma.mixed);
const family=sample.fontName.family,styles=fonts.filter(f=>f.fontName.family===family).map(f=>f.fontName.style);
const regular=styles.includes('Regular')?'Regular':sample.fontName.style,bold=styles.includes('Bold')?'Bold':regular;
await Promise.all([figma.loadFontAsync({family,style:regular}),figma.loadFontAsync({family,style:bold})]);
const C={ink:'252B32',muted:'707780',bg:'F4F5F6',white:'FFFFFF',lime:'C7EE38',line:'E2E5E8',soft:'E9F4CC',blue:'D9ECFC'};
const rgb=h=>({r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255});
const fill=(n,k)=>n.fills=k?[{type:'SOLID',color:rgb(C[k]||k)}]:[];
const add=(p,n)=>(p.appendChild(n),n),jobs=[],touched=new Set();
function F(name,w,h=null,dir='VERTICAL',pad=0,gap=0,color=null){const n=figma.createFrame();n.name=name;n.resize(w,h||1);n.layoutMode=dir;n.primaryAxisSizingMode=dir==='HORIZONTAL'?'FIXED':h?'FIXED':'AUTO';n.counterAxisSizingMode=dir==='HORIZONTAL'?(h?'FIXED':'AUTO'):'FIXED';n.paddingLeft=n.paddingRight=n.paddingTop=n.paddingBottom=pad;n.itemSpacing=gap;n.clipsContent=false;fill(n,color);if(dir==='HORIZONTAL')n.counterAxisAlignItems='CENTER';return n;}
function T(s,w=326,size=14,strong=false,color='ink'){const n=figma.createText();n.name=s||'关键词';n.fontName={family,style:strong?bold:regular};n.fontSize=size;n.lineHeight={unit:'PIXELS',value:Math.round(size*1.5)};n.characters=s;n.resize(w,Math.round(size*1.5));n.textAutoResize='HEIGHT';fill(n,color);return n;}
function B(s,w=358,color='white'){const n=F('操作 / '+s,w,44,'HORIZONTAL',10,0,color);n.cornerRadius=16;n.primaryAxisAlignItems='CENTER';if(s==='‹'||s==='×'){const d=s==='‹'?'M12.5 5L7.5 10L12.5 15':'M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5';const v=add(n,figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#252B32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`));v.name=s==='‹'?'返回 / 矢量箭头':'关闭 / 矢量叉号';}else{const t=add(n,T(s,w-20,14,true));t.textAlignHorizontal='CENTER';}return n;}
function card(title,body,color='white'){const n=F('卡片 / '+title,358,null,'VERTICAL',16,8,color);n.cornerRadius=24;add(n,T(title,326,18,true));if(body)add(n,T(body));return n;}
const sec=figma.createSection();sec.name='08 · 搜索与筛选 v2';sec.resizeWithoutConstraints(2410,2040);sec.x=2600;sec.y=1300;
const collection=figma.variables.createVariableCollection('拾伴 / 搜索与筛选 v2'),mode=collection.defaultModeId,V={};
function variable(key,value){const type=typeof value==='boolean'?'BOOLEAN':'STRING';const v=figma.variables.createVariable(key,collection,type);v.setValueForMode(mode,value);V[key]=v;return v;}
['关键词','已检索词'].forEach(k=>variable(k,''));
variable('有关键词',false);variable('无关键词',true);variable('校区','旗山校区');
for(const [k,v]of [['类别','全部'],['区域','不限'],['时间','不限']]){variable(k,v);variable('草稿'+k,v);}
variable('筛选来源','home');variable('筛选标签','筛选');variable('空态原因','当前条件下还没有消息');
for(const k of ['雨伞可见','钥匙可见','水杯可见','服务卡可见','信息流可见','伞A结果可见','伞B结果可见'])variable(k,true);
variable('首页空态',false);variable('雨伞结果数','找到 2 条雨伞信息');
const lit=x=>({type:typeof x==='boolean'?'BOOLEAN':'STRING',resolvedType:typeof x==='boolean'?'BOOLEAN':'STRING',value:x});
const alias=k=>({type:'VARIABLE_ALIAS',resolvedType:V[k].resolvedType,value:{type:'VARIABLE_ALIAS',id:V[k].id}});
const ex=(fn,...args)=>({type:'EXPRESSION',resolvedType:'BOOLEAN',value:{expressionFunction:fn,expressionArguments:args}});
const eq=(k,v)=>ex('EQUALS',alias(k),lit(v)),and=(...a)=>ex('AND',...a),or=(...a)=>ex('OR',...a);
const set=(k,v)=>({type:'SET_VARIABLE',variableId:V[k].id,variableValue:v&&v.type?v:lit(v)});
const when=(c,yes,no=[])=>({type:'CONDITIONAL',conditionalBlocks:[{condition:c,actions:yes},{actions:no}]});
const back={type:'BACK'},close={type:'CLOSE'};
const nav=(n,how='NAVIGATE')=>({type:'NODE',destinationId:n.id,navigation:how,transition:null,resetScrollPosition:true});
function on(n,actions,trigger={type:'ON_CLICK'}){touched.add(n.id);jobs.push(n.setReactionsAsync([{trigger,actions}]));}
function bound(p,k,w=326,size=14,strong=false){const t=add(p,T(String(V[k].valuesByMode[mode]),w,size,strong));t.name='变量 / '+k;t.setBoundVariable('characters',V[k]);return t;}
const qActions=q=>[set('关键词',q),set('有关键词',q!==''),set('无关键词',q==='')];
const spec=[['雨伞','招领','图书馆',false],['钥匙','招领','教学区',true],['水杯','寻物','食堂',false]];
function matches(c,a,t){return and(eq('校区','旗山校区'),or(eq('类别','全部'),eq('类别',c)),or(eq('区域','不限'),eq('区域',a)),t?lit(true):ex('NOT',eq('时间','今天')));}
function refresh(){const a=spec.map(([c,type,area,today])=>set(c+'可见',matches(c,area,today)));
a.push(set('服务卡可见',false));
a.push(set('信息流可见',or(alias('雨伞可见'),alias('钥匙可见'),alias('水杯可见'))),set('首页空态',ex('NOT',alias('信息流可见'))));
a.push(when(eq('校区','铜盘校区'),[set('空态原因','铜盘校区暂未覆盖，切换校区或稍后再来。')],[set('空态原因','当前条件下还没有消息，可以放宽筛选。')]));
a.push(when(and(eq('类别','全部'),eq('区域','不限'),eq('时间','不限')),[set('筛选标签','筛选')],[set('筛选标签','已筛选')]));
return a;}
let at=0;const created=[];
function root(name,overlay=false){const n=overlay?figma.createFrame():F(name,390,844,'VERTICAL',0,0,'bg');n.name=name;if(overlay){n.resize(390,844);fill(n,null);n.clipsContent=true;}sec.appendChild(n);n.x=32+(at%5)*470;n.y=48+Math.floor(at++/5)*940;created.push(n);if(!overlay){const status=home.findOne(x=>x.name==='系统状态栏');if(status)add(n,status.clone());}return n;}
const landing=root('P03v2-搜索-初始与输入'),loading=root('P03v2-搜索-查询中');
const resultU=root('P03v2-搜索-雨伞结果'),resultK=root('P03v2-搜索-钥匙结果'),resultC=root('P03v2-搜索-水杯结果'),empty=root('P03v2-搜索-无匹配');
const keyboard=root('覆盖层-搜索输入',true),campus=root('覆盖层-校区下拉',true),filters=root('覆盖层-筛选草稿',true);
function overlaySheet(n,w,y,pad=16){const shade=figma.createRectangle();shade.name='遮罩 / 关闭当前层';shade.resize(390,844);shade.fills=[{type:'SOLID',color:rgb('252B32'),opacity:.12}];add(n,shade);on(shade,[close]);const s=F('浮层内容',w,null,'VERTICAL',pad,12,'white');s.cornerRadius=24;add(n,s);s.x=w===192?122:0;s.y=y;return s;}
const open=n=>nav(n,'OVERLAY');
function openFilters(n,origin){on(n,[set('筛选来源',origin),set('草稿类别',alias('类别')),set('草稿区域',alias('区域')),set('草稿时间',alias('时间')),open(filters)]);}
const searchActions=[set('已检索词',alias('关键词')),nav(loading)];
function header(n){const r=add(n,F('搜索顶栏',390,64,'HORIZONTAL',16,10));r.paddingTop=r.paddingBottom=10;const b=add(r,B('‹',44));on(b,[back]);
const field=add(r,F('搜索输入框',224,44,'HORIZONTAL',10,4,'white'));field.cornerRadius=22;const qs=F('关键词与占位',146,24,'VERTICAL');add(field,qs);
const placeholder=add(qs,T('搜索物品名称',146,14,false,'muted'));placeholder.setBoundVariable('visible',V['无关键词']);
const text=bound(qs,'关键词',146);text.setBoundVariable('visible',V['有关键词']);if(n!==loading)on(field,[open(keyboard)]);
const clear=add(field,B('×',44));if(n!==loading)on(clear,qActions(''));
const enabled=add(r,B('搜索',70,'lime'));enabled.setBoundVariable('visible',V['有关键词']);if(n!==loading)on(enabled,searchActions);else enabled.opacity=.55;
const disabled=add(r,B('搜索',70,'line'));disabled.opacity=.55;disabled.setBoundVariable('visible',V['无关键词']);return r;}
function body(n){const vp=add(n,F('内容视口 / 纵向滚动',390,738));vp.clipsContent=true;vp.overflowDirection='VERTICAL';const b=add(vp,F('内容容器 / 自动布局',390,null,'VERTICAL',16,12));b.paddingBottom=32;return b;}
for(const n of [landing,loading,resultU,resultK,resultC,empty])header(n);
const lb=body(landing);add(lb,T('找找你的校园小物',358,24,true));add(lb,T('输入名称，也可以先选一个关键词。',358,14,false,'muted'));
const recent=add(lb,card('最近搜索','点一下填入搜索框，再按搜索。'));
const choices=['雨伞','钥匙','保温杯','耳机'];
for(let i=0;i<2;i++){const r=add(recent,F('关键词一行',326,null,'HORIZONTAL',0,10));for(const q of choices.slice(i*2,i*2+2)){const b=add(r,B(q,158,'bg'));on(b,qActions(q));}}
const scope=add(lb,card('当前查找范围','校区与筛选只影响本校信息。'));bound(scope,'校区');const lf=add(scope,B('设置筛选条件',326,'soft'));openFilters(lf,'landing');
const kb=overlaySheet(keyboard,390,474);const kr=add(kb,F('输入标题',358,null,'HORIZONTAL',0,14));add(kr,T('输入物品名称',300,20,true));on(add(kr,B('×',44)),[close]);bound(kb,'关键词',358,24,true);
add(kb,T('支持英文输入，也可选常用词',358,14,false,'muted'));
for(let i=0;i<2;i++){const r=add(kb,F('候选词键盘',358,null,'HORIZONTAL',0,12));for(const q of choices.slice(i*2,i*2+2)){const b=add(r,B(q,173,'bg'));on(b,[...qActions(q),close]);}}
on(add(kb,B('清空输入',358,'bg')),[...qActions(''),close]);
const keys=Array.from({length:26},(_,i)=>({trigger:{type:'ON_KEY_DOWN',device:'KEYBOARD',keyCodes:[65+i]},actions:[set('关键词',{type:'EXPRESSION',resolvedType:'STRING',value:{expressionFunction:'ADDITION',expressionArguments:[alias('关键词'),lit(String.fromCharCode(97+i))]}}),set('有关键词',true),set('无关键词',false)]}));
// 输入原型支持 a-z 追加；Backspace 清空整段，Enter/Escape 收起输入层。
for(const code of [8,13,27])keys.push({trigger:{type:'ON_KEY_DOWN',device:'KEYBOARD',keyCodes:[code]},actions:code===8?qActions(''):[close]});jobs.push(keyboard.setReactionsAsync(keys));
const loadBody=body(loading);add(loadBody,card('正在查找…','正在按名称、校区和筛选条件查找物品。','soft'));bound(loadBody,'已检索词',358,24,true);
const conditionQ=(q,c,a,t)=>and(eq('关键词',q),matches(c,a,t));
on(loading,[set('伞A结果可见',matches('雨伞','图书馆',false)),set('伞B结果可见',matches('雨伞','教学区',false)),when(and(alias('伞A结果可见'),alias('伞B结果可见')),[set('雨伞结果数','找到 2 条雨伞信息')],[set('雨伞结果数','找到 1 条雨伞信息')]),when(and(eq('关键词','雨伞'),or(alias('伞A结果可见'),alias('伞B结果可见'))),[nav(resultU,'SWAP')],[when(conditionQ('钥匙','钥匙','教学区',true),[nav(resultK,'SWAP')],[when(conditionQ('保温杯','水杯','食堂',false),[nav(resultC,'SWAP')],[nav(empty,'SWAP')])])])],{type:'AFTER_TIMEOUT',timeout:500});
function result(n,title,items){const b=body(n);const r=add(b,F('结果与筛选',358,null,'HORIZONTAL',0,8));if(n===resultU)bound(r,'雨伞结果数',260,20,true);else add(r,T(title,260,20,true));const f=add(r,B('筛选',90,'white'));openFilters(f,'results');bound(b,'校区',358);for(const [t,d,id,key]of items){const c=add(b,card(t,d));if(key)c.setBoundVariable('visible',V[key]);on(c,[nav(id)]);}return b;}
result(resultU,'找到 2 条雨伞信息',[['浅蓝折叠伞 · 招领','图书馆东侧｜9月26日｜服务点已接收',dest.umbrella,'伞A结果可见'],['蓝色长柄伞 · 招领','教学区连廊｜9月26日｜颜色相近，伞型不同',dest.other,'伞B结果可见']]);
result(resultK,'找到 1 条钥匙信息',[['一串银色钥匙 · 招领','教学区连廊｜9月28日｜保管编号 TS-026',dest.keys]]);
result(resultC,'找到 1 条水杯信息',[['黑色保温杯 · 寻物','食堂附近｜9月27日｜失主本人发布',dest.cup]]);
const eb=body(empty);add(eb,card('暂时没有匹配结果','保留这些条件，换个关键词或放宽范围试试。'));bound(eb,'已检索词',358,24,true);bound(eb,'校区',358);on(add(eb,B('修改关键词',358,'lime')),[open(keyboard)]);openFilters(add(eb,B('放宽筛选条件',358,'white')),'results');on(add(eb,B('去发布寻物',358,'white')),[nav(publish)]);
const cb=overlaySheet(campus,192,104);add(cb,T('选择校区',160,16,true));for(const name of ['旗山校区','铜盘校区']){const b=add(cb,B(name,160,'bg'));on(b,[set('校区',name),...refresh(),close]);}add(cb,T('铜盘暂未覆盖',160,14,false,'muted'));
const fb=overlaySheet(filters,390,338);const fh=add(fb,F('筛选标题',358,null,'HORIZONTAL',0,14));add(fh,T('筛选信息',300,20,true));on(add(fh,B('×',44)),[close]);
for(const [key,values]of [['类别',['全部','雨伞','钥匙','水杯']],['区域',['不限','图书馆','教学区','食堂']],['时间',['不限','今天','近7天']]]){
const r=add(fb,F('草稿 / '+key,358,null,'HORIZONTAL',0,12));add(r,T(key,70,14,true));bound(r,'草稿'+key,270);
const options=add(fb,F(key+'选项',358,null,'HORIZONTAL',0,10));const w=(358-10*(values.length-1))/values.length;
for(const v of values){const b=add(options,B(v,w,'bg'));on(b,[set('草稿'+key,v)]);}}
const fa=add(fb,F('筛选操作',358,null,'HORIZONTAL',0,12));on(add(fa,B('重置',112,'bg')),[set('草稿类别','全部'),set('草稿区域','不限'),set('草稿时间','不限')]);
on(add(fa,B('应用筛选',234,'lime')),[set('类别',alias('草稿类别')),set('区域',alias('草稿区域')),set('时间',alias('草稿时间')),...refresh(),when(eq('筛选来源','results'),[close,nav(loading,'SWAP')],[close])]);
const campusText=hooks.campus.findOne(n=>n.type==='TEXT'&&n.characters.includes('校区'));if(campusText)campusText.setBoundVariable('characters',V['校区']);on(hooks.campus,[open(campus)]);on(hooks.search,[nav(landing)]);openFilters(hooks.filter,'home');
const filterText=hooks.filter.findOne(n=>n.type==='TEXT');if(filterText){filterText.setBoundVariable('characters',V['筛选标签']);filterText.fontSize=14;filterText.lineHeight={unit:'PIXELS',value:20};filterText.textAutoResize='WIDTH_AND_HEIGHT';}hooks.filter.itemSpacing=6;hooks.filter.primaryAxisAlignItems='CENTER';
hooks.feed.setBoundVariable('visible',V['信息流可见']);
const service=home.findOne(n=>n.name==='物品卡 / 一份顺手的善意');if(service)service.remove();V['服务卡可见'].setValueForMode(mode,false);
const hc=home.findAll(n=>n.type==='FRAME'&&n.name.startsWith('物品卡 / '));for(const c of hc){const key=c.name.includes('伞')?'雨伞可见':c.name.includes('钥匙')?'钥匙可见':c.name.includes('杯')?'水杯可见':'服务卡可见';c.setBoundVariable('visible',V[key]);}
const he=card('这里还没有消息','');he.name='首页空态 / 校区与筛选';bound(he,'空态原因');he.setBoundVariable('visible',V['首页空态']);const fp=hooks.feed.parent;fp.insertChild(fp.children.indexOf(hooks.feed)+1,he);
const tabs=home.findOne(n=>n.name==='信息类型切换');if(tabs)tabs.remove();
for(const d of Object.values(dest)){const h=d.findOne(n=>n.name==='顶部导航');const button=h&&h.children[0];if(button)on(button,[back]);}
const oldSearch=find('P03-搜索-相似雨伞'),oldEmpty=find('P03-搜索-无结果');
const newIds=new Set(created.map(n=>n.id));function inNew(n){for(let p=n;p;p=p.parent)if(newIds.has(p.id))return true;return false;}
for(const n of P.findAll(n=>'reactions'in n&&!touched.has(n.id)&&!inNew(n))){
if(!n.reactions||!n.reactions.length)continue;let changed=false;const rr=n.reactions.map(r=>({...r,actions:(r.actions||[]).flatMap(a=>{if(a.type==='NODE'&&(a.destinationId===oldSearch?.id||a.destinationId===oldEmpty?.id)){changed=true;if(n.name.includes('返回原搜索'))return [back];if(n.name.includes('相似'))return [...qActions('雨伞'),set('校区','旗山校区'),set('类别','雨伞'),set('区域','不限'),set('时间','近7天'),...refresh(),set('已检索词','雨伞'),nav(loading)];return [nav(landing)];}return [a];})}));if(changed)jobs.push(n.setReactionsAsync(rr));}
await Promise.all(jobs);P.setPluginData(K,'complete');P.setPluginData(K+'.ids',JSON.stringify(Object.fromEntries(created.map(n=>[n.name,n.id]))));
figma.notify('搜索 v2 已完成：输入、加载、3类结果、空态、校区和筛选；请选择关键词后搜索',{timeout:10000});console.log(JSON.stringify({frames:created.map(n=>({name:n.name,id:n.id})),variables:Object.keys(V).length,reactions:jobs.length}));
})().catch(e=>figma.notify('搜索 v2 中断：'+e.message,{error:true,timeout:15000}));

