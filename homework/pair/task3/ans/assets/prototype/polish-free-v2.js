// 免费版局部修饰。TIMEOUT_VALUE=0.5 已在实际UI确认可完成自动过渡；不据此宣称精确时长或时间单位。
(async()=>{
const p=figma.currentPage,sec=p.children.find(n=>n.type==='SECTION'&&n.name==='08 · 搜索与筛选 v2');
if(!sec)throw Error('未找到搜索与筛选区');
const TIMEOUT_VALUE=0.5,jobs=[],report={loading:[],regularText:0,filters:0,unavailableRegular:[]};
const available=await figma.listAvailableFontsAsync(),regular=new Map();
for(const f of available)if(f.fontName.style==='Regular')regular.set(f.fontName.family,f.fontName);
const fontRequests=new Map();
function request(f){if(f)fontRequests.set(JSON.stringify(f),f);}
function buttonOrStatus(n){for(let a=n.parent;a&&a!==sec;a=a.parent)if(a.name==='系统状态栏'||a.name.startsWith('操作 / ')||a.name.includes('按钮')||a.name.includes('点击区')||a.name.startsWith('导航项 /'))return true;return false;}
const normal=sec.findAll(n=>n.type==='TEXT'&&n.fontSize===14&&n.fontName!==figma.mixed&&!buttonOrStatus(n));
for(const t of normal){const f=regular.get(t.fontName.family);if(f)request(f);else if(!report.unavailableRegular.includes(t.fontName.family))report.unavailableRegular.push(t.fontName.family);}
const entries=p.findAll(n=>n.type==='FRAME'&&(n.name.startsWith('筛选入口 /')||n.name==='操作 / 筛选'));
for(const entry of entries){const t=entry.findOne(n=>n.type==='TEXT'&&n.fontName!==figma.mixed);if(t){request(t.fontName);request(regular.get(t.fontName.family));}}
await Promise.all([...fontRequests.values()].map(f=>figma.loadFontAsync(f)));
// 不改变四条加载反应的目的地、SWAP或其他设置，每条仍仅一个动作。
for(const f of sec.children.filter(n=>n.type==='FRAME'&&n.name.includes('查询中'))){let changed=false;const reactions=f.reactions.map(r=>{if(r.trigger?.type!=='AFTER_TIMEOUT')return r;changed=true;return {...r,trigger:{...r.trigger,timeout:TIMEOUT_VALUE}};});if(changed){jobs.push(f.setReactionsAsync(reactions));report.loading.push({id:f.id,timeout:TIMEOUT_VALUE});}}
for(const t of normal){const f=regular.get(t.fontName.family);if(f){t.fontName=f;report.regularText++;}}
// 标签按真实文字宽度排版；不把已筛选三个字塞进原28px文本框。
for(const entry of entries){const old=entry.findOne(n=>n.type==='TEXT'&&n.fontName!==figma.mixed);if(!old)continue;const label=old.characters.includes('已筛选')?'已筛选':'筛选',font=regular.get(old.fontName.family)||old.fontName;
for(const c of [...entry.children])c.remove();entry.layoutMode='HORIZONTAL';entry.resize(90,44);entry.primaryAxisSizingMode=entry.counterAxisSizingMode='FIXED';entry.primaryAxisAlignItems=entry.counterAxisAlignItems='CENTER';entry.paddingLeft=entry.paddingRight=entry.paddingTop=entry.paddingBottom=0;entry.itemSpacing=6;entry.clipsContent=false;
const t=figma.createText();t.name='筛选状态文字';t.fontName=font;t.fontSize=14;t.lineHeight={unit:'PIXELS',value:20};t.characters=label;t.textAutoResize='WIDTH_AND_HEIGHT';t.fills=[{type:'SOLID',color:{r:112/255,g:119/255,b:128/255}}];entry.appendChild(t);
const arrow=figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 6.25L8 9.75L11.5 6.25" stroke="#707780" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>');arrow.name='图标 / 筛选下箭头';entry.appendChild(arrow);report.filters++;}
await Promise.all(jobs);console.log(JSON.stringify(report));figma.notify('局部修饰完成：加载延时0.5待实测、正文Regular、筛选矢量箭头',{timeout:10000});
})().catch(e=>{console.error(e);figma.notify('局部修饰中断：'+String(e),{error:true,timeout:15000});});
