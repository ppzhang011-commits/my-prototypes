import React, { useState, useEffect } from 'react';
import {
  Compass,
  ChartLineUp,
  MagnifyingGlass,
  Flag,
  Clock,
  CheckCircle,
  WarningCircle,
  X,
  CaretRight,
  CaretLeft,
  CalendarBlank,
  MapPin,
  User,
  Users,
  ClipboardText,
  ArrowClockwise,
  Phone,
  CaretDown,
  CaretUp,
  Sparkle,
  Star,
  Medal,
  Student,
  ChatCircleDots,
  Certificate,
  PuzzlePiece,
  SealCheck,
  Quotes,
  Check,
  Camera,
  Trophy,
  ArrowLeft,
  ImageSquare,
  Eye
} from '@phosphor-icons/react';

// 对齐学生桌面端真实数据的社团名录
const PLAZA_CLUBS = [
  {
    id: 'football',
    name: '足球联盟',
    category: '体育',
    captain: '赵子安',
    contact: '138 0000 9218',
    cover: './assets/poster-football.jpg',
    members: 18,
    capacity: 30,
    short: '面向喜欢足球的同学，开展日常训练、友谊赛和校园足球活动。',
    recruitment: '有基础或愿意长期参加训练的同学均可申请。',
    timeParts: { days: '3', hours: '08', mins: '24', secs: 36 },
    applyEnded: false,
    isOpen: true,
  },
  {
    id: 'ai-robot',
    name: '机器人探索社',
    category: '科技',
    captain: '陈闻远',
    contact: '136 0000 5306',
    cover: './assets/poster-robot.jpg',
    members: 12,
    capacity: 20,
    short: '围绕结构搭建、编程和创意挑战，完成可展示的机器人作品。',
    recruitment: '对机械、编程或创意设计感兴趣即可。',
    timeParts: { days: '2', hours: '11', mins: '03', secs: 12 },
    applyEnded: false,
    isOpen: true,
  },
  {
    id: 'drama',
    name: '光影戏剧社',
    category: '艺术',
    captain: '李若彤',
    contact: '139 0000 1860',
    cover: './assets/poster-drama.jpg',
    members: 24,
    capacity: 24,
    short: '从剧本、表演到舞台设计，共同完成一场属于学生的校园演出。',
    recruitment: '欢迎表演、编剧、灯光与舞美方向的同学。',
    timeParts: { days: '3', hours: '08', mins: '24', secs: 36 },
    applyEnded: false,
    isOpen: false, // 名额已满
  },
  {
    id: 'reading',
    name: '山海阅读会',
    category: '人文',
    captain: '周予安',
    contact: '137 0000 2648',
    cover: './assets/poster-reading.jpg',
    members: 21,
    capacity: 36,
    short: '一起读、一起聊，从一本书延伸到更广阔的世界。',
    recruitment: '愿意稳定参加共读与分享活动。',
    applyEnd: '2026-09-20 00:00',
    applyEnded: true,
    isOpen: false, // 已截止
  }
];

// 对齐学生桌面端申报真实数据（包含待审核、已通过、未通过及教师审核意见）
const INITIAL_PROPOSAL_RECORDS = [
  {
    id: 'prop-1',
    name: '城市观察社',
    category: '人文',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    statusText: '待审核',
    captain: '赵子易',
    capacity: 30,
    submittedAt: '2026-09-15 14:30',
    cover: './assets/poster-reading.jpg',
    venueDesc: '需容纳30人且配有投影的多媒体教室（近西操场）',
    short: '记录城市空间与变迁，开展社会学微调研与摄影走访。',
    recruitment: '对城市空间、社会调查与摄影写作感兴趣的同学。',
    phone: '138 0000 9218'
  },
  {
    id: 'prop-2',
    name: '校园纪录片社',
    category: '艺术',
    status: 'approved',
    statusText: '已通过',
    captain: '赵子易',
    capacity: 20,
    submittedAt: '2026-09-12 16:10',
    cover: './assets/poster-drama.jpg',
    venue: '影视工作室',
    short: '用镜头捕捉校园真实生活与师生故事，创作原创短片。',
    recruitment: '欢迎对摄影剪辑、导演与编导感兴趣的同学。',
    phone: '138 0000 9218'
  },
  {
    id: 'prop-3',
    name: '古诗词吟诵社',
    category: '人文',
    status: 'rejected',
    statusText: '未通过',
    captain: '赵子易',
    capacity: 25,
    submittedAt: '2026-09-06 10:15',
    cover: './assets/poster-reading.jpg',
    venue: '图书馆 302',
    venueDesc: '周三下午使用，需配备古琴及朗诵长桌',
    teacherFeedback: {
      teacher: '李明',
      time: '2026-09-08 15:40',
      reason: '本学期活动计划未填写完整，图书馆 302 周三已有课程占用，请调整场地说明或补充活动计划后重新申报。'
    },
    short: '经典古诗词诵读、诗意鉴赏与古风雅集活动。',
    recruitment: '热爱中国古代文学与古风朗诵表达。',
    phone: '138 0000 9218'
  }
];

// 可选学期名录
const ENROLL_TERM_OPTIONS = [
  '2026-2027 学年上学期',
  '2025-2026 学年下学期',
  '2025-2026 学年上学期'
];

// 对齐学生桌面端真实数据的【社团风采】数据（作品集锦 + 荣誉时刻，参考图1）
const CLUB_SHOWCASE_DATA = {
  football: {
    works: [
      {
        id: "w1",
        title: "《校园足球战术手册》",
        creator: "足球联盟 · 集体创作",
        desc: "整理 12 套常用站位与跑位路线，配 36 张手绘图解，已作为新社员训练教材。",
        cover: "./assets/gallery-sports.jpg",
        date: "2026-10-20",
        uploader: "赵子安 · 社长上传"
      },
      {
        id: "w2",
        title: "《颠球百日打卡》记录册",
        creator: "赵子安 · 社长",
        desc: "连续 100 天颠球打卡影像与数据曲线，最好成绩单次 214 个。",
        cover: "./assets/gallery-sports.jpg",
        date: "2026-10-12",
        uploader: "赵子安 · 社长上传"
      },
      {
        id: "w3",
        title: "守门员扑救动作拆解图",
        creator: "陈沐阳",
        desc: "以慢动作截图拆解侧扑、单手托球等 8 个标准动作。",
        cover: "./assets/gallery-sports.jpg",
        date: "2026-09-30",
        uploader: "赵子安 · 社长上传"
      },
      {
        id: "w4",
        title: "「班级联赛」策划案",
        creator: "李一诺",
        desc: "面向全校 24 个班级的迷你联赛方案，含赛程编排与安全预案。",
        cover: "./assets/gallery-sports.jpg",
        date: "2026-09-22",
        uploader: "赵子安 · 社长上传"
      },
      {
        id: "w5",
        title: "足球社队徽设计稿（第三版）",
        creator: "苏晓",
        desc: "以盾牌与星星为元素的新版队徽，经全员投票定为社团新形象。",
        cover: "./assets/gallery-sports.jpg",
        date: "2026-09-15",
        uploader: "赵子安 · 社长上传"
      }
    ],
    honors: [
      {
        id: "h1",
        title: "校园足球联赛 · 冠军",
        time: "2026-10",
        desc: "在校级足球联赛决赛中斩获总冠军。",
        cover: "./assets/cert-fb-h1.png",
        date: "2026-10-24",
        uploader: "赵子安 · 社长上传"
      },
      {
        id: "h2",
        title: "优秀学生社团",
        time: "2026-06",
        desc: "获评学校本学年五星级优秀学生社团。",
        cover: "./assets/cert-fb-h3.png",
        date: "2026-06-20",
        uploader: "赵子安 · 社长上传"
      },
      {
        id: "h3",
        title: "最佳组织奖",
        time: "2026-05",
        desc: "校园体育文化节优秀赛事组织奖。",
        cover: "./assets/cert-fb-h4.png",
        date: "2026-05-18",
        uploader: "赵子安 · 社长上传"
      }
    ]
  },
  drama: {
    works: [
      {
        id: "dw1",
        title: "校园人物微纪录片《微光》",
        creator: "林小薇 · 导演",
        desc: "记录食堂师傅与保洁阿姨的一天，成片入选校电视台展播。",
        cover: "./assets/gallery-art.jpg",
        date: "2026-10-18",
        uploader: "林小薇 · 社长上传"
      },
      {
        id: "dw2",
        title: "秋日落叶分镜手绘稿",
        creator: "纪录片社创作一组",
        desc: "全套 28 镜分镜手绘草图，包含光影与焦段标注。",
        cover: "./assets/gallery-art.jpg",
        date: "2026-10-05",
        uploader: "林小薇 · 社长上传"
      }
    ],
    honors: [
      {
        id: "dh1",
        title: "校原创短视频大赛 · 一等奖",
        time: "2026-09",
        desc: "作品《微光》荣获校第十二届短视频大赛一等奖。",
        cover: "./assets/cert-dr-h1.png",
        date: "2026-09-28",
        uploader: "林小薇 · 社长上传"
      },
      {
        id: "dh2",
        title: "校园美育特别贡献社团",
        time: "2026-06",
        desc: "为校园戏剧节及各类校级活动提供高水平影像支持。",
        cover: "./assets/cert-dr-h3.png",
        date: "2026-06-15",
        uploader: "林小薇 · 社长上传"
      }
    ]
  },
  'ai-robot': {
    works: [
      {
        id: "rw1",
        title: "双足巡线避障车装配图纸",
        creator: "陈闻远、机械组",
        desc: "采用自主设计的 3D 打印轻量化底盘与红外测距算法。",
        cover: "./assets/gallery-tech.jpg",
        date: "2026-10-15",
        uploader: "陈闻远 · 社长上传"
      },
      {
        id: "rw2",
        title: "机械抓手控制固件代码 (v2.1)",
        creator: "编程组集体",
        desc: "优化 PID 闭环电机响应，抓取准确率提升至 96%。",
        cover: "./assets/gallery-tech.jpg",
        date: "2026-09-28",
        uploader: "陈闻远 · 社长上传"
      }
    ],
    honors: [
      {
        id: "rh1",
        title: "青少年科创挑战赛 · 二等奖",
        time: "2026-05",
        desc: "市级青少年机器人创意设计挑战赛团体二等奖。",
        cover: "./assets/cert-fb-h5.png",
        date: "2026-05-20",
        uploader: "陈闻远 · 社长上传"
      }
    ]
  },
  reading: {
    works: [
      {
        id: "rw1",
        title: "《山海经》异兽想象图集",
        creator: "读书会共读小组",
        desc: "汇编 15 幅神话异兽手绘插图与现代神话考证笔记。",
        cover: "./assets/gallery-humanities.jpg",
        date: "2026-09-25",
        uploader: "周予安 · 社长上传"
      }
    ],
    honors: [
      {
        id: "rh1",
        title: "书香校园 · 十佳读书社团",
        time: "2026-04",
        desc: "获评海淀区“书香校园”十佳学生读书组织。",
        cover: "./assets/cert-rd-h1.png",
        date: "2026-04-23",
        uploader: "周予安 · 社长上传"
      }
    ]
  }
};

