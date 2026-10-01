# Custom 结构与选择器

本教程基于博客园预设 Custom，默认 CSS 保持启用。选择 Custom 是为了使用官方标准模板和常见主题文档中的结构，不表示它在任何页面都拥有所有节点。控件开关、页面类型和异步内容会影响实际 DOM。

## 主要层级

```text
#home
├─ #header
│  └─ #navigator            ← 胶囊顶栏外壳
│     ├─ #blog-header-left
│     │  └─ #blogTitle      ← 移动原生标题与签名；#navList 已删除
│     ├─ #blog-header-search ← 页首脚本独立创建的搜索表单
│     └─ #blog-mobile-search ← 手机圆形搜索按钮
├─ #main
│  ├─ #mainContent
│  │  └─ .forFlow
│  │     ├─ 首页：.day
│  │     └─ 详情：#post_detail → #topics → .postBody → #cnblogs_post_body
│  └─ #sideBar
│     └─ #sideBarMain
│        ├─ 公告与个人资料区域 → 本次生成个人卡片
│        └─ #blog-sidecolumn → 分类、归档、阅读排行等
└─ #footer
   └─ .blogStats            ← 原生四项统计，所有尺寸都放在页脚
```

这是布局示意，省略了一些包装节点。大小写有意义，`#sideBar` 不能写成 `#sidebar`。

## 原生选择器

| 目标 | 选择器 | 使用边界 |
|---|---|---|
| 博客主体 | `#home` | 当前字体应用的根容器，不覆盖平台顶栏；与 `#main` 一起清除默认最小宽度 |
| 标题与签名 | `#blogTitle`、`#Header1_HeaderTitle`、`#blogTitle h2` | 原生节点移入 `#blog-header-left`，内容仍由后台维护 |
| 导航 | `#navigator`、`#navList` | outline 顶栏；原生 navList 在初始化时移除 |
| 页面统计 | `.blogStats`、`#footer > .blogStats` | 所有尺寸下原节点都移入页脚，保留平台数字更新 |
| 主栏 | `#mainContent`、`#mainContent .forFlow` | 桌面左预留 254px；窄屏取消为侧栏预留的空间 |
| 侧栏 | `#sideBar`、`#sideBarMain` | ≥768px 内容宽 220px，外层 sticky，`--blog-sidebar-top-gap:12px` 统一计算 `top` 和最大高度，资料卡距视口顶部 12px；短窗口内纵向滚动；767px 及以下整体隐藏 |
| 首页列表 | `.day`、`.dayTitle`、`.postTitle`、`.postCon`、`.c_b_p_desc`、`.postDesc` | 不把首页摘要当作文章正文添加 favicon |
| 详情正文 | `#post_detail`、`#topics`、`.postBody`、`#cnblogs_post_body` | favicon 的扫描范围严格限定为最后这个容器 |
| 互动与作者区 | `#blog_post_info_block`、`#green_channel`、`#author_profile`、`#div_digg` | 不参与正文 favicon 装饰 |
| 评论 | `#blog-comments-placeholder`、`#comment_form`、`#comment_form_container` | 不参与正文 favicon 装饰 |
| 公告和个人资料 | `#blog-news`、`#sidebar_news`、`#sidebar_news_container`、`#profile_block` | 资料异步到达；保留原始数据供卡片读取 |
| 日历 | `#blog-calendar`、`#blogCalendar` | 后台关闭，CSS 隐藏旧容器作为兜底 |
| 旧侧栏搜索 | `#sidebar_search`、`#widget_my_zzk` | 当前已不依赖；后台找找看关闭，脚本清理缓存或重复节点 |
| 其他侧栏 | `#blog-sidecolumn`、`#sidebar_postcategory`、`#sidebar_postarchive`、`#sidebar_topviewedposts` | 数据和控件存在时出现，仍归属于侧栏 |
| 页脚 | `#footer` | 框架链接不增加 favicon |

LuxInteriorLight 的 `#container`、`#content`、`#sidebar-a` 不适用于当前 Custom 布局。更换皮肤时需要重新检查实际 DOM，而不是补出几个同名空节点来兼容旧样式。

## 文章底部与评论

