// 最后运行：同步一级“我的”及消息已读副本，不改二级任务页。
(async()=>{
const p=figma.currentPage,K='shiban-mine-header-free-v2';
const base=await figma.getNodeByIdAsync('16:8778')||p.findOne(n=>n.type==='FRAME'&&n.name==='P05-我的-事项总览');
if(!base)throw Error('未找到一级我的页');
const byName=s=>p.findOne(n=>n.type==='FRAME'&&n.name===s);
const forms=[byName('P02-发布-水杯分类建议'),byName('P02-发布-钥匙基础信息'),byName('P02-寻物-基础信息')];
let draft=byName('P02-草稿箱');
const thanks=byName('P05-我的-协助记录'),messages=byName('P08-消息与待办');
if(forms.some(n=>!n)||!thanks||!messages)throw Error('工具目的地不完整，未开始修改');
const roots=p.findAll(n=>n.type==='FRAME'&&n.width===390&&n.height===844&&
 (n.id===base.id||n.name==='P05-我的-消息已读状态'||(n.name.startsWith('P05-我的-')&&n.findOne(c=>c.name==='个人信息卡'))));
const header=base.children.find(n=>n.name==='顶部导航');
const sample=header&&header.findOne(n=>n.type==='TEXT');
if(!sample||sample.fontName===figma.mixed)throw Error('缺少可复用标题字体');
const regular=p.findOne(n=>n.type==='TEXT'&&n.fontSize===14&&n.fontName!==figma.mixed&&!/Bold/i.test(n.fontName.style))||sample;
await Promise.all([figma.loadFontAsync(sample.fontName),figma.loadFontAsync(regular.fontName)]);
const font=sample.fontName,ink={r:37/255,g:43/255,b:50/255},white=[{type:'SOLID',color:{r:1,g:1,b:1}}];
const components=p.findAll(n=>n.type==='COMPONENT');
const pencil=components.find(n=>n.name==='插画 / 贴纸铅笔'),pocket=components.find(n=>n.name==='插画 / 寻物口袋精灵');
if(!pencil||!pocket)throw Error('缺少原有铅笔或口袋精灵组件');
let bubble=components.find(n=>n.name==='功能图标 / 消息气泡');
if(!bubble){
 bubble=figma.createComponent();bubble.name='功能图标 / 消息气泡';bubble.description='可编辑原创矢量；用于一级我的页消息待办入口。';bubble.resize(32,32);bubble.fills=[];
 const v=figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path id="bubble" d="M8 5H24Q28 5 28 9V20Q28 24 24 24H14L8 28V24Q4 24 4 20V9Q4 5 8 5Z" fill="#C7EE38" stroke="#252B32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path id="shine" d="M8 12V9H12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><circle id="dot-left" cx="10" cy="16" r="1.5" fill="#252B32"/><circle id="dot-center" cx="16" cy="16" r="1.5" fill="#252B32"/><circle id="dot-right" cx="22" cy="16" r="1.5" fill="#252B32"/></svg>');
 v.name='矢量 / 圆角消息气泡';bubble.appendChild(v);v.x=v.y=0;
 const norm=p.children.find(n=>n.type==='SECTION'&&n.name==='00 · 拾伴设计规范');if(norm){norm.appendChild(bubble);bubble.x=1260;bubble.y=960;}
}
function fixed(n,w,h){n.resize(w,h);n.primaryAxisSizingMode=n.counterAxisSizingMode='FIXED';}
const go=async(n,target)=>n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:target.id,navigation:'NAVIGATE',transition:{type:'DISSOLVE',duration:.18,easing:{type:'EASE_OUT'}},resetScrollPosition:true}]}]);
function frame(name,w,h,vertical=false,bg=[]){const n=figma.createFrame();n.name=name;n.layoutMode=vertical?'VERTICAL':'HORIZONTAL';fixed(n,w,h);n.fills=bg;n.clipsContent=false;return n;}
function label(s,w,size=14,strong=false){const n=figma.createText();n.name=s;n.fontName=strong?font:regular.fontName;n.fontSize=size;n.lineHeight={unit:'PIXELS',value:size===14?22:Math.round(size*1.4)};n.characters=s;n.resize(w,Math.round(size*1.4));n.textAutoResize='HEIGHT';n.fills=[{type:'SOLID',color:ink}];return n;}
if(!draft){
 let sec=p.children.find(n=>n.type==='SECTION'&&n.name==='11 · 草稿与个人工具');
 if(!sec){sec=figma.createSection();sec.name='11 · 草稿与个人工具';sec.resizeWithoutConstraints(470,940);sec.x=2600;sec.y=Math.max(3460,...p.children.filter(n=>n!==sec&&n.type==='SECTION'&&n.x>=2500).map(n=>n.y+n.height))+140;}
 draft=frame('P02-草稿箱',390,844,true,[{type:'SOLID',color:{r:244/255,g:245/255,b:246/255}}]);draft.cornerRadius=32;draft.clipsContent=true;sec.appendChild(draft);draft.x=32;draft.y=48;
 const status=forms[0].children.find(n=>n.name==='系统状态栏');if(!status)throw Error('缺少状态栏模板');draft.appendChild(status.clone());
 const h=frame('顶部导航',390,64);h.paddingLeft=h.paddingRight=16;h.itemSpacing=10;h.counterAxisAlignItems='CENTER';draft.appendChild(h);
 const back=frame('返回 / 上一页',44,44,false,white);back.cornerRadius=22;back.primaryAxisAlignItems=back.counterAxisAlignItems='CENTER';h.appendChild(back);
 const arrow=figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path id="back" d="M12.5 5L7.5 10L12.5 15" stroke="#252B32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');arrow.name='图标 / back';back.appendChild(arrow);await back.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'BACK'}]}]);
 const ht=label('草稿箱',250,16,true);ht.lineHeight={unit:'PIXELS',value:24};ht.textAlignHorizontal='CENTER';h.appendChild(ht);h.appendChild(frame('标题平衡留白',44,44));
 const view=frame('内容视口 / 纵向滚动',390,738,true);view.clipsContent=true;view.overflowDirection='VERTICAL';draft.appendChild(view);
 const body=frame('内容容器 / 自动布局',390,1,true);body.primaryAxisSizingMode='AUTO';body.paddingLeft=body.paddingRight=16;body.paddingTop=16;body.paddingBottom=28;body.itemSpacing=12;view.appendChild(body);
 body.appendChild(label('写到一半的小事',358,24,true));body.appendChild(label('继续编辑，确认后再公开。',358));
 const data=[['黑色保温杯','招领 · 分类建议待确认','插画 / 贴纸保温杯'],['银色钥匙','招领 · 基础信息待确认','插画 / 暖橙钥匙串'],['蓝色折叠伞','寻物 · 描述待完善','插画 / 雨天蓝伞']];
 for(let j=0;j<data.length;j++){
  const [title,state,iconName]=data[j],c=frame('草稿 / '+title,358,1,false,white);c.counterAxisSizingMode='AUTO';c.paddingLeft=c.paddingRight=c.paddingTop=c.paddingBottom=16;c.itemSpacing=12;c.cornerRadius=24;c.counterAxisAlignItems='CENTER';
  const comp=components.find(n=>n.name===iconName)||pencil,i=comp.createInstance();i.name='插画 / '+title;i.rescale(64/comp.width);c.appendChild(i);
  const content=frame('草稿摘要 / '+title,250,1,true);content.primaryAxisSizingMode='AUTO';content.itemSpacing=5;content.appendChild(label(title,250,18,true));content.appendChild(label(state,250));content.appendChild(label('继续编辑',250,14,true));c.appendChild(content);body.appendChild(c);await go(c,forms[j]);
 }
 draft.setPluginData(K,'draft-list');
}
async function button(label,comp,target){const n=figma.createFrame();n.name='顶部工具 / '+label;n.layoutMode='HORIZONTAL';fixed(n,44,44);n.primaryAxisAlignItems=n.counterAxisAlignItems='CENTER';n.cornerRadius=22;n.fills=white;n.clipsContent=false;
 const i=comp.createInstance();i.name='图标 / '+label;i.rescale(32/comp.width);n.appendChild(i);
 await go(n,target);return n;}
