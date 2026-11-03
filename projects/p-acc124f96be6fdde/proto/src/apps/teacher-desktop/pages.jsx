import { useEffect, useMemo, useState } from "react";
import {
  ArrowCounterClockwise,
  CaretRight,
  ClipboardText,
  DotsThreeVertical,
  FileText,
  Medal,
  Paperclip,
  PencilSimple,
  PlayCircle,
  Plus,
  SealCheck,
  TextB,
  TextItalic,
  ListBullets,
  LinkSimple,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { applicationSeed, clubDetailSeed, clubsSeed, creditSeed, currentTerm, endRequestSeed, termOptions, termWindows, venueLibrarySeed } from "./fixtures.js";
import { AppIcon } from "./shell.jsx";
import { EmptyState, FilterBar, SearchField, SelectField, StatusBadge, TableFrame } from "./ui.jsx";

const allOption = "全部";
const currentReviewerName = "张可可";

function uniqueOptions(items, key) {
  return [allOption, ...new Set(items.map((item) => item[key]))];
}

function PersonCell({ name, detail }) {
  return <div className="cell-stack"><strong>{name}</strong><span>{detail}</span></div>;
}

function MemberClassCell({ member }) {
  const className = member.className?.replace(member.grade ?? "", "").trim();
  return className || "—";
}

function LeaderContactCell({ club }) {
  return <div className="leader-contact-cell">
    <strong>{club.leader}</strong>
    <span>{club.grade}－{club.className}－{club.phone}</span>
  </div>;
}

function VenueNeedCell({ type, value }) {
  return <div className="venue-need-cell" title={`${type}：${value}`}>
    <span>{type}</span>
    <strong>{value}</strong>
  </div>;
}

function PlaceholderAction({ children, onClick }) {
  return <button type="button" className="row-action" onClick={onClick}>{children}<CaretRight size={14} /></button>;
}

function DetailField({ label, children, wide = false }) {
  return <div className={`review-detail-field ${wide ? "wide" : ""}`}>
    <span>{label}</span>
    <strong>{children}</strong>
  </div>;
}

function RichTextField({ label, value, onChange, required = false }) {
  return <label className="continuation-field continuation-richtext-field">
    <span>{label}{required ? <b> *</b> : null}</span>
    <div className="continuation-richtext-shell">
      <div className="continuation-richtext-toolbar" aria-label={`${label}富文本工具`}>
        <button type="button" aria-label="加粗"><AppIcon icon={TextB} size={14} /></button>
        <button type="button" aria-label="斜体"><AppIcon icon={TextItalic} size={14} /></button>
        <i aria-hidden="true" />
        <button type="button" aria-label="列表"><AppIcon icon={ListBullets} size={14} /></button>
        <button type="button" aria-label="插入链接"><AppIcon icon={LinkSimple} size={14} /></button>
      </div>
      <textarea aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  </label>;
}

function approvalTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function CapacityReviewField({ value, originalValue, editable, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const cancel = () => { setDraft(String(value)); setEditing(false); };
  const save = () => {
    const nextValue = Number(draft);
    if (!Number.isInteger(nextValue) || nextValue <= 0) return;
    onSave(nextValue);
    setEditing(false);
  };

  return <div className="review-detail-field capacity-review-field">
    <span>计划人数上限</span>
    {editing ? <div className="capacity-editor">
      <input aria-label="调整计划人数上限" type="number" min="1" value={draft} onChange={(event) => setDraft(event.target.value)} />
      <span>人</span>
      <button type="button" onClick={save} disabled={!Number.isInteger(Number(draft)) || Number(draft) <= 0}>保存</button>
      <button type="button" onClick={cancel}>取消</button>
    </div> : <div className="capacity-value-row">
      <strong>{value} 人</strong>
      {editable ? <button type="button" onClick={() => setEditing(true)}>调整</button> : null}
    </div>}
    {value !== originalValue ? <small>学生申报值：{originalValue} 人</small> : null}
  </div>;
}

function VenueReviewField({ type, source = "填写说明", requestedValue, value, arrangement, arrangementSource, editable, onSave }) {
  const [editing, setEditing] = useState(false);
  const needsArrangement = type === "协助需求";
  const currentValue = needsArrangement ? arrangement : value;
  const currentSource = needsArrangement ? arrangementSource : source;
  const [mode, setMode] = useState(currentSource === "场地库" ? "library" : "text");
  const [draft, setDraft] = useState(currentValue);
  const fieldLabel = needsArrangement ? "安排场地" : "拟用场地";
  const startEditing = () => { setMode(currentSource === "场地库" ? "library" : "text"); setDraft(currentValue); setEditing(true); };
  const cancelEditing = () => { setMode(currentSource === "场地库" ? "library" : "text"); setDraft(currentValue); setEditing(false); };
  const save = () => {
    const nextValue = draft.trim();
    if (!nextValue) return;
    onSave(nextValue, fieldLabel, mode === "library" ? "场地库" : "填写说明");
    setEditing(false);
  };

  return <div className="review-detail-field venue-review-field wide">
    <span>{needsArrangement ? "学生场地需求" : "拟用场地"}</span>
    <div className="venue-display"><strong>{needsArrangement ? requestedValue : value}</strong><span className="venue-source-tag">{needsArrangement ? "填写说明" : source}</span></div>
    {needsArrangement ? <small>审核安排</small> : value !== requestedValue ? <small>学生填写：{requestedValue}</small> : null}
    {editing ? <div className="venue-editor"><div className="venue-mode-switch" role="radiogroup" aria-label="场地填写方式"><button type="button" role="radio" aria-checked={mode === "library"} className={mode === "library" ? "active" : ""} onClick={() => { setMode("library"); setDraft(""); }}><span className="venue-radio-dot" aria-hidden="true" />从场地库选择</button><button type="button" role="radio" aria-checked={mode === "text"} className={mode === "text" ? "active" : ""} onClick={() => { setMode("text"); setDraft(""); }}><span className="venue-radio-dot" aria-hidden="true" />填写场地说明</button></div>{mode === "library" ? draft ? <div className="venue-library-chosen"><span>{draft}</span><button type="button" className="venue-selection-delete" aria-label="删除已选场地" title="删除" onClick={() => setDraft("")}><AppIcon icon={X} size={13} weight="bold" /></button></div> : <button type="button" className="venue-library-select-link" aria-label={`${fieldLabel}场地库`} onClick={() => setDraft(venueLibrarySeed[0].name)}>请选择场地</button> : <input aria-label={fieldLabel} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={needsArrangement ? "填写已安排的场地或协调说明" : "填写调整后的拟用场地"} />}<div className="venue-editor-actions"><button type="button" onClick={cancelEditing}>取消</button><button type="button" className="venue-editor-save" disabled={!draft.trim()} onClick={save}>保存</button></div></div> : <div className="venue-value-row">{needsArrangement && currentValue ? <div className="venue-display"><strong>{currentValue}</strong><span className="venue-source-tag">{currentSource}</span></div> : null}{editable ? <button type="button" className="venue-arrange-action" onClick={startEditing}>{needsArrangement ? currentValue ? "调整安排" : "安排场地" : "调整拟用场地"}</button> : null}</div>}
    <small className="review-venue-note">{needsArrangement ? "学校安排仅作为本次审核记录；每场活动仍需分别填写实际场地。" : "调整后的拟用场地不等同于预约或锁定场地。"}</small>
  </div>;
}

function ApplicationReviewSubmission({ application, capacity, originalCapacity, editable = false, onAdjustCapacity, venueValue, venueSource, venueArrangement = "", venueArrangementSource = "填写说明", onAdjustVenue, onPlaceholder }) {
  return <section className="review-info-group submission-info-group">
    <div className="review-info-group-title"><strong>申报内容</strong></div>
    <section className="review-workbench-section">
      <h3>基本信息</h3>
      <div className="review-detail-grid">
        <DetailField label="社团名称">{application.name}</DetailField>
        <DetailField label="社团类别">{application.category}</DetailField>
        <CapacityReviewField value={capacity} originalValue={originalCapacity} editable={editable} onSave={onAdjustCapacity} />
      </div>
    </section>
    <section className="review-workbench-section">
      <h3>招新与联系</h3>
      <div className="review-detail-grid">
        <DetailField label="联系电话">{application.phone}</DetailField>
        <DetailField label="社团简介" wide>{application.introduction}</DetailField>
        <DetailField label="招募说明" wide>{application.recruitment}</DetailField>
      </div>
    </section>
    <section className="review-workbench-section">
      <h3>活动场地需求</h3>
      <div className="review-detail-grid"><VenueReviewField type={application.venueType} source={venueSource} requestedValue={application.venueText} value={venueValue} arrangement={venueArrangement} arrangementSource={venueArrangementSource} editable={editable} onSave={onAdjustVenue} /></div>
    </section>
    <section className="review-workbench-section materials-section">
      <h3>申报材料</h3>
      <div className="review-material-list">
        {application.materials.map((material) => <button key={material.label} type="button" onClick={() => onPlaceholder(`这里将查看“${material.label}”，本轮暂未展开`)}><AppIcon icon={material.kind === "附件" ? FileText : ClipboardText} size={18} /><span><strong>{material.label}</strong><small>{material.value}</small></span><CaretRight size={16} /></button>)}
      </div>
    </section>
  </section>;
}

function ApprovalTimeline({ entries, hideSubmissionDetail = false }) {
  return <section className="approval-history">
    <ol className="approval-timeline">
      {[...entries].reverse().map((entry, index) => {
        const isSubmission = entry.action.startsWith("提交");
        const shouldShowDetail = entry.detail && !(hideSubmissionDetail && isSubmission);
        return <li key={`${entry.action}-${entry.time}-${index}`}>
        <span className="approval-timeline-dot" aria-hidden="true" />
        <div className="approval-timeline-content">
          <div><strong>{entry.action}</strong><time>{entry.time}</time></div>
          <p>{isSubmission ? "提交人" : "审核人"}：{entry.actor}</p>
          {shouldShowDetail ? <p className="approval-timeline-detail">{entry.detail}</p> : null}
        </div>
      </li>;
      })}
    </ol>
  </section>;
}

function KeyChangeHistory({ changes }) {
  if (!changes.length) return <div className="history-empty">本次审核暂未调整申报字段</div>;
  return <ol className="key-change-list">{[...changes].reverse().map((change, index) => <li key={`${change.field}-${change.time}-${index}`}>
    <div><strong>{change.field}</strong><time>{change.time}</time></div>
    <p>{change.before} → {change.after}</p>
    <small>修改人：{change.actor}</small>
  </li>)}</ol>;
}

function ReviewDecisionFooter({ status, onDecision }) {
  const [mode, setMode] = useState(null);
  const [reason, setReason] = useState("");

  if (status !== "待审核") {
    return <footer className="review-workbench-footer completed"><span>审核结果</span><StatusBadge value={status} /></footer>;
  }

  return <footer className="review-workbench-footer">
    {mode === "return" ? <div className="return-reason-editor">
      <label>退回原因<textarea autoFocus value={reason} onChange={(event) => setReason(event.target.value)} placeholder="请说明需要学生修改的内容" /></label>
      <div className="review-footer-actions"><button type="button" className="review-return-action" disabled={!reason.trim()} onClick={() => onDecision({ action: "退回", status: "已退回", reason: reason.trim() })}>确认退回</button><button type="button" className="text-action" onClick={() => { setMode(null); setReason(""); }}>取消</button></div>
    </div> : <>
      <span className="review-footer-tip">单级审批：通过或退回。退回后学生可修改原申请并重新提交。</span>
      <div className="review-footer-actions"><button type="button" className="review-return-action" onClick={() => setMode("return")}>退回</button><button type="button" className="review-pass-action" onClick={() => onDecision({ action: "通过", status: "已通过" })}>通过</button></div>
    </>}
  </footer>;
}

function ReviewWorkbench({ kind, title, roleLabel, status, onClose, entries, changes = [], proxy, queuePosition, queueTotal, hideSubmissionDetail = false, children, footer }) {
  const [historyView, setHistoryView] = useState("timeline");
  return <div className="review-workbench-mask" role="presentation">
    <section className="review-workbench" role="dialog" aria-modal="true" aria-label={title ? `${kind}：${title}` : kind}>
      <header className="review-workbench-header">
        <div>{title ? <><span>{kind}</span><h2>{title}</h2></> : <h2>{kind}</h2>}{roleLabel ? <span className="review-workbench-role">{roleLabel}</span> : null}<StatusBadge value={status} />{status === "待审核" && queueTotal ? <span className="review-queue-badge">{queuePosition}/{queueTotal}</span> : null}</div>
        <button type="button" className="review-workbench-close" aria-label="关闭审核" onClick={onClose}><AppIcon icon={X} size={21} weight="bold" /></button>
      </header>
      <div className="review-workbench-body">
        <aside className="review-workbench-history">
          <div className="history-tabs">
            <button type="button" className={historyView === "timeline" ? "active" : ""} onClick={() => setHistoryView("timeline")}>审批动态 <em>{entries.length}</em></button>
            <button type="button" className={historyView === "changes" ? "active" : ""} onClick={() => setHistoryView("changes")}>关键变更 <em>{changes.length}</em></button>
          </div>
          {historyView === "timeline" ? <ApprovalTimeline entries={entries} hideSubmissionDetail={hideSubmissionDetail} /> : <KeyChangeHistory changes={changes} />}
        </aside>
        <div className="review-workbench-main">
          {proxy ? <div className="proxy-review-notice"><strong>代审核提示</strong><span>你正在代 {proxy.principal} 处理该审批任务；结果将同时记录实际操作人和原审批节点。</span></div> : null}
          {children}
        </div>
      </div>
      {footer}
    </section>
  </div>;
}

function RecruitmentCell({ club }) {
  const full = club.members >= club.capacity;
  const hasEnded = club.status !== "进行中";
  return (
    <div className="recruitment-cell">
      <div><strong>{club.members}</strong><span> / {club.capacity} 人</span></div>
      {hasEnded
        ? <small>成员关系已冻结</small>
        : full
        ? <small className="is-full">名额已满</small>
        : club.pendingJoins
          ? <small>{club.pendingJoins} 人待社长审核</small>
          : <small>暂无待审核报名</small>}
    </div>
  );
}

function ActivityCell({ club }) {
  if (!club.activities) {
    return <div className="activity-cell"><span className="activity-empty">暂无活动记录</span></div>;
  }

  return (
    <div className="activity-cell">
      <div><strong>{club.activities}</strong><span> 场</span></div>
      <small>最近：{club.lastActivityAt}</small>
    </div>
  );
}

function ClubActions({ club, open, onToggle, onPlaceholder, onView, onContinue, onEnd, onRestore }) {
  const canContinue = club.term === currentTerm && club.status === "进行中" && termOptions.includes(nextTermFor(club.term));
  const menuActions = club.status === "进行中"
    ? [
      ...(canContinue ? [{ label: "延续到下学期" }] : []),
      { label: "提前结束" },
    ]
    : club.status === "已提前结束"
      ? [
        ...(club.term === currentTerm ? [{ label: "恢复运行" }] : []),
        { label: "删除社团", danger: true, message: "这里将先检查关联数据，再确认删除已结束的社团，本轮暂未展开" },
      ]
      : [
        { label: "删除社团", danger: true, message: "这里将先检查关联数据，再确认删除已结束的社团，本轮暂未展开" },
      ];

  return (
    <div className="club-row-actions" data-proto-id={`clubs-row-actions-${club.id}`}>
      <button type="button" className="club-view-action" data-proto-id={`clubs-view-${club.id}`} onClick={() => onView(club)}>查看</button>
      <div className="row-more-wrap">
        <button type="button" className="row-more-button" data-proto-id={`clubs-more-${club.id}`} aria-label={`${club.name}更多操作`} aria-expanded={open} onClick={onToggle}>
          <AppIcon icon={DotsThreeVertical} size={18} weight="bold" />
        </button>
        {open ? <div className="row-more-menu">
          {menuActions.map((action) => (
            <button key={action.label} type="button" className={action.danger ? "danger" : ""} onClick={() => { onToggle(); if (action.label === "延续到下学期") onContinue?.(club); else if (action.label === "提前结束") onEnd?.(club); else if (action.label === "恢复运行") onRestore?.(club); else onPlaceholder(action.message); }}>{action.label}</button>
          ))}
        </div> : null}
      </div>
    </div>
  );
}

function TermWindows({ term }) {
  const windows = termWindows[term] ?? [];
  return (
    <section className="term-windows" data-proto-id="clubs-term-windows" aria-label={`${term}时间安排`}>
      <div className="term-window-items">
        {windows.map((item) => (
          <div className="term-window-item" key={item.label}>
            <span className="term-window-label">{item.label}</span>
            <StatusBadge value={item.state} />
            <span className="term-window-period">{item.period}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const clubDetailTabs = ["社团信息", "成员管理", "活动一览", "作品与荣誉", "成员学分", "社团历程"];
const clubDetailTabProtoIds = {
  "社团信息": "club-detail-tab-info",
  "成员管理": "club-detail-tab-members",
  "活动一览": "club-detail-tab-activities",
  "作品与荣誉": "club-detail-tab-showcase",
  "成员学分": "club-detail-tab-credits",
  "社团历程": "club-detail-tab-history",
};

const memberCandidateSeed = [
  { id: "candidate-1", name: "周子墨", grade: "七年级", className: "七年级（4）班", note: "线下确认加入" },
  { id: "candidate-2", name: "陈雨桐", grade: "八年级", className: "八年级（1）班", note: "线下确认加入" },
  { id: "candidate-3", name: "何思远", grade: "七年级", className: "七年级（6）班", note: "线下确认加入" },
];

const removalBasisOptions = ["学生本人提出", "社长提出且已线下沟通", "学籍或参与资格变化", "名单纠错", "其他学校管理原因"];

function ActivityDetailDrawer({ activity, onClose }) {
  const [activeDetailTab, setActiveDetailTab] = useState("活动信息");
  if (!activity) return null;
  const record = activity.record ?? (activity.material ? {
    author: "学生社长",
    submittedAt: activity.material.submittedAt,
    content: activity.material.summary,
    attachments: activity.material.attachments,
  } : null);
  const attendance = activity.attendance;
  const attendanceSummary = attendance ? `${attendance.attended} 人已签到${attendance.late ? `，${attendance.late} 人迟到` : ""}${attendance.absent ? `，${attendance.absent} 人未签到` : ""}` : "未启用";
  const recordSummary = record ? "已填写" : activity.recordRequired ? "待填写" : "不要求填写";
  const closeDrawer = () => {
    setActiveDetailTab("活动信息");
    onClose();
  };
  const tabs = ["活动信息", "考勤", "活动记录"];

  return <div className="activity-detail-mask" role="presentation">
    <section className="activity-detail-drawer" role="dialog" aria-modal="true" aria-label={`活动详情：${activity.name}`}>
      <header className="activity-detail-header">
        <div>
          <span className="activity-detail-eyebrow">活动详情</span>
          <div className="activity-detail-title-row"><h2>{activity.name}</h2><StatusBadge value={activity.state} /></div>
        </div>
        <button type="button" aria-label="关闭活动详情" onClick={closeDrawer}><AppIcon icon={X} size={20} weight="bold" /></button>
      </header>
      <nav className="activity-detail-tabs" role="tablist" aria-label="活动详情">
        {tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeDetailTab === tab} className={activeDetailTab === tab ? "active" : ""} onClick={() => setActiveDetailTab(tab)}>{tab}{tab === "精彩瞬间" ? <span>{highlightItems.length}</span> : null}</button>)}
      </nav>
      <div className="activity-detail-body">
        {activeDetailTab === "活动信息" ? <section className="activity-detail-section activity-information-section">
          <h3>活动信息</h3>
          <div className="activity-info-grid">
            <div className="wide"><span>活动名称</span><strong>{activity.name}</strong></div>
            <div><span>活动时间</span><strong>{activity.time}</strong></div>
            <div><span>本场地点</span><strong>{activity.venue}</strong></div>
            <div className="wide activity-description-field"><span>活动说明</span><strong>{activity.description || "暂无活动说明"}</strong></div>
            <div className="wide activity-attachments-field"><span>活动附件</span>{activity.attachments?.length ? <ul className="activity-file-list">{activity.attachments.map((item) => <li key={item}>{item}</li>)}</ul> : <strong className="activity-muted-value">暂无附件</strong>}</div>
          </div>
          <p className="activity-publish-record">发布记录：{activity.publisher}（当时学生社长）· {activity.publishedAt ?? "提交时间待补充"}</p>
          <div className="activity-summary-facts" aria-label="活动情况">
            <div><span>考勤</span><strong>{attendanceSummary}</strong></div>
            <div><span>活动记录</span><strong>{recordSummary}</strong></div>
          </div>
        </section> : null}

        {activeDetailTab === "考勤" ? <section className="activity-detail-section">
          <div className="activity-detail-section-head"><div><h3>考勤</h3><span>{attendance ? "已启用" : "未启用"}</span></div></div>
          {attendance ? <>
            <div className="activity-attendance-summary"><div><strong>{attendance.attended}<em> / {attendance.total} 人</em></strong><span>已签到</span></div><div><strong>{attendance.late}</strong><span>迟到</span></div><div><strong>{attendance.absent}</strong><span>未签到</span></div><small>最后更新：{attendance.updatedAt}</small></div>
            <div className="activity-attendance-records"><table><thead><tr><th>学生</th><th>考勤结果</th></tr></thead><tbody>{attendance.records?.length ? attendance.records.map((item) => <tr key={item.student}><td><PersonCell name={item.student} detail={item.className} /></td><td>{item.result}</td></tr>) : <tr><td colSpan="2">暂无逐人考勤明细</td></tr>}</tbody></table></div>
          </> : <div className="activity-empty-panel">本场活动未启用考勤，暂无考勤明细。</div>}
        </section> : null}

        {activeDetailTab === "活动记录" ? <section className="activity-detail-section">
          <div className="activity-detail-section-head"><div><h3>活动记录</h3><span>{record ? "已填写" : activity.recordRequired ? "待填写" : "不要求填写"}</span></div></div>
          {record ? <div className="activity-record-detail">
            <div className="activity-record-meta"><div><span>填写人</span><strong>{record.author}</strong></div><div><span>填写时间</span><strong>{record.submittedAt}</strong></div></div>
            <p>{record.content}</p>
            {record.photos?.length ? <div className="activity-record-photos"><span>现场照片</span><div className="activity-photo-grid">{record.photos.map((photo) => <img key={photo.src} src={photo.src} alt={photo.alt} />)}</div></div> : null}
            <div className="activity-record-files"><span>记录附件</span>{record.attachments?.length ? <ul className="activity-file-list">{record.attachments.map((item) => <li key={item}>{item}</li>)}</ul> : <strong className="activity-muted-value">暂无附件</strong>}</div>
          </div> : <div className="activity-empty-panel">{activity.recordRequired ? "本场活动尚未填写活动记录。" : "本场活动不要求填写活动记录。"}</div>}
        </section> : null}

      </div>
      <footer><button type="button" className="primary-action" onClick={closeDrawer}>关闭</button></footer>
    </section>
  </div>;
}

function MomentPreviewDialog({ moment, onClose }) {
  if (!moment) return null;
  const image = moment.images?.[0];
  return <div className="moment-preview-mask" role="presentation" onClick={onClose}>
    <section className="moment-preview-dialog" role="dialog" aria-modal="true" aria-label={`查看活动瞬间：${moment.title}`} onClick={(event) => event.stopPropagation()}>
      <div className="moment-preview-media">{image ? <img src={image.src} alt={image.alt ?? moment.title} /> : <span>该瞬间未上传图片</span>}</div>
      <div className="moment-preview-side"><button type="button" className="moment-preview-close" aria-label="关闭" onClick={onClose}><AppIcon icon={X} size={16} weight="bold" /></button><div className="moment-preview-info"><span>{moment.activityName}</span><div className="moment-preview-author"><i>{moment.author.slice(0, 1)}</i><b>{moment.author}</b><em className={moment.role === "学生社长" ? "" : "is-member"}>{moment.role}</em><time>{moment.time}</time></div><p>{moment.text || "未填写文字说明"}</p>{moment.media ? <small>{moment.media}</small> : null}</div><div className="moment-preview-foot">教师仅查看成员在活动内分享的内容</div></div>
    </section>
  </div>;
}

function ShowcasePreviewDrawer({ item, onClose }) {
  if (!item) return null;
  const isWork = item.type === "work";
  const author = item.creator ?? item.authors;
  return <div className="content-preview-mask" role="presentation" onClick={onClose}>
    <section className="content-preview-drawer" role="dialog" aria-modal="true" aria-label={`查看${isWork ? "作品" : "荣誉"}`} onClick={(event) => event.stopPropagation()}>
      <header><div><span>{isWork ? "作品集锦" : "荣誉时刻"}</span><h2>{item.title}</h2></div><button type="button" aria-label="关闭" onClick={onClose}><AppIcon icon={X} size={18} weight="bold" /></button></header>
      <div className="content-preview-body">{(item.preview || item.image) ? <img src={item.preview || item.image} alt={item.title} /> : <div className="content-preview-file"><AppIcon icon={isWork ? FileText : Medal} size={38} weight="duotone" /><span>{isWork ? item.fileType ?? "文件" : "暂无荣誉图片"}</span></div>}<dl>{isWork ? <><div><dt>创作成员</dt><dd>{author || "未填写"}</dd></div><div><dt>上传时间</dt><dd>{item.uploadedAt}</dd></div></> : <><div><dt>获得时间</dt><dd>{item.receivedAt || "未填写"}</dd></div><div><dt>上传时间</dt><dd>{item.uploadedAt}</dd></div></>}</dl>{item.description ? <p>{item.description}</p> : null}</div>
      <footer><span>由学生社长上传维护</span><button type="button" className="primary-action" onClick={onClose}>关闭</button></footer>
    </section>
  </div>;
}

function ActivityLedger({ activities, onSelectActivity }) {
  const [view, setView] = useState("list");
  const [query, setQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState(allOption);
  const [momentPreview, setMomentPreview] = useState(null);
  const moments = useMemo(() => activities.flatMap((activity) => (activity.highlights?.items ?? activity.dynamics ?? []).map((item, index) => ({ ...item, id: `${activity.name}-${item.author}-${item.time}-${index}`, activityName: activity.name }))), [activities]);
  const activityNames = activities.filter((activity) => (activity.highlights?.items ?? activity.dynamics ?? []).length).map((activity) => activity.name);
  const filteredActivities = activities.filter((activity) => activity.name.includes(query.trim()));
  const visibleMoments = moments.filter((moment) => activityFilter === allOption || moment.activityName === activityFilter);
  const groupedMoments = useMemo(() => visibleMoments.reduce((groups, moment) => {
    const month = (moment.time?.match(/(\d{1,2})月/) || moment.time?.match(/(\d{1,2})[-/]/) || ["", "未标注"])[1];
    const label = month === "未标注" ? month : `${month} 月`;
    (groups[label] ??= []).push(moment);
    return groups;
  }, {}), [visibleMoments]);
  const openMoments = (name = allOption) => { setActivityFilter(name); setView("moments"); };

  if (view === "moments") return <section className="club-detail-section activity-ledger-section" data-proto-id="club-activities-moments-list">
    <div className="ledger-subhead"><button type="button" className="ledger-back" onClick={() => setView("list")}>‹ 返回活动列表</button><div className="ledger-subtitle"><h3>活动瞬间</h3><span>共 {visibleMoments.length} 条 · 覆盖 {new Set(visibleMoments.map((item) => item.activityName)).size} 场活动</span></div><select value={activityFilter} onChange={(event) => setActivityFilter(event.target.value)} aria-label="按活动筛选精彩瞬间"><option value={allOption}>全部活动</option>{activityNames.map((name) => <option key={name} value={name}>{name}（{moments.filter((item) => item.activityName === name).length} 条）</option>)}</select></div>
    <div className="ledger-toolbar"><span className="ledger-hint">按活动发生时间倒序，点击卡片查看内容</span></div>
    {Object.keys(groupedMoments).length ? <div>{Object.entries(groupedMoments).map(([month, items]) => <section className="moment-group" key={month}><h4>{month}<em>{items.length} 条</em></h4><div className="moment-grid">{items.map((moment) => <article className="moment-card" key={moment.id}><button type="button" className="moment-card-media" onClick={() => setMomentPreview(moment)}>{moment.images?.[0] ? <img src={moment.images[0].src} alt={moment.images[0].alt ?? moment.text ?? "活动瞬间"} /> : <span>无图片</span>}<b>{moment.activityName}</b><i>{moment.images?.length ?? 0} 张</i></button><div className="moment-card-foot"><span>{moment.author}</span><time>{moment.time}</time><button type="button" onClick={() => setMomentPreview(moment)}>查看</button></div></article>)}</div></section>)}</div> : <EmptyState title="暂无活动瞬间" />}
    <MomentPreviewDialog moment={momentPreview} onClose={() => setMomentPreview(null)} />
  </section>;

  return <section className="club-detail-section activity-ledger-section" data-proto-id="club-activities-list">
    <div className="ledger-toolbar activity-ledger-top"><span className="ledger-hint">本学期已开展 {activities.length} 场 · 活动瞬间共 {moments.length} 条</span>{moments.length ? <button type="button" className="ledger-enter" data-proto-id="club-activities-moments" onClick={() => openMoments()}>查看活动瞬间 <em>{moments.length}</em><AppIcon icon={CaretRight} size={12} /></button> : null}</div>
    <div className="ledger-toolbar"><span className="ledger-hint">共 {activities.length} 场活动 · 按活动时间倒序</span><SearchField value={query} onChange={setQuery} placeholder="搜索活动名称" /></div>
    {filteredActivities.length ? <div className="detail-table-wrap"><table className="detail-table ledger-table"><thead><tr><th>活动名称</th><th>活动时间</th><th>场地</th><th>出勤</th><th>记录填报</th><th>活动瞬间</th><th className="action-cell">操作</th></tr></thead><tbody>{filteredActivities.map((activity) => { const attendance = activity.attendance; const momentCount = (activity.highlights?.items ?? activity.dynamics ?? []).length; const rate = attendance?.total ? Math.round(attendance.attended / attendance.total * 100) : 0; const recordText = activity.record ? "已填写" : activity.recordRequired ? "待填写" : "不要求填写"; return <tr key={activity.name}><td className="main-cell">{activity.name}<small className="activity-state-inline">{activity.state}</small></td><td className="ledger-time">{activity.time}</td><td>{activity.venue}</td><td>{attendance ? <div><span className={`rate-bar ${rate < 80 ? "is-low" : ""}`}><i style={{ width: `${rate}%` }} /></span><small className="rate-text">应到 {attendance.total} · 实到 {attendance.attended}</small></div> : <span className="state-tag is-empty">未启用</span>}</td><td><span className={`state-tag ${recordText === "已填写" ? "is-ok" : recordText === "待填写" ? "is-warn" : "is-empty"}`}>{recordText}</span></td><td>{momentCount ? <button type="button" className="link-action" onClick={() => openMoments(activity.name)}>{momentCount} 条</button> : <span className="state-tag is-empty">暂无</span>}</td><td className="action-cell"><button type="button" className="club-view-action" onClick={() => onSelectActivity(activity)}>查看详情</button></td></tr>; })}</tbody></table></div> : <EmptyState title="未找到匹配的活动" />}
    <p className="ledger-footnote">活动时间与场地取活动发布时设置的信息；记录填报状态以社长提交的活动记录为准。</p>
  </section>;
}

export function ClubDetailPage({ club, initialTab = "社团信息", onTabChange, onPlaceholder, onContinue, onRestore }) {
  const [tab, setTab] = useState(initialTab);
  const [showcaseType, setShowcaseType] = useState("works");
  const detail = clubDetailSeed[club.id] ?? {
    introduction: "该社团的介绍将按成立时的社团信息保留。",
    recruitment: "该社团的招募说明将按成立时的社团信息保留。",
    venueNeed: "申报时的活动场地需求可在此查看，不代表活动实际场地。",
    members: [{ name: club.leader, grade: club.grade, className: club.grade, role: "学生社长", source: "社团申报通过", joinedAt: "—" }],
    activities: [],
    showcase: { works: [], honors: [] },
    history: [{ title: "本学期社团成立", detail: "社团申报审核通过，形成当前学期社团记录", time: "本学期" }],
  };
  const showcase = detail.showcase ?? { works: [], honors: [] };
  const works = showcase.works ?? [];
  const honors = showcase.honors ?? [];
  const [members, setMembers] = useState(detail.members);
  const [memberCount, setMemberCount] = useState(club.members);
  const [capacity, setCapacity] = useState(club.capacity);
  const [capacityDraft, setCapacityDraft] = useState(String(club.capacity));
  const proposedVenue = detail.proposedVenue ?? (detail.venueType === "拟用场地" ? detail.venueNeed ?? "" : "");
  const venueDescription = detail.venueDescription ?? (detail.venueType === "协助需求" ? detail.venueNeed ?? "" : "");
  const [venueValue, setVenueValue] = useState(detail.venueArrangement ?? detail.venueNeed ?? "");
  const [venueDraft, setVenueDraft] = useState(detail.venueArrangement ?? detail.venueNeed ?? "");
  const [venueArrangementSource, setVenueArrangementSource] = useState(detail.venueArrangementSource ?? "填写说明");
  const [venueMode, setVenueMode] = useState((detail.venueArrangementSource ?? "填写说明") === "场地库" ? "library" : "text");
  const [venueReason, setVenueReason] = useState("");
  const [venueChanges, setVenueChanges] = useState([]);
  const [settingDialog, setSettingDialog] = useState(null);
  const [memberChanges, setMemberChanges] = useState(detail.memberChanges ?? [
    { action: "添加成员", student: "李沐阳", proposer: "教师确认", basis: "线下已确认", operator: "张可可", time: "9月18日 15:26", outcome: "已成为正式成员" },
  ]);
  const [removedMembers, setRemovedMembers] = useState(detail.removedMembers ?? []);
  const [memberQuery, setMemberQuery] = useState("");
  const [showMemberChanges, setShowMemberChanges] = useState(false);
  const [memberHistoryView, setMemberHistoryView] = useState("changes");
  const [memberOperation, setMemberOperation] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showcaseQuery, setShowcaseQuery] = useState("");
  const [showcasePreview, setShowcasePreview] = useState(null);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [removalBasis, setRemovalBasis] = useState(removalBasisOptions[0]);
  const [removalReason, setRemovalReason] = useState("");
  useEffect(() => setTab(initialTab), [initialTab]);
  const lifecycleHistory = [...(club.lifecycleHistory ?? [])].reverse().map((item) => ({
    title: item.action,
    detail: `${item.actor}处理 · 原因：${item.reason}`,
    time: item.time,
  }));
  const clubHistory = [...lifecycleHistory, ...(detail.history ?? [])];
  const canManageMembers = club.status === "进行中";
  const availableSeats = capacity - memberCount;
  const selectedCandidates = memberCandidateSeed.filter((candidate) => selectedCandidateIds.includes(candidate.id));
  const visibleMembers = useMemo(() => members.filter((member) => (
    member.name.includes(memberQuery.trim()) || member.className?.includes(memberQuery.trim()) || member.grade.includes(memberQuery.trim()) || member.role.includes(memberQuery.trim())
  )), [memberQuery, members]);
  const memberCredits = useMemo(() => {
    const recordFor = (member) => detail.credits?.find((record) => record.student === member.name);
    const activeRows = members.map((member) => ({
      ...member,
      memberRelation: "当前成员",
      ...(recordFor(member) ?? { status: "待提交", appliedHours: "—", leaderHours: "—", teacherHours: "—", credit: "—", submittedAt: "—", processedAt: "—" }),
    }));
    const removedRows = removedMembers.map((member) => {
      const record = recordFor(member);
      return record ? { ...member, memberRelation: "已移出", ...record } : null;
    }).filter(Boolean);
    return [...activeRows, ...removedRows];
  }, [detail.credits, members, removedMembers]);
  const creditPendingSubmissionCount = memberCredits.filter((record) => record.status === "待提交").length;
  const creditReviewingCount = memberCredits.filter((record) => record.status.includes("审核中")).length;
  const creditPassedCount = memberCredits.filter((record) => record.status === "已通过").length;
  const normalizedShowcaseQuery = showcaseQuery.trim().toLowerCase();
  const visibleWorks = works.filter((work) => !normalizedShowcaseQuery || `${work.title}${work.creator ?? work.authors ?? ""}`.toLowerCase().includes(normalizedShowcaseQuery));
  const visibleHonors = honors.filter((honor) => !normalizedShowcaseQuery || `${honor.title}`.toLowerCase().includes(normalizedShowcaseQuery));

  const closeMemberOperation = () => {
    setMemberOperation(null);
    setSelectedCandidateIds([]);
    setRemovalBasis(removalBasisOptions[0]);
    setRemovalReason("");
  };
  const saveCapacity = () => {
    const nextCapacity = Number(capacityDraft);
    if (!Number.isInteger(nextCapacity) || nextCapacity <= capacity) return;
    if (nextCapacity > capacity) {
      setCapacity(nextCapacity);
      onPlaceholder(`名额已调整为 ${nextCapacity} 人`);
    }
    setSettingDialog(null);
  };
  const saveVenue = () => {
    const nextVenue = venueDraft.trim();
    if (!nextVenue || !venueReason.trim()) return;
    const nextSource = venueMode === "library" ? "场地库" : "填写说明";
    if (nextVenue !== venueValue || nextSource !== venueArrangementSource) {
      setVenueChanges((items) => [{ before: venueValue || "未安排", after: `${nextVenue}（${nextSource}）`, reason: venueReason.trim(), operator: currentReviewerName, time: approvalTime() }, ...items]);
      setVenueValue(nextVenue);
      setVenueArrangementSource(nextSource);
      onPlaceholder("场地安排已更新");
    }
    setVenueReason("");
    setSettingDialog(null);
  };
  const addSelectedMembers = () => {
    if (!selectedCandidates.length || selectedCandidates.length > availableSeats) return;
    const joinedAt = approvalTime();
    const addedMembers = selectedCandidates.map((candidate) => ({ name: candidate.name, grade: candidate.grade, className: candidate.className, role: "团员", source: "教师添加", joinedAt }));
    setMembers((items) => [...items, ...addedMembers]);
    setMemberCount((count) => count + addedMembers.length);
    setMemberChanges((items) => [
      ...addedMembers.map((member) => ({ action: "添加成员", student: member.name, proposer: "教师确认", basis: "线下已确认", operator: currentReviewerName, time: approvalTime(), outcome: "已成为正式成员" })),
      ...items,
    ]);
    onPlaceholder(`已添加 ${addedMembers.length} 名成员；学生与学生社长将收到成员变更提醒`);
    closeMemberOperation();
  };
  const removeMember = () => {
    const member = memberOperation?.member;
    if (!member || !removalReason.trim()) return;
    const processedAt = approvalTime();
    setMembers((items) => items.filter((item) => item.name !== member.name));
    setMemberCount((count) => count - 1);
    setRemovedMembers((items) => [{ ...member, basis: removalBasis, reason: removalReason.trim(), operator: currentReviewerName, removedAt: processedAt }, ...items]);
    setMemberChanges((items) => [{ action: "移出成员", student: member.name, proposer: removalBasis.startsWith("社长") ? "社长提出" : removalBasis.startsWith("学生") ? "学生本人提出" : "教师处理", basis: removalBasis, reason: removalReason.trim(), operator: currentReviewerName, time: processedAt, outcome: "已终止本学期有效成员关系" }, ...items]);
    onPlaceholder(`已移出 ${member.name}；学生与学生社长将收到提醒，既有参与记录仍保留`);
    closeMemberOperation();
  };
  const headerAction = club.status === "进行中"
    ? { label: "提前结束", message: "这里将填写结束原因，并确认提前结束本学期社团，本轮暂未展开" }
    : club.status === "已提前结束"
      ? club.term === currentTerm ? { label: "恢复运行", action: "restore" } : null
      : { label: "延续到下学期", action: "continue" };

  const selectDetailTab = (nextTab) => {
    setTab(nextTab);
    onTabChange?.(nextTab);
  };

  return <section className="club-detail-page" data-proto-id="club-detail-page" aria-label={`${club.name}社团详情`}>
      <header className="club-detail-page-context">
        <div className="club-detail-title">
          <div className="club-detail-eyebrow"><span>{club.term}</span><i /> <span>{club.category}</span></div>
          <div className="club-detail-heading">{club.origin === "从上学期延续" ? <span className="source-tag">上学期延续</span> : null}<StatusBadge value={club.status} /></div>
          <p>学生社长：{club.leader} · {club.grade} · {club.className ?? "班级待补充"} · {club.phone}</p>
        </div>
        {headerAction ? <div className="club-detail-header-actions">
          <button type="button" className="secondary-action" onClick={() => headerAction.action === "continue" ? onContinue?.(club) : headerAction.action === "restore" ? onRestore?.(club) : onPlaceholder(headerAction.message)}>{headerAction.label}</button>
        </div> : null}
      </header>
      <div className="club-detail-tabs" role="tablist" aria-label="社团详情导航">
        {clubDetailTabs.map((item) => <button key={item} type="button" role="tab" data-proto-id={clubDetailTabProtoIds[item]} data-proto-hotspot="true" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => selectDetailTab(item)}>{item}</button>)}
      </div>
      <div className="club-detail-body">
        {tab === "社团信息" ? <>
          <section className="club-detail-section club-overview-section" data-proto-id="club-info-overview">
            <div className="club-detail-section-head"><h3>当前情况</h3></div>
            <div className="club-overview-stats">
              <div className="overview-members"><span>成员与名额</span><strong>{memberCount} <em>/ {capacity} 人</em></strong>{canManageMembers ? <button type="button" className="club-view-action" onClick={() => setSettingDialog("capacity")}>调整名额</button> : null}</div>
              <div><span>活动记录</span><strong>{club.activities} <em>场</em></strong><small>{club.activities ? `最近记录：${club.lastActivityAt}` : "暂无活动记录"}</small></div>
              <div><span>入团申请</span><strong>{club.pendingJoins || 0} <em>人待社长审核</em></strong><small>{club.status === "进行中" ? "日常审核由社长处理" : "本学期不再处理入团申请"}</small></div>
            </div>
          </section>
          <section className="club-detail-section club-basics-section" data-proto-id="club-info-basics">
            <div className="club-detail-section-head"><h3>基本信息</h3><button type="button" className="club-view-action" data-proto-id="club-info-application-snapshot" onClick={() => setSettingDialog("application")}>查看本学期申报资料</button></div>
            <div className="club-detail-info-grid">
              <div><span>社团类别</span><strong>{club.category}</strong></div>
              <div><span>社团来源</span><strong>{club.origin}</strong></div>
              <div><span>学生社长</span><strong>{club.leader} · {club.grade}</strong></div>
              <div><span>联系电话</span><strong>{club.phone}</strong></div>
              <div className="wide"><span>社团介绍</span><p>{detail.introduction}</p></div>
              <div className="wide club-venue-field" data-proto-id="club-info-venue"><span>活动场地</span><div className="club-venue-details"><div className="club-venue-source"><div className="club-venue-owner"><strong>学生申报</strong><small>原始内容</small></div><div className="club-venue-source-values">{proposedVenue ? <div><span>拟用场地</span><strong>{proposedVenue}</strong></div> : null}{venueDescription ? <div><span>场地说明</span><strong>{venueDescription}</strong></div> : null}{!proposedVenue && !venueDescription ? <div><span>场地信息</span><strong className="activity-muted-value">未填写</strong></div> : null}</div></div><div className="club-venue-arrangement"><div className="club-venue-owner"><strong>教师日常安排</strong><small>可调整</small></div><div className="club-venue-arrangement-value"><strong>{venueValue || "暂未安排"}</strong><button type="button" className="club-view-action" onClick={() => { setVenueDraft(venueValue); setVenueMode(venueArrangementSource === "场地库" ? "library" : "text"); setVenueReason(""); setSettingDialog("venue"); }}>{venueValue ? "调整场地" : "安排场地"}</button></div></div></div><small>实际场地以活动记录为准</small></div>
            </div>
          </section>
        </> : null}

        {tab === "成员管理" ? <section className="club-detail-section member-list-section" data-proto-id="member-management" data-proto-reveal-by='[data-proto-id="club-detail-tab-members"]' data-proto-reveal-label="切换到成员管理">
          <div className="member-list-summary member-list-summary-with-action" data-proto-id="member-management-summary" aria-label="成员概况"><div><span>当前 <strong>{memberCount}</strong> 人</span><i aria-hidden="true" /><span>{club.pendingJoins || 0} 人待社长审核</span></div><button type="button" className="club-view-action member-history-action" data-proto-id="member-management-changes" onClick={() => { setMemberHistoryView("changes"); setShowMemberChanges(true); }}>查看变更记录</button></div>
          <div className="member-list-toolbar"><div className="member-list-tools"><SearchField protoId="member-management-search" value={memberQuery} onChange={setMemberQuery} placeholder="搜索学生、年级、班级或角色" /></div>{canManageMembers ? <div className="detail-inline-actions member-list-actions"><button type="button" className="secondary-action" data-proto-id="member-management-import" disabled={availableSeats <= 0} onClick={() => setMemberOperation({ type: "batch" })}>导入成员</button><button type="button" className="primary-action" data-proto-id="member-management-add" disabled={availableSeats <= 0} onClick={() => setMemberOperation({ type: "add" })}>添加成员</button></div> : null}</div>
          <div className="detail-table-wrap member-directory-table-wrap" data-proto-id="member-management-list"><table className="detail-table member-directory-table"><thead><tr><th>学生</th><th>年级</th><th>班级</th><th>身份</th><th>成员来源</th><th>加入时间</th><th className="action-cell">操作</th></tr></thead><tbody>{visibleMembers.length ? visibleMembers.map((member) => <tr key={`${member.name}-${member.role}`}><td className="member-name-cell"><strong>{member.name}</strong></td><td>{member.grade}</td><td><MemberClassCell member={member} /></td><td>{member.role}</td><td>{member.source}</td><td className="member-joined-at">{member.joinedAt ?? "—"}</td><td className="action-cell">{canManageMembers && member.role !== "学生社长" ? <button type="button" className="club-view-action" onClick={() => setMemberOperation({ type: "remove", member })}>移出成员</button> : <span className="muted-value">—</span>}</td></tr>) : <tr><td colSpan="7"><div className="member-list-empty">未找到匹配的成员</div></td></tr>}</tbody></table></div>
        </section> : null}

        {tab === "活动一览" ? <ActivityLedger activities={detail.activities} onSelectActivity={setSelectedActivity} /> : null}

        {tab === "作品与荣誉" ? <section className="club-detail-section achievement-section" data-proto-id="club-showcase-list">
          <div className="achievement-toolbar" data-proto-id="club-showcase-filter"><div className="filter-chips" role="tablist" aria-label="按成果类型切换"><button type="button" role="tab" aria-selected={showcaseType === "works"} className={showcaseType === "works" ? "active" : ""} onClick={() => setShowcaseType("works")}>作品 <em>{works.length}</em></button><button type="button" role="tab" aria-selected={showcaseType === "honors"} className={showcaseType === "honors" ? "active" : ""} onClick={() => setShowcaseType("honors")}>荣誉 <em>{honors.length}</em></button></div><SearchField value={showcaseQuery} onChange={setShowcaseQuery} placeholder={showcaseType === "works" ? "搜索作品名称或创作成员" : "搜索荣誉名称"} /></div>
          {showcaseType === "works" ? (visibleWorks.length ? <div className="achievement-card-grid">{visibleWorks.map((work) => <article className="achievement-card" role="button" tabIndex={0} key={`${work.title}-${work.uploadedAt}`} onClick={() => setShowcasePreview({ ...work, type: "work" })} onKeyDown={(event) => event.key === "Enter" && setShowcasePreview({ ...work, type: "work" })}><div className="achievement-card-cover">{work.kind === "image" ? <img src={work.preview} alt={work.title} /> : null}{work.kind === "video" ? <><img src={work.preview} alt={`${work.title}视频封面`} /><span className="achievement-play"><AppIcon icon={PlayCircle} size={18} weight="fill" />{work.duration}</span></> : null}{(!work.kind || work.kind === "file") ? <span className="achievement-file-cover"><AppIcon icon={FileText} size={34} weight="duotone" />{work.fileType ?? "文件"}</span> : null}</div><div className="achievement-card-body"><h4>{work.title}</h4>{(work.creator ?? work.authors) ? <p>创作成员：{work.creator ?? work.authors}</p> : null}{work.description ? <p>{work.description}</p> : null}<div className="achievement-card-foot"><span>社长上传</span><time>{work.uploadedAt}</time></div></div></article>)}</div> : <EmptyState title={works.length ? "没有匹配的作品" : "暂未上传作品"} />) : null}
          {showcaseType === "honors" ? (visibleHonors.length ? <div className="achievement-card-grid">{visibleHonors.map((honor) => <article className="achievement-card" role="button" tabIndex={0} key={`${honor.title}-${honor.receivedAt}`} onClick={() => setShowcasePreview({ ...honor, type: "honor" })} onKeyDown={(event) => event.key === "Enter" && setShowcasePreview({ ...honor, type: "honor" })}><div className="achievement-card-cover honor">{honor.image ? <img src={honor.image} alt={honor.title} /> : <span className="achievement-honor-cover"><AppIcon icon={Medal} size={38} weight="duotone" /></span>}</div><div className="achievement-card-body"><h4>{honor.title}</h4>{honor.receivedAt ? <p>获得时间：{honor.receivedAt}</p> : null}{honor.description ? <p>{honor.description}</p> : null}<div className="achievement-card-foot"><span>社长上传</span><time>{honor.uploadedAt}</time></div></div></article>)}</div> : <EmptyState title={honors.length ? "没有匹配的荣誉" : "暂未上传荣誉"} />) : null}
        </section> : null}

        {tab === "成员学分" ? <section className="club-detail-section member-credit-section" data-proto-id="member-credits" data-proto-reveal-by='[data-proto-id="club-detail-tab-credits"]' data-proto-reveal-label="切换到成员学分">
          <div className="credit-list-summary credit-list-summary-with-action" data-proto-id="member-credits-summary" aria-label="成员学分概况"><div><span>当前 <strong>{memberCount}</strong> 人</span><i aria-hidden="true" /><span>待提交 <strong>{creditPendingSubmissionCount}</strong> 人</span><i aria-hidden="true" /><span>审核中 <strong>{creditReviewingCount}</strong> 人</span><i aria-hidden="true" /><span>已通过 <strong>{creditPassedCount}</strong> 人</span></div></div>
          <div className="detail-table-wrap member-credit-table-wrap" data-proto-id="member-credits-list"><table className="detail-table member-credit-table"><colgroup><col className="credit-col-student" /><col className="credit-col-role" /><col className="credit-col-status" /><col className="credit-col-submitted" /><col className="credit-col-hours" /><col className="credit-col-hours" /><col className="credit-col-hours" /><col className="credit-col-credit" /><col className="credit-col-processed" /></colgroup><thead><tr><th>学生</th><th>身份</th><th>审核状态</th><th>提交时间</th><th>申报学时</th><th>社长核定</th><th>教师核定</th><th>计入学分</th><th>处理时间</th></tr></thead><tbody>{memberCredits.map((record) => <tr key={`${record.name}-${record.role}-${record.memberRelation}`}><td><div className="member-credit-student"><PersonCell name={record.name} detail={record.className ?? record.grade} />{record.memberRelation === "已移出" ? <span>已移出</span> : null}</div></td><td>{record.role}</td><td><StatusBadge value={record.status} /></td><td className="credit-time-cell">{record.submittedAt}</td><td>{record.appliedHours ?? "—"}</td><td>{record.leaderHours ?? "—"}</td><td>{record.teacherHours ?? "—"}</td><td>{record.credit}</td><td className="credit-processed-at">{record.processedAt}</td></tr>)}</tbody></table></div>
        </section> : null}

        {tab === "社团历程" ? <section className="club-detail-section club-history-section" data-proto-id="club-history" data-proto-reveal-by='[data-proto-id="club-detail-tab-history"]' data-proto-reveal-label="切换到社团历程">
          <ol className="club-history-list" data-proto-id="club-history-list">{clubHistory.map((item) => <li key={`${item.title}-${item.time}`}><span aria-hidden="true" /><div><strong>{item.title}</strong><p>{item.detail}</p><time>{item.time}</time></div></li>)}</ol>
        </section> : null}
      </div>
      {settingDialog === "capacity" ? <div className="member-dialog-mask" role="presentation"><section className="member-dialog" role="dialog" aria-modal="true" aria-label="调整名额"><header><div><h3>调整名额</h3></div><button type="button" aria-label="关闭" onClick={() => { setCapacityDraft(String(capacity)); setSettingDialog(null); }}><AppIcon icon={X} size={18} weight="bold" /></button></header><div className="member-dialog-body"><label className="member-dialog-field">调整后名额<input aria-label="调整后名额" type="number" min={capacity + 1} value={capacityDraft} onChange={(event) => setCapacityDraft(event.target.value)} /></label></div><footer><button type="button" className="text-action" onClick={() => { setCapacityDraft(String(capacity)); setSettingDialog(null); }}>取消</button><button type="button" className="primary-action" disabled={!Number.isInteger(Number(capacityDraft)) || Number(capacityDraft) <= capacity} onClick={saveCapacity}>保存</button></footer></section></div> : null}
      {settingDialog === "venue" ? <div className="member-dialog-mask" role="presentation"><section className="member-dialog" role="dialog" aria-modal="true" aria-label="调整日常场地"><header><div><h3>{venueValue ? "调整日常场地" : "安排日常场地"}</h3><p>仅更新学校日常安排，不改写学生提交的拟用场地或场地说明。</p></div><button type="button" aria-label="关闭" onClick={() => { setVenueDraft(venueValue); setVenueMode(venueArrangementSource === "场地库" ? "library" : "text"); setVenueReason(""); setSettingDialog(null); }}><AppIcon icon={X} size={18} weight="bold" /></button></header><div className="member-dialog-body"><div className="member-dialog-field"><span>场地安排</span><div className="venue-mode-switch" role="radiogroup" aria-label="场地安排方式"><button type="button" role="radio" aria-checked={venueMode === "library"} className={venueMode === "library" ? "active" : ""} onClick={() => { setVenueMode("library"); setVenueDraft(""); }}><span className="venue-radio-dot" aria-hidden="true" />从场地库选择</button><button type="button" role="radio" aria-checked={venueMode === "text"} className={venueMode === "text" ? "active" : ""} onClick={() => { setVenueMode("text"); setVenueDraft(""); }}><span className="venue-radio-dot" aria-hidden="true" />填写场地说明</button></div>{venueMode === "library" ? venueDraft ? <div className="venue-library-chosen"><span>{venueDraft}</span><button type="button" className="venue-selection-delete" aria-label="删除已选场地" onClick={() => setVenueDraft("")}><AppIcon icon={X} size={13} weight="bold" /></button></div> : <button type="button" className="venue-library-select-link" onClick={() => setVenueDraft(venueLibrarySeed[3].name)}>请选择场地</button> : <input aria-label="场地安排" value={venueDraft} onChange={(event) => setVenueDraft(event.target.value)} placeholder="填写场地或安排说明" />}</div><label className="member-dialog-field">调整原因<textarea value={venueReason} onChange={(event) => setVenueReason(event.target.value)} placeholder="请填写调整原因" /></label></div><footer><button type="button" className="text-action" onClick={() => { setVenueDraft(venueValue); setVenueMode(venueArrangementSource === "场地库" ? "library" : "text"); setVenueReason(""); setSettingDialog(null); }}>取消</button><button type="button" className="primary-action" disabled={!venueDraft.trim() || !venueReason.trim()} onClick={saveVenue}>保存</button></footer></section></div> : null}
      {settingDialog === "application" ? <div className="member-dialog-mask" role="presentation"><section className="member-dialog application-snapshot-dialog" role="dialog" aria-modal="true" aria-label="本学期申报资料"><header><div><h3>本学期申报资料</h3><p>按提交和审核时的内容保留，不随当前信息调整改变。</p></div><button type="button" aria-label="关闭" onClick={() => setSettingDialog(null)}><AppIcon icon={X} size={18} weight="bold" /></button></header><div className="member-dialog-body"><div className="application-snapshot-grid"><div><span>申报人</span><strong>{club.leader} · {club.grade}</strong></div><div><span>提交方式</span><strong>{detail.submittedBy ?? "学生本人提交"}</strong></div><div><span>提交时间</span><strong>{detail.submittedAt ?? "—"}</strong></div><div><span>计划人数上限</span><strong>{club.capacity} 人</strong></div><div className="wide"><span>社团介绍</span><p>{detail.introduction}</p></div><div className="wide"><span>招募说明</span><p>{detail.recruitment}</p></div>{proposedVenue ? <div className="wide"><span>拟用场地</span><strong>{proposedVenue}</strong></div> : null}{venueDescription ? <div className="wide"><span>场地说明</span><p>{venueDescription}</p></div> : null}{!proposedVenue && !venueDescription ? <div className="wide"><span>活动场地</span><strong>未填写</strong></div> : null}<div className="wide"><span>活动计划</span><p>{detail.plan ?? "—"}</p></div>{detail.materials?.length ? <div className="wide"><span>申报材料</span><ul>{detail.materials.map((item) => <li key={`${item.label}-${item.value}`}>{item.label}：{item.value}</li>)}</ul></div> : null}</div></div><footer><button type="button" className="primary-action" onClick={() => setSettingDialog(null)}>关闭</button></footer></section></div> : null}
      {showMemberChanges ? <div className="member-dialog-mask" role="presentation"><section className="member-dialog member-changes-dialog" role="dialog" aria-modal="true" aria-label="成员变更记录"><header><div><h3>成员变更记录</h3><p>当前名册不展示已移出成员；在此查看完整历史。</p></div><button type="button" aria-label="关闭" onClick={() => setShowMemberChanges(false)}><AppIcon icon={X} size={18} weight="bold" /></button></header><div className="member-dialog-body"><div className="member-history-tabs" role="tablist" aria-label="成员历史"><button type="button" role="tab" aria-selected={memberHistoryView === "changes"} className={memberHistoryView === "changes" ? "active" : ""} onClick={() => setMemberHistoryView("changes")}>全部变更</button><button type="button" role="tab" aria-selected={memberHistoryView === "removed"} className={memberHistoryView === "removed" ? "active" : ""} onClick={() => setMemberHistoryView("removed")}>已移出成员{removedMembers.length ? `（${removedMembers.length}）` : ""}</button></div>{memberHistoryView === "changes" ? <div className="detail-table-wrap"><table className="detail-table member-change-table"><thead><tr><th>变更</th><th>学生</th><th>提出方与依据</th><th>操作信息</th><th>结果</th></tr></thead><tbody>{memberChanges.map((change, index) => <tr key={`${change.action}-${change.student}-${change.time}-${index}`}><td>{change.action}</td><td>{change.student}</td><td><div className="cell-stack"><strong>{change.proposer}</strong><span>{change.basis}{change.reason ? ` · ${change.reason}` : ""}</span></div></td><td><div className="cell-stack"><strong>{change.operator}</strong><span>{change.time}</span></div></td><td>{change.outcome}</td></tr>)}</tbody></table></div> : removedMembers.length ? <div className="detail-table-wrap"><table className="detail-table removed-members-table"><thead><tr><th>学生</th><th>移出依据与说明</th><th>处理教师</th><th>移出时间</th></tr></thead><tbody>{removedMembers.map((member) => <tr key={`${member.name}-${member.removedAt}`}><td><PersonCell name={member.name} detail={member.className ?? member.grade} /></td><td><div className="cell-stack"><strong>{member.basis}</strong><span>{member.reason}</span></div></td><td>{member.operator}</td><td>{member.removedAt}</td></tr>)}</tbody></table></div> : <div className="member-history-empty">暂无已移出成员</div>}</div><footer><button type="button" className="primary-action" onClick={() => setShowMemberChanges(false)}>关闭</button></footer></section></div> : null}
      {memberOperation?.type === "add" || memberOperation?.type === "batch" ? <div className="member-dialog-mask" role="presentation"><section className="member-dialog" role="dialog" aria-modal="true" aria-label={memberOperation.type === "batch" ? "批量添加成员" : "添加成员"}><header><div><h3>{memberOperation.type === "batch" ? "批量添加成员" : "添加成员"}</h3><p>仅录入线下已经确认的结果，成员来源将记录为“教师添加”。</p></div><button type="button" aria-label="关闭" onClick={closeMemberOperation}><AppIcon icon={X} size={18} weight="bold" /></button></header><div className="member-dialog-body"><div className="member-dialog-capacity">当前还可添加 <strong>{availableSeats}</strong> 人</div>{memberCandidateSeed.map((candidate) => { const selected = selectedCandidateIds.includes(candidate.id); return <label className={`member-candidate ${selected ? "selected" : ""}`} key={candidate.id}><input type={memberOperation.type === "batch" ? "checkbox" : "radio"} name="member-candidate" checked={selected} onChange={() => setSelectedCandidateIds((ids) => memberOperation.type === "batch" ? (selected ? ids.filter((id) => id !== candidate.id) : [...ids, candidate.id]) : [candidate.id])} /><span><strong>{candidate.name}</strong><small>{candidate.className} · {candidate.note}</small></span></label>})}</div><footer><button type="button" className="text-action" onClick={closeMemberOperation}>取消</button><button type="button" className="primary-action" disabled={!selectedCandidates.length || selectedCandidates.length > availableSeats} onClick={addSelectedMembers}>确认添加{selectedCandidates.length ? `（${selectedCandidates.length}）` : ""}</button></footer></section></div> : null}
      {memberOperation?.type === "remove" ? <div className="member-dialog-mask" role="presentation"><section className="member-dialog" role="dialog" aria-modal="true" aria-label="移出成员"><header><div><h3>移出成员</h3><p>将终止 {memberOperation.member.name} 在本学期的有效成员关系，既有活动、签到和学分记录仍保留。</p></div><button type="button" aria-label="关闭" onClick={closeMemberOperation}><AppIcon icon={X} size={18} weight="bold" /></button></header><div className="member-dialog-body"><label className="member-dialog-field">移出依据<select value={removalBasis} onChange={(event) => setRemovalBasis(event.target.value)}>{removalBasisOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="member-dialog-field">说明<textarea value={removalReason} onChange={(event) => setRemovalReason(event.target.value)} placeholder="请填写本次移出的具体说明" /></label></div><footer><button type="button" className="text-action" onClick={closeMemberOperation}>取消</button><button type="button" className="danger-action" disabled={!removalReason.trim()} onClick={removeMember}>确认移出</button></footer></section></div> : null}
      <ShowcasePreviewDrawer item={showcasePreview} onClose={() => setShowcasePreview(null)} />
      <ActivityDetailDrawer activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
  </section>;
}

function nextTermFor(term) {
  const match = term.match(/(\d{4})-(\d{4})学年(第一|第二)学期/);
  if (!match) return "下一学期";
  const [, startYear, endYear, semester] = match;
  return semester === "第一" ? `${startYear}-${endYear}学年第二学期` : `${endYear}-${Number(endYear) + 1}学年第一学期`;
}

export function ContinuationPage({ club, onCancel, onComplete }) {
  const detail = clubDetailSeed[club.id] ?? {
    introduction: "该社团的介绍将按成立时的社团信息保留。",
    recruitment: "该社团的招募说明将按成立时的社团信息保留。",
    venueNeed: "场地需求待补充",
    members: [{ name: club.leader, grade: club.grade, className: club.className, role: "学生社长" }],
  };
  const currentMembers = detail.members ?? [];
  const targetTerm = nextTermFor(club.term);
  const leaderOptions = [
    { name: club.leader, grade: club.grade, className: club.className },
    { name: "陈雨桐", grade: "八年级", className: "八年级（1）班" },
  ];
  const [leaderIndex, setLeaderIndex] = useState(0);
  const [retainedNames, setRetainedNames] = useState(currentMembers.map((member) => member.name));
  const [capacity, setCapacity] = useState(String(club.capacity));
  const [continueRecruiting, setContinueRecruiting] = useState(true);
  const [introduction, setIntroduction] = useState(detail.introduction);
  const [coverName, setCoverName] = useState("沿用当前社团封面");
  const [phone, setPhone] = useState("");
  const [recruitment, setRecruitment] = useState(detail.recruitment);
  const [plan, setPlan] = useState(detail.plan ?? "延续原社团的活动方向，并在新学期开始前补充具体安排。");
  const [venueMode, setVenueMode] = useState("description");
  const [venueNeed, setVenueNeed] = useState(detail.venueNeed ?? "");
  const [posterName, setPosterName] = useState("沿用当前招新海报");
  const retainedMembers = currentMembers.filter((member) => retainedNames.includes(member.name));
  const nextCapacity = Number(capacity);
  const availableSeats = Number.isInteger(nextCapacity) ? nextCapacity - retainedMembers.length : -1;
  const toggleMember = (name) => setRetainedNames((names) => names.includes(name) ? names.filter((item) => item !== name) : [...names, name]);
  const selectedLeader = leaderOptions[leaderIndex];
  const changeLeader = () => {
    const nextIndex = (leaderIndex + 1) % leaderOptions.length;
    setLeaderIndex(nextIndex);
  };
  const submit = (event) => {
    event.preventDefault();
    if (!Number.isInteger(nextCapacity) || nextCapacity < retainedMembers.length || !phone.trim()) return;
    onComplete({ targetTerm, leader: selectedLeader, retainedMembers, capacity: nextCapacity, continueRecruiting, introduction, coverName, phone, recruitment, venueMode, venueNeed, posterName, plan });
  };

  return <section className="continuation-page" aria-label={`${club.name}延续到下学期`}>
    <div className="continuation-context"><div><span>原社团</span><strong>{club.name} · {club.term}</strong></div><div><span>目标学期</span><strong>{targetTerm}</strong></div></div>
    <form className="continuation-form" onSubmit={submit}>
      <section className="continuation-section continuation-plan-section"><div className="continuation-section-head"><div className="continuation-stage-heading"><span className="continuation-stage-icon plan"><AppIcon icon={UsersThree} size={18} weight="duotone" /></span><div><h2>延续安排</h2><p>确认下学期学生社长，并选择保留的当前有效成员。</p></div></div></div><div className="continuation-leader-field"><span>下一学期学生社长</span><div className="continuation-leader-card"><div><strong>{selectedLeader.name}<em>{leaderIndex === 0 ? "默认带入" : "已更换"}</em></strong><small>{selectedLeader.grade} · {selectedLeader.className}</small></div><button type="button" onClick={changeLeader}>更换</button></div></div><div className="continuation-retained-members"><div className="continuation-member-summary"><span>拟保留成员</span><strong>{retainedMembers.length} 人</strong><small>仅带入当前仍有效的成员</small></div><div className="continuation-member-list">{currentMembers.map((member) => <label key={member.name}><input type="checkbox" checked={retainedNames.includes(member.name)} onChange={() => toggleMember(member.name)} /><span><strong>{member.name}</strong><small>{member.className ?? member.grade} · {member.name === club.leader && leaderIndex !== 0 ? "原学生社长" : member.role}</small></span></label>)}</div></div></section>
      <section className="continuation-section continuation-form-section"><div className="continuation-section-head"><div className="continuation-stage-heading"><span className="continuation-stage-icon form"><AppIcon icon={FileText} size={18} weight="duotone" /></span><div><h2>下学期社团申报表</h2><p>按当前申报表配置填写；原内容已带入，可按新学期调整。</p></div></div></div><div className="continuation-form-groups">
        <fieldset className="continuation-form-group"><legend>基本信息 <small>系统固定</small></legend><div className="continuation-info-grid compact"><div><span>社团名称</span><strong>{club.name}</strong></div><div><span>社团类别</span><strong>{club.category}</strong></div></div><label className="continuation-field"><span>计划人数上限 <b>*</b></span><input aria-label="下一学期人数上限" type="number" min={retainedMembers.length} value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label><RichTextField label="社团简介" required value={introduction} onChange={setIntroduction} /><div className="continuation-upload-field"><span>社团封面</span><div><strong>{coverName}</strong><button type="button" onClick={() => setCoverName("下学期社团封面.png")}>更换</button></div><small>选填，用于学生端展示社团形象。</small></div></fieldset>
        <fieldset className="continuation-form-group"><legend>招新与联系 <small>系统固定</small></legend><label className="continuation-field"><span>联系电话 <b>*</b></span><input aria-label="联系电话" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="请输入下学期联系电话" /></label><div className="continuation-recruiting-setting"><label className="continuation-switch"><input type="checkbox" checked={continueRecruiting} onChange={(event) => setContinueRecruiting(event.target.checked)} /><span aria-hidden="true" />继续招新</label>{continueRecruiting ? <p>基于拟保留成员和人数上限，下一学期可招 <strong>{availableSeats >= 0 ? availableSeats : "—"}</strong> 人</p> : <p>下一学期不开放入团报名</p>}</div><RichTextField label="招募说明" value={recruitment} onChange={setRecruitment} /></fieldset>
        <fieldset className="continuation-form-group"><legend>活动场地需求 <small>系统固定</small></legend><div className="continuation-venue-method" role="radiogroup" aria-label="活动场地需求填写方式"><label><input type="radio" name="continuation-venue" checked={venueMode === "library"} onChange={() => { setVenueMode("library"); setVenueNeed("美术教室 3"); }} />从场地库选择</label><label><input type="radio" name="continuation-venue" checked={venueMode === "description"} onChange={() => setVenueMode("description")} />填写场地说明</label></div><label className="continuation-field"><span>活动场地需求</span>{venueMode === "library" ? <button type="button" className="continuation-venue-select" onClick={() => setVenueNeed("图书馆研讨室")}>{venueNeed || "请选择场地"}</button> : <textarea value={venueNeed} onChange={(event) => setVenueNeed(event.target.value)} placeholder="说明场地需求，由学校后续协调" />}</label><small className="continuation-group-note">仅表达下一学期的拟用场地或协助需求，不预约、不锁定每场活动的实际场地。</small></fieldset>
        <fieldset className="continuation-form-group"><legend>申报材料 <small>学校设置</small></legend><div className="continuation-upload-field"><span>招新海报 <b>*</b></span><div><strong>{posterName}</strong><button type="button" onClick={() => setPosterName("下学期招新海报.png")}>更换</button></div></div><label className="continuation-field"><span>活动计划 <b>*</b></span><textarea value={plan} onChange={(event) => setPlan(event.target.value)} /></label><small className="continuation-group-note">学校在社团申报表中配置的其他问题或材料，也应在这里按同一顺序完整带入；本原型当前以“招新海报、活动计划”演示。</small></fieldset>
      </div></section>
      <footer className="continuation-footer"><button type="button" className="text-action" onClick={onCancel}>取消</button><button type="submit" className="primary-action" disabled={!Number.isInteger(nextCapacity) || nextCapacity < retainedMembers.length || !phone.trim()}>确认延续</button></footer>
    </form>
  </section>;
}

export function ClubsPage({ clubs = clubsSeed, onPlaceholder, onViewClub, onContinueClub, onEndClub, onRestoreClub, onStartProxyApplication }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState(currentTerm);
  const [category, setCategory] = useState(allOption);
  const [openMenuId, setOpenMenuId] = useState(null);
  const categoryOptions = useMemo(() => uniqueOptions(clubs.filter((club) => club.term === term), "category"), [clubs, term]);

  const rows = useMemo(() => clubs.filter((club) => (
    (club.name.includes(query) || club.leader.includes(query) || club.phone.includes(query) || club.phone.replaceAll(" ", "").includes(query))
    && club.term === term
    && (category === allOption || club.category === category)
  )), [clubs, query, term, category]);

  const changed = Boolean(query || term !== currentTerm || category !== allOption);
  const reset = () => {
    setQuery("");
    setTerm(currentTerm);
    setCategory(allOption);
  };

  return <>
    <FilterBar
      protoId="clubs-filters"
      resetProtoId="clubs-filter-reset"
      changed={changed}
      onReset={reset}
    >
      <SelectField protoId="clubs-term-filter" label="学期" value={term} onChange={setTerm} options={termOptions} />
      <SearchField protoId="clubs-search" value={query} onChange={setQuery} placeholder="搜索社团名称、学生社长、联系电话" />
      <SelectField protoId="clubs-category-filter" label="社团类别" value={category} onChange={setCategory} options={categoryOptions} />
    </FilterBar>
    <TermWindows term={term} />
    <TableFrame
      protoId="clubs-list"
      count={rows.length}
      countLabel="个社团"
      action={<div className="toolbar-actions"><button type="button" className="secondary-action" data-proto-id="clubs-proxy-application" onClick={onStartProxyApplication}><AppIcon icon={Plus} size={16} />代学生申报社团</button></div>}
    >
      {rows.length ? <div className="table-scroll clubs-table-wrap"><table className="clubs-table"><thead><tr>
        <th>社团名称</th><th>社团类别</th><th>学生社长</th><th>成员与名额</th><th>活动记录</th><th className="action-cell">操作</th>
      </tr></thead><tbody>{rows.map((club) => <tr key={club.id}>
        <td><div className="club-name-cell"><strong>{club.name}</strong><div className="club-tags">
          {club.origin === "从上学期延续" ? <span className="source-tag">上学期延续</span> : null}
          <StatusBadge value={club.status} />
        </div></div></td>
        <td>{club.category}</td>
        <td><LeaderContactCell club={club} /></td>
        <td><RecruitmentCell club={club} /></td>
        <td><ActivityCell club={club} /></td>
        <td className="action-cell club-action-cell"><ClubActions club={club} open={openMenuId === club.id} onToggle={() => setOpenMenuId((value) => value === club.id ? null : club.id)} onPlaceholder={onPlaceholder} onView={onViewClub} onContinue={onContinueClub} onEnd={onEndClub} onRestore={onRestoreClub} /></td>
      </tr>)}</tbody></table></div> : <EmptyState title="未找到匹配的社团" />}
    </TableFrame>
  </>;
}

function ReportMetric({ value, label, detail }) {
  return <div className="report-metric">
    <strong>{value}</strong>
    <div><span>{label}</span><small>{detail}</small></div>
  </div>;
}

function ReportDimension({ title, description, primary, secondary, children }) {
  return <section className="report-dimension">
    <div className="report-dimension-head"><div><h3>{title}</h3><p>{description}</p></div><strong>{primary}</strong></div>
    <div className="report-dimension-secondary">{secondary}</div>
    {children}
  </section>;
}

function HorizontalBarChart({ items, maxValue, unit = "个", tone = "blue" }) {
  return <div className={`report-bar-chart ${tone}`}>
    {items.map((item) => <div className="report-bar-row" key={item.label}>
      <span title={item.label}>{item.label}</span>
      <i aria-hidden="true"><b style={{ width: `${maxValue ? Math.max((item.value / maxValue) * 100, item.value ? 8 : 0) : 0}%` }} /></i>
      <strong>{item.value}{unit}</strong>
    </div>)}
  </div>;
}

function ActivityBars({ clubs }) {
  const maxActivity = Math.max(...clubs.map((club) => club.activities), 1);
  return <div className="report-activity-chart" aria-label="各社团活动记录分布">
    {clubs.map((club) => <div className="report-activity-column" key={club.id}>
      <strong>{club.activities}</strong>
      <i><b style={{ height: `${Math.max((club.activities / maxActivity) * 100, club.activities ? 8 : 2)}%` }} /></i>
      <span title={club.name}>{club.name}</span>
    </div>)}
  </div>;
}

export function AnalysisReportPage({ clubs = clubsSeed, onViewClub }) {
  const [term, setTerm] = useState(currentTerm);
  const rows = useMemo(() => clubs.filter((club) => club.term === term), [clubs, term]);
  const running = rows.filter((club) => club.status === "进行中");
  const continued = rows.filter((club) => club.origin === "从上学期延续");
  const newClubs = rows.filter((club) => club.origin === "本学期新申报");
  const endedEarly = rows.filter((club) => club.status === "已提前结束");
  const withoutActivityRecord = rows.filter((club) => club.status === "进行中" && club.activities === 0);
  const endRequested = rows.filter((club) => club.endRequest);
  const totalMembers = rows.reduce((total, club) => total + club.members, 0);
  const totalActivities = rows.reduce((total, club) => total + club.activities, 0);
  const categories = [...new Set(rows.map((club) => club.category))];
  const categorySummary = categories.map((category) => ({ label: category, value: rows.filter((club) => club.category === category).length }));
  const categoryMax = Math.max(...categorySummary.map((item) => item.value), 1);
  const activityRecordClubs = rows.filter((club) => club.activities > 0).length;
  const clubNames = new Set(rows.map((club) => club.name));
  const creditClubs = new Set(creditSeed.filter((item) => item.term === term && clubNames.has(item.club)).map((item) => item.club)).size;
  const recordCoverage = [
    { label: "已有活动记录", value: activityRecordClubs },
    { label: "已有学分申请", value: creditClubs },
  ];
  const focusClubs = rows.filter((club) => club.status === "已提前结束" || club.endRequest || (club.status === "进行中" && club.activities === 0));

  const attentionText = (club) => {
    if (club.endRequest) return "已提交结束申请";
    if (club.status === "已提前结束") return "已提前结束本学期社团";
    if (club.activities === 0) return "尚无系统活动记录";
    return "—";
  };

  return <section className="analysis-report-page">
    <div className="analysis-report-tools">
      <div><span>统计学期</span><SelectField label="统计学期" value={term} onChange={setTerm} options={termOptions} /></div>
      <p>统计范围：当前教师有权查看的社团</p>
    </div>

    <section className="report-overview" aria-labelledby="report-overview-title">
      <div className="report-section-head"><div><h2 id="report-overview-title">社团运行综述</h2><p>从社团生态、运行活力、组织健康和过程沉淀四个维度查看本学期情况。</p></div></div>
      <div className="report-metric-grid">
        <ReportMetric value={`${rows.length} 个`} label="正式社团" detail={`${running.length} 个进行中`} />
        <ReportMetric value={`${totalMembers} 人`} label="正式成员" detail="当前有效成员关系" />
        <ReportMetric value={`${totalActivities} 场`} label="活动记录" detail="系统已记录的活动" />
        <ReportMetric value={`${focusClubs.length} 个`} label="需要进一步了解" detail="基于当前系统事实" />
      </div>
    </section>

    <section className="report-analysis" aria-labelledby="report-analysis-title">
      <div className="report-section-head"><div><h2 id="report-analysis-title">社团运行分析</h2><p>不同维度并列呈现，不合成为社团总分或排名。</p></div></div>
      <div className="report-dimension-grid">
        <ReportDimension title="社团生态" description="学校本学期有哪些学生自主社团" primary={`${categories.length} 类`} secondary={`${newClubs.length} 个新建 · ${continued.length} 个延续`}>
          <HorizontalBarChart items={categorySummary} maxValue={categoryMax} />
        </ReportDimension>
        <ReportDimension title="运行活力" description="社团是否持续留下活动过程记录" primary={`${totalActivities} 场`} secondary={`${withoutActivityRecord.length} 个进行中社团尚无系统活动记录`}>
          <ActivityBars clubs={rows} />
          <p className="report-chart-caption">横向比较的是已记录活动场次，不据此判断线下是否开展。</p>
        </ReportDimension>
        <ReportDimension title="组织健康" description="社团是否保持本学期的组织运行状态" primary={`${running.length} 个`} secondary={`${endedEarly.length} 个已提前结束 · ${endRequested.length} 个已提交结束申请`}>
          <div className="report-state-chart" aria-label="社团运行状态构成"><span className="running" style={{ width: `${rows.length ? (running.length / rows.length) * 100 : 0}%` }} /><span className="ended" style={{ width: `${rows.length ? (endedEarly.length / rows.length) * 100 : 0}%` }} /></div>
          <div className="report-state-legend"><span><i className="running" />进行中 {running.length} 个</span><span><i className="ended" />已提前结束 {endedEarly.length} 个</span></div>
        </ReportDimension>
        <ReportDimension title="发展沉淀" description="学生参与是否逐步形成可确认的过程事实" primary="持续沉淀" secondary="活动、签到、成果与学分将共用同一数据口径">
          <HorizontalBarChart items={recordCoverage} maxValue={Math.max(rows.length, 1)} unit={` / ${rows.length} 个`} tone="soft" />
          <p className="report-chart-caption">签到、成果等口径尚待确认，暂不以缺少该类数据评价社团。</p>
        </ReportDimension>
      </div>
    </section>

    <section className="report-focus" aria-labelledby="report-focus-title">
      <div className="report-section-head"><div><h2 id="report-focus-title">需要进一步了解</h2><p>仅呈现需要教师进入具体社团确认的事实，不自动给出“异常”结论。</p></div><span>{focusClubs.length} 个社团</span></div>
      {focusClubs.length ? <div className="report-focus-list">{focusClubs.map((club) => <button type="button" key={club.id} onClick={() => onViewClub(club)}><span><strong>{club.name}</strong><small>{club.category} · 学生社长 {club.leader}</small></span><em>{attentionText(club)}</em><CaretRight size={16} /></button>)}</div> : <div className="report-empty">当前没有需要进一步了解的社团事实。</div>}
    </section>

    <TableFrame count={rows.length} countLabel="个社团">
      <div className="report-table-title"><h2>社团全景数据</h2><p>上方分析的明细支撑；可按单一事实排序，不提供综合排名。</p></div>
      <div className="table-scroll"><table className="report-table"><thead><tr><th>社团</th><th>来源</th><th>当前状态</th><th className="number-cell">正式成员</th><th className="number-cell">活动记录</th><th>最近活动记录</th><th>需要进一步了解</th><th className="action-cell">操作</th></tr></thead><tbody>{rows.map((club) => <tr key={club.id}>
        <td className="main-cell">{club.name}<small className="report-leader">学生社长：{club.leader}</small></td>
        <td>{club.origin === "从上学期延续" ? "上学期延续" : "本学期新建"}</td>
        <td><StatusBadge value={club.status} /></td>
        <td className="number-cell">{club.members} / {club.capacity} 人</td>
        <td className="number-cell strong-number">{club.activities} 场</td>
        <td>{club.lastActivityAt ?? <span className="muted-value">暂无</span>}</td>
        <td>{attentionText(club) === "—" ? <span className="muted-value">—</span> : attentionText(club)}</td>
        <td className="action-cell"><PlaceholderAction onClick={() => onViewClub(club)}>查看</PlaceholderAction></td>
      </tr>)}</tbody></table></div>
    </TableFrame>
  </section>;
}

export function EarlyEndClubDialog({ club, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const canConfirm = Boolean(reason.trim());

  return <div className="early-end-mask" role="presentation">
    <section className="early-end-dialog" role="dialog" aria-modal="true" aria-labelledby="early-end-title">
      <header className="early-end-dialog-header"><div><h2 id="early-end-title">提前结束本学期社团</h2><p>确认后，社团将停止本学期继续运营。</p></div><button type="button" aria-label="关闭" onClick={onClose}><AppIcon icon={X} size={19} weight="bold" /></button></header>
      <div className="early-end-dialog-body">
        <div className="early-end-club-summary"><div><span>社团</span><strong>{club.name}</strong></div><div><span>学生社长</span><strong>{club.leader} · {club.className}</strong></div><div><span>当前成员</span><strong>{club.members} 人</strong></div></div>
        <section className="early-end-impact"><strong>结束后的影响</strong><ul><li>不再接收或处理新的入团申请，不再发布新活动、执行签到或发布活动动态。</li><li>本学期成员关系与人数上限冻结；既有成员、活动、签到、动态和成果继续保留。</li><li>已发生的参与事实仍可在学分申请时间内完成申请、社长审核和教师终审。</li></ul></section>
        <label className="early-end-reason"><span><b>*</b>结束原因</span><textarea autoFocus value={reason} onChange={(event) => setReason(event.target.value)} rows="4" placeholder="请说明提前结束本学期社团的原因" /></label>
      </div>
      <footer className="early-end-dialog-footer"><button type="button" className="btn-header-outline" onClick={onClose}>取消</button><button type="button" className="early-end-confirm" disabled={!canConfirm} onClick={() => onConfirm(reason.trim())}>确认提前结束</button></footer>
    </section>
  </div>;
}

export function RestoreClubDialog({ club, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const canConfirm = Boolean(reason.trim());

  return <div className="early-end-mask" role="presentation">
    <section className="early-end-dialog" role="dialog" aria-modal="true" aria-labelledby="restore-club-title">
      <header className="early-end-dialog-header"><div><h2 id="restore-club-title">恢复本学期社团运行</h2><p>仅恢复本学期继续运营，不改变已经保留的历史记录。</p></div><button type="button" aria-label="关闭" onClick={onClose}><AppIcon icon={X} size={19} weight="bold" /></button></header>
      <div className="early-end-dialog-body">
        <div className="early-end-club-summary"><div><span>社团</span><strong>{club.name}</strong></div><div><span>学生社长</span><strong>{club.leader} · {club.className}</strong></div><div><span>当前成员</span><strong>{club.members} 人</strong></div></div>
        <section className="restore-impact"><strong>恢复后的范围</strong><ul><li>社团恢复为进行中，可在当前学期规则范围内继续开展活动。</li><li>成员关系沿用原记录；入团报名仍受当前报名时间、人数上限和学生参与数量等规则约束。</li><li>因提前结束而终止的入团申请和未开展活动不会自动恢复。</li></ul></section>
        <label className="early-end-reason"><span><b>*</b>恢复原因</span><textarea autoFocus value={reason} onChange={(event) => setReason(event.target.value)} rows="4" placeholder="请说明恢复本学期社团运行的原因" /></label>
      </div>
      <footer className="early-end-dialog-footer"><button type="button" className="btn-header-outline" onClick={onClose}>取消</button><button type="button" className="restore-confirm" disabled={!canConfirm} onClick={() => onConfirm(reason.trim())}>确认恢复运行</button></footer>
    </section>
  </div>;
}

const proxyStudentOptions = [
  { id: "student-1", name: "李沐阳", grade: "七年级", className: "七年级（2）班", phone: "138 2266 7018" },
  { id: "student-2", name: "宋晚晴", grade: "八年级", className: "八年级（1）班", phone: "139 4872 1206" },
  { id: "student-3", name: "周子墨", grade: "七年级", className: "七年级（4）班", phone: "136 4173 5280" },
];

const proxyCategoryOptions = ["科技学院", "文史学院", "艺术学院", "体育学院", "国际学院"];

function proxySubmissionTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date()).replaceAll("/", "-");
}

export function ProxyApplicationPage({ applications, onCancel, onSubmit }) {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [phone, setPhone] = useState("");
  const [recruitment, setRecruitment] = useState("");
  const [venueType, setVenueType] = useState("拟用场地");
  const [venueText, setVenueText] = useState("");
  const [poster, setPoster] = useState("");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  const student = proxyStudentOptions.find((item) => item.id === studentId);
  const occupiedApplicationCount = student
    ? applications.filter((item) => item.term === currentTerm && item.applicant === student.name && ["待审核", "已通过"].includes(item.status)).length
    : 0;

  const selectStudent = (nextId) => {
    const nextStudent = proxyStudentOptions.find((item) => item.id === nextId);
    setStudentId(nextId);
    setPhone(nextStudent?.phone ?? "");
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    const normalizedName = name.trim();
    const normalizedCapacity = Number(capacity);
    if (!student) return setError("请先选择代办学生");
    if (occupiedApplicationCount) return setError(`该学生本学期已有 ${occupiedApplicationCount} 个待处理或已通过的社团申报，暂不能再次申报`);
    if (!normalizedName || !category || !Number.isInteger(normalizedCapacity) || normalizedCapacity <= 0 || !introduction.trim() || !phone.trim() || !poster || !plan.trim()) return setError("请完成所有必填项后再提交");
    if (applications.some((item) => item.term === currentTerm && item.applicant === student.name && item.name.trim() === normalizedName && ["待审核", "已通过"].includes(item.status))) return setError("该学生已存在同名且仍有效的社团申报，请核对后再提交");

    const submittedAt = proxySubmissionTime();
    onSubmit({
      id: Date.now(),
      term: currentTerm,
      name: normalizedName,
      category,
      applicant: student.name,
      className: student.className,
      grade: student.grade,
      capacity: normalizedCapacity,
      venueType,
      venueSource: "填写说明",
      venueText: venueText.trim() || "未填写",
      submittedBy: "教师代提交",
      operator: "赵乐",
      phone: phone.trim(),
      introduction: introduction.trim(),
      recruitment: recruitment.trim() || "未填写",
      poster,
      plan: plan.trim(),
      submittedAt,
      status: "待审核",
      materials: [
        { label: "招新海报", value: poster, kind: "附件" },
        { label: "活动计划", value: plan.trim(), kind: "填写内容" },
      ],
      approvalHistory: [{ action: "提交申报", actor: "赵乐", time: submittedAt, detail: "教师代提交" }],
    });
  };

  return <section className="proxy-application-page" aria-label="代学生申报社团">
    <div className="proxy-application-notice">
      <strong>教师代为录入</strong>
      <span>请选择学生社长后，按学生申报表填写。社团仍由该学生负责，提交后进入社团申报审核。</span>
    </div>
    <form className="proxy-application-form" onSubmit={submit}>
      <section className="proxy-application-section">
        <div className="proxy-section-heading"><div><h2>选择学生社长</h2><p>系统将按所选学生校验本学期的创建数量和重复申报。</p></div><span className="field-required">必填</span></div>
        <div className="proxy-form-field compact"><span>代办学生</span><button type="button" className="student-select-trigger" aria-label="选择学生" onClick={() => selectStudent(proxyStudentOptions[0].id)}>请选择学生</button></div>
        {student ? <div className="proxy-student-summary"><div><strong>{student.name}</strong><span>{student.grade} · {student.className}</span></div><span>学生社长</span></div> : null}
        {student && occupiedApplicationCount ? <p className="proxy-validation-hint is-error">该学生本学期已有 {occupiedApplicationCount} 个待处理或已通过的社团申报。</p> : student ? <p className="proxy-validation-hint">未发现占用本学期创建名额的有效社团申报。</p> : null}
      </section>

      <section className="proxy-application-section">
        <div className="proxy-section-heading"><div><h2>基本信息</h2><p>与学生申报社团使用相同的基础字段。</p></div></div>
        <div className="proxy-fields-grid">
          <label className="proxy-form-field"><span><b>*</b>社团名称</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="请输入社团名称" /></label>
          <label className="proxy-form-field"><span><b>*</b>社团类别</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">请选择社团类别</option>{proxyCategoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          <label className="proxy-form-field"><span><b>*</b>计划人数上限</span><div className="proxy-number-input"><input type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="请输入人数" /><i>人</i></div></label>
          <label className="proxy-form-field wide"><span><b>*</b>社团简介</span><textarea value={introduction} onChange={(event) => setIntroduction(event.target.value)} rows="4" placeholder="请介绍社团目标和主要内容" /></label>
        </div>
      </section>

      <section className="proxy-application-section">
        <div className="proxy-section-heading"><div><h2>招新与联系</h2></div></div>
        <div className="proxy-fields-grid">
          <label className="proxy-form-field"><span><b>*</b>联系电话</span><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="请输入学生社长联系电话" /></label>
          <label className="proxy-form-field wide"><span>招募说明</span><textarea value={recruitment} onChange={(event) => setRecruitment(event.target.value)} rows="3" placeholder="例如招募对象、报名条件、参与时间等" /></label>
        </div>
      </section>

      <section className="proxy-application-section">
        <div className="proxy-section-heading"><div><h2>活动场地需求</h2><p>这里不预约或锁定场地；实际场地在每场活动发布时分别填写。</p></div></div>
        <div className="proxy-venue-choice" role="radiogroup" aria-label="活动场地需求类型"><label><input type="radio" name="venueType" checked={venueType === "拟用场地"} onChange={() => setVenueType("拟用场地")} />拟用场地</label><label><input type="radio" name="venueType" checked={venueType === "协助需求"} onChange={() => setVenueType("协助需求")} />需要学校协助</label></div>
        <label className="proxy-form-field wide"><span>{venueType === "拟用场地" ? "拟用场地" : "希望学校协助的条件"}</span><textarea value={venueText} onChange={(event) => setVenueText(event.target.value)} rows="3" placeholder={venueType === "拟用场地" ? "填写拟使用的场地说明（选填）" : "例如所需空间、设备或容纳人数（选填）"} /></label>
      </section>

      <section className="proxy-application-section">
        <div className="proxy-section-heading"><div><h2>申报材料</h2><p>当前学校表单要求招新海报和活动计划。</p></div></div>
        <div className="proxy-fields-grid">
          <label className="proxy-form-field wide"><span><b>*</b>招新海报</span><input className="proxy-file-input" type="file" accept="image/*" onChange={(event) => setPoster(event.target.files?.[0]?.name ?? "")} /></label>
          <label className="proxy-form-field wide"><span><b>*</b>活动计划</span><textarea value={plan} onChange={(event) => setPlan(event.target.value)} rows="4" placeholder="请说明本学期拟开展的主要活动" /></label>
        </div>
      </section>

      {error ? <p className="proxy-submit-error" role="alert">{error}</p> : null}
      <footer className="proxy-application-footer"><button type="button" className="btn-header-outline" onClick={onCancel}>取消</button><button type="submit" className="btn-header-primary">提交申报</button></footer>
    </form>
  </section>;
}

function ReviewTabs({ value, onChange, applications = applicationSeed, endRequests = endRequestSeed, continuationRequests = [] }) {
  const applicationCount = applications.filter((item) => item.term === currentTerm && item.status === "待审核").length;
  const endCount = endRequests.filter((item) => item.term === currentTerm && item.status === "待审核").length;
  const continuationCount = continuationRequests.filter((item) => item.targetTerm === currentTerm && item.status === "待审核").length;
  return (
    <div className="review-tabs" role="tablist" aria-label="社团审核类型">
      <button type="button" role="tab" aria-selected={value === "application"} className={value === "application" ? "active" : ""} onClick={() => onChange("application")}>
        社团申报 <span>{applicationCount}</span>
      </button>
      <button type="button" role="tab" aria-selected={value === "end"} className={value === "end" ? "active" : ""} onClick={() => onChange("end")}>
        结束申请 <span>{endCount}</span>
      </button>
      <button type="button" role="tab" aria-selected={value === "continuation"} className={value === "continuation" ? "active" : ""} onClick={() => onChange("continuation")}>
        延续申请 <span>{continuationCount}</span>
      </button>
    </div>
  );
}

function ApplicationReviewPane({ onReviewApplication, applications = applicationSeed }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState(currentTerm);
  const [category, setCategory] = useState(allOption);
  const [status, setStatus] = useState("待审核");
  const [grade, setGrade] = useState(allOption);
  const [submittedBy, setSubmittedBy] = useState(allOption);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const rows = useMemo(() => applications.filter((item) => (
    (item.name.includes(query) || item.applicant.includes(query))
    && item.term === term
    && (category === allOption || item.category === category)
    && (status === allOption || item.status === status)
    && (grade === allOption || item.grade === grade)
    && (submittedBy === allOption || item.submittedBy === submittedBy)
  )), [applications, query, term, category, status, grade, submittedBy]);

  const changed = Boolean(query || term !== currentTerm || category !== allOption || status !== "待审核" || grade !== allOption || submittedBy !== allOption);
  const reset = () => {
    setQuery("");
    setTerm(currentTerm);
    setCategory(allOption);
    setStatus("待审核");
    setGrade(allOption);
    setSubmittedBy(allOption);
  };

  return <>
    <FilterBar
      changed={changed}
      onReset={reset}
      advancedOpen={advancedOpen}
      onToggleAdvanced={() => setAdvancedOpen((value) => !value)}
      advanced={<>
        <SelectField label="申报人年级" value={grade} onChange={setGrade} options={uniqueOptions(applications, "grade")} />
        <SelectField label="由谁提交" value={submittedBy} onChange={setSubmittedBy} options={uniqueOptions(applications, "submittedBy")} />
      </>}
    >
      <SelectField label="学期" value={term} onChange={setTerm} options={termOptions} />
      <SearchField value={query} onChange={setQuery} placeholder="搜索社团名称、申报学生" />
      <SelectField label="社团类别" value={category} onChange={setCategory} options={uniqueOptions(applications, "category")} />
      <SelectField label="审核情况" value={status} onChange={setStatus} options={[allOption, "待审核", "已通过", "已退回"]} />
    </FilterBar>
    <TableFrame count={rows.length}>
      {rows.length ? <div className="table-scroll"><table className="applications-table"><thead><tr>
        <th className="index-cell">序号</th><th>社团名称</th><th>社团类别</th><th>学生社长</th><th className="number-cell">计划人数上限</th><th>活动场地需求</th><th>提交时间</th><th>审核情况</th><th className="action-cell">操作</th>
      </tr></thead><tbody>{rows.map((item, index) => <tr key={item.id}>
        <td className="index-cell">{index + 1}</td>
        <td className="main-cell">{item.name}</td>
        <td>{item.category}</td>
        <td><PersonCell name={item.applicant} detail={`${item.grade} · ${item.submittedBy}`} /></td>
        <td className="number-cell">{item.capacity}</td>
        <td><VenueNeedCell type={item.venueType} value={item.venueText} /></td>
        <td>{item.submittedAt}</td>
        <td><StatusBadge value={item.status} /></td>
        <td className="action-cell"><PlaceholderAction onClick={() => onReviewApplication(item.id)}>{item.status === "待审核" ? "审核" : "查看"}</PlaceholderAction></td>
      </tr>)}</tbody></table></div> : <EmptyState title="暂无符合条件的社团申报" />}
    </TableFrame>
  </>;
}

function EndRequestReviewPane({ onReviewEndRequest }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState(currentTerm);
  const [status, setStatus] = useState("待审核");
  const rows = useMemo(() => endRequestSeed.filter((item) => (
    (item.club.includes(query) || item.leader.includes(query))
    && item.term === term
    && (status === allOption || item.status === status)
  )), [query, term, status]);
  const changed = Boolean(query || term !== currentTerm || status !== "待审核");

  return <>
    <FilterBar
      changed={changed}
      onReset={() => { setQuery(""); setTerm(currentTerm); setStatus("待审核"); }}
    >
      <SelectField label="学期" value={term} onChange={setTerm} options={termOptions} />
      <SearchField value={query} onChange={setQuery} placeholder="搜索社团名称、学生社长" />
      <SelectField label="审核情况" value={status} onChange={setStatus} options={[allOption, "待审核", "已通过", "已退回"]} />
    </FilterBar>
    <TableFrame count={rows.length}>
      {rows.length ? <div className="table-scroll"><table className="end-requests-table"><thead><tr>
        <th>社团名称</th><th>社团类别</th><th>学生社长</th><th>申请原因</th><th>提交时间</th><th>审核情况</th><th className="action-cell">操作</th>
      </tr></thead><tbody>{rows.map((item) => <tr key={item.id}>
        <td className="main-cell">{item.club}</td>
        <td>{item.category}</td>
        <td><PersonCell name={item.leader} detail={item.grade} /></td>
        <td className="reason-cell" title={item.reason}>{item.reason}</td>
        <td>{item.submittedAt}</td>
        <td><StatusBadge value={item.status} /></td>
        <td className="action-cell"><PlaceholderAction onClick={() => onReviewEndRequest(item.id)}>{item.status === "待审核" ? "审核" : "查看"}</PlaceholderAction></td>
      </tr>)}</tbody></table></div> : <EmptyState title="暂无符合条件的结束申请" />}
    </TableFrame>
  </>;
}

function ContinuationRequestReviewPane({ onReviewContinuationRequest, continuationRequests }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState(currentTerm);
  const [status, setStatus] = useState("待审核");
  const rows = useMemo(() => continuationRequests.filter((item) => (
    (item.club.includes(query) || item.leader.includes(query))
    && item.targetTerm === term
    && (status === allOption || item.status === status)
  )), [continuationRequests, query, term, status]);
  const changed = Boolean(query || term !== currentTerm || status !== "待审核");

  return <>
    <FilterBar changed={changed} onReset={() => { setQuery(""); setTerm(currentTerm); setStatus("待审核"); }}>
      <SelectField label="目标学期" value={term} onChange={setTerm} options={termOptions} />
      <SearchField value={query} onChange={setQuery} placeholder="搜索社团名称、学生社长" />
      <SelectField label="审核情况" value={status} onChange={setStatus} options={[allOption, "待审核", "已通过", "已退回"]} />
    </FilterBar>
    <TableFrame count={rows.length}>
      {rows.length ? <div className="table-scroll"><table className="continuation-requests-table"><thead><tr>
        <th>原社团</th><th>目标学期</th><th>学生社长</th><th>保留成员与招新</th><th>提交时间</th><th>审核情况</th><th className="action-cell">操作</th>
      </tr></thead><tbody>{rows.map((item) => <tr key={item.id}>
        <td><div className="cell-stack"><strong>{item.club}</strong><span>{item.originalTerm} · {item.category}</span></div></td>
        <td>{item.targetTerm}</td>
        <td><PersonCell name={item.leader} detail={item.grade} /></td>
        <td>{item.retainedMembers} 人保留 · {item.continueRecruiting ? "继续招新" : "不继续招新"}</td>
        <td>{item.submittedAt}</td>
        <td><StatusBadge value={item.status} /></td>
        <td className="action-cell"><PlaceholderAction onClick={() => onReviewContinuationRequest(item.id)}>{item.status === "待审核" ? "审核" : "查看"}</PlaceholderAction></td>
      </tr>)}</tbody></table></div> : <EmptyState title="暂无符合条件的延续申请" />}
    </TableFrame>
  </>;
}

export function ApplicationsPage({ onReviewApplication, onReviewEndRequest, onReviewContinuationRequest, applications, endRequests, continuationRequests }) {
  const [reviewType, setReviewType] = useState("application");
  return <>
    <ReviewTabs value={reviewType} onChange={setReviewType} applications={applications} endRequests={endRequests} continuationRequests={continuationRequests} />
    {reviewType === "application"
      ? <ApplicationReviewPane onReviewApplication={onReviewApplication} applications={applications} />
      : reviewType === "end"
        ? <EndRequestReviewPane onReviewEndRequest={onReviewEndRequest} />
        : <ContinuationRequestReviewPane onReviewContinuationRequest={onReviewContinuationRequest} continuationRequests={continuationRequests} />}
  </>;
}

export function ApplicationReviewDetailPage({ application, onClose, onPlaceholder, queuePosition, queueTotal, onCompleted }) {
  if (!application) return <EmptyState title="未找到社团申报" />;
  const [capacity, setCapacity] = useState(application.capacity);
  const [result, setResult] = useState(null);
  const [timeline, setTimeline] = useState(application.approvalHistory ?? [{ action: "提交申报", actor: application.operator, time: application.submittedAt, detail: application.submittedBy }]);
  const [changes, setChanges] = useState([]);
  const [venueValue, setVenueValue] = useState(application.venueText);
  const [venueSource, setVenueSource] = useState(application.venueSource ?? "填写说明");
  const [venueArrangement, setVenueArrangement] = useState(application.venueArrangement ?? "");
  const [venueArrangementSource, setVenueArrangementSource] = useState(application.venueArrangementSource ?? "填写说明");
  const status = result?.status ?? application.status;
  const adjustCapacity = (nextValue) => {
    const previousValue = capacity;
    setCapacity(nextValue);
    setChanges((items) => [...items, { field: "计划人数上限", before: `${previousValue} 人`, after: `${nextValue} 人`, actor: currentReviewerName, time: approvalTime() }]);
  };
  const adjustVenue = (nextValue, fieldLabel, source) => {
    const isArrangement = application.venueType === "协助需求";
    const previousValue = isArrangement ? venueArrangement || "未安排" : venueValue;
    if (isArrangement) setVenueArrangement(nextValue);
    else { setVenueValue(nextValue); setVenueSource(source); }
    if (isArrangement) setVenueArrangementSource(source);
    setChanges((items) => [...items, { field: fieldLabel, before: previousValue, after: `${nextValue}（${source}）`, actor: currentReviewerName, time: approvalTime() }]);
  };
  const decide = ({ action, status: nextStatus, reason = "" }) => {
    setResult({ status: nextStatus });
    setTimeline((items) => [...items, { action: action === "通过" ? "审核通过" : "审核退回", actor: currentReviewerName, time: approvalTime(), detail: reason }]);
    onCompleted?.(nextStatus, action === "通过" ? "审核通过" : "审核退回", reason);
    onPlaceholder(action === "通过" ? `已通过“${application.name}”，已进入下一条待审核申报` : `已退回“${application.name}”，已进入下一条待审核申报`);
  };

  return <ReviewWorkbench kind="社团申报审核" title={application.name} status={status} onClose={onClose} entries={timeline} changes={changes} proxy={application.proxyReview} queuePosition={queuePosition} queueTotal={queueTotal} footer={<ReviewDecisionFooter status={status} onDecision={decide} />}>
      <section className="review-object-context">
        <AppIcon icon={FileText} size={22} weight="duotone" />
        <div><strong>{application.name}</strong><span>{application.term} · {application.category}</span></div>
      </section>
      <section className="review-info-group reviewer-info-group">
        <div className="review-info-group-title"><strong>申报人信息</strong></div>
        <div className="review-detail-grid">
          <DetailField label="申报学生">{application.applicant}</DetailField>
          <DetailField label="所在班级">{application.className}</DetailField>
          <DetailField label="提交方式">{application.submittedBy}</DetailField>
          <DetailField label="提交时间">{application.submittedAt}</DetailField>
        </div>
      </section>

      <ApplicationReviewSubmission application={application} capacity={capacity} originalCapacity={application.capacity} editable={status === "待审核"} onAdjustCapacity={adjustCapacity} venueValue={venueValue} venueSource={venueSource} venueArrangement={venueArrangement} venueArrangementSource={venueArrangementSource} onAdjustVenue={adjustVenue} onPlaceholder={onPlaceholder} />

  </ReviewWorkbench>;
}

export function EndRequestReviewDetailPage({ request, onClose, onPlaceholder }) {
  if (!request) return <EmptyState title="未找到结束申请" />;
  const [result, setResult] = useState(null);
  const [timeline, setTimeline] = useState([{ action: "提交结束申请", actor: request.leader, time: request.submittedAt, detail: "学生社长" }]);
  const status = result?.status ?? request.status;
  const decide = ({ action, status: nextStatus, reason = "" }) => {
    setResult({ status: nextStatus });
    setTimeline((items) => [...items, { action, actor: "当前审核人", time: approvalTime(), detail: reason || (action === "通过" ? "确认提前结束本学期社团" : "") }]);
    onPlaceholder(action === "通过" ? `已演示通过“${request.club}”的结束申请` : `已演示退回“${request.club}”的结束申请`);
  };

  return <ReviewWorkbench kind="结束申请审核" title={request.club} status={status} onClose={onClose} entries={timeline} proxy={request.proxyReview} footer={<ReviewDecisionFooter status={status} onDecision={decide} />}>
      <section className="review-object-context">
        <AppIcon icon={SealCheck} size={22} weight="duotone" />
        <div><strong>{request.club}</strong><span>{request.term} · {request.category}</span></div>
      </section>
      <section className="review-workbench-section">
        <h3>社团与申请信息</h3>
        <div className="review-detail-grid">
          <DetailField label="学生社长">{request.leader} · {request.grade}</DetailField>
          <DetailField label="当前成员">{request.members} 人</DetailField>
          <DetailField label="已记录活动">{request.activities} 场</DetailField>
          <DetailField label="提交时间">{request.submittedAt}</DetailField>
          <DetailField label="申请原因" wide>{request.reason}</DetailField>
        </div>
      </section>
  </ReviewWorkbench>;
}

export function ContinuationRequestReviewDetailPage({ request, onClose, onCompleted, onPlaceholder }) {
  if (!request) return <EmptyState title="未找到延续申请" />;
  const [capacity, setCapacity] = useState(request.capacity);
  const [result, setResult] = useState(null);
  const [timeline, setTimeline] = useState(request.approvalHistory ?? [{ action: "提交延续申请", actor: request.leader, time: request.submittedAt, detail: "学生社长" }]);
  const [changes, setChanges] = useState([]);
  const status = result?.status ?? request.status;
  const venueType = request.venueType ?? (request.venueMode === "library" ? "拟用场地" : request.venueMode === "description" ? "协助需求" : request.venueMode ?? "未填写");
  const venueText = request.venueText ?? request.venueNeed ?? "未填写";
  const [venueValue, setVenueValue] = useState(venueText);
  const [venueSource, setVenueSource] = useState(request.venueSource ?? "填写说明");
  const [venueArrangement, setVenueArrangement] = useState(request.venueArrangement ?? "");
  const [venueArrangementSource, setVenueArrangementSource] = useState(request.venueArrangementSource ?? "填写说明");
  const application = {
    name: request.club,
    category: request.category,
    phone: request.phone ?? "未填写",
    introduction: request.introduction ?? "未填写",
    recruitment: request.recruitment ?? "未填写",
    venueType,
    venueText,
    materials: [
      { label: "招新海报", value: request.posterName ?? "未上传", kind: "附件" },
      { label: "活动计划", value: request.plan ?? "未填写", kind: "填写内容" },
    ],
  };
  const adjustCapacity = (nextValue) => {
    const previousValue = capacity;
    setCapacity(nextValue);
    setChanges((items) => [...items, { field: "计划人数上限", before: `${previousValue} 人`, after: `${nextValue} 人`, actor: currentReviewerName, time: approvalTime() }]);
  };
  const adjustVenue = (nextValue, fieldLabel, source) => {
    const needsArrangement = venueType === "协助需求";
    const previousValue = needsArrangement ? venueArrangement || "未安排" : venueValue;
    if (needsArrangement) { setVenueArrangement(nextValue); setVenueArrangementSource(source); }
    else { setVenueValue(nextValue); setVenueSource(source); }
    setChanges((items) => [...items, { field: fieldLabel, before: previousValue, after: `${nextValue}（${source}）`, actor: currentReviewerName, time: approvalTime() }]);
  };
  const decide = ({ action, status: nextStatus, reason = "" }) => {
    const reviewAction = action === "通过" ? "审核通过" : "审核退回";
    setResult({ status: nextStatus });
    setTimeline((items) => [...items, { action: reviewAction, actor: currentReviewerName, time: approvalTime(), detail: reason || (action === "通过" ? `确认延续至${request.targetTerm}` : "") }]);
    onCompleted?.(nextStatus, reviewAction, reason);
    onPlaceholder(action === "通过" ? `已确认“${request.club}”延续至${request.targetTerm}` : `已退回“${request.club}”的延续申请`);
  };

  return <ReviewWorkbench kind="延续申请审核" title={request.club} status={status} onClose={onClose} entries={timeline} changes={changes} footer={<ReviewDecisionFooter status={status} onDecision={decide} />}>
    <section className="review-object-context">
      <AppIcon icon={SealCheck} size={22} weight="duotone" />
      <div><strong>{request.club}</strong><span>{request.originalTerm} → {request.targetTerm}</span></div>
    </section>
    <section className="review-info-group reviewer-info-group">
      <div className="review-info-group-title"><strong>申请人信息</strong></div>
      <div className="review-detail-grid">
        <DetailField label="学生社长">{request.leader} · {request.grade}</DetailField>
        <DetailField label="提交时间">{request.submittedAt}</DetailField>
      </div>
    </section>
    <section className="review-info-group submission-info-group continuation-review-content">
      <section className="continuation-review-stage"><div className="continuation-review-stage-head"><span className="continuation-review-stage-icon plan"><AppIcon icon={UsersThree} size={16} weight="duotone" /></span><div><h3>延续安排</h3><p>学生社长发起延续时沿用本人，不可在申请中更换。</p></div></div><div className="review-detail-grid">
        <DetailField label="下一学期学生社长">{request.leader} · {request.grade}（申请人，延续时沿用）</DetailField>
        <DetailField label="拟保留成员">{request.retainedMembers} 人</DetailField>
        <DetailField label="招新安排">{request.continueRecruiting ? `继续招新 · 可招 ${Math.max(0, capacity - request.retainedMembers)} 人` : "不继续招新"}</DetailField>
      </div></section>
    </section>
    <ApplicationReviewSubmission application={application} capacity={capacity} originalCapacity={request.capacity} editable={status === "待审核"} onAdjustCapacity={adjustCapacity} venueValue={venueValue} venueSource={venueSource} venueArrangement={venueArrangement} venueArrangementSource={venueArrangementSource} onAdjustVenue={adjustVenue} onPlaceholder={onPlaceholder} />
  </ReviewWorkbench>;
}

export function CreditReviewDetailPage({
  credit,
  queuePosition,
  queueTotal,
  onClose,
  onCompleted,
  onRevoke,
  onModifyResult,
  onPlaceholder,
}) {
  if (!credit) return <EmptyState title="未找到学分申请" />;

  const isLeader = credit.role === "团长" || credit.role === "社长";
  const systemAttendanceHours = isLeader ? (credit.facts?.activitiesHours ?? 9.5) : (credit.facts?.attendedHours ?? 6.5);
  const [teacherHours, setTeacherHours] = useState(credit.teacherHours ?? (credit.leaderHours ?? credit.appliedHours));

  const calcCredit = (hours) => {
    const h = Number(hours) || 0;
    if (h < 4) return 0.5;
    if (h < 6) return 1.0;
    if (h < 8) return 1.5;
    if (h < 10) return 2.0;
    return 2.5;
  };

  const [comment, setComment] = useState(credit.teacherComment ?? (credit.status === "已通过" ? "出勤记录与申报材料完整，予以通过。" : ""));
  const [mode, setMode] = useState(null); // null | 'return' | 'modify' | 'confirmRevoke'
  const [returnReason, setReturnReason] = useState(credit.returnReason ?? "");
  const [result, setResult] = useState(null);
  const [timeline, setTimeline] = useState(credit.approvalHistory ?? []);
  const [changes, setChanges] = useState([]);

  const status = result?.status ?? credit.status;

  const [declarationExpanded, setDeclarationExpanded] = useState(true);

  const decidePass = () => {
    const creditVal = calcCredit(teacherHours);
    const newAction = "教师审核通过";
    const detail = comment.trim() || `核定 ${teacherHours} 小时（${creditVal} 学分）`;
    setResult({ status: "已通过" });
    setTimeline((items) => [...items, { action: newAction, actor: currentReviewerName, time: approvalTime(), detail }]);
    if (Number(teacherHours) !== Number(isLeader ? credit.appliedHours : (credit.leaderHours ?? credit.appliedHours))) {
      setChanges((items) => [...items, {
        field: "最终核定学时",
        before: `${isLeader ? credit.appliedHours : (credit.leaderHours ?? credit.appliedHours)} 小时`,
        after: `${teacherHours} 小时`,
        actor: currentReviewerName,
        time: approvalTime()
      }]);
    }
    onCompleted?.("已通过", newAction, {
      teacherHours: Number(teacherHours),
      teacherCredit: creditVal,
      comment: detail,
    });
    onPlaceholder(`已通过“${credit.student}”的学分申请（${teacherHours}小时 / ${creditVal}学分）`);
  };

  const decideReturn = () => {
    if (!returnReason.trim()) return;
    const newAction = "教师审核退回";
    setResult({ status: "已退回" });
    setTimeline((items) => [...items, { action: newAction, actor: currentReviewerName, time: approvalTime(), detail: `退回原因：${returnReason.trim()}` }]);
    onCompleted?.("已退回", newAction, {
      returnReason: returnReason.trim(),
    });
    onPlaceholder(`已退回“${credit.student}”的学分申请`);
  };

  const handleRevoke = () => {
    setResult({ status: "待审核" });
    setTimeline((items) => [...items, {
      action: "撤销审核结果",
      actor: currentReviewerName,
      time: approvalTime(),
      detail: `撤销原审核结果（${status}），恢复为待审核`
    }]);
    setMode(null);
    onRevoke?.(credit.id);
  };

  const handleSaveModification = () => {
    const creditVal = calcCredit(teacherHours);
    const prevHours = credit.teacherHours ?? credit.appliedHours;
    if (Number(teacherHours) !== Number(prevHours)) {
      setChanges((items) => [...items, {
        field: "修改核定学时",
        before: `${prevHours} 小时`,
        after: `${teacherHours} 小时`,
        actor: currentReviewerName,
        time: approvalTime()
      }]);
    }
    setTimeline((items) => [...items, {
      action: "修改审核结果",
      actor: currentReviewerName,
      time: approvalTime(),
      detail: `调整核定为 ${teacherHours} 小时（${creditVal} 学分）` + (comment.trim() ? `；意见：${comment.trim()}` : "")
    }]);
    setMode(null);
    onModifyResult?.(credit.id, {
      teacherHours: Number(teacherHours),
      teacherCredit: creditVal,
      comment: comment.trim() || `核定 ${teacherHours} 小时`,
    });
  };

  const renderFooter = () => {
    if (status === "待审核") {
      if (mode === "return") {
        return (
          <footer className="review-workbench-footer">
            <div className="return-reason-editor">
              <label>退回原因
                <textarea
                  autoFocus
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="请说明退回原因及需要学生或社长补充的内容..."
                />
              </label>
              <div className="review-footer-actions">
                <button
                  type="button"
                  className="review-return-action"
                  disabled={!returnReason.trim()}
                  onClick={decideReturn}
                >
                  确认退回
                </button>
                <button
                  type="button"
                  className="text-action"
                  onClick={() => setMode(null)}
                >
                  取消
                </button>
              </div>
            </div>
          </footer>
        );
      }
      return (
        <footer className="review-workbench-footer">
          <span className="review-footer-tip">
            单级终审：审核通过后计入学分；退回后学生可修改原申报后重新提交。
          </span>
          <div className="review-footer-actions">
            <button
              type="button"
              className="review-return-action"
              onClick={() => setMode("return")}
            >
              退回
            </button>
            <button
              type="button"
              className="review-pass-action"
              onClick={decidePass}
            >
              通过
            </button>
          </div>
        </footer>
      );
    }

    if (mode === "confirmRevoke") {
      return (
        <footer className="review-workbench-footer">
          <div className="revoke-confirm-bar">
            <span className="revoke-warning-text">
              ⚠️ 确认撤销当前审核结果？撤销后该学分申请将恢复为【待审核】状态，审批动态将保留撤销记录。
            </span>
            <div className="review-footer-actions">
              <button
                type="button"
                className="btn-revoke-danger"
                onClick={handleRevoke}
              >
                确认撤销
              </button>
              <button
                type="button"
                className="text-action"
                onClick={() => setMode(null)}
              >
                取消
              </button>
            </div>
          </div>
        </footer>
      );
    }

    if (mode === "modify") {
      return (
        <footer className="review-workbench-footer">
          <span className="review-footer-tip">
            正在修改审核结果，修改后将记录关键变更并更新认定结果。
          </span>
          <div className="review-footer-actions">
            <button
              type="button"
              className="text-action"
              onClick={() => setMode(null)}
            >
              取消
            </button>
            <button
              type="button"
              className="review-pass-action"
              onClick={handleSaveModification}
            >
              保存修改
            </button>
          </div>
        </footer>
      );
    }

    return (
      <footer className="review-workbench-footer completed-with-actions">
        <div className="completed-result-summary">
          <span className="summary-label">审核结果：</span>
          <StatusBadge value={status} />
          {status === "已通过" && (
            <span className="summary-hours-pill">
              最终核定 <strong>{credit.teacherHours ?? teacherHours}</strong> 小时 · 折算 <strong>{credit.suggestedCredit ?? calcCredit(teacherHours)}</strong> 学分
            </span>
          )}
        </div>
        <div className="review-footer-actions">
          {status === "已通过" && (
            <button
              type="button"
              className="btn-action-outline"
              onClick={() => setMode("modify")}
            >
              <AppIcon icon={PencilSimple} size={14} />
              <span>修改审核结果</span>
            </button>
          )}
          <button
            type="button"
            className="btn-action-outline danger-outline"
            onClick={() => setMode("confirmRevoke")}
          >
            <AppIcon icon={ArrowCounterClockwise} size={14} />
            <span>撤销重新审核</span>
          </button>
        </div>
      </footer>
    );
  };

  const leaderReviewSummary = !isLeader ? (
    <div className="leader-audit-summary">
      <div className="leader-audit-summary-head">
        <strong>社长初审</strong>
        <span>{credit.leaderAudit?.auditor ?? "周奕辰"}（社长）</span>
        <span>初审于 {credit.leaderAudit?.auditedAt ?? credit.submittedAt}</span>
        <span className="leader-audit-summary-hours">核定 <b>{credit.leaderHours ?? credit.appliedHours}</b> 小时</span>
        {credit.leaderHours != null && Number(credit.leaderHours) !== Number(credit.appliedHours) && (
          <span className="tag-adjusted">较申报已调整</span>
        )}
      </div>
      <p>“{credit.leaderAudit?.comment ?? "本学期常规对弈出勤良好，同意按核定学时认定。"}”</p>
    </div>
  ) : null;

  return (
    <ReviewWorkbench
      kind="社团学分审核"
      title={null}
      status={status}
      onClose={onClose}
      entries={timeline}
      changes={changes}
      queuePosition={queuePosition}
      queueTotal={queueTotal}
      hideSubmissionDetail
      footer={renderFooter()}
    >
      <div className="credit-review-detail-content">
        <section className="credit-submission-context">
          <div className="credit-submission-person">
            <strong>{credit.student} · {credit.className}</strong>
            <span className="credit-role-tag">{isLeader ? "学生社长" : "团员"}</span>
            <span>提交于 {credit.submittedAt}</span>
          </div>
          <div className="credit-submission-club">所属社团：<strong>{credit.club}</strong><i>·</i>社团类型：{credit.category}类社团</div>
        </section>

        {/* 客观事实展示：团员参与足迹 vs 社长组织情况 */}
        {!isLeader ? (
          <section className="review-info-group">
            <div className="review-info-group-title">
              <strong>社团参与足迹</strong>
              <span className="group-sub-desc">系统出勤事实与成员分享记录</span>
            </div>
            <div className="credit-facts-grid member-facts-grid">
              <div className="credit-fact-card">
                <span className="credit-fact-card-label">常规活动出勤</span>
                <div className="credit-fact-card-value">
                  <strong>{credit.facts?.attendedCount ?? 4}</strong> 场
                  <span className="credit-fact-sep">/</span>
                  <strong>{credit.facts?.attendedHours ?? 6.5}</strong> 小时
                </div>
              </div>
              <div className="credit-fact-card">
                <span className="credit-fact-card-label">精彩瞬间分享</span>
                <div className="credit-fact-card-value">
                  <strong>{credit.facts?.discussionsCount ?? 4}</strong> 次分享
                  <span className="credit-fact-badge-sub">含 {credit.facts?.featuredDiscussions ?? 1} 次社长精选 · 仅作参与参考</span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="review-info-group">
            <div className="review-info-group-title">
              <strong>社团组织情况</strong>
            </div>
            <div className="credit-facts-grid leader-facts-grid">
              <div className="credit-fact-card">
                <span className="credit-fact-card-label">组织开展常规活动</span>
                <div className="credit-fact-card-value">
                  <strong>{credit.facts?.activitiesCount ?? 6}</strong> 场
                  <span className="credit-fact-sep">/</span>
                  <strong>{credit.facts?.activitiesHours ?? 9.5}</strong> 小时
                </div>
              </div>
              <div className="credit-fact-card">
                <span className="credit-fact-card-label">活动考勤点名</span>
                <div className="credit-fact-card-value">
                  {credit.facts?.attendanceRequired === false ? (
                    <span className="credit-fact-badge-sub">无需考勤</span>
                  ) : (
                    <>
                      <strong>{credit.facts?.attendanceCount ?? 6}</strong> 场已点
                      <span className="credit-fact-badge-green">全部完成</span>
                    </>
                  )}
                </div>
              </div>
              <div className="credit-fact-card">
                <span className="credit-fact-card-label">活动记录整理</span>
                <div className="credit-fact-card-value">
                  <strong>{credit.facts?.recordsCount ?? 6}</strong> 篇已填
                  <span className="credit-fact-badge-green">全部完成</span>
                </div>
              </div>
              <div className="credit-fact-card">
                <span className="credit-fact-card-label">带领社团成员</span>
                <div className="credit-fact-card-value">
                  <strong>{credit.facts?.membersCount ?? 12}</strong> 人
                  <span className="credit-fact-badge-blue">正式团员</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 申报内容展示：全校统一学分申请表（申报学时 + 实践与成长总结 + 证明材料），支持整块收起/展开 */}
        <section className="review-info-group credit-declaration-group">
          <div className="review-info-group-title declaration-group-header">
            <div className="declaration-header-left">
              <strong>申报内容</strong>
              <span className="declaration-hours-summary">
                申报学时：<strong>{credit.appliedHours} 小时</strong>
                <span className="system-attendance-pill">系统出勤 {systemAttendanceHours} 小时</span>
              </span>
            </div>
            <button
              type="button"
              className="btn-applicant-toggle"
              onClick={() => setDeclarationExpanded((v) => !v)}
            >
              {declarationExpanded ? "收起申报详情 ▴" : "展开申报详情 ▾"}
            </button>
          </div>

          {declarationExpanded && (
            <div className="declaration-custom-fields-body">
              <div className="declaration-block-item">
                <span className="declaration-field-title">实践与成长总结</span>
                <div className="declaration-text-p">
                  {credit.summary || "按时完成本学期社团常规活动与实践任务。"}
                </div>
              </div>
              <div className="declaration-block-item has-divider">
                <span className="declaration-field-title">证明材料</span>
                <div className="declaration-text-p">
                  {credit.attachments?.length ? (
                    <div className="credit-att-chips">
                      {credit.attachments.map((att) => (
                        <button
                          key={att.name}
                          type="button"
                          className="credit-att-chip"
                          onClick={() => onPlaceholder(`正在预览证明材料：「${att.name}」`)}
                        >
                          <AppIcon icon={Paperclip} size={13} />
                          <span>{att.name}</span>
                          <small>预览材料</small>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="muted-value">未上传证明材料</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 学时认定：团员端将社长初审作为教师终审的紧凑依据 */}
        {(status === "待审核" || mode === "modify") ? (
          <section className="review-info-group teacher-decision-group">
            <div className="review-info-group-title">
              <strong>学分认定</strong>
              {mode === "modify" ? <span className="decision-action-badge">修改认定结果</span> : null}
            </div>
            <div className="teacher-decision-card">
              {leaderReviewSummary}
              <div className={`teacher-final-decision ${isLeader ? "is-leader" : ""}`}>
                {!isLeader ? <strong className="teacher-final-decision-title">教师终审</strong> : null}
                <div className="decision-form-row">
                  <label className="decision-label"><span className="req-star">*</span>核定学时</label>
                  <div className="decision-content hours-calc-row">
                    <div className="modern-input-group">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="30"
                        value={teacherHours}
                        onChange={(e) => setTeacherHours(e.target.value)}
                        className="modern-number-input"
                      />
                      <span className="modern-input-addon">小时</span>
                    </div>
                    <span className="calc-credit-pill">
                      计入 <strong>{calcCredit(teacherHours)}</strong> 学分
                    </span>
                  </div>
                </div>

                <div className="decision-form-row">
                  <label className="decision-label">教师意见</label>
                  <div className="decision-content">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="填写教师审核意见与认定说明..."
                      rows={2}
                      className="modern-textarea-input"
                    />
                    <div className="quick-comments-row">
                      <span className="quick-label">快捷参考：</span>
                      <button
                        type="button"
                        className="quick-comment-chip"
                        onClick={() => setComment(isLeader ? "带队活动组织规范，活动记录完整，予以通过认定。" : "出勤记录完整，申报内容与社长初审意见一致，同意核定。")}
                      >
                        {isLeader ? "带队活动规范，予以认定" : "同意社长初审意见"}
                      </button>
                      <button
                        type="button"
                        className="quick-comment-chip"
                        onClick={() => setComment("符合社团学时认定标准，予以通过。")}
                      >
                        符合认定标准，予以通过
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="review-info-group teacher-result-display-group">
            <div className="review-info-group-title">
              <strong>学分认定</strong>
              <StatusBadge value={status} />
            </div>
            <div className="recognition-result-card">
              {leaderReviewSummary}
              <div className={`teacher-result-content ${isLeader ? "is-leader" : ""}`}>
                {!isLeader ? <strong className="teacher-final-decision-title">教师终审</strong> : null}
                <div className="review-detail-grid">
                  <DetailField label="最终核定学时">
                    <span className="hours-highlight">
                      <strong>{credit.teacherHours ?? teacherHours} 小时</strong>
                      <span className="credit-pill">计入 {credit.suggestedCredit ?? calcCredit(teacherHours)} 学分</span>
                    </span>
                  </DetailField>
                  <DetailField label="审核教师">
                    {credit.teacherAudit?.auditor ?? currentReviewerName}
                  </DetailField>
                  <DetailField label="审核时间">
                    {credit.teacherAudit?.auditedAt ?? credit.submittedAt}
                  </DetailField>
                  <DetailField label={status === "已通过" ? "教师审核意见" : "退回原因"} wide>
                    <div className={`result-comment-block ${status === "已退回" ? "is-return" : ""}`}>
                      {status === "已通过"
                        ? (credit.teacherComment ?? credit.teacherAudit?.comment ?? "出勤记录与申报材料完整，予以通过。")
                        : (credit.returnReason ?? credit.teacherAudit?.returnReason ?? "缺少必要证明材料。")}
                    </div>
                  </DetailField>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </ReviewWorkbench>
  );
}

export function CreditsPage({ credits = creditSeed, onReviewCredit, onPlaceholder }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState(currentTerm);
  const [club, setClub] = useState(allOption);
  const [status, setStatus] = useState("待审核");
  const [role, setRole] = useState(allOption);
  const [adjusted, setAdjusted] = useState(allOption);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const rows = useMemo(() => credits.filter((item) => (
    item.student.includes(query)
    && item.term === term
    && (club === allOption || item.club === club)
    && (status === allOption || item.status === status)
    && (role === allOption || item.role === role)
    && (adjusted === allOption || item.adjusted === adjusted)
  )), [credits, query, term, club, status, role, adjusted]);

  const changed = Boolean(query || term !== currentTerm || club !== allOption || status !== "待审核" || role !== allOption || adjusted !== allOption);
  const reset = () => {
    setQuery("");
    setTerm(currentTerm);
    setClub(allOption);
    setStatus("待审核");
    setRole(allOption);
    setAdjusted(allOption);
  };

  const pendingCount = credits.filter((item) => item.term === term && item.status === "待审核").length;
  const passedCount = credits.filter((item) => item.term === term && item.status === "已通过").length;
  const returnedCount = credits.filter((item) => item.term === term && item.status === "已退回").length;
  const allCount = credits.filter((item) => item.term === term).length;

  return <>
    <div className="review-tabs" role="tablist" style={{ marginBottom: "16px" }}>
      <button
        type="button"
        className={status === "待审核" ? "active" : ""}
        onClick={() => setStatus("待审核")}
      >
        待审核 <span>{pendingCount}</span>
      </button>
      <button
        type="button"
        className={status === "已通过" ? "active" : ""}
        onClick={() => setStatus("已通过")}
      >
        已通过 <span>{passedCount}</span>
      </button>
      <button
        type="button"
        className={status === "已退回" ? "active" : ""}
        onClick={() => setStatus("已退回")}
      >
        已退回 <span>{returnedCount}</span>
      </button>
      <button
        type="button"
        className={status === allOption ? "active" : ""}
        onClick={() => setStatus(allOption)}
      >
        全部 <span>{allCount}</span>
      </button>
    </div>

    <FilterBar
      changed={changed}
      onReset={reset}
      advancedOpen={advancedOpen}
      onToggleAdvanced={() => setAdvancedOpen((value) => !value)}
      advanced={<>
        <SelectField label="学生在社团中的身份" value={role} onChange={setRole} options={uniqueOptions(credits, "role")} />
        <SelectField label="学时是否被社长调整" value={adjusted} onChange={setAdjusted} options={uniqueOptions(credits, "adjusted")} />
      </>}
    >
      <SelectField label="学期" value={term} onChange={setTerm} options={termOptions} />
      <SearchField value={query} onChange={setQuery} placeholder="搜索申请学生" />
      <SelectField label="所属社团" value={club} onChange={setClub} options={uniqueOptions(credits, "club")} />
    </FilterBar>
    <TableFrame count={rows.length}>
      {rows.length ? <div className="table-scroll"><table className="credits-table"><thead><tr>
        <th className="index-cell">序号</th><th>申请学生</th><th>所属社团</th><th>身份</th><th className="number-cell">学生申请学时</th><th className="number-cell">社长确认学时</th><th className="number-cell">按规则计算的学分</th><th>提交时间</th><th>审核情况</th><th className="action-cell">操作</th>
      </tr></thead><tbody>{rows.map((item, index) => <tr key={item.id}>
        <td className="index-cell">{index + 1}</td>
        <td className="main-cell">{item.student}</td>
        <td>{item.club}</td>
        <td>{item.role}</td>
        <td className="number-cell">{item.appliedHours} 小时</td>
        <td className="number-cell">{item.leaderHours !== null ? `${item.leaderHours} 小时` : <span className="muted-value" title="社长申请直接由教师审核">无需社长确认</span>}</td>
        <td className="number-cell strong-number">{item.suggestedCredit} 学分</td>
        <td>{item.submittedAt}</td>
        <td><StatusBadge value={item.status} /></td>
        <td className="action-cell">
          <button
            type="button"
            className="club-view-action"
            onClick={() => onReviewCredit ? onReviewCredit(item.id) : onPlaceholder("进入学分审核")}
          >
            {item.status === "待审核" ? "审核" : "查看"}
          </button>
        </td>
      </tr>)}</tbody></table></div> : <EmptyState title="暂无符合条件的学分申请" />}
    </TableFrame>
  </>;
}

export function ConfigPage({ onNavigate, onPlaceholder }) {
  const items = [
    { title: "基本设置", description: "设置社团申报、申请加入和学分申请时间，以及参与数量和活动规则", target: "basicSettings" },
    { title: "社团申报说明", description: "设置学生申报社团前可查看的申报规则、材料指引和咨询方式，并决定是否展示", target: "activityNotice" },
    { title: "表单设置", description: "设置社团申报、学分申请与活动开展材料的填写内容", target: "formSettings" },
    { title: "社团类别", description: "设置学生申报社团时可选择的类别，用于填报、筛选和数据统计", target: "categorySettings" },
    { title: "学分规则", description: "设置学生参加社团的认定学时如何换算为建议学分", target: "creditRules" },
  ];

  return (
    <section className="config-table" aria-label="学生社团配置项">
      <div className="config-head">
        <span>设置类型</span>
        <span>说明</span>
        <span className="config-th-action">操作</span>
      </div>
      {items.map(({ title, description, target }) => (
        <div className="config-row" key={title}>
          <div className="config-type">
            <span className="config-title">{title}</span>
          </div>
          <p className="config-desc">{description}</p>
          <div className="config-action-wrap">
            <button
              type="button"
              className="config-action"
              aria-label={`设置${title}`}
              onClick={() => target ? onNavigate(target) : onPlaceholder(`这里将进入${title}的设置页面，本轮暂未展开`)}
            >
              设置
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
