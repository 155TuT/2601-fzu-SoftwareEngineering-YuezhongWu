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
│     ├─ #blog-mobile-search ← 手机圆形搜索按钮
│     └─ .blogStats         ← 原生四项统计，合为一组
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
```

这是布局示意，省略了一些包装节点。大小写有意义，`#sideBar` 不能写成 `#sidebar`。

## 原生选择器

| 目标 | 选择器 | 使用边界 |
|---|---|---|
| 博客主体 | `#home` | 当前字体应用的根容器，不覆盖平台顶栏；与 `#main` 一起清除默认最小宽度 |
| 标题与签名 | `#blogTitle`、`#Header1_HeaderTitle`、`#blogTitle h2` | 原生节点移入 `#blog-header-left`，内容仍由后台维护 |
| 导航 | `#navigator`、`#navList` | outline 顶栏；原生 navList 在初始化时移除 |
| 顶栏统计 | `.blogStats` | ≥1100px 在顶栏；≤1099px 原节点移入页脚 |
| 主栏 | `#mainContent`、`#mainContent .forFlow` | 窄屏取消为侧栏预留的空间 |
| 侧栏 | `#sideBar`、`#sideBarMain` | 767px 及以下整体隐藏，个人卡片跟随隐藏 |
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

## 文章标题与内容图片

- `#home .postTitle`：首页和详情页文章标题，与 `#cnblogs_post_body h1` 共用 28px 字号变量。
- `#cnblogs_post_body img:not(.blog-link-favicon-slot img)`、`#home .postCon img`：正文和摘要图片直接加圆角边框，像素四角随 22px 半径裁切；页脚脚本为每张原图包一层角饰外框。
- `.blog-image-frame.blog-outline-card`：贴合图片尺寸的角饰外框；`.blog-image-frame--summary` 保留首页缩略图的右浮动与尺寸。
- `--blog-outline-radius`：图片、侧栏卡片与两列关注统计框共用；头像与 favicon 独立。

## 本教程新增的节点

favicon 使用 `.blog-link-favicon-slot` 包住装饰性 `<img>`，插入链接首部；图片 `alt` 为空并隐藏于辅助阅读技术，链接文本和点击目标保留。

个人卡片与顶栏搜索由 [页首独立 JS](../scripts/blog-shell.js) 生成，类名与对应的 [CSS](../page-custom.css) 一起维护：

| 自定义选择器 | 作用 |
|---|---|
| `#blog-profile-card` | 追加到 `#blog-news` 的资料卡片 |
| `.blog-outline-card`、`.blog-outline-card::after` | 全部 22px 卡片与图片外框共用的圆角、定位和角饰 |
| `.blog-image-frame`、`.blog-image-frame--summary` | 原图外框与首页摘要图的布局适配，由 `scripts/blog-outline.js` 生成 |
| `#blog-header-left` | 保留原生标题与签名，六个导航按钮已移除 |
| `#blogTitle` 的 `--blog-title-size` | 主标题字号，同时控制签名向右缩进一个主标题汉字的位置 |
| `.blog-profile-avatar-link`、`.blog-profile-avatar` | 指向作者主页的圆形头像 |
| `.blog-profile-name` | 不带“昵称”标签的名字 |
| `.blog-profile-stats`、`.blog-profile-stat` | 两列统计区；每个链接把标签与数字合为一个 22px 圆角描边框 |
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

公共 `.blog-outline-card::after` 使用 22×22px SVG mask 绘制右下两条 0.8px 细斜线和 3px 小三角。最靠近卡片圆弧的第三条线已移除。资料卡与统计链接默认 `right/bottom:-1px`，补偿 1px 边框；无边框图片外框的 `--blog-corner-inset` 为 0px。三角的水平边、竖直边与组件外边界对齐。装饰不接收指针事件，不是缩放手柄；胶囊搜索与圆形控件不使用这个类。

`#home #sideBar` 和 `#home #blog-news` 同时设置 `overflow: visible`，保留圆角区域装饰的显示；斜线自身的定位已经收回矩形边界。这不改变窄屏隐藏整个侧栏的规则。

资料卡实际嵌套为 `#sidebar_news > #blog-news > #blog-profile-card`，外层预留高度与内部卡片占据同一区域，不是并排追加两个占位块。原生个人资料当前使用 `.follower-count` 和 `.folowing-count`，后者少一个 `l` 是当前平台实际类名，不能自行改成 `.following-count`。

隐藏旧公告的规则使用 `#sidebar_news_content:not(.blog-profile-announcement)`，避免 ID 保留的公告移入卡片后又被旧规则隐藏。异步侧栏提供新公告时，脚本用原节点替换卡片中的上一份，不复制出重复公告。

顶栏搜索仅依赖当前博客身份和 `#navigator`，不需要等 `#sideBarMain` 的控件加载。页面只要采用这一 Custom 博客框架就能挂载；实际验证的页面类型以验证记录为准。

## 参考资料

- [博客园官方皮肤列表](https://www.cnblogs.com/Skins.aspx)：将 Custom 标明为主题设计标准模板。
- [官方历史模板示例](https://skintemplate.cnblogs.com/)：可参考页面类型与结构；历史示例较旧，实际页面检查优先。
- [Silence v3.0.0-rc2 部署指南](https://github.com/esofar/cnblogs-theme-silence/blob/v3.0.0-rc2/docs/guide.md)：可对照学习基于 Custom 的完整主题安装方式；本教程没有安装其完整主题，也没有采用其禁用默认 CSS 的安装步骤。
- [Silence 样式源码](https://github.com/esofar/cnblogs-theme-silence/blob/v3.0.0-rc2/src/index.less)：可参考标准区域的布局写法。
