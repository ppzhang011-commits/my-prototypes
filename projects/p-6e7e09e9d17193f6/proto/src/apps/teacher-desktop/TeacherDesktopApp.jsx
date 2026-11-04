import { useEffect, useState } from "react";
import {
  ActivityNoticePage,
  BasicSettingsPage,
  CategorySettingsPage,
  CreditRulesPage,
  FormBuilderPage,
  FormPreviewPage,
  FormSettingsPage,
} from "./config-pages.jsx";
import { ApplicationReviewDetailPage, ApplicationsPage, ClubDetailPage, ClubsPage, ConfigPage, ContinuationPage, ContinuationRequestReviewDetailPage, CreditReviewDetailPage, CreditsPage, EarlyEndClubDialog, EndRequestReviewDetailPage, ProxyApplicationPage, RestoreClubDialog } from "./pages.jsx";
import { ClubRunReportPage } from "./reports.jsx";
import { Header, PageHeader, Sidebar } from "./shell.jsx";
import { applicationSeed, clubsSeed, continuationRequestSeed, creditSeed, currentTerm, endRequestSeed } from "./fixtures.js";

const prototypeDetailTabByState = {
  "club-info": "社团信息",
  "club-members": "成员管理",
  "club-activities": "活动一览",
  "club-showcase": "作品与荣誉",
  "club-credits": "成员学分",
  "club-history": "社团历程",
};

const prototypeStateByDetailTab = Object.fromEntries(Object.entries(prototypeDetailTabByState).map(([state, tab]) => [tab, state]));

// 原型生成器的页面树使用独立 HTML 入口；这里把入口状态还原成应用内的业务视图，
// 使“端 → 一级页 → 功能页”的导航可直接预览，而非只能从首页逐层点击。
const prototypeRouteByState = {
  default: { page: "clubs" },
  "club-info": { page: "clubDetail", detailTab: "社团信息" },
  "club-members": { page: "clubDetail", detailTab: "成员管理" },
  "club-activities": { page: "clubDetail", detailTab: "活动一览" },
  "club-showcase": { page: "clubDetail", detailTab: "作品与荣誉" },
  "club-credits": { page: "clubDetail", detailTab: "成员学分" },
  "club-history": { page: "clubDetail", detailTab: "社团历程" },
  "proxy-application": { page: "proxyApplication" },
  analysis: { page: "analysis" },
  applications: { page: "applications" },
  "application-review": { page: "applications", workbench: "application" },
  "end-request-review": { page: "applications", workbench: "end" },
  "continuation-request-review": { page: "applications", workbench: "continuation" },
  credits: { page: "credits" },
  "credit-review": { page: "credits", workbench: "credit" },
  config: { page: "config" },
  "basic-settings": { page: "basicSettings", settingsMode: "view" },
  "basic-settings-edit": { page: "basicSettings", settingsMode: "edit" },
  "activity-notice": { page: "activityNotice" },
  "form-settings": { page: "formSettings" },
  "category-settings": { page: "categorySettings" },
  "credit-rules": { page: "creditRules" },
};

const prototypeFileByPage = {
  config: "config.html",
  basicSettings: "basic-settings.html",
  activityNotice: "activity-notice.html",
  formSettings: "form-settings.html",
  categorySettings: "category-settings.html",
  creditRules: "credit-rules.html",
};

const prototypePageByRoute = {
  clubs: "home",
  analysis: "analysis",
  reportRun: "analysis",
  applications: "applications",
  credits: "credits",
  config: "config",
  proxyApplication: "proxy-application",
  basicSettings: "basic-settings",
  activityNotice: "activity-notice",
  formSettings: "form-settings",
  categorySettings: "category-settings",
  creditRules: "credit-rules",
};

