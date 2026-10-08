// 通过 Chrome 中既有 Code 插件执行；整理新组件位置并复查实际 Figma 节点。
(async () => {
  const p = figma.currentPage, key = 'shiban.overlay.v3.20261002';
  const component = p.findOne(n => n.type === 'COMPONENT' && n.name === '插画 / 文稿收纳箱');
  component.x = 1260; component.y = 1070;
  const pub = await figma.getNodeByIdAsync('16:8931');
  const hero = pub.findOne(n => n.name === '堆栈 01 / 发布关系说明 · 不可点击');
  const icon = hero.children.find(n => n.type === 'INSTANCE'); icon.rescale(60 / icon.width);
  const info = n => ({ id: n.id, name: n.name, x: n.x, y: n.y, width: n.width, height: n.height });
  let links = 0, unsupported = 0; const missing = [], publishEntries = [];
  for (const n of p.findAll(n => 'reactions' in n && n.reactions.length)) for (const r of n.reactions) {
    links++; const actions = r.actions || [];
    if (actions.length !== 1 || actions.some(a => !['NODE', 'BACK', 'CLOSE', 'URL'].includes(a.type))) unsupported++;
    for (const a of actions) if (a.type === 'NODE') {
      if (a.destinationId && !await figma.getNodeByIdAsync(a.destinationId)) missing.push(n.id);
      if (a.destinationId === pub.id) publishEntries.push({ source: n.id, name: n.name, navigation: a.navigation, transition: a.transition });
    }
  }
  const sheets = p.findAll(n => n.type === 'FRAME' && n.width === 390 && n.height === 844 && /覆盖层.*(筛选|搜索输入)/.test(n.name)).map(n => {
    const s = n.children.find(n => n.name === '浮层内容'); const shade = n.children.find(n => n.name === '遮罩 / 关闭当前层');
    return { ...info(n), sheet: info(s), bottom: s.y + s.height, shade: info(shade), childrenFit: s.children.every(c => c.x >= 0 && c.x + c.width <= s.width && c.y >= 0 && c.y + c.height <= s.height) };
  });
  const out = { patch: key, links, unsupported, missing, publishEntries, sheets, component: info(component), componentParent: info(component.parent), publish: { root: info(pub), stack: info(pub.findOne(n => n.name === '发布浮层 / 六层卡片堆栈')), hero: { ...info(hero), children: hero.children.map(info), reactions: [hero, ...hero.findAll(n => 'reactions' in n)].reduce((sum,n) => sum + n.reactions.length, 0) }, oldBack: pub.findAll(n => n.name === '返回 / 上一页').length, duplicateDraft: pub.findAll(n => n.name.includes('继续上次草稿')).length, close: pub.findOne(n => n.name === '关闭发布 / X').reactions, draft: pub.findOne(n => n.id === '16:11772').children.map(info) } };
  p.setPluginData(key + '.verified', JSON.stringify(out)); p.selection = ['16:8524', '16:8778', '16:8931'].map(id => p.findOne(n => n.id === id)); figma.viewport.scrollAndZoomIntoView(p.selection);
  console.log('VERIFIED_OVERLAY_V3', JSON.stringify(out)); figma.notify(JSON.stringify(out), { timeout: 30000 });
})().catch(e => { console.error(e); figma.notify('v3复查中断：' + String(e), { error: true, timeout: 30000 }); });