// 对齐学生桌面端真实数据的【全部活动瞬间】数据（14份分享 · 覆盖6场活动，参考图2）
const CLUB_MOMENTS_DATA = {
  football: {
    summary: { total: 14, covered: 6 },
    activities: [
      { id: "all", name: "全部活动" },
      { id: "act-1", name: "校园足球友谊交流赛" },
      { id: "act-2", name: "周三战术跑位与阵型协同训练" },
      { id: "act-3", name: "校际交流准备与体能恢复加练" },
      { id: "act-4", name: "上周三高位逼抢与协防专题演练" },
      { id: "act-5", name: "周三传切配合与攻防转换实训" },
      { id: "act-6", name: "学期初全员选拔与基础技术测试" }
    ],
    moments: [
      {
        id: "m1",
        actId: "act-1",
        actName: "校园足球友谊交流赛",
        photo: "./assets/moment-team-1.jpg",
        author: "顾一然",
        time: "活动前 1 天",
        isFeatured: true,
        text: "赛前双方互相鼓劲加油，场面非常热烈！"
      },
      {
        id: "m2",
        actId: "act-1",
        actName: "校园足球友谊交流赛",
        photo: "./assets/moment-team-2.jpg",
        author: "张子墨",
        time: "活动前 18 小时",
        isFeatured: false,
        text: "热身准备很充分，大家状态都很饱满。"
      },
      {
        id: "m3",
        actId: "act-2",
        actName: "周三战术跑位与阵型协同训练",
        photo: "./assets/moment-team-3.jpg",
        author: "顾一然",
        time: "16:10",
        isFeatured: true,
        text: "教练指导中场跑位细节，收获很大。"
      },
      {
        id: "m4",
        actId: "act-2",
        actName: "周三战术跑位与阵型协同训练",
        photo: "./assets/gallery-sports.jpg",
        author: "沈清越",
        time: "16:15",
        isFeatured: false,
        text: "阵型保持得很紧凑，攻防转换速度加快了。"
      },
      {
        id: "m5",
        actId: "act-2",
        actName: "周三战术跑位与阵型协同训练",
        photo: "./assets/moment-team-1.jpg",
        author: "赵子易",
        time: "16:18",
        isFeatured: true,
        text: "边路传中与包抄射门训练，非常过瘾！"
      },
      {
        id: "m6",
        actId: "act-3",
        actName: "校际交流准备与体能恢复加练",
        photo: "./assets/moment-team-2.jpg",
        author: "陈思语",
        time: "17:45",
        isFeatured: true,
        text: "慢跑放松与肌肉拉伸，恢复体能准备迎接大考。"
      },
      {
        id: "m7",
        actId: "act-3",
        actName: "校际交流准备与体能恢复加练",
        photo: "./assets/moment-team-3.jpg",
        author: "许嘉禾",
        time: "17:50",
        isFeatured: false,
        text: "喝水休息时讨论刚才战术失误点，反思很有价值。"
      },
      {
        id: "m8",
        actId: "act-4",
        actName: "上周三高位逼抢与协防专题演练",
        photo: "./assets/gallery-sports.jpg",
        author: "顾一然",
        time: "10-16 18:10",
        isFeatured: false,
        text: "前场逼抢要讲究默契，今天压迫感打出来了。"
      },
      {
        id: "m9",
        actId: "act-4",
        actName: "上周三高位逼抢与协防专题演练",
        photo: "./assets/moment-team-1.jpg",
        author: "张子墨",
        time: "10-16 18:30",
        isFeatured: false,
        text: "协防补位意识增强，防守反击越来越纯熟。"
      },
      {
        id: "m10",
        actId: "act-5",
        actName: "周三传切配合与攻防转换实训",
        photo: "./assets/moment-team-2.jpg",
        author: "赵子易",
        time: "10-09 18:00",
        isFeatured: true,
        text: "两肋直塞打身后，成功打进两个漂亮进球！"
      },
      {
        id: "m11",
        actId: "act-5",
        actName: "周三传切配合与攻防转换实训",
        photo: "./assets/moment-team-3.jpg",
        author: "周天羽",
        time: "10-09 19:20",
        isFeatured: true,
        text: "全队复盘讨论，社长总结战术亮点。"
      },
      {
        id: "m12",
        actId: "act-6",
        actName: "学期初全员选拔与基础技术测试",
        photo: "./assets/gallery-sports.jpg",
        author: "顾一然",
        time: "09-25 18:00",
        isFeatured: true,
        text: "新学期第一课，大家测试成绩普遍有提高。"
      },
      {
        id: "m13",
        actId: "act-6",
        actName: "学期初全员选拔与基础技术测试",
        photo: "./assets/moment-team-1.jpg",
        author: "李一诺",
        time: "09-25 18:15",
        isFeatured: false,
        text: "折返跑和颠球测试，新生很有拼搏精神。"
      },
      {
        id: "m14",
        actId: "act-6",
        actName: "学期初全员选拔与基础技术测试",
        photo: "./assets/moment-team-2.jpg",
        author: "陈沐阳",
        time: "09-25 18:40",
        isFeatured: true,
        text: "守门员单项摸底，扑救基本功很扎实。"
      }
    ]
  },
  drama: {
    summary: { total: 8, covered: 4 },
    activities: [
      { id: "all", name: "全部活动" },
      { id: "dact-1", name: "校园人物微纪录片初剪沟通会" },
      { id: "dact-2", name: "校园微纪录片补拍分工会" },
      { id: "dact-3", name: "影视摄影构图与手持云台实操训练" },
      { id: "dact-4", name: "纪录片选题与采访提纲工作坊" }
    ],
    moments: [
      {
        id: "dm1",
        actId: "dact-1",
        actName: "校园人物微纪录片初剪沟通会",
        photo: "./assets/moment-anime-1.png",
        author: "林小薇",
        time: "15:40",
        isFeatured: true,
        text: "讨论剪辑节奏，各小组分镜衔接很顺。"
      },
      {
        id: "dm2",
        actId: "dact-2",
        actName: "校园微纪录片补拍分工会",
        photo: "./assets/moment-anime-2.png",
        author: "张同学",
        time: "昨天",
        isFeatured: false,
        text: "明确了外拍设备分工，明天开拍。"
      },
      {
        id: "dm3",
        actId: "dact-3",
        actName: "影视摄影构图与手持云台实操训练",
        photo: "./assets/gallery-art.jpg",
        author: "陈同学",
        time: "10-18 16:30",
        isFeatured: true,
        text: "三轴稳定器跟拍练习，运镜平稳度大幅提高。"
      }
    ]
  }
};

// 【我报名的社团】报名申请记录（包含当前学期三大状态及历史学期记录）
const INITIAL_ENROLL_APPLICATIONS = [
  // 当前学期：2026-2027 学年上学期
  {
    id: 'enroll-1',
    term: '2026-2027 学年上学期',
    clubId: 'ai-robot',
    clubName: '机器人探索社',
    category: '科技',
    cover: './assets/poster-robot.jpg',
    captain: '陈闻远',
    contact: '136 0000 5306',
    status: 'pending', // 待审核
    statusText: '待审核',
    submittedAt: '2026-09-12 14:20',
    note: '已协助孩子提交入团意向，等待学生社长陈闻远审核录用。'
  },
  {
    id: 'enroll-2',
    term: '2026-2027 学年上学期',
    clubId: 'football',
    clubName: '足球联盟',
    category: '体育',
    cover: './assets/poster-football.jpg',
    captain: '赵子安',
    contact: '138 0000 9218',
    status: 'passed', // 已通过
    statusText: '已通过',
    submittedAt: '2026-09-02 10:15',
    passedAt: '2026-09-04 16:30',
    note: '孩子已正式录用为该社团团员。'
  },
  {
    id: 'enroll-2b',
    term: '2026-2027 学年上学期',
    clubId: 'drama',
    clubName: '校园纪录片社',
    category: '艺术',
    cover: './assets/poster-drama.jpg',
    captain: '林小薇',
    contact: '139 0000 8122',
    status: 'passed', // 已通过
    statusText: '已通过',
    submittedAt: '2026-09-02 10:15',
    passedAt: '2026-09-04 16:30',
    note: '孩子已正式录用为该社团团员。'
  },
  {
    id: 'enroll-3',
    term: '2026-2027 学年上学期',
    clubId: 'drama-acting',
    clubName: '光影戏剧社',
    category: '艺术',
    cover: './assets/poster-reading.jpg',
    captain: '李若彤',
    contact: '139 0000 1860',
    status: 'rejected', // 未通过
    statusText: '未通过',
    submittedAt: '2026-09-05 11:30',
    feedback: '社长审核意见：本社团招募名额已满，优先录用了有舞台台词基础的高年级同学。'
  },
  // 历史学期：2025-2026 学年下学期
  {
    id: 'enroll-hist-1',
    term: '2025-2026 学年下学期',
    clubId: 'reading',
    clubName: '山海阅读会',
    category: '人文',
    cover: './assets/poster-reading.jpg',
    captain: '周予安',
    contact: '137 0000 2648',
    status: 'passed',
    statusText: '已通过',
    submittedAt: '2026-03-02 09:20',
    passedAt: '2026-03-05 14:10',
    note: '该学期社团已圆满结课，已完成全部研读任务。'
  },
  {
    id: 'enroll-hist-2',
    term: '2025-2026 学年下学期',
    clubId: 'football',
    clubName: '足球联盟',
    category: '体育',
    cover: './assets/poster-football.jpg',
    captain: '赵子安',
    contact: '138 0000 9218',
    status: 'rejected',
    statusText: '未通过',
    submittedAt: '2026-03-03 16:40',
    feedback: '社长审核意见：本学期足球梯队选拔名额已满。'
  },
  // 历史学期：2025-2026 学年上学期
  {
    id: 'enroll-hist-3',
    term: '2025-2026 学年上学期',
    clubId: 'mun',
    clubName: '模拟联合国社',
    category: '人文',
    cover: './assets/poster-reading.jpg',
    captain: '张越',
    contact: '138 0000 7712',
    status: 'passed',
    statusText: '已通过',
    submittedAt: '2025-09-06 14:00',
    passedAt: '2025-09-10 11:20',
    note: '该学期社团已圆满结课，已代表学校参加校际研讨交流。'
  }
];

