// 通过同一 Chrome Code 插件修正出口新增文字后的标题平衡，不改变任何流程动作。
(async()=>{
 const ids=['35:17735','16:9708','16:9350','16:9814','16:10171','16:10826','16:10338','16:10719','16:11061','35:13162','16:10021'];
 const result=[];for(const id of ids){
  const n=figma.getNodeById(id),p=n.parent,title=p.children.find(c=>c.type==='TEXT'),spacer=p.children[p.children.length-1];
  await figma.loadFontAsync(title.fontName);
  const width=p.width-p.paddingLeft-p.paddingRight-n.width-spacer.width-2*p.itemSpacing;
  title.resize(width,title.height);
  result.push({id,parentWidth:p.width,titleWidth:title.width,rightEdge:spacer.x+spacer.width,fits:spacer.x+spacer.width<=p.width});
 }
 figma.notify(JSON.stringify({layoutPolish:result}),{timeout:30000});
})();
