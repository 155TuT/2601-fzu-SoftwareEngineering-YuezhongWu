# 实现说明

这套改造属于 Custom 之上的增量定制。原生模板提供内容与个人资料，自定义 CSS 负责外观，自定义 JS 负责顶栏搜索、资料卡片和正文链接图标。部署位置分别是后台「页面定制 CSS 代码」「页首 HTML 代码」与「页脚 HTML 代码」。

`scripts/blog-shell.js` 对应 `page-header.html`，负责整理顶栏原生节点并更早建立搜索和资料卡；`scripts/blog-outline.js` 与 `scripts/blog-custom.js` 合并到 `page-footer.html`，分别负责图片角饰外框和正文 favicon。`scripts/build-footer.mjs` 虽沿用原文件名，现在会同时生成两份 HTML。在本目录运行 `node scripts/build-footer.mjs` 可重新生成，不需要手工维护重复 JS。生成器也会检查源码中是否含可能提前结束 HTML 脚本标签的字符串。

## 字体

页面 CSS 开头使用 `@import` 引入公开托管的字体 CSS，再用 `font-family: "Fusion Pixel Blog", "Microsoft YaHei", sans-serif` 应用到博客根区域和表单文字。字体地址必须是访客能访问的公开 HTTPS 地址；本地 `file://` URL 不能作为公开博客的字体部署地址。

WOFF2 内嵌在单独的 CSS 文件中，避免将大段 Base64 混入每次编辑的页面样式。使用 `font-display: swap`，远程字体暂未到达时先显示后备字体。正文代码块等已有更具体字体规则的区域仍由其自身样式决定；不要使用 `* { font-family: ... !important; }` 强行覆盖图标字体和代码字体。

## 正文链接 favicon

范围按**链接所处区域**判断：仅装饰 `#cnblogs_post_body a[href]` 里能解析为 HTTP(S) 的链接。博客园正文链接与外站链接同样处理；导航、侧栏、评论、页脚不扫描。`mailto:`、`tel:` 和 `javascript:` 不属于此规则。普通 `#锚点` 会解析为当前页面 HTTP(S) 地址，因此仍可显示当前网站图标。

图标为 `1em × 1em`，与所在链接的字号相同，区别于先前按行高设置的 `1lh`。装饰图片放在链接文字左边，保留原链接的 `href` 和事件。CSS 集中在页面定制 CSS，没有把布局样式写入页脚 HTML。

脚本先根据链接 URL 选择图标来源：已知网站使用明确的图标地址，其余默认尝试对应主机的 `/favicon.ico`。这不是一个能自动解析所有网站 `<link rel="icon">` 的跨站爬虫；有的网站使用其他路径、拒绝外链或只有特定尺寸，默认尝试可能失败。可在 JS 的已知图标映射中为这些网站补充地址。

加载过程如下：

1. 先放入无需远程请求的通用网页图标，占位尺寸保持稳定。
2. 利用 `IntersectionObserver`，链接接近可见区域后再激活加载；不支持时立即加载。
3. 以图标 URL 为键保存 Promise。同一页面多处引用相同图标时复用同一次探测结果，避免每个链接重复处理成功、失败和超时。
4. 成功后换为网站图标；加载错误或超过 5 秒仍未完成则保留通用图标。
5. `MutationObserver` 处理正文中后来加入的链接及 `href` 变动，避免给同一链接重复插入图标。

这里的 Map 是页面生命周期内的内存缓存。跨页或刷新后的 HTTP 缓存由浏览器和图片服务器响应头控制，没有加入 localStorage 或 Service Worker，也不承诺“每个域名永远只发一个网络请求”。图标体积小也可能慢在 DNS、连接建立或源站响应。关于缓存语义参见 [MDN HTTP 缓存说明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)。

## 日历与独立顶栏搜索

后台「偏好设置 → 侧边栏控件」已取消日历和找找看，保留公告供原生资料读取。CSS 隐藏日历作为旧缓存或尚未关闭控件的复用场景兜底；隐藏 DOM 不保证阻止原平台请求日历数据。

早期版本搜索通过移动原生 `#widget_my_zzk` 实现，会等待异步侧栏。当前在 `#navigator` 内独立创建 `<form method="get">`，提交至 `https://zzkx.cnblogs.com/s`。输入框不直接命名为 `w`，提交前生成隐藏字段 `w=blog:博客用户名 关键词`，由浏览器完成查询参数编码。

博客用户名优先从原生标题链接的路径获取；解析尚未到达该链接时，使用 `owner.home` 作为后备。因此复用教程时仍需正确填写自己的 `owner.home`，不能把显示昵称当成用户名。空白关键词会阻止提交，Enter 和图标按钮走同一表单提交逻辑。结果页仍可能要求博客园的人机验证。

顶栏搜索不再依赖「找找看」控件；脚本清理缓存页面里的 `#widget_my_zzk` 和 `#sidebar_search`。首页、详情、分类、归档等页面可共享相同逻辑，只要存在 Custom 的导航容器。

