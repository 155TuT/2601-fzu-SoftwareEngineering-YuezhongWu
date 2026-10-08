// 在当前 Chrome Figma 标签页的既有 Code 插件中输入；只读取实时节点。
// 按分页导出，避免单条通知过长。offset由浏览器调用时替换。
(() => {
  const offset = 0, limit = 28;
  const p = figma.currentPage;
  const frames = p.findAll(n => n.type === 'FRAME' && n.width === 390 && n.height === 844);
  const live = n => { for (let a=n; a&&a.type!=='PAGE'; a=a.parent) if ('visible' in a && !a.visible) return false; return true; };
  const graph = frames.slice(offset,offset+limit).map(f => {
    const nodes = [f,...f.findAll(n => 'reactions' in n && n.reactions.length)];
    const controls = nodes.filter(n => 'reactions' in n && n.reactions.length).map(n => {
      let parents=[]; for(let a=n.parent;a&&a!==f;a=a.parent) parents.push(a.id);
      return {id:n.id,name:n.name,label:n.type==='TEXT'?n.characters:'children'in n?n.findAll(t=>t.type==='TEXT').filter(live).map(t=>t.characters).join(' / ').slice(0,220):'',visible:live(n),parents,box:n.absoluteBoundingBox,reactions:n.reactions.map(r=>({trigger:r.trigger,actions:r.actions||(r.action?[r.action]:[])}))};
    });
    return {id:f.id,name:f.name,section:f.parent.name,width:f.width,height:f.height,overlayPosition:f.overlayPositionType,controls};
  });
  const out={file:figma.fileKey,page:p.name,offset,total:frames.length,frames:graph};
  console.log('FLOW_EXPORT',JSON.stringify(out));figma.notify(JSON.stringify(out),{timeout:30000});
})();
