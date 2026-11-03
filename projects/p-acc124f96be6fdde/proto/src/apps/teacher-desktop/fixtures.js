export const currentTerm = "2026-2027学年第一学期";

export const termOptions = ["2026-2027学年第二学期", currentTerm, "2025-2026学年第二学期"];

export const venueLibrarySeed = [
  { id: "venue-art-3", name: "美术教室 3", location: "艺术楼 3 层", capacity: 32 },
  { id: "venue-library-1", name: "图书馆研讨室", location: "图书馆 2 层", capacity: 20 },
  { id: "venue-science-1", name: "生物实验室 1", location: "科学楼 2 层", capacity: 28 },
  { id: "venue-multi-1", name: "多功能教室", location: "综合楼 1 层", capacity: 48 },
];

export const termWindows = {
  "2026-2027学年第二学期": [
    { label: "社团申报", state: "未开始", period: "待设置" },
    { label: "入团报名", state: "未开始", period: "待设置" },
  ],
  [currentTerm]: [
    { label: "社团申报", state: "已结束", period: "8月20日—9月5日" },
    { label: "入团报名", state: "进行中", period: "9月8日—10月31日" },
  ],
  "2025-2026学年第二学期": [
    { label: "社团申报", state: "已结束", period: "2月10日—2月21日" },
    { label: "入团报名", state: "已结束", period: "2月23日—3月13日" },
  ],
};

export const clubsSeed = [
  { id: 1, term: currentTerm, name: "围棋社", category: "文史学院", leader: "赵晨", grade: "八年级", className: "八年级（3）班", phone: "188 3333 1026", members: 3, capacity: 35, pendingJoins: 3, activities: 2, lastActivityAt: "10月12日", status: "进行中", origin: "从上学期延续" },
  { id: 2, term: currentTerm, name: "街舞社", category: "艺术学院", leader: "林小满", grade: "高一", className: "高一（2）班", phone: "186 1028 6742", members: 34, capacity: 40, pendingJoins: 5, activities: 8, lastActivityAt: "10月15日", status: "进行中", origin: "本学期新申报" },
  { id: 3, term: currentTerm, name: "国学研习社", category: "文史学院", leader: "顾言", grade: "九年级", className: "九年级（1）班", phone: "135 2086 3917", members: 22, capacity: 25, pendingJoins: 0, activities: 3, lastActivityAt: "9月24日", status: "已提前结束", origin: "从上学期延续", lifecycleHistory: [{ action: "提前结束本学期社团", actor: "张可可", time: "2026-10-02 15:40", reason: "学生社长因阶段性学业安排无法继续组织活动" }] },
  { id: 4, term: currentTerm, name: "阿卡贝拉社", category: "艺术学院", leader: "唐语菲", grade: "高二", className: "高二（4）班", phone: "133 6675 2048", members: 16, capacity: 20, pendingJoins: 1, activities: 0, lastActivityAt: null, status: "进行中", origin: "本学期新申报" },
  { id: 5, term: currentTerm, name: "模拟联合国", category: "国际学院", leader: "沈知行", grade: "高一", className: "高一（5）班", phone: "189 1153 8086", members: 42, capacity: 42, pendingJoins: 0, activities: 7, lastActivityAt: "10月16日", status: "进行中", origin: "从上学期延续" },
  { id: 6, term: currentTerm, name: "造物工坊", category: "科技学院", leader: "陈屿", grade: "八年级", className: "八年级（6）班", phone: "136 9320 4511", members: 25, capacity: 30, pendingJoins: 2, activities: 9, lastActivityAt: "10月17日", status: "进行中", origin: "从上学期延续", endRequest: "社长申请结束" },
  { id: 7, term: "2025-2026学年第二学期", name: "校园跑酷社", category: "体育学院", leader: "周奕辰", grade: "九年级", className: "九年级（4）班", phone: "137 1816 5290", members: 19, capacity: 24, pendingJoins: 0, activities: 11, lastActivityAt: "6月12日", status: "本学期已结束", origin: "本学期新申报" },
];

