# 从 Custom 开始定制博客园

这里保存「少年漫症候群」博客的定制源码和操作教程。使用博客园预设 **Custom** 作为基础，逐步加入 Fusion Pixel 字体、正文链接 favicon，以及侧栏个人卡片、顶栏搜索、径向设置和正文图像样式。CSS 与 JavaScript 分开维护，不需要安装 Silence 等完整主题。

示例页面：[博客首页](https://www.cnblogs.com/155TuT/) · [随笔详情](https://www.cnblogs.com/155TuT/p/22857676)。截至 2026-09-08，顶栏统一为左侧标题、右侧搜索，统计在所有尺寸下都放到页脚；删除六个导航按钮；右下角“更多设置”展开齿轮管理、日/月配色切换，两个图标在 15°/75° 处展开。默认采用浏览器配色；手机顶栏单行、54px 高，右侧为圆形搜索按钮。顶栏左内边距为 16px，上下及右内边距为 4px。桌面侧栏由 230px 缩至 220px，粉丝/关注框间距为 4px。文章标题使用 Markdown 一级标题的 28px 字号，正文与摘要图片采用 22px 圆角描边并裁切四角。所有 22px 圆角卡片、粉丝/关注框和内容图片共用右下角两条细斜线与小三角。各轮验证结果及未验证事项见 [验证记录](docs/verification.md)。

## 准备

1. 在博客后台申请并开通 JS 权限。本例已经开通；只有字体样式时不需要运行 JavaScript，favicon 和组件改造需要。
2. 备份自己现有的「页面定制 CSS 代码」「页首 HTML 代码」「页脚 HTML 代码」、皮肤名称和控件设置。已有代码应先合并，避免覆盖自己的功能。
3. 在 [博客设置](https://i.cnblogs.com/settings) 选择 **Custom**，保持「禁用模板默认 CSS」**未勾选**。这套增量样式依赖 Custom 的基础布局。
4. 打开 [偏好设置](https://i.cnblogs.com/preference) 的「侧边栏控件」，**取消勾选「日历」和「找找看」**，保留**「公告」**，然后保存。个人卡片需要原生 `#profile_block` 的昵称、粉丝与关注信息；公告富文本会显示在卡片底部。当前搜索由页首脚本独立创建，已不依赖侧栏「找找看」控件；即使控件开启，代码也会清理旧侧栏搜索。

为什么选择 Custom：博客园把它列为主题设计的标准模板；不同皮肤的 ID 和层级并不相同。这里使用 `#home`、`#mainContent`、`#sideBar` 等标准结构，没有“选择器数量最多”的官方排名。参见 [官方皮肤列表](https://www.cnblogs.com/Skins.aspx) 和 [本地选择器清单](docs/selectors.md)。

## 安装

### 1. 托管字体

将 [fonts/fusion-pixel-12px-zh-hans-2026-09-01.css](fonts/fusion-pixel-12px-zh-hans-2026-09-01.css) 上传到**你自己的**博客园「文件」页面，取得可直接访问的 CSS 地址。

这个文件已把简体中文 WOFF2 字体内嵌到 `@font-face`，上传这一个 CSS 即可使用；保留原始 WOFF2 是为了方便学习和以后重新生成。不要把约 866 KiB 的字体 CSS 全文粘进页面设置。

打开 [page-custom.css](page-custom.css)，将开头 `@import url(...)` 的示例地址改为你的文件地址。当前示例引用的是本博客的公开文件地址，别人复用教程时应自行托管，避免依赖示例账号。`@import` 必须放在普通 CSS 规则之前。来源、版本、校验和及许可证见 [fonts/README.md](fonts/README.md)。

### 2. 填入 CSS

将修改后的 [page-custom.css](page-custom.css) 全文粘贴到后台的**「页面定制 CSS 代码」**。这里是字体、favicon、个人卡片、顶栏与搜索、径向按钮、文章标题、图片圆角及明暗配色的唯一样式入口。

### 3. 配置并生成页首、页脚脚本

打开 [scripts/blog-shell.js](scripts/blog-shell.js)，将顶部 `owner` 中的主页地址 `home`、名字 `name` 和头像 `avatar` 换为自己的资料。不要使用平台顶栏 `#user_icon`：它属于当前登录的访客，访问者不同就可能变成别人的头像。

修改任一 JS 后，在本目录运行下面的命令，同时生成页首和页脚文件（需要本机已安装 Node.js）：

```sh
node scripts/build-footer.mjs
```

将 [page-header.html](page-header.html) 全文放到后台的**「页首 HTML 代码」**，它负责尽早整理顶栏原生节点、创建桌面/手机搜索和侧栏卡片、挂载径向设置并跟随浏览器配色；将 [page-footer.html](page-footer.html) 全文放到**「页脚 HTML 代码」**，它包含 [图片外框脚本](scripts/blog-outline.js) 和正文 favicon 脚本。两份文件均以 `<script>` 包住脚本，不包含 `<style>` 或行内布局样式。

独立 JS 是维护入口，每次修改后都重新运行生成命令；不需要在 HTML 中再手工修改同一份代码。未修改源码时，可直接使用已生成文件。不要继续在页脚保留旧版组件脚本。

示例博主头像为 `https://pic.cnblogs.com/face/3847441/20260902151731.png`。卡片先显示配置的作者资料，粉丝、关注数先显示 `—`；原生资料到达后更新昵称、链接和统计数字，不填写旧数字伪装已加载。

顶栏的名字与签名使用博客园原生 `#blogTitle`（含标题、签名节点），脚本只移动它，不重新复制文字。要修改顶栏标题和签名，仍在博客园后台修改对应内容；`owner.name` 主要供资料卡片初始化后备使用。

### 4. 搜索图标是否要上传

默认搜索图标是脚本内嵌的 SVG，没有图片请求，**不需要上传**。[icons/search.svg](icons/search.svg) 是同一图形的独立参考文件，便于在矢量编辑器中修改。小型自绘 SVG 可以直接替换脚本里的图形，样式继续放在 CSS。

如果更喜欢上传文件，当前博客园「文件」页允许 `.svg`，自绘 SVG 可以像字体 CSS 一样上传到那里，再把 `owner.searchIconUrl` 从空字符串改为该公开 HTTPS URL。此项已核对上传界面允许的扩展名，本轮没有实际上传 SVG，因为默认内嵌图标不需要它。

当前「文件」页的允许列表不含 PNG 和 WebP；这两类图片需使用另行支持该格式的图片库或其他公开托管服务，取得可访问地址后同样可填入 `owner.searchIconUrl`。修改后重新生成并保存页首代码。使用 URL 会产生一个图片请求；不要填本地文件路径。

### 5. 保存并检查

保存三处代码，刷新博客首页与文章页。顶栏原生标题和签名保留，六个导航按钮从 DOM 移除；名称仍可返回博客首页。

顶栏所有断点均为单行，高 54px：搜索控件高 44px，上下和右侧内边距各 4px，左侧 16px，另计 1px 外壳边框。桌面搜索框与手机圆形搜索按钮都靠右，标题没有独立描边和角饰；侧栏卡片采用下述公共角饰。

767px 及以下顶栏显示标题和靠右的 44px 圆形搜索按钮。点击后在顶栏下方浮出输入框，自动聚焦；再次点击、Escape 或点外部收起，不改变顶栏高度。页面左右 12px 外边距，侧栏隐藏。768px 及以上为标题和搜索框单行。所有尺寸下统计原节点均放在页脚，窗口缩放时也保持在页脚；随页面内容向下滚动到达，不悬浮遮挡正文。横屏至少 1024px 时，内容继续居中占约 70% 宽度。

侧栏内容宽度与资料卡宽度为 220px，通过 `--blog-sidebar-width` 统一维护，比 Custom 原来的 230px 减少 10px；主栏左侧预留也由 264px 减至 254px。粉丝数/关注数两列间距由 8px 收为 4px。公告清除原模板继承的 `word-break:break-all`，让“2601”等数字和英文单词尽量保持完整，超长内容仍可折行。

右下角 44px 的“…”按钮展开两个圆形图标：从向左方向朝上计算，15° 为日/月切换、75° 为齿轮管理，中心距均为 72px。没有列表面板和“跟随浏览器”选项。每次打开默认读取浏览器配色，手动切换仅作用于当前页；浏览器偏好改变时重新跟随。支持 Escape、点外部和焦点移出关闭，并考虑手机安全区。

文章页与首页列表的文章标题统一为 28px、700 字重、1.5 倍行高，对齐当前平台 Markdown 一级标题。顶栏博客名称继续使用自身字号。`--blog-article-title-size` 是文章标题与正文 H1 的共享变量。

正文和首页摘要图片使用 1px 描边、22px 圆角，图片像素本身随四角裁切；没有裁切图片的中央区域或改变原始文件。`--blog-outline-radius` 同时控制图片与侧栏卡片、粉丝/关注框的圆角。头像保持圆形，正文链接 favicon 不加轮廓。图片原有点击放大继续可用。

22px 圆角组件使用公共类 `.blog-outline-card`：个人卡片、粉丝数/关注数链接和图片外框共用同一个 `::after`。角饰参考 Win95 窗口右下的斜纹，保留靠外的两条 0.8px 细线和 3px 小三角，已去掉最贴近卡片圆弧的那条线。亮色下为黑色，暗色下随主题改为浅色；小三角的水平边、竖直边与组件外边界的延长线对齐。角饰不接收点击，不承担拖动缩放功能。胶囊搜索、圆形头像与圆形浮动按钮不属于 22px 卡片。

图片外框由脚本包住原 `<img>` 节点，原图继续负责 22px 像素裁切，外框负责角饰；不复制图片或替换原节点。首页缩略图的 135px 宽度、右浮动及间距保留。新增普通卡片时加 `.blog-outline-card` 并使用 1px 边框，即可复用角饰；无边框包装层设置 `--blog-corner-inset:0px`。外观只改 CSS 中这一处公共规则。

统一角饰改造前的 CSS、两份 HTML、页首 JS 和生成器保存在 [backup/before-shared-corners-20260907](backup/before-shared-corners-20260907/)。回滚线上版本时成套恢复该目录中的 CSS 与两份 HTML；回滚本地维护版本还需恢复 `blog-shell.js`、`build-footer.mjs` 到 `scripts/` 后重新生成。更早的 16px 间距/文章图像改造、径向设置和浮动设置分别保存在 `before-article-outline-20260907`、`before-radial-tools-20260907`、`before-floating-settings-20260907`。

2026-09-08 的页脚统计、靠右搜索和侧栏缩窄改造前版本保存在 [backup/before-footer-stats-20260908](backup/before-footer-stats-20260908/)。撤回本轮时恢复其中的 CSS 和页首 HTML；本地维护版本同时恢复 `blog-shell.js` 到 `scripts/`。页脚脚本本轮没有修改。

## 当前功能与源码

以下是本次会话全部改动合并后的最终版本；旧断点与旧菜单只保留在备份和历史验证中。

| 功能 | 最终行为 | 维护入口 |
|---|---|---|
| 基础模板与字体 | Custom 保留默认 CSS，Fusion Pixel 2026.09.01 | `page-custom.css`、`fonts/` |
| 顶栏布局 | 各断点高 54px、上下和右侧 4px、左侧 16px；左侧标题、右侧搜索 | `page-custom.css` |
| 原生导航 | 移除博客园、首页、新随笔、联系、订阅、管理六个按钮；标题链接返回博客首页 | `scripts/blog-shell.js` |
| 桌面搜索与统计 | ≥768px 搜索框距顶栏右内边缘 4px；所有尺寸下统计原节点都位于页脚 | CSS、`blog-shell.js` |
| 手机搜索 | ≤767px 顶栏保持标题加圆形搜索按钮一行，点击浮出输入框；支持收起与搜索提交 | CSS、`blog-shell.js` |
| 右下设置 | 更多按钮向左上展开 15° 明暗按钮与 75° 管理链接；44px 圆形、半径 72px，无列表面板 | CSS、`blog-shell.js` |
| 明暗配色 | 每次加载默认跟随浏览器；手动仅切换当前页；无跟随选项、状态文案和持久化覆盖 | CSS、`blog-shell.js` |
| 文章标题 | 首页与详情页文章标题为 28px，与正文 Markdown H1 共用字号变量 | `page-custom.css` |
| 内容图片 | 正文及摘要图片 22px 圆角、1px 描边，四角实际裁切；原图外框承载角饰，保留源图和放大功能 | CSS、`scripts/blog-outline.js` |
| 公共角饰 | 全部 22px 卡片、粉丝/关注框与图片共用两条 0.8px 细线及 3px 三角，右边与底边对齐 | CSS 的 `.blog-outline-card::after` |
| 个人资料 | 圆形头像、昵称、两列粉丝/关注、原公告及链接；手机隐藏整个侧栏 | CSS、`blog-shell.js` |
| 侧栏宽度与间距 | 侧栏/资料卡宽 220px，主栏预留 254px；粉丝/关注框间距 4px，公告避免拆开短数字和单词 | `page-custom.css` |
| 正文 favicon | 仅正文 HTTP(S) 链接，1em 随字号变化；头像和 favicon 不受新图片轮廓影响 | CSS、`scripts/blog-custom.js` |
| 页面宽度 | ≥1024px 且横屏约 70% 居中；手机左右页面外边距 12px | `page-custom.css` |

卡片从上到下的结构为：

```text
      圆形头像
    少年漫症候群
  粉丝数      关注数
    xx          xx
       公告富文本
```

粉丝和关注两列分别有独立的 22px 圆角描边；公告仍在博客园后台编辑，脚本移动原富文本节点，保留其中的链接。

本博客已在后台关闭日历控件，CSS 仍隐藏旧日历作为缓存或复用场景兜底。单纯 CSS 隐藏不等于取消服务器请求，所以教程安装步骤仍应关闭后台控件。

提前初始化与空间预留用于减少组件插入带来的跳动；目前仍保留外部字体 CSS 的 `@import` 和 `font-display: swap`，冷缓存或慢网可能先显示后备字体再替换。这里不承诺零样式闪现、零布局位移，详见 [实现说明](docs/implementation.md)。

## 修改入口与目录

```text
blogcustom/
├─ README.md                   安装与维护入口
├─ page-custom.css             粘贴到页面定制 CSS
├─ page-header.html            粘贴到页首 HTML，尽早创建框架组件
├─ page-footer.html            粘贴到页脚 HTML
├─ scripts/
│  ├─ blog-shell.js            顶栏、搜索、资料卡片、浮动设置与配色
│  ├─ blog-outline.js          正文和摘要图片外框，复用公共角饰
│  ├─ blog-custom.js           页脚正文 favicon
│  └─ build-footer.mjs         同时生成页首与页脚 HTML
├─ icons/search.svg            默认搜索图标的独立参考文件
├─ fonts/                      已部署字体 CSS、原始 WOFF2、来源说明
├─ licenses/                   字体及其上游附带许可证
├─ docs/
│  ├─ selectors.md             Custom 结构与选择器
│  ├─ implementation.md        字体、favicon、组件改造原理
│  └─ verification.md          验证范围与记录
└─ backup/                     改造前设置备份
```

改颜色、边框、圆角、角饰、头像大小和断点时编辑 CSS；改作者资料与搜索图标时编辑 `blog-shell.js`；改图片外框时编辑 `blog-outline.js`；改正文 favicon 时编辑 `blog-custom.js`。JS 修改后运行 `node scripts/build-footer.mjs`。具体机制见 [实现说明](docs/implementation.md)。部署已生成的 CSS/HTML 不依赖工具链；真正执行的是后台保存的三处代码，仅修改本地文件不会自动更新博客。
