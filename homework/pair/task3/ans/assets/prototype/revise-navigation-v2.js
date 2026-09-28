(async()=>{
const p=figma.currentPage,K='shiban-navigation-v2';
if(p.getPluginData(K)==='done-stateful'){figma.notify('已应用');return;}
const names={clue:'P06-协助-提供线索',detail:'P04-招领详情-蓝伞',keys:'P04-招领详情-银色钥匙',report:'P07-争议-举报索款',mine:'P05-我的-事项总览',info:'P09-服务点-公开信息',link:'P06-水杯-关联候选线索',login:'E04-身份-访客认领',other:'P04-招领详情-另一候选',wait:'P07-核验-待补证',pass:'P07-核验-通过',appointment:'P07-交接-预约',booked:'P07-交接-已预约待到点',handoff:'P07-交接-待确认',complete:'P07-交接-已核实完成',pending:'P09-服务点-接收确认',received:'P09-服务点-钥匙已接收',auth:'P07-联系-限定授权已开启',revoked:'P07-联系-授权已关闭'};
const R={};for(const [k,v]of Object.entries(names))R[k]=p.findOne(n=>n.type==='FRAME'&&n.name===v);
for(const k of Object.keys(names))if(!R[k])throw Error(k);
const ts=p.findAll(n=>n.type==='TEXT'),fs=new Map();for(const t of ts)for(const f of(t.fontName===figma.mixed?t.getRangeAllFontNames(0,t.characters.length):[t.fontName]))fs.set(JSON.stringify(f),f);
await Promise.all([...fs.values()].map(f=>figma.loadFontAsync(f)));
const record=n=>{const s=n.findAll(t=>t.type==='TEXT').map(t=>t.characters).join(' '),m=s.match(/XB-\d+/);if(!m)throw Error('缺少事项编号 '+n.name);return m[0];},blue=record(R.detail),keys=record(R.keys);
const direct=(n,s)=>n.children.find(c=>c.name===s),empty=n=>[...n.children].forEach(c=>c.remove());
const B={type:'BACK'},go=(n,nav='NAVIGATE')=>({type:'NODE',destinationId:n.id,navigation:nav,transition:{type:'DISSOLVE',duration:.18,easing:{type:'EASE_OUT'}},resetScrollPosition:true});
const act=async(n,a)=>n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:Array.isArray(a)?a:[a]}]);
let collection=p.getPluginData(K+'-collection');collection=collection?await figma.variables.getVariableCollectionByIdAsync(collection):null;
if(!collection){collection=figma.variables.createVariableCollection('拾伴 / 原型事项状态');p.setPluginData(K+'-collection',collection.id);}
const existing=await Promise.all(collection.variableIds.map(id=>figma.variables.getVariableByIdAsync(id)));
async function bool(name,value){let v=existing.find(v=>v&&v.name===name);if(!v)v=figma.variables.createVariable(name,collection,'BOOLEAN');v.setValueForMode(collection.defaultModeId,value);return v;}
const keySent=await bool('协助 / 钥匙线索已提交',false),blueSent=await bool('协助 / 蓝伞线索已提交',false),unread=await bool('提醒 / 未读消息',true);
const set=(v,value)=>({type:'SET_VARIABLE',variableId:v.id,variableValue:{type:'BOOLEAN',resolvedType:'BOOLEAN',value}});
const label=(n,s)=>{n.name='操作 / '+s;const t=n.type==='TEXT'?n:n.findOne(x=>x.type==='TEXT');if(t){t.characters=s;t.name=s;}};
const findButton=(r,s)=>r.findOne(n=>n.name==='操作 / '+s);
for(const [r,old,s]of[[R.info,'返回服务点列表','返回上一页'],[R.link,'返回候选比较','返回上一页'],[R.login,'取消并继续浏览','取消并继续浏览'],[R.other,'返回原搜索','返回原搜索']]){const b=findButton(r,old)||findButton(r,s);if(!b)throw Error('未找到返回 '+old);label(b,s);await act(b,B);}
let sec=p.children.find(n=>n.getPluginData(K)==='section');if(sec)sec.remove();
sec=figma.createSection();sec.name='09 · 业务回执与协助记录';sec.setPluginData(K,'section');sec.resizeWithoutConstraints(2430,940);sec.x=2600;sec.y=Math.max(...p.children.filter(n=>n!==sec&&n.type==='SECTION'&&n.x>=2500).map(n=>n.y+n.height),3460)+140;
const plain=ts.find(t=>t.fontSize===14&&t.fontName!==figma.mixed),strong=ts.find(t=>t.fontSize===18&&t.fontName!==figma.mixed);
function text(s,size=14){const t=(size===14?plain:strong).clone();t.characters=s;t.name=s.slice(0,24);t.fontSize=size;t.lineHeight={unit:'PIXELS',value:Math.round(size*1.5)};t.resize(326,Math.round(size*1.5));t.textAutoResize='HEIGHT';return t;}
function card(title,body){const n=figma.createFrame();n.name='卡片 / '+title;n.resize(358,1);n.layoutMode='VERTICAL';n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';n.paddingTop=n.paddingBottom=n.paddingLeft=n.paddingRight=16;n.itemSpacing=8;n.cornerRadius=24;n.clipsContent=false;n.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];n.appendChild(text(title,18));n.appendChild(text(body));return n;}
const template=R.clue,footTemplate=direct(template,'底部操作区 / 固定可达'),buttonTemplates=footTemplate.children;
const created=[];
async function screen(name,title,sub,blocks){const n=template.clone();sec.appendChild(n);n.name=name;n.x=32+created.length*470;n.y=48;created.push(n);for(const d of[n,...n.findAll(()=>true)])if('reactions'in d&&d.reactions.length)await d.setReactionsAsync([]);
const header=direct(n,'顶部导航');await act(header.children[0],B);const ht=header.children.find(c=>c.type==='TEXT');ht.characters=title;ht.textAlignHorizontal='CENTER';ht.resize(250,24);
const view=direct(n,'内容视口 / 纵向滚动'),body=view.children[0];empty(body);const head=card(title,sub);head.name='事项标题';head.fills=[];body.appendChild(head);for(const b of blocks)body.appendChild(card(...b));
const foot=direct(n,'底部操作区 / 固定可达');empty(foot);return{n,body,view,foot};}
async function buttons(s,items){const h=28+items.length*56;s.foot.resize(390,h);s.foot.primaryAxisSizingMode='FIXED';s.foot.counterAxisSizingMode='FIXED';s.view.resize(390,844-42-64-h);s.view.primaryAxisSizingMode='FIXED';s.view.counterAxisSizingMode='FIXED';for(let i=0;i<items.length;i++){const b=buttonTemplates[Math.min(i,buttonTemplates.length-1)].clone();s.foot.appendChild(b);b.resize(358,48);label(b,items[i][0]);await act(b,items[i][1]);}}
const report=await screen('P07-举报-受理回执','举报已受理',blue+' · 蓝伞事项 · 等待核查',[['材料已收到','等待核对，不代表违规成立。'],['处理进度','受理完成 → 核查中；结果将在此更新。'],['现在可以怎么做','保留材料、暂停接触，向服务点求助。']]);
const keyForm=await screen('P06-协助-银色钥匙线索','给钥匙补条线索',keys+' · 银色钥匙串',[['你正在协助','教学区连廊拾得，仅关联本记录。'],['线索内容','9月28日上午，教学区连廊见过相似钥匙。'],['确定程度','外观相似，未确认同一件；我未持有实物。']]);
const keyDone=await screen('P06-协助-钥匙线索回执','钥匙线索已提交',keys+' · 线索待核实',[['对应事项','银色钥匙串 · 教学区连廊。'],['等待反馈','提交不等于确认，不改变物品状态。']]);
const blueDone=await screen('P06-协助-蓝伞线索回执','蓝伞线索已提交',blue+' · 线索待核实',[['对应事项','浅蓝色折叠伞 · 图书馆东侧。'],['等待反馈','核实后反馈，不自动判定归属或交接。']]);
const history=await screen('P05-我的-协助记录','我的协助记录','提交后，可在这里查看对应事项',[['银色钥匙串',keys+' · 线索已提交 · 待核实'],['浅蓝色折叠伞',blue+' · 线索已提交 · 待核实']]);
await buttons(report,[['查看处理进度',{type:'NODE',destinationId:report.body.children[2].id,navigation:'SCROLL_TO',transition:null}],['返回上一页',B]]);
await buttons(keyForm,[['提交钥匙线索',[set(keySent,true),go(keyDone.n,'SWAP')]],['返回上一页',B]]);await buttons(keyDone,[['查看我的协助记录',go(history.n)],['返回上一页',B]]);await buttons(blueDone,[['查看我的协助记录',go(history.n)],['返回上一页',B]]);await buttons(history,[['查看钥匙线索',go(keyDone.n)],['查看蓝伞线索',go(blueDone.n)],['返回上一页',B]]);
history.body.children[1].setBoundVariable('visible',keySent);history.body.children[2].setBoundVariable('visible',blueSent);history.foot.children[0].setBoundVariable('visible',keySent);history.foot.children[1].setBoundVariable('visible',blueSent);
history.foot.primaryAxisSizingMode='AUTO';history.view.layoutGrow=1;
await act(findButton(R.report,'提交举报并查看处理'),go(report.n,'SWAP'));await act(findButton(R.keys,'我见过，提供线索'),go(keyForm.n));await act(findButton(R.clue,'提交线索，查看反馈待办'),[set(blueSent,true),go(blueDone.n,'SWAP')]);
const clueSub=R.clue.findOne(t=>t.type==='TEXT'&&t.characters==='给当前事项补一条线索');if(clueSub)clueSub.characters=blue+' · 为浅蓝折叠伞补充线索';
const mineAssist=R.mine.findOne(n=>n.name==='标签 / 我协助的');if(mineAssist)await act(mineAssist,go(history.n));
let swaps=0;for(const [from,to]of[['wait','pass'],['appointment','booked'],['handoff','complete'],['pending','received'],['auth','revoked']])for(const n of R[from].findAll(n=>'reactions'in n&&n.reactions.length)){let changed=false;const rr=JSON.parse(JSON.stringify(n.reactions));for(const r of rr)for(const a of r.actions||[])if(a.type==='NODE'&&a.destinationId===R[to].id&&a.navigation==='NAVIGATE'){a.navigation='SWAP';changed=true;swaps++;}if(changed)await n.setReactionsAsync(rr);}
for(const dot of p.findAll(n=>n.name==='未读 / 红点'))dot.setBoundVariable('visible',unread);
const messages=p.findOne(n=>n.type==='FRAME'&&n.name==='P08-消息与待办');if(!messages)throw Error('缺少消息页');
const reactions=JSON.parse(JSON.stringify(messages.reactions)).filter(r=>!(r.trigger&&r.trigger.type==='AFTER_TIMEOUT'&&(r.actions||[]).some(a=>a.variableId===unread.id)));
reactions.push({trigger:{type:'AFTER_TIMEOUT',timeout:10},actions:[set(unread,false)]});await messages.setReactionsAsync(reactions);
p.setPluginData(K,'done-stateful');console.log(JSON.stringify({revision:K,records:{blue,keys},created:created.map(n=>n.id),variables:{keys:keySent.id,blue:blueSent.id,unread:unread.id},swaps}));figma.notify('导航已更新');
})().catch(e=>{figma.notify(e.message,{error:true,timeout:15000});});