// 演示详情数据：用于验证教师如何从社团总览进入运行事实与例外治理，非正式字段定义。
export const clubDetailSeed = {
  1: {
    introduction: "面向对围棋感兴趣的同学，开展棋艺交流、对弈复盘与校园棋类活动。",
    recruitment: "招募愿意规律参与、遵守对弈礼仪并乐于交流的同学。",
    venueNeed: "图书馆研讨室",
    proposedVenue: "图书馆研讨室",
    venueDescription: "",
    venueArrangement: "图书馆研讨室",
    venueArrangementSource: "场地库",
    plan: "每周开展一次棋艺交流与对弈复盘，学期中组织校园棋类友谊赛。",
    submittedBy: "学生本人提交",
    submittedAt: "2026-08-18 16:20",
    materials: [{ label: "招新海报", value: "围棋社招新海报.png" }],
    members: [
      { name: "赵晨", grade: "八年级", className: "八年级（3）班", role: "学生社长", source: "社团申报通过", joinedAt: "2026-02-25 16:20" },
      { name: "王嘉宁", grade: "八年级", className: "八年级（5）班", role: "团员", source: "自主报名", joinedAt: "2026-09-13 19:22" },
      { name: "李沐阳", grade: "七年级", className: "七年级（2）班", role: "团员", source: "教师添加", joinedAt: "2026-09-18 15:26" },
    ],
    activities: [
      {
        name: "第 2 次围棋对弈与复盘", time: "10月12日 16:30—17:30", venue: "图书馆研讨室", publisher: "赵晨", publishedAt: "10月11日 19:20", state: "已结束", summary: "实到 3 人 · 已填写活动记录 · 3 条精彩瞬间",
        description: "围绕本周死活题和布局问题进行分组对弈，并完成三组棋局复盘。",
        attachments: ["本周死活题练习.pdf", "对弈分组安排.xlsx"],
        highlights: {
          items: [
            { author: "赵晨", role: "学生社长", time: "10月12日 17:42", text: "完成三组对弈复盘，下一次将围绕布局思路继续练习。", images: [{ src: "./assets/moment-team-1.jpg", alt: "活动现场照片" }] },
            { author: "王嘉宁", role: "团员", time: "10月12日 17:48", text: "今天的死活题练习很有收获，已整理错题。", images: [{ src: "./assets/moment-anime-1.png", alt: "成员活动照片" }] },
            { author: "李沐阳", role: "团员", time: "10月12日 18:03", text: "建议下次增加一组快棋练习。", images: [{ src: "./assets/moment-team-2.jpg", alt: "成员活动照片" }] },
          ],
        },
        record: {
          author: "赵晨",
          submittedAt: "10月12日 18:16",
          content: "本场按计划完成分组对弈和复盘。成员围绕死活题、布局与中盘转换进行了交流，并整理了下一次练习重点。",
          attachments: ["对弈复盘要点.pdf"],
          photos: [
            { src: "./assets/moment-team-1.jpg", alt: "社团活动现场" },
            { src: "./assets/moment-team-2.jpg", alt: "社团成员交流" },
            { src: "./assets/moment-team-3.jpg", alt: "社团集体活动" },
          ],
        },
        attendance: {
          attended: 3, total: 3, late: 1, absent: 0, updatedAt: "10月12日 17:31",
          records: [
            { student: "赵晨", className: "八年级（3）班", result: "已签到", time: "16:24" },
            { student: "王嘉宁", className: "八年级（5）班", result: "已签到", time: "16:28" },
            { student: "李沐阳", className: "七年级（2）班", result: "迟到", time: "16:42" },
          ],
        },
      },
      {
        name: "第 1 次围棋友谊赛准备", time: "10月5日 16:30—17:30", venue: "图书馆研讨室", publisher: "赵晨", publishedAt: "10月4日 20:10", state: "已结束", summary: "实到 3 人 · 待填写活动记录 · 2 条精彩瞬间",
        description: "确认友谊赛分组、比赛规则和各组准备事项，为下周比赛做准备。",
        attachments: ["友谊赛规则说明.pdf"],
        highlights: {
          items: [
            { author: "赵晨", role: "学生社长", time: "10月5日 17:35", text: "已完成友谊赛分组和规则说明。", images: [{ src: "./assets/moment-team-3.jpg", alt: "成员活动照片" }] },
            { author: "王嘉宁", role: "团员", time: "10月5日 17:44", text: "分组已经确认，期待下周比赛。", images: [{ src: "./assets/moment-anime-2.png", alt: "成员活动照片" }] },
          ],
        },
        record: null,
        recordRequired: true,
        attendance: { attended: 3, total: 3, late: 0, absent: 0, updatedAt: "10月5日 17:28" },
      },
    ],
    showcase: {
      works: [
        { title: "《围棋布局十二讲》学习手册", kind: "image", preview: "./assets/gallery-humanities.jpg", creator: "围棋社 · 集体创作", description: "整理 12 讲布局要点，配 36 张手绘棋谱图，已作为新社员入门教材。", uploadedAt: "2026-10-18" },
        { title: "死活题库整理（180 题）", kind: "image", preview: "./assets/gallery-humanities.jpg", creator: "赵晨 · 社长", description: "按难度分级的 180 道死活题，附标准答案与常见错误提示。", uploadedAt: "2026-10-08" },
        { title: "校际友谊赛复盘图谱", kind: "image", preview: "./assets/gallery-humanities.jpg", creator: "王嘉宁", description: "以棋谱截图拆解 6 局关键战斗，标注中盘转换与收官要点。", uploadedAt: "2026-09-26" },
        { title: "快棋训练剪辑（2 分钟版）", kind: "video", preview: "./assets/gallery-humanities.jpg", duration: "02:00", creator: "李沐阳", description: "从 40 分钟训练素材中剪出 2 分钟高光片段，用于社团招新展示。", uploadedAt: "2026-09-20" },
        { title: "围棋社队徽设计稿（第三版）", kind: "image", preview: "./assets/gallery-humanities.jpg", creator: "苏晓", description: "以棋盘与「囲」字变形为元素的新版队徽，素材版权仍在确认。", uploadedAt: "2026-09-15" },
        { title: "新社员入门讲义（含棋谱二维码）", kind: "image", preview: "./assets/gallery-humanities.jpg", creator: "围棋社 · 集体创作", description: "24 页入门讲义，附 18 个棋谱二维码，新社员扫码即可查看动态演示。", uploadedAt: "2026-09-08" },
      ],
      honors: [
        { title: "校园棋类联赛 · 团体亚军", image: "./assets/cert-rd-h1.png", receivedAt: "2026-05", uploadedAt: "2026-05-14" },
        { title: "校围棋文化节「最佳组织奖」", image: "./assets/cert-rd-h2.png", receivedAt: "2026-04", uploadedAt: "2026-04-20" },
        { title: "市中学生棋类邀请赛 · 团体第四名", image: "./assets/cert-dr-h4.png", receivedAt: "2026-03", uploadedAt: "2026-03-26" },
        { title: "2025-2026 学年「优秀学生社团」", image: "./assets/cert-rd-h3.png", receivedAt: "2025-12", uploadedAt: "2025-12-18" },
      ],
    },
    credits: [
      { student: "赵晨", status: "待提交", appliedHours: "—", leaderHours: "—", teacherHours: "—", credit: "—", submittedAt: "—", processedAt: "—" },
      { student: "王嘉宁", status: "已通过", appliedHours: "8 小时", leaderHours: "7.5 小时", teacherHours: "7 小时", credit: "1.5 学分", submittedAt: "10月14日 20:05", processedAt: "10月16日 14:20" },
      { student: "李沐阳", status: "审核中", appliedHours: "6 小时", leaderHours: "6 小时", teacherHours: "—", credit: "—", submittedAt: "10月15日 13:06", processedAt: "10月15日 16:32" },
    ],
    history: [
      { title: "延续至本学期", detail: "由 2025—2026 学年第二学期“围棋社”延续，赵晨继续担任学生社长。", time: "2026年8月20日 09:30" },
      { title: "学期结束并归档", detail: "2025—2026 学年第二学期社团运行结束，已归档。", time: "2026年7月10日 17:30" },
      { title: "恢复本学期社团运行", detail: "本学期社团已恢复运行。", time: "2026年3月27日 10:00" },
      { title: "提前结束本学期社团", detail: "本学期社团已提前结束。", time: "2026年3月20日 16:45" },
      { title: "社团首次成立", detail: "社团申报审核通过，赵晨成为学生社长。", time: "2026年2月14日 10:14" },
    ],
  },
  3: {
    introduction: "面向希望系统学习传统文化与经典文本的同学，开展经典诵读、主题研习与文化实践。",
    recruitment: "招募愿意持续参与文本研读、讨论与文化实践的同学。",
    proposedVenue: "图书馆研讨室",
    venueDescription: "希望安排一间可容纳 25 人围坐讨论、可使用投影的安静教室。",
    venueArrangement: "多功能教室",
    venueArrangementSource: "场地库",
    plan: "每两周围绕一部经典开展文本研读，并在学期中组织一次传统文化主题分享。",
    submittedBy: "学生本人提交",
    submittedAt: "2026-08-19 17:35",
    materials: [{ label: "招新海报", value: "国学研习社招新海报.png" }, { label: "活动计划", value: "国学研习社活动计划.pdf" }],
    members: [
      { name: "顾言", grade: "九年级", className: "九年级（1）班", role: "学生社长", source: "社团申报通过", joinedAt: "2026-02-21 17:35" },
      { name: "许知夏", grade: "九年级", className: "九年级（3）班", role: "团员", source: "自主报名", joinedAt: "2026-09-11 18:40" },
    ],
    activities: [],
    credits: [],
    history: [
      { title: "提前结束本学期社团", detail: "因学生社长阶段性学业安排，教师确认提前结束", time: "2026年10月2日 15:40" },
      { title: "延续至本学期", detail: "由 2025—2026 学年第二学期“国学研习社”延续", time: "2026年8月19日 17:35" },
    ],
  },
  7: {
    introduction: "面向喜爱跑酷与体能训练的同学，开展安全规范学习、基础训练与校园障碍体验。",
    recruitment: "招募愿意遵守训练规范、持续参与并关注同伴安全的同学。",
    venueNeed: "操场东侧体能训练区",
    venueSource: "拟用场地",
    plan: "每周开展一次基础训练与路线练习，学期中组织一次校园障碍挑战展示。",
    members: [
      { name: "周奕辰", grade: "九年级", className: "九年级（4）班", role: "学生社长", source: "社团申报通过", joinedAt: "2025-08-28 16:45" },
      { name: "许言", grade: "九年级", className: "九年级（2）班", role: "团员", source: "自主报名", joinedAt: "2025-09-03 12:16" },
      { name: "韩思远", grade: "八年级", className: "八年级（6）班", role: "团员", source: "自主报名", joinedAt: "2025-09-05 09:40" },
    ],
  },
};