export default function App() {
  // 当前处于的视图页面：'main' (广场/报告) | 'proposeCenter' (社团申报专区) | 'proposeForm' (申报表单)
  const [currentView, setCurrentView] = useState('main');

  // 当前激活的双 Tab：'plaza' (社团广场) | 'report' (社团报告)
  const [activeTab, setActiveTab] = useState('plaza');

  // 当前演示数据为孩子已有社团记录；后续接入真实数据后由记录状态决定
  const childState = 'joined';

  // 社团报告：AI 智读手动触发状态 ('idle' | 'loading' | 'done')
  const [reportAiStatus, setReportAiStatus] = useState('idle');

  // 孩子的社团申报列表（支持修改重新提交、撤回、新建）
  const [proposalRecords, setProposalRecords] = useState(INITIAL_PROPOSAL_RECORDS);
  const [editingProposal, setEditingProposal] = useState(null); // 当前正在编辑的申请

  // 孩子的社团草稿箱数据（初始 1 条草稿，对齐学生桌面端截图 1 中的“我的草稿 (1)”）
  const [draftRecords, setDraftRecords] = useState([
    {
      id: 'draft-1',
      name: '深空天文观测社',
      category: '科技',
      capacity: 25,
      updatedAt: '2026-09-18 10:20',
      short: '利用课余时间开展夜间星空观测与天文摄影研讨。',
      recruitment: '对天文学基础与望远镜操作感兴趣的同学。',
      venue: '实验楼天台',
      venueDesc: '需要开阔无光污染天台，配备安全围栏与电源',
      plan: '每周四晚常规观测，每月组织一次深空天体摄影展。',
      phone: '138 0000 9218'
    }
  ]);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [viewingDetailRecord, setViewingDetailRecord] = useState(null);

  // 【我报名的社团】报名申请列表状态（支持学期切换、待审核取消报名、未通过重新报名）
  const [enrollApplications, setEnrollApplications] = useState(INITIAL_ENROLL_APPLICATIONS);
  const [selectedEnrollTerm, setSelectedEnrollTerm] = useState('2026-2027 学年上学期');
  const [viewingClubDetail, setViewingClubDetail] = useState(null);
  const [detailTab, setDetailTab] = useState('info'); // 'info' (社团详情) | 'showcase' (社团风采，对齐图1)
  const [showcaseSubTab, setShowcaseSubTab] = useState('works'); // 'works' (作品集锦) | 'honors' (荣誉时刻)
  const [viewingClubMoments, setViewingClubMoments] = useState(null); // 当前查看全部活动瞬间的社团
  const [selectedMomentActivity, setSelectedMomentActivity] = useState('all'); // 全部活动瞬间当前选中的活动筛选
  const [previewShowcaseItem, setPreviewShowcaseItem] = useState(null); // 预览作品/荣誉大图
  const [previewMomentItem, setPreviewMomentItem] = useState(null); // 预览活动瞬间大图
  const [navHistory, setNavHistory] = useState('main'); // 返回上一页的来源 ('main' | 'myApplications')
  const [isPendingExpanded, setIsPendingExpanded] = useState(false); // 待审核是否展开
  const [viewingRejectedItem, setViewingRejectedItem] = useState(null); // 弹窗查看未通过详情
  const [applyReason, setApplyReason] = useState('');
  const [reapplyingItem, setReapplyingItem] = useState(null); // 当前正在重新报名的申请

  // 当前所选学期过滤后的报名记录
  const visibleEnrollApplications = enrollApplications.filter(
    app => (app.term || '2026-2027 学年上学期') === selectedEnrollTerm
  );

  // 取消报名（针对待审核状态）
  const handleCancelEnroll = (record) => {
    if (confirm(`确定要取消社团【${record.clubName}】的报名申请吗？\n取消后将释放招募名额，可重新选报其他社团。`)) {
      setEnrollApplications(prev => prev.filter(item => item.id !== record.id));
      alert(`已成功取消【${record.clubName}】的报名申请！`);
    }
  };

  // 重新报名（针对未通过状态）
  const handleReapply = (record) => {
    const targetClub = PLAZA_CLUBS.find(c => c.name === record.clubName || record.clubName.includes(c.name)) || {
      name: record.clubName,
      category: record.category,
      captain: record.captain,
      cover: record.cover,
      short: '社团招募选拔',
      recruitment: '欢迎感兴趣的同学加入。'
    };
    setReapplyingItem(record);
    setCurrentClubForApply(targetClub);
    setApplyReason('');
    setModalType('applyModal');
  };

  // 确认提交报名申请（代孩子报名或重新报名）
  const handleConfirmApply = () => {
    if (!currentClubForApply) return;
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const nowTime = `2026-${month}-${day} ${hours}:${minutes}`;

    if (reapplyingItem) {
      // 重新报名更新该记录为“待审核”
      setEnrollApplications(prev => prev.map(item => {
        if (item.id === reapplyingItem.id) {
          return {
            ...item,
            status: 'pending',
            statusText: '待审核',
            submittedAt: `${nowTime} (重新报名)`,
            note: applyReason.trim() ? `补充说明：${applyReason.trim()}` : '已重新提交入团申请，等待学生社长审核录用。',
            feedback: null
          };
        }
        return item;
      }));
      setReapplyingItem(null);
      alert(`已为孩子重新提交【${currentClubForApply.name}】的入团报名申请！`);
    } else {
      // 全新代报名
      const newEnroll = {
        id: `enroll-${Date.now()}`,
        clubId: currentClubForApply.id || `club-${Date.now()}`,
        clubName: currentClubForApply.name,
        category: currentClubForApply.category,
        cover: currentClubForApply.cover || './assets/poster-reading.jpg',
        captain: currentClubForApply.captain,
        contact: currentClubForApply.contact || '',
        status: 'pending',
        statusText: '待审核',
        submittedAt: nowTime,
        note: applyReason.trim() ? `申请说明：${applyReason.trim()}` : '已协助孩子提交入团意向，等待学生社长审核录用。'
      };
      setEnrollApplications(prev => [newEnroll, ...prev]);
      alert(`已成功提交【${currentClubForApply.name}】的入团报名申请！\n可在【我报名的】中跟进审核状态。`);
    }

    setModalType(null);
    setApplyReason('');
    setCurrentView('myApplications');
  };

  // 表单状态
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('人文');
  const [formCapacity, setFormCapacity] = useState('30');
  const [formPhone, setFormPhone] = useState('138 0000 9218');
  const [formShort, setFormShort] = useState('');
  const [formRecruitment, setFormRecruitment] = useState('');
  const [formVenue, setFormVenue] = useState('图书馆 302');
  const [formVenueDesc, setFormVenueDesc] = useState('');
  const [formPlan, setFormPlan] = useState('');

  // 倒计时动态跳秒仿真
  const [secondsTick, setSecondsTick] = useState(36);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsTick((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 分类筛选
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // 搜索关键字
  const [searchKey, setSearchKey] = useState('');

  // 弹窗控制：'applyModal' | 'recordsModal' | 'posterModal' | null
  const [modalType, setModalType] = useState(null);
  const [currentClubForApply, setCurrentClubForApply] = useState(null);
  const [previewPosterClub, setPreviewPosterClub] = useState(null);

  // 打开申报表单（新建或修改）
  const handleOpenForm = (record = null) => {
    if (record) {
      setEditingProposal(record);
      setFormName(record.name || '');
      setFormCategory(record.category || '人文');
      setFormCapacity(String(record.capacity || '30'));
      setFormPhone(record.phone || '138 0000 9218');
      setFormShort(record.short || '');
      setFormRecruitment(record.recruitment || '');
      setFormVenue(record.venue || '图书馆 302');
      setFormVenueDesc(record.venueDesc || '');
      setFormPlan(record.plan || '每周三下午开展常规研读，期中举办全校雅集展示。');
    } else {
      setEditingProposal(null);
      setFormName('');
      setFormCategory('人文');
      setFormCapacity('30');
      setFormPhone('138 0000 9218');
      setFormShort('');
      setFormRecruitment('');
      setFormVenue('创客多媒体教室');
      setFormVenueDesc('');
      setFormPlan('');
    }
    setCurrentView('proposeForm');
  };

  // 提交申报表单（保存草稿、暂存修改或提交教师审核）
  const handleSubmitForm = (isDraft = false) => {
    // 检查是否属于已有申报记录（比如撤回后修改、未通过修改）
    const isExistingProposal = editingProposal && proposalRecords.some(p => p.id === editingProposal.id);

    if (isDraft) {
      if (isExistingProposal) {
        // 暂存修改：对齐桌面端，保留在申报列表中，更新内容，不重新提交审核
        setProposalRecords(prev => prev.map(item => {
          if (item.id === editingProposal.id) {
            return {
              ...item,
              name: formName.trim() || item.name,
              category: formCategory,
              capacity: Number(formCapacity) || 30,
              short: formShort,
              recruitment: formRecruitment,
              venue: formVenue,
              venueDesc: formVenueDesc,
              plan: formPlan,
              phone: formPhone,
              updatedAt: '刚刚 (已暂存修改)'
            };
          }
          return item;
        }));
        alert('已暂存修改内容，可随时重新提交。');
      } else {
        // 新建或草稿箱草稿：存入草稿箱
        const draftItem = {
          id: editingProposal ? editingProposal.id : `draft-${Date.now()}`,
          name: formName.trim() || '未命名社团草稿',
          category: formCategory,
          capacity: Number(formCapacity) || 30,
          short: formShort,
          recruitment: formRecruitment,
          venue: formVenue,
          venueDesc: formVenueDesc,
          plan: formPlan,
          phone: formPhone,
          updatedAt: '刚刚'
        };
        setDraftRecords(prev => [draftItem, ...prev.filter(d => d.id !== draftItem.id)]);
        alert('草稿保存成功！可在社团申报页右上角【我的草稿】中继续编辑。');
      }
      setCurrentView('proposeCenter');
      return;
    }

    if (!formName.trim()) {
      alert('请输入社团名称！');
      return;
    }

    if (editingProposal) {
      // 从草稿箱移出（如果是草稿直接提交）
      setDraftRecords(prev => prev.filter(d => d.id !== editingProposal.id));

      // 修改已有记录（已撤回重新提交、未通过重新提交等）
      setProposalRecords(prev => {
        const exists = prev.some(item => item.id === editingProposal.id);
        if (exists) {
          return prev.map(item => {
            if (item.id === editingProposal.id) {
              return {
                ...item,
                name: formName,
                category: formCategory,
                capacity: Number(formCapacity) || 30,
                short: formShort,
                recruitment: formRecruitment,
                venue: formVenue,
                venueDesc: formVenueDesc,
                plan: formPlan,
                phone: formPhone,
                status: 'pending',
                statusText: '待审核',
                submittedAt: '刚刚 (已修改重提)',
                withdrawnAt: null,
                teacherFeedback: null
              };
            }
            return item;
          });
        } else {
          // 原本是草稿，直接转入已提交申报列表
          const newSubmitted = {
            id: editingProposal.id,
            name: formName,
            category: formCategory,
            captain: '赵子易',
            capacity: Number(formCapacity) || 30,
            status: 'pending',
            statusText: '待审核',
            submittedAt: '刚刚',
            cover: './assets/poster-football.jpg',
            venue: formVenue,
            venueDesc: formVenueDesc,
            short: formShort,
            recruitment: formRecruitment,
            phone: formPhone
          };
          return [newSubmitted, ...prev];
        }
      });
      alert('申报已重新提交，等待学校教师审核！');
    } else {
      // 新建记录
      const newRec = {
        id: `prop-${Date.now()}`,
        name: formName,
        category: formCategory,
        captain: '赵子易',
        capacity: Number(formCapacity) || 30,
        status: 'pending',
        statusText: '待审核',
        submittedAt: '刚刚',
        cover: './assets/poster-football.jpg',
        venue: formVenue,
        venueDesc: formVenueDesc,
        short: formShort,
        recruitment: formRecruitment,
        phone: formPhone
      };
      setProposalRecords(prev => [newRec, ...prev]);
      alert('社团申报已提交，等待学校教师审核！');
    }
    setCurrentView('proposeCenter');
  };

  // 撤回申报（完全对齐桌面端：留在当前页面，状态变更为已撤回）
  const handleWithdraw = (record) => {
    if (confirm(`确定要撤回社团【${record.name}】的申报吗？\n撤回后申报将保留在当前列表，状态变更为已撤回，可修改后重新提交；若不再需要也可直接删除。`)) {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const nowTime = `2026-${month}-${day} ${hours}:${minutes}`;

      setProposalRecords(prev => prev.map(item => {
        if (item.id === record.id) {
          return {
            ...item,
            status: 'withdrawn',
            statusText: '已撤回',
            withdrawnAt: nowTime
          };
        }
        return item;
      }));
    }
  };

  // 删除已撤回的申报记录（完全对齐桌面端）
  const handleDeleteProposal = (record) => {
    if (confirm(`确定要删除社团【${record.name}】的申报记录吗？删除后不可恢复。`)) {
      setProposalRecords(prev => prev.filter(item => item.id !== record.id));
    }
  };

  // 过滤后的社团名录
  const filteredClubs = PLAZA_CLUBS.filter(club => {
    const matchCat = selectedCategory === '全部' || club.category === selectedCategory;
    const matchKey = club.name.includes(searchKey) || club.short.includes(searchKey) || club.recruitment.includes(searchKey);
    return matchCat && matchKey;
  });

  return (
    <div className="device-wrapper">
      {/* 手机容器 */}
      <div className="phone-container">
        {/* 系统状态栏 */}
        <div className="status-bar">
          <span>09:41</span>
          <div className="status-bar-icons">
            <span style={{ fontSize: '10px' }}>5G</span>
            <span>●●●</span>
          </div>
        </div>

        {/* 微信小程序自定义导航栏（避让微信右上角胶囊） */}
        <div className="wechat-nav-bar">
          <div
            className="wechat-nav-left"
            onClick={() => {
              if (currentView === 'proposeForm') {
                setCurrentView('proposeCenter');
              } else if (currentView === 'clubDetail' || currentView === 'clubMoments') {
                setCurrentView(navHistory || 'main');
              } else if (currentView === 'proposeCenter' || currentView === 'myApplications') {
                setCurrentView('main');
              } else {
                alert('返回学校移动端');
              }
            }}
          >
            <CaretLeft size={18} weight="bold" />
            <span>返回</span>
          </div>

          <div className="wechat-nav-title">
            {currentView === 'proposeCenter'
              ? '社团申报'
              : currentView === 'myApplications'
              ? '我报名的社团'
              : currentView === 'clubDetail'
              ? (viewingClubDetail ? viewingClubDetail.name : '社团详情')
              : currentView === 'clubMoments'
              ? (viewingClubMoments ? `${viewingClubMoments.name} · 全部活动瞬间` : '全部活动瞬间')
              : currentView === 'proposeForm'
              ? (editingProposal ? '修改社团申报' : '代孩子申报新社团')
              : (activeTab === 'plaza' ? '社团广场' : '社团报告')}
          </div>

          {/* 微信原生胶囊避让区 */}
          <div className="wechat-capsule-placeholder">
            <span className="capsule-dot">···</span>
            <span className="capsule-divider"></span>
            <span className="capsule-circle"></span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 视图 1：主页双 Tab（社团广场 / 社团报告）                   */}
        {/* ========================================================= */}
        {currentView === 'main' && (
          <>
            {/* Tab 1：【社团广场】（公域：全校社团名录、选报、建团代办） */}
            {activeTab === 'plaza' && (
              <div className="tab-content">
                
                {/* 1. 搜索框通栏 */}
                <div className="search-full-width">
                  <div className="plaza-search-box">
                    <MagnifyingGlass size={16} color="#64748b" />
                    <input
                      className="plaza-search-input"
                      placeholder="搜索感兴趣的社团名称或关键词"
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. 双服务对仗合一卡片：【社团申报】 + 【我报名的】 */}
                <div className="service-twin-card">
                  {/* 左：社团申报（点击进入对齐桌面端的社团申报专区页） */}
                  <div
                    className="service-twin-half"
                    onClick={() => setCurrentView('proposeCenter')}
                  >
                    <div className="service-icon-wrap blue">
                      <Flag size={15} weight="fill" />
                    </div>
                    <div className="service-text-group">
                      <span className="service-title">社团申报</span>
                      <span className="service-subtitle">发起创团与进度</span>
                    </div>
                  </div>

                  {/* 右：我报名的 */}
                  <div
                    className="service-twin-half"
                    onClick={() => setCurrentView('myApplications')}
                  >
                    <div className="service-icon-wrap amber">
                      <ClipboardText size={15} weight="fill" />
                    </div>
                    <div className="service-text-group">
                      <span className="service-title">我报名的</span>
                      <span className="service-subtitle">已选社团与录用</span>
                    </div>
                    {enrollApplications.filter(a => a.status === 'pending').length > 0 && (
                      <span className="service-badge">
                        {enrollApplications.filter(a => a.status === 'pending').length}
                      </span>
                    )}
                  </div>
                </div>

            {/* 3. 精致浅色微胶囊筛选栏（12px字号、高质感淡蓝选中） */}
            <div className="category-pill-bar">
              {['全部', '体育', '科技', '艺术', '人文'].map((cat) => (
                <div
                  key={cat}
                  className={`modern-pill-item ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>

            {/* 4. 全校招新社团卡片列表（参考综合实践活动规范：左图右文 + 底行微翻牌倒计时） */}
            <div className="club-card-list">
              {filteredClubs.map((club) => {
                const seats = club.capacity - club.members;
                const dynamicSecs = club.timeParts ? String(secondsTick).padStart(2, '0') : '00';
                return (
                  <div
                    key={club.id}
                    className="plaza-club-card"
                    onClick={() => {
                      setViewingClubDetail(club);
                      setDetailTab('info');
                      setNavHistory('main');
                      setCurrentView('clubDetail');
                    }}
                  >
                    {/* 顶行：社团名称 + 类别徽章 */}
                    <div className="plaza-card-top">
                      <div className="plaza-card-title-group">
                        <span className="plaza-club-name">{club.name}</span>
                        <span className="tag-badge tag-category">{club.category}</span>
                      </div>
                    </div>

                    {/* 中间主体：左侧精美封面海报 + 右侧4项属性（简介、要求、社长、名额，等高完美对齐） */}
                    <div className="plaza-card-middle-body">
                      {club.cover && (
                        <div className="plaza-card-cover-wrap">
                          <img src={club.cover} alt={club.name} className="plaza-card-cover-img" />
                        </div>
                      )}

                      <div className="plaza-info-lines">
                        <p className="info-line">
                          <span className="info-label">社团简介：</span>
                          <span className="info-text">{club.short}</span>
                        </p>
                        <p className="info-line">
                          <span className="info-label">招募要求：</span>
                          <span className="info-text">{club.recruitment}</span>
                        </p>
                        <p className="info-line">
                          <span className="info-label">学生社长：</span>
                          <span className="info-text">{club.captain}</span>
                          {club.contact && (
                            <span className="leader-phone-pill">
                              <Phone size={10} weight="bold" />
                              <span>{club.contact}</span>
                            </span>
                          )}
                        </p>
                        <p className="info-line">
                          <span className="info-label">成员名额：</span>
                          <span className="info-text">{club.members} / {club.capacity} 人</span>
                          {seats > 0 ? (
                            <span className="quota-pill normal">剩余 {seats} 人</span>
                          ) : (
                            <span className="quota-pill full">名额已满</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* 底部同行：左侧参考综合实践的暖橙微翻牌倒计时 + 右侧 [代孩子报名] 主按钮 */}
                    <div className="plaza-card-bottom-row">
                      <div className="bottom-countdown-group">
                        {club.applyEnded ? (
                          <span className="countdown-ended-text">报名截止：{club.applyEnd}</span>
                        ) : (
                          <div className="flip-countdown-wrap">
                            <span className="flip-label">距报名截止</span>
                            <span className="flip-box">{club.timeParts?.days || '0'}</span>
                            <span className="flip-unit">天</span>
                            <span className="flip-box">{club.timeParts?.hours || '00'}</span>
                            <span className="flip-colon">:</span>
                            <span className="flip-box">{club.timeParts?.mins || '00'}</span>
                            <span className="flip-colon">:</span>
                            <span className="flip-box">{dynamicSecs}</span>
                          </div>
                        )}
                      </div>

                      <button
                        className="apply-action-btn"
                        disabled={!club.isOpen || club.applyEnded || seats <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentClubForApply(club);
                          setModalType('applyModal');
                        }}
                      >
                        {club.applyEnded ? '已截止' : (club.isOpen && seats > 0 ? '代孩子报名' : '名额已满')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Tab 2：【社团报告】（私域：孩子成长纪实、客观事实、学分）   */}
        {/* ========================================================= */}
        {activeTab === 'report' && (
          <div className="tab-content report-tab-content">
            {childState === 'joined' ? (
              <>
                {/* 1. 顶部学期身份与成长图鉴卡 (Hero Card - 对齐学生桌面端) */}
                <div className="report-hero-card">
                  <div className="report-hero-bg-orb" aria-hidden="true" />
                  <div className="report-hero-head">
                    <div className="report-hero-meta">
                      <span className="report-term-badge">2026—2027 学年 · 上学期</span>
                      <h2 className="report-hero-title">孩子的社团学期<em>图鉴</em></h2>
                      <span className="report-student-sub">赵子易 · 初二 (3) 班 · 数据截至 2026 年 10 月 26 日</span>
                    </div>
                    {/* 学分徽章 */}
                    <div className="report-credit-ring">
                      <span className="ring-cap">已获得学分</span>
                      <strong className="ring-val">1.5<em>分</em></strong>
                      <span className="ring-hours">累计 16.0 学时</span>
                    </div>
                  </div>

                  {/* 成长特质画像标签 (Persona Chips - 100% 对齐学生桌面端) */}
                  <div className="report-persona-chips">
                    <span className="persona-chip blue">
                      <Medal size={12} weight="fill" /> 高频到场
                    </span>
                    <span className="persona-chip violet">
                      <ChatCircleDots size={12} weight="fill" /> 讨论活跃
                    </span>
                    <span className="persona-chip amber">
                      <Star size={12} weight="fill" /> 金句制造者
                    </span>
                    <span className="persona-chip green">
                      <PuzzlePiece size={12} weight="fill" /> 多社团玩家
                    </span>
                  </div>
                </div>

                {/* 2. AI 智读 · 30秒读懂这学期 (手动触发) */}
                {reportAiStatus === 'idle' && (
                  <div className="report-ai-card idle">
                    <div className="report-ai-idle-row">
                      <div className="report-ai-title">
                        <span className="ai-icon-orb"><Sparkle size={13} weight="fill" /></span>
                        <strong>AI 智读 · 30秒读懂这学期</strong>
                      </div>
                      <button
                        type="button"
                        className="ai-trigger-btn"
                        onClick={() => {
                          setReportAiStatus('loading');
                          setTimeout(() => setReportAiStatus('done'), 800);
                        }}
                      >
                        <Sparkle size={12} weight="fill" />
                        <span>生成解读</span>
                      </button>
                    </div>
                    <p className="report-ai-idle-desc">
                      基于本学期 2 个社团、8 场出勤与 1 条精选发言客观事实生成
                    </p>
                  </div>
                )}

                {reportAiStatus === 'loading' && (
                  <div className="report-ai-card loading">
                    <div className="ai-loading-header">
                      <span className="ai-icon-orb rotating"><Sparkle size={13} weight="fill" /></span>
                      <strong className="ai-loading-title">正在生成学期成长解读...</strong>
                    </div>
                    <div className="ai-skeleton-box">
                      <div className="ai-skeleton-line w-90" />
                      <div className="ai-skeleton-line w-75" />
                    </div>
                  </div>
                )}

                {reportAiStatus === 'done' && (
                  <div className="report-ai-card done">
                    <div className="report-ai-header">
                      <div className="report-ai-title">
                        <span className="ai-icon-orb"><Sparkle size={13} weight="fill" /></span>
                        <strong>AI 智读 · 30秒读懂这学期</strong>
                      </div>
                      <div className="ai-header-actions">
                        <button
                          type="button"
                          className="ai-action-btn regen"
                          onClick={() => {
                            setReportAiStatus('loading');
                            setTimeout(() => setReportAiStatus('done'), 600);
                          }}
                        >
                          <ArrowClockwise size={11} weight="bold" />
                          <span>重新生成</span>
                        </button>
                        <button
                          type="button"
                          className="ai-action-btn close"
                          onClick={() => setReportAiStatus('idle')}
                        >
                          <span>收起</span>
                        </button>
                      </div>
                    </div>
                    <p className="report-ai-summary">
                      这学期孩子在 2 个社团里到场 8 次，出勤率 100%，稳稳的常驻选手。作为机器人社社长举办 5 场活动，在模联社讨论中贡献精选发言。
                    </p>
                    <div className="report-ai-details">
                      <div className="ai-detail-item">
                        <span className="ai-detail-dot amber" />
                        <div>
                          <strong>高光时刻</strong>
                          <p>「联合国安理会议题模拟辩论」发言被社长设为精选，可以直接当学分证据。</p>
                        </div>
                      </div>
                      <div className="ai-detail-item">
                        <span className="ai-detail-dot blue" />
                        <div>
                          <strong>需要关注</strong>
                          <p>满勤 20 学时已达成 16.0 学时（80%），各个社团的出勤都保持在 90% 以上，状态很稳。</p>
                        </div>
                      </div>
                      <div className="ai-detail-item">
                        <span className="ai-detail-dot green" />
                        <div>
                          <strong>下学期小目标</strong>
                          <p>守住 90% 以上出勤率，再冲 2 条精选发言与特色实践成果。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 01 总览（指标与文案 100% 对齐学生桌面端） */}
                <div className="report-section-block">
                  <div className="section-head-title">
                    <div className="section-head-main">
                      <span className="section-idx-badge">01</span>
                      <span>总览</span>
                    </div>
                    <span className="section-caption">本学期社团参与的关键数字，一屏看清整体节奏。</span>
                  </div>
                  <div className="report-kpi-row">
                    <div className="report-kpi-item">
                      <span className="kpi-label">参与社团</span>
                      <strong className="kpi-num">2<small>个</small></strong>
                      <span className="kpi-sub">本学期已加入</span>
                    </div>
                    <div className="report-kpi-item">
                      <span className="kpi-label">活动出勤</span>
                      <strong className="kpi-num">8<small>场</small></strong>
                      <span className="kpi-sub">出勤率 100%</span>
                    </div>
                    <div className="report-kpi-item">
                      <span className="kpi-label">累计学时</span>
                      <strong className="kpi-num">16.0<small>h</small></strong>
                      <span className="kpi-sub">8 场 × 2 学时</span>
                    </div>
                    <div className="report-kpi-item">
                      <span className="kpi-label">折算学分</span>
                      <strong className="kpi-num highlight">1.5<small>分</small></strong>
                      <span className="kpi-sub">已认定 0.5 分</span>
                    </div>
                  </div>
                </div>

                {/* 4. 02 我管理的社团（社长管理全社看板 - 100% 对齐桌面端） */}
                <div className="report-section-block">
                  <div className="section-head-title">
                    <div className="section-head-main">
                      <span className="section-idx-badge">02</span>
                      <span>我管理的社团</span>
                    </div>
                    <span className="section-caption">AI 与智能机器人社 · 作为社长，全社的成员、活动与讨论运营情况。</span>
                  </div>
                  <div className="leader-cockpit-card">
                    <div className="leader-cockpit-kpis">
                      <div className="cockpit-kpi">
                        <span className="c-label">社团成员</span>
                        <strong className="c-val">24<small>/30人</small></strong>
                        <span className="c-note">入社率 80%</span>
                      </div>
                      <div className="cockpit-kpi">
                        <span className="c-label">本学期活动</span>
                        <strong className="c-val">5<small>场</small></strong>
                        <span className="c-note">已开展 5 场</span>
                      </div>
                      <div className="cockpit-kpi">
                        <span className="c-label">全社出勤率</span>
                        <strong className="c-val">86%</strong>
                        <span className="c-note">5 场活动统计</span>
                      </div>
                      <div className="cockpit-kpi">
                        <span className="c-label">发起话题</span>
                        <strong className="c-val">2<small>个</small></strong>
                        <span className="c-note">覆盖 2 场活动</span>
                      </div>
                      <div className="cockpit-kpi">
                        <span className="c-label">成员发言</span>
                        <strong className="c-val">14<small>条</small></strong>
                        <span className="c-note">参与率 75%</span>
                      </div>
                      <div className="cockpit-kpi">
                        <span className="c-label">社长运营学时</span>
                        <strong className="c-val">10.0<small>h</small></strong>
                        <span className="c-note">个人运营口径</span>
                      </div>
                    </div>
                    <div className="leader-todo-box">
                      <div className="leader-todo-info">
                        <CheckCircle size={14} color="#16a34a" weight="fill" style={{ flexShrink: 0 }} />
                        <span className="leader-todo-text">社长待办：全部场次考勤点名已完成</span>
                      </div>
                      <span className="leader-todo-tag">全部完成</span>
                    </div>
                  </div>
                </div>

                {/* 5. 03 社团活动参与（仅作为团员参与的社团，社长社团不重复写出勤） */}
                <div className="report-section-block">
                  <div className="section-head-title">
                    <div className="section-head-main">
                      <span className="section-idx-badge">03</span>
                      <span>社团活动参与</span>
                    </div>
                    <span className="section-caption">按社团查看每场活动的考勤结果与出勤率。</span>
                  </div>

                  {/* 参与社团：模拟联合国社（团员角色） */}
                  <div className="report-club-card">
                    <div className="report-club-header">
                      <div>
                        <div className="club-name-row">
                          <strong className="report-club-name">模拟联合国社</strong>
                          <span className="role-badge member">团员</span>
                        </div>
                        <span className="club-meta-sub">人文社科 · 32 名成员 · 每周五下午 阶梯教室A</span>
                      </div>
                      <div className="club-rate-pill">出勤率 100%</div>
                    </div>

                    {/* 出勤占比色条 */}
                    <div className="club-progress-strip">
                      <div className="strip-bar present" style={{ width: '67%' }} />
                      <div className="strip-bar late" style={{ width: '33%' }} />
                    </div>
                    <div className="strip-legend">
                      <span>出勤 <em>2</em> · 迟到 <em>1</em> · 缺勤 <em>0</em> · 请假 <em>0</em></span>
                      <span>累计 <em>6.0</em> 学时</span>
                    </div>

                    {/* 逐场考勤足迹明细 */}
                    <div className="attendance-timeline">
                      <div className="timeline-event-item">
                        <div className="event-info">
                          <div className="event-title">第3次：联合国安理会议题模拟辩论</div>
                          <span className="event-meta">10月18日 16:00 · 2.0 学时</span>
                        </div>
                        <span className="attend-tag present">正常到场</span>
                      </div>
                      <div className="timeline-event-item">
                        <div className="event-info">
                          <div className="event-title">第2次：立场文件撰写与外交磋商实务</div>
                          <span className="event-meta">10月11日 16:00 · 2.0 学时</span>
                        </div>
                        <span className="attend-tag late">迟到10分钟</span>
                      </div>
                      <div className="timeline-event-item">
                        <div className="event-info">
                          <div className="event-title">第1次：新学期全团迎新例会</div>
                          <span className="event-meta">9月27日 16:00 · 2.0 学时</span>
                        </div>
                        <span className="attend-tag present">正常到场</span>
                      </div>
                    </div>
                  </div>
                  <p className="report-footnote">待确认的场次会在社长完成点名后更新；请假不计入出勤，迟到按已到场统计并计入出勤率。</p>
                </div>

                {/* 6. 04 讨论贡献 · 精选发言（去除未确认的成果归档，100% 对齐桌面端） */}
                <div className="report-section-block">
                  <div className="section-head-title">
                    <div className="section-head-main">
                      <span className="section-idx-badge">04</span>
                      <span>讨论贡献</span>
                    </div>
                    <span className="section-caption">你在哪些活动讨论里发了言、说了什么，以及被社长精选的发言。</span>
                  </div>
                  <div className="report-quote-card">
                    <span className="quote-mark" aria-hidden="true">“</span>
                    <blockquote className="quote-content">
                      在模拟安理会磋商中，多边谈判的关键是寻找各方核心利益的最小交集，而非单向说服。
                    </blockquote>
                    <div className="quote-caption">
                      <span>模拟联合国社 · 联合国安理会议题模拟辩论</span>
                      <span className="quote-badge">
                        <Star size={11} weight="fill" /> 社长精选
                      </span>
                    </div>
                  </div>
                  <p className="report-footnote">本学期有 1 条精选发言可作为学分申请的证据。</p>
                </div>

                {/* 7. 05 学时与学分（社团学时证书 - 100% 对齐桌面端） */}
                <div className="report-section-block">
                  <div className="section-head-title">
                    <div className="section-head-main">
                      <span className="section-idx-badge">05</span>
                      <span>学时与学分</span>
                    </div>
                    <span className="section-caption">每场出勤折算成学时，学时再按规则折算成学分。</span>
                  </div>
                  <div className="cert-card">
                    <div className="cert-watermark" aria-hidden="true">
                      <span>学时</span>
                      <strong>专用章</strong>
                    </div>
                    <div className="cert-top-row">
                      <span className="cert-eyebrow">2026—2027 学年 · 上学期</span>
                      <span className="cert-term">北京市中小学校学生社团</span>
                    </div>
                    <div className="cert-name-row">
                      <strong>社团学时证书</strong>
                      <span>赵子易</span>
                    </div>
                    <p className="cert-summary-p">
                      作为 <strong>AI 与智能机器人社</strong> 社长，管理 <strong>24</strong> 名成员、组织 <strong>5</strong> 场活动，累计 <strong>10.0</strong> 学时，折算 <strong>1.0</strong> 学分，其中 <strong>4.0</strong> 学时已认定。
                    </p>
                    <p className="cert-summary-p">
                      本学期参与 <strong>1</strong> 个社团，完成 <strong>3</strong> 场活动出勤，累计 <strong>6.0</strong> 学时，折算 <strong>0.5</strong> 学分；其中 <strong>6.0</strong> 学时已认定。
                    </p>
                    {/* 进度条 */}
                    <div className="cert-progress-box">
                      <div className="cert-progress-bar">
                        <div className="cert-progress-fill" style={{ width: '80%' }} />
                      </div>
                      <div className="cert-progress-text">
                        <span>满勤上限 20.0 学时</span>
                        <strong>已完成 80% (16.0h)</strong>
                      </div>
                    </div>
                    <div className="cert-audit-status">
                      <div className="audit-item">
                        <span className="dot approved" />
                        <span><strong>10.0 学时已认定</strong>（折算 1.0 学分）</span>
                      </div>
                      <div className="audit-item">
                        <span className="dot pending" />
                        <span><strong>6.0 学时审核流转中</strong>（折算 0.5 学分）</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. 学期结语与落款封印 (100% 对齐桌面端) */}
                <div className="report-closing-card">
                  <div className="closing-seal" aria-hidden="true">
                    <span>2026</span>
                    <strong>秋</strong>
                    <em>社团报告</em>
                  </div>
                  <div className="closing-text">
                    <h4>这一学期，孩子在社团里留下了扎实的成长足迹。</h4>
                    <p>
                      从第一场活动的签到，到发言被社长设为精选，这些记录都留在了这份报告里。作为 AI 与智能机器人社的社长，还成功举办了 5 场活动。下学期第一场活动，等你回来。
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* 新生/未入团空态引导 */
              <div className="empty-guide-card">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Compass size={28} weight="duotone" />
                </div>
                <div className="empty-guide-title">暂无本学期社团记录</div>
                <div className="empty-guide-desc">
                  当前孩子尚未加入或创办社团。新学期社团招新已开放，可前往【社团广场】浏览并协助代报名。
                </div>
                <button
                  className="empty-jump-btn"
                  onClick={() => setActiveTab('plaza')}
                >
                  前往社团广场选报社团
                </button>
              </div>
            )}
          </div>
        )}

        {/* 底部双 Tab 导航栏：仅在主页时展示 */}
        <div className="bottom-tab-bar">
          <button
            className={`tab-btn ${activeTab === 'plaza' ? 'active' : ''}`}
            onClick={() => setActiveTab('plaza')}
          >
            <Compass size={22} weight={activeTab === 'plaza' ? 'fill' : 'regular'} />
            <span className="tab-btn-text">社团广场</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <ChartLineUp size={22} weight={activeTab === 'report' ? 'fill' : 'regular'} />
            <span className="tab-btn-text">社团报告</span>
          </button>
        </div>
      </>
    )}

    {/* ========================================================= */}
    {/* 视图 2：【社团申报专区】（完全对齐学生桌面端截图 1）         */}
    {/* ========================================================= */}
    {currentView === 'proposeCenter' && (
      <div className="propose-page-wrapper">
        <div className="propose-scroll-content">
          {/* 1. 顶部规则提示条（对齐桌面端提示：开放时间与每人限额） */}
          <div className="propose-rule-banner">
            <div className="rule-banner-left">
              <span className="rule-icon">📖</span>
              <span className="rule-text">本学期申报开放中：9月1日 — 9月20日，每人最多创建 1 个社团</span>
            </div>
            <span
              className="rule-link"
              onClick={() => alert('申报说明：\n1. 凡本校正式学籍学生均可申报自主社团；\n2. 需指定1名学生社长与至少1名指导教师；\n3. 申报需包含完整的学期活动规划与场地需求；\n4. 经学校教务部门审核通过后正式成立并进入广场招新。')}
            >
              申报说明 &gt;
            </span>
          </div>

          {/* 2. 学期统计与草稿箱入口（对齐桌面端截图 1 右上角“我的草稿”） */}
          <div className="propose-stat-row">
            <div className="stat-term-group">
              <span className="stat-term">2026-2027 学年上学期</span>
              <span className="stat-count">共 {proposalRecords.length} 条申报</span>
            </div>
            <button
              className="drafts-entry-pill"
              onClick={() => setIsDraftsModalOpen(true)}
            >
              <span>我的草稿</span>
              <span className="drafts-count-badge">({draftRecords.length})</span>
            </button>
          </div>

          {/* 3. 申报记录卡片列表（完全承接桌面端：待审核、已通过、未通过及教师意见） */}
          <div className="proposal-card-list">
            {proposalRecords.map(record => (
              <div key={record.id} className="proposal-record-card">
                {/* 卡片头部与主体：左图右文 */}
                <div className="proposal-card-body">
                  <div className="proposal-card-cover-wrap">
                    <img src={record.cover} alt={record.name} className="proposal-card-cover-img" />
                    <span className="proposal-card-category">{record.category}</span>
                  </div>

                  <div className="proposal-card-info">
                    <div className="proposal-card-title-row">
                      <span className="proposal-club-name">{record.name}</span>
                      <span className={`proposal-status-badge ${record.status}`}>
                        {record.statusText}
                      </span>
                    </div>

                    <div className="proposal-meta-line">
                      <span>申报社长：{record.captain}</span>
                      <span>计划人数：{record.capacity} 人</span>
                    </div>
                    <div className="proposal-meta-line muted">
                      <span>提交时间：{record.submittedAt}</span>
                    </div>
                    <div className="proposal-venue-line">
                      <span className="venue-label-text">
                        {record.venueDesc && !record.venue ? '场地需求：' : '拟用场地：'}
                      </span>
                      <span className="venue-val-wrap">
                        {record.venueDesc && !record.venue ? (
                          <>
                            <span className="venue-note-badge">需求说明</span>
                            <span className="venue-text">{record.venueDesc}</span>
                          </>
                        ) : (
                          <>
                            <span className="venue-text">{record.venue || '学校统筹安排'}</span>
                            {record.venueDesc && (
                              <span className="venue-sub-note"> · 场地说明：{record.venueDesc}</span>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 核心：已撤回记录展示撤回提示框（完全对齐学生桌面端截图） */}
                {record.status === 'withdrawn' && (
                  <div className="withdrawn-feedback-box">
                    <div className="feedback-header">
                      <strong>社团申报已撤回</strong>
                      {record.withdrawnAt && <span className="feedback-time">({record.withdrawnAt})</span>}
                    </div>
                    <p className="feedback-content">申报已撤回，可修改后重新提交；若不再需要可直接删除。</p>
                  </div>
                )}

                {/* 核心：未通过记录高亮展示教师审核意见（对齐学生桌面端截图 1） */}
                {record.status === 'rejected' && record.teacherFeedback && (
                  <div className="teacher-feedback-box">
                    <div className="feedback-header">
                      <strong>教师审核意见</strong>
                      <span className="feedback-meta">
                        审核教师：{record.teacherFeedback.teacher} · {record.teacherFeedback.time}
                      </span>
                    </div>
                    <p className="feedback-content">{record.teacherFeedback.reason}</p>
                  </div>
                )}

                {/* 卡片底栏操作（完全对齐桌面端：去掉多余文案，操作按钮纯粹右对齐） */}
                <div className="proposal-card-actions">
                  <button
                    className="prop-btn text"
                    onClick={() => setViewingDetailRecord(record)}
                  >
                    查看
                  </button>
                  {record.status === 'pending' && (
                    <button
                      className="prop-btn text"
                      onClick={() => handleWithdraw(record)}
                    >
                      撤回
                    </button>
                  )}
                  {record.status === 'withdrawn' && (
                    <>
                      <button
                        className="prop-btn text"
                        onClick={() => handleDeleteProposal(record)}
                      >
                        删除
                      </button>
                      <button
                        className="prop-btn primary"
                        onClick={() => handleOpenForm(record)}
                      >
                        修改
                      </button>
                    </>
                  )}
                  {record.status === 'approved' && (
                    <button
                      className="prop-btn primary"
                      onClick={() => alert(`进入【${record.name}】社长管理后台`)}
                    >
                      进入管理
                    </button>
                  )}
                  {record.status === 'rejected' && (
                    <button
                      className="prop-btn primary"
                      onClick={() => handleOpenForm(record)}
                    >
                      修改
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 底部固定吸底主按钮 */}
        <div className="propose-fixed-bottom-bar">
          <button
            className="propose-submit-btn"
            onClick={() => handleOpenForm(null)}
          >
            + 代孩子申报新社团
          </button>
        </div>
      </div>
    )}

    {/* ========================================================= */}
    {/* 视图 3：【申报社团录入表单】（完全对齐学生桌面端截图 2）       */}
    {/* ========================================================= */}
    {currentView === 'proposeForm' && (
      <div className="propose-page-wrapper">
        {/* 上部独立滚动内容区（保证长表单自如滚动，绝不被按钮遮挡） */}
        <div className="propose-scroll-content form-scroll-padding">
          {/* 顶部规则提示条 / 已撤回或退回反馈横幅 */}
          {editingProposal?.status === 'withdrawn' ? (
            <div className="declaration-form-feedback-alert neutral">
              <div className="alert-head">
                <strong>社团申报已撤回</strong>
                {editingProposal.withdrawnAt && <span>撤回时间：{editingProposal.withdrawnAt}</span>}
              </div>
              <p className="alert-reason">申报已撤回，可在此修改内容并重新提交审核；若稍后再填，可点击下方“暂存修改”。</p>
            </div>
          ) : editingProposal?.status === 'rejected' && editingProposal.teacherFeedback ? (
            <div className="declaration-form-feedback-alert rejected">
              <div className="alert-head">
                <strong>教师审核退回意见</strong>
                <span>审核教师：{editingProposal.teacherFeedback.teacher}</span>
              </div>
              <p className="alert-reason">{editingProposal.teacherFeedback.reason}</p>
            </div>
          ) : (
            <div className="form-tip-banner">
              <span>📖 本学期申报开放中：9月1日 — 9月20日。学校发布的说明可随时查看。</span>
            </div>
          )}

          {/* 分区 1：基本信息 */}
          <div className="form-section-card">
            <div className="form-section-title">基本信息</div>
            
            <div className="form-item">
              <label className="form-label required">社团名称</label>
              <input
                className="form-input"
                placeholder="例如：校区摄影社、古风吟诵社"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="form-item">
              <label className="form-label required">社团类别</label>
              <div className="form-category-chips">
                {['人文', '科技', '体育', '艺术'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-chip ${formCategory === cat ? 'active' : ''}`}
                    onClick={() => setFormCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-item">
                <label className="form-label required">社长</label>
                <input className="form-input readonly" value="赵子易" readOnly />
                <span className="form-sub-tip">当前申报学生，审核通过后为社长</span>
              </div>
              <div className="form-item">
                <label className="form-label required">计划人数上限</label>
                <input
                  className="form-input"
                  type="number"
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-item">
              <label className="form-label required">社团封面</label>
              <div className="form-cover-picker">
                <div className="cover-thumb active">
                  <img src="./assets/poster-football.jpg" alt="封面" />
                  <span className="cover-tag">经典体育</span>
                </div>
                <div className="cover-thumb">
                  <img src="./assets/poster-reading.jpg" alt="封面" />
                  <span className="cover-tag">人文书香</span>
                </div>
                <div className="cover-thumb">
                  <img src="./assets/poster-drama.jpg" alt="封面" />
                  <span className="cover-tag">戏剧艺术</span>
                </div>
                <div className="cover-thumb upload-btn">
                  <span>+ 上传</span>
                </div>
              </div>
            </div>

            <div className="form-item">
              <label className="form-label required">社团简介</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="用几句话介绍社团想做什么、希望一起完成什么"
                value={formShort}
                onChange={(e) => setFormShort(e.target.value)}
              />
            </div>
          </div>

          {/* 分区 2：招新与联系 */}
          <div className="form-section-card">
            <div className="form-section-title">招新与联系</div>
            
            <div className="form-item">
              <label className="form-label required">联系电话</label>
              <input
                className="form-input"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
              <span className="form-sub-tip">将向本校学生公开，用于社团咨询</span>
            </div>

            <div className="form-item">
              <label className="form-label">招募说明</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="例如：希望每周能稳定参加活动，对招募感兴趣即可"
                value={formRecruitment}
                onChange={(e) => setFormRecruitment(e.target.value)}
              />
            </div>
          </div>

          {/* 分区 3：活动场地 */}
          <div className="form-section-card">
            <div className="form-section-title">活动场地</div>
            
            <div className="form-item">
              <label className="form-label">拟用场地</label>
              <input
                className="form-input"
                placeholder="例如：图书馆 302、创客空间、西操场"
                value={formVenue}
                onChange={(e) => setFormVenue(e.target.value)}
              />
            </div>

            <div className="form-item">
              <label className="form-label">场地说明</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="例如：每周一次，约 20 人，需要带投影的多媒体教室"
                value={formVenueDesc}
                onChange={(e) => setFormVenueDesc(e.target.value)}
              />
            </div>
          </div>

          {/* 分区 4：申报材料 */}
          <div className="form-section-card">
            <div className="form-section-title">申报材料</div>
            <div className="form-item">
              <label className="form-label">活动计划</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="请说明本学期拟开展的主要活动"
                value={formPlan}
                onChange={(e) => setFormPlan(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 底部吸底固定操作栏：置于整个容器底部，永不遮挡上方内容 */}
        <div className="propose-fixed-bottom-bar form-bottom-btns">
          <button
            className="form-draft-btn"
            onClick={() => handleSubmitForm(true)}
          >
            {editingProposal && (editingProposal.status === 'withdrawn' || editingProposal.status === 'rejected')
              ? '暂存修改'
              : '保存草稿'}
          </button>
          <button
            className="form-submit-btn"
            onClick={() => handleSubmitForm(false)}
          >
            {editingProposal && (editingProposal.status === 'withdrawn' || editingProposal.status === 'rejected')
              ? '重新提交申报'
              : '提交申报'}
          </button>
        </div>
      </div>
    )}

    {/* ========================================================= */}
    {/* 弹窗：【我的草稿箱】（对齐桌面端“我的草稿”）               */}
    {/* ========================================================= */}
    {isDraftsModalOpen && (
      <div className="modal-mask" onClick={() => setIsDraftsModalOpen(false)}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-dialog-header">
            <span className="modal-dialog-title">我的草稿箱 ({draftRecords.length})</span>
            <button className="modal-dialog-close" onClick={() => setIsDraftsModalOpen(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="modal-dialog-body">
            {draftRecords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '13px' }}>
                草稿箱空空如也，暂无保存的草稿
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  草稿仅保存在本地设备，可随时继续完善并正式提交教师审核。
                </div>
                {draftRecords.map(draft => (
                  <div key={draft.id} className="draft-record-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{draft.name}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                          类别：{draft.category} · 计划人数：{draft.capacity}人
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                          保存时间：{draft.updatedAt}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                      <button
                        className="prop-btn text"
                        onClick={() => {
                          if (confirm(`确认删除草稿【${draft.name}】吗？`)) {
                            setDraftRecords(prev => prev.filter(d => d.id !== draft.id));
                          }
                        }}
                      >
                        删除
                      </button>
                      <button
                        className="prop-btn primary"
                        onClick={() => {
                          setIsDraftsModalOpen(false);
                          handleOpenForm(draft);
                        }}
                      >
                        继续编辑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* ========================================================= */}
    {/* 弹窗：【社团申报详情查看】                                  */}
    {/* ========================================================= */}
    {viewingDetailRecord && (
      <div className="modal-mask" onClick={() => setViewingDetailRecord(null)}>
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-dialog-header">
            <span className="modal-dialog-title">申报详情 · {viewingDetailRecord.name}</span>
            <button className="modal-dialog-close" onClick={() => setViewingDetailRecord(null)}>
              <X size={16} />
            </button>
          </div>
          <div className="modal-dialog-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{viewingDetailRecord.name}</span>
                <span className={`proposal-status-badge ${viewingDetailRecord.status}`}>{viewingDetailRecord.statusText}</span>
              </div>

              {viewingDetailRecord.status === 'withdrawn' && (
                <div className="withdrawn-feedback-box" style={{ margin: '0 0 2px 0' }}>
                  <div className="feedback-header">
                    <strong>社团申报已撤回</strong>
                    {viewingDetailRecord.withdrawnAt && <span className="feedback-time">({viewingDetailRecord.withdrawnAt})</span>}
                  </div>
                  <p className="feedback-content">申报已撤回，可修改后重新提交；若不再需要可直接删除。</p>
                </div>
              )}

              {viewingDetailRecord.status === 'rejected' && viewingDetailRecord.teacherFeedback && (
                <div className="teacher-feedback-box" style={{ margin: '0 0 2px 0' }}>
                  <div className="feedback-header">
                    <strong>教师审核意见</strong>
                    <span className="feedback-meta">审核教师：{viewingDetailRecord.teacherFeedback.teacher}</span>
                  </div>
                  <p className="feedback-content">{viewingDetailRecord.teacherFeedback.reason}</p>
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div><strong>社团类别：</strong>{viewingDetailRecord.category}</div>
                <div><strong>申报学生：</strong>{viewingDetailRecord.captain}</div>
                <div><strong>计划人数：</strong>{viewingDetailRecord.capacity} 人</div>
                <div><strong>提交时间：</strong>{viewingDetailRecord.submittedAt}</div>
                {viewingDetailRecord.withdrawnAt && (
                  <div><strong>撤回时间：</strong>{viewingDetailRecord.withdrawnAt}</div>
                )}
                <div>
                  <strong>{viewingDetailRecord.venueDesc && !viewingDetailRecord.venue ? '场地需求：' : '拟用场地：'}</strong>
                  {viewingDetailRecord.venueDesc && !viewingDetailRecord.venue
                    ? viewingDetailRecord.venueDesc
                    : viewingDetailRecord.venue
                    ? (viewingDetailRecord.venueDesc ? `${viewingDetailRecord.venue}（说明：${viewingDetailRecord.venueDesc}）` : viewingDetailRecord.venue)
                    : '学校统筹安排'}
                </div>
                <div><strong>社团简介：</strong>{viewingDetailRecord.short || '暂无'}</div>
                <div><strong>招募要求：</strong>{viewingDetailRecord.recruitment || '暂无'}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '10px 14px', borderTop: '1px solid #f1f5f9' }}>
            <button className="prop-btn text" onClick={() => setViewingDetailRecord(null)}>关闭</button>
            {viewingDetailRecord.status === 'pending' && (
              <button
                className="prop-btn text"
                onClick={() => {
                  const target = viewingDetailRecord;
                  setViewingDetailRecord(null);
                  handleWithdraw(target);
                }}
              >
                撤回
              </button>
            )}
            {viewingDetailRecord.status === 'withdrawn' && (
              <>
                <button
                  className="prop-btn text"
                  onClick={() => {
                    const target = viewingDetailRecord;
                    setViewingDetailRecord(null);
                    handleDeleteProposal(target);
                  }}
                >
                  删除
                </button>
                <button
                  className="prop-btn primary"
                  onClick={() => {
                    const target = viewingDetailRecord;
                    setViewingDetailRecord(null);
                    handleOpenForm(target);
                  }}
                >
                  修改
                </button>
              </>
            )}
            {viewingDetailRecord.status === 'rejected' && (
              <button
                className="prop-btn primary"
                onClick={() => {
                  const target = viewingDetailRecord;
                  setViewingDetailRecord(null);
                  handleOpenForm(target);
                }}
              >
                修改
              </button>
            )}
          </div>
        </div>
      </div>
    )}

        {/* ========================================================= */}
        {/* 视图 4：【我报名的社团】（改版：主视图聚焦已通过，待审核收起，未通过胶囊） */}
        {/* ========================================================= */}
        {currentView === 'myApplications' && (() => {
          const pendingList = visibleEnrollApplications.filter(r => r.status === 'pending');
          const passedList = visibleEnrollApplications.filter(r => r.status === 'passed');
          const rejectedList = visibleEnrollApplications.filter(r => r.status === 'rejected');

          return (
            <div className="my-app-page-wrapper">
              <div className="my-app-scroll-content">
                {/* 顶部学期切换选择器与快捷操作条 */}
                <div className="enroll-top-bar">
                  <div className="enroll-term-selector-wrap">
                    <select
                      className="enroll-term-select"
                      value={selectedEnrollTerm}
                      onChange={(e) => setSelectedEnrollTerm(e.target.value)}
                    >
                      {ENROLL_TERM_OPTIONS.map(term => (
                        <option key={term} value={term}>
                          {term} {term === '2026-2027 学年上学期' ? '(当前)' : ''}
                        </option>
                      ))}
                    </select>
                    <CaretDown size={11} weight="bold" className="enroll-select-arrow" />
                  </div>

                  <div className="enroll-top-right-group">
                    {rejectedList.length > 0 && selectedEnrollTerm === '2026-2027 学年上学期' && (
                      <button
                        type="button"
                        className="enroll-rejected-pill"
                        onClick={() => setViewingRejectedItem(rejectedList[0])}
                        title="点击查看未通过反馈"
                      >
                        <span className="dot" />
                        <span>{rejectedList.length} 条未通过 ›</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 待审核折叠条（仅在存在待审核项时展示，默认收纳占1行，整行点击可展开） */}
                {pendingList.length > 0 && (
                  <div
                    className="enroll-pending-alert-bar"
                    onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                  >
                    <div className="pending-summary-left">
                      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', flex: 1, minWidth: 0, gap: '6px' }}>
                        <span className="pending-indicator-dot" />
                        <span className="pending-text-main">
                          <strong>{pendingList.length}</strong> 个社团报名审核中（{pendingList.map(p => p.clubName).join('、')}）
                        </span>
                      </div>
                      <div className="pending-toggle-btn">
                        <span>{isPendingExpanded ? '收起' : '查看'}</span>
                        <CaretDown
                          size={11}
                          weight="bold"
                          style={{
                            transform: isPendingExpanded ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </div>
                    </div>

                    {isPendingExpanded && (
                      <div className="pending-expanded-drawer">
                        {pendingList.map(record => {
                          const plazaClub = PLAZA_CLUBS.find(c => c.name === record.clubName || record.clubName.includes(c.name)) || {
                            name: record.clubName,
                            category: record.category,
                            captain: record.captain,
                            contact: record.contact,
                            cover: record.cover,
                            short: '面向全校成员开展自主实践与活动交流。',
                            recruitment: '欢迎感兴趣的同学加入。',
                            members: 12,
                            capacity: 20
                          };
                          return (
                            <div key={record.id} className="pending-compact-item">
                              <img src={record.cover} alt="" className="pending-item-cover" />
                              <div className="pending-item-info">
                                <div className="pending-item-name-row">
                                  <span className="pending-item-name">{record.clubName}</span>
                                  <span className="pending-item-tag">{record.category}</span>
                                </div>
                                <div className="pending-item-sub">
                                  社长：{record.captain} · 提交于 {record.submittedAt?.slice(5, 16) || record.submittedAt}
                                </div>
                              </div>
                              <div className="pending-item-actions">
                                <button
                                  type="button"
                                  className="pending-item-detail-btn"
                                  onClick={() => {
                                    setViewingClubDetail(plazaClub);
                                    setDetailTab('info');
                                    setNavHistory('myApplications');
                                    setCurrentView('clubDetail');
                                  }}
                                >
                                  社团详情
                                </button>
                                <button
                                  type="button"
                                  className="pending-item-cancel-btn"
                                  onClick={() => handleCancelEnroll(record)}
                                >
                                  取消报名
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 主视图内容区域 */}
                {visibleEnrollApplications.length === 0 ? (
                  <div className="enroll-empty-card">
                    <span>该学期暂无任何社团报名记录</span>
                    {selectedEnrollTerm === '2026-2027 学年上学期' && (
                      <button
                        type="button"
                        className="enroll-go-plaza-btn"
                        onClick={() => {
                          setCurrentView('main');
                          setActiveTab('plaza');
                        }}
                      >
                        前往社团广场选报
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* 已通过的在研社团主列表（核心突出：社团风采、活动瞬间与成果） */}
                    {passedList.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="enroll-section-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>孩子已加入的社团</span>
                            <span className="count-badge">{passedList.length}</span>
                          </div>
                        </div>

                        {passedList.map((record, index) => {
                          // 第一个卡片（足球联盟）做丰富数据展示，第二个卡片（纪录片社）做无数据状态展示
                          const hasData = index === 0;
                          const clubKey = record.clubId === 'football' ? 'football' : (record.clubId === 'drama' ? 'drama' : 'football');
                          const showcase = CLUB_SHOWCASE_DATA[clubKey] || CLUB_SHOWCASE_DATA.football;
                          const momentsObj = CLUB_MOMENTS_DATA[clubKey] || CLUB_MOMENTS_DATA.football;
                          const thumb1 = momentsObj.moments[0]?.photo || './assets/moment-team-1.jpg';
                          const thumb2 = momentsObj.moments[1]?.photo || './assets/moment-team-2.jpg';
                          const thumb3 = momentsObj.moments[2]?.photo || './assets/moment-team-3.jpg';
                          const matchedPlazaClub = PLAZA_CLUBS.find(c => c.name === record.clubName || record.clubName.includes(c.name)) || {
                            id: record.clubId || 'football',
                            name: record.clubName,
                            category: record.category,
                            captain: record.captain,
                            contact: record.contact,
                            cover: record.cover,
                            short: '面向喜欢足球的同学，开展日常训练、友谊赛和校园足球活动。',
                            recruitment: '有兴趣或愿意长期参加活动的同学均可申请。',
                            members: 18,
                            capacity: 30
                          };

                          return (
                            <div key={record.id} className="enroll-joined-card">
                              {/* 头部：点击卡片头部整块直接进入社团详情 */}
                              <div
                                className="joined-card-header"
                                onClick={() => {
                                  setViewingClubDetail(matchedPlazaClub);
                                  setDetailTab('info');
                                  setNavHistory('myApplications');
                                  setCurrentView('clubDetail');
                                }}
                                title="点击查看社团详情"
                              >
                                <div className="joined-card-left-group">
                                  <div className="joined-card-thumb-wrap">
                                    <img src={record.cover} alt={record.clubName} className="joined-card-thumb-img" />
                                    <span className="joined-card-category-tag">{record.category}</span>
                                  </div>
                                  <div className="joined-card-title-meta">
                                    <div className="joined-card-title-row">
                                      <span className="joined-card-title">{record.clubName}</span>
                                      <span className="joined-card-passed-pill">已通过</span>
                                    </div>
                                    <div className="joined-card-leader-text">
                                      <span>学生社长：{record.captain}</span>
                                      {record.contact && <span style={{ color: '#64748b', marginLeft: '6px' }}>{record.contact}</span>}
                                    </div>
                                    <div className="joined-card-time-text">
                                      通过时间：{record.passedAt || record.submittedAt}
                                    </div>
                                  </div>
                                </div>

                                <div className="joined-card-arrow-wrap">
                                  <CaretRight size={14} weight="bold" />
                                </div>
                              </div>

                              {/* 社团风采与活动瞬间沉淀区 */}
                              <div className="enroll-joined-features-box" style={{ margin: 0 }}>
                                {hasData ? (
                                  <>
                                    <div className="enroll-feature-metric-row moments">
                                      <Camera size={13} weight="fill" color="#2563eb" />
                                      <span>活动瞬间：已开展 <strong>{momentsObj.summary?.covered || 6}</strong> 场活动 · 沉淀 <strong>{momentsObj.summary?.total || 14}</strong> 份精彩瞬间</span>
                                    </div>
                                    <div className="enroll-feature-metric-row showcase">
                                      <Trophy size={13} weight="fill" color="#ea580c" />
                                      <span>社团风采：作品集锦 <strong>{showcase.works?.length || 5}</strong> · 荣誉时刻 <strong>{showcase.honors?.length || 3}</strong></span>
                                    </div>
                                    {/* 3张缩略图横排，点击直达相册 */}
                                    <div
                                      className="enroll-thumbs-strip"
                                      title="点击查看全部活动瞬间"
                                      onClick={() => {
                                        setViewingClubMoments(matchedPlazaClub);
                                        setSelectedMomentActivity('all');
                                        setNavHistory('myApplications');
                                        setCurrentView('clubMoments');
                                      }}
                                    >
                                      <div className="enroll-thumb-item">
                                        <img src={thumb1} alt="" className="enroll-thumb-img" />
                                      </div>
                                      <div className="enroll-thumb-item">
                                        <img src={thumb2} alt="" className="enroll-thumb-img" />
                                      </div>
                                      <div className="enroll-thumb-item">
                                        <img src={thumb3} alt="" className="enroll-thumb-img" />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="enroll-feature-metric-row moments" style={{ color: '#64748b' }}>
                                      <Camera size={13} weight="regular" color="#94a3b8" />
                                      <span>活动瞬间：已开展 <strong>0</strong> 场活动 · 沉淀 <strong>0</strong> 份精彩瞬间</span>
                                    </div>
                                    <div className="enroll-feature-metric-row showcase" style={{ color: '#64748b' }}>
                                      <Trophy size={13} weight="regular" color="#94a3b8" />
                                      <span>社团风采：作品集锦 <strong>0</strong> · 荣誉时刻 <strong>0</strong></span>
                                    </div>
                                    {/* 空状态占位提示 */}
                                    <div className="enroll-empty-thumbs-placeholder">
                                      <Camera size={13} color="#94a3b8" />
                                      <span>暂无活动抓拍，活动开展后由成员上传精彩瞬间</span>
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* 底栏双主操作按钮：50:50 等宽排列，纯入口不带冗余数字，无数据置灰 */}
                              <div className="joined-card-actions-row">
                                <button
                                  type="button"
                                  className={`joined-action-btn ${hasData ? 'showcase' : 'disabled'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (hasData) {
                                      setViewingClubDetail(matchedPlazaClub);
                                      setDetailTab('showcase');
                                      setNavHistory('myApplications');
                                      setCurrentView('clubDetail');
                                    } else {
                                      showToast('本社团本学期暂未发布风采内容');
                                    }
                                  }}
                                >
                                  <Trophy size={13} weight={hasData ? 'fill' : 'regular'} />
                                  <span>社团风采</span>
                                </button>
                                <button
                                  type="button"
                                  className={`joined-action-btn ${hasData ? 'moments' : 'disabled'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (hasData) {
                                      setViewingClubMoments(matchedPlazaClub);
                                      setSelectedMomentActivity('all');
                                      setNavHistory('myApplications');
                                      setCurrentView('clubMoments');
                                    } else {
                                      showToast('活动尚未开展，精彩瞬间沉淀中');
                                    }
                                  }}
                                >
                                  <Camera size={13} weight={hasData ? 'fill' : 'regular'} />
                                  <span>全部活动瞬间</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 如果仅有未录用记录且在历史学期，平铺展示提示 */}
                    {passedList.length === 0 && pendingList.length === 0 && rejectedList.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {rejectedList.map(record => (
                          <div key={record.id} className="enroll-record-card">
                            <div className="enroll-card-main">
                              <div className="enroll-cover-wrap">
                                <img src={record.cover} alt={record.clubName} className="enroll-cover-img" />
                                <span className="enroll-cover-tag">{record.category}</span>
                              </div>
                              <div className="enroll-info-block">
                                <div className="enroll-title-row">
                                  <span className="enroll-club-title">{record.clubName}</span>
                                  <span className="enroll-status-badge rejected">未通过</span>
                                </div>
                                <div className="enroll-meta-lines">
                                  <div className="enroll-meta-row">
                                    <span>学生社长：</span>
                                    <span>{record.captain}</span>
                                  </div>
                                  <div className="enroll-meta-row">
                                    <span>反馈原因：</span>
                                    <span style={{ color: '#ef4444' }}>{record.feedback || '名额已满'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="enroll-card-actions">
                              <button
                                type="button"
                                className="enroll-btn primary"
                                onClick={() => handleReapply(record)}
                              >
                                <ArrowClockwise size={12} weight="bold" />
                                <span>重新报名</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* 视图 5：【社团主页与风采展厅】（完全对齐学生桌面端图1）       */}
        {/* ========================================================= */}
        {currentView === 'clubDetail' && viewingClubDetail && (() => {
          const club = viewingClubDetail;
          const clubKey = club.id === 'football' ? 'football' : (club.id === 'drama' ? 'drama' : (club.id === 'ai-robot' ? 'ai-robot' : (club.id === 'reading' ? 'reading' : 'football')));
          const showcase = CLUB_SHOWCASE_DATA[clubKey] || CLUB_SHOWCASE_DATA.football;
          const seats = (club.capacity || 30) - (club.members || 18);
          // 判断孩子是否已经是该社团成员
          const isJoined = enrollApplications.some(app => (app.clubId === club.id || club.name.includes(app.clubName)) && app.status === 'passed');

          return (
            <div className="club-detail-page-wrapper">
              <div className="club-detail-scroll-content">
                {/* 1. 顶部社团 Hero 概况卡片 */}
                <div className="detail-hero-card">
                  <div className="detail-hero-cover-wrap">
                    <img src={club.cover || './assets/poster-football.jpg'} alt={club.name} className="detail-hero-cover-img" />
                    {!club.applyEnded && (
                      <span className="detail-hero-countdown-tag">
                        <Clock size={11} weight="bold" />
                        <span>距报名截止：3天 8小时</span>
                      </span>
                    )}
                  </div>
                  <div className="detail-hero-body">
                    <div className="detail-hero-title-row">
                      <span className="detail-hero-title">{club.name}</span>
                      <span className="detail-hero-category">{club.category}类</span>
                    </div>
                    <div className="detail-meta-pill-bar">
                      <span className="detail-meta-item">
                        <User size={12} weight="bold" />
                        <span>社长：{club.captain}</span>
                        {club.contact && <small>（{club.contact}）</small>}
                      </span>
                      <span className="detail-meta-item">
                        <Users size={12} weight="bold" />
                        <span>成员：{club.members || 18} / {club.capacity || 30} 人</span>
                      </span>
                      <span className="detail-meta-item" style={{ color: seats > 0 ? '#166534' : '#991b1b', background: seats > 0 ? '#f0fdf4' : '#fef2f2' }}>
                        {seats > 0 ? `剩余名额 ${seats} 人` : '名额已满'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. 一级主 Tab 切换栏（社团详情 vs 社团风采，对齐图1） */}
                <div className="detail-nav-tabs">
                  <button
                    type="button"
                    className={`detail-nav-tab-btn ${detailTab === 'info' ? 'active' : ''}`}
                    onClick={() => setDetailTab('info')}
                  >
                    <ClipboardText size={14} weight="bold" />
                    <span>社团详情</span>
                  </button>
                  <button
                    type="button"
                    className={`detail-nav-tab-btn showcase ${detailTab === 'showcase' ? 'active' : ''}`}
                    onClick={() => setDetailTab('showcase')}
                  >
                    <Trophy size={14} weight="fill" />
                    <span>社团风采</span>
                  </button>
                </div>

                {/* 3. Tab 1 内容：社团详情 */}
                {detailTab === 'info' && (
                  <div className="detail-info-block">
                    <div>
                      <div className="detail-section-title">社团宗旨与简介</div>
                      <p className="detail-text-p" style={{ marginTop: '6px' }}>{club.short}</p>
                    </div>
                    <div>
                      <div className="detail-section-title">招募对象与入团要求</div>
                      <p className="detail-text-p" style={{ marginTop: '6px' }}>{club.recruitment}</p>
                    </div>
                    <div>
                      <div className="detail-section-title">活动安排与日常场地</div>
                      <p className="detail-text-p" style={{ marginTop: '6px' }}>
                        固定活动时间为每周三或周五下午社团课；学校安排日常场地为体育场及配套活动教室。每场活动的具体签到与考勤由学生社长发布。
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. Tab 2 内容：社团风采（对齐图1，支持作品集锦与荣誉时刻） */}
                {detailTab === 'showcase' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* 风采二级胶囊切换栏 */}
                    <div className="showcase-sub-bar">
                      <div className="showcase-sub-tabs">
                        <button
                          type="button"
                          className={`showcase-pill-btn ${showcaseSubTab === 'works' ? 'active' : ''}`}
                          onClick={() => setShowcaseSubTab('works')}
                        >
                          <Camera size={12} weight="bold" />
                          <span>作品集锦 ({showcase.works?.length || 0})</span>
                        </button>
                        <button
                          type="button"
                          className={`showcase-pill-btn ${showcaseSubTab === 'honors' ? 'active' : ''}`}
                          onClick={() => setShowcaseSubTab('honors')}
                        >
                          <Medal size={12} weight="fill" />
                          <span>荣誉时刻 ({showcase.honors?.length || 0})</span>
                        </button>
                      </div>
                      <span className="showcase-uploader-hint">作品与荣誉由社长上传</span>
                    </div>

                    {/* 作品集锦列表 (对齐图1作品卡片) */}
                    {showcaseSubTab === 'works' && (
                      <div className="showcase-works-list">
                        {(showcase.works || []).map(work => (
                          <div
                            key={work.id}
                            className="work-card-item"
                            onClick={() => setPreviewShowcaseItem({ type: 'work', ...work })}
                          >
                            <div className="work-card-cover-wrap">
                              <img src={work.cover} alt={work.title} className="work-card-cover-img" />
                            </div>
                            <div className="work-card-content">
                              <span className="work-card-title">{work.title}</span>
                              <span className="work-card-creator">创作者：{work.creator}</span>
                              <p className="work-card-desc">{work.desc}</p>
                              <div className="work-card-footer">
                                <span>{work.uploader || '学生社长上传'}</span>
                                <span>{work.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 荣誉时刻列表 (对齐图1荣誉时刻证书卡片) */}
                    {showcaseSubTab === 'honors' && (
                      <div className="showcase-honors-list">
                        {(showcase.honors || []).map(honor => (
                          <div
                            key={honor.id}
                            className="honor-card-item"
                            onClick={() => setPreviewShowcaseItem({ type: 'honor', ...honor })}
                          >
                            <div className="honor-cert-thumb-wrap">
                              <img src={honor.cover} alt={honor.title} className="honor-cert-thumb-img" />
                            </div>
                            <div className="honor-card-main">
                              <div className="honor-card-title">
                                <Trophy size={14} weight="fill" color="#ea580c" />
                                <span>{honor.title}</span>
                              </div>
                              <span className="honor-card-time">获奖时间：{honor.time}</span>
                              <p className="honor-card-desc">{honor.desc}</p>
                              <div className="honor-card-footer">
                                <span>{honor.uploader || '学生社长上传'} · {honor.date}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 底部悬浮操作 Bar */}
              <div className="detail-fixed-footer">
                {isJoined ? (
                  <button
                    type="button"
                    className="detail-footer-btn"
                    style={{ background: '#10b981' }}
                    onClick={() => {
                      setViewingClubMoments(club);
                      setSelectedMomentActivity('all');
                      setNavHistory('clubDetail');
                      setCurrentView('clubMoments');
                    }}
                  >
                    <CheckCircle size={16} weight="bold" />
                    <span>孩子已是正式团员 · 查看活动瞬间</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="detail-footer-btn"
                    disabled={!club.isOpen || club.applyEnded || seats <= 0}
                    onClick={() => {
                      setCurrentClubForApply(club);
                      setModalType('applyModal');
                    }}
                  >
                    {club.applyEnded ? '报名已截止' : (club.isOpen && seats > 0 ? '代孩子报名' : '名额已满')}
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* 视图 6：【全部活动瞬间聚合页】（完全对齐学生桌面端图2）       */}
        {/* ========================================================= */}
        {currentView === 'clubMoments' && viewingClubMoments && (() => {
          const club = viewingClubMoments;
          const clubKey = club.id === 'football' ? 'football' : (club.id === 'drama' ? 'drama' : 'football');
          const momentsData = CLUB_MOMENTS_DATA[clubKey] || CLUB_MOMENTS_DATA.football;
          const currentList = selectedMomentActivity === 'all'
            ? momentsData.moments
            : momentsData.moments.filter(m => m.actId === selectedMomentActivity);

          return (
            <div className="club-moments-page-wrapper">
              <div className="club-moments-scroll-content">
                {/* 1. 统计横幅与活动滑动筛选条 (对齐图2顶部) */}
                <div className="moments-header-banner">
                  <div className="moments-stat-title-row">
                    <span className="moments-stat-title">本学期活动瞬间</span>
                    <span className="moments-stat-badge">共 {momentsData.summary?.total || 14} 份分享 · 覆盖 {momentsData.summary?.covered || 6} 场活动</span>
                  </div>

                  {/* 横向滑动筛选胶囊 (对齐图2全部活动下拉) */}
                  <div className="moments-scroll-pills">
                    {(momentsData.activities || []).map(act => (
                      <div
                        key={act.id}
                        className={`moments-pill-item ${selectedMomentActivity === act.id ? 'active' : ''}`}
                        onClick={() => setSelectedMomentActivity(act.id)}
                      >
                        {act.name}
                      </div>
                    ))}
                  </div>

                  <p className="moments-hint-text">
                    按活动时间汇总成员分享；右上角带“精选”为社长推荐，点击任一卡片可放大查看。
                  </p>
                </div>

                {/* 2. 2列网格瀑布流照片卡片 (对齐图2卡片列表) */}
                <div className="moments-grid-flow">
                  {currentList.map(moment => (
                    <div
                      key={moment.id}
                      className="moment-card-box"
                      onClick={() => setPreviewMomentItem(moment)}
                    >
                      <div className="moment-photo-container">
                        <img src={moment.photo} alt={moment.actName} className="moment-photo-img" />
                        {moment.isFeatured && (
                          <span className="moment-featured-tag">精选</span>
                        )}
                        <span className="moment-act-overlay-tag">{moment.actName}</span>
                      </div>
                      <div className="moment-card-info-row">
                        <span className="moment-author-name">{moment.author}</span>
                        <span>{moment.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* 弹窗：作品/荣誉详情与大图预览 (对齐图1点击预览)               */}
        {/* ========================================================= */}
        {previewShowcaseItem && (
          <div className="modal-mask" onClick={() => setPreviewShowcaseItem(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '340px' }}>
              <div className="modal-dialog-header">
                <span className="modal-dialog-title">
                  {previewShowcaseItem.type === 'work' ? '作品详情' : '荣誉证明'}
                </span>
                <button className="modal-dialog-close" onClick={() => setPreviewShowcaseItem(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-dialog-body" style={{ padding: '12px' }}>
                <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#0f172a', maxHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={previewShowcaseItem.cover} alt={previewShowcaseItem.title} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{previewShowcaseItem.title}</span>
                  {previewShowcaseItem.creator && (
                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>
                      创作者：{previewShowcaseItem.creator}
                    </span>
                  )}
                  {previewShowcaseItem.time && (
                    <span style={{ fontSize: '12px', color: '#ea580c', fontWeight: 500 }}>
                      获奖时间：{previewShowcaseItem.time}
                    </span>
                  )}
                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '4px 0' }}>
                    {previewShowcaseItem.desc}
                  </p>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                    {previewShowcaseItem.uploader || '学生社长上传'} · {previewShowcaseItem.date}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 14px', borderTop: '1px solid #f1f5f9' }}>
                <button className="prop-btn text" onClick={() => setPreviewShowcaseItem(null)}>关闭</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 弹窗：活动精彩瞬间大图查看 (对齐图2点击放大)                 */}
        {/* ========================================================= */}
        {previewMomentItem && (
          <div className="modal-mask" onClick={() => setPreviewMomentItem(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '340px' }}>
              <div className="modal-dialog-header">
                <span className="modal-dialog-title">活动瞬间分享</span>
                <button className="modal-dialog-close" onClick={() => setPreviewMomentItem(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-dialog-body" style={{ padding: '12px' }}>
                <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#0f172a', position: 'relative' }}>
                  <img src={previewMomentItem.photo} alt={previewMomentItem.actName} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  {previewMomentItem.isFeatured && (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>
                      精选
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{previewMomentItem.actName}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>分享人：<strong>{previewMomentItem.author}</strong></span>
                    <span>{previewMomentItem.time}</span>
                  </div>
                  {previewMomentItem.text && (
                    <p style={{ fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '8px', borderRadius: '6px', margin: '4px 0 0' }}>
                      “{previewMomentItem.text}”
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 14px', borderTop: '1px solid #f1f5f9' }}>
                <button className="prop-btn text" onClick={() => setPreviewMomentItem(null)}>关闭</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 弹窗：未通过原因查看与重新申报指引                             */}
        {/* ========================================================= */}
        {viewingRejectedItem && (
          <div className="modal-mask" onClick={() => setViewingRejectedItem(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '340px' }}>
              <div className="modal-dialog-header">
                <span className="modal-dialog-title">报名审核反馈 · {viewingRejectedItem.clubName}</span>
                <button className="modal-dialog-close" onClick={() => setViewingRejectedItem(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-dialog-body" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <img src={viewingRejectedItem.cover} alt="" style={{ width: '44px', height: '56px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{viewingRejectedItem.clubName}</strong>
                    <span style={{ color: '#64748b' }}>学生社长：{viewingRejectedItem.captain}</span>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>提交时间：{viewingRejectedItem.submittedAt}</span>
                  </div>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', marginBottom: '4px' }}>
                    社长审核反馈（未通过）：
                  </div>
                  <div style={{ fontSize: '12px', color: '#991b1b', lineHeight: 1.5 }}>
                    {viewingRejectedItem.feedback || '很抱歉，本期报名人数较多，社团名额已满。感谢你对本科目的热情，欢迎关注其他社团或下学期再次选报！'}
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: '#64748b', lineHeight: 1.5 }}>
                  💡 提示：本学期选课招新期内，您仍可协助孩子选择其他未招满的社团重新报名。
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '10px 14px', borderTop: '1px solid #f1f5f9' }}>
                <button className="prop-btn text" onClick={() => setViewingRejectedItem(null)}>关闭</button>
                <button
                  className="prop-btn primary"
                  onClick={() => {
                    const item = viewingRejectedItem;
                    setViewingRejectedItem(null);
                    handleReapply(item);
                  }}
                >
                  <ArrowClockwise size={12} weight="bold" />
                  <span>重新报名此社团</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 弹窗：【代孩子报名社团】                                     */}
        {/* ========================================================= */}
        {modalType === 'applyModal' && currentClubForApply && (
          <div className="modal-mask" onClick={() => setModalType(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-dialog-header">
                <span className="modal-dialog-title">代孩子报名 · {currentClubForApply.name}</span>
                <button className="modal-dialog-close" onClick={() => setModalType(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-dialog-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    报名申请将直接提交至目标社团学生社长【{currentClubForApply.captain}】审核，审核通过后正式确立团员关系。
                  </div>
                  <div className="form-item">
                    <label className="form-label">特长或申请意向说明（选填）</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="可简述孩子的兴趣特长或参团意向，便于学生社长了解"
                      value={applyReason}
                      onChange={(e) => setApplyReason(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '10px 14px', borderTop: '1px solid #f1f5f9' }}>
                <button className="prop-btn text" onClick={() => setModalType(null)}>取消</button>
                <button className="prop-btn primary" onClick={handleConfirmApply}>确认提交报名</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Modal 4：招新海报全屏预览                                  */}
        {/* ========================================================= */}
        {modalType === 'posterModal' && previewPosterClub && (
          <div className="poster-preview-mask" onClick={() => setModalType(null)}>
            <div className="poster-preview-card" onClick={(e) => e.stopPropagation()}>
              <div className="poster-preview-header">
                <span className="poster-preview-title">{previewPosterClub.name} · 招新海报</span>
                <button className="poster-preview-close" onClick={() => setModalType(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="poster-preview-img-wrap">
                <img src={previewPosterClub.cover} alt={previewPosterClub.name} className="poster-full-img" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
