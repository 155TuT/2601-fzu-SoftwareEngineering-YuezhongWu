# AccountingHelper：个人记账本现场编程记录

| 项目 | 内容 |
| --- | --- |
| 作业所属课程 | [202601 软件工程](https://edu.cnblogs.com/campus/fzu/202601SofwareEngineering) |
| 作业要求 | [2026 秋软件工程现场编程作业](https://edu.cnblogs.com/campus/fzu/202601SofwareEngineering/homework/16782) |
| 作业的目标 | 在限定时间内协作完成个人记账本，分析需求、按模块实现、测试和迭代，并用 GitHub 保留各成员的工作记录。 |
| 团队名称 | 你所热爱的就是软件工程 |
| 团队成员名字－学号 | 王智壹－052403137；郑嘉文－052402132；林叶鑫－182400320；张洋－072408137；陈飞扬－102402118；周恪玄－022403140；李宗欣－102401507；陈柏睿－072408101；马晨曦－102401504；林金晶－102401505；陈柯男－072308130 |

**在线体验：[AccountingHelper · 个人账本](https://155TuT.github.io/AccountingHelper/)**

本文记录 2026 年 11 月 7 日的开发与联调结果。

## 一、从记一笔账开始

这次作业要求完成收入与支出记录、本地保存、近期记录和条件统计。我们围绕一条使用流程展开：打开账本，记下一笔收支，再回到账目和统计中查看结果。

AccountingHelper 是一个面向桌面浏览器的个人记账本。打开页面即可操作空工作台，右下角的“+”用于添加账目。用户填写金额、类别、日期和备注，首次保存时选择本地文件；之后的记录继续写入这本账本。左侧文件树可以同时管理多个账本，点击日期筛选当天，点击某笔账目定位到表格中的对应记录。

总览页展示总收入、总支出、结余、每日收支走势和分类收支。日期、类别、金额范围可以组合使用，表格与图表随同一组条件更新。例如，想知道 11 月 6 日的饮食开销，就选择当天和“饮食”，再按需限定单笔金额。

| 使用环节 | 已完成的功能 |
| --- | --- |
| 记账 | 收入与支出录入，六种币种选择，日期、类别和备注填写，输入错误就地提示 |
| 管理账本 | JSONL 文件新建、批量打开、保存、另存为与关闭，多账本切换和文件树定位 |
| 查看记录 | 最近 10 笔记录，按日期与录入时间倒序；全部账目每页 10 笔 |
| 筛选统计 | 日期、类别、金额区间取交集，分别汇总收入、支出和结余 |
| 图表分析 | 收支走势切换柱状图、折线图；分类收入与支出切换环形图、条形图，列出金额、占比和笔数 |
| 类别管理 | 浏览器本地类别新增、重命名和删除；历史账目的类别继续参与筛选 |
| 全局设置 | 展示币种、六套主题色、深浅模式、默认保存目录和版权信息；点击保存后统一应用 |

账目以用户选择的 JSONL 文件为准。页面刷新后，从空工作台重新打开文件即可继续使用；类别目录单独保存在浏览器 `localStorage` 中。

## 二、运行环境与在线演示

### 2.1 运行环境

| 项目 | 配置 |
| --- | --- |
| 应用形态 | React 单页应用，纯前端运行，静态资源部署到 GitHub Pages |
| 框架与语言 | React 19.3.1、TypeScript 5.9.3 |
| 构建与样式 | Vite 7.3.7、Tailwind CSS 4.3.5、shadcn/ui |
| 图表与测试 | Recharts 3.8.0、Vitest 4.1.12 |
| 文件存储 | UTF-8 JSONL，File System Access API 读写用户选择的文件 |
| 浏览器 | 支持文件接口的桌面 Chrome / Edge，通过 localhost 或 HTTPS 访问；建议窗口宽度至少 1280px |
| 本次本地验证 | macOS 26.6.2、Chrome 157.0.8103.39、Node.js 26.13.0、npm 12.2.1 |
| 项目支持版本 | Node.js 最低 22.12，README 推荐 24；CI 同时检查 22.12 与 24 |

版本取自项目锁文件及本次运行环境。本文的桌面交互和原生文件授权记录均来自 Chrome。

### 2.2 启动与演示步骤

直接访问上方在线地址即可体验。需要本地运行时执行：

```bash
git clone https://github.com/155TuT/AccountingHelper.git
cd AccountingHelper
npm ci
npm run dev
```

在 Chrome 或 Edge 中打开终端显示的地址，通常为 `http://127.0.0.1:5173`。生产构建使用 `npm run build`，生成的静态资源位于 `dist/`。

演示可以按下面的顺序进行：

1. 打开仓库中的 `examples/acceptance.jsonl`，检查三笔账目及收入 100.00 元、支出 27.50 元、结余 72.50 元。
2. 点击“+”查看记账卡片，在金额左侧展开币种列表，填写一笔收支并保存到独立演示账本。
3. 组合类别与金额筛选，观察卡片、表格和图表同步变化，再切换图表样式。
4. 从左侧切换账本、选择日期或定位账目；打开侧栏底部的全局设置，调整主题和展示币种，点击“✓”应用。
5. 刷新页面，重新打开演示账本，检查保存的记录。

## 三、界面与操作展示

总览、记账和筛选图片来自当前 GitHub Pages 页面，数据使用仓库内的三笔验收账；设置页图片沿用同版代码的[桌面验收记录](pr19-verification.md)。演示结束后恢复空工作台。

### 3.1 打开账本，查看收支

左侧按日期列出账目，主区域依次展示汇总、走势、最近记录和分类分析。验收账中的两笔支出分别为饮食 25.50 元、交通 2.00 元，收入为工资 100.00 元。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223619244-609419428.png)

### 3.2 填写一笔记录

记账卡片从右下角展开，保存与取消按钮分别位于左上角和右上角。金额左侧的币种列表提供人民币、美元、欧元、日元、港币和英镑。日期、类别、币种面板互斥，切换面板时保留已输入的内容。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223638584-1114936774.png)

### 3.3 用条件缩小统计范围

选择“饮食”，将金额上下限都设为 25.50 元，可以验证区间边界：结果保留一笔午餐支出，总收入为 0.00 元，总支出为 25.50 元，分类支出占比为 100%。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223653336-861955424.png)

