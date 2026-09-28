(async()=>{
const p=figma.currentPage,regular={family:'Noto Sans SC',style:'Regular'},bold={family:'Noto Sans SC',style:'Bold'};
const history=p.findOne(n=>n.type==='FRAME'&&n.name==='P05-我的-协助记录');if(!history)throw Error('未找到协助记录页');
const sections=p.children.filter(n=>n.type==='SECTION'&&/^(09|10) · /.test(n.name));
const cards=sections.flatMap(s=>s.findAll(n=>n.type==='FRAME'&&n.name.startsWith('卡片 / ')));
const texts=[...new Set(cards.flatMap(c=>c.findAll(n=>n.type==='TEXT')))];
const fonts=new Map([[JSON.stringify(regular),regular],[JSON.stringify(bold),bold]]);for(const t of texts)for(const f of(t.fontName===figma.mixed?t.getRangeAllFontNames(0,t.characters.length):[t.fontName]))fonts.set(JSON.stringify(f),f);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
for(const t of texts){const title=t.fontSize!==figma.mixed&&t.fontSize>=18;t.fontName=title?bold:regular;t.fontSize=title?18:14;t.lineHeight={unit:'PIXELS',value:title?27:21};t.fills=[{type:'SOLID',color:{r:37/255,g:43/255,b:50/255}}];t.textAutoResize='HEIGHT';}
const help=p.findAll(n=>(n.type==='FRAME'||n.type==='INSTANCE')&&n.name==='顶部工具 / 帮助记录');
for(const n of help)await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:history.id,navigation:'NAVIGATE',transition:{type:'DISSOLVE',duration:.18,easing:{type:'EASE_OUT'}},resetScrollPosition:true}]}]);
const top=p.findAll(n=>n.type==='FRAME'&&n.name.startsWith('顶部工具 / '));for(const n of top)n.effects=[{type:'DROP_SHADOW',color:{r:37/255,g:43/255,b:50/255,a:.07},offset:{x:0,y:3},radius:10,spread:0,visible:true,blendMode:'NORMAL'}];
const words=['操作 / 雨伞','操作 / 钥匙','操作 / 保温杯','操作 / 耳机'];let chips=0;
for(const n of p.findAll(n=>'reactions'in n&&words.includes(n.name))){let changed=false;const rr=n.reactions.map(r=>({trigger:r.trigger,actions:(r.actions||[]).map(a=>{if(a.type==='NODE'&&a.navigation==='SWAP'){changed=true;return{...a,navigation:'NAVIGATE'};}return a;})}));if(changed){await n.setReactionsAsync(rr);chips++;}}
console.log(JSON.stringify({patch:'repair-final-qa',sections:sections.map(n=>n.name),cards:cards.length,texts:texts.length,help:help.map(n=>n.id),destination:history.id,topShadows:top.length,searchChips:chips}));figma.notify('卡片文字与帮助入口已校正');
})().catch(e=>{console.error(e);figma.notify(String(e),{error:true,timeout:15000});});
