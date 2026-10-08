// 通过当前 Chrome Figma 的 Code 插件执行；仅修正当前原型的动作与相关出口。
(async () => {
  const p=figma.currentPage, key='shiban.flow.audit.20261002';
  if(p.getPluginData(key)){figma.notify('流程修正已执行，请运行实时导出核验',{timeout:5000});return;}
  const changes=[], created=[];
  const fonts=await figma.listAvailableFontsAsync();
  const family=['Noto Sans SC','Noto Sans CJK SC','Microsoft YaHei','Source Han Sans SC'].find(f=>fonts.some(n=>n.fontName.family===f));
  const font=fonts.find(n=>n.fontName.family===family&&['Regular','Normal'].includes(n.fontName.style)).fontName;
  await figma.loadFontAsync(font);
  const get=id=>{const n=figma.getNodeById(id);if(!n)throw new Error('Missing '+id);return n;};
  const set=(id,type,destinationId,reason)=>{
    const n=get(id),before=JSON.parse(JSON.stringify(n.reactions));
    const action=type==='BACK'?{type:'BACK'}:{type:'NODE',destinationId,navigation:type,transition:null,resetScrollPosition:true};
    n.reactions=[{trigger:{type:'ON_CLICK'},actions:[action]}];
    changes.push({id,name:n.name,before,after:n.reactions,reason});
  };
  const exit=async(id,target,label='我的')=>{
    const n=get(id);set(id,'NAVIGATE',target,'完成或保存后明确退出，不回到旧提交表单');
    n.name='返回'+label+' / 稳定出口';
    n.layoutMode='HORIZONTAL';n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';
    n.primaryAxisAlignItems='CENTER';n.counterAxisAlignItems='CENTER';n.itemSpacing=4;
    n.resize(96,44);n.paddingLeft=8;n.paddingRight=8;
    const t=figma.createText();
    t.fontName=font;t.fontSize=14;t.characters=label;
    t.fills=[{type:'SOLID',color:{r:0.14,g:0.16,b:0.17}}];n.appendChild(t);
    const siblings=n.parent.children;const spacer=siblings[siblings.length-1];
    if(spacer!==n&&spacer.type==='FRAME'&&!spacer.children.length)spacer.resize(96,44);
    const title=siblings.find(c=>c.type==='TEXT');
    if(title)title.resize(n.parent.width-n.parent.paddingLeft-n.parent.paddingRight-n.width-spacer.width-2*n.parent.itemSpacing,title.height);
  };
  // 真正的返回修改消费历史；显式“继续编辑”仍是普通的新编辑入口。
  for(const id of ['16:9701','16:9966','35:12827','35:12833'])set(id,'BACK',null,'返回已打开的表单或回执，不追加历史');
  // 保存与提交替换当前步骤。
  for(const id of ['16:9540','16:9596','16:9807','16:9916'])set(id,'SWAP','35:17730','保存后替换当前编辑页');
  for(const [id,target] of [['16:9697','16:9703'],['16:9964','16:9345'],['16:9805','16:9809'],['16:10106','16:10110'],['16:10708','16:11056'],['16:11265','16:11056'],['16:11318','16:9703'],['16:11320','16:9489']])set(id,'SWAP',target,'提交或查询结果不保留可重复提交的上一层');
  get('16:11320').name='操作 / 已确认未收到，重新检查资料';
  for(const t of get('16:11320').findAll(n=>n.type==='TEXT')){await figma.loadFontAsync(t.fontName);t.characters='已确认未收到，重新检查资料';}
  set('16:10160','SWAP','16:10063','补证替换当前核验状态，提交后仍是同一事项');
  for(const id of ['16:10277','16:10880'])set(id,'SWAP','16:10166','取消后不允许返回已取消预约');
  set('35:13383','SWAP','35:13229','消息已读替换当前状态');
  // 共享终态与草稿箱使用明确的根出口，防止多入口历史恢复旧步骤。
  for(const id of ['35:17735','16:9708','16:9350','16:9814','16:10171','16:10826','16:10338','16:10719','16:11061','35:13162'])await exit(id,'16:8778');
  await exit('16:10021','35:13157','发布列表');
  set('35:13218','NAVIGATE','16:8778','发布列表底部与顶部出口一致');get('35:13218').name='操作 / 返回我的';
  for(const t of get('35:13218').findAll(n=>n.type==='TEXT')){await figma.loadFontAsync(t.fontName);t.characters='返回我的';}
  // 同条件重搜替换结果页，不堆入另一份相同结果。
  for(const [id,target] of [['35:16785','35:12236'],['35:16814','35:13699'],['35:16840','35:13790'],['35:16866','35:13881']])set(id,'SWAP',target,'同条件重搜不追加相同结果历史');
  // 保留筛选/无匹配状态的重搜静态查询页，不能共享会清除条件的查询页。
  const section=figma.createSection();section.name='12 · 查询条件保留与流程修正';section.x=5300;section.y=1300;section.resizeWithoutConstraints(1460,1930);p.appendChild(section);
  const specs=[
    ['35:13917','35:12236','35:13904','雨伞-图书馆筛选'],
    ['35:13947','35:13699','35:13934','钥匙-教学区筛选'],
    ['35:13974','35:13790','35:13961','水杯-食堂筛选'],
    ['35:13644','35:12236','35:13631','雨伞-条件无匹配'],
    ['35:13735','35:13699','35:13722','钥匙-条件无匹配'],
    ['35:13826','35:13790','35:13813','保温杯-条件无匹配']
  ];
  for(let i=0;i<specs.length;i++){
    const [control,template,result,label]=specs[i],f=get(template).clone();section.appendChild(f);
    f.name='P03免费-查询中-保留条件-'+label;f.x=30+(i%3)*470;f.y=60+Math.floor(i/3)*920;
    f.reactions=[{trigger:{type:'AFTER_TIMEOUT',timeout:0.5},actions:[{type:'NODE',destinationId:result,navigation:'SWAP',transition:null,resetScrollPosition:true}]}];
    created.push({id:f.id,name:f.name,result});set(control,'SWAP',f.id,'重搜保留当前关键词和筛选条件');
  }
  p.setPluginData(key,JSON.stringify({changes,created}));
  figma.notify(JSON.stringify({ok:true,changes,created}),{timeout:30000});
})();
