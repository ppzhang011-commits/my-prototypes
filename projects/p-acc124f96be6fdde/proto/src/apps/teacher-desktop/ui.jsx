import { CaretDown, CaretUp, MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react";
import { AppIcon } from "./shell.jsx";

export function SearchField({ value, onChange, placeholder, protoId }) {
  return (
    <label className="search-field">
      <AppIcon icon={MagnifyingGlass} size={16} />
      <input data-proto-id={protoId} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, protoId }) {
  return (
    <label className="select-field">
      <span className="sr-only">{label}</span>
      <select data-proto-id={protoId} aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option === "全部" ? `${label}：全部` : option}</option>)}
      </select>
      <AppIcon icon={CaretDown} size={14} />
    </label>
  );
}

export function FilterBar({ children, advanced, advancedOpen, onToggleAdvanced, changed, onReset, protoId, advancedProtoId, resetProtoId }) {
  return (
    <div className="filter-bar" data-proto-id={protoId}>
      <div className="filter-main">
        {children}
        {advanced ? (
          <button type="button" data-proto-id={advancedProtoId} className={`filter-button ${advancedOpen ? "active" : ""}`} onClick={onToggleAdvanced} aria-expanded={advancedOpen}>
            <AppIcon icon={SlidersHorizontal} size={15} />更多筛选<AppIcon icon={advancedOpen ? CaretUp : CaretDown} size={13} />
          </button>
        ) : null}
        {changed ? <button type="button" data-proto-id={resetProtoId} className="reset-button" onClick={onReset}>重置</button> : null}
      </div>
      {advancedOpen ? <div className="advanced-filters">{advanced}</div> : null}
    </div>
  );
}

export function EmptyState({ title }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><AppIcon icon={MagnifyingGlass} size={24} /></span>
      <strong>{title}</strong>
      <span>请调整筛选条件后重试</span>
    </div>
  );
}

export function StatusBadge({ value }) {
  const tone = ["已通过", "进行中", "已发布", "使用中"].includes(value)
    ? "success"
    : ["待审核", "审核中", "草稿", "已提前结束", "社长申请结束"].includes(value)
      ? "warning"
      : ["已退回"].includes(value)
        ? "danger"
        : "neutral";
  return <span className={`status status-${tone}`}>{value}</span>;
}

function Pagination({ count }) {
  return (
    <div className="pagination">
      <span>共 {count} 条</span>
      <button type="button" className="page-size">10条/页 <AppIcon icon={CaretDown} size={12} /></button>
      <button type="button" disabled aria-label="上一页">‹</button>
      <button type="button" className="current" aria-current="page">1</button>
      <button type="button" disabled aria-label="下一页">›</button>
      <span>前往</span><input aria-label="页码" value="1" readOnly /><span>页</span>
    </div>
  );
}

export function TableFrame({ count, countLabel = "条", action, children, protoId }) {
  return (
    <section className="table-section" data-proto-id={protoId}>
      <div className="table-toolbar">
        <span>共 {count} {countLabel}</span>
        {action}
      </div>
      {children}
      {count > 0 ? <Pagination count={count} /> : null}
    </section>
  );
}
