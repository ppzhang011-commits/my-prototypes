import {
  Archive,
  ArrowLeft,
  Bell,
  BookOpenText,
  Buildings,
  ChalkboardTeacher,
  ChartLineUp,
  ClipboardText,
  DownloadSimple,
  FileText,
  GearSix,
  GraduationCap,
  House,
  ImageSquare,
  ListChecks,
  MagnifyingGlass,
  OrangeSlice,
  SealCheck,
  Student,
  UsersThree,
} from "@phosphor-icons/react";
import { applicationSeed, creditSeed, currentTerm, endRequestSeed } from "./fixtures.js";

const pageMeta = {
  clubs: { title: "学生社团" },
  analysis: { title: "社团报告", back: true },
  reportRun: { title: "社团报告", back: true },
  applications: { title: "社团审核", back: true },
  credits: { title: "社团学分审核", back: true },
  config: { title: "配置", back: true },
  basicSettings: { title: "基本设置", back: true },
  activityNotice: { title: "社团申报说明", back: true },
  formSettings: { title: "表单设置", back: true },
  applicationFormPreview: { title: "社团申报表", back: true },
  creditApplicationFormPreview: { title: "学分申请表", back: true },
  activityMaterialFormPreview: { title: "活动开展材料", back: true },
  applicationForm: { title: "社团申报表", back: true },
  creditApplicationForm: { title: "学分申请表", back: true },
  activityMaterialForm: { title: "活动开展材料", back: true },
  clubDetail: { title: "社团详情", back: true },
  continuation: { title: "延续到下学期", back: true },
  proxyApplication: { title: "代学生申报社团", back: true },
  categorySettings: { title: "社团类别", back: true },
  creditRules: { title: "学分规则", back: true },
};

const primaryNav = [
  [House, "工作台"],
  [ImageSquare, "画像"],
  [BookOpenText, "课程"],
  [ChalkboardTeacher, "教学"],
  [GraduationCap, "教研"],
  [Student, "育人"],
  [Buildings, "家校"],
  [UsersThree, "教师发展"],
  [Archive, "教务校务"],
];

const secondaryNav = ["日常行为评价", "综合实践活动", "综合实践", "技能测试", "学生社团", "健康体测", "导师育人", "班级评价"];

export function AppIcon({ icon: Icon, size = 18, weight = "regular" }) {
  return <Icon size={size} weight={weight} aria-hidden="true" />;
}

export function Header() {
  return (
    <header className="app-header">
      <div className="brand-block">
        <span className="brand-mark" aria-hidden="true"><AppIcon icon={OrangeSlice} size={27} weight="fill" /></span>
        <span className="brand-name">果之</span>
        <span className="brand-divider" />
        <span className="platform-name">果之产研教育教学智能平台</span>
      </div>
      <div className="header-actions">
        <label className="global-search">
          <AppIcon icon={MagnifyingGlass} size={16} />
          <input aria-label="搜索课表或功能" placeholder="搜索课表、功能..." />
        </label>
        <button className="header-icon-button" type="button" aria-label="通知"><AppIcon icon={Bell} size={19} /></button>
        <button className="header-icon-button" type="button" aria-label="下载"><AppIcon icon={DownloadSimple} size={19} /></button>
        <button className="profile-button" type="button" aria-label="个人中心">
          <span className="avatar"><AppIcon icon={Student} size={19} weight="fill" /></span>
          <span>赵乐</span>
        </button>
      </div>
    </header>
  );
}

export function Sidebar({ onHome }) {
  return (
    <>
      <aside className="primary-sidebar" aria-label="主导航">
        <nav>
          {primaryNav.map(([Icon, label]) => (
            <button key={label} type="button" className={`primary-nav-item ${label === "育人" ? "active" : ""}`}>
              <AppIcon icon={Icon} size={18} weight={label === "育人" ? "fill" : "regular"} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button type="button" className="more-nav"><AppIcon icon={ListChecks} size={17} />更多...</button>
      </aside>
      <aside className="secondary-sidebar" aria-label="育人模块导航">
        <nav>
          {secondaryNav.map((label) => (
            <button key={label} type="button" onClick={label === "学生社团" ? onHome : undefined} className={`secondary-nav-item ${label === "学生社团" ? "active" : ""}`}>
              <span className="secondary-nav-icon"><AppIcon icon={label === "学生社团" ? UsersThree : FileText} size={16} /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function TaskButton({ icon, label, count, onClick, quiet = false }) {
  return (
    <button type="button" className={`task-button ${quiet ? "quiet" : ""}`} onClick={onClick}>
      <AppIcon icon={icon} size={15} />
      <span>{label}</span>
      {count !== undefined ? <span className="task-count" aria-label={`${count} 条待处理`}>{count}</span> : null}
    </button>
  );
}

export function PageHeader({ page, clubDetail, onBack, onNavigate, onPlaceholder, headerAction, applicationPendingCount, creditPendingCount: propCreditPendingCount }) {
  const meta = pageMeta[page];
  const title = page === "clubDetail" && clubDetail ? clubDetail.name : meta.title;
  const appPendingCount = applicationPendingCount ?? (applicationSeed.filter((item) => item.term === currentTerm && item.status === "待审核").length
    + endRequestSeed.filter((item) => item.term === currentTerm && item.status === "待审核").length);
  const creditPendingCount = propCreditPendingCount ?? creditSeed.filter((item) => item.term === currentTerm && item.status === "待审核").length;

  return (
    <div className="page-header">
      <div className="page-title-row">
        {meta.back ? <button type="button" className="back-button" onClick={onBack} aria-label="返回学生社团"><AppIcon icon={ArrowLeft} size={18} weight="bold" /></button> : null}
        <h1>{title}</h1>
      </div>
      {page === "clubs" ? (
        <div className="page-task-actions" data-proto-id="clubs-task-entries">
          <button type="button" className="btn-header-outline" data-proto-id="clubs-analysis-entry" onClick={() => onNavigate("analysis")}>分析报告</button>
          <button type="button" className="btn-header-primary" data-proto-id="clubs-review-entry" onClick={() => onNavigate("applications")}>社团审核({appPendingCount})</button>
          <button type="button" className="btn-header-primary" data-proto-id="clubs-credit-review-entry" onClick={() => onNavigate("credits")}>社团学分审核({creditPendingCount})</button>
          <button type="button" className="btn-header-primary" data-proto-id="clubs-config-entry" onClick={() => onNavigate("config")}>配置</button>
        </div>
      ) : headerAction ? (
        <div className="page-task-actions">
          {headerAction}
        </div>
      ) : null}
    </div>
  );
}
