# 菜谱 Agent 调研来源与证据边界

初次核查：**2026-10-17**；重点复核与多端、设备接口资料补充：**2026-10-18**。配套主文：[research.md](../../research.md)。各行日期记录关键结论的核查时间，未更新条目保留原日期。

本目录合并产品、领域技术、原始研究和规范资料，按同一资料去重。完成的是公开资料检查：未安装或登录全部候选产品，未测试跨站导入，未复现论文，未开展用户访谈，也未验证菜肴实际口味、营养干预或临床效果。来源中的“已提供”“支持”只表示文档披露能力；本文自己的产品建议和拟议验收目标不能反向当作市场事实。

证据按用途判断：政府和标准资料有地域、版本与适用对象；论文有数据集、实验条件及发表状态；产品文档证明公开功能与限制，不证明准确率；开源 README 证明公开方案存在，不证明生产可用性。对同一产品，功能说明、价格政策和地区可用性分别取证。

## 1. 产品与市场

| 编号 | 来源 | 能支持什么 | 不能证明什么 | 访问日期 |
| --- | --- | --- | --- | --- |
| P01 | 下厨房：[官网](https://www.xiachufang.com/)、[帮助中心](https://www.xiachufang.com/faq/)、[开发者 App Store 页面](https://apps.apple.com/cn/app/id460979760) | 大众中文菜谱社区、创作与作品、菜单归类、会员入口；FAQ 中菜单是菜谱集合 | 菜单集合不等于日历周计划；不能凭公开页确认通用跨站导入、家庭权限或市场份额 | 2026-10-17 |
| P02 | 豆果美食：[官网](https://www.douguo.net/)、[菜谱分类](https://www.douguo.net/allrecipes)、[菜单](https://www.douguo.net/caidan) | 家常菜、菜系、烘焙等大众覆盖，以及菜单/作品/笔记入口；推翻只服务特殊人群的概括 | 首页自述规模不是独立统计；未证实跨站资料管理、家庭协作或收入结构 | 2026-10-17 |
| P03 | 美食杰：[官网](https://meishi.cc/)、[开发者 App Store 页面](https://apps.apple.com/cn/app/id399423833) | 图文与视频菜谱、三餐推荐、家庭使用定位、广告合作入口 | 部分官网和商店说明保留旧文案；不能推定所有功能在当前客户端的实际表现 | 2026-10-17 |
| P04 | 懒饭：[开发者 App Store 页面](https://apps.apple.com/cn/app/id1377082167) | 面向新手的视频菜谱及会员模式，为厨房执行体验提供对照 | “零失败”是宣传表达，不能当作真实成功率 | 2026-10-17 |
| P05 | Cookpad：[官方 FAQ](https://cookpad.com/us/faq)、[日本公司服务说明](https://info.cookpad.com/service)、[入门说明](https://blog.cookpad.com/uk/getting-started-on-cookpad/) | 家庭菜谱创作、私密/公开、收藏、Cooksnap 做后反馈；各地区 Premium 功能 | 不同地区版本不能互相替代；未测大陆访问、中文内容或用户留存 | 2026-10-17 |
| P06 | Paprika 3：[Windows 产品与 FAQ](https://www.paprikaapp.com/windows/)、[Windows 用户指南](https://www.paprikaapp.com/help/windows/) | 网页剪藏、编辑、计划、清单、同步；Windows 有简体中文界面，但页面明确浏览器自然语言解析与自动货架分类仅支持英语；3 版按平台销售 | 有中文界面不等于中文导入和食材解析成熟；3 版限制不能直接用于描述 4 Beta | 2026-10-17 |
| P07 | Paprika 4：[2026-09-28 开放 Beta 公告](https://paprikaapp.com/news/2026/09/28/paprika-4-is-now-in-open-beta/) | 公开测试中的扫描、社媒/剪贴板导入、家庭独立登录、营养分析，以及 Alexa、Siri/Shortcuts 等能力 | Beta 状态与正式版本区分；中文来源覆盖、准确率和语音效果待实测 | 2026-10-18 |
| P08 | Paprika：[Will Paprika 4 have a recurring subscription fee?](https://paprikaapp.zendesk.com/hc/en-us/articles/41887059110167-Will-Paprika-4-have-a-recurring-subscription-fee)（2026-07-14 更新） | 新增功能正式期采用订阅，订阅跨平台；旧用户不订阅仍可保留原有能力和相应维护 | 不是所有用户被强制失去原功能；不能据此补写未最终公布的价格 | 2026-10-17 |
| P09 | Recipe Keeper：[官网](https://www.recipekeeperonline.com/) | 网页/Instagram/TikTok 导入声明，照片/PDF/手写 OCR，编辑、份量、计划、清单和多端；Alexa 技能仅英语 | 不证明每种来源都能导入；邮件分享和同账号同步不自动等于细粒度多用户协作 | 2026-10-17 |
| P10 | ReciMe：[官网](https://www.recime.app/)、[功能说明](https://recime.app/help/en/articles/11594896-what-is-recime) | 社媒/图片/文本导入、菜谱册、计划、购物；免费额度与订阅并存 | 官网上的海外社媒列表不能外推小红书、抖音、哔哩哔哩；用户证言不作准确率依据 | 2026-10-17 |
| P11 | ReciMe：[Why Didn't My Recipe Import Correctly?](https://www.recime.app/help/en/articles/14773584-why-didn-t-my-recipe-import-correctly)（2026-05-05 更新） | 优先说明文字、再尝试音频及原网页的导入流程；私密/登录/订阅页面、评论内步骤、一帖多菜的限制；截图作为回退 | 不能写成全视频视觉理解，也不能据此推定中文识别或稳定成功率 | 2026-10-17 |
| P12 | ReciMe：[多设备共享](https://recime.app/help/en/articles/11626072-can-you-share-your-recime-account-across-multiple-devices)、[购物使用说明](https://recime.app/help/de/articles/16546825-how-to-use-groceries) | 同账户的菜谱/计划/清单同步；部分购物协作通过共享账户完成 | 共享账号不等于成员独立身份和权限；与收藏册邀请协作需要区分 | 2026-10-17 |
| P13 | Samsung Food：[官网](https://samsungfood.com/)、[Food+ 功能](https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription)（2026-09-10 更新） | 食谱管理、计划和采购；Food+ 披露个性化计划、AI 调整、已有食材匹配、视觉录入，以及 Smart Cook Mode / AI Cooking Mode 的逐步引导、实时提示与兼容家电控制 | 属官方能力说明；中文任务表现、实际指导效果及具体设备条件需实测，不能据此声称减少浪费或改善健康 | 2026-10-18 |
| P14 | Samsung Food：[保存与扫描菜谱](https://support.samsungfood.com/hc/en-us/articles/18756427379476-How-to-Save-Recipes-to-Your-Samsung-Food-Recipe-Box) | 网页/分享扩展/自建/照片导入；明确网页元数据并非全部兼容 | “任意网页”宣传不代表每页必定可解析；未测具体中文平台 | 2026-10-17 |
| P15 | Samsung Food：[Sharing & Collaboration](https://support.samsungfood.com/hc/en-us/articles/18689681101716-Sharing-Collaboration-on-Samsung-Food) | 计划可多人编辑；共享 Collection 的个人改动不一定同步；微调版本不能分享到社区 | “支持共享”不能概括成所有对象均支持同样协作；文档不证明实际同步可靠性 | 2026-10-17 |
| P16 | Samsung Food：[地区支持说明](https://support.samsungfood.com/hc/en-us/articles/19522595975956-Samsung-Food-App-Availability-Your-Guide-to-Supported-and-Unsupported-Countries)（2025-01-29 更新） | China 列入移动 App 不支持地区；同页明确提供网页访问替代 | 不能写成中国地区完全无法使用；未测本地网络、账户和中文体验，公开说明也可能晚于实际变化更新 | 2026-10-17 |
| P17 | AnyList：[产品说明](https://www.anylist.com/recipes)、[导入说明](https://help.anylist.com/articles/feature-overview-recipe-import/)、[家庭共享语义](https://help.anylist.com/articles/share-recipe/) | 网页导入、计划、购物及家庭共享；共同菜谱/计划中删除对共享成员都生效；免费与 Complete 分层 | 不证明中文解析；共享整套资料不能替代私人版本、临时聚餐和角色权限等所有模型 | 2026-10-17 |
| P18 | Plan to Eat：[官网](https://www.plantoeat.com/) | 菜谱收集、日历、复用计划、自动购物清单，构成无需 Agent 的强流程基线；试用及订阅 | 不能把自动生成清单本身认定为 Agent；官网证言不是节省时间的独立实验 | 2026-10-17 |
| P19 | Mealie：[功能文档](https://mealie.io/documentation/getting-started/features/)、[介绍](https://mealie.io/documentation/getting-started/introduction/)、[官方仓库](https://github.com/mealie-recipes/mealie) | URL/结构化输入、菜谱、计划、清单、家庭与 API；AI 图文和视频音频转写导入；事件通知、定时 Webhook 及可触发 Home Assistant 的 Recipe Actions | 取得来源、中文提取、部署维护与集成成本需要验证；本轮未部署。设备能力仅为后续研究参照 | 2026-10-18 |
| P20 | Tandoor：[官方文档](https://docs.tandoor.dev/)、[AI 文档](https://docs.tandoor.dev/features/ai/)、[购物文档](https://docs.tandoor.dev/features/shopping/)、[官方仓库](https://github.com/TandoorRecipes/recipes) | 菜谱、计划、购物、协作、JSON-LD/microdata 导入，以及图像/PDF/文本 AI 功能 | 视觉输入依赖模型能力；文档不代表所有部署版本相同；未实测中文和稳定性 | 2026-10-17 |
| P21 | Cookidoo：[官方会员说明](https://cookidoo.thermomix.com/foundation/en-US/membership) | 网站/手机食谱、周计划、清单、收藏，与 Thermomix 同步是另一层能力 | 软件可访问不代表专用温控、转速和机型步骤可直接用普通锅具执行 | 2026-10-17 |
| P22 | Home Connect：[官方架构](https://developer.home-connect.com/how_it_works)、[设备状态](https://api-docs.home-connect.com/states/)、[开发者 FAQ](https://developer.home-connect.com/support/faq) | 正式接口经 Home Connect API 服务器访问家电；设备状态与远程启动允许状态影响动作；模拟器有行为限制 | 该 API 不提供直接家电连接，不能由同一局域网推导直接控制；仅作为后续技术方向，不属于课程实现或验收 | 2026-10-18 |
| P23 | 情侣项目：[PairBite](https://github.com/630999Steven/PairBite)、[俩人开饭](https://github.com/jiaotashidi-bi/liangren-kaifan)、[Couple-s-Menu](https://github.com/Echo7659/Couple-s-Menu) | 公开存在共享菜品、绑定、点菜以及作者声明的采购/偏好交集/反馈等实现；包括原生微信、云开发及 uni-app/Go 路线 | 不能证明均已生产上线或稳定；不能推断情侣用户普遍需求、开发者能力分布、市场份额；云开发不等于低代码 | 2026-10-17 |

## 2. 技术与领域知识

| 编号 | 来源 | 能支持什么 | 不能证明什么 | 访问日期 |
| --- | --- | --- | --- | --- |
| T01 | [Schema.org Recipe](https://schema.org/Recipe) | 菜谱、配料、步骤、份量、时间、营养等结构化表达；为导入和领域模型提供基础 | 标准存在不代表网页填写正确、食材实体已归一、菜谱可执行 | 2026-10-17 |
| T02 | [recipe-scrapers 官方仓库](https://github.com/hhursev/recipe-scrapers) | 多种标记/网页解析能力、调用方处理网络获取、不绕过反机器人措施的边界；MIT 许可 | 不解决平台访问授权、所有中文社媒获取和解析质量；支持站点不等于永久可用 | 2026-10-17 |
| T03 | [FAO/INFOODS Guidelines for Food Matching 1.2](https://www.fao.org/fileadmin/templates/food_composition/documents/Nutrition_assessment/INFOODSGuidelinesforFoodMatching_version_1_2.pdf) | 食品匹配应考虑生熟、处理方式、形态和计量基准 | 不能只凭名称相近，就用国外条目替代中国品牌或复合调味料 | 2026-10-17 |
| T04 | [FAO/INFOODS Density Database 2.0](https://www.fao.org/food-composition/tables-and-databases/detail/%28global--2012%29-fao-infoods-density-database---version-2/en) | 体积换重量需要食材相关密度数据 | 不能把所有液体、粉末当水，也不能给没有定义的“把/勺/个”硬填重量 | 2026-10-17 |
| T05 | [USDA Foundation Foods Documentation](https://fdc.nal.usda.gov/Foundation_Foods_Documentation/) | 每 100 g 可食部、食物状态及营养条目的使用口径 | 原料营养相加不等于实际摄入；未建模吸油、弃汤、烹调变化时不能称精确 | 2026-10-17 |
| T06 | [FDA Food Allergies](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies) | 食物过敏、标签及交叉接触相关边界 | 美国主要过敏原分类不是中国完整法定清单；菜谱筛查不能保证厨房或包装食品无交叉接触 | 2026-10-17 |
| T07 | [香港食物安全中心：自备餐盒](https://www.cfs.gov.hk/tc_chi/consumer_zone/packed_meals.html) | 冷藏运输、到达后储存、翻热及微波搅拌等实际条件，为带饭场景建模提供依据 | 属地区消费者指引；不能证明任何被标记为“带饭”的食谱都适合常温放置 | 2026-10-17 |
| T08 | [UCL Eating Behaviour Questionnaires](https://www.ucl.ac.uk/population-health-sciences/epidemiology-health-care/research/behavioural-science-and-health/resources/questionnaires/eating-behaviour-questionnaires) | 食物偏好、进食行为和营养知识是不同测量对象，已有量表需要按用途选用 | 不为团队自造的“口味 MBTI”提供测量效度，也不证明娱乐分享会改善推荐 | 2026-10-17 |
| T09 | [Anthropic：Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) | workflow 与 agent 的工程区分；优先简单结构及成本、延迟、控制性取舍 | 厂商经验不等于菜谱任务上的对照实验；不能据此预先宣布 Agent 必然胜过固定流程 | 2026-10-17 |
| T10 | [中国营养学会膳食指南入口](https://dg.cnsoc.org/)、[福建省农业农村厅转载的 2022 年平衡膳食八准则](https://nynct.fujian.gov.cn/ztzl/lwlb/lsqk/202206/t20220613_5928836.htm) | 一般膳食教育、食物多样和适用建议的来源入口；本轮已通过学会索引及政府转载核对，学会首页直接读取曾返回错误 | 一般指南不能自动生成个人处方，也不证明本项目改善健康或达到临床效果 | 2026-10-17 |
| T11 | [MDN：Offline and background operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation) | PWA 的缓存、Service Worker、后台同步与推送机制；后台生命周期由浏览器管理 | 安装 PWA 不赋予常驻网关或持续运行模型的能力；离线范围与兼容性依实现而定 | 2026-10-18 |
| T12 | [Chrome：Local Network Access](https://developer.chrome.com/blog/local-network-access) | 网页访问本机及局域网资源涉及浏览器安全上下文与授权机制 | 各浏览器、版本及请求类型的行为需分别检查；本文不将 Chrome 的具体规则推广到全部客户端 | 2026-10-18 |
| T13 | [Home Assistant：WebSocket API](https://contributors.home-assistant.io/core/internals/websocket-api/) | 认证后获取状态、订阅事件和调用已有动作的接口路径 | 接口存在不证明任意家电都可控制或完全离线；局域网方向仅作后续研究 | 2026-10-18 |
| T14 | [Home Assistant：MQTT](https://www.home-assistant.io/integrations/mqtt/) | broker、约定配置主题的 discovery、状态及可用性消息 | 发现、认证与实际动作能力需区分；MQTT、HTTP、WebSocket 不是可直接互换的设备接口 | 2026-10-18 |
| T15 | [小智 ESP32：MCP IoT Control Usage](https://github.com/78/xiaozhi-esp32/blob/main/docs/mcp-usage.md) | 后端通过工具发现和调用流程访问固件已注册的能力 | MCP 不自动提供任意家电兼容性，也不能据此认定模型运行在 ESP32；仅作后续语音终端参照 | 2026-10-18 |

Mealie、Tandoor 的技术与 API 资料复用 P19、P20，不重复登记。食品安全资料用于确定输入条件和已知约束，产品输出仍须清楚标注资料适用范围、缺失信息与人工核对点。

## 3. 原始研究与数据集

| 编号 | 来源与状态 | 能支持什么 | 不能证明什么 | 访问日期 |
| --- | --- | --- | --- | --- |
| R01 | [SHARE，EMNLP 2022](https://aclanthology.org/2022.emnlp-main.761/) | 配料修改与相应步骤修改需要联动，为“改配料后重查步骤”提供任务依据 | 数据集指标不等于替换后真实口味、食品安全或家庭可接受性 | 2026-10-17 |
| R02 | [Learning to Substitute Ingredients in Recipes，arXiv:2302.07960](https://arxiv.org/abs/2302.07960) | 结合上下文与食材关系排列替代候选的研究路线 | 不能把候选排名视为可直接执行的替换配方或过敏安全证明 | 2026-10-17 |
| R03 | [Recipe1M+ 官方项目](https://im2recipe.csail.mit.edu/) | 图像与菜谱检索任务及研究数据背景，可借鉴研究评估方式 | 不提供中文导入、家庭权限、带饭和记忆真值；公开项目入口不自动授权再分发全部文本/图片 | 2026-10-17 |
| R04 | [arXiv:2610.07886 摘要](https://arxiv.org/abs/2610.07886)、[v1 全文](https://arxiv.org/html/2610.07886v1)；2026-10-06 预印本 | 餐食规划研究及作者对 300 个规划任务报告的实验结果，可研究任务构造、约束和验证方式 | 本次未复现；预印本结果不等于独立验证、成熟上市产品、真实家庭使用收益或临床效果 | 2026-10-17 |
| R05 | [Recipe2Plan，Findings of EMNLP 2025](https://aclanthology.org/2025.findings-emnlp.229/) | 菜谱相关规划与时间约束基准，可用于区分语言生成与可执行计划 | 基准成功不等于菜好吃、实际烹饪时间准确或全家庭场景可用 | 2026-10-17 |
| R06 | [NutriGen，arXiv:2502.20601](https://arxiv.org/abs/2502.20601) | 营养目标约束和个性化生成的研究参考，用于设计需核验的任务条件 | 研究效果不能外推到中国家庭、疾病食疗或临床干预；本次未复现 | 2026-10-17 |
| R07 | [arXiv:2511.18483](https://arxiv.org/abs/2511.18483) | LLM 抽取与整数规划组合的实际案例，支持“语义处理和确定性求解分工”的技术考察 | 单一任务或部署环境不能泛化为所有家庭食谱规划；没有为本项目证明用户价值 | 2026-10-17 |

引用论文结果时应写“作者在其设定中报告”，保留数据集、任务数、模型与版本条件。本文不把上述研究数字写成本项目已达到的准确率、用户收益或能力承诺。

## 4. 规范、权利、隐私与安全

| 编号 | 来源 | 能支持什么 | 不能证明什么 | 访问日期 |
| --- | --- | --- | --- | --- |
| N01 | [W3C：Understanding Target Size (Minimum)，WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | AA 级最小目标尺寸条款使用 24×24 CSS 像素及规定例外，可作为触控界面检查基线 | 不能写成所有按钮无例外至少 24 像素；达标不等于已适配湿手、油污、长辈或厨房情境，也不是 AAA 的 44×44 条款 | 2026-10-17 |
| N02 | [《中华人民共和国个人信息保护法》官方公开文本](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm) | 个人信息处理原则及医疗健康等敏感个人信息相关要求，为最少收集、告知、确认、删除和权限设计提供依据 | 不能据一条设计建议宣称项目已全面合规；实际角色、数据类型和处理行为仍需具体核对 | 2026-10-17 |
| N03 | [《中华人民共和国著作权法》2020 年修正文本](https://www.nsfc.gov.cn/p1/2871/2872/69475.html) | 文字、图片、视频等权利边界需要分别审视；导入和公开再传播是不同用途 | 用户能看、网上可访问或保留作者链接，不等于拥有复制和公开分发许可；也不能笼统认定每个食材事实都独立受同样保护 | 2026-10-17 |
| N04 | [OWASP：Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) | 用户链接由服务端抓取会形成 SSRF 风险，需要 URL、地址范围、重定向等校验策略 | 引用指南不代表实现安全；应根据实际抓取架构测试，单次字符串检查不足以自动证明防护有效 | 2026-10-17 |
| N05 | [Tandoor LICENSE.md](https://github.com/TandoorRecipes/recipes/blob/develop/LICENSE.md) | 核查时许可文本含 AGPL v3 与 Commons Clause 等附加条件，复用不能简单按普通 MIT/AGPL 概括 | 动态分支不是未来版本保证；不能替代针对具体版本、复制/修改/托管/商业用途的许可评估 | 2026-10-17 |

recipe-scrapers 的许可证入口见 T02，Mealie 的仓库许可证入口见 P19。若进入实施阶段，应固定实际采用的版本或提交，并再次核查许可文件；本次没有作商业许可或法律合规结论。

## 5. 尚缺的证据

以下内容是后续工作，不能写成已经完成的发现：

- 目标用户最近真实的收藏、选菜、买菜、做饭和反馈流程；需要访谈或观察，并保留招募偏差。
- 对中文网页、社媒分享文字、截图和视频的分层导入测试；需要记录取得了哪些证据、字段遗漏和人工修正时间。
- 现有工具组合、固定流程与受限 Agent 的公平对照；需要共享输入、数据、约束和成本口径。
- 厨房真实使用体验，包括字号、计时、断网、误触、长辈及多人操作；公开无障碍规范只能提供部分基线。
- 烹饪可行性、实际口味、营养估计偏差和用户是否持续反馈；不能由结构化输出或一次演示替代。

官网广告文案、商店评分、未经核对的下载站、厂商精选用户证言以及搜索引擎摘要中的规模数字，没有被当作市场份额或效果证据。