export function TeacherDesktopApp() {
  // 独立的原型页面会在挂载前写入初始详情 Tab；正常进入仍从社团列表开始。
  const directPageState = window.location.pathname.match(/\/(club-(?:info|members|activities|showcase|credits|history))\.html$/)?.[1];
  const initialPrototypeState = directPageState || document.documentElement.dataset.protoPage || window.__TEACHER_DESKTOP_INITIAL_STATE__;
  const initialDetailTab = prototypeDetailTabByState[initialPrototypeState] ?? null;
  const [page, setPage] = useState(() => initialDetailTab ? "clubDetail" : "clubs");
  const [notice, setNotice] = useState("");
  const [headerAction, setHeaderAction] = useState(null);
  const [applications, setApplications] = useState(applicationSeed);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [applicationReviewQueue, setApplicationReviewQueue] = useState([]);
  const [selectedEndRequestId, setSelectedEndRequestId] = useState(null);
  const [continuationRequests, setContinuationRequests] = useState(continuationRequestSeed);
  const [selectedContinuationRequestId, setSelectedContinuationRequestId] = useState(null);
  const [credits, setCredits] = useState(creditSeed);
  const [selectedCreditId, setSelectedCreditId] = useState(null);
  const [creditReviewQueue, setCreditReviewQueue] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(() => initialDetailTab ? 1 : null);
  const [detailTab, setDetailTab] = useState(() => initialDetailTab ?? "社团信息");
  const [clubs, setClubs] = useState(clubsSeed);
  const [endingClubId, setEndingClubId] = useState(null);
  const [restoringClubId, setRestoringClubId] = useState(null);
  const [settingsMode, setSettingsMode] = useState("view");

  const openPrototypeFile = (file) => {
    if (window.location.pathname.endsWith(`/${file}`)) return false;
    window.location.assign(new URL(file, window.location.href).href);
    return true;
  };

  // 原型内点击也要告诉工作台“当前在哪个业务页面”，让左侧目录树同步展开、选中并定位。
  const markPrototypePage = (pageId) => {
    if (!pageId) return;
    document.documentElement.dataset.protoPage = pageId;
    document.documentElement.dataset.protoState = "default";
  };

  const navigateTo = (target) => {
    if (prototypeFileByPage[target] && openPrototypeFile(prototypeFileByPage[target])) return;
    setHeaderAction(null);
    if (target === "basicSettings") setSettingsMode("view");
    markPrototypePage(prototypePageByRoute[target]);
    setPage(target);
  };
  const goHome = () => navigateTo("clubs");
  const openApplicationReview = (id) => {
    const pendingIds = applications.filter((item) => item.status === "待审核").map((item) => item.id);
    setApplicationReviewQueue(pendingIds.includes(id) ? pendingIds : []);
    setSelectedApplicationId(id);
    markPrototypePage("application-review");
  };
  const openEndRequestReview = (id) => {
    setSelectedEndRequestId(id);
    markPrototypePage("end-request-review");
  };
  const openContinuationRequestReview = (id) => {
    setSelectedContinuationRequestId(id);
    markPrototypePage("continuation-request-review");
  };
  const openCreditReview = (id) => {
    const pendingIds = credits.filter((item) => item.term === currentTerm && item.status === "待审核").map((item) => item.id);
    setCreditReviewQueue(pendingIds.includes(id) ? pendingIds : []);
    setSelectedCreditId(id);
    markPrototypePage("credit-review");
  };
  const completeCreditReview = (id, status, action, data) => {
    const currentIndex = creditReviewQueue.indexOf(id);
    const nextId = currentIndex >= 0 ? creditReviewQueue[currentIndex + 1] ?? null : null;
    const completedAt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
    setCredits((items) => items.map((item) => item.id === id ? {
      ...item,
      status,
      teacherHours: data.teacherHours,
      suggestedCredit: data.teacherCredit,
      teacherComment: data.comment,
      returnReason: data.returnReason,
      teacherAudit: {
        auditor: "张可可",
        auditedAt: completedAt,
        hours: data.teacherHours,
        credit: data.teacherCredit,
        comment: data.comment,
        returnReason: data.returnReason,
      },
      approvalHistory: [
        ...(item.approvalHistory ?? []),
        { action, actor: "张可可", time: completedAt, detail: data.comment || data.returnReason || `核定 ${data.teacherHours} 小时` }
      ],
    } : item));
    setSelectedCreditId(nextId);
    if (!nextId) {
      setCreditReviewQueue([]);
      markPrototypePage("credits");
    }
  };
  const revokeCreditReview = (id) => {
    const revokedAt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
    setCredits((items) => items.map((item) => item.id === id ? {
      ...item,
      status: "待审核",
      approvalHistory: [
        ...(item.approvalHistory ?? []),
        { action: "撤销审核结果", actor: "张可可", time: revokedAt, detail: `撤销原审核结果（${item.status}），恢复为待审核` }
      ],
    } : item));
    showPlaceholder("已撤销审核结果，该学分申请已恢复为待审核");
  };
  const modifyCreditReviewResult = (id, data) => {
    const modifiedAt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
    setCredits((items) => items.map((item) => item.id === id ? {
      ...item,
      teacherHours: data.teacherHours ?? item.teacherHours,
      suggestedCredit: data.teacherCredit ?? item.suggestedCredit,
      teacherComment: data.comment ?? item.teacherComment,
      teacherAudit: {
        ...(item.teacherAudit ?? {}),
        auditor: "张可可",
        auditedAt: modifiedAt,
        hours: data.teacherHours ?? item.teacherHours,
        credit: data.teacherCredit ?? item.suggestedCredit,
        comment: data.comment ?? item.teacherComment,
      },
      approvalHistory: [
        ...(item.approvalHistory ?? []),
        { action: "修改审核结果", actor: "张可可", time: modifiedAt, detail: `调整最终核定学时为 ${data.teacherHours} 小时（${data.teacherCredit} 学分）` }
      ],
    } : item));
    showPlaceholder("已更新最终学分认定结果");
  };
  const openClubDetail = (club) => {
    setSelectedClubId(club.id);
    setDetailTab("社团信息");
    markPrototypePage("club-info");
    navigateTo("clubDetail");
  };
  const openContinuation = (club) => {
    setSelectedClubId(club.id);
    navigateTo("continuation");
  };
  const openEarlyEnd = (club) => setEndingClubId(club.id);
  const confirmEarlyEnd = (reason) => {
    const endedAt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
    const endingClub = clubs.find((club) => club.id === endingClubId);
    setClubs((items) => items.map((club) => club.id === endingClubId ? {
      ...club,
      status: "已提前结束",
      endedAt,
      endReason: reason,
      pendingJoinsAtEnd: club.pendingJoins,
      pendingJoins: 0,
      lifecycleHistory: [...(club.lifecycleHistory ?? []), { action: "提前结束本学期社团", actor: "赵乐", time: endedAt, reason }],
    } : club));
    setEndingClubId(null);
    if (endingClub) showPlaceholder(`已提前结束“${endingClub.name}”，本学期成员关系已冻结`);
  };
  const openRestore = (club) => setRestoringClubId(club.id);
  const confirmRestore = (reason) => {
    const restoredAt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
    const restoringClub = clubs.find((club) => club.id === restoringClubId);
    setClubs((items) => items.map((club) => club.id === restoringClubId ? {
      ...club,
      status: "进行中",
      restoredAt,
      restoreReason: reason,
      lifecycleHistory: [...(club.lifecycleHistory ?? []), { action: "恢复本学期社团运行", actor: "赵乐", time: restoredAt, reason }],
    } : club));
    setRestoringClubId(null);
    if (restoringClub) showPlaceholder(`已恢复“${restoringClub.name}”本学期运行，结束期间终止的事项不会自动恢复`);
  };
  const startProxyApplication = () => navigateTo("proxyApplication");
  const submitProxyApplication = (application) => {
    setApplications((items) => [application, ...items]);
    showPlaceholder(`已代 ${application.applicant} 提交“${application.name}”，请在社团审核中处理`);
    navigateTo("applications");
  };
  const showPlaceholder = (message) => setNotice(message);
  const completeApplicationReview = (id, status, action, reason) => {
    const currentIndex = applicationReviewQueue.indexOf(id);
    const nextId = currentIndex >= 0 ? applicationReviewQueue[currentIndex + 1] ?? null : null;
    const completedAt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
    setApplications((items) => items.map((item) => item.id === id ? {
      ...item,
      status,
      approvalHistory: [...(item.approvalHistory ?? []), { action, actor: "张可可", time: completedAt, detail: reason }],
    } : item));
    setSelectedApplicationId(nextId);
    if (!nextId) {
      setApplicationReviewQueue([]);
      markPrototypePage("applications");
    }
  };
  const completeContinuationReview = (id, status, action, reason) => {
    const completedAt = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replaceAll("/", "-");
    setContinuationRequests((items) => items.map((item) => item.id === id ? {
      ...item,
      status,
      approvalHistory: [...(item.approvalHistory ?? []), { action, actor: "张可可", time: completedAt, detail: reason }],
    } : item));
  };
  const goBack = () => {
    setHeaderAction(null);
    if (["applicationForm", "creditApplicationForm", "activityMaterialForm", "applicationFormPreview", "creditApplicationFormPreview", "activityMaterialFormPreview"].includes(page)) navigateTo("formSettings");
    else if (page === "continuation") navigateTo("clubDetail");
    else if (page === "proxyApplication") goHome();
    else if (["basicSettings", "activityNotice", "formSettings", "categorySettings", "creditRules"].includes(page)) navigateTo("config");
    else goHome();
  };

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const previousBridge = window.PrototypeBridge;
    const enter = (stateId) => {
      // 独立入口页的唯一状态都是 default，实际要打开的业务视图由 data-proto-page 决定；
      // 首页的详情状态仍可用显式 stateId 进入，兼容既有标注链接。
      const routeState = stateId === "default" ? document.documentElement.dataset.protoPage || "default" : stateId;
      const route = prototypeRouteByState[routeState];
      if (!route) return Promise.reject(new Error(`未知原型状态：${routeState}`));
      const firstPendingApplication = applications.filter((item) => item.status === "待审核").map((item) => item.id);
      const firstPendingCredit = credits.filter((item) => item.term === currentTerm && item.status === "待审核").map((item) => item.id);
      setHeaderAction(null);
      setPage(route.page);
      setSettingsMode(route.settingsMode ?? "view");
      setSelectedClubId(route.detailTab ? 1 : null);
      setDetailTab(route.detailTab ?? "社团信息");
      setSelectedApplicationId(route.workbench === "application" ? firstPendingApplication[0] ?? null : null);
      setApplicationReviewQueue(route.workbench === "application" ? firstPendingApplication : []);
      setSelectedEndRequestId(route.workbench === "end" ? endRequestSeed[0]?.id ?? null : null);
      setSelectedContinuationRequestId(route.workbench === "continuation" ? continuationRequests[0]?.id ?? null : null);
      setSelectedCreditId(route.workbench === "credit" ? firstPendingCredit[0] ?? null : null);
      setCreditReviewQueue(route.workbench === "credit" ? firstPendingCredit : []);
      document.documentElement.dataset.protoState = stateId;
      return new Promise((resolve) => window.requestAnimationFrame(resolve));
    };
    window.PrototypeBridge = { ...(previousBridge ?? {}), enter };
    if (initialPrototypeState && initialPrototypeState !== "default") void enter("default");
    return () => {
      if (window.PrototypeBridge?.enter === enter) window.PrototypeBridge = previousBridge;
    };
  // Bridge 在挂载时建立即可；审核操作造成的数据变化不应让当前入口重新跳回初始视图。
  }, []);

  useEffect(() => {
    // 外部导航入口（分析、审核、配置等）在同一 React 应用中直达时，保留入口状态；
    // 普通应用内导航由 navigateTo 先复位为 default。
    if (page !== "clubDetail" && document.documentElement.dataset.protoState !== "default") return;
    // 社团详情的每个 Tab 都已登记为独立原型页面，而不是同一页的多个 state。
    // 保持 state 为 default，避免左侧目录进入独立页后拿“club-showcase”等页面 ID 去匹配 state，导致标注过滤为空。
    document.documentElement.dataset.protoState = "default";
  }, [detailTab, page]);

  const selectedClub = clubs.find((club) => club.id === selectedClubId) ?? null;
  const endingClub = clubs.find((club) => club.id === endingClubId) ?? null;
  const restoringClub = clubs.find((club) => club.id === restoringClubId) ?? null;
  let content = <ClubsPage clubs={clubs} onPlaceholder={showPlaceholder} onViewClub={openClubDetail} onContinueClub={openContinuation} onEndClub={openEarlyEnd} onRestoreClub={openRestore} onStartProxyApplication={startProxyApplication} />;
  if (page === "analysis" || page === "reportRun") content = <ClubRunReportPage onBack={goBack} onNavigate={navigateTo} onPlaceholder={showPlaceholder} />;
  if (page === "clubDetail") content = selectedClub ? <ClubDetailPage key={`${selectedClub.id}-${selectedClub.status}`} club={selectedClub} initialTab={detailTab} onTabChange={(tab) => { setDetailTab(tab); requestAnimationFrame(() => markPrototypePage(prototypeStateByDetailTab[tab])); }} onPlaceholder={showPlaceholder} onContinue={openContinuation} onRestore={openRestore} /> : <ClubsPage clubs={clubs} onPlaceholder={showPlaceholder} onViewClub={openClubDetail} onContinueClub={openContinuation} onEndClub={openEarlyEnd} onRestoreClub={openRestore} onStartProxyApplication={startProxyApplication} />;
  if (page === "continuation") content = selectedClub ? <ContinuationPage club={selectedClub} onCancel={() => navigateTo("clubDetail")} onComplete={(result) => { showPlaceholder(`已创建“${result.targetTerm}”的关联社团记录，并通知学生社长`); navigateTo("clubs"); }} /> : <ClubsPage clubs={clubs} onPlaceholder={showPlaceholder} onViewClub={openClubDetail} onContinueClub={openContinuation} onEndClub={openEarlyEnd} onRestoreClub={openRestore} onStartProxyApplication={startProxyApplication} />;
  if (page === "proxyApplication") content = <ProxyApplicationPage applications={applications} onCancel={goHome} onSubmit={submitProxyApplication} />;
  if (page === "applications") content = <ApplicationsPage applications={applications} endRequests={endRequestSeed} continuationRequests={continuationRequests} onReviewApplication={openApplicationReview} onReviewEndRequest={openEndRequestReview} onReviewContinuationRequest={openContinuationRequestReview} />;
  if (page === "credits") content = <CreditsPage credits={credits} onReviewCredit={openCreditReview} onPlaceholder={showPlaceholder} />;
  if (page === "config") content = <ConfigPage onNavigate={navigateTo} onPlaceholder={showPlaceholder} />;
  if (page === "basicSettings") content = <BasicSettingsPage key={settingsMode} initialEditing={settingsMode === "edit"} onNotify={showPlaceholder} onSetHeaderAction={setHeaderAction} onOpenEdit={() => openPrototypeFile("basic-settings-edit.html")} onReturnToView={() => openPrototypeFile("basic-settings.html")} />;
  if (page === "activityNotice") content = <ActivityNoticePage onNotify={showPlaceholder} onSetHeaderAction={setHeaderAction} />;
  if (page === "formSettings") content = <FormSettingsPage onNavigate={navigateTo} />;
  if (page === "applicationFormPreview") content = <FormPreviewPage type="application" onNavigate={navigateTo} />;
  if (page === "creditApplicationFormPreview") content = <FormPreviewPage type="credit" onNavigate={navigateTo} />;
  if (page === "activityMaterialFormPreview") content = <FormPreviewPage type="material" onNavigate={navigateTo} />;
  if (page === "applicationForm") content = <FormBuilderPage type="application" onNotify={showPlaceholder} />;
  if (page === "creditApplicationForm") content = <FormBuilderPage type="credit" onNotify={showPlaceholder} />;
  if (page === "activityMaterialForm") content = <FormBuilderPage type="material" onNotify={showPlaceholder} />;
  if (page === "categorySettings") content = <CategorySettingsPage onNotify={showPlaceholder} />;
  if (page === "creditRules") content = <CreditRulesPage onNavigate={navigateTo} onNotify={showPlaceholder} onSetHeaderAction={setHeaderAction} />;

  const creditPendingCount = credits.filter((item) => item.term === currentTerm && item.status === "待审核").length;

  return <div className="app-shell">
    <Header />
    <Sidebar onHome={goHome} />
    <main className="workspace"><section className="content-panel">
      <PageHeader
        page={page}
        clubDetail={selectedClub}
        onBack={goBack}
        onNavigate={navigateTo}
        onPlaceholder={showPlaceholder}
        headerAction={headerAction}
        applicationPendingCount={applications.filter((item) => item.term === applicationSeed[0].term && item.status === "待审核").length + endRequestSeed.filter((item) => item.term === applicationSeed[0].term && item.status === "待审核").length + continuationRequests.filter((item) => item.targetTerm === applicationSeed[0].term && item.status === "待审核").length}
        creditPendingCount={creditPendingCount}
      />
      <div className="page-content">{content}</div>
    </section></main>
    {selectedApplicationId ? <ApplicationReviewDetailPage key={selectedApplicationId} application={applications.find((item) => item.id === selectedApplicationId)} queuePosition={applicationReviewQueue.indexOf(selectedApplicationId) + 1} queueTotal={applicationReviewQueue.length} onCompleted={(status, action, reason) => completeApplicationReview(selectedApplicationId, status, action, reason)} onClose={() => { setSelectedApplicationId(null); setApplicationReviewQueue([]); markPrototypePage("applications"); }} onPlaceholder={showPlaceholder} /> : null}
    {selectedEndRequestId ? <EndRequestReviewDetailPage request={endRequestSeed.find((item) => item.id === selectedEndRequestId)} onClose={() => { setSelectedEndRequestId(null); markPrototypePage("applications"); }} onPlaceholder={showPlaceholder} /> : null}
    {selectedContinuationRequestId ? <ContinuationRequestReviewDetailPage key={selectedContinuationRequestId} request={continuationRequests.find((item) => item.id === selectedContinuationRequestId)} onClose={() => { setSelectedContinuationRequestId(null); markPrototypePage("applications"); }} onCompleted={(status, action, reason) => completeContinuationReview(selectedContinuationRequestId, status, action, reason)} onPlaceholder={showPlaceholder} /> : null}
    {selectedCreditId ? <CreditReviewDetailPage key={selectedCreditId} credit={credits.find((item) => item.id === selectedCreditId)} queuePosition={creditReviewQueue.indexOf(selectedCreditId) + 1} queueTotal={creditReviewQueue.length} onClose={() => { setSelectedCreditId(null); setCreditReviewQueue([]); markPrototypePage("credits"); }} onCompleted={(status, action, data) => completeCreditReview(selectedCreditId, status, action, data)} onRevoke={(id) => revokeCreditReview(id)} onModifyResult={(id, data) => modifyCreditReviewResult(id, data)} onPlaceholder={showPlaceholder} /> : null}
    {endingClub ? <EarlyEndClubDialog club={endingClub} onClose={() => setEndingClubId(null)} onConfirm={confirmEarlyEnd} /> : null}
    {restoringClub ? <RestoreClubDialog club={restoringClub} onClose={() => setRestoringClubId(null)} onConfirm={confirmRestore} /> : null}
    {notice ? <div className="prototype-toast" role="status">{notice}</div> : null}
  </div>;
}
