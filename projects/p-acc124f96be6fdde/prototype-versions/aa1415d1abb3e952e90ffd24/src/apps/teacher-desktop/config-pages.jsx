import { useCallback, useEffect, useState } from "react";
import {
  ConfigProvider,
  DatePicker,
  InputNumber,
  Switch as AntSwitch,
  Checkbox as AntCheckbox,
  Tag as AntTag,
  Input as AntInput,
  Modal as AntModal,
  Drawer as AntDrawer,
  Select as AntSelect,
  Tooltip as AntTooltip,
  Popconfirm as AntPopconfirm,
} from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CalendarBlank,
  Check,
  DotsSixVertical,
  DownloadSimple,
  FileText,
  ImageSquare,
  Info,
  LinkSimple,
  ListBullets,
  ListChecks,
  ListNumbers,
  Lock,
  MagnifyingGlass,
  PencilSimple,
  Phone,
  Plus,
  Quotes,
  SlidersHorizontal,
  Table,
  TextB,
  TextItalic,
  TextT,
  TextUnderline,
  Trash,
  UploadSimple,
  User,
  Users,
} from "@phosphor-icons/react";
import { AppIcon } from "./shell.jsx";

dayjs.locale("zh-cn");

export function Switch({ checked, onChange, disabled = false, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      disabled={disabled}
      className={`ui-switch ${checked ? "is-checked" : ""} ${disabled ? "is-disabled" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && onChange) onChange(!checked);
      }}
    >
      <span className="ui-switch-handle" />
    </button>
  );
}

export function ToggleRow({ title, description, checked = false, onChange, disabled = false }) {
  return (
    <div
      className={`toggle-row ${disabled ? "is-disabled" : ""}`}
      onClick={() => {
        if (!disabled && onChange) onChange(!checked);
      }}
    >
      <span>
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <Switch checked={checked} onChange={onChange} disabled={disabled} ariaLabel={title} />
    </div>
  );
}

function SectionHeading({ title, description, icon: Icon, badge }) {
  return (
    <div className="setting-card-header">
      <div className="setting-card-title-wrap">
        {Icon ? (
          <span className="setting-card-icon">
            <AppIcon icon={Icon} size={18} />
          </span>
        ) : null}
        <div className="setting-card-titles">
          <div className="setting-card-title-row">
            <h2>{title}</h2>
            {badge ? <span className="setting-card-badge">{badge}</span> : null}
          </div>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, hint, children, wide = false }) {
  return <label className={`setting-field ${wide ? "wide" : ""}`}>
    <span>{label}</span>
    {children}
    {hint ? <small>{hint}</small> : null}
  </label>;
}

function EffectNotice({ children = "建议在学生社团开放前确认设置。后续修改只影响新产生的数据，不改写已形成的业务记录。" }) {
  return <div className="settings-effect-note"><AppIcon icon={Info} size={15} /><span>{children}</span></div>;
}

function DateRangeField({ label, hint, defaultValue }) {
  return (
    <label className="setting-field">
      <span>{label}</span>
      <div className="date-picker-box">
        <AppIcon icon={CalendarBlank} size={15} />
        <input defaultValue={defaultValue} />
      </div>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function BasicSettingsPage({ initialEditing = false, onNotify, onSetHeaderAction, onOpenEdit, onReturnToView, hasBusinessFacts = true }) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [attendanceEnabled, setAttendanceEnabled] = useState(true);
  const [materialEnabled, setMaterialEnabled] = useState(false);

  // Time settings & unlimited flags
  const [applyUnlimited, setApplyUnlimited] = useState(false);
  const [applyRange, setApplyRange] = useState([dayjs("2026-08-20 08:00"), dayjs("2026-09-05 18:00")]);

  const [joinUnlimited, setJoinUnlimited] = useState(false);
  const [joinRange, setJoinRange] = useState([dayjs("2026-09-08 08:00"), dayjs("2026-10-09 18:00")]);

  const [freezeUnlimited, setFreezeUnlimited] = useState(false);
  const [freezeDate, setFreezeDate] = useState(dayjs("2026-10-16 18:00"));

  const [creditUnlimited, setCreditUnlimited] = useState(false);
  const [creditRange, setCreditRange] = useState([dayjs("2026-12-15 08:00"), dayjs("2027-01-08 18:00")]);

  // Quantity limits & unlimited flags
  const [maxApplyUnlimited, setMaxApplyUnlimited] = useState(false);
  const [maxApply, setMaxApply] = useState(1);

  const [maxJoinUnlimited, setMaxJoinUnlimited] = useState(false);
  const [maxJoin, setMaxJoin] = useState(2);
  const [impactDialogOpen, setImpactDialogOpen] = useState(false);

  const getChangedItems = useCallback(() => {
    const formatRange = (range) => range?.map((value) => value?.format("YYYY-MM-DD HH:mm") || "").join("|") || "";
    const changed = [];
    if (applyUnlimited || formatRange(applyRange) !== "2026-08-20 08:00|2026-09-05 18:00") changed.push("社团申报时间");
    if (joinUnlimited || formatRange(joinRange) !== "2026-09-08 08:00|2026-10-09 18:00") changed.push("入团报名时间");
    if (freezeUnlimited || freezeDate?.format("YYYY-MM-DD HH:mm") !== "2026-10-16 18:00") changed.push("成员名单确认截止时间");
    if (creditUnlimited || formatRange(creditRange) !== "2026-12-15 08:00|2027-01-08 18:00") changed.push("学分申请时间");
    if (maxApplyUnlimited || maxApply !== 1) changed.push("每名学生最多发起社团数");
    if (maxJoinUnlimited || maxJoin !== 2) changed.push("每名学生最多加入社团数");
    if (!attendanceEnabled) changed.push("活动签到");
    if (materialEnabled) changed.push("要求补充活动开展材料");
    return changed;
  }, [applyRange, applyUnlimited, attendanceEnabled, creditRange, creditUnlimited, freezeDate, freezeUnlimited, joinRange, joinUnlimited, materialEnabled, maxApply, maxApplyUnlimited, maxJoin, maxJoinUnlimited]);

  const getTimeWarnings = useCallback(() => {
    const now = dayjs();
    const warnings = [];
    const isReopened = (originalEnd, unlimited, range) => dayjs(originalEnd).isBefore(now) && (unlimited || range?.[1]?.isAfter(now));
    if (isReopened("2026-09-05 18:00", applyUnlimited, applyRange)) warnings.push("社团申报时间将重新开放。");
    if (isReopened("2026-10-09 18:00", joinUnlimited, joinRange)) warnings.push("入团报名时间将重新开放。");
    if (freezeDate && !freezeUnlimited && freezeDate.isBefore(now) && freezeDate.format("YYYY-MM-DD HH:mm") !== "2026-10-16 18:00") warnings.push("待处理的入团申请将失效，失效后不会自动恢复。");
    return warnings;
  }, [applyRange, applyUnlimited, freezeDate, freezeUnlimited, joinRange, joinUnlimited]);

  const completeSave = useCallback(() => {
    setImpactDialogOpen(false);
    onNotify("已保存基本设置修改");
    if (onReturnToView) onReturnToView();
    else setIsEditing(false);
  }, [onNotify, onReturnToView]);

  const handleSave = useCallback(() => {
    if (getChangedItems().length > 0 && hasBusinessFacts) {
      setImpactDialogOpen(true);
      return;
    }
    completeSave();
  }, [completeSave, getChangedItems, hasBusinessFacts]);

  useEffect(() => {
    if (!onSetHeaderAction) return undefined;
    if (isEditing) {
      onSetHeaderAction(
        <>
          <button type="button" className="btn-header-outline" onClick={() => onReturnToView ? onReturnToView() : setIsEditing(false)}>
            取消
          </button>
          <button type="button" className="btn-header-primary" onClick={handleSave}>
            保存修改
          </button>
        </>
      );
    } else {
      onSetHeaderAction(
        <button type="button" className="btn-header-primary" onClick={() => onOpenEdit ? onOpenEdit() : setIsEditing(true)}>
          编辑设置
        </button>
      );
    }
    return () => onSetHeaderAction(null);
  }, [handleSave, isEditing, onOpenEdit, onReturnToView, onSetHeaderAction]);

  const enabledRulesCount = [attendanceEnabled, materialEnabled].filter(Boolean).length;

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#2b66ff",
          colorLink: "#2b66ff",
          borderRadius: 4,
          fontFamily: "inherit",
        },
      }}
    >
      <div className="settings-page">
        <div className="settings-centered-container">
          <EffectNotice>
            建议在社团开放前确认本学期设置。已开始的业务仍按原设置办理。
          </EffectNotice>

          <div className="settings-cards-stack">
            {/* 卡片 1：时间设置 */}
            <section className="settings-card-module" data-proto-id="basic-settings-time">
              <SectionHeading
                icon={CalendarBlank}
                title="时间设置"
                description="分别设置各项社团业务的开放时间；如不限制具体时间，可直接勾选“不限时间”。"
                badge={!isEditing ? "4项时间规则" : null}
              />
              <div className="setting-tiles-grid">
                {/* 1. 社团申报时间 */}
                <div className="setting-tile-card">
                  <div className="setting-tile-header">
                    <span className="setting-tile-title">社团申报时间</span>
                    {isEditing ? (
                      <AntCheckbox
                        checked={applyUnlimited}
                        onChange={(e) => setApplyUnlimited(e.target.checked)}
                      >
                        不限时间
                      </AntCheckbox>
                    ) : null}
                  </div>
                  {isEditing ? (
                    applyUnlimited ? (
                      <AntInput
                        disabled
                        value="长期开放（不限制申报截止时间）"
                        prefix={<AppIcon icon={CalendarBlank} size={15} style={{ color: "#9ca3af" }} />}
                        style={{ height: 36, background: "#f8fafc", color: "#6b7280" }}
                      />
                    ) : (
                      <DatePicker.RangePicker
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                        value={applyRange}
                        onChange={(val) => setApplyRange(val)}
                        style={{ width: "100%", height: 36 }}
                        placeholder={["开始时间", "结束时间"]}
                      />
                    )
                  ) : (
                    <div className="readonly-val-row">
                      {applyUnlimited ? (
                        <>
                          <AntTag color="blue" variant="filled">不限时间</AntTag>
                          <span className="readonly-val-desc">学期内长期开放申报</span>
                        </>
                      ) : (
                        <>
                          <AppIcon icon={CalendarBlank} size={15} style={{ color: "#2b66ff" }} />
                          <span className="readonly-val-strong">
                            {applyRange && applyRange[0] && applyRange[1]
                              ? `${applyRange[0].format("YYYY-MM-DD HH:mm")} ~ ${applyRange[1].format("YYYY-MM-DD HH:mm")}`
                              : "未设置"}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="setting-tile-hint">学生发起并提交新社团申报的时间窗口</div>
                </div>

                {/* 2. 入团报名时间 */}
                <div className="setting-tile-card">
                  <div className="setting-tile-header">
                    <span className="setting-tile-title">入团报名时间</span>
                    {isEditing ? (
                      <AntCheckbox
                        checked={joinUnlimited}
                        onChange={(e) => setJoinUnlimited(e.target.checked)}
                      >
                        不限时间
                      </AntCheckbox>
                    ) : null}
                  </div>
                  {isEditing ? (
                    joinUnlimited ? (
                      <AntInput
                        disabled
                        value="长期开放（学生学期内可随时报名）"
                        prefix={<AppIcon icon={CalendarBlank} size={15} style={{ color: "#9ca3af" }} />}
                        style={{ height: 36, background: "#f8fafc", color: "#6b7280" }}
                      />
                    ) : (
                      <DatePicker.RangePicker
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                        value={joinRange}
                        onChange={(val) => setJoinRange(val)}
                        style={{ width: "100%", height: 36 }}
                        placeholder={["开始时间", "结束时间"]}
                      />
                    )
                  ) : (
                    <div className="readonly-val-row">
                      {joinUnlimited ? (
                        <>
                          <AntTag color="blue" variant="filled">不限时间</AntTag>
                          <span className="readonly-val-desc">学生学期内可随时报名</span>
                        </>
                      ) : (
                        <>
                          <AppIcon icon={CalendarBlank} size={15} style={{ color: "#2b66ff" }} />
                          <span className="readonly-val-strong">
                            {joinRange && joinRange[0] && joinRange[1]
                              ? `${joinRange[0].format("YYYY-MM-DD HH:mm")} ~ ${joinRange[1].format("YYYY-MM-DD HH:mm")}`
                              : "未设置"}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="setting-tile-hint">学生可在此期间报名；申请未通过时，也可重新报名。结束后不再接受新的申请。</div>
                </div>

                {/* 3. 成员名单确认截止时间 */}
                <div className="setting-tile-card">
                  <div className="setting-tile-header">
                    <span className="setting-tile-title">成员名单确认截止时间</span>
                    {isEditing ? (
                      <AntCheckbox
                        checked={freezeUnlimited}
                        onChange={(e) => setFreezeUnlimited(e.target.checked)}
                      >
                        不设截止时间
                      </AntCheckbox>
                    ) : null}
                  </div>
                  {isEditing ? (
                    freezeUnlimited ? (
                      <AntInput
                        disabled
                        value="不设成员名单确认截止时间（社长可在本学期内持续审核申请）"
                        prefix={<AppIcon icon={CalendarBlank} size={15} style={{ color: "#9ca3af" }} />}
                        style={{ height: 36, background: "#f8fafc", color: "#6b7280" }}
                      />
                    ) : (
                      <DatePicker
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                        value={freezeDate}
                        onChange={(val) => setFreezeDate(val)}
                        style={{ width: "100%", height: 36 }}
                        placeholder="选择成员名单确认截止时间"
                      />
                    )
                  ) : (
                    <div className="readonly-val-row">
                      {freezeUnlimited ? (
                        <>
                          <AntTag color="blue" variant="filled">不设截止时间</AntTag>
                          <span className="readonly-val-desc">社长可在本学期内持续审核已提交申请</span>
                        </>
                      ) : (
                        <>
                          <AppIcon icon={CalendarBlank} size={15} style={{ color: "#2b66ff" }} />
                          <span className="readonly-val-strong">
                            {freezeDate ? freezeDate.format("YYYY-MM-DD HH:mm") : "未设置"}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="setting-tile-hint">社长须在此时间前审核已提交的申请并确认成员。截止后，未处理的申请自动失效，社长不再新增成员；教师可按权限调整成员并留痕。</div>
                </div>

                {/* 4. 学分申请时间 */}
                <div className="setting-tile-card">
                  <div className="setting-tile-header">
                    <span className="setting-tile-title">学分申请时间</span>
                    {isEditing ? (
                      <AntCheckbox
                        checked={creditUnlimited}
                        onChange={(e) => setCreditUnlimited(e.target.checked)}
                      >
                        不限时间
                      </AntCheckbox>
                    ) : null}
                  </div>
                  {isEditing ? (
                    creditUnlimited ? (
                      <AntInput
                        disabled
                        value="不限时间（社团活动结束后随时可申请）"
                        prefix={<AppIcon icon={CalendarBlank} size={15} style={{ color: "#9ca3af" }} />}
                        style={{ height: 36, background: "#f8fafc", color: "#6b7280" }}
                      />
                    ) : (
                      <DatePicker.RangePicker
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                        value={creditRange}
                        onChange={(val) => setCreditRange(val)}
                        style={{ width: "100%", height: 36 }}
                        placeholder={["开始时间", "结束时间"]}
                      />
                    )
                  ) : (
                    <div className="readonly-val-row">
                      {creditUnlimited ? (
                        <>
                          <AntTag color="blue" variant="filled">不限时间</AntTag>
                          <span className="readonly-val-desc">社团活动结束后随时可申请</span>
                        </>
                      ) : (
                        <>
                          <AppIcon icon={CalendarBlank} size={15} style={{ color: "#2b66ff" }} />
                          <span className="readonly-val-strong">
                            {creditRange && creditRange[0] && creditRange[1]
                              ? `${creditRange[0].format("YYYY-MM-DD HH:mm")} ~ ${creditRange[1].format("YYYY-MM-DD HH:mm")}`
                              : "未设置"}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="setting-tile-hint">学期末社长与成员提交社团学分申请的时间窗口</div>
                </div>
              </div>
            </section>

            {/* 卡片 2：数量设置 */}
            <section className="settings-card-module" data-proto-id="basic-settings-quantity">
              <SectionHeading
                icon={Users}
                title="数量设置"
                description="控制学生在本学期可发起的社团数和可作为成员加入的社团数；达到上限后，不再允许提交对应的新申请。"
                badge={!isEditing ? "2项数量规则" : null}
              />
              <div className="setting-tiles-grid">
                {/* 1. 最多申报社团数 */}
                <div className="setting-tile-card">
                  <div className="setting-tile-header">
                    <span className="setting-tile-title">每名学生最多发起社团数</span>
                    {isEditing ? (
                      <AntCheckbox
                        checked={maxApplyUnlimited}
                        onChange={(e) => setMaxApplyUnlimited(e.target.checked)}
                      >
                        不限数量
                      </AntCheckbox>
                    ) : null}
                  </div>
                  {isEditing ? (
                    maxApplyUnlimited ? (
                      <AntInput
                        disabled
                        value="不限数量（学生可发起多个社团）"
                        prefix={<AppIcon icon={Users} size={15} style={{ color: "#9ca3af" }} />}
                        style={{ height: 36, background: "#f8fafc", color: "#6b7280" }}
                      />
                    ) : (
                      <InputNumber
                        min={1}
                        max={20}
                        value={maxApply}
                        onChange={(val) => setMaxApply(val || 1)}
                        addonAfter="个社团"
                        style={{ width: "100%", height: 36 }}
                      />
                    )
                  ) : (
                    <div className="readonly-val-row">
                      {maxApplyUnlimited ? (
                        <>
                          <AntTag color="blue" variant="filled">不限数量</AntTag>
                          <span className="readonly-val-desc">学生可发起多个社团</span>
                        </>
                      ) : (
                        <span className="readonly-val-strong">{maxApply} 个社团</span>
                      )}
                    </div>
                  )}
                  <div className="setting-tile-hint">学生提交新社团申报时校验；对同一申报的退回修改或重新提交不重复计数。</div>
                </div>

                {/* 2. 最多加入社团数 */}
                <div className="setting-tile-card">
                  <div className="setting-tile-header">
                    <span className="setting-tile-title">每名学生最多加入社团数</span>
                    {isEditing ? (
                      <AntCheckbox
                        checked={maxJoinUnlimited}
                        onChange={(e) => setMaxJoinUnlimited(e.target.checked)}
                      >
                        不限数量
                      </AntCheckbox>
                    ) : null}
                  </div>
                  {isEditing ? (
                    maxJoinUnlimited ? (
                      <AntInput
                        disabled
                        value="不限数量（学生可报名加入任意多个社团）"
                        prefix={<AppIcon icon={Users} size={15} style={{ color: "#9ca3af" }} />}
                        style={{ height: 36, background: "#f8fafc", color: "#6b7280" }}
                      />
                    ) : (
                      <InputNumber
                        min={1}
                        max={20}
                        value={maxJoin}
                        onChange={(val) => setMaxJoin(val || 1)}
                        addonAfter="个社团"
                        style={{ width: "100%", height: 36 }}
                      />
                    )
                  ) : (
                    <div className="readonly-val-row">
                      {maxJoinUnlimited ? (
                        <>
                          <AntTag color="blue" variant="filled">不限数量</AntTag>
                          <span className="readonly-val-desc">学生可报名加入多个社团</span>
                        </>
                      ) : (
                        <span className="readonly-val-strong">{maxJoin} 个社团</span>
                      )}
                    </div>
                  )}
                  <div className="setting-tile-hint">学生提交入团申请及社长确认成员时均校验；以本学期有效成员关系为准，教师例外调整另行留痕。</div>
                </div>
              </div>
            </section>

            {/* 卡片 3：活动开展规则 */}
            <section className="settings-card-module" data-proto-id="basic-settings-activity-rules">
              <SectionHeading
                icon={SlidersHorizontal}
                title="活动开展规则"
                description="统一决定是否沉淀活动出勤和开展材料；两项规则只服务于必要的过程事实，不替代学生自主组织活动。"
                badge={!isEditing ? `已启用 ${enabledRulesCount} 项` : null}
              />
              <div className="rules-settings-list">
                <div className="rule-item-row">
                  <div className="rule-item-content">
                    <div className="rule-item-title">活动签到</div>
                    <div className="rule-item-desc">启用后，每场新发布的社团活动均生成签到，社长负责现场点名；签到结果作为成员参与和社长组织的客观依据。</div>
                  </div>
                  {isEditing ? (
                    <AntSwitch checked={attendanceEnabled} onChange={setAttendanceEnabled} />
                  ) : (
                    <AntTag color={attendanceEnabled ? "success" : "default"} variant="filled">
                      {attendanceEnabled ? "已开启" : "未开启"}
                    </AntTag>
                  )}
                </div>

                <div className="rule-item-row">
                  <div className="rule-item-content">
                    <div className="rule-item-title">要求补充活动开展材料</div>
                    <div className="rule-item-desc">启用后，社长须在每场活动结束后补充学校要求的开展材料；材料字段在“表单设置”中配置，不发起单独审批。</div>
                  </div>
                  {isEditing ? (
                    <AntSwitch checked={materialEnabled} onChange={setMaterialEnabled} />
                  ) : (
                    <AntTag color={materialEnabled ? "success" : "default"} variant="filled">
                      {materialEnabled ? "已开启" : "未开启"}
                    </AntTag>
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
      <AntModal
        className="settings-save-impact-modal"
        title="确认保存修改？"
        open={impactDialogOpen}
        onCancel={() => setImpactDialogOpen(false)}
        onOk={completeSave}
        okText="确认保存"
        cancelText="继续编辑"
        width={540}
      >
        <p className="settings-save-impact-intro">本学期已经开始办理社团业务。以下修改将在保存后用于后续的新操作，已开始的业务仍按原设置办理。</p>
        <section className="settings-save-change-list" aria-label="本次修改项">
          <strong>本次修改</strong>
          <ul>{getChangedItems().map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        {getTimeWarnings().length > 0 ? (
          <section className="settings-save-risk-warning" aria-label="时间调整影响">
            <strong>请注意</strong>
            <ul>{getTimeWarnings().map((warning) => <li key={warning}>{warning}</li>)}</ul>
          </section>
        ) : null}
      </AntModal>
    </ConfigProvider>
  );
}

export function ActivityNoticePage({ onNotify, onSetHeaderAction }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [title, setTitle] = useState("社团申报说明");

  const handleSave = () => {
    setIsEditing(false);
    onNotify("已保存社团申报说明修改");
  };

  useEffect(() => {
    if (!onSetHeaderAction) return undefined;
    if (isEditing) {
      onSetHeaderAction(
        <>
          <button type="button" className="btn-header-outline" onClick={() => setIsEditing(false)}>
            取消
          </button>
          <button type="button" className="btn-header-primary" onClick={handleSave}>
            保存修改
          </button>
        </>
      );
    } else {
      onSetHeaderAction(
        <button type="button" className="btn-header-primary" onClick={() => setIsEditing(true)}>
          编辑说明
        </button>
      );
    }
    return () => onSetHeaderAction(null);
  }, [isEditing, onSetHeaderAction]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#2b66ff",
          colorLink: "#2b66ff",
          borderRadius: 4,
          fontFamily: "inherit",
        },
      }}
    >
      <div className="settings-page">
        <div className="settings-centered-container">
          <EffectNotice>
            说明内容可随时更新；关闭展示后，学生端“社团申报”将不再显示说明入口。
          </EffectNotice>

          <section className="settings-card-module" data-proto-id="activity-notice-content">
            {/* 顶栏控制：展示开关 */}
            <div className="rule-item-row" data-proto-id="activity-notice-display" style={{ paddingTop: 0, borderBottom: isEditing ? "1px solid #f0f2f5" : "none" }}>
              <div className="rule-item-content">
                <div className="rule-item-title">向学生展示社团申报说明</div>
                <div className="rule-item-desc">
                  {isEditing
                    ? "开启后，学生在“社团申报”中可主动查看；不作为强制弹窗阻断"
                    : "学生在“社团申报”中可主动查看说明内容"}
                </div>
              </div>
              {isEditing ? (
                <AntSwitch checked={showNotice} onChange={setShowNotice} />
              ) : (
                <AntTag color={showNotice ? "success" : "default"} variant="filled">
                  {showNotice ? "已开启展示" : "未开启展示"}
                </AntTag>
              )}
            </div>

            {isEditing ? (
              <>
                {!showNotice ? (
                  <div className="notice-disabled-banner">
                    <AppIcon icon={Info} size={15} />
                    <span>当前已关闭说明展示，学生端“社团申报”不显示该入口。下方内容保存后仍可在重新开启时生效。</span>
                  </div>
                ) : null}

                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* 说明标题 */}
                  <div className="setting-field wide">
                    <span>说明标题</span>
                    <AntInput
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={!showNotice}
                      placeholder="如：2026—2027 学年上学期社团申报说明"
                      style={{ height: 36 }}
                    />
                  </div>

                  {/* 说明正文（富文本编辑器视觉） */}
                  <div className="setting-field wide">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>说明正文</span>
                      <small style={{ color: "#8c8c8c" }}>咨询电话、答疑地点等信息可直接在正文中排版展示</small>
                    </div>
                    <div className={`rich-editor-wrapper ${!showNotice ? "is-dimmed" : ""}`}>
                      {/* 富文本工具栏 */}
                      <div className="rich-editor-toolbar">
                        <div className="toolbar-btn-group">
                          <button type="button" className="toolbar-btn" title="撤销"><AppIcon icon={ArrowCounterClockwise} size={14} /></button>
                          <button type="button" className="toolbar-btn" title="重做"><AppIcon icon={ArrowClockwise} size={14} /></button>
                        </div>
                        <span className="toolbar-divider" />
                        <select className="toolbar-select" defaultValue="p">
                          <option value="p">正文段落</option>
                          <option value="h3">小标题 (H3)</option>
                          <option value="h4">分级标题 (H4)</option>
                        </select>
                        <span className="toolbar-divider" />
                        <div className="toolbar-btn-group">
                          <button type="button" className="toolbar-btn active" title="加粗"><AppIcon icon={TextB} size={14} weight="bold" /></button>
                          <button type="button" className="toolbar-btn" title="斜体"><AppIcon icon={TextItalic} size={14} /></button>
                          <button type="button" className="toolbar-btn" title="下划线"><AppIcon icon={TextUnderline} size={14} /></button>
                        </div>
                        <span className="toolbar-divider" />
                        <div className="toolbar-btn-group">
                          <button type="button" className="toolbar-btn" title="无序列表"><AppIcon icon={ListBullets} size={14} /></button>
                          <button type="button" className="toolbar-btn" title="有序列表"><AppIcon icon={ListNumbers} size={14} /></button>
                          <button type="button" className="toolbar-btn" title="引用"><AppIcon icon={Quotes} size={14} /></button>
                        </div>
                        <span className="toolbar-divider" />
                        <div className="toolbar-btn-group">
                          <button type="button" className="toolbar-btn" title="插入链接"><AppIcon icon={LinkSimple} size={14} /></button>
                          <button type="button" className="toolbar-btn" title="插入图片"><AppIcon icon={ImageSquare} size={14} /></button>
                          <button type="button" className="toolbar-btn" title="插入表格"><AppIcon icon={Table} size={14} /></button>
                        </div>
                      </div>

                      {/* 富文本正文编辑区（含整合后的咨询信息） */}
                      <div className="rich-editor-body" contentEditable={showNotice} suppressContentEditableWarning>
                        <p>本学期学生社团由学生自主发起。准备申报社团的同学，请在提交前阅读以下说明。</p>
                        <h4>一、申报要求</h4>
                        <ul>
                          <li>请在学校开放的申报时间内提交；社团应有明确的共同兴趣、活动目标和本学期计划；</li>
                          <li>请准确选择社团类别，并合理填写计划人数、联系方式和场地需求；</li>
                          <li>场地需求不等于实际预约，具体活动场地仍在发布活动时分别填写。</li>
                        </ul>
                        <h4>二、填写与审核</h4>
                        <ul>
                          <li>请按表单要求补充招新海报、活动计划及其他所需材料；</li>
                          <li>教师将依据申报内容审核。被退回后，可根据意见修改原申报并重新提交。</li>
                        </ul>
                        <h4>三、通过后的责任</h4>
                        <ul>
                          <li>社团成立后，社长应公平组织招新，持续发布活动并如实沉淀参与记录。</li>
                        </ul>
                        <div className="rich-contact-callout">
                          <div className="rich-contact-title">
                            <AppIcon icon={Phone} size={15} />
                            <span>申报咨询</span>
                          </div>
                          <p>• <strong>负责机构：</strong>学生发展中心（知行楼 302 室）</p>
                          <p>• <strong>负责教师：</strong>李老师（办公电话：010-8825XXXX）</p>
                          <p>• <strong>答疑时间：</strong>每周一至周五 08:30 — 17:00</p>
                        </div>
                      </div>

                      {/* 底部状态 */}
                      <div className="rich-editor-statusbar">
                        <span>共 368 字 ｜ 已整合 1 个联系答疑信息块</span>
                        <span>自动保存于 15:20</span>
                      </div>
                    </div>
                  </div>

                  {/* 独立附件材料模块 */}
                  <div className="attachment-section">
                    <span className="attachment-section-label">附件材料</span>
                    <div className="attachment-upload-row">
                      <button
                        type="button"
                        className="notice-upload-btn"
                        disabled={!showNotice}
                        onClick={() => onNotify("上传附件材料")}
                      >
                        <AppIcon icon={UploadSimple} size={15} />
                        上传图片或附件
                      </button>
                      <span className="notice-upload-hint">支持上传 PDF、Word、JPG、PNG，单个文件最大不超过 20MB</span>
                    </div>
                    <div className="attachment-file-card">
                      <div className="attachment-file-info">
                        <div className="attachment-file-icon">
                          <AppIcon icon={FileText} size={20} />
                        </div>
                        <div className="attachment-file-meta">
                          <span className="attachment-file-name">社团申报材料参考模板.pdf</span>
                          <span className="attachment-file-size">1.2 MB · 上传于 2026-09-01</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="attachment-file-action"
                        title="移除附件"
                        onClick={() => onNotify("已移除示例附件")}
                      >
                        <AppIcon icon={Trash} size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* 只读展示态 */
              <div className="notice-readonly-card">
                <div className="notice-readonly-article">
                  <div className="notice-readonly-title">{title}</div>
                  <div className="notice-readonly-content">
                    <p>本学期学生社团由学生自主发起。准备申报社团的同学，请在提交前阅读以下说明。</p>
                    <h4>一、申报要求</h4>
                    <ul>
                      <li>请在学校开放的申报时间内提交；社团应有明确的共同兴趣、活动目标和本学期计划；</li>
                      <li>请准确选择社团类别，并合理填写计划人数、联系方式和场地需求；</li>
                      <li>场地需求不等于实际预约，具体活动场地仍在发布活动时分别填写。</li>
                    </ul>
                    <h4>二、填写与审核</h4>
                    <ul>
                      <li>请按表单要求补充招新海报、活动计划及其他所需材料；</li>
                      <li>教师将依据申报内容审核。被退回后，可根据意见修改原申报并重新提交。</li>
                    </ul>
                    <h4>三、通过后的责任</h4>
                    <ul>
                      <li>社团成立后，社长应公平组织招新，持续发布活动并如实沉淀参与记录。</li>
                    </ul>
                    <div className="rich-contact-callout">
                      <div className="rich-contact-title">
                        <AppIcon icon={Phone} size={15} />
                        <span>申报咨询</span>
                      </div>
                      <p>• <strong>负责机构：</strong>学生发展中心（知行楼 302 室）</p>
                      <p>• <strong>负责教师：</strong>李老师（办公电话：010-8825XXXX）</p>
                      <p>• <strong>答疑时间：</strong>每周一至周五 08:30 — 17:00</p>
                    </div>
                  </div>
                </div>

                <div className="attachment-section" style={{ marginTop: 0 }}>
                  <span className="attachment-section-label">附件材料</span>
                  <div className="attachment-file-card">
                    <div className="attachment-file-info">
                      <div className="attachment-file-icon">
                        <AppIcon icon={FileText} size={20} />
                      </div>
                      <div className="attachment-file-meta">
                        <span className="attachment-file-name">社团申报材料参考模板.pdf</span>
                        <span className="attachment-file-size">1.2 MB · PDF 文档</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="attachment-file-action download"
                      title="下载附件"
                      onClick={() => onNotify("下载附件材料原型")}
                    >
                      <AppIcon icon={DownloadSimple} size={14} />
                      <span>下载</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </ConfigProvider>
  );
}

const formSettingItems = [
  {
    title: "社团申报表",
    description: "设置学生申报社团时需填写的补充问题和材料。",
    target: "applicationForm",
    previewTarget: "applicationFormPreview",
  },
  {
    title: "学分申请表",
    description: "设置学生申请学分时需填写的补充说明、证明材料和其他问题。",
    target: "creditApplicationForm",
    previewTarget: "creditApplicationFormPreview",
  },
  {
    title: "活动开展材料",
    description: "设置社长在活动后补充的开展情况、照片和成果材料。",
    target: "activityMaterialForm",
    previewTarget: "activityMaterialFormPreview",
  },
];

function SettingsRow({ item, onNavigate }) {
  return <div className="config-row" key={item.title}>
    <div className="config-type"><span className="config-title">{item.title}</span></div>
    <p className="config-desc">{item.description}</p>
    <div className="config-action-wrap form-setting-actions">
      <button type="button" className="config-action" aria-label={`查看${item.title}填写内容`} onClick={() => onNavigate(item.previewTarget)}>查看表单</button>
      <button type="button" className="config-action" aria-label={`设置${item.title}`} onClick={() => onNavigate(item.target)}>设置</button>
    </div>
  </div>;
}

export function FormSettingsPage({ onNavigate }) {
  return (
    <div className="settings-page">
      <EffectNotice>修改仅影响后续提交；已提交内容保留原表单。</EffectNotice>
      <section className="settings-config-group" data-proto-id="form-settings-list" aria-label="表单设置">
        <div className="settings-config-group-head"><h2>表单内容</h2><p>设置学生提交时需要填写的内容。</p></div>
        <div className="config-table">
          <div className="config-head"><span>表单名称</span><span>说明</span><span className="config-th-action">操作</span></div>
          {formSettingItems.map((item) => <SettingsRow key={item.title} item={item} onNavigate={onNavigate} />)}
        </div>
      </section>
    </div>
  );
}

const formPreviewDefinitions = {
  application: {
    title: "社团申报表",
    description: "以下为学生申报社团时实际填写的内容。系统固定字段与学校设置的补充项一并展示。",
    sections: [
      { title: "基本信息", hint: "系统固定", fields: [["社团名称", "请输入社团名称", true], ["社团类别", "请选择社团类别", true], ["计划人数上限", "请输入人数", true], ["社团简介", "请介绍社团目标和主要内容", true, "textarea"], ["社团封面", "上传图片", false, "upload"]] },
      { title: "招新与联系", hint: "系统固定", fields: [["联系电话", "请输入联系电话", true], ["招募说明", "例如招募对象、报名条件、参与时间等", false, "textarea"], ["活动场地需求", "从场地库选择或填写场地需求", false, "textarea"]] },
      { title: "申报材料", hint: "学校设置", fields: [["招新海报", "上传图片", true, "upload"], ["活动计划", "请说明本学期拟开展的主要活动", true, "textarea"]] },
    ],
  },
  credit: {
    title: "学分申请表",
    description: "以下为学生申请社团学分时实际填写的内容；已有关联参与记录会优先带出。",
    sections: [
      { title: "基础信息", hint: "系统固定", fields: [["所属社团", "系统自动带出", true], ["申请身份", "系统自动带出", true], ["申报学时", "请输入申报学时", true], ["关联参与记录", "选择已有活动与签到记录", false, "upload"]] },
      { title: "补充说明", hint: "学校设置", fields: [["申请说明", "请说明本学期的参与和贡献", true, "textarea"], ["个人证明材料", "上传附件", false, "upload"]] },
    ],
  },
  material: {
    title: "活动开展材料",
    description: "以下为社长补充活动开展情况时实际填写的内容。",
    sections: [
      { title: "活动信息", hint: "系统自动带出", fields: [["所属活动", "系统自动带出", true], ["活动时间", "系统自动带出", true], ["活动地点", "系统自动带出", true]] },
      { title: "开展材料", hint: "学校设置", fields: [["开展情况说明", "请简要说明本次活动的开展情况", true, "textarea"], ["活动照片", "上传图片", true, "upload"], ["阶段成果", "上传附件", false, "upload"]] },
    ],
  },
};

function FormPreviewField({ field }) {
  const [label, placeholder, required, type = "input"] = field;
  return <div className="student-preview-field">
    <span>{required ? <b>*</b> : null}{label}</span>
    {type === "textarea" ? <textarea aria-label={label} disabled rows="3" placeholder={placeholder} /> : type === "upload" ? <button type="button" aria-label={label} disabled><AppIcon icon={UploadSimple} size={15} />{placeholder}</button> : <input aria-label={label} disabled placeholder={placeholder} />}
  </div>;
}

export function FormPreviewPage({ type = "application", onNavigate }) {
  const definition = formPreviewDefinitions[type];
  const editTarget = type === "application" ? "applicationForm" : type === "credit" ? "creditApplicationForm" : "activityMaterialForm";

  return <div className="form-preview-page">
    <div className="form-preview-page-head">
      <div>
        <h2>学生填写预览</h2>
        <p>{definition.description}</p>
      </div>
      <button type="button" className="primary-action" onClick={() => onNavigate(editTarget)}>设置表单</button>
    </div>
    <div className="student-form-preview" aria-label={`${definition.title}学生填写预览`}>
      {definition.sections.map((section) => <section className="student-preview-section" key={section.title}>
        <div className="student-preview-section-head"><strong>{section.title}</strong><small>{section.hint}</small></div>
        {section.fields.map((field) => <FormPreviewField field={field} key={field[0]} />)}
      </section>)}
    </div>
  </div>;
}

function ReviewerTags({ reviewers }) {
  return reviewers.length ? <div className="approval-reviewer-tags">
    {reviewers.map((name) => <span key={name}><AppIcon icon={User} size={13} />{name}</span>)}
  </div> : <span className="muted-value">未配置</span>;
}

const components = [
  ["布局", [[TextT, "标题"]]],
  ["通用组件", [[TextT, "单行文本"], [FileText, "多行文本"], [ListChecks, "单选"], [ListChecks, "多选"], [CalendarBlank, "日期"], [CalendarBlank, "日期区间"], [UploadSimple, "附件"], [ImageSquare, "图片"]]],
];

function BuilderField({ label, required, locked, configurable, children, selected = false, onSelect, disabled = false }) {
  return <div
    className={`builder-field ${selected ? "selected" : ""} ${onSelect ? "is-selectable" : ""} ${disabled ? "is-disabled" : ""}`}
    onClick={onSelect}
  >
    <div className="builder-field-title">
      <span>{required ? <b>*</b> : null}{label}</span>
      {locked ? <span className="locked-label"><AppIcon icon={Lock} size={12} />固定</span> : configurable ? <span className="configurable-label">可设置</span> : <AppIcon icon={DotsSixVertical} size={17} />}
    </div>
    {children}
  </div>;
}

const formDefinitions = {
  application: { preview: "社团申报表设置", help: "先确认基础设置，再使用公共控件补充自定义信息", selected: "招新海报", selectedHint: "用于学生了解社团招新信息。", save: "已保存社团申报表原型" },
  credit: { preview: "学分申请预览", help: "申报学时等核心信息固定保留", selected: "个人证明材料", selectedHint: "已有参与记录不足时，可补充个人证明。", save: "已保存学分申请表原型" },
  material: { preview: "活动开展材料预览", help: "活动基础信息由系统自动带出", selected: "活动照片", selectedHint: "请上传能够反映活动开展情况的照片。", save: "已保存活动开展材料原型" },
};

const applicationFieldDefaults = {
  phone: { label: "联系电话", publicToStudents: true },
  venue: { label: "活动场地需求", useVenueLibrary: true, useDescription: true },
  recruitment: { label: "招募说明", hint: "例如招募对象、报名条件、参与时间等" },
  materialsTitle: { label: "申报材料", required: false, hint: "用于区分下面的学校自定义字段" },
  poster: { label: "招新海报", required: true, hint: "用于学生了解社团招新信息" },
  plan: { label: "活动计划", required: true, hint: "请说明本学期拟开展的主要活动" },
};

function RichTextPreview({ placeholder }) {
  return <div className="richtext-preview" aria-label="富文本填写区域">
    <div className="richtext-preview-toolbar">
      <button type="button" aria-label="加粗"><AppIcon icon={TextB} size={14} /></button>
      <button type="button" aria-label="斜体"><AppIcon icon={TextItalic} size={14} /></button>
      <button type="button" aria-label="下划线"><AppIcon icon={TextUnderline} size={14} /></button>
      <i />
      <button type="button" aria-label="列表"><AppIcon icon={ListBullets} size={14} /></button>
      <button type="button" aria-label="引用"><AppIcon icon={Quotes} size={14} /></button>
      <button type="button" aria-label="链接"><AppIcon icon={LinkSimple} size={14} /></button>
    </div>
    <div className="richtext-preview-body">{placeholder}</div>
  </div>;
}

function ApplicationBasicSettings({ fieldSettings, onChange }) {
  const phone = fieldSettings.phone;
  const venue = fieldSettings.venue;
  const recruitment = fieldSettings.recruitment;
  return <>
    <section className="form-block system-form-block">
      <div className="form-block-heading"><span><AppIcon icon={Lock} size={14} />基本信息</span><small>学生申报时固定填写</small></div>
      <div className="application-auto-fields"><span>自动带出：当前学期、申报人、学生社长</span></div>
      <BuilderField label="社团名称" required locked><input placeholder="请填写社团名称" /></BuilderField>
      <div className="builder-field-grid">
        <BuilderField label="社团类别" required locked><select><option>使用学校已设置的社团类别</option></select><small className="field-help">关联申报分类、审核分配与统计</small></BuilderField>
        <BuilderField label="计划人数上限" required locked><input placeholder="请填写人数" /><small className="field-help">用于控制社团可接收的正式成员数</small></BuilderField>
      </div>
      <BuilderField label="社团简介" required locked><RichTextPreview placeholder="请介绍社团目标和主要内容" /></BuilderField>
      <BuilderField label="社团封面" locked>
        <button type="button" className="preview-upload"><AppIcon icon={ImageSquare} size={15} />上传图片</button>
        <small className="field-help">选填，用于在学生端展示社团形象。</small>
      </BuilderField>
    </section>

    <section className="form-block system-form-block">
      <div className="form-block-heading"><span><AppIcon icon={Lock} size={14} />招新与联系</span><small>联系电话固定必填</small></div>
      <BuilderField label="联系电话" required locked>
        <input placeholder="请输入联系电话" />
        <div className="inline-field-setting"><span>向本校学生公开联系电话</span><Switch checked={phone.publicToStudents} onChange={(checked) => onChange("phone", { ...phone, publicToStudents: checked })} ariaLabel="向本校学生公开联系电话" /></div>
        <small className="field-help">开启后，学生可在正式社团详情中查看社长联系电话。</small>
      </BuilderField>
      <BuilderField label="招募说明" locked>
        <RichTextPreview placeholder={recruitment.hint} />
        <small className="field-help">选填，用于说明招募对象、报名条件、参与时间等。</small>
      </BuilderField>
    </section>

    <section className="form-block system-form-block">
      <div className="form-block-heading"><span><AppIcon icon={Lock} size={14} />活动场地需求</span><small>可按学校需要启用</small></div>
      <BuilderField label="活动场地需求" locked>
        <div className="venue-method-settings">
          <span>学生填写方式</span>
          <AntCheckbox checked={venue.useVenueLibrary} onChange={(event) => {
            if (!event.target.checked && !venue.useDescription) return;
            onChange("venue", { ...venue, useVenueLibrary: event.target.checked });
          }}>从场地库选择</AntCheckbox>
          <AntCheckbox checked={venue.useDescription} onChange={(event) => {
            if (!event.target.checked && !venue.useVenueLibrary) return;
            onChange("venue", { ...venue, useDescription: event.target.checked });
          }}>填写场地说明</AntCheckbox>
        </div>
        <div className={`venue-preview-inputs ${venue.useVenueLibrary && venue.useDescription ? "both" : "single"}`}>
          {venue.useVenueLibrary ? <button type="button">从场地库选择</button> : null}
          {venue.useDescription ? <textarea rows="2" placeholder="说明场地需求，由学校后续协调" /> : null}
        </div>
        <small className="field-help">至少保留一种填写方式；仅表达意向或需求，不预约、不锁定具体活动场地。</small>
      </BuilderField>
    </section>
  </>;
}

function ApplicationCustomFields({ selectedField, onSelect, fieldSettings }) {
  const poster = fieldSettings.poster;
  const plan = fieldSettings.plan;
  return <section className="form-block custom-form-block">
    <div className="form-block-heading"><span>其他</span><small>使用公共控件设置，学生端按此顺序展示</small></div>
    <BuilderField label="申报材料" selected={selectedField === "materialsTitle"} onSelect={() => onSelect("materialsTitle")}><div className="builder-title-preview">标题组件，仅用于分组展示</div></BuilderField>
    <BuilderField label="招新海报" required={poster.required} selected={selectedField === "poster"} onSelect={() => onSelect("poster")}><button type="button" className="preview-upload"><AppIcon icon={ImageSquare} size={15} />上传图片</button><small className="field-help">{poster.hint}</small></BuilderField>
    <BuilderField label="活动计划" required={plan.required} selected={selectedField === "plan"} onSelect={() => onSelect("plan")}><textarea rows="3" placeholder={plan.hint} /><small className="field-help">默认提供的多行文本字段，可删除、改名、调整顺序或改为附件</small></BuilderField>
    <div className="builder-drop-hint"><AppIcon icon={Plus} size={16} />在此添加其他信息</div>
  </section>;
}

function ApplicationPropertyPanel({ selectedField, fieldSettings, onChange }) {
  const selected = fieldSettings[selectedField];
  const isTitle = selectedField === "materialsTitle";
  const isUpload = selectedField === "poster";
  const update = (key, value) => onChange(selectedField, { ...selected, [key]: value });

  return <aside className="property-panel" aria-label="字段设置">
    <div className="builder-panel-title">
      <strong>字段设置</strong>
      <small>当前字段：{selected.label}</small>
    </div>
    <FormField label={isTitle ? "标题文字" : "标题"}><input defaultValue={selected.label} /></FormField>
    {!isTitle ? <FormField label="提示文字"><textarea rows="3" defaultValue={selected.hint} /></FormField> : <FormField label="说明"><input defaultValue="用于分隔自定义内容" /></FormField>}
    {!isTitle ? <ToggleRow title="必填" description="学生未补充时不能提交" checked={selected.required} onChange={(checked) => update("required", checked)} /> : null}
    {isUpload ? <>
      <FormField label="图片数量"><select defaultValue="1"><option>1</option><option>2</option><option>3</option></select></FormField>
      <FormField label="支持格式"><input defaultValue="JPG、PNG" /></FormField>
      <FormField label="单个文件大小"><select defaultValue="20 MB"><option>10 MB</option><option>20 MB</option><option>50 MB</option></select></FormField>
    </> : null}
    <div className="property-note"><AppIcon icon={Info} size={15} /><span>新提交使用修改后的表单，已提交内容保留原样。</span></div>
  </aside>;
}

function CreditFields() {
  return <>
    <div className="builder-field-grid">
      <BuilderField label="所属社团" locked><input defaultValue="科学探索社" readOnly /></BuilderField>
      <BuilderField label="申请身份" locked><input defaultValue="成员" readOnly /></BuilderField>
    </div>
    <BuilderField label="申报学时" required locked><input placeholder="请填写申报学时" /></BuilderField>
    <BuilderField label="关联参与记录" locked><button type="button" className="preview-upload"><AppIcon icon={ListChecks} size={15} />选择已有活动与签到记录</button></BuilderField>
  </>;
}

function MaterialFields() {
  return <>
    <BuilderField label="所属活动" locked><input defaultValue="科学探索社第三次活动" readOnly /></BuilderField>
    <div className="builder-field-grid">
      <BuilderField label="活动时间" locked><input defaultValue="2026-10-16 16:00—17:00" readOnly /></BuilderField>
      <BuilderField label="活动地点" locked><input defaultValue="创客教室" readOnly /></BuilderField>
    </div>
  </>;
}

function SupplementalFields({ type, definition }) {
  if (type === "credit") return <>
    <BuilderField label="申请说明" required><textarea rows="3" placeholder="请说明本学期的参与和贡献" /></BuilderField>
    <BuilderField label={definition.selected} selected><button type="button" className="preview-upload"><AppIcon icon={UploadSimple} size={15} />上传附件</button><small className="field-help">{definition.selectedHint}</small></BuilderField>
  </>;
  if (type === "material") return <>
    <BuilderField label="开展情况说明" required><textarea rows="3" placeholder="请简要说明本次活动的开展情况" /></BuilderField>
    <BuilderField label={definition.selected} required selected><button type="button" className="preview-upload"><AppIcon icon={ImageSquare} size={15} />上传图片</button><small className="field-help">{definition.selectedHint}</small></BuilderField>
    <BuilderField label="阶段成果"><button type="button" className="preview-upload"><AppIcon icon={UploadSimple} size={15} />上传附件</button></BuilderField>
  </>;
  return <>
    <BuilderField label="招新海报" required><button type="button" className="preview-upload"><AppIcon icon={ImageSquare} size={15} />上传图片</button></BuilderField>
    <BuilderField label="活动计划" required><button type="button" className="preview-upload"><AppIcon icon={UploadSimple} size={15} />上传文件</button></BuilderField>
    <BuilderField label={definition.selected} required selected><button type="button" className="preview-upload"><AppIcon icon={UploadSimple} size={15} />上传已签字协议</button><small className="field-help">{definition.selectedHint}</small></BuilderField>
  </>;
}

function ApplicationStepFooter({ onSave }) {
  return <div className="application-step-footer">
    <button type="button" className="btn-default-32">取消</button>
    <button type="button" className="primary-action" onClick={onSave}>保存</button>
  </div>;
}

function ApplicationBuilder({ onNotify }) {
  const definition = formDefinitions.application;
  const [applicationStep, setApplicationStep] = useState("business");
  const [selectedApplicationField, setSelectedApplicationField] = useState("materialsTitle");
  const [applicationFields, setApplicationFields] = useState(applicationFieldDefaults);
  const updateApplicationField = (key, nextValue) => setApplicationFields((current) => ({ ...current, [key]: nextValue }));
  const changeApplicationStep = (step) => {
    setApplicationStep(step);
    setSelectedApplicationField(step === "business" ? "phone" : "materialsTitle");
  };

  return <div className="application-builder">
    <div className="application-builder-header">
      <div className="application-builder-steps" aria-label="社团申报表设置步骤">
        <button type="button" className={applicationStep === "business" ? "active" : ""} onClick={() => changeApplicationStep("business")}><b>1</b><span>业务字段</span></button>
        <i />
        <button type="button" className={applicationStep === "custom" ? "active" : ""} onClick={() => changeApplicationStep("custom")}><b>2</b><span>自定义字段</span></button>
      </div>
    </div>
    {applicationStep === "business" ? <main className="application-basic-canvas">
      <div className="form-preview">
        <ApplicationBasicSettings fieldSettings={applicationFields} onChange={updateApplicationField} />
      </div>
    </main> : <div className="form-builder-shell application-custom-builder">
      <aside className="component-library" aria-label="表单组件">
        <div className="builder-panel-title"><strong>组件</strong><small>添加自定义字段</small></div>
        {components.map(([group, items]) => <div className="component-group" key={group}><span>{group}</span><div>{items.map(([Icon, label]) => <button type="button" key={label}><AppIcon icon={Icon} size={15} />{label}</button>)}</div></div>)}
      </aside>
      <main className="builder-canvas application-custom-canvas">
        <div className="form-preview"><ApplicationCustomFields selectedField={selectedApplicationField} onSelect={setSelectedApplicationField} fieldSettings={applicationFields} /></div>
      </main>
      <ApplicationPropertyPanel selectedField={selectedApplicationField} fieldSettings={applicationFields} onChange={updateApplicationField} />
    </div>}
    <ApplicationStepFooter onSave={() => onNotify(definition.save)} />
  </div>;
}

function StandardFormBuilder({ type, onNotify }) {
  const definition = formDefinitions[type];
  return <div className="form-builder-shell">
    <aside className="component-library" aria-label="表单组件">
      <div className="builder-panel-title"><strong>组件</strong><small>本轮仅展示表单结构</small></div>
      {components.map(([group, items]) => <div className="component-group" key={group}><span>{group}</span><div>{items.map(([Icon, label]) => <button type="button" key={label}><AppIcon icon={Icon} size={15} />{label}</button>)}</div></div>)}
    </aside>
    <main className="builder-canvas">
      <div className="builder-toolbar">
        <span><strong>{definition.preview}</strong><small>{definition.help}</small></span>
        <button type="button" className="primary-action" onClick={() => onNotify(definition.save)}>保存</button>
      </div>
      <div className="form-preview">
        <>
          <section className="form-block">
            <div className="form-block-heading"><span><AppIcon icon={Lock} size={14} />基础信息</span><small>由学生社团固定保留</small></div>
            {type === "credit" ? <CreditFields /> : <MaterialFields />}
          </section>
          <section className="form-block">
            <div className="form-block-heading"><span>学校设置内容</span><small>使用公共表单组件配置</small></div>
            <SupplementalFields type={type} definition={definition} />
          </section>
          <div className="builder-drop-hint"><AppIcon icon={Plus} size={16} />可在此继续添加学校需要的问题</div>
        </>
      </div>
    </main>
    <aside className="property-panel" aria-label="字段设置">
      <div className="builder-panel-title"><strong>附件设置</strong><small>当前字段：{definition.selected}</small></div>
      <FormField label="标题"><input defaultValue={definition.selected} /></FormField>
      <FormField label="提示文字"><textarea rows="3" defaultValue={definition.selectedHint} /></FormField>
      <ToggleRow title="必填" description="未补充时不能提交" checked={type !== "credit"} />
      <FormField label="附件数量"><select defaultValue="1"><option>1</option><option>2</option><option>3</option></select></FormField>
      <FormField label="支持格式"><input defaultValue={type === "material" ? "JPG、PNG" : "PDF、JPG、PNG"} /></FormField>
      <FormField label="单个文件大小"><select defaultValue="20 MB"><option>10 MB</option><option>20 MB</option><option>50 MB</option></select></FormField>
      <div className="property-note"><AppIcon icon={Info} size={15} /><span>新提交使用修改后的表单，已提交内容保留原样。</span></div>
    </aside>
  </div>;
}

function CreditBuilder({ onNotify }) { return <StandardFormBuilder type="credit" onNotify={onNotify} />; }

export function FormBuilderPage({ type = "application", onNotify }) {
  if (type === "application") return <ApplicationBuilder onNotify={onNotify} />;
  if (type === "credit") return <CreditBuilder onNotify={onNotify} />;
  return <StandardFormBuilder type={type} onNotify={onNotify} />;
}

const initialCategories = [
  {
    id: "cat-1",
    name: "学术科技",
    reviewers: ["王老师", "张老师"],
    clubsCount: 6,
  },
  {
    id: "cat-2",
    name: "文化艺术",
    reviewers: ["李老师"],
    clubsCount: 8,
  },
  {
    id: "cat-3",
    name: "体育健康",
    reviewers: ["周老师"],
    clubsCount: 4,
  },
  {
    id: "cat-4",
    name: "社会服务",
    reviewers: ["王老师"],
    clubsCount: 2,
  },
  {
    id: "cat-5",
    name: "兴趣拓展",
    reviewers: [],
    clubsCount: 0,
  },
];

const teacherDirectory = [
  { name: "王老师", department: "教务处 / 科技创新组", role: "教研组长" },
  { name: "李老师", department: "团委 / 艺术中心", role: "艺术总监" },
  { name: "周老师", department: "学生处 / 实践发展组", role: "德育主管" },
  { name: "赵老师", department: "体育教研组", role: "体能主管" },
  { name: "陈老师", department: "语文教研组", role: "骨干教师" },
  { name: "张老师", department: "信息技术教研组", role: "高级教师" },
  { name: "刘老师", department: "数学教研组", role: "备课组长" },
  { name: "孙老师", department: "社团发展中心", role: "统筹教师" },
];

/**
 * 平台通用选人组件（支持多选教师）
 */
function TeacherPickerModal({ title = "选择审批教师（支持多选）", open, currentReviewers = [], onSelect, onClose }) {
  const [selectedList, setSelectedList] = useState([]);
  const [activeDept, setActiveDept] = useState("全部");
  const [searchKw, setSearchKw] = useState("");

  const departments = ["全部", "教务处", "团委", "学生处", "体育组", "语文教研组", "信息技术组"];

  useEffect(() => {
    if (open) {
      setSelectedList(Array.isArray(currentReviewers) ? [...currentReviewers] : []);
      setSearchKw("");
      setActiveDept("全部");
    }
  }, [open, currentReviewers]);

  const toggleTeacher = (name) => {
    setSelectedList((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleClear = () => {
    setSelectedList([]);
  };

  const filtered = teacherDirectory.filter((t) => {
    if (activeDept !== "全部" && !t.department.includes(activeDept)) return false;
    if (searchKw.trim()) {
      const q = searchKw.trim().toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirm = () => {
    onSelect(selectedList);
    onClose();
  };

  return (
    <AntModal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      okText={selectedList.length > 0 ? `确定选择 (${selectedList.length})` : "确定选择"}
      cancelText="取消"
      width={600}
      destroyOnClose
    >
      <div className="teacher-picker-dialog">
        <div className="picker-search-wrap">
          <AntInput
            placeholder="按教师姓名、部门或角色搜索"
            prefix={<AppIcon icon={MagnifyingGlass} size={15} style={{ color: "#8c8c8c" }} />}
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            allowClear
          />
        </div>

        <div className="picker-main-layout">
          <div className="picker-dept-col">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                className={`dept-item ${activeDept === dept ? "active" : ""}`}
                onClick={() => setActiveDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="picker-list-col">
            {filtered.map((t) => {
              const isChecked = selectedList.includes(t.name);
              return (
                <div
                  key={t.name}
                  className={`picker-teacher-row ${isChecked ? "active" : ""}`}
                  onClick={() => toggleTeacher(t.name)}
                >
                  <div className="picker-checkbox-box">
                    {isChecked && <AppIcon icon={Check} size={12} weight="bold" />}
                  </div>
                  <div className="picker-teacher-avatar">
                    <AppIcon icon={User} size={14} />
                  </div>
                  <div className="picker-teacher-detail">
                    <div className="picker-name-row">
                      <span className="picker-teacher-name">{t.name}</span>
                      <span className="picker-teacher-role">{t.role}</span>
                    </div>
                    <span className="picker-teacher-desc">{t.department}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="picker-selection-footer">
          <div className="selection-summary">
            {selectedList.length > 0 ? (
              <>
                <span>已选 <strong>{selectedList.length}</strong> 位教师：</span>
                <span className="selected-names-preview">{selectedList.join("、")}</span>
                <button type="button" className="action-text-btn danger" onClick={handleClear}>
                  清空
                </button>
              </>
            ) : (
              <span className="selection-empty-hint">未选择教师，默认（集中审核）</span>
            )}
          </div>
        </div>
      </div>
    </AntModal>
  );
}

export function CategorySettingsPage({ onNotify }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTeacherPickerOpen, setIsTeacherPickerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formName, setFormName] = useState("");
  const [formReviewers, setFormReviewers] = useState([]);
  const [nameError, setNameError] = useState("");

  const filteredCategories = categories.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return item.name.toLowerCase().includes(query) || (item.reviewers || []).some((name) => name.toLowerCase().includes(query));
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setFormReviewers([]);
    setNameError("");
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingCategory(item);
    setFormName(item.name);
    setFormReviewers([...(item.reviewers || [])]);
    setNameError("");
    setIsDrawerOpen(true);
  };

  const handleSaveDrawer = () => {
    if (!formName.trim()) {
      setNameError("请输入社团类别名称");
      return;
    }
    const duplicate = categories.some(
      (c) => c.name === formName.trim() && (!editingCategory || c.id !== editingCategory.id)
    );
    if (duplicate) {
      setNameError("该类别名称已存在，请使用其他名称");
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formName.trim(),
                reviewers: formReviewers,
              }
            : c
        )
      );
      onNotify(`已更新类别“${formName.trim()}”`);
    } else {
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        reviewers: formReviewers,
        clubsCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
      onNotify(`已新增类别“${formName.trim()}”`);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id, name) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    onNotify(`已删除类别“${name}”`);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="settings-page">
        <EffectNotice>
          社团类别用于学生申报时选择、列表筛选与数据统计，并可维护对应的申报审核老师；未单独配置时，默认（集中审核）。
        </EffectNotice>

        <div className="category-toolbar" data-proto-id="category-settings-toolbar">
          <div className="category-toolbar-left">
            <AntInput
              placeholder="搜索类别或审核老师"
              prefix={<AppIcon icon={MagnifyingGlass} size={15} style={{ color: "#8c8c8c" }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ width: 280, height: 32 }}
            />
            <span className="category-count-summary">
              共 <strong>{categories.length}</strong> 个社团类别
            </span>
          </div>
          <button
            type="button"
            className="btn-primary-32"
            onClick={handleOpenAdd}
          >
            <AppIcon icon={Plus} size={15} />
            新增类别
          </button>
        </div>

        <section className="category-table-card" data-proto-id="category-settings-list" aria-label="社团类别列表">
          <div className="category-table-head">
            <span className="col-seq">序号</span>
            <span>社团类别</span>
            <span>已关联社团</span>
            <span>申报审核老师</span>
            <span className="category-th-action">操作</span>
          </div>

          {filteredCategories.length > 0 ? (
            filteredCategories.map((item, index) => (
              <div className="category-table-row" key={item.id}>
                <span className="col-seq">{index + 1}</span>

                <div className="category-name-cell">
                  <strong className="category-name-title">{item.name}</strong>
                </div>

                <div className="category-club-count-cell">
                  {item.clubsCount > 0 ? (
                    <span className="club-count-pill">{item.clubsCount} 个社团</span>
                  ) : (
                    <span className="muted-value">0 个社团</span>
                  )}
                </div>

                <div className="category-reviewer-cell">{item.reviewers?.length ? <ReviewerTags reviewers={item.reviewers} /> : <span className="muted-value">默认（集中审核）</span>}</div>

                <div className="category-row-actions">
                  <button
                    type="button"
                    className="action-text-btn"
                    onClick={() => handleOpenEdit(item)}
                  >
                    编辑
                  </button>
                  <span className="action-divider" />
                  <AntPopconfirm
                    title="确认删除社团类别？"
                    description={
                      item.clubsCount > 0
                        ? `该类别已有 ${item.clubsCount} 个社团使用。删除后不影响已有社团，新申报将不再提供该选项。确定删除？`
                        : `确定要删除“${item.name}”社团类别吗？`
                    }
                    okText="确定删除"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(item.id, item.name)}
                  >
                    <button type="button" className="action-text-btn danger">
                      删除
                    </button>
                  </AntPopconfirm>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-category-search">
              <span>未找到与“{searchQuery}”匹配的社团类别</span>
            </div>
          )}
        </section>

        {/* 新增 / 编辑类别抽屉 */}
        <AntDrawer
          title={editingCategory ? "编辑社团类别" : "新增社团类别"}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          width={480}
          destroyOnClose
          footer={
            <div className="category-drawer-footer">
              <button
                type="button"
                className="btn-default-32"
                onClick={() => setIsDrawerOpen(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="btn-primary-32"
                onClick={handleSaveDrawer}
              >
                保存
              </button>
            </div>
          }
        >
          <div className="category-drawer-form">
            <div className="modal-field">
              <label className="modal-field-label required">类别名称</label>
              <AntInput
                placeholder="例如：学术科技、创新实践"
                value={formName}
                status={nameError ? "error" : ""}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (nameError) setNameError("");
                }}
                maxLength={20}
                showCount
                autoFocus
              />
              {nameError ? <span className="modal-error-text">{nameError}</span> : null}
            </div>

            <div className="modal-field">
              <label className="modal-field-label">申报审核老师</label>
              <div className="category-reviewer-editor">
                {formReviewers.length ? <ReviewerTags reviewers={formReviewers} /> : <span className="muted-value">默认（集中审核）</span>}
                <button type="button" className="btn-default-32" onClick={() => setIsTeacherPickerOpen(true)}>选择老师</button>
                {formReviewers.length ? <button type="button" className="action-text-btn danger" onClick={() => setFormReviewers([])}>清空</button> : null}
              </div>
              <span className="modal-field-hint">学生按此类别提交时，系统优先匹配已配置老师；未配置时，按集中审核规则处理。</span>
            </div>

          </div>
        </AntDrawer>
        <TeacherPickerModal
          title={`选择“${editingCategory?.name || formName || "新类别"}”的申报审核老师`}
          open={isTeacherPickerOpen}
          currentReviewers={formReviewers}
          onSelect={setFormReviewers}
          onClose={() => setIsTeacherPickerOpen(false)}
        />
      </div>
    </ConfigProvider>
  );
}

export function CreditRulesPage({ onNavigate, onNotify, onSetHeaderAction }) {
  const [isEditing, setIsEditing] = useState(false);
  const [exampleHours, setExampleHours] = useState("6");

  // 1.0 真实的社长学分规则初始值（参考 1.0 界面：4小时->8分，超出每小时4分，封顶20分）
  const [leaderThreshold, setLeaderThreshold] = useState("4");
  const [leaderBaseCredit, setLeaderBaseCredit] = useState("8");
  const [leaderExtraCredit, setLeaderExtraCredit] = useState("4");
  const [leaderMaxCredit, setLeaderMaxCredit] = useState("20");

  // 1.0 真实的成员学分规则初始值（参考 1.0 界面：4小时->6分，超出每小时3分，封顶18分）
  const [memberThreshold, setMemberThreshold] = useState("4");
  const [memberBaseCredit, setMemberBaseCredit] = useState("6");
  const [memberExtraCredit, setMemberExtraCredit] = useState("3");
  const [memberMaxCredit, setMemberMaxCredit] = useState("18");

  const handleSave = () => {
    setIsEditing(false);
    onNotify("已保存社长与成员学分规则");
  };

  useEffect(() => {
    if (!onSetHeaderAction) return undefined;
    if (isEditing) {
      onSetHeaderAction(
        <>
          <button type="button" className="btn-header-outline" onClick={() => setIsEditing(false)}>
            取消
          </button>
          <button type="button" className="btn-header-primary" onClick={handleSave}>
            保存修改
          </button>
        </>
      );
    } else {
      onSetHeaderAction(
        <button type="button" className="btn-header-primary" onClick={() => setIsEditing(true)}>
          编辑规则
        </button>
      );
    }
    return () => onSetHeaderAction(null);
  }, [isEditing, onSetHeaderAction]);

  // 计算示例辅助函数
  const calcCredit = (hours, threshold, base, extra, max) => {
    const h = Number(hours);
    const th = Number(threshold);
    const b = Number(base);
    const ex = Number(extra);
    const m = Number(max);
    if (h < th) return 0;
    return Math.min(m, b + (h - th) * ex);
  };

  return (
    <div className="settings-page credit-rule-page">
      <div className="settings-centered-wide">
        <EffectNotice>
          修改仅影响后续提交的学分申请，已认定结果不变。
        </EffectNotice>

        <div className="credit-form-scope-hint">
          <span>申请说明、证明材料等内容，请在</span>
          <button type="button" onClick={() => onNavigate("formSettings")}>表单设置 - 学分申请表</button>
          <span>中设置。</span>
        </div>

        <div className="credit-rule-main" data-proto-id="credit-rules-formulas">
          <section className="settings-surface credit-rule-card">
            <strong className="credit-card-title">社长学分规则</strong>
            {isEditing ? (
              <div className="credit-formula-row">
                <span className="formula-text">满</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="社长达标学时" value={leaderThreshold} onChange={(e) => setLeaderThreshold(e.target.value)} />
                  <b>小时</b>
                </div>
                <span className="formula-text">得</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="社长基础学分" value={leaderBaseCredit} onChange={(e) => setLeaderBaseCredit(e.target.value)} />
                  <b>学分</b>
                </div>
                <span className="formula-text">；每超 1 小时加</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="社长超出每小时学分" value={leaderExtraCredit} onChange={(e) => setLeaderExtraCredit(e.target.value)} />
                  <b>学分</b>
                </div>
                <span className="formula-text">；最高</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="社长最高学分" value={leaderMaxCredit} onChange={(e) => setLeaderMaxCredit(e.target.value)} />
                  <b>学分</b>
                </div>
              </div>
            ) : (
              <p className="credit-rule-formula">满 {leaderThreshold} 小时得 {leaderBaseCredit} 学分；每超 1 小时加 {leaderExtraCredit} 学分；最高 {leaderMaxCredit} 学分</p>
            )}
          </section>

          <section className="settings-surface credit-rule-card">
            <strong className="credit-card-title">成员学分规则</strong>
            {isEditing ? (
              <div className="credit-formula-row">
                <span className="formula-text">满</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="成员达标学时" value={memberThreshold} onChange={(e) => setMemberThreshold(e.target.value)} />
                  <b>小时</b>
                </div>
                <span className="formula-text">得</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="成员基础学分" value={memberBaseCredit} onChange={(e) => setMemberBaseCredit(e.target.value)} />
                  <b>学分</b>
                </div>
                <span className="formula-text">；每超 1 小时加</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="成员超出每小时学分" value={memberExtraCredit} onChange={(e) => setMemberExtraCredit(e.target.value)} />
                  <b>学分</b>
                </div>
                <span className="formula-text">；最高</span>
                <div className="inline-suffix-input">
                  <input type="number" aria-label="成员最高学分" value={memberMaxCredit} onChange={(e) => setMemberMaxCredit(e.target.value)} />
                  <b>学分</b>
                </div>
              </div>
            ) : (
              <p className="credit-rule-formula">满 {memberThreshold} 小时得 {memberBaseCredit} 学分；每超 1 小时加 {memberExtraCredit} 学分；最高 {memberMaxCredit} 学分</p>
            )}
          </section>

          <details className="credit-example-disclosure" data-proto-id="credit-rules-example">
            <summary>查看换算示例</summary>
            <div className="credit-example-calculator">
              <label>
                <span>认定学时</span>
                <input
                  type="number"
                  min="0"
                  aria-label="示例认定学时"
                  value={exampleHours}
                  onChange={(e) => setExampleHours(e.target.value)}
                />
                <em>小时</em>
              </label>
              <div className="credit-example-results">
                <span>社长 <strong>{calcCredit(exampleHours, leaderThreshold, leaderBaseCredit, leaderExtraCredit, leaderMaxCredit)} 学分</strong></span>
                <span>成员 <strong>{calcCredit(exampleHours, memberThreshold, memberBaseCredit, memberExtraCredit, memberMaxCredit)} 学分</strong></span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