const changed=[];
for(const root of roots){
 const h=root.children.find(n=>n.name==='顶部导航');if(!h)throw Error('缺少顶部导航：'+root.name);
 if(root.getPluginData(K)==='done'&&h.children.some(n=>n.name==='顶部工具组 / 草稿 · 帮助 · 消息')&&!root.findOne(n=>n.name==='个人工具'))continue;
 for(const c of [...h.children])c.remove();await h.setReactionsAsync([]);h.layoutMode='HORIZONTAL';fixed(h,390,64);h.paddingLeft=h.paddingRight=16;h.paddingTop=h.paddingBottom=0;h.itemSpacing=16;h.primaryAxisAlignItems='MIN';h.counterAxisAlignItems='CENTER';
 const t=figma.createText();t.name='标题 / 我的拾伴';t.fontName=font;t.fontSize=20;t.lineHeight={unit:'PIXELS',value:28};t.characters='我的拾伴';t.textAutoResize='NONE';t.resize(194,28);t.fills=[{type:'SOLID',color:ink}];h.appendChild(t);
 const group=figma.createFrame();group.name='顶部工具组 / 草稿 · 帮助 · 消息';group.layoutMode='HORIZONTAL';fixed(group,148,44);group.itemSpacing=8;group.counterAxisAlignItems='CENTER';group.fills=[];group.clipsContent=false;h.appendChild(group);
 group.appendChild(await button('草稿箱',pencil,draft));group.appendChild(await button('帮助记录',pocket,thanks));group.appendChild(await button('消息待办',bubble,messages));
 for(const row of root.findAll(n=>n.type==='FRAME'&&n.name==='个人工具'))row.remove();
 root.setPluginData(K,'done');changed.push({id:root.id,name:root.name});
}
let publishDraftLinks=0;
for(const page of p.findAll(n=>n.type==='FRAME'&&n.width===390&&n.height===844&&n.name.startsWith('P02-发布-关系选择'))){
 const bottom=page.children.find(n=>n.name.startsWith('底部安全区 / '));if(!bottom)continue;
 const entry=bottom.findOne(n=>n.type==='FRAME'&&n.width<=200&&(n.name==='草稿箱入口'||(n.height>=44&&n.height<=68&&n.findOne(t=>t.type==='TEXT'&&t.characters==='草稿箱'))));
 if(!entry)throw Error('发布页缺少草稿箱入口');await go(entry,draft);publishDraftLinks++;
}
console.log(JSON.stringify({patch:K,changed,publishDraftLinks,targets:{draft:draft.id,editors:forms.map(n=>n.id),thanks:thanks.id,messages:messages.id}}));figma.notify('我的页工具与三项草稿列表已整理',{timeout:8000});
})().catch(e=>{console.error(e);figma.notify('我的页顶部修订中断：'+String(e),{error:true,timeout:15000});});
