// 在用户现有 Chrome / Figma 的 Code 插件中输入并执行；不使用 Figma MCP。
// 保留业务节点 ID 与单动作跳转，更新草稿图标、发布堆栈、底部浮层与校区按钮。
(async () => {
  const p = figma.currentPage, key = 'shiban.overlay.v3.20261002';
  if (p.getPluginData(key) === 'complete') { figma.notify('浮层 v3 已完成'); return; }
  const home = await figma.getNodeByIdAsync('16:8524');
  const mine = await figma.getNodeByIdAsync('16:8778');
  const pub = await figma.getNodeByIdAsync('16:8931');
  const draft = await figma.getNodeByIdAsync('35:17730');
  const hero = pub && pub.findOne(n => n.name === '发布主题留白');
  const cards = pub && pub.findAll(n => n.type === 'FRAME' && n.name.startsWith('关系选择 / '));
  const draftButton = pub && pub.findOne(n => n.id === '16:11772');
  const closeButton = pub && pub.findOne(n => n.id === '16:9056');
  const overlays = p.findAll(n => n.type === 'FRAME' && n.width === 390 && n.height === 844 && /覆盖层/.test(n.name));
  const sheets = overlays.filter(n => /筛选|搜索输入/.test(n.name));
  const homes = p.findAll(n => n.type === 'FRAME' && (n.id === home.id || n.name.startsWith('P01免费-首页-')));
  const mineButtons = p.findAll(n => n.type === 'FRAME' && n.name === '顶部工具 / 草稿箱');
  if (!home || !mine || !pub || !draft || !hero || cards.length !== 4 || !draftButton || !closeButton || sheets.length !== 21 || homes.length !== 5 || mineButtons.length !== 2) throw Error('现有结构与预期不同，停止修改');
  const fonts = new Map();
  for (const root of [hero, ...cards, draftButton]) for (const t of root.findAll(n => n.type === 'TEXT')) {
    const names = t.fontName === figma.mixed ? t.getRangeAllFontNames(0, t.characters.length) : [t.fontName];
    for (const f of names) fonts.set(JSON.stringify(f), f);
  }
  await Promise.all([...fonts.values()].map(f => figma.loadFontAsync(f)));
  const rgb = h => ({ r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255 });
  const fill = (n, h) => n.fills = h ? [{ type: 'SOLID', color: rgb(h) }] : [];
  const fixed = (n, w, h) => { n.primaryAxisSizingMode = n.counterAxisSizingMode = 'FIXED'; n.resize(w, h); };
  const shadow = [{ type: 'DROP_SHADOW', color: { ...rgb('252B32'), a: 0.09 }, offset: { x: 0, y: 4 }, radius: 18, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const on = (n, action) => n.setReactionsAsync(action ? [{ trigger: { type: 'ON_CLICK' }, actions: [action] }] : []);
  const moveUp = { type: 'MOVE_IN', direction: 'TOP', matchLayers: false, easing: { type: 'EASE_OUT' }, duration: 0.25 };
  // 新图标作为原生可编辑组件保留在既有设计规范分区。
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none"><g stroke="#252B32" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path id="lime-back-page" d="M29 25H61Q65 25 65 29V65H25V29Q25 25 29 25Z" fill="#C7EE38"/><path id="white-document" d="M37 14H59L71 26V63H33V18Q33 14 37 14Z" fill="#FFFFFF"/><path id="folded-document-corner" d="M59 14V23Q59 26 62 26H71" fill="#FFBD73" stroke-width="3"/><path id="document-lines" d="M41 36H61M41 44H55" stroke-width="3"/><path id="storage-back-rim" d="M18 48H78Q82 48 82 52V60H14V52Q14 48 18 48Z" fill="#FFFFFF"/><path id="orange-storage-box" d="M14 54H34L39 63H57L62 54H82V75Q82 84 73 84H23Q14 84 14 75Z" fill="#FFBD73"/><path id="white-box-label" d="M41 71H55Q57 71 57 73V76Q57 78 55 78H41Q39 78 39 76V73Q39 71 41 71Z" fill="#FFFFFF" stroke-width="3"/></g></svg>';
  const spec = p.children.find(n => n.type === 'SECTION' && n.name === '00 · 拾伴设计规范');
  if (!spec) throw Error('找不到设计规范分区');
  const component = figma.createComponent(); component.name = '插画 / 文稿收纳箱'; component.resize(96, 96); component.fills = []; component.clipsContent = false;
  const vector = figma.createNodeFromSvg(svg); vector.name = '原创矢量部件 / 文稿与收纳盒'; component.appendChild(vector); vector.x = vector.y = 0;
  spec.appendChild(component); component.x = 1260; component.y = 1070;
  const draftIcon = size => { const n = component.createInstance(); n.name = '图标 / 草稿箱'; n.rescale(size / 96); return n; };
  for (const button of mineButtons) { for (const c of [...button.children]) c.remove(); button.appendChild(draftIcon(32)); }
  // 校区按钮包裹内容，保留两侧各12px安全区；品牌与搜索仍占两端。
  const campusGeometry = [];
  for (const root of homes) {
    const header = root.children.find(n => n.name === '品牌与校园范围');
    const campus = header.findOne(n => n.name.startsWith('校区选择 / '));
    const brand = header.children.find(n => n.type === 'TEXT');
    brand.textAutoResize = 'WIDTH_AND_HEIGHT';
    campus.paddingLeft = campus.paddingRight = 12; campus.paddingTop = campus.paddingBottom = 0; campus.itemSpacing = 8;
    campus.primaryAxisSizingMode = 'AUTO'; campus.counterAxisSizingMode = 'FIXED'; campus.resize(campus.width, 44);
    header.primaryAxisAlignItems = 'SPACE_BETWEEN'; header.itemSpacing = 0;
    campusGeometry.push({ id: root.id, width: campus.width, paddingLeft: campus.paddingLeft, paddingRight: campus.paddingRight });
  }
  // 所有底部白色面板实际贴到844，增加34px底部手势安全区。
  const sheetGeometry = [];
  for (const root of sheets) {
    const sheet = root.children.find(n => n.name === '浮层内容');
    sheet.paddingBottom = 34; sheet.bottomLeftRadius = sheet.bottomRightRadius = 0;
    sheet.x = 0; sheet.y = root.height - sheet.height; sheet.constraints = { horizontal: 'STRETCH', vertical: 'MAX' };
    const shade = root.children.find(n => n.name === '遮罩 / 关闭当前层');
    shade.x = shade.y = 0; shade.resize(390, 844); shade.fills = [{ type: 'SOLID', color: rgb('252B32'), opacity: 0.20 }];
    sheetGeometry.push({ id: root.id, name: root.name, y: sheet.y, height: sheet.height, bottom: sheet.y + sheet.height });
  }
  // 底层先绘制，越靠上的卡片越晚插入，以24px交叠形成真实堆栈。
  const originalChildren = [...pub.children]; pub.layoutMode = 'NONE'; pub.fills = []; pub.cornerRadius = 0; pub.clipsContent = true;
  const shade = figma.createRectangle(); shade.name = '遮罩 / 发布浮层关闭'; shade.resize(390, 844); shade.fills = [{ type: 'SOLID', color: rgb('252B32'), opacity: 0.20 }]; pub.appendChild(shade); shade.x = shade.y = 0; await on(shade, { type: 'CLOSE' });
  const stack = figma.createFrame(); stack.name = '发布浮层 / 六层卡片堆栈'; stack.layoutMode = 'NONE'; stack.resize(390, 652); stack.fills = []; stack.clipsContent = false; pub.appendChild(stack); stack.x = 0; stack.y = 192; stack.constraints = { horizontal: 'STRETCH', vertical: 'MAX' };
  const base = figma.createFrame(); base.name = '堆栈 06 / 草稿箱与关闭 · 底部安全区'; base.layoutMode = 'NONE'; base.resize(390, 126); fill(base, 'F4F5F6'); base.topLeftRadius = base.topRightRadius = 28; base.bottomLeftRadius = base.bottomRightRadius = 0; stack.appendChild(base); base.x = 0; base.y = 526;
  base.appendChild(draftButton); draftButton.name = '草稿箱 / 文稿收纳箱入口'; draftButton.layoutMode = 'HORIZONTAL'; fixed(draftButton, 156, 68); draftButton.cornerRadius = 34; draftButton.paddingLeft = draftButton.paddingRight = 16; draftButton.paddingTop = draftButton.paddingBottom = 0; draftButton.itemSpacing = 8; draftButton.primaryAxisAlignItems = 'MIN'; draftButton.counterAxisAlignItems = 'CENTER'; fill(draftButton, 'FFFFFF'); draftButton.effects = shadow;
  const draftLabel = draftButton.children.find(n => n.type === 'TEXT'); draftLabel.textAutoResize = 'WIDTH_AND_HEIGHT'; draftLabel.fontSize = 16; draftLabel.lineHeight = { unit: 'PIXELS', value: 24 }; draftLabel.textAlignHorizontal = 'LEFT'; draftButton.insertChild(0, draftIcon(32)); draftButton.x = 16; draftButton.y = 40; await on(draftButton, { type: 'NODE', destinationId: draft.id, navigation: 'NAVIGATE', transition: null, resetScrollPosition: true });
  base.appendChild(closeButton); fixed(closeButton, 68, 68); closeButton.x = 306; closeButton.y = 40; closeButton.name = '关闭发布 / X'; await on(closeButton, { type: 'CLOSE' });
  for (let i = cards.length - 1; i >= 0; i--) {
    const card = cards[i]; stack.appendChild(card); card.layoutMode = 'HORIZONTAL'; fixed(card, 358, 112); card.paddingLeft = card.paddingRight = 16; card.paddingTop = 32; card.paddingBottom = 16; card.itemSpacing = 12; card.primaryAxisAlignItems = 'MIN'; card.counterAxisAlignItems = 'CENTER'; card.cornerRadius = 28; card.effects = shadow; card.clipsContent = false; card.x = 16; card.y = 174 + i * 88;
    const icon = card.children.find(n => n.name === '插画底片'); fixed(icon, 56, 56); icon.children[0].rescale(52 / icon.children[0].width);
    const caption = card.children.find(n => n.name === '关系说明'); caption.resize(226, caption.height); for (const t of caption.children.filter(n => n.type === 'TEXT')) { t.resize(226, t.height); t.textAutoResize = 'HEIGHT'; }
    card.setPluginData('stackLayer', String(i + 2));
  }
  stack.appendChild(hero); hero.name = '堆栈 01 / 发布关系说明 · 不可点击'; hero.layoutMode = 'VERTICAL'; fixed(hero, 358, 198); hero.paddingLeft = hero.paddingRight = 16; hero.paddingTop = hero.paddingBottom = 20; hero.itemSpacing = 7; hero.counterAxisAlignItems = 'CENTER'; hero.primaryAxisAlignItems = 'CENTER'; fill(hero, 'FFFFFF'); hero.cornerRadius = 28; hero.effects = shadow; hero.x = 16; hero.y = 0;
  const heroIcon = hero.children.find(n => n.type === 'INSTANCE'); heroIcon.rescale(60 / heroIcon.width);
  const heroTitle = hero.children.find(n => n.type === 'TEXT' && n.characters.includes('你和')); heroTitle.characters = '你和这件小物的关系是？'; heroTitle.name = heroTitle.characters; heroTitle.fontSize = 24; heroTitle.lineHeight = { unit: 'PIXELS', value: 36 }; heroTitle.resize(326, 36); heroTitle.textAutoResize = 'HEIGHT';
  const heroSubtitle = hero.children.find(n => n.type === 'TEXT' && n !== heroTitle); heroSubtitle.resize(326, 21); heroSubtitle.textAutoResize = 'HEIGHT';
  const eyebrow = heroTitle.clone(); eyebrow.name = '发布一件小事'; eyebrow.characters = '发布一件小事'; eyebrow.fontSize = 14; eyebrow.lineHeight = { unit: 'PIXELS', value: 20 }; eyebrow.resize(326, 20); eyebrow.textAutoResize = 'HEIGHT'; hero.insertChild(0, eyebrow);
  for (const n of [hero, ...hero.findAll(n => 'reactions' in n)]) await on(n, null);
  // 原顶部返回、重复继续草稿及旧导航壳一并移除；已重排的真实卡片保留ID。
  for (const n of originalChildren) if (!n.removed) n.remove();
  await on(pub, null);
  const entryIds = [], sheetIds = new Set(sheets.map(n => n.id));
  for (const n of p.findAll(n => 'reactions' in n && n.reactions.length)) {
    let changed = false;
    const reactions = n.reactions.map(r => {
      const a = r.actions || (r.action ? [r.action] : []);
      const actions = a.map(a => {
        if (a.type === 'NODE' && a.destinationId === pub.id) { changed = true; entryIds.push(n.id); return { ...a, navigation: 'OVERLAY', transition: moveUp, resetScrollPosition: true }; }
        if (a.type === 'NODE' && sheetIds.has(a.destinationId) && a.navigation === 'OVERLAY') { changed = true; return { ...a, transition: moveUp }; }
        return a;
      });
      return { trigger: r.trigger, actions };
    });
    if (changed) await n.setReactionsAsync(reactions);
  }
  const campusOverlay = p.findOne(n => n.name === '覆盖层-校区下拉'); const dropdown = campusOverlay.children.find(n => n.name === '浮层内容'); dropdown.x = Math.round(home.findOne(n => n.name.startsWith('校区选择 / ')).absoluteBoundingBox.x - home.absoluteBoundingBox.x);
  const output = { patch: key, draftComponent: component.id, mineIcons: mineButtons.length, campus: campusGeometry, bottomSheets: sheetGeometry, publish: { id: pub.id, stackY: stack.y, bottom: stack.y + stack.height, hero: hero.id, relations: cards.map(n => ({ id: n.id, name: n.name, y: n.y, height: n.height, target: n.reactions[0].actions[0].destinationId })), draft: draftButton.id, close: closeButton.id, overlayEntries: entryIds.length } };
  p.setPluginData(key, 'complete'); p.setPluginData(key + '.audit', JSON.stringify(output)); p.selection = [home, mine, pub]; figma.viewport.scrollAndZoomIntoView([home, mine, pub]);
  console.log('OVERLAY_V3', JSON.stringify(output)); figma.notify(JSON.stringify(output), { timeout: 30000 });
})().catch(e => { console.error(e); figma.notify('浮层 v3 中断：' + String(e), { error: true, timeout: 30000 }); });
