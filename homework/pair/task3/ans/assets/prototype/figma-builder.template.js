// 拾伴校园失物招领 · Figma 网页 Code 插件绘制源文件
// 仅创建本原型；不读取外部数据，不发送网络请求，不删除已有图层。
// 输入为虚构的预置演示数据，所有对象均为原生可编辑 Figma 节点。
(async () => {
const ICONS = __ICONS_JSON__;
const SCREENS = __SCREENS_JSON__;
const P = figma.currentPage;
if (P.children.some(n => n.name === '00 · 拾伴设计规范')) {
  figma.notify('拾伴原型已经存在，请勿重复执行创建脚本。'); return;
}
const available = await figma.listAvailableFontsAsync();
const families = ['Noto Sans SC','Noto Sans CJK SC','Microsoft YaHei','Source Han Sans SC'];
const family = families.find(f => available.some(x => x.fontName.family === f));
if (!family) throw new Error('未发现可用中文字体，请先在编辑器中加载 Noto Sans SC。');
const styles = available.filter(x => x.fontName.family === family).map(x => x.fontName.style);
const regular = styles.find(x=>x==='Regular') || styles[0];
const bold = styles.find(x=>x==='Bold') || styles.find(x=>/Medium|SemiBold|Semi Bold/.test(x)) || regular;
await Promise.all([figma.loadFontAsync({family,style:regular}),figma.loadFontAsync({family,style:bold})]);
P.name = '拾伴 · 移动端原型';
const H = {ink:'252B32',muted:'707780',bg:'F4F5F6',white:'FFFFFF',lime:'C7EE38',blue:'D9ECFC',orange:'FFBD73',line:'E2E5E8',soft:'E9F4CC',danger:'AD493D'};
const rgb = h=>({r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255});
const collection = figma.variables.createVariableCollection('拾伴 / 颜色');
const vars = {};
for(const k of Object.keys(H)){
  const v=figma.variables.createVariable(k,collection,'COLOR');
  v.setValueForMode(collection.defaultModeId,rgb(H[k]));
  v.scopes=['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];
  v.setVariableCodeSyntax('WEB','var(--shiban-'+k+')'); vars[k]=v;
}
function paint(k){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(H[k]||k)},'color',vars[k]||vars.ink);}
function fill(n,k){n.fills=k?[paint(k)]:[];}
function frame(name,w,dir='VERTICAL',pad=0,gap=0,color=null){
  const n=figma.createFrame();n.name=name;n.resize(w,1);n.layoutMode=dir;
  n.primaryAxisSizingMode=dir==='HORIZONTAL'?'FIXED':'AUTO';
  n.counterAxisSizingMode=dir==='HORIZONTAL'?'AUTO':'FIXED';
  n.paddingTop=n.paddingBottom=n.paddingLeft=n.paddingRight=pad;n.itemSpacing=gap;
  n.clipsContent=false;fill(n,color);return n;
}
function fixed(n,w,h){n.resize(w,h);n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';return n;}
function text(s,w=326,size=14,strong=false,color='ink'){
  const n=figma.createText();n.name=s.slice(0,24);n.fontName={family,style:strong?bold:regular};
  n.fontSize=size;n.lineHeight={unit:'PIXELS',value:Math.round(size*1.5)};
  n.characters=s;n.resize(w,Math.round(size*1.5));n.textAutoResize='HEIGHT';fill(n,color);return n;
}
function add(p,n){p.appendChild(n);return n;}
function row(name,w,gap=12){const n=frame(name,w,'HORIZONTAL',0,gap);n.counterAxisAlignItems='CENTER';return n;}
function label(s,w=326,size=14,color='muted'){return text(s,w,size,false,color);}
function section(name,x,y,w,h){const n=figma.createSection();n.name=name;n.resizeWithoutConstraints(w,h);n.x=x;n.y=y;n.fills=[{type:'SOLID',color:rgb('E8EBED')}];return n;}
const norm=section('00 · 拾伴设计规范',-1550,0,1480,1730);
const refs={};const links=[];const iconComponents={};const components={};const created=[];
const ICON_NAMES={'mascot-pocket':'口袋精灵','home':'校园小屋','publish':'贴纸铅笔','search':'寻物放大镜','service':'校园服务点','umbrella':'蓝色雨伞','keys':'银色钥匙','bottle':'黑色保温杯'};
function destination(n,target){if(n.type==='FRAME'&&n.name.indexOf('标签 / ')===0){fixed(n,n.width,44);n.counterAxisAlignItems='CENTER';}links.push([n,target]);return n;}
function icon(key,size=64){key=({'key':'keys','cup':'bottle','pin':'service','bag':'mascot-pocket','check':'mascot-pocket','heart':'mascot-pocket','bell':'home','clock':'search','clipboard':'publish','calendar':'service','link':'search','star':'mascot-pocket','lock':'home','shield':'service'})[key]||key;
  const comp=iconComponents[key]||iconComponents['mascot-pocket'];const n=comp.createInstance();n.name='插画 / '+(ICON_NAMES[key]||'口袋精灵');n.rescale(size/128);return n;}
let ix=0;
for(const key of Object.keys(ICONS)){
  const comp=figma.createComponent();comp.name='插画 / '+(ICON_NAMES[key]||'口袋精灵');comp.description='拾伴原创可编辑矢量插画。小尺寸可隐藏装饰点。';comp.resize(128,128);fill(comp,null);
  const v=figma.createNodeFromSvg(ICONS[key]);v.name='原创矢量部件';comp.appendChild(v);v.x=0;v.y=0;
  norm.appendChild(comp);comp.x=40+(ix%4)*170;comp.y=720+Math.floor(ix/4)*180;iconComponents[key]=comp;ix++;
}
function baseButton(name,color){
  const n=figma.createComponent();n.name='按钮 / '+name;n.resize(326,48);n.layoutMode='HORIZONTAL';n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';n.primaryAxisAlignItems='CENTER';n.counterAxisAlignItems='CENTER';n.paddingLeft=n.paddingRight=16;n.cornerRadius=16;fill(n,color);
  const t=add(n,text('按钮文字',294,16,true));t.textAlignHorizontal='CENTER';
  const p=n.addComponentProperty('文案','TEXT','按钮文字');t.componentPropertyReferences={characters:p};n.description='44 px 以上热区；文字可通过组件属性编辑。';
  return {node:n,prop:p};
}
components.primary=baseButton('主操作','lime');components.secondary=baseButton('次操作','bg');components.dark=baseButton('深色操作','ink');
components.dark.node.children[0].fills=[paint('white')];
Object.values(components).forEach((c,i)=>{norm.appendChild(c.node);c.node.x=780;c.node.y=740+i*76;});
function button(s,target,style='primary',w=358){const c=components[style],n=c.node.createInstance();n.name='操作 / '+s;n.resize(w,s.length>21?56:48);n.setProperties({[c.prop]:s});
  const t=n.findOne(x=>x.type==='TEXT');t.resize(w-32,t.height);t.textAutoResize='HEIGHT';if(s.length>21)t.fontSize=14;if(target)destination(n,target);return n;}
function small(s,target,w=44,color='white'){const n=frame('点击区 / '+s,w,'HORIZONTAL',0,0,color);fixed(n,w,44);n.cornerRadius=22;n.primaryAxisAlignItems='CENTER';n.counterAxisAlignItems='CENTER';const t=add(n,text(s,w,20,true));t.textAlignHorizontal='CENTER';if(target)destination(n,target);return n;}
function chip(s,color='bg',w){w=w||Math.max(52,s.length*14+24);const n=frame('标签 / '+s,w,'HORIZONTAL',8,0,color);n.paddingTop=n.paddingBottom=5;n.cornerRadius=12;const t=add(n,text(s,w-16,14,true));t.textAlignHorizontal='CENTER';return n;}
function card(title,body,rows=[],color='white',w=358){const n=frame('卡片 / '+title,w,'VERTICAL',16,8,color);n.cornerRadius=24;
  if(title)add(n,text(title,w-32,18,true));if(body)add(n,text(body,w-32,14));
  for(const r of rows)add(n,text(r,w-32,14,false,'muted'));return n;}
function ruleLine(w=326){const n=figma.createRectangle();n.name='分隔线';n.resize(w,1);fill(n,'line');return n;}
function status(){const r=row('系统状态栏',390,0);fixed(r,390,42);r.paddingLeft=r.paddingRight=24;r.primaryAxisAlignItems='SPACE_BETWEEN';add(r,text('9:41',70,14,true));add(r,text('▰  ◔  ▰',85,14,true));return r;}
function header(title,back='home',right='messages'){const r=row('顶部导航',390,10);fixed(r,390,64);r.paddingLeft=r.paddingRight=16;
  add(r,small(back==='home'?'‹':'‹',back));add(r,text(title,250,16,true));add(r,small('⋯',right));return r;}
function bottomNav(active){const outer=frame(active==='publish'?'底部安全区 / 发布操作':'底部安全区 / 主导航',390,'VERTICAL',16,0,'bg');fixed(outer,390,94);outer.paddingTop=8;outer.paddingBottom=18;
  const r=row(active==='publish'?'底部操作 / 草稿与关闭':'底部导航 / 胶囊与独立发布',358,12);fixed(r,358,68);
  if(active==='publish'){
    const area=row('草稿入口居中区',278,0);fixed(area,278,68);area.primaryAxisAlignItems='CENTER';
    const draft=row('草稿箱入口',152,8);fixed(draft,152,48);draft.primaryAxisAlignItems='CENTER';draft.paddingLeft=draft.paddingRight=12;draft.cornerRadius=24;fill(draft,'white');add(draft,icon('publish',24));add(draft,text('草稿箱',60,14,true));destination(draft,'cup_form');add(area,draft);add(r,area);
    const close=row('关闭发布 / 独立圆形按钮',68,0);fixed(close,68,68);close.cornerRadius=34;close.primaryAxisAlignItems='CENTER';fill(close,'lime');const cross=add(close,text('×',60,40,true));cross.textAlignHorizontal='CENTER';destination(close,'home');add(r,close);
  }else{
    const capsule=row('悬浮胶囊 / 首页 · 我的',278,8);fixed(capsule,278,64);capsule.paddingLeft=capsule.paddingRight=8;capsule.cornerRadius=32;fill(capsule,'white');capsule.effects=[{type:'DROP_SHADOW',color:{...rgb('252B32'),a:.07},offset:{x:0,y:4},radius:18,spread:0,visible:true,blendMode:'NORMAL'}];
    for(const [id,txt,k] of [['home','首页','home'],['mine','我的','mascot-pocket']]){
      const n=row('导航 / '+txt,127,6);fixed(n,127,48);n.paddingLeft=n.paddingRight=8;n.primaryAxisAlignItems='CENTER';n.cornerRadius=24;fill(n,active===id?'lime':'white');add(n,icon(k,32));add(n,text(txt,44,14,active===id));destination(n,id);add(capsule,n);
    }add(r,capsule);
    const publishButton=row('发布 / 独立圆形按钮',68,0);fixed(publishButton,68,68);publishButton.cornerRadius=34;publishButton.primaryAxisAlignItems='CENTER';fill(publishButton,'orange');add(publishButton,icon('publish',52));destination(publishButton,'publish');add(r,publishButton);
  }add(outer,r);return outer;
}
function root(id,name,sec,x,y){const n=frame(name,390,'VERTICAL',0,0,'bg');fixed(n,390,844);n.cornerRadius=32;n.clipsContent=true;sec.appendChild(n);n.x=x;n.y=y;refs[id]=n;created.push(n);add(n,status());return n;}
function viewport(p,h){const n=frame('内容视口 / 纵向滚动',390,'VERTICAL',0,0);fixed(n,390,h);n.clipsContent=true;n.overflowDirection='VERTICAL';add(p,n);const inner=frame('内容容器 / 自动布局',390,'VERTICAL',16,12);inner.paddingTop=8;inner.paddingBottom=24;add(n,inner);return inner;}
function hero(p,title,desc,k='mascot-pocket',color='lime'){const r=row('主题卡 / '+title,358,8);r.paddingLeft=r.paddingRight=20;r.paddingTop=r.paddingBottom=16;r.cornerRadius=24;fill(r,color);const left=frame('标题与说明',210,'VERTICAL',0,6);add(left,text(title,210,24,true));add(left,text(desc,210,14));add(r,left);add(r,icon(k,88));add(p,r);return r;}
function titleBlock(p,title,desc,k){const r=row('页面标题',358,12);const t=frame('标题文案',270,'VERTICAL',0,5);add(t,text(title,270,24,true));if(desc)add(t,text(desc,270,14,false,'muted'));add(r,t);add(r,icon(k,72));add(p,r);}
function field(b){const n=frame('表单 / '+b.title,358,'VERTICAL',16,10,'white');n.cornerRadius=24;add(n,text(b.title,326,14,true,'muted'));const v=frame('输入框 / 预置内容',326,'VERTICAL',12,4,'bg');v.cornerRadius=12;add(v,text(b.body||'请选择',302,16));add(n,v);for(const r of b.rows||[])add(n,label(r,326,14));return n;}
function steps(b){const n=frame('时间线 / '+b.title,358,'VERTICAL',16,10,'white');n.cornerRadius=24;add(n,text(b.title,326,18,true));if(b.body)add(n,text(b.body));(b.rows||[]).forEach((s,i)=>{const r=row('步骤 '+(i+1),326,10);add(r,chip(String(i+1),i===(b.rows.length-1)?'lime':'soft',32));add(r,text(s,284,14));add(n,r);});return n;}
const main=section('01 · 三个主入口',0,0,1450,940);
const home=root('home','P01-首页-推荐',main,32,48);
const hh=row('品牌与校园范围',390,8);fixed(hh,390,66);hh.paddingLeft=hh.paddingRight=16;add(hh,text('拾伴',94,28,true));const cp=chip('本校 · 旗山校区⌄','white',192);destination(cp,'services');add(hh,cp);add(hh,small('◔','messages'));add(home,hh);
const hb=viewport(home,642);
const sr=row('搜索框 / 物品名称',358,8);fixed(sr,358,50);sr.paddingLeft=sr.paddingRight=14;sr.cornerRadius=25;fill(sr,'white');add(sr,icon('search',30));add(sr,label('搜一搜，你丢失的那件小物',272,14));destination(sr,'search');add(hb,sr);
const tabs=row('信息类型切换',358,8);add(tabs,chip('推荐','lime',76));destination(add(tabs,chip('寻物','white',76)),'lost_detail');destination(add(tabs,chip('招领','white',76)),'search');add(hb,tabs);
hero(hb,'让小物，\n找到回家的路','顺手登记一下，也许就帮到了谁。','mascot-pocket','lime');
const quick=row('快速入口',358,10);for(const [k,t,target] of [['umbrella','找物品','search'],['keys','捡到啦','publish_form'],['service','服务点','services']]){const q=frame('快捷入口 / '+t,112,'VERTICAL',10,4,'white');q.cornerRadius=20;q.counterAxisAlignItems='CENTER';add(q,icon(k,42));const tx=add(q,text(t,92,14,true));tx.textAlignHorizontal='CENTER';destination(q,target);add(quick,q);}add(hb,quick);
const feedTitle=row('列表标题',358,8);add(feedTitle,text('校园里的小牵挂',260,20,true));const filter=row('筛选入口 / 44px点击区',90,0);fixed(filter,90,44);filter.primaryAxisAlignItems='CENTER';add(filter,text('筛选 ⌄',90,14,false,'muted'));destination(filter,'search');add(feedTitle,filter);add(hb,feedTitle);
const cols=row('双列信息流',358,12);cols.counterAxisAlignItems='MIN';const colA=frame('左列',173,'VERTICAL',0,12),colB=frame('右列',173,'VERTICAL',0,12);add(cols,colA);add(cols,colB);
function item(p,name,k,bg,type,where,time,state,target){const c=frame('物品卡 / '+name,173,'VERTICAL',0,0,'white');c.cornerRadius=24;c.clipsContent=true;const image=frame('物品插画',173,'VERTICAL',12,0,bg);fixed(image,173,k==='umbrella'?158:134);image.counterAxisAlignItems='CENTER';image.primaryAxisAlignItems='CENTER';add(image,icon(k,112));add(c,image);const b=frame('公开摘要',173,'VERTICAL',12,7);add(b,chip(type,type==='招领'?'soft':'blue',58));add(b,text(name,149,16,true));add(b,label(where,149));add(b,label(time,149));add(b,text(state,149,14,true));add(c,b);destination(c,target);add(p,c);}
item(colA,'浅蓝折叠伞','umbrella','blue','招领','图书馆东侧','9月26日拾得','服务点已接收','detail');
item(colB,'银色钥匙串','keys','orange','招领','教学区连廊','今天 09:00','服务点已接收','keys_detail');
item(colA,'黑色保温杯','bottle','soft','寻物','食堂附近','昨天遗失','正在寻找','cup_lost_detail');
item(colB,'一份顺手的善意','service','blue','协助','校园服务点','看看开放状态','查看服务点','services');add(hb,cols);add(home,bottomNav('home'));
const mine=root('mine','P05-我的-事项总览',main,530,48);add(mine,header('我的拾伴','home','messages'));const mb=viewport(mine,644);
hero(mb,'今天，也有\n小小的好事','每一份帮助，都被认真记下。','mascot-pocket','soft');
const profile=frame('个人信息卡',358,'VERTICAL',16,12,'white');profile.cornerRadius=24;
const pr=row('头像与个人摘要',326,12);add(pr,icon('mascot-pocket',62));const pc=frame('个人信息',252,'VERTICAL',0,3);add(pc,text('小拾同学',252,22,true));add(pc,label('本校成员  ·  个人资料仅自己可见',252));add(pr,pc);add(profile,pr);
const stats=row('事项数据',326,8);for(const [v,s] of [['3','我发布的'],['1','我认领的'],['2','我协助的']]){const z=frame('统计 / '+s,103,'VERTICAL',0,2);add(z,text(v,103,24,true));add(z,label(s,103));add(stats,z);}add(profile,stats);add(mb,profile);
const todo=card('现在轮到你啦','蓝伞还差一个小特征，补充后就能继续核验。',[],'lime');destination(todo,'verify_wait');add(mb,todo);
const mytabs=row('我的事项分组',358,6);for(const [s,target] of [['我发布的','publish_success'],['我认领的','claim'],['我协助的','thanks']]){const n=chip(s,s==='我发布的'?'ink':'white',115);if(s==='我发布的')n.children[0].fills=[paint('white')];destination(n,target);add(mytabs,n);}add(mb,mytabs);
const kc=card('银色钥匙串','XB-026 · 服务点已接收',['刚刚更新 · 接收已确认'],'white');destination(kc,'service_received');add(mb,kc);
const bc=card('蓝色折叠伞','我的认领 · 待补证',['补充标记的位置，继续核验'],'white');destination(bc,'verify_wait');add(mb,bc);
const tools=row('个人工具',358,10);for(const [s,target] of [['草稿箱','cup_form'],['帮助记录','thanks'],['消息待办','messages']])add(tools,button(s,target,'secondary',112));add(mb,tools);
for(const [s,target] of [['线下已找回？更新事项','self_report'],['贡献与活动进度','rewards'],['联系授权与隐私','contact'],['值班工作台 · 角色演示','operations'],['原型走查入口','guide']])add(mb,button(s,target,'secondary'));add(mine,bottomNav('mine'));
const publish=root('publish','P02-发布-关系选择',main,1028,48);add(publish,header('发布一件小事','home','mine'));const pb=viewport(publish,644);
const ph=frame('发布主题留白',358,'VERTICAL',8,10);ph.paddingTop=30;ph.paddingBottom=22;ph.counterAxisAlignItems='CENTER';add(ph,icon('publish',106));const pht=add(ph,text('你和这件小物的故事是？',342,24,true));pht.textAlignHorizontal='CENTER';const phs=add(ph,label('先选关系，再用一分钟把信息说清楚。',342));phs.textAlignHorizontal='CENTER';add(pb,ph);
const options=frame('四种发布关系',358,'VERTICAL',0,12);
for(const [s,d,k,target,c] of [['我丢东西了','发一条寻物，让更多人帮你留意','search','lost_form','blue'],['我捡到了','物品在我这里，等主人来认领','keys','publish_form','soft'],['已交服务点','登记接收信息，等工作人员确认','service','service_detail','orange'],['转报一条线索','我没有实物，先帮助核实来源','publish','transfer_form','bg']]){
  const r=row('关系选择 / '+s,358,12);r.paddingLeft=r.paddingRight=16;r.paddingTop=r.paddingBottom=14;r.cornerRadius=24;fill(r,'white');const i=frame('插画底片',64,'VERTICAL',2,0,c);fixed(i,64,64);i.cornerRadius=20;add(i,icon(k,60));add(r,i);const tx=frame('关系说明',216,'VERTICAL',0,5);add(tx,text(s,216,18,true));add(tx,label(d,216));add(r,tx);add(r,text('›',14,22,true));destination(r,target);add(options,r);
}add(pb,options);add(pb,button('继续上次草稿 · 黑色保温杯','cup_form','secondary'));add(publish,bottomNav('publish'));
// 常用页面：同一套卡片、表单、状态和底部动作组件。
const groupNames=[...new Set(SCREENS.map(s=>s.section))].sort();let sy=1090;
for(const group of groupNames){const arr=SCREENS.filter(s=>s.section===group);const sec=section(group,0,sy,2430,Math.ceil(arr.length/5)*940+48);sy+=sec.height+130;
  arr.forEach((s,i)=>{const p=root(s.id,s.name,sec,32+(i%5)*470,48+Math.floor(i/5)*940);add(p,header(s.name.split('-')[1]||'事项详情',s.back||'home'));
    const footH=28+s.actions.reduce((h,a)=>h+(a.label.length>21?56:48)+8,0);
    const body=viewport(p,844-42-64-footH);titleBlock(body,s.title,s.subtitle||'',s.icon||'mascot-pocket');
    s.blocks.forEach(b=>add(body,b.kind==='field'?field(b):b.kind==='steps'?steps(b):card(b.title,b.body,b.rows,b.kind==='notice'?'soft':'white')));
    const foot=frame('底部操作区 / 固定可达',390,'VERTICAL',16,8,'white');fixed(foot,390,footH);foot.paddingTop=12;foot.paddingBottom=16;
    s.actions.forEach(a=>add(foot,button(a.label,a.target,a.primary?'primary':'secondary')));add(p,foot);
  });
}
// 演示目录与能力边界集中说明，产品流程中不堆叠实现说明。
const guideSec=section('07 · 走查目录与交付说明',2600,0,950,1100);
const guide=root('guide','00-原型走查目录',guideSec,32,48);add(guide,header('原型走查目录','home'));
const gb=viewport(guide,644);titleBlock(gb,'拾伴 · 校园小物回家计划','需求原型初稿 / 390 × 844','mascot-pocket');
add(gb,card('演示边界','所有人物、物品记录和服务点均为虚构。表单采用预置输入，身份、分类、匹配、审核、奖励均为交互模拟。真实服务仍需学校确认能力与规则。'));
const demos=[['D01 找到蓝伞','search'],['D02 无图钥匙与移交','publish_form'],['D03 转报核实','transfer_form'],['D04 分类与候选','cup_form'],['D05 索款与争议','report'],['D06 双方确认与贡献','handoff_wait'],['D07 无激励感谢','thanks'],['D08 访客与旧链接','login'],['D09 超时与异常','submit_unknown']];
for(const [s,t] of demos)add(gb,button(s,t,'secondary'));add(guide,bottomNav('home'));
const doc=frame('阅读说明',810,'VERTICAL',32,20,'white');doc.cornerRadius=28;norm.appendChild(doc);doc.x=40;doc.y=40;
add(doc,text('拾伴',740,48,true));add(doc,text('把散落的消息，变成回家的线索。',740,28,true));
add(doc,text('视觉：浅灰底 / 大圆角白卡 / 荧光绿主动作 / 原创口袋精灵\n结构：3 个主入口 + 学生端任务视图 + 值班复核 + 异常恢复\n原型：预置数据、可点击跳转、内容区域支持滚动\n请从首页或“原型走查目录”开始浏览。',740,18));
const sw=row('颜色规范',740,12);for(const k of ['ink','lime','blue','orange','bg','white']){const c=frame(k,110,'VERTICAL',10,8,k);fixed(c,110,98);c.cornerRadius=16;add(c,text(k,90,14,true,k==='ink'?'white':'ink'));add(c,text('#'+H[k],90,14,false,k==='ink'?'white':'ink'));add(sw,c);}add(doc,sw);
add(doc,text('版式：16 外边距 · 12 卡片间距 · 24 主卡圆角\n文字：24 页面标题 / 18 卡片标题 / 16 操作 / 14 正文\n触控：主操作 48 高；错误与状态均用文字说明。',740,16));
const type=frame('文字与排版样张',530,'VERTICAL',24,12,'white');norm.appendChild(type);type.x=900;type.y=40;type.cornerRadius=24;
add(type,text('字体 / '+family,480,20,true));for(const [size,s] of [[28,'让小物找到回家的路'],[24,'页面标题 · 认领与交接'],[18,'卡片标题 · 保管情况'],[16,'按钮文字 · 下一步'],[14,'正文信息 · 先核验，再交接']])add(type,text(s,480,size,size>=18));
add(type,text('所有插画为独立矢量部件。\n所有文字为原生文本。\n卡片、表单、导航为自动布局。\n按钮和插画使用组件实例。',480,16));
const qa=card('交付检查说明','文件由网页内 Code 插件执行本地绘制脚本生成，未调用 Figma MCP。页面完成后仍须在演示模式检查滚动、返回和所有主流程。',['表单为预设内容，不等同真实小程序。','不会读写真实身份、联系方式或群消息。'],'white',1360);norm.appendChild(qa);qa.x=40;qa.y=1140;
// 原生原型连线：导航、卡片、各步骤按钮均有实际目标。
let linkCount=0;const missing=[];
for(const [n,target] of links){const dest=refs[target];if(!dest){missing.push(target);continue;}
  let anc=n.parent;while(anc&&anc!==dest)anc=anc.parent;if(anc===dest)continue;
  await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dest.id,navigation:'NAVIGATE',transition:{type:'DISSOLVE',duration:.18,easing:{type:'EASE_OUT'}},resetScrollPosition:target==='search'?false:true}]}]);linkCount++;
}
P.flowStartingPoints=[{nodeId:home.id,name:'拾伴 · 首页'},{nodeId:guide.id,name:'D01–D09 · 完整走查'}];
P.prototypeBackgrounds=[{type:'SOLID',color:rgb(H.bg)}];
figma.currentPage.selection=[home,mine,publish];figma.viewport.scrollAndZoomIntoView([home,mine,publish]);
const allText=P.findAll(n=>n.type==='TEXT');
const auto=P.findAll(n=>n.type==='FRAME'&&n.layoutMode!=='NONE');
figma.notify('拾伴已生成：'+created.length+' 画板，'+linkCount+' 条交互，'+auto.length+' 个自动布局。'+(missing.length?'缺少目标：'+missing.join(','):'所有跳转目标有效。'),{timeout:15000});
console.log(JSON.stringify({font:family,frames:created.map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),links:linkCount,autoLayouts:auto.length,textNodes:allText.length,missingTargets:missing}));
})().catch(e=>figma.notify('绘制中断：'+e.message,{error:true,timeout:20000}));