`#blog_post_info` 与 `#comment_form .commentbox_main` 复用 `.blog-outline-card`，在各自区域把 `--blog-outline-radius` 改为 14px。`#green_channel` 的四个操作和 `#div_digg .diggit/.buryit` 的两枚投票位于同一行，`#author_profile` 隐藏。`.blog-post-icon` 为统一 SVG；`.blog-action-label`、`.blog-vote-label` 为操作文字。文章容器宽度 ≤620px、视口宽度 ≤767px 或竖屏时，文字与原 `.diggnum/.burynum` 计数视觉隐藏，按钮只显示图标，原节点仍供辅助技术读取。

`#post_next_prev` 使用三列网格：`.blog-post-prev`、`.blog-post-license`、`.blog-post-next` 分别放置上一篇、固定版权链接和下一篇。原生 `.p_n_p_prefix` 链接保留，内部加入方向图标与 `.blog-post-nav-label`；文章名称链接保留并添加 `.blog-post-nav-title`。`.blog-license-label` 是“版权协议：”前缀。窄屏或竖屏隐藏文章名称和版权前缀，仍可点击上一篇／下一篇及中间的 CC BY-NC-SA 4.0 链接。

`#blog-comments-placeholder` 清除两侧浮动，避免评论区域绕到 Custom 的 `#topics` 侧边。确认零评论且列表加载完成后，脚本补入原样式类 `.feedback_area_title`、`#comment_sort` 排序栏和 `.blog-comments-empty` 的“虚位以待”；有评论时继续沿用平台原生列表。空态的创建与移除条件见 [实现说明](implementation.md)。

编辑与预览沿用 `#btn_edit_comment`、`#btn_preview_comment`，原 `.commentbox_title_left` 添加 `.blog-comment-tabs` 成为一组滑块，`.blog-comment-tab-label` 保留文字，`aria-pressed` 跟随原生激活类。评论输入、工具栏和提交控件保持原 ID；原 `#commentbox_opt` 移入 `.commentbox_footer` 左侧，`#ubb_auto_completion` 位于同一底栏右侧。底栏的 `display: flex !important` 保持提交／退出在原生预览模式中可见。

## 文章标题与内容图片

- `#cnblogs_post_body` 的 `--blog-body-size:13.6px`：正文基准字号，`p/li/th/td` 继承；原生基线为 12px。
- `#home .postTitle`：首页和详情页文章标题，与 `#cnblogs_post_body h1` 共用 `--blog-article-title-size:30px`；H2–H6 分别为 23/18/16/14/13px，各标题比原始字号增加 2px。
- `#cnblogs_post_body :not(pre) > code`：行内代码继承周围文字字号，代码块沿用原规则。
- `#cnblogs_post_body img:not(.blog-link-favicon-slot img)`、`#home .postCon img`：正文和摘要图片直接加圆角边框，像素四角随 22px 半径裁切；页脚脚本为每张原图包一层角饰外框。
- `.blog-image-frame.blog-outline-card`：贴合图片尺寸的角饰外框；`.blog-image-frame--summary` 保留首页缩略图的右浮动与尺寸。
- `--blog-outline-radius`：图片、侧栏卡片与两列关注统计框默认共用 22px；文章互动卡片与评论编辑器在自身作用域覆盖为 14px；头像与 favicon 独立。

## 本教程新增的节点

favicon 使用 `.blog-link-favicon-slot` 包住装饰性 `<img>`，插入链接首部；图片 `alt` 为空并隐藏于辅助阅读技术，链接文本和点击目标保留。

个人卡片与顶栏搜索由 [页首独立 JS](../scripts/blog-shell.js) 生成，类名与对应的 [CSS](../page-custom.css) 一起维护：