### 3.4 切换图表和深浅色

收支走势切换为折线图后，可以按日期比较变化；分类支出切换为条形图后，金额和占比并排列出。深色模式沿用同一套页面结构，分别调整背景、文字、边框和图表颜色。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223719576-1330675351.png)

### 3.5 把全局偏好放在一起

设置入口位于侧栏底部右侧，与左侧的深浅色按钮对称。窗口提供展示币种、主题色、深浅模式和默认保存目录。主题色包含紫色、青色、蓝色、玫红、琥珀、绿色六套配色，底部列出版权信息。

点击左上角“✓”后，各项修改统一生效；点击右上角“×”、按 Esc 或点击遮罩，保留打开时的设置。主题色与币种分别选择，原有的顶栏币种入口也收进了这个窗口。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223734441-2147142116.png)

默认目录用于首次保存和另存为时定位文件选择器，最终文件名与位置仍由用户选择。目录选择期间暂停其他文件操作，取消选择后保留原目录，清除并保存后恢复浏览器默认位置。这些偏好随当前页面保留，刷新后恢复人民币、紫色和系统深浅模式。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223744532-1921983232.png)

## 四、团队分工与 GitHub 协作

### 4.1 按模块分工

我们先统一账目字段、文件格式和模块边界，再通过个人 Fork 提交 PR。领域层负责金额、校验与统计，存储层负责文件读写，功能层组织交互，页面层负责组合。这样，类别、币种和图表可以围绕共享的数据规则接入。

下表按 GitHub 账号对应成员、负责内容和实际提交，便于从功能追溯到实现记录。

