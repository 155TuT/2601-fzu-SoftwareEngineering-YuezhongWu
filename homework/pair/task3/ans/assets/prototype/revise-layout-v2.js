// 拾伴局部修订；只修改既有画板，不新建业务页面。
(async()=>{
const p=figma.currentPage,key='shiban-layout-v2';
if(p.getPluginData(key)==='done'){figma.notify('布局 v2 已应用');return;}
const get=async(id,name)=>(await figma.getNodeByIdAsync(id))||p.findOne(n=>n.type==='FRAME'&&n.name===name);
const home=await get('16:8524','P01-首页-推荐'),mine=await get('16:8778','P05-我的-事项总览'),pub=await get('16:8931','P02-发布-关系选择');
const guide=p.findOne(n=>n.type==='FRAME'&&n.name==='00-原型走查目录');
const roots=[home,mine,pub,guide];
if(roots.some(n=>!n||n.type!=='FRAME'))throw Error('未找到四个既有主画板，未开始修改');
const direct=(n,s)=>n.children.find(c=>c.name===s);
const navs=roots.map(n=>n.children.find(c=>c.name.startsWith('底部安全区 / ')));
if(navs.some(n=>!n))throw Error('底栏结构不完整，未开始修改');
const texts=p.findAll(n=>n.type==='TEXT'),fonts=new Map();
for(const t of texts){const fs=t.fontName===figma.mixed?t.getRangeAllFontNames(0,t.characters.length):[t.fontName];for(const f of fs)fonts.set(JSON.stringify(f),f);}
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const sample=texts.find(t=>t.characters==='旗山校区')||texts.find(t=>t.fontSize===14&&t.fontName!==figma.mixed);
const font=sample.fontName,bold=(texts.find(t=>t.characters==='拾伴'&&t.fontName!==figma.mixed)||sample).fontName;
const color=h=>({r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255});
const fill=(n,h)=>n.fills=h?[{type:'SOLID',color:color(h)}]:[];
const empty=n=>[...n.children].forEach(c=>c.remove());
function box(name,w,h,bg){const n=figma.createFrame();n.name=name;n.layoutMode='HORIZONTAL';n.resize(w,h);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.primaryAxisAlignItems='CENTER';n.counterAxisAlignItems='CENTER';n.clipsContent=false;fill(n,bg);return n;}
function txt(s,w,size=14,strong=false){const n=figma.createText();n.fontName=strong?bold:font;n.characters=s;n.name=s;n.fontSize=size;n.lineHeight={unit:'PIXELS',value:size===14?20:size===16?24:42};n.textAutoResize='NONE';n.resize(w,size===14?20:size===16?24:42);fill(n,'252B32');return n;}
const paths={chevron:'<path id="chevron-down" d="M4 6L8 10L12 6"/>',back:'<path id="back" d="M12.5 5L7.5 10L12.5 15"/>',right:'<path id="chevron-right" d="M7.5 5L12.5 10L7.5 15"/>',close:'<path id="close" d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5"/>',search:'<circle id="search-lens" cx="10" cy="10" r="6"/><path id="search-handle" d="M14.5 14.5L20 20"/>'};
function svg(k){const s=k==='chevron'?16:k==='search'?24:20;const n=figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" fill="none" stroke="#252B32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[k]}</svg>`);n.name='图标 / '+k;return n;}
const clear=async n=>n.setReactionsAsync([]);
const back=async n=>n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'BACK'}]}]);
const shadow=[{type:'DROP_SHADOW',color:{...color('252B32'),a:.09},offset:{x:0,y:4},radius:18,spread:0,visible:true,blendMode:'NORMAL'}];
for(const h of p.findAll(n=>n.type==='FRAME'&&n.name==='顶部导航')){
 const a=h.children[0],t=h.children.find(n=>n.type==='TEXT'),r=h.children[h.children.length-1];
 if(a&&'children'in a){empty(a);a.name='返回 / 上一页';a.resize(44,44);a.paddingLeft=a.paddingRight=a.paddingTop=a.paddingBottom=0;a.primaryAxisAlignItems=a.counterAxisAlignItems='CENTER';a.appendChild(svg('back'));await back(a);}
 if(t){t.textAlignHorizontal='CENTER';t.fontSize=16;t.lineHeight={unit:'PIXELS',value:24};t.textAutoResize='NONE';t.resize(250,24);}
 if(r&&r!==a&&'children'in r){empty(r);r.name='标题平衡留白';fill(r,null);r.effects=[];r.resize(44,44);await clear(r);}
}
const hh=direct(home,'品牌与校园范围');if(!hh)throw Error('缺少首页顶部容器');
empty(hh);hh.itemSpacing=14;hh.paddingLeft=hh.paddingRight=16;hh.paddingTop=hh.paddingBottom=0;hh.resize(390,66);hh.counterAxisAlignItems='CENTER';
hh.appendChild(txt('拾伴',94,28,true));
const campus=box('校区选择 / 下拉按钮',192,44,'FFFFFF');campus.cornerRadius=22;campus.paddingLeft=campus.paddingRight=12;campus.itemSpacing=8;campus.appendChild(txt('旗山校区',56));campus.appendChild(svg('chevron'));hh.appendChild(campus);
const search=box('搜索入口 / 圆形按钮',44,44,'FFFFFF');search.cornerRadius=22;search.effects=shadow;search.appendChild(svg('search'));hh.appendChild(search);
const hv=direct(home,'内容视口 / 纵向滚动'),hi=hv.children[0];
for(const n of [...hi.children])if(['搜索框 / 物品名称','快速入口','信息类型切换'].includes(n.name))n.remove();
const filter=home.findOne(n=>n.type==='FRAME'&&n.name.startsWith('筛选入口 /'));
if(filter){filter.name='筛选入口 / 44px点击区';empty(filter);filter.resize(90,44);filter.itemSpacing=6;filter.primaryAxisAlignItems=filter.counterAxisAlignItems='CENTER';filter.paddingLeft=filter.paddingRight=filter.paddingTop=filter.paddingBottom=0;filter.appendChild(txt('筛选',28));filter.appendChild(svg('chevron'));await clear(filter);}
for(const card of pub.findAll(n=>n.type==='FRAME'&&n.name.startsWith('关系选择 / '))){
 const old=card.children.find(n=>n.type==='TEXT'&&n.characters==='›');if(old){const i=card.children.indexOf(old);old.remove();card.insertChild(i,svg('right'));}
}
for(let i=0;i<roots.length;i++){
 const root=roots[i],outer=navs[i],r=outer.children[0];
 outer.layoutPositioning='ABSOLUTE';outer.resize(390,94);outer.x=0;outer.y=750;outer.constraints={horizontal:'STRETCH',vertical:'MAX'};fill(outer,null);outer.effects=[];outer.paddingLeft=outer.paddingRight=16;outer.paddingTop=8;outer.paddingBottom=18;outer.clipsContent=false;
 r.resize(358,68);r.itemSpacing=12;r.counterAxisAlignItems='MAX';fill(r,null);
 const vp=direct(root,'内容视口 / 纵向滚动');vp.resize(390,844-vp.y);vp.children[0].paddingBottom=118;
 const capsule=r.children.find(n=>n.name.startsWith('悬浮胶囊 / ')||(n.type==='FRAME'&&n.width===278&&n.height===64));
 if(capsule){capsule.resize(278,64);capsule.itemSpacing=10;capsule.paddingLeft=capsule.paddingRight=8;capsule.effects=shadow;
  for(const item of capsule.children){if(item.type!=='FRAME')continue;item.resize(126,48);item.itemSpacing=6;item.primaryAxisAlignItems=item.counterAxisAlignItems='CENTER';item.clipsContent=false;
   const t=item.children.find(n=>n.type==='TEXT');if(t){t.fontSize=14;t.lineHeight={unit:'PIXELS',value:20};t.textAutoResize='NONE';t.resize(28,20);}
   if(t&&t.characters==='我的'){const old=direct(item,'未读 / 红点');if(old)old.remove();const d=figma.createEllipse();d.name='未读 / 红点';item.appendChild(d);d.layoutPositioning='ABSOLUTE';d.resize(8,8);d.x=56;d.y=4;fill(d,'FF5D63');d.strokes=[{type:'SOLID',color:color('FFFFFF')}];d.strokeWeight=2;d.strokeAlign='OUTSIDE';}
  }
 }
 const circle=r.children.find(n=>n.name.includes('独立圆形按钮')||(n.type==='FRAME'&&n.width===68&&n.height===68));
 if(circle){circle.resize(68,68);circle.cornerRadius=34;circle.effects=shadow;circle.primaryAxisAlignItems=circle.counterAxisAlignItems='CENTER';if(i===2){empty(circle);circle.appendChild(svg('close'));await back(circle);}}
}
p.setPluginData(key,'done');figma.currentPage.selection=[home,mine,pub];figma.viewport.scrollAndZoomIntoView([home,mine,pub]);figma.notify('布局 v2 完成：矢量按钮、悬浮导航、返回与红点已修订',{timeout:8000});
console.log(JSON.stringify({revision:key,roots:roots.map(n=>n.id),navigation:4,homeControls:[campus.id,search.id,filter&&filter.id]}));
})().catch(e=>{console.error(e);figma.notify('局部修订中断：'+e.message,{error:true,timeout:15000});});