| 自定义选择器 | 作用 |
|---|---|
| `#blog-profile-card` | 追加到 `#blog-news` 的资料卡片 |
| `.blog-outline-card`、`.blog-outline-card::after` | 共用定位、圆角与角饰，尺寸由 `--blog-outline-radius` 控制；文章互动卡片和评论编辑器为 14px，图片、侧栏卡片及统计框为 22px |
| `.blog-image-frame`、`.blog-image-frame--summary` | 原图外框与首页摘要图的布局适配，由 `scripts/blog-outline.js` 生成 |
| `#blog-header-left` | 保留原生标题与签名，六个导航按钮已移除 |
| `#blogTitle` 的 `--blog-title-size` | 主标题字号，同时控制签名向右缩进一个主标题汉字的位置 |
| `.blog-profile-avatar-link`、`.blog-profile-avatar` | 指向作者主页的圆形头像 |
| `.blog-profile-name` | 不带“昵称”标签的名字 |
| `.blog-profile-stats`、`.blog-profile-stat` | 两列统计区，间距 4px；每个链接把标签与数字合为一个 22px 圆角描边框 |
| `.blog-profile-stat-label`、`.blog-profile-stat-value` | 统计名称与下方数值 |
| `#sidebar_news.blog-profile-ready` | 卡片建立后隐藏旧标题与资料；已移入卡片的公告不隐藏；计数初始为 `—` |
| `#sidebar_news_content.blog-profile-announcement` | 公告原节点移入资料卡尾部，保留富文本及链接 |
| `html.blog-custom-boot` | 页首提前标记初始化阶段，控制原组件隐藏与搜索占位 |
| `#blog-header-search` | 在 `#navigator` 内独立建立的 GET 搜索表单 |
| `#blog-search-input`、`.blog-search-submit` | 搜索输入框和只有图形的提交按钮 |
| `.blog-search-icon` | 内嵌 SVG 或自定义图标图片 |
| `#blog-mobile-search`、`#blog-header-search.is-open` | 手机圆形搜索按钮与浮出的原搜索表单 |
| `#blog-tools`、`#blog-tools-more`、`#blog-tools-panel` | 右下角浮动设置、展开按钮和面板 |
| `#blog-theme-toggle`、`#blog-tools-admin` | 15° 配色圆形按钮与 75° 管理圆形链接 |
| `html[data-blog-theme]` | 当前实际配色 light/dark |

公共 `.blog-outline-card::after` 使用 22×22 网格的 SVG mask，绘制两条 0.8 单位细斜线和 3 单位小三角，再按 `--blog-outline-radius` 缩放显示。最靠近卡片圆弧的第三条线已移除。1px 边框卡片默认 `right/bottom:-1px`，补偿边框；无边框图片外框的 `--blog-corner-inset` 为 0px。三角的水平边、竖直边与组件外边界对齐。装饰不接收指针事件，不是缩放手柄；胶囊搜索与圆形控件不使用这个类。

`#home #blog-news` 保留 `overflow: visible`，斜线自身的定位已收回组件矩形边界。≥768px 的外层 `#sideBar` 使用 sticky 和 `overflow-y:auto`。`:root` 中 `--blog-sidebar-top-gap:12px` 定义资料卡吸顶后的顶部留白，原生资料区 15px 顶部间距保持不变；`top:calc(var(--blog-sidebar-top-gap) - 15px)` 当前等于 -3px，使资料卡距视口顶部保留 12px。

同一变量统一计算最大高度 `calc(100dvh + 15px - var(--blog-sidebar-top-gap))`，后备为 `calc(100vh + 15px - var(--blog-sidebar-top-gap))`，当前等价于视口高度加 3px，使侧栏底部仍位于视口内。调整吸顶留白时只需修改该变量。短窗口中侧栏可独立滚动，≤767px 仍隐藏整个侧栏。

资料卡实际嵌套为 `#sidebar_news > #blog-news > #blog-profile-card`，外层预留高度与内部卡片占据同一区域，不是并排追加两个占位块。原生个人资料当前使用 `.follower-count` 和 `.folowing-count`，后者少一个 `l` 是当前平台实际类名，不能自行改成 `.following-count`。

隐藏旧公告的规则使用 `#sidebar_news_content:not(.blog-profile-announcement)`，避免 ID 保留的公告移入卡片后又被旧规则隐藏。异步侧栏提供新公告时，脚本用原节点替换卡片中的上一份，不复制出重复公告。

顶栏搜索仅依赖当前博客身份和 `#navigator`，不需要等 `#sideBarMain` 的控件加载。页面只要采用这一 Custom 博客框架就能挂载；实际验证的页面类型以验证记录为准。

## 参考资料

- [博客园官方皮肤列表](https://www.cnblogs.com/Skins.aspx)：将 Custom 标明为主题设计标准模板。
- [官方历史模板示例](https://skintemplate.cnblogs.com/)：可参考页面类型与结构；历史示例较旧，实际页面检查优先。
- [Silence v3.0.0-rc2 部署指南](https://github.com/esofar/cnblogs-theme-silence/blob/v3.0.0-rc2/docs/guide.md)：可对照学习基于 Custom 的完整主题安装方式；本教程没有安装其完整主题，也没有采用其禁用默认 CSS 的安装步骤。
- [Silence 样式源码](https://github.com/esofar/cnblogs-theme-silence/blob/v3.0.0-rc2/src/index.less)：可参考标准区域的布局写法。