| GitHub 账号 | 姓名 | 负责内容与关键文件 | 工作记录 |
| --- | --- | --- | --- |
| 155TuT | 王智壹 | 项目骨架、基础记账与文件流程、模块整合和交互联调；`src/app/`、`src/features/ledger/workspace.ts` | [初始 MVP：948a3d8](https://github.com/155TuT/AccountingHelper/commit/948a3d8)、[整合：2fd55af](https://github.com/155TuT/AccountingHelper/commit/2fd55af)、[交互调整：6c98c80](https://github.com/155TuT/AccountingHelper/commit/6c98c80) |
| StarrLin7 | 林金晶 | PRD、技术方案、JSONL 保存流程与验收标准；`docs/prd.md` | [PR #1](https://github.com/155TuT/AccountingHelper/pull/1)、[ba22798](https://github.com/155TuT/AccountingHelper/commit/ba22798ab20b5dbb42e0564ae0828b54a2ac2b55) |
| Machenxii | 马晨曦 | 账本图标、全局配色与深色主题；`public/favicon.svg`、`src/styles/globals.css` | [issue #2](https://github.com/155TuT/AccountingHelper/issues/2)、[PR #9](https://github.com/155TuT/AccountingHelper/pull/9)、[68e59c7](https://github.com/155TuT/AccountingHelper/commit/68e59c7) |
| Mukyng | 林叶鑫 | 验收与鲁棒性测试、CI 修复和版本兼容检查；`test/`、`.github/workflows/ci.yml` | [issue #3](https://github.com/155TuT/AccountingHelper/issues/3)、[PR #10](https://github.com/155TuT/AccountingHelper/pull/10)、[9c4bf9c](https://github.com/155TuT/AccountingHelper/commit/9c4bf9c) |
| Ki-K4 | 李宗欣 | GitHub Pages 自动构建与部署；`.github/workflows/deploy-pages.yml` | [issue #4](https://github.com/155TuT/AccountingHelper/issues/4)、[PR #12](https://github.com/155TuT/AccountingHelper/pull/12)、[05e7f83](https://github.com/155TuT/AccountingHelper/commit/05e7f83) |
| LYanl7 | 郑嘉文 | 总览图表、分类收入与支出分析、图表样式切换；`src/features/statistics/charts.tsx`、`src/domain/ledger/selectors.ts` | [issue #8](https://github.com/155TuT/AccountingHelper/issues/8)、[PR #13](https://github.com/155TuT/AccountingHelper/pull/13)、[d6db29b](https://github.com/155TuT/AccountingHelper/commit/d6db29b) |
| Rophocale-KBlue | 陈柯男 | 侧栏文件树与工具栏按钮布局；`src/app/`、`src/features/ledger/ledger-tree.tsx` | [issue #5](https://github.com/155TuT/AccountingHelper/issues/5)、[PR #14](https://github.com/155TuT/AccountingHelper/pull/14)、[7062faf](https://github.com/155TuT/AccountingHelper/commit/7062faf) |
| 34zkx | 周恪玄 | 本地类别目录及增删改查、历史类别筛选；`src/features/categories/`、`src/infrastructure/storage/category-storage.ts` | [issue #7](https://github.com/155TuT/AccountingHelper/issues/7)、[PR #15](https://github.com/155TuT/AccountingHelper/pull/15)、[839c970](https://github.com/155TuT/AccountingHelper/commit/839c970) |
| baiyi060404 | 陈柏睿 | 多账本工作区、账本和账目选择、浮动记账入口；`src/features/ledger/use-ledger.ts`、`src/features/entries/` | [issue #6](https://github.com/155TuT/AccountingHelper/issues/6)、[PR #16](https://github.com/155TuT/AccountingHelper/pull/16)、[f211e5d](https://github.com/155TuT/AccountingHelper/commit/f211e5d) |
| hydrazZYT | 张洋 | 六种币种、整数换算、展示投影及 JSONL 币种兼容；`src/domain/currency/`、`src/features/currency/` | [issue #11](https://github.com/155TuT/AccountingHelper/issues/11)、[PR #17](https://github.com/155TuT/AccountingHelper/pull/17)、[653ed2d](https://github.com/155TuT/AccountingHelper/commit/653ed2d) |
| Feion-Chen | 陈飞扬 | 全局设置页、六套配色、默认保存目录及保存和取消交互；`src/features/settings/settings-dialog.tsx`、`src/features/theme/use-theme.ts` | [issue #18](https://github.com/155TuT/AccountingHelper/issues/18)、[PR #19](https://github.com/155TuT/AccountingHelper/pull/19)、[4ded66b](https://github.com/155TuT/AccountingHelper/commit/4ded66bb2f519ec70925073e1c9a2600a4ef3d13) |

### 4.2 从分支到可运行页面

成员在各自的 Fork 中完成修改，PR 描述列出功能、关键文件和验证结果，组长再结合主分支处理冲突。涉及公共字段的改动会同时更新测试与文档，例如加入 `currency` 后，旧文件读取、测试数据和统计入口都需要一起调整。

截至 `7ea3c9a`，主分支有 **34 条提交，10 个 PR 已合并**，分别为 #1、#9、#10、#12–#17、#19。下图展示已合并 PR 列表的节选。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223805927-1785852759.png)

提交历史保留了成员的功能提交与组长的整合修改。下面可以看到设置模块的原始提交、合并节点，以及后续修正和验收文档。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223837196-446749441.png)

推送到 `main` 后，Pages 工作流依次执行检查、构建和部署。当前版本的 [部署任务](https://github.com/155TuT/AccountingHelper/actions/runs/42381589242) 已成功，页面通过 HTTPS 提供访问。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223850877-986133498.png)

## 五、关键实现

以下代码节选自 `7ea3c9a`，省略导入并补充中文注释。完整实现可通过各小节的源码链接查看。

### 5.1 金额从输入开始就使用整数分

金额输入先按字符串校验，再拆分整数与小数部分。例如，`25.50` 转为 `2550` 分，`0.1` 转为 `10` 分。计算过程使用 `BigInt`，通过安全整数检查后返回领域层使用的 `number`。

源码：[money.ts · parseMoney](https://github.com/155TuT/AccountingHelper/blob/7ea3c9a/src/domain/ledger/money.ts)。

```ts
export function parseMoney(value: string, allowZero = false): number {
  const normalized = value.trim()
  // 只接受整数或最多两位小数。
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error('请输入金额，最多保留两位小数。')
  }
  const [whole = '0', fraction = ''] = normalized.split('.')
  // 从十进制字符串直接组成整数分，避免浮点乘法产生误差。
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'))
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('金额过大，请调整后再试。')
  if (!allowZero && cents === 0n) throw new Error('金额需要大于 0。')
  return Number(cents)
}
```

记录金额要求大于零，筛选边界通过 `allowZero` 支持零值。同币种合计也检查安全整数范围，展示时再转换成两位小数。

### 5.2 文件写入完成，界面才提交新状态

文件保存包含“写入”和“关闭流”两个步骤。`writeFile` 等待两步完成；其中任一步失败，都会尝试中止写入并把错误交回上层。

源码：[file-system.ts · writeFile](https://github.com/155TuT/AccountingHelper/blob/7ea3c9a/src/infrastructure/storage/file-system.ts)。

```ts
async function writeFile(handle: LedgerFileHandle, content: string): Promise<void> {
  const stream = await handle.createWritable({ mode: 'exclusive' })
  try {
    await stream.write(content)
    await stream.close() // 文件流关闭成功后，调用方才能继续。
  } catch (error) {
    await stream.abort().catch(() => undefined)
    throw error
  }
}
```

工作区控制器接着完成状态更新。它在异步操作开始时确定目标账本，保存结束后只替换这一本的内容，通知订阅界面更新。

源码：[workspace.ts · persist](https://github.com/155TuT/AccountingHelper/blob/7ea3c9a/src/features/ledger/workspace.ts)。

```ts
async function persist(ledger: LedgerWorkspace, entries: LedgerEntry[], saveAs = false) {
  // 等待已有文件保存，或通过文件选择器创建新文件。
  const session =
    ledger.session && !saveAs
      ? await storage.save(ledger.session, entries)
      : await storage.create(
          entries,
          (handle) => checkTarget(ledger, handle),
          state.defaultDirectory, // 首次保存和另存为使用设置中的起始目录。
        )
  // 文件提交成功后，才发布新的账目和文件状态。
  update({
    ledgers: state.ledgers.map((item) =>
      item.id === ledger.id ? { ...ledger, entries, session, name: session.handle.name } : item,
    ),
  })
}
```

保存前还会比对文件内容与上次快照；发现外部修改时提示重新打开。打开多个文件时，整批解析与校验通过后一次更新工作区，格式错误会带上文件名和行号。

### 5.3 原币记录与展示换算分开

每笔记录保存原始币种和整数分。用户切换展示币种时，`projectEntries` 为需要换算的账目创建展示副本，之后的筛选、表格与统计共用这份结果。写文件继续使用原始账目。

源码：[projection.ts · projectEntries](https://github.com/155TuT/AccountingHelper/blob/7ea3c9a/src/domain/currency/projection.ts)。

```ts
export function projectEntries(
  entries: readonly LedgerEntry[],
  currency: CurrencyCode,
): LedgerEntry[] {
  return entries.map((entry) =>
    entry.currency === currency
      ? entry
      : {
          ...entry, // 保留原记录，生成用于展示的新对象。
          currency,
          amountCents: convertCents(entry.amountCents, entry.currency, currency),
        },
  )
}
```

例如，10 美元按内置参考值展示为 71.00 元，JSONL 仍保存 `currency: "USD"` 和 `amountCents: 1000`。汇率采用演示参考值，每笔换算后四舍五入到分再汇总；旧账目缺少币种字段时按人民币读取。六种币种统一使用 100 分 = 1 单位，日元也沿用这一格式约定。

### 5.4 所有统计共用筛选结果

日期、类别和金额条件在领域层一次完成。区间包含两端，多个条件取交集；输入区间由 `validateFilters` 先行校验。

源码：[selectors.ts · filterEntries](https://github.com/155TuT/AccountingHelper/blob/7ea3c9a/src/domain/ledger/selectors.ts)。

```ts
export function filterEntries(
  entries: readonly LedgerEntry[],
  filters: LedgerFilters,
): LedgerEntry[] {
  validateFilters(filters)
  const min = filters.minAmount.trim() ? parseMoney(filters.minAmount, true) : 0
  const max = filters.maxAmount.trim()
    ? parseMoney(filters.maxAmount, true)
    : Number.MAX_SAFE_INTEGER
  // 每笔账目同时满足所有已填写条件，才进入后续展示与汇总。
  return entries.filter(
    (entry) =>
      (!filters.startDate || entry.date >= filters.startDate) &&
      (!filters.endDate || entry.date <= filters.endDate) &&
      (!filters.category || entry.category === filters.category) &&
      entry.amountCents >= min &&
      entry.amountCents <= max,
  )
}
```

收支卡片、每日走势、分类分析和账目表格读取同一份筛选结果。分类收入和分类支出分别使用各自的合计作为占比分母，便于核对明细与图表。

### 5.5 设置在确认后统一应用

设置窗口每次打开都从当前偏好初始化临时值，选择目录也先保留在窗口内。点击保存后，页面先检查币种切换与筛选金额的换算结果，再应用主题和目录；关闭窗口则丢弃这次修改。

源码：[app.tsx · saveSettings](https://github.com/155TuT/AccountingHelper/blob/7ea3c9a/src/app/app.tsx)、[settings-dialog.tsx](https://github.com/155TuT/AccountingHelper/blob/7ea3c9a/src/features/settings/settings-dialog.tsx)。

```ts
function saveSettings(values: SettingsValues): boolean {
  // 先检查币种切换及筛选金额换算，失败时保留原设置。
  if (!switchCurrency(values.currency)) return false
  // 币种检查通过后，统一应用其余偏好。
  setTheme(values.theme)
  setThemeColor(values.themeColor)
  ledger.setDefaultDirectory(values.defaultDirectory)
  toast.success('设置已保存')
  return true
}
```

目录选择复用工作区的忙碌状态，期间暂停保存、关闭和其他文件操作。目录权限错误直接显示在设置窗口内，方便用户就地处理。

## 六、我们着重打磨的三处设计

### 6.1 把文件保存做成完整流程

账本由用户选择位置，JSONL 每行记录一笔账目，便于查看、复制和备份。金额精度、整批读取校验、写入完成后更新界面、外部修改检测共同保证操作结果清楚。保存失败时，原账本与已填写内容继续保留，用户可以处理原因后重试。

### 6.2 围绕当前账本组织操作

文件树承担账本切换、日期筛选和账目定位，主区域留给记录与统计，新增入口固定在右下角。设置页再把全局偏好集中起来，主题色与展示币种可以分别选择。操作频率不同的功能各有位置，日常使用主要围绕“选账本、记一笔、看结果”展开。

### 6.3 让数字、明细和图表对得上

六种币种通过统一的展示投影进入筛选与统计，金额范围随展示币种换算。收入、支出各自呈现分类结构，图表切换只改变表现方式。用户可以从总额看到某一类别的占比，再回到表格检查具体账目。

## 七、测试与验证

2026 年 11 月 7 日，在 `7ea3c9a` 上重新执行 `npm test` 和 `npm run build -- --base=/AccountingHelper/`：**10 个测试文件、82 项测试全部通过，TypeScript 检查及 Pages 子路径生产构建通过**。文档整理后，`npm run format:check` 与 `git diff --check` 通过，本地文档链接和图片引用均有效。

| 检查范围 | 覆盖的行为 |
| --- | --- |
| 金额与统计 | 小数精度、日期有效性、区间边界、筛选交集、排序、合计溢出和图表口径 |
| 币种 | 六种币种换算、四舍五入、展示溢出和原始记录保留 |
| 类别 | 增删改、重名、最后一个类别保护、存储异常、历史类别继续筛选 |
| JSONL 与文件 | 编解码往返、坏行行号、重复标识、取消操作、写入失败清理和快照冲突 |
| 多账本工作区 | 相同账目 ID 的跨账本选择、批量打开回滚、句柄去重、串行保存、关闭流失败和另存为保护 |
| 全局设置与目录 | 目录选择与提交分离、取消和权限错误、操作串行、首次保存与另存为的起始目录、清除目录和安全上下文检测 |
| 跨模块与界面输出 | 三笔验收账、旧格式兼容、混合币种保存、空状态、文本转义、分页和定位高亮 |

文件与工作区的异常测试使用模拟句柄，界面输出测试使用 React 服务端渲染。桌面交互另行验证：本次通过 Chrome 原生选择器打开验收账本，核对收支总额，实际切换深浅色、图表样式、币种面板，并验证“饮食 + 25.50 元上下限”的筛选结果。

设置页的[桌面验收](pr19-verification.md)覆盖六套配色的深浅模式、保存与取消、目录选择及首次保存：选择临时目录后新增 12.34 美元支出，原生保存对话框从该目录打开；切换人民币后显示 87.61 元，磁盘保留 USD 1234 分。清除目录并刷新后，页面恢复空工作台。此前的真实保存、重新打开和外部修改验收见 [testing.md](testing.md)。

同一提交的 [CI 任务](https://github.com/155TuT/AccountingHelper/actions/runs/42381589269) 中，9 个任务全部成功：Node.js 22.12 与 24 分别检查格式和构建，最低版本执行完整测试，Node.js 24 另跑 7 个模块测试任务。

![image](https://img2024.cnblogs.com/blog/3847441/202611/3847441-20261107223948890-536676419.png)

## 八、三次值得复盘的联调

开发中的反复主要集中在测试接入、共享模块整合和连续操作的体验检查。下面结合 PR、提交和验收记录，整理三次具体处理过程。

### 8.1 从三笔验收账扩展到异常测试

[issue #3](https://github.com/155TuT/AccountingHelper/issues/3) 指出了现有 CI 的问题。林叶鑫（`Mukyng`）在 [PR #10](https://github.com/155TuT/AccountingHelper/pull/10) 中加入独立的 `test/` 目录，把三笔验收账、金额与日期边界、筛选交集、JSONL 往返，以及写入失败、快照冲突和合计溢出纳入检查。同时修复格式问题，将 Node.js 22.12 和 24 放入兼容性矩阵。

这一轮工作需要同时处理测试入口、构建配置和文档格式。PR 阶段的 37 项测试通过后，后续模块继续加入用例，当前完整测试增长到 82 项。我们把验收场景写成可反复执行的检查，字段或行为发生变化时同步补上边界用例。

### 8.2 多账本、类别和币种在同一处汇合

\#14–\#17 分别修改布局、类别、多账本和币种，其中 `app.tsx`、`use-ledger.ts`、`entry-form.tsx` 被多个分支共同触及。[PR #17](https://github.com/155TuT/AccountingHelper/pull/17) 提前列出了与 #16 的冲突点，并说明新增 `currency` 字段对测试数据的影响。

整合时以多账本结构为基础接入类别与币种：每次保存先确定目标账本，原始账目用于持久化，换算结果用于展示。随后检查批量打开、跨账本选择、混合币种保存，以及分类筛选是否仍然一致。[提交 2fd55af](https://github.com/155TuT/AccountingHelper/commit/2fd55af) 保留了这轮整合结果。

这一过程说明，共享文件的冲突背后往往是状态归属和数据流的变化。先约定“哪份数据负责保存、哪份数据负责显示”，再接入界面，联调时更容易定位问题。

### 8.3 沿着连续操作检查交互

多账本接入后，页面先出现了右侧明细和抽屉式记账。后续联调把账目选择统一为表格定位，把新建账目调整为无蒙层的浮动卡片，并继续处理日期、类别和币种弹层的切换。

[提交 6c98c80](https://github.com/155TuT/AccountingHelper/commit/6c98c80) 将这些交互收拢到统一流程：同一表单只展开一个选择面板，Esc 优先关闭当前面板，保存失败保留输入，文件树操作支持悬停提示与键盘聚焦。[测试记录](testing.md) 还覆盖了日期与类别单击切换、方向键选择、Enter 提交和分页定位。

设置页接入后，同样需要检查连续操作：改主题、选目录、取消，再次打开；或选好目录、保存设置，再新增一笔账。[提交 8265f1c](https://github.com/155TuT/AccountingHelper/commit/8265f1c) 将目录候选值与已保存设置分开，并在原生选择器打开期间暂停其他文件操作。随后通过真实文件保存，确认默认目录与原币金额都符合预期。

从记账卡片到全局设置，检查单位都是一段完整操作。把输入、切换、取消、保存和回看结果连起来，才能看清焦点、临时修改和文件状态在各模块之间怎样传递。

## 九、成员团队编程体验

本节由成员本人填写，可结合负责模块、一次具体问题、协作过程和下一次的改进说明个人体验，并如实记录 AI 辅助范围。

| 成员 | 个人编程与协作体验 |
| --- | --- |
| 王智壹 | 的确不太熟悉这种多人合作式的敏捷开发，任务分配比较手忙脚乱，给大家添麻烦了 |
| 郑嘉文 | 学到了很多 |
| 林叶鑫 | 虽然个人按照原分工工作没有问题，但总体分工耦合度确实略高，需要更明确的分工 |
| 张洋 | 负责币种切换和金额换算，体会到统一数据格式的重要性。下次会提前和其他模块对齐接口 |
| 陈飞扬 | 我负责全局设置模块，完成了设置浮层、全局币种切换、六套主题色、深浅模式和默认保存目录，并补充了相关测试与文档。实现过程中，我重点处理了设置草稿与已保存状态的分离，使关闭设置页不会误应用修改；同时将主题色与币种解耦，统一了页面视觉和交互逻辑。最终代码通过 78 项测试、生产构建和浏览器实际验证，也让我更熟悉了 Git 分支、Fork 和 Pull Request 的协作流程。 |
| 周恪玄 | 完成了类别管理，也更熟悉了本地存储和历史数据的处理。小功能同样需要考虑边界情况 |
| 李宗欣 | 完成了 GitHub Pages 自动部署，也认识到自己的工程能力和团队配合仍有不足。之后会继续提升，让交付更稳定。 |
| 陈柏睿 | 负责多账本和记账入口，联调中加深了对状态管理的理解。以后会尽早和界面模块一起验证 |
| 马晨曦 | 调整了图标、配色和深色主题，更注意到文字、按钮和图表的风格统一。后续会加强界面细节检查 |
| 林金晶 | 整理了需求、技术方案和验收标准，体会到把规则写清楚能减少联调中的反复，也方便大家分工 |
| 陈柯男 | 完善了主界面的部分UI，太弱小了没有力量，希望能不断提升个人水平与配合度以提高成品精度 |

## 十、项目与记录入口

- [GitHub Pages 在线体验](https://155TuT.github.io/AccountingHelper/)
- [团队仓库：155TuT/AccountingHelper](https://github.com/155TuT/AccountingHelper)
- [main 分支提交记录](https://github.com/155TuT/AccountingHelper/commits/main/)
- [已合并 PR](https://github.com/155TuT/AccountingHelper/pulls?q=is%3Apr+is%3Amerged)
- [GitHub Actions](https://github.com/155TuT/AccountingHelper/actions)
- [产品需求](prd.md)、[架构说明](architecture.md)、[JSONL 格式](data-format.md)、[验收与测试](testing.md)、[设置页验收](pr19-verification.md)