export const applicationSeed = [
  { id: 101, term: currentTerm, name: "校园观鸟社", category: "科技学院", applicant: "许知夏", className: "七年级（3）班", grade: "七年级", capacity: 24, venueType: "协助需求", venueText: "一间可存放观测器材的教室", submittedBy: "学生本人提交", operator: "许知夏", phone: "138 5120 7634", introduction: "面向对鸟类观察与自然记录感兴趣的同学，开展校园观鸟、物种识别和自然保护主题交流。", recruitment: "招募愿意参与周末晨间观察、能够遵守校园活动规范的同学。", poster: "校园观鸟社招新海报.png", plan: "每周开展 1 次校园观鸟与记录活动，期中组织一次物种识别分享。", submittedAt: "2026-09-16 16:24", status: "待审核" },
  { id: 102, term: currentTerm, name: "非遗手作社", category: "艺术学院", applicant: "宋晚晴", className: "八年级（1）班", grade: "八年级", capacity: 30, venueType: "拟用场地", venueSource: "场地库", venueText: "美术教室 3", submittedBy: "教师代提交", operator: "李慧老师", phone: "139 4872 1206", introduction: "通过传统手作体验了解非遗技艺，并完成社团成员共同创作。", recruitment: "招募对传统手作感兴趣、愿意共同维护活动空间的同学。", poster: "非遗手作社招新海报.png", plan: "每两周围绕一种传统手作开展体验与交流，并在学期末集中展示作品。", submittedAt: "2026-09-15 18:07", status: "待审核" },
  { id: 103, term: currentTerm, name: "数学建模社", category: "科技学院", applicant: "郭子扬", className: "高一（2）班", grade: "高一", capacity: 20, venueType: "协助需求", venueText: "普通教室，需学校协助安排", submittedBy: "家长代提交", operator: "郭子扬家长", phone: "137 6982 4510", introduction: "围绕真实问题开展数学建模、数据分析和小组探究。", recruitment: "招募对数学应用、数据分析或编程有兴趣的同学。", poster: "数学建模社招新海报.png", plan: "每周开展一次主题研讨与小组练习，学期末完成一次建模成果分享。", submittedAt: "2026-09-14 12:31", status: "待审核" },
  { id: 104, term: currentTerm, name: "光影摄影社", category: "艺术学院", applicant: "叶青禾", className: "九年级（4）班", grade: "九年级", capacity: 25, venueType: "协助需求", venueText: "校园内流动开展", submittedBy: "学生本人提交", operator: "叶青禾", phone: "136 0274 8951", introduction: "通过校园摄影实践记录校园生活并交流影像表达。", recruitment: "招募对摄影和影像创作感兴趣的同学。", poster: "光影摄影社招新海报.png", plan: "围绕校园主题开展摄影交流与作品展示。", submittedAt: "2026-09-10 14:20", status: "已通过" },
  { id: 105, term: currentTerm, name: "桌游设计社", category: "文史学院", applicant: "刘一航", className: "八年级（2）班", grade: "八年级", capacity: 18, venueType: "拟用场地", venueSource: "场地库", venueText: "图书馆研讨室", submittedBy: "学生本人提交", operator: "刘一航", phone: "135 1602 4791", introduction: "通过桌游体验、规则设计与测试开展小组协作。", recruitment: "招募喜欢策略游戏和创意设计的同学。", poster: "桌游设计社招新海报.png", plan: "每周开展桌游体验或设计测试，并沉淀规则原型。", submittedAt: "2026-09-08 09:42", status: "已退回" },
  { id: 106, term: "2025-2026学年第二学期", name: "校园电台社", category: "艺术学院", applicant: "方予安", className: "高一（5）班", grade: "高一", capacity: 16, venueType: "拟用场地", venueSource: "填写说明", venueText: "校园广播站", submittedBy: "学生本人提交", operator: "方予安", phone: "138 7609 5214", introduction: "围绕校园新闻、音乐和学生声音制作校园广播内容。", recruitment: "招募对播音、编辑和音频制作有兴趣的同学。", poster: "校园电台社招新海报.png", plan: "每周完成一次节目策划与制作，并在校园广播站播出。", submittedAt: "2026-02-18 10:12", status: "已通过" },
].map((application) => ({
  ...application,
  materials: [
    { label: "招新海报", value: application.poster, kind: "附件" },
    { label: "活动计划", value: application.plan, kind: "填写内容" },
  ],
  approvalHistory: application.status === "待审核" ? [
    { action: "提交申报", actor: application.operator, time: application.submittedAt, detail: application.submittedBy },
  ] : application.status === "已通过" ? [
    { action: "提交申报", actor: application.operator, time: application.submittedAt, detail: application.submittedBy },
    { action: "审核通过", actor: "张可可", time: "2026-09-11 10:20", detail: "" },
  ] : [
    { action: "提交申报", actor: application.operator, time: application.submittedAt, detail: application.submittedBy },
    { action: "审核退回", actor: "张可可", time: "2026-09-09 14:10", detail: "请补充说明活动组织与安全安排" },
  ],
}));