搜索图标默认由 `createElementNS` 生成内嵌 SVG，无需上传图片。`icons/search.svg` 是相同几何的独立参考文件。也可以设置 `owner.searchIconUrl` 使用公开图片 URL，此时生成 `<img>`。按钮保留 `aria-label="搜索"`，图形是装饰内容，键盘和辅助技术仍能识别提交操作。[MDN 内嵌 SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_in_HTML)

## 标题、签名与 outline 顶栏

`mountHeader()` 将原生 `#blogTitle` 移入 `#blog-header-left`，保留标题链接和后台签名；直接移除 `#navList`，不保留已删除导航的样式和调用依赖。搜索从标题链接或 `owner.home` 获取博客身份。

所有断点的外壳上下内边距为 4px、左右为 16px，配合 1px 边框和 44px 高控件，总高 54px。标题和统计没有边框与内部水平 padding，因此内容区域距外壳内边缘准确为 16px。1100px 以上左右对称网格保持搜索居中；标题最大 240px，16/18px 标题字号，签名向右缩进一个汉字，过长时省略。

原统计节点在宽度不超过 1099px 时移到页脚，恢复宽屏时移回顶栏；监听 matchMedia 断点变化，避免复制数字导致异步更新失步。页脚显式清除 Custom 的 float:right。

顶栏标题、统计的边框、背景和装饰伪元素已移除。侧栏卡片保留 22px 圆角，采用下述公共角饰；桌面搜索保持胶囊外形。手机只显示圆形搜索触发按钮，原搜索表单作为绝对定位弹层复用。

## 浮动设置与配色

`#blog-tools` 在 `#home` 内创建一次，fixed 定位在右下角。三个按钮均 44×44px：更多按钮为圆心，明暗切换和管理沿向左上方的 15° 和 75° 半径放置，中心距 72px。CSS 使用 rotate(angle) translateX(-72px) rotate(-angle)，图标保持正向。group 容器无描边、背景和列表，不占文档流；内部按钮恢复 pointer-events。

图标使用内嵌 SVG；管理保留原生链接，按钮都有 aria-label 和 title。展开后聚焦配色按钮，Escape 收起并返回更多按钮；点外部和移出焦点同样收起。

每次加载令 theme 为 auto，读取 prefers-color-scheme；手动按钮只覆盖本页，浏览器偏好变化时恢复 auto。已移除跟随选项、状态文案、localStorage 读写和 storage 同步逻辑，旧持久化选择不再生效。主题变量继续控制正文及控件配色，照片不反色。

`#blog-mobile-search` 仅在 ≤767px 显示，点击后给原 `#blog-header-search` 添加 is-open 并聚焦输入框。表单绝对定位在顶栏下方 8px，不参与网格高度；Escape 返回圆形按钮，点击外部和焦点移出关闭。跨越手机断点会清除展开状态。

## 文章标题与图片轮廓

已读取当前页面加载的博客园样式：`#cnblogs_post_body h1` 为 28px、bold、line-height:1.5。`#home .postTitle` 与正文 H1 共用 `--blog-article-title-size:28px`，文章标题内部链接和文字继承字号；不改变顶栏博客名称的字号。

`#cnblogs_post_body` 内除 favicon 的图片，以及首页 `.postCon img`，使用 1px 实线边框与 `--blog-outline-radius:22px`。border-radius 直接施加于 img 替换元素，裁切图片像素的四角；不是只给外面套圆角框。box-sizing:border-box、max-width:100%、height:auto 保持比例和可用宽度。没有使用 object-fit:cover 裁切中心，也不改变图片 URL 或文件。

圆角变量同时用于侧栏卡片和粉丝/关注框。头像仍为 50% 圆角；favicon 的专用规则及排除选择器保持它们 1em 尺寸、0 边框。图片点击放大、收起已在平台实际页面验证。

## 22px 卡片公共角饰

`.blog-outline-card` 统一相对定位、22px 圆角及可见溢出，其 `::after` 是唯一角饰定义。页首脚本在资料卡和两枚统计链接创建时直接加该类；不逐帧扫描全页计算样式，也不把圆形按钮当作卡片。统计链接聚焦时保留 22px 圆角，不再被普通文字链接的 4px 聚焦规则覆盖。

角饰使用 22×22 的内嵌 SVG mask：靠外两条 0.8px 斜线分别从 `(14,21.5)` 到 `(21.5,14)`、从 `(17.5,21.5)` 到 `(21.5,17.5)`；最接近卡片圆弧的第三条已删除。3px 实心三角的直角顶点为 `(22,22)`，两直角边分别落在图形的右、下边界。所有绘制都在组件原矩形边界内，保留与圆弧之间的留白。`--blog-corner-ink` 在亮色下为黑色、暗色下为浅色，SVG 不发起外部请求。

绝对定位的参照区不包含父元素边框：1px 边框卡片采用 `right/bottom:-1px`，使三角端点恰好与卡片外边界对齐；图片无边框包装层设置 `--blog-corner-inset:0px`，直接贴合图片边界。伪元素只负责绘制并设置 `pointer-events:none`，不增加键盘焦点或调整尺寸行为。以后 1px 描边卡片复用 `.blog-outline-card` 即可；不同边框宽度需相应设置负的 `--blog-corner-inset`。

