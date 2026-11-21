# 你所热爱的就是软件工程-冲刺总结

| 项目 | 内容 |
| --- | --- |
| 这个作业属于哪个课程 | [福州大学 2026 秋软件工程](https://edu.cnblogs.com/campus/fzu/202601SofwareEngineering) |
| 这个作业要求在哪里 | [第三次团队作业 · Alpha 冲刺](https://edu.cnblogs.com/campus/fzu/202601SofwareEngineering/homework/16792) |
| 团队名称 | 你所热爱的就是软件工程 |
| 团队成员-学号 | 王智壹-052403137、郑嘉文-052402132、林叶鑫-182400320、张洋-072408137、陈飞扬-102402118、周恪玄-022403140、李宗欣-102401507、陈柏睿-072408101、马晨曦-102401504、林金晶-102401505、陈柯男-072308130 |
| 这个作业的目标 | 在 Android 上跑通生活笔记的保存、回查和纠正，用加班晚餐检验怎样把已有的个人信息与偏好带进 Agent 的下一次回答。 |

我们想让 Agent 回答生活问题时，用得上用户以前留下的笔记和偏好。本轮先在 Android 上接通了首页输入和系统分享。两个入口存下的原话，退出后能找回，实际结果和纠正也能补回原来的事项。要在一次新提问里用上前几次的经历，还需接入后台整理和跨记录的饮食排序。[冲刺计划][plan] · [团队 GitHub 仓库][repo]

## 从菜谱笔记到个人记忆

10 月 17 日的草稿里，我们就把菜谱当作笔记的一种。一个刚开始自己做饭的人，可以把网上看到的做法收到手机里，按自己的口味改一版，吃完再留一句“这次偏咸，下次少放酱油”。10 月 25 日交选题报告时，我们把导入、修改和餐后反馈写成了完整的流程。这些笔记留给自己翻，也准备接给用户平常用的智能体（Agent）。下次再问这道菜怎么做，助手也能读到那句批注。[最初的产品草稿][draft] · [选题报告][topic] · [组内关于 Agent 接入的讨论][discussion]

我们最初想做一个**可以挂载到现有 Agent 的纯本地中间件**。用户自己导入笔记，原始材料、个人信息和偏好都存在本机。用法类似给 Agent 接一个 Slack 工作区。用户继续在原来的助手里提问，助手按授权检索这份本地资料库，把和当前问题有关的原话和偏好带进回答。这就是我们设想的个人信息与偏好 RAG（检索增强生成）。用户后来的实际选择和纠正也可以写回原笔记，供下一次提问时取用。[课上反馈与我们的回应][reflection] · [本地资料库与外部 Agent 的设计][research]

课上老师问，用户为什么要用你们的软件，直接问大模型行不行？我在 11 月 6 日重新看方案时，才发现我们把“怎么改一道菜”写得很细，却把真正想交给 Agent 的东西写轻了。加班时点过热汤面，订单里能查到。为什么满意，可能只留在当晚那句“不用洗锅”里。到了周末，同一个人又愿意花四十分钟做饭。下次他只说“今天又要加班”，助手要知道的是他在**什么情况下看重省事**，还要能说明这个判断来自哪几次经历。这种用户省略了、在过往笔记里却有迹可循的背景，就是我们想提供的隐性上下文。[11 月 6 日的个人反思][pivot]

11 月 7 日起，我们把需求围绕这件事重写。标签可以帮人找到写过“加班”的记录，要推断什么情况下更看重省事，还要对照几次独立经历、当时的条件和事后的评价。本人也可以直接说明要求，决定它只在今天生效，还是以后遇到相同情况都沿用。通勤和学习中的取舍也能按这套方式记录。**饮食成了第一轮验证场景**，因为下一顿怎么选、吃完觉得怎样，很快就有机会检验上一次的判断。[需求迭代记录][prd]

### 为什么手机上还要有自己的前端

Android 的系统分享解决了资料怎样送进来。用户在其他应用选中一段文字，点分享，我们就能收到这一段。如果用户仍在原来的 AI 应用里问“今天加班吃什么”，情况就不同了。要让它的 Agent 用上以前的笔记，需要那款应用在回答前调用我们的检索接口，把查到的条件和依据带进对话。要把新的反馈送回笔记，还得由它调用写回接口。这两个调用都要对方适配，单靠我们在手机上提供一个资料库，很难接进别的应用正在进行的对话。[跨工具接入调研][research] · [Android 接收分享内容](https://developer.android.com/training/sharing/receive)

于是，11 月 8 日我们决定首版自带独立前端，让应用在手机进程内直接调用本地业务核心。9 日的原型把日常操作收到了首页、记录库和设置。用户在同一个应用里记事、提问，从回答旁边看依据，回原事项补结果或改条件。原话和偏好修订由核心维护，模型接入单独放在适配层。这轮集中做 Android，后续再选支持工具调用的外部 Agent，验证它能否沿用同一接口，读取用户授权的资料。[原型与概要设计][design] · [产品形态的版本记录][prd]

## 补充调研要看用户在哪一步重复交代背景

早期比较 Recipe Keeper 和 Paprika 时，我们关心的是怎么导入菜谱、怎样保存自己的做法。换成个人记忆服务以后，就该拿一条已经存过的经历，看看几天后再用它要花多少力气。我们选了两种日常做法来对照。用手机便签的人能不能翻回那句话？用豆包的人另开一段对话，还要把上次说过的背景重复几次？独立前端也有多打开一个应用、多记一句话的成本，这部分要和省下来的操作一起算。[前期竞品调研][recipe] · [本轮 Android 对照脚本][userstudy]

我们准备邀请近一个月至少三次遇到同类选择的人，先请他演示自己上次是怎么做的。林金晶为此整理了八道问题，用 **10 个模拟案例**试问，覆盖 5 个饮食、2 个通勤、3 个学习情境。其中四个案例，把“希望助手更懂我”拆成了可以当场观察的动作。[访谈提纲与案例][interviews]

| 模拟情境 | 下次还缺什么背景 | 回访时请参与者怎么做 |
| --- | --- | --- |
| S01 加班晚餐 | 订单留着菜名，省时间、少洗锅的理由要靠本人回忆。 | 找回上次为什么满意，点开依据，指出是哪顿饭里的哪句话。 |
| S05 临时口味 | 今天想吃清淡，平时仍然吃辣。 | 把今天的要求设为“仅本次”，换一天再问，核对当次条件和长期偏好。 |
| S07 上课路线 | 群里有好几版校车时刻表，搜得到图片，还得辨认哪张是新的。 | 找到时刻表的来源和更新时间，说说自己会采用哪一版。 |
| S09 学习安排 | 待办清单记着完成项，计划为什么没做完要另外解释。 | 回到那份计划补记实际进度和当天精力，下次调整时一起找回。 |

通勤和学习用来检查这套记录方式能否容纳别的生活经验，首版仍用饮食验收。还有两个问题值得留到第一次上手时观察。午休短的人愿意为一句“今天太咸”点几下？想先弄清隐私设置的人，能否自己找到资料存在哪、怎样删除？这些都是案例提出的待验证问题。[访谈案例汇总][interviews]

截至 11 月 21 日，项目登记为已访谈 0 人、已回访 0 人。计划访谈 8 人，从中邀请 4 人重做自己的任务。原冲刺计划用候选包回访，最新安排把需求回测放在正式版发布后。竞品比较用同一组晚餐材料，记录耗时、操作数、重复补述旧背景的次数和第一次需要提示的位置。真人回访则保留各自的原任务，把本人说的话、实际操作和我们的解释分开记。[招募与试用记录][userstudy]

## 这一轮在 Android 上做到了哪里

### 打开就能记，过几天也能找回

刚下课在食堂排队的人，可能只来得及写“这家今天很快”。首页直接收这句原话，分类可以留到保存以后。切换“对话”和“记录”会保留同一份草稿，从其他应用分享过来的文字，也可以先看一眼再确认。第一次打开空记录库，页面会提示从这两个入口开始。等记录多起来，再按时间查看，按人物、标签和事项状态筛选，看完详情返回时，刚才选好的条件还在。[首页、记录库和分享接入][front]

我们选浅砂色和苔绿、用霞鹜文楷排中文，是想让手机里的生活笔记读起来亲切一点。接成整页后，才发现第一版首页的输入框占了大半屏，弹出键盘又挤掉一块阅读空间。这次把输入区移回底部，字段名留在框外，选中的标签带勾，独立按钮的触点至少为 48 × 48 dp。原话写入后显示“已保存”，整理进度另列。用户想知道建议怎么来，可以点开依据看原话。想改条件，详情页直接给出“仅本次”和“以后按此条件”两个选择。只想记东西的人也可以在设置里关闭自动整理。[组件规格][components] · [整页复验][verify]

### 保存能重试，后台整理要能接着做

一次保存可能已经写进手机，页面却来不及显示结果。如果两次请求各建一条记录，后续推断就可能把同一顿晚餐当成两份依据。首页和系统分享各自为一次操作生成编号。业务核心把原话、来源版本、需要执行的任务和回执一起写入。原样重发同一请求时，已经成功就返回第一次的记录编号，写入途中失败就整笔回滚后重试。这是我们需要**幂等保存**的原因。隔天确实又吃了一次面，那是另一顿饭，理应留下另一条记录。修改偏好也要核对版本，遇到冲突先保住草稿，让本人看过最新条件再确认。[保存与修订接口][contract] · [首次保存、重发与冲突的测试记录][test]

人会锁屏、切应用。Android 进入 Doze 等省电状态后会推迟后台计算和网络访问，离开前台的应用进程也可能被系统回收。原话可以当场保存，给多条经历打标签、比较条件、更新偏好则适合放进**持久任务队列**。设计上每做完一个阶段就记下进度。比如一次整理被打断，用户重开后先把“想吃清淡”改成“仅限今天”，旧任务下次获得运行机会时，就要读检查点、核对最新修订，再继续计算。我们要验的是，用户回来时，已存的原话还在，恢复的整理也遵从他最后确认的条件。[任务与状态设计][design] · [持久任务交接][jobs] · [Android 后台省电机制](https://developer.android.com/training/monitoring-device-state/doze-standby)

目前 Kotlin 和 Jetpack Compose 页面已经接入本地核心，原话、回执和任务状态通过 SharedPreferences 快照落盘。我们在 360 dp 的 Android 16 纵向模拟器上开飞行模式，从首页和系统分享各存一段不同的文字，强行停止应用再打开，两条都能从记录库搜到。Debug 和 Release 各通过同一组 34 项 JVM 契约与引文测试，100% 和 200% 系统字号下各通过 32 项设备用例。当前快照会在每次写入时重新序列化整份记录。周恪玄接入 SQLite 后，用这两条原话复验事务和重开读写，再由陈飞扬用真实的任务表验证中断续跑。[合并前复验][verify] · [当前存储实现][store] · [SQLite 交接][db]

### 怎样判断多做一步偏好整理值不值

当前调试版会用本地规则给记录加上“饮食”“加班”等标签。比如一条饮食记录提到“省事”，详情会显示一条示例建议，点开依据能看到**本条记录**中用到的词。要回答一次新的晚餐提问，还需把几次经历放到一起。测试材料里，周一的热汤面和周三的盖饭都省去了准备或清理的时间，周日的番茄鸡蛋面则是本人愿意花四十分钟做的。张洋接下来要交能处理这组材料的候选清单和排序基线。算法输出候选、原话位置和版本，页面据此展示，测试也能在换算法后拿同一组输入复验。[当前规则实现][rules] · [固定晚餐材料][userstudy] · [算法交接][algorithm]

把计算放到用户的手机上，还得算这笔账。按设计，普通保存和查询直接用本机数据，补记或纠正后只重算受影响的部分。我们会用同一组材料比较只检索原文和加入条件偏好排序的结果，看多做一轮整理能少用错几次条件。需求把普通保存和查询的目标定在千条事件规模下，预热后各做 100 次，两组各有 95% 在 1 秒内完成。接下来要在同一台首测手机上量耗时、内存峰值、耗电和存储增长，再结合用户省下了几次重复解释，判断增加哪一步计算值得。[端侧处理与开销的考虑][cost] · [性能验收目标][prd]

## 这轮开发怎样交接

11 月 9 日交概要设计时，我们有 20 个移动端页面状态和 125 个原型导览动作。这轮集中开发从 11 月 19 日派发 11 张模块任务单开始。20 日，调研和测试定下晚餐原话，两位前端让首页与分享写进同一个记录库。21 日，公共接口、删除处理和共用组件陆续合并。整页联调时发现，从详情返回会崩溃，后台任务还会覆盖用户改过的事项状态，两处问题修好并复验后才合入主分支。课程要求冲刺至少 14 天，目前有日期的集中开发记录覆盖 19—21 日三个日历日。团队原定开一次线上短会，出席和用时待补录，具体交接留在 Issue 和 PR 里。[原型与概要设计][design] · [模块总单][coord] · [晚餐样例交接][fixtures] · [前端修复记录][fix]

马晨曦在 #4 和 #5 下给两位前端的回复，把组件接入说得很具体。点了保存，要拿到回执才能显示“已保存”。点了依据卡，要拿到对应的来源版本才能打开当时的原话。删除更能看出分工的依赖关系。郑嘉文交出删除预览和确认接口后，周恪玄要把删除标记和清理任务一起写入数据库，陈飞扬才有任务可以接着清理，林叶鑫最后验证中途退出会不会让已删内容重新出现。21 日 15:29 的计划图共有 28 个交接节点，**12 个已交付，16 个待交付**。[首页组件交接][homehandoff] · [详情组件交接][detailhandoff] · [删除接口][deletion] · [计划依赖图][graph]

### 每位成员的工作与体会

计划占比是派单时对整轮工作量的估算。已交付份额以计划图的 12 个绿色节点为分母，每个节点记 1 份，两位负责人共同交付时各记半份。各模块在途的工作、协作和审查记在最后一栏，实际工时仍待成员汇总。[分工与交付记录][plan]

| 成员 | 计划占比 | 已交付份额（占比） | 当前工作与过程体会 |
| --- | ---: | ---: | --- |
| 王智壹 | 5% | 1（8.33%） | 我拆了 11 张任务单，组织接口对接、分支审查和发布验收。这次到 19 日才明确分工，联调挤在了最后。下次派单时就约好首份样例、接手人和验法。 |
| 林金晶 | 10% | 1.5（12.50%） | 整理竞品对照脚本、访谈提纲和模拟案例，与测试固定晚餐材料。试问下来，“能演示一下上次怎么找的吗”比直接问想要什么功能，更容易落到具体操作。 |
| 马晨曦 | 6% | 2（16.67%） | 交付组件规格与 Compose 共用组件，分别对接首页、记录库、分享和详情。第一张整页出来就要一起弹键盘、放大字号，才能看见输入区实际占了多少空间。 |
| 陈柏睿 | 11% | 1.5（12.50%） | 搭工程，接首页输入和记录库，保留草稿与筛选。一次保存要验到从详情退回来，这样才看得出用户刚选好的视图和条件有没有保住。 |
| 陈柯男 | 9% | 1.5（12.50%） | 接系统分享、详情、反馈和纠正。分享时要留住待确认的原话，修订冲突时要留住刚写的草稿，两条路径都要在页面重建后再验一次。 |
| 郑嘉文 | 12% | 2（16.67%） | 交付业务核心与仓储接口、回执和删除契约。删除涉及核心、存储、调度、测试四方，可运行的预览和确认样例让各方有了可以对照的结果。 |
| 周恪玄 | 10% | 0（0%） | 已有仓储和删除隔离契约可供接入，SQLite 实现待交。第一次联调要故意中断一次写入，看记录、来源、任务和回执是否一起回滚。 |
| 陈飞扬 | 9% | 0（0%） | 已有任务编号、状态和控制接口可供接入，持久领取、续跑与清理待交。恢复旧任务时要同时看上次做到哪一步，以及用户在这期间改过什么。 |
| 张洋 | 11% | 0（0%） | 已拿到两次加班、一次周末例外和纠正样例，饮食排序基线待交。先核对选中了哪段原话和适用条件，再看菜名排第几，才能解释推荐为什么会变。 |
| 林叶鑫 | 9% | 1.5（12.50%） | 和调研固定输入，交付契约回归与 CI 测试记录。重发一次要比对两份回执，写入失败还要数记录和来源，才能发现只回滚一半的问题。 |
| 李宗欣 | 8% | 1（8.33%） | 交付调试构建、签名与候选包发布流程。把提交号和 APK 校验值带进真机报告，最后才能确认发给用户的就是验过的那一份。 |
| **合计** | **100%** | **12（100%）** | |

## 正式发布前还要验什么

主分支 `cf9deac` 的 Android CI 已通过，当前调试包为 `0.1.0-alpha.1+cf9deac9bc64`。李宗欣先把调试包交到首测手机上，马晨曦和林叶鑫用大字号、键盘和 TalkBack 走一遍输入、保存和查看依据。SQLite 与持久队列接好后，再从两个入口离线保存，在整理中途停一次，重开后按编号核对原话、修订和任务进度。[调试包构建][ci] · [真机与流程验收脚本][userstudy]

算法接入后，我们会另开一段对话问“今天周四加班，预算二十元，晚饭吃什么？”先核对回答引用的是哪两次晚餐，再由本人把“加班时优先省事”改为“只在工作日加班时优先省事”。接下来分别在周六和周四的条件下提问。前者该按当天情况重新比较，后者应当沿用本人确认的偏好，两次都要能从建议点回所用的原话。[饮食验收样例][userstudy]

这些操作在签名候选包上走通以后，团队核对 SHA-256，由李宗欣发布验过的同一份 APK，作为正式版 `v0.1.0`。发版后请参与者带回自己的问题。隔了几天，他只交代今天有什么变化，回答实际用上了哪条旧经验，还有什么得从头解释？把这次操作和他原来的做法放在一起，才能判断这个独立入口有没有帮他省事。[发布流程][build] · [版本发布页][releases]

[plan]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task8/plan.md
[graph]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/49dd670/homework/team/task8/plan.md#现在谁可以开工
[repo]: https://github.com/155TuT/PebblePile
[ci]: https://github.com/155TuT/PebblePile/actions/runs/44881842495
[draft]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/recipe/assets/research/recipe-draft-2026-10-17.md
[topic]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/recipe/homework.md
[discussion]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/recipe/assets/research/qq-chat-2026-10-19.md
[reflection]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/recipe/reply.md
[pivot]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/recipe/assets/research/wechat-draft-2026-11-06.md#个人反思
[recipe]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/recipe/research.md
[research]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/research.md
[prd]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/prd.md
[cost]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task5/ans/recipe/assets/research/wechat-draft-2026-11-06.md#54-省资源要落实为处理策略
[design]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task6/homework.md
[interviews]: https://github.com/155TuT/2601-fzu-SoftwareEngineering-YuezhongWu/blob/main/homework/team/task8/ppt/访谈.md
[userstudy]: https://github.com/155TuT/PebblePile/blob/cf9deac/docs/issue2-research.md
[front]: https://github.com/155TuT/PebblePile/pull/22
[components]: https://github.com/155TuT/PebblePile/blob/cf9deac/docs/android-components-compose.md
[verify]: https://github.com/155TuT/PebblePile/blob/cf9deac/android/ISSUE4_VERIFICATION.md
[contract]: https://github.com/155TuT/PebblePile/blob/cf9deac/docs/core-api-contract.md
[test]: https://github.com/155TuT/PebblePile/blob/cf9deac/docs/issue10-testing.md
[store]: https://github.com/155TuT/PebblePile/blob/cf9deac/android/app/src/main/java/com/pebblepile/android/db/DemoLibraryStore.kt
[db]: https://github.com/155TuT/PebblePile/issues/7
[jobs]: https://github.com/155TuT/PebblePile/issues/8
[rules]: https://github.com/155TuT/PebblePile/blob/cf9deac/android/app/src/main/java/com/pebblepile/android/DemoCoreApi.kt
[algorithm]: https://github.com/155TuT/PebblePile/issues/9
[coord]: https://github.com/155TuT/PebblePile/issues/1
[fixtures]: https://github.com/155TuT/PebblePile/issues/10#issuecomment-7042008798
[fix]: https://github.com/155TuT/PebblePile/commit/bc8b2d949b4c37a561eb232629a37053e204f287
[homehandoff]: https://github.com/155TuT/PebblePile/issues/4#issuecomment-7045235933
[detailhandoff]: https://github.com/155TuT/PebblePile/issues/5#issuecomment-7045252542
[deletion]: https://github.com/155TuT/PebblePile/pull/21
[build]: https://github.com/155TuT/PebblePile/blob/cf9deac/docs/android-build-release.md
[releases]: https://github.com/155TuT/PebblePile/releases