export const endRequestSeed = [
  { id: 301, term: currentTerm, club: "造物工坊", category: "科技学院", leader: "陈屿", grade: "八年级", members: 25, activities: 9, reason: "课业时间调整，无法继续组织本学期社团活动", submittedAt: "2026-10-18 16:40", status: "待审核" },
];

export const continuationRequestSeed = [
  {
    id: 401,
    club: "校园跑酷社",
    category: "体育学院",
    originalTerm: "2025-2026学年第二学期",
    targetTerm: currentTerm,
    leader: "周奕辰",
    grade: "九年级",
    retainedMembers: 16,
    capacity: 24,
    continueRecruiting: true,
    introduction: "面向喜爱跑酷与体能训练的同学，开展安全规范学习、基础训练与校园障碍体验。",
    coverName: "沿用当前社团封面",
    phone: "137 1816 5290",
    recruitment: "招募愿意遵守训练规范、持续参与并关注同伴安全的同学。",
    venueType: "拟用场地",
    venueText: "操场东侧体能训练区",
    posterName: "沿用当前招新海报",
    plan: "每周开展一次基础训练与路线练习，学期中组织一次校园障碍挑战展示。",
    submittedAt: "2026-08-16 14:32",
    status: "待审核",
    approvalHistory: [{ action: "提交延续申请", actor: "周奕辰", time: "2026-08-16 14:32", detail: "学生社长" }],
  },
];