`img` 是替换元素，不能可靠承载 `::after`，因此页脚 `blog-outline.js` 为正文和摘要图片添加 `.blog-image-frame.blog-outline-card` 外框，移动原图片节点而不克隆。外框的宽高随图片自动形成，图片继续负责实际圆角裁切和边框，外框保持 `overflow:visible`，避免把位于圆角缺口的角饰切掉。首页 `.desc_img` 的右浮动、135px 宽度和外边距移到外框，图片自身清除浮动并填满外框。

脚本先扫描现有正文/摘要区域，再监听这些区域中新加入的图片；已有外框及 favicon 直接跳过，避免重复套层。原图片的 URL、alt、加载属性、节点和事件监听保留，原链接祖先也保留；平台放大图位于这些扫描区域之外。

## 个人卡片

卡片在侧栏内依次展示 96px 圆形头像、昵称、统计数据和公告。昵称不加“昵称：”前缀，两列先写“粉丝数 / 关注数”，再显示数值。每列的标签和数字作为一个整体加 1px 描边和 22px 圆角，不只给数字套框。圆角、边框、间距等全部由 CSS 控制。

卡片尽早使用配置的作者头像、主页和名字建立，统计数字以 `—` 占位。原生 `#profile_block` 到达后读取昵称、粉丝数、关注数及链接；不把前次访问的数字写成初始数据。顶栏 `#user_icon` 表示当前登录用户，不能可靠代表被访问博客的作者。

公告继续在博客园后台编辑。脚本把原 `#sidebar_news_content` 节点移动到资料卡尾部，并加上 `.blog-profile-announcement`，保留原富文本、图片和链接。隐藏规则排除该类，因此公告不会因保留原 ID 而被隐藏。后续异步侧栏提供新公告时，用新原节点替换卡片中的旧公告，避免重复显示。

原生个人资料仍保留在 DOM 中读取，缺失时统计显示占位。外层 `#sidebar_news` 和卡片都保留 260px 最小高度；加入公告后卡片按内容自然增高，这个最小高度不保证所有异步公告都不会移动下方内容。

## 提前初始化与加载跳变

页首代码在浏览器解析博客主体前注册 `MutationObserver`，发现导航就创建搜索，发现侧栏就创建卡片并监听该区域。无需等待整份页面的 `DOMContentLoaded` 或找找看请求；完整解析后清理发现阶段的观察器与初始化标记。页脚发现正文已存在时也直接初始化 favicon，减少无谓等待。

CSS 在搜索尚未创建时预留同样的网格位置和 44px 高度。卡片则先有头像和统计占位。预留空间是降低动态内容位移的常见方法，但宽度变化、长昵称和其他平台内容仍可能引起布局改变。[Google 布局位移指南](https://web.dev/articles/optimize-cls)

字体网络资源仍是约 866 KiB、内嵌 WOFF2 的外部 CSS，通过 `@import` 引用。字体声明要等该 CSS 到达后才被发现；`font-display: swap` 允许先显示后备字体再替换。`block` 可能先显示空白且仍有后续替换，不能保证无位移；`optional` 不做迟到替换，但冷加载慢网时可能整次访问都使用后备字体。本例保留 `swap`，不以隐藏整页或牺牲字体呈现来宣称“零闪烁”。[MDN font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display)

将来若进一步优化资源发现，可评估更早加载字体样式；当前 CSS URL 属于 `as="style"` 的预载资源，不能把它误写成 `as="font"`。只有独立 WOFF2 才按字体预载并匹配 `crossorigin`。预载只是提前获取，仍需实际引用，也可能竞争其他资源。当前代码没有增加预载，也没有进行冷网节流或 CLS 量化，因此这里只说明减少特定动态位移，不承诺零 FOUC、零 CLS。[MDN preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload)

## 内容宽度与布局断点

Custom 默认样式中，`#home` 和 `#main` 分别存在 930px 和 950px 的最小宽度。只隐藏侧栏仍会撑宽手机页面，因此本例先在全局将这两个容器设为 `min-width: 0`。

`@media (min-width: 1024px) and (orientation: landscape)` 将 `#home` 改为 `width: 70%` 并左右自动外边距。70% 相对页面可用布局宽度计算；桌面滚动条占宽时，它不一定恰好等于浏览器窗口外尺寸的 70%。竖屏和更窄视口不会被强行压到 70%。

顶栏断点如下：

| 视口宽度 | 布局 |
|---|---|
| ≥1100px | 标题、居中搜索、右侧统计；高 54px |
| 768–1099px | 标题和搜索单行，统计移入页脚；高 54px |
| ≤767px | 标题与圆形搜索按钮单行，统计移入页脚；高 54px，内边距上下 4px、左右 16px |

手机页面左右外边距 12px；隐藏侧栏并展开主栏。搜索输入字号 16px，浮动按钮考虑 safe-area-inset，页脚增加底部空间。具体实测见 [验证记录](verification.md)。
