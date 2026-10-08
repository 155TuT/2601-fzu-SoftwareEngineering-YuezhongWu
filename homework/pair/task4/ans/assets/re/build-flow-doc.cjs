#!/usr/bin/env node
'use strict';

// Build documentation from the saved Figma node snapshot, never from the old builder.
// Default input must be the AFTER export. --dry-run never creates or replaces artifacts.
const fs = require('node:fs');
const path = require('node:path');

const options = {
  input: path.join(__dirname, 'figma-flow-after.json'),
  output: path.resolve(__dirname, '..', '..', 're.md'),
  coverage: path.join(__dirname, 'figma-flow-coverage.json'),
  dryRun: false,
};
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--dry-run' || arg === '--check') options.dryRun = true;
  else if (arg === '--input' || arg === '--output' || arg === '--coverage') {
    const value = process.argv[++i];
    if (!value) throw new Error(`Missing value for ${arg}`);
    options[arg.slice(2)] = path.resolve(__dirname, value);
  } else if (arg === '--help') {
    console.log('node build-flow-doc.cjs [--input snapshot.json] [--dry-run] [--output ../../re.md] [--coverage figma-flow-coverage.json]');
    process.exit(0);
  } else throw new Error(`Unknown argument: ${arg}`);
}

const GROUPS = [
  ['main-home', '首页的推荐、筛选及校区空态'],
  ['main-mine', '我的事项总览与消息已读状态'],
  ['main-publish', '发布关系选择浮层'],
  ['main-tools', '草稿箱与校区下拉'],
  ['details', '物品详情与候选比较入口'],
  ['publish-key', '钥匙招领：基础信息、预览与公开'],
  ['publish-cup', '水杯招领：分类、候选、预览与公开'],
  ['publish-lost', '寻物发布：基础信息与预览'],
  ['publish-transfer', '转报：来源信息、待核实与来源进度'],
  ['claim', '认领核验、线索与举报入口'],
  ['contact-handoff', '联系授权、预约与交接确认'],
  ['service', '服务点信息、接收与关闭状态'],
  ['mine', '事项列表、消息、感谢与自报找回'],
  ['operations', '值班、贡献复核与申诉'],
  ['exceptions', '提交异常、访客权限与走查目录'],
  ['receipts', '举报和协助回执、协助记录'],
  ['search-home', '搜索主页与未覆盖校区'],
  ['search-u', '雨伞：输入、查询、结果与空态'],
  ['search-k', '钥匙：输入、查询、结果与空态'],
  ['search-c', '保温杯：输入、查询、结果与空态'],
  ['search-e', '耳机：输入、查询与空态'],
  ['search-input', '物品名称输入浮层'],
  ['filter-home', '首页的四种筛选草稿状态'],
  ['filter-u', '雨伞搜索的四种筛选草稿状态'],
  ['filter-k', '钥匙搜索的四种筛选草稿状态'],
  ['filter-c', '保温杯搜索的四种筛选草稿状态'],
  ['filter-e', '耳机搜索的四种筛选草稿状态'],
  ['history', '历史保留：旧搜索画板'],
  ['other', '其他实时画板'],
];
const groupNames = new Map(GROUPS);
const historicalIds = new Set(['16:9094', '16:9144']);
// Mermaid labels use plain text only; Markdown details tags are outside diagram source.
const html = value => String(value).replace(/</g, '〈').replace(/>/g, '〉').replace(/"/g, '’').replace(/[\r\n]+/g, '｜');
const table = value => String(value).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
const mermaidId = (prefix, id) => `${({ F: 'f', B: 'h', C: 'b', S: 's', U: 'u' })[prefix] || prefix.toLowerCase()}${String(id).split(/[^a-zA-Z0-9]+/).filter(Boolean).map((part, i) => i === 0 ? part : `N${part}`).join('')}`;
const actionsOf = reaction => reaction.actions || (reaction.action ? [reaction.action] : []);
const documentLink = target => path.relative(path.dirname(options.output), target).split(path.sep).join('/');
const assetLink = name => documentLink(path.join(__dirname, name));

function classify(frame) {
  const n = frame.name, s = frame.section || '';
  if (historicalIds.has(frame.id)) return 'history';
  if (n === 'P01-首页-推荐' || n.startsWith('P01免费-首页-')) return 'main-home';
  if (n === 'P05-我的-事项总览' || n === 'P05-我的-消息已读状态') return 'main-mine';
  if (n === 'P02-发布-关系选择') return 'main-publish';
  if (n === 'P02-草稿箱' || n === '覆盖层-校区下拉') return 'main-tools';
  if (s === '08 · 搜索与筛选 v2' || n.startsWith('P03')) {
    if (n === '覆盖层-搜索输入') return 'search-input';
    if (n === '覆盖层-筛选草稿') return 'filter-home';
    const filter = n.match(/^覆盖层免费-筛选-(home|u|k|c|e)-/);
    if (filter) return `filter-${filter[1]}`;
    if (n === 'P03v2-搜索-初始与输入' || n === 'P03免费-搜索-铜盘未覆盖') return 'search-home';
    if (/雨伞|图书馆筛选/.test(n) || n === 'P03v2-搜索-查询中') return 'search-u';
    if (/钥匙/.test(n)) return 'search-k';
    if (/保温杯|水杯/.test(n)) return 'search-c';
    if (/耳机/.test(n) || n === 'P03v2-搜索-无匹配') return 'search-e';
    return 'other';
  }
  if (s === '01-查找与详情' || n === 'P04-寻物详情-黑色旅行杯') return 'details';
  if (s === '02-发布与来源核实' || n.startsWith('P02-转报-来源')) {
    if (n.includes('钥匙')) return 'publish-key';
    if (n.includes('水杯')) return 'publish-cup';
    if (n.startsWith('P02-寻物-')) return 'publish-lost';
    if (n.startsWith('P02-转报-')) return 'publish-transfer';
    return 'other';
  }
  if (s === '03-核验与交接') {
    if (n.startsWith('P09-服务点-')) return 'service';
    if (n.startsWith('P07-联系-') || n.startsWith('P07-交接-')) return 'contact-handoff';
    return 'claim';
  }
  if (s === '04-我的与消息' || /P05-我的-(发布列表|认领列表)/.test(n)) return 'mine';
  if (s === '05-值班与复核') return 'operations';
  if (s === '06-异常与走查' || s.startsWith('07 ·')) return 'exceptions';
  if (s.startsWith('09 ·')) return 'receipts';
  return 'other';
}

// Tarjan SCCs only on actual automatic transitions. User-driven browsing loops are allowed.
function automaticCycles(frameIds, edges) {
  const adjacency = new Map(frameIds.map(id => [id, []]));
  for (const e of edges) if (e.trigger.type === 'AFTER_TIMEOUT' && e.action.type === 'NODE' && e.action.navigation !== 'SCROLL_TO') adjacency.get(e.source).push(e.action.destinationId);
  let index = 0;
  const indices = new Map(), low = new Map(), stack = [], onStack = new Set(), cycles = [];
  function visit(id) {
    indices.set(id, index); low.set(id, index++); stack.push(id); onStack.add(id);
    for (const next of adjacency.get(id) || []) {
      if (!indices.has(next)) { visit(next); low.set(id, Math.min(low.get(id), low.get(next))); }
      else if (onStack.has(next)) low.set(id, Math.min(low.get(id), indices.get(next)));
    }
    if (indices.get(id) === low.get(id)) {
      const members = []; let next;
      do { next = stack.pop(); onStack.delete(next); members.push(next); } while (next !== id);
      if (members.length > 1 || adjacency.get(id).includes(id)) cycles.push(members);
    }
  }
  frameIds.forEach(id => { if (!indices.has(id)) visit(id); });
  return cycles;
}

function main() {
  if (!fs.existsSync(options.input)) throw new Error(`AFTER snapshot is not available: ${options.input}. Export it first; no document was written.`);
  const snapshot = JSON.parse(fs.readFileSync(options.input, 'utf8'));
  if (!Array.isArray(snapshot.frames) || !snapshot.frames.length) throw new Error('Snapshot must contain nonempty frames.');
  const frames = snapshot.frames, byId = new Map(), byGroup = new Map(GROUPS.map(([id]) => [id, []]));
  const detailsPath = path.join(__dirname, 'figma-flow-details.json');
  const details = options.input === path.join(__dirname, 'figma-flow-after.json') && fs.existsSync(detailsPath)
    ? JSON.parse(fs.readFileSync(detailsPath, 'utf8')) : null;
  for (const frame of frames) {
    if (!frame.id || !frame.name || !Array.isArray(frame.controls)) throw new Error('A frame is missing id, name, or controls.');
    if (byId.has(frame.id)) throw new Error(`Duplicate frame ID: ${frame.id}`);
    frame.group = classify(frame); byId.set(frame.id, frame); byGroup.get(frame.group).push(frame);
  }
  const expected = [], hidden = [], missingTargets = [], scrollTargets = [], unsupported = [];
  for (const frame of frames) for (const control of frame.controls) {
    if (typeof control.visible !== 'boolean') throw new Error(`Control ${control.id} has no explicit visibility flag.`);
    const reactions = control.reactions || [];
    for (let ri = 0; ri < reactions.length; ri++) {
      const reaction = reactions[ri];
      if (!reaction.trigger || !reaction.trigger.type) throw new Error(`Control ${control.id} has an invalid trigger.`);
      const actions = actionsOf(reaction);
      for (let ai = 0; ai < actions.length; ai++) {
        const action = actions[ai], key = `${frame.id}/${control.id}/${ri}/${ai}`;
        const item = { key, source: frame.id, controlId: control.id, controlName: control.name, controlLabel: control.label || '', trigger: reaction.trigger, action };
        if (!control.visible) { hidden.push(item); continue; }
        expected.push(item);
        if (action.type === 'NODE') {
          if (action.navigation === 'SCROLL_TO') {
            const child = details && details.scrollTarget && details.scrollTarget.id === action.destinationId && details.scrollTarget.frame === frame.id ? details.scrollTarget : null;
            scrollTargets.push({ ...item, targetName: child ? child.name : action.destinationName || null, parentFrame: child ? child.frame : null, evidence: child ? path.basename(detailsPath) : null, validation: child ? 'known-page-child' : byId.has(action.destinationId) ? 'known-frame' : 'page-child-not-in-frame-export' });
          }
          else if (!byId.has(action.destinationId)) missingTargets.push(item);
        } else if (!['BACK', 'CLOSE', 'URL'].includes(action.type)) unsupported.push(item);
      }
    }
  }
  if (missingTargets.length) throw new Error(`Missing navigation targets: ${missingTargets.map(e => `${e.controlId} -> ${e.action.destinationId}`).join(', ')}`);
  if (unsupported.length) throw new Error(`Unsupported actions require an explicit renderer: ${unsupported.map(e => `${e.controlId}: ${e.action.type}`).join(', ')}`);
  const cycles = automaticCycles(frames.map(f => f.id), expected);
  if (cycles.length) throw new Error(`Automatic navigation cycle(s): ${JSON.stringify(cycles)}`);

  const entry = byId.has('16:8524') ? '16:8524' : frames[0].id;
  const adjacency = new Map(frames.map(f => [f.id, new Set()]));
  for (const e of expected) if (e.action.type === 'NODE' && e.action.navigation !== 'SCROLL_TO') adjacency.get(e.source).add(e.action.destinationId);
  const reachable = new Set([entry]), queue = [entry];
  for (let cursor = 0; cursor < queue.length; cursor++) for (const id of adjacency.get(queue[cursor])) if (!reachable.has(id)) { reachable.add(id); queue.push(id); }

  const coverageEdges = [], covered = new Set();
  function endpoint(edge) {
    const a = edge.action;
    if (a.type === 'NODE' && a.navigation === 'SCROLL_TO') {
      const target = scrollTargets.find(t => t.key === edge.key);
      return { id: mermaidId('S', a.destinationId), kind: 'scroll', targetId: a.destinationId, label: `页内节点 ${a.destinationId}${target.targetName ? `｜${target.targetName}` : '｜快照未收录节点名称'}` };
    }
    if (a.type === 'NODE') return { id: mermaidId('F', a.destinationId), kind: 'frame', targetId: a.destinationId };
    if (a.type === 'BACK') return { id: mermaidId('B', edge.source), kind: 'history', label: '动态历史｜上一页面｜由当前导航历史决定' };
    if (a.type === 'CLOSE') return { id: mermaidId('C', edge.source), kind: 'background', label: '打开该层的背景｜动态｜关闭当前浮层，露出原背景' };
    if (a.type === 'URL') return { id: mermaidId('U', edge.key), kind: 'url', label: `外部链接｜${a.url || '<missing URL>'}` };
    throw new Error(`No endpoint for ${a.type}`);
  }
  function semantics(edge) {
    const a = edge.action;
    let s = a.type === 'NODE' ? a.navigation : a.type;
    if (edge.trigger.type !== 'ON_CLICK') s = `${edge.trigger.type}${edge.trigger.timeout === undefined ? '' : `(${edge.trigger.timeout})`}｜${s}`;
    return s;
  }
  const diagrams = [];
  for (const [group, title] of GROUPS) {
    const owned = byGroup.get(group); if (!owned.length) continue;
    const raw = expected.filter(e => byId.get(e.source).group === group), merged = new Map(), endpoints = new Map();
    for (const edge of raw) {
      const target = endpoint(edge); endpoints.set(target.id, target);
      const mergeKey = JSON.stringify([edge.source, target.id, semantics(edge), edge.trigger]);
      if (!merged.has(mergeKey)) merged.set(mergeKey, { source: edge.source, target, semantic: semantics(edge), items: [] });
      merged.get(mergeKey).items.push(edge);
    }
    const lines = ['flowchart TD'];
    for (const f of owned) lines.push(`  ${mermaidId('F', f.id)}["${html(`${f.id}｜${f.name}`)}${reachable.has(f.id) ? '' : '｜从首页不可达'}"]`);
    for (const target of endpoints.values()) {
      if (target.kind === 'frame') {
        const f = byId.get(target.targetId);
        if (f.group !== group) lines.push(`  ${target.id}["${html(`${f.id}｜${f.name}`)}｜外部目标：${html(groupNames.get(f.group))}"]:::external`);
      } else lines.push(`  ${target.id}["${html(target.label)}"]:::${target.kind}`);
    }
    let edgeIndex = 0;
    for (const m of merged.values()) {
      const names = [...new Set(m.items.map(e => e.controlName || e.controlId))];
      const label = `${names.join('；')}｜${m.semantic}`;
      const edgeId = `${group}/edge-${++edgeIndex}`;
      lines.push(`  ${mermaidId('F', m.source)} -->|"${html(label)}"| ${m.target.id}`);
      for (const item of m.items) {
        if (covered.has(item.key)) throw new Error(`Duplicate action coverage: ${item.key}`);
        covered.add(item.key);
      }
      coverageEdges.push({ diagram: group, edgeId, source: m.source, target: m.target, semantics: m.semantic, controls: m.items.map(e => ({ key: e.key, controlId: e.controlId, controlName: e.controlName, trigger: e.trigger, action: e.action })) });
    }
    lines.push('  classDef external fill:#eef3f8,stroke:#64748b,stroke-dasharray:4 3');
    lines.push('  classDef history fill:#fff4d9,stroke:#b58119');
    lines.push('  classDef background fill:#f0f7ec,stroke:#658951');
    lines.push('  classDef scroll fill:#f7edff,stroke:#9366ad');
    lines.push('  classDef url fill:#eaf9fa,stroke:#46838c');
    diagrams.push({ group, title, ownFrames: owned.length, visibleActions: raw.length, renderedEdges: merged.size, lines });
  }
  const uncovered = expected.filter(e => !covered.has(e.key));
  if (uncovered.length || covered.size !== expected.length) throw new Error(`Coverage failure: expected ${expected.length}, covered ${covered.size}, missing ${uncovered.length}.`);
  const represented = diagrams.reduce((n, d) => n + d.ownFrames, 0);
  if (represented !== frames.length) throw new Error(`Node coverage failure: ${represented}/${frames.length}.`);
  const crowded = diagrams.filter(d => d.renderedEdges > 35);
  if (crowded.length) throw new Error(`Split crowded diagrams before writing: ${crowded.map(d => `${d.group}:${d.renderedEdges}`).join(', ')}`);

  // This introductory subset only uses real exported control actions. It is not
  // counted twice in the exhaustive edge/control coverage below.
  const overviewControls = [
    '35:12189', '35:16738', '35:13606', '35:12236', '35:16796',
    '16:8741', '16:8979', '16:9538', '16:9697',
    '16:8758', '35:17843', '16:11099', '16:10327',
    '35:17806', '35:17745', '16:9019', '16:9805', '16:9857',
    '16:9233', '16:10106', '16:10162', '16:10221', '16:10664', '16:10273', '16:10876', '16:10338',
  ];
  const overviewEdges = overviewControls.map(id => expected.find(e => e.controlId === id && e.action.type === 'NODE' && e.action.navigation !== 'SCROLL_TO')).filter(Boolean);
  const overviewFrames = new Set(overviewEdges.flatMap(e => [e.source, e.action.destinationId]));
  const overviewLines = ['flowchart TD'];
  for (const id of overviewFrames) overviewLines.push(`  ${mermaidId('F', id)}["${html(`${id}｜${byId.get(id).name}`)}"]`);
  for (const e of overviewEdges) overviewLines.push(`  ${mermaidId('F', e.source)} -->|"${html(`${e.controlName}｜${semantics(e)}`)}"| ${mermaidId('F', e.action.destinationId)}`);

  const auditNotesPath=path.join(__dirname,'flow-audit-notes.md');
  // Notes use sibling links so they also work when read on their own.
  const auditNotes = fs.existsSync(auditNotesPath)
    ? fs.readFileSync(auditNotesPath, 'utf8').trim().replace(/(\]\()([^\s)]+)(\))/g, (match, open, target, close) =>
      /^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(target) ? match : `${open}${assetLink(target)}${close}`)
    : null;
  let repairVerification = null;
  const repairPath = path.join(__dirname, 'figma-flow-repair.json');
  if (options.input === path.join(__dirname, 'figma-flow-after.json') && fs.existsSync(repairPath)) {
    const repair = JSON.parse(fs.readFileSync(repairPath, 'utf8'));
    const controls = new Map(frames.flatMap(f => f.controls.map(c => [c.id, c])));
    const normalize = reactions => (reactions || []).map(r => ({ trigger: r.trigger, actions: actionsOf(r) }));
    const mismatches = [];
    for (const change of repair.changes || []) {
      const actual = controls.get(change.id);
      if (!actual || JSON.stringify(normalize(actual.reactions)) !== JSON.stringify(normalize(change.after))) mismatches.push(change.id);
    }
    repairVerification = { record: path.basename(repairPath), recordedChangedControls: (repair.changes || []).length, recordedCreatedFrames: (repair.created || []).length, mismatches };
    if (mismatches.length) throw new Error(`Repair record differs from AFTER snapshot: ${mismatches.join(', ')}`);
  }
  const report = {
    schemaVersion: 1,
    source: path.basename(options.input), capturedAt: snapshot.capturedAt || null, page: snapshot.page || null,
    entryFrameId: entry,
    checks: {
      snapshotFrames: frames.length, representedOwnedFrames: represented,
      visibleActionDefinitions: expected.length, coveredActionDefinitions: covered.size, uncoveredActionDefinitions: 0,
      hiddenActionDefinitions: hidden.length, missingNavigationTargets: 0, automaticCycles: cycles,
      automaticTransitionCount: expected.filter(e => e.trigger.type === 'AFTER_TIMEOUT').length,
      reachableFrames: reachable.size,
      unreachableFrames: frames.filter(f => !reachable.has(f.id)).map(f => ({ id: f.id, name: f.name, group: f.group })),
      scrollTargets,
    },
    repairVerification,
    scope: {
      visibility: 'Only controls with the explicit exported visible=true flag are drawn; hidden actions remain listed separately.',
      history: 'BACK is dynamic history, never guessed as a fixed destination.',
      overlays: 'CLOSE returns to the dynamic background that opened the current layer.',
      scrollValidation: 'SCROLL_TO child IDs are not required to be mobile frame IDs. Where available, figma-flow-details.json records the live child identity and parent frame.',
      idempotence: 'This artifact verifies graph coverage and automatic cycles, not persistent backend idempotency or every interactive history.',
    },
    frames: frames.map(f => ({ id: f.id, name: f.name, section: f.section, diagram: f.group, reachableFromEntry: reachable.has(f.id) })),
    diagrams: diagrams.map(({ lines, ...summary }) => summary),
    overview: { intentionallyPartial: true, countedInExhaustiveCoverage: false, frames: [...overviewFrames], controlIds: overviewEdges.map(e => e.controlId), edges: overviewEdges.length },
    edges: coverageEdges,
    hiddenActions: hidden,
  };

  const md = [
    '# 拾伴原型复盘与流程记录', '',
    `本文整理已保存的 Figma 流程快照与修复记录，供回顾第三次作业和确定本次实现范围时参考。节点来自[修复后快照](${documentLink(options.input)})，采集时间：${snapshot.capturedAt || '未记录'}（UTC）。共 ${frames.length} 个手机画板、${expected.length} 个可见控制动作；从首页 \`${entry}\` 可达 ${reachable.size} 个画板。这里的统计对应该次快照，不代表当前线上文件状态。`, '',
    '这是免费版 Figma 的静态示例：预置关键词、有限筛选组合与独立状态页；不代表自由输入、动态查询、跨分支状态持久化、真实提交或后端幂等已实现。', '',
    `阅读顺序：[流程修复](#流程修复) → [主流程扫读](#主流程扫读) → [全量分图索引](#全量分图索引)。复盘结论见 [homework.md 的 0x00](${assetLink('../../homework.md')}#0x00-对第三次作业的反思)，原需求设计见 [task3 PRD](${assetLink('../../../../task3/ans/prd.md')})。`, '',
    '<!-- FIX_NOTES_BEGIN -->',
    auditNotes || (repairVerification
      ? `本轮节点修订涉及 ${repairVerification.recordedChangedControls} 个控件及 ${repairVerification.recordedCreatedFrames} 个条件保留查询画板：返回已有表单或回执改用 BACK；保存、提交和同条件重搜改用 SWAP；完成页设置明确出口；已筛选及无匹配重搜使用独立查询状态保留既定条件。异常确认中的“已确认未收到，重新检查资料”直接替换到钥匙基础信息，避免预览返回误入异常确认。动作与修订记录逐项一致，详情见 [修订记录](${assetLink('figma-flow-repair.json')})。实际点击验收范围仍需另行补充。`
      : '本轮修复说明：待依据修复前后实时快照及实际点击记录补充。生成器不会从动作类型推断全部路径已验收。'),
    '<!-- FIX_NOTES_END -->', '',
    '## 流程图阅读说明', '',
    '每条边标注实际控制名称与动作类型。NAVIGATE 进入目标；SWAP 替换当前状态；OVERLAY 打开覆盖层。BACK 使用动态历史节点；CLOSE 使用打开该层的动态背景；SCROLL_TO 单列页内目标。AFTER_TIMEOUT 括号中的数值保留原始参数，不推断精确时长。', '',
    '浅灰虚线框为其他分图中的真实画板。用户主动更换关键词、调整筛选、补充材料及查看记录形成的流程环予以保留；自动跳转环另行机器检查。隐藏控制不绘为当前可点击动作，完整隐藏定义保存在覆盖记录中。', '',
    '## 主流程扫读', '',
    '下图精选首页浏览、发布、草稿和消息交接的真实控制边，省略其余状态与分支；完整状态及全部可见动作见后续分图。此图不重复计入机器覆盖。', '',
    '```mermaid', ...overviewLines, '```', '',
    '## 全量分图索引', '',
    '| 分图 | 本组画板 | 可见动作 | 合并后边数 |',
    '| --- | ---: | ---: | ---: |',
    ...diagrams.map(d => `| [${table(d.title)}](#flow-${d.group}) | ${d.ownFrames} | ${d.visibleActions} | ${d.renderedEdges} |`), '',
  ];
  for (const d of diagrams) {
    md.push(`<a id="flow-${d.group}"></a>`, '', '<details>', `<summary>${d.title}｜${d.ownFrames} 个画板｜${d.visibleActions} 个可见动作</summary>`, '');
    if (d.group === 'history') md.push('以下两个旧搜索画板保留在 Figma 中，从当前首页不可达。此处如实列出其现有控制，不将它们计为当前搜索入口的可达分支。', '');
    md.push('```mermaid', ...d.lines, '```', '', '</details>', '');
  }
  md.push('## 画板索引', '', '<details>', `<summary>展开全部 ${frames.length} 个画板及其分组</summary>`, '', '| 节点 ID | 实际名称 | 所属分图 | 从首页可达 |', '| --- | --- | --- | --- |');
  for (const f of frames) md.push(`| ${table(f.id)} | ${table(f.name)} | ${table(groupNames.get(f.group))} | ${reachable.has(f.id) ? '是' : '否；保留画板'} |`);
  md.push('', '</details>', '', '## 静态覆盖范围', '',
    `快照内所有 ${frames.length} 个画板均有所属分图；所有 ${expected.length} 个可见动作均由控制 ID 和动作序号对应到图中边，遗漏 0，缺失页面导航目标 0，AFTER_TIMEOUT 自动环 0。`, '',
    `完整边—控制 ID 对照、隐藏动作与目标检查记录见 [覆盖记录](${documentLink(options.coverage)})。此记录证明静态节点及边的覆盖，不等同于所有流程已逐条点击，也不证明真实业务提交幂等。`, '');
  if (scrollTargets.some(t => t.validation === 'page-child-not-in-frame-export')) md.push('SCROLL_TO 指向页内子节点；本快照只列手机画板，子节点名称和存在性需结合原生节点复查。此类目标单列记录，未误记为缺失手机画板。', '');
  else if (scrollTargets.length) md.push(`SCROLL_TO 的页内目标已由[子节点记录](${assetLink('figma-flow-details.json')})确认名称与所属页面，作为页内节点绘制。`, '');
  md.push('## 资源与维护', '',
    `相关资源统一存放在 [assets/re](${assetLink('.')})。保留完整快照、修订记录、覆盖对照、实际点击记录、截图与原始修复脚本；删除已并入完整快照的导出分片及一次性的 Mermaid 校验脚本、逐图通过日志。`, '',
    `修复说明维护在 [flow-audit-notes.md](${assetLink('flow-audit-notes.md')})；[生成脚本](${assetLink('build-flow-doc.cjs')})读取该说明和快照，生成本文及覆盖对照，避免手工修改后被下一次生成覆盖。`, '',
    '在仓库根目录执行：', '', '```powershell',
    'node homework/pair/task4/ans/assets/re/build-flow-doc.cjs --dry-run',
    'node homework/pair/task4/ans/assets/re/build-flow-doc.cjs', '```', '',
    '第一条仅检查现有快照，第二条重新生成文档。两条命令均不连接或修改 Figma。', '',
    `历史操作脚本：[节点导出](${assetLink('export-figma-flow.js')})、[流程修复](${assetLink('repair-figma-flow.js')})、[水杯候选返回修正](${assetLink('correct-cup-edit.js')})、[出口文字排版](${assetLink('polish-flow-exits.js')})。这些脚本供追溯当时的处理，不属于本次 Web 程序实现。`, '');

  const summary = { input: options.input, dryRun: options.dryRun, ...report.checks, diagrams: report.diagrams.length };
  // Do not touch re.md until AFTER input exists and every structural/coverage check has passed.
  if (!options.dryRun) {
    fs.mkdirSync(path.dirname(options.output), { recursive: true });
    fs.mkdirSync(path.dirname(options.coverage), { recursive: true });
    fs.writeFileSync(options.coverage, JSON.stringify(report, null, 2) + '\n', 'utf8');
    fs.writeFileSync(options.output, md.join('\n'), 'utf8');
    summary.output = options.output; summary.coverage = options.coverage;
  }
  console.log(JSON.stringify(summary, null, 2));
}

try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