export const creditSeed = [
  {
    id: 201,
    term: currentTerm,
    student: "林小满",
    className: "初二（1）班",
    club: "街舞社",
    category: "艺术类",
    role: "团长",
    appliedHours: 12,
    leaderHours: null,
    teacherHours: 12,
    suggestedCredit: 2,
    submittedAt: "2026-09-16 10:21",
    status: "待审核",
    adjusted: "未调整",
    summary: "本学期作为社长全面负责街舞社的纳新组建、每周常规集训与期末迎新展演排练。全勤带队组织 6 场活动并及时整理归档活动记录，带领 12 名团员共同进步。",
    attachments: [
      { name: "街舞社常规训练考勤与期末展演成果单.pdf", size: "1.8MB" }
    ],
    facts: {
      activitiesCount: 6,
      activitiesHours: 9.5,
      attendanceCount: 6,
      attendanceTotal: 6,
      attendanceDone: true,
      recordsCount: 6,
      recordsDone: true,
      membersCount: 12,
    },
    approvalHistory: [
      { action: "提交社长学分申报", actor: "林小满（社长）", time: "2026-09-16 10:21", detail: "申报 12 小时（带队 9.5 小时），报送教师终审" }
    ],
  },
  {
    id: 202,
    term: currentTerm,
    student: "王嘉宁",
    className: "初二（3）班",
    club: "围棋社",
    category: "体育类",
    role: "团员",
    appliedHours: 8,
    leaderHours: 7,
    teacherHours: 7,
    suggestedCredit: 1.5,
    submittedAt: "2026-09-15 17:40",
    status: "待审核",
    adjusted: "已调整",
    summary: "本学期按时参加全部 4 场日常对弈与残局研讨，技战术摸底和对局达标；额外协助社长筹备社内快棋交流赛并负责赛程签到，累计投入约 1.5 小时。",
    attachments: [
      { name: "王嘉宁_围棋社对局记录与快棋赛签到表.pdf", size: "860KB" }
    ],
    facts: {
      attendedCount: 4,
      attendedHours: 6.5,
      discussionsCount: 4,
      featuredDiscussions: 1,
    },
    leaderAudit: {
      auditor: "周奕辰",
      auditorRole: "社长",
      auditedAt: "2026-09-15 18:20",
      hours: 7,
      comment: "本学期常规对弈出勤良好，有 1 次请假已扣减相应学时；有持续的活动参与与分享，初审同意核定为 7 小时。",
    },
    approvalHistory: [
      { action: "提交学分申报", actor: "王嘉宁", time: "2026-09-15 17:40", detail: "申报 8 小时" },
      { action: "社长初审通过", actor: "周奕辰（社长）", time: "2026-09-15 18:20", detail: "核定 7 小时：本学期常规对弈出勤良好，扣减1次请假学时" }
    ],
  },
  {
    id: 203,
    term: currentTerm,
    student: "李沐阳",
    className: "初一（2）班",
    club: "造物工坊",
    category: "科技类",
    role: "团员",
    appliedHours: 6,
    leaderHours: 6,
    teacherHours: 6,
    suggestedCredit: 1,
    submittedAt: "2026-09-15 13:06",
    status: "待审核",
    adjusted: "未调整",
    summary: "在造物工坊全勤完成所有木工与3D打印工作坊项目，掌握了机械结构拼装基础，并协助指导教师维护3D打印机与耗材清点。",
    attachments: [
      { name: "李沐阳_造物工坊作品集与实践报告.pdf", size: "2.4MB" }
    ],
    facts: {
      attendedCount: 5,
      attendedHours: 6.0,
      discussionsCount: 3,
      featuredDiscussions: 0,
    },
    leaderAudit: {
      auditor: "张天泽",
      auditorRole: "社长",
      auditedAt: "2026-09-15 15:10",
      hours: 6,
      comment: "全勤参与工坊活动，模型作品完成度高，同意按申报6小时认定。",
    },
    approvalHistory: [
      { action: "提交学分申报", actor: "李沐阳", time: "2026-09-15 13:06", detail: "申报 6 小时" },
      { action: "社长初审通过", actor: "张天泽（社长）", time: "2026-09-15 15:10", detail: "核定 6 小时：作品完成度高，全勤参与" }
    ],
  },
  {
    id: 204,
    term: currentTerm,
    student: "沈知行",
    className: "初三（2）班",
    club: "模拟联合国",
    category: "人文类",
    role: "团长",
    appliedHours: 9,
    leaderHours: null,
    teacherHours: 9,
    suggestedCredit: 1.5,
    submittedAt: "2026-09-12 11:18",
    status: "已通过",
    adjusted: "未调整",
    summary: "带领模联社开展本学期4场常规议题辩论与1场校际线上模联交流，组织各代表团撰写立场文件。",
    attachments: [
      { name: "模拟联合国2026秋季大会总结册.pdf", size: "3.2MB" }
    ],
    facts: {
      activitiesCount: 5,
      activitiesHours: 9.0,
      attendanceCount: 5,
      attendanceTotal: 5,
      attendanceDone: true,
      recordsCount: 5,
      recordsDone: true,
      membersCount: 16,
    },
    teacherAudit: {
      auditor: "张可可",
      auditedAt: "2026-09-13 14:10",
      hours: 9,
      credit: 1.5,
      comment: "议题设计规范，学生组织与记录归档完整，带队成效显著，予以认定通过。",
    },
    approvalHistory: [
      { action: "提交社长学分申报", actor: "沈知行（社长）", time: "2026-09-12 11:18", detail: "申报 9 小时，报送教师终审" },
      { action: "教师审核通过", actor: "张可可", time: "2026-09-13 14:10", detail: "核定 9 小时（1.5 学分）：议题设计规范，归档完整" }
    ],
  },
  {
    id: 205,
    term: currentTerm,
    student: "赵子墨",
    className: "初二（4）班",
    club: "围棋社",
    category: "体育类",
    role: "团员",
    appliedHours: 4,
    leaderHours: 3,
    teacherHours: 3,
    suggestedCredit: 0.5,
    submittedAt: "2026-09-10 15:23",
    status: "已退回",
    adjusted: "已调整",
    summary: "参加了围棋社对弈活动。",
    attachments: [],
    facts: {
      attendedCount: 2,
      attendedHours: 3.0,
      discussionsCount: 0,
      featuredDiscussions: 0,
    },
    leaderAudit: {
      auditor: "周奕辰",
      auditorRole: "社长",
      auditedAt: "2026-09-10 16:45",
      hours: 3,
      comment: "有多次缺勤，初审扣减至3小时。",
    },
    teacherAudit: {
      auditor: "张可可",
      auditedAt: "2026-09-11 09:30",
      returnReason: "缺少活动参与总结与证明材料，出勤记录不完整，请补充材料后重新提交申报。",
    },
    approvalHistory: [
      { action: "提交学分申报", actor: "赵子墨", time: "2026-09-10 15:23", detail: "申报 4 小时" },
      { action: "社长初审通过", actor: "周奕辰（社长）", time: "2026-09-10 16:45", detail: "核定 3 小时：初审扣减缺勤学时" },
      { action: "教师审核退回", actor: "张可可", time: "2026-09-11 09:30", detail: "退回：缺少活动总结与证明材料，出勤记录不完整" }
    ],
  },
  {
    id: 206,
    term: "2025-2026学年第二学期",
    student: "陈思远",
    className: "初一（5）班",
    club: "校园电台社",
    category: "艺术类",
    role: "团员",
    appliedHours: 10,
    leaderHours: 10,
    teacherHours: 10,
    suggestedCredit: 2,
    submittedAt: "2026-06-20 09:15",
    status: "已通过",
    adjusted: "未调整",
    summary: "负责电台午间广播节目录制与音频剪辑，累计播出 10 期。",
    attachments: [
      { name: "电台节目单与音频档案.pdf", size: "1.2MB" }
    ],
    facts: {
      attendedCount: 10,
      attendedHours: 10.0,
      discussionsCount: 8,
      featuredDiscussions: 2,
    },
    leaderAudit: {
      auditor: "林嘉欣",
      auditorRole: "社长",
      auditedAt: "2026-06-20 10:30",
      hours: 10,
      comment: "播音与剪辑工作踏实负责，同意全额认定。",
    },
    teacherAudit: {
      auditor: "张可可",
      auditedAt: "2026-06-21 11:00",
      hours: 10,
      credit: 2,
      comment: "认定通过，计入上学期学分。",
    },
    approvalHistory: [
      { action: "提交学分申报", actor: "陈思远", time: "2026-06-20 09:15", detail: "申报 10 小时" },
      { action: "社长初审通过", actor: "林嘉欣（社长）", time: "2026-06-20 10:30", detail: "核定 10 小时" },
      { action: "教师审核通过", actor: "张可可", time: "2026-06-21 11:00", detail: "核定 10 小时（2.0 学分）" }
    ],
  },
];
