import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowClockwise,
  CopySimple,
  Lightbulb,
  Sparkle,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { currentTerm, termOptions } from "./fixtures.js";
import { AppIcon } from "./shell.jsx";
import { EmptyState, SelectField } from "./ui.jsx";

const CATEGORY_COLORS = {
  文史学院: "#356df3",
  艺术学院: "#8b5cf6",
  国际学院: "#14b8a6",
  科技学院: "#f59e0b",
  体育学院: "#ef4444",
};

const ATTENDANCE_COLORS = {
  present: "#21b573",
  late: "#faad14",
  absent: "#ff4d4f",
  leave: "#9254de",
  pending: "#d0d5dd",
};

const reportData = {
  [currentTerm]: {
    participants: 167,
    uniqueStudents: 132,
    schoolStudents: 170,
    totalSpeakers: 82,
    speakers: 64,
    weeklyRates: [88, 90, 89, 91, 92, 93, 90, 91, 92, null],
    clubs: [
      {
        id: 1, name: "围棋社", category: "文史学院", leader: "赵晨", members: 28, capacity: 35,
        sessions: 6, present: 148, late: 7, absent: 9, leave: 4, pending: 0,
        posts: 46, speakers: 14, featured: 6, credits: 96, creditsTotal: 110,
        depth: { deep: 9, mid: 11, light: 5, none: 3 },
        weekly: [1, 1, 0, 1, 1, 1, 1, 0, 0, 0],
        lastActivity: "10月12日", active30: true, status: "进行中", origin: "从上学期延续",
        risk: [], riskLevel: 0,
      },
      {
        id: 2, name: "街舞社", category: "艺术学院", leader: "林小满", members: 34, capacity: 40,
        sessions: 8, present: 228, late: 11, absent: 21, leave: 12, pending: 0,
        posts: 78, speakers: 20, featured: 9, credits: 118, creditsTotal: 130,
        depth: { deep: 12, mid: 13, light: 6, none: 3 },
        weekly: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        lastActivity: "10月15日", active30: true, status: "进行中", origin: "本学期新申报",
        risk: [], riskLevel: 0,
      },
      {
        id: 3, name: "国学研习社", category: "文史学院", leader: "顾言", members: 22, capacity: 25,
        sessions: 3, present: 45, late: 4, absent: 10, leave: 7, pending: 0,
        posts: 18, speakers: 6, featured: 2, credits: 36, creditsTotal: 42,
        depth: { deep: 4, mid: 7, light: 6, none: 5 },
        weekly: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        lastActivity: "9月24日", active30: false, status: "已提前结束", origin: "从上学期延续",
        risk: ["提前结束"], riskLevel: 1,
      },
      {
        id: 4, name: "阿卡贝拉社", category: "艺术学院", leader: "唐语菲", members: 16, capacity: 20,
        sessions: 0, present: 0, late: 0, absent: 0, leave: 0, pending: 0,
        posts: 0, speakers: 0, featured: 0, credits: 0, creditsTotal: 0,
        depth: { deep: 0, mid: 0, light: 0, none: 16 },
        weekly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        lastActivity: "—", active30: false, status: "进行中", origin: "本学期新申报",
        risk: ["无活动"], riskLevel: 2,
      },
      {
        id: 5, name: "模拟联合国", category: "国际学院", leader: "沈知行", members: 42, capacity: 42,
        sessions: 7, present: 271, late: 8, absent: 6, leave: 9, pending: 0,
        posts: 96, speakers: 26, featured: 12, credits: 152, creditsTotal: 165,
        depth: { deep: 15, mid: 14, light: 9, none: 4 },
        weekly: [1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        lastActivity: "10月16日", active30: true, status: "进行中", origin: "从上学期延续",
        risk: ["满员"], riskLevel: 0,
      },
      {
        id: 6, name: "造物工坊", category: "科技学院", leader: "陈屿", members: 25, capacity: 30,
        sessions: 9, present: 195, late: 8, absent: 11, leave: 11, pending: 0,
        posts: 54, speakers: 16, featured: 5, credits: 82, creditsTotal: 90,
        depth: { deep: 10, mid: 9, light: 4, none: 2 },
        weekly: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        lastActivity: "10月17日", active30: true, status: "进行中", origin: "从上学期延续",
        risk: ["结束申请中"], riskLevel: 1,
      },
    ],
  },
  "2025-2026学年第二学期": {
    participants: 79,
    uniqueStudents: 68,
    schoolStudents: 170,
    totalSpeakers: 40,
    speakers: 36,
    weeklyRates: [86, 88, 89, 90, 90, 91, 89, 90, 92, 91],
    clubs: [
      {
        id: 11, name: "校园跑酷社", category: "体育学院", leader: "周奕辰", members: 19, capacity: 24,
        sessions: 11, present: 190, late: 4, absent: 9, leave: 6, pending: 0,
        posts: 42, speakers: 12, featured: 5, credits: 88, creditsTotal: 96,
        depth: { deep: 8, mid: 7, light: 3, none: 1 },
        weekly: [1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        lastActivity: "6月12日", active30: false, status: "本学期已结束", origin: "本学期新申报",
        risk: [], riskLevel: 0,
      },
      {
        id: 12, name: "围棋社", category: "文史学院", leader: "赵晨", members: 24, capacity: 30,
        sessions: 8, present: 168, late: 6, absent: 12, leave: 6, pending: 0,
        posts: 38, speakers: 13, featured: 4, credits: 84, creditsTotal: 92,
        depth: { deep: 8, mid: 9, light: 5, none: 2 },
        weekly: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        lastActivity: "6月10日", active30: false, status: "本学期已结束", origin: "从上学期延续",
        risk: [], riskLevel: 0,
      },
      {
        id: 13, name: "校园电台社", category: "艺术学院", leader: "方予安", members: 16, capacity: 16,
        sessions: 6, present: 84, late: 3, absent: 6, leave: 3, pending: 0,
        posts: 26, speakers: 8, featured: 3, credits: 60, creditsTotal: 66,
        depth: { deep: 5, mid: 6, light: 3, none: 2 },
        weekly: [0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        lastActivity: "6月8日", active30: false, status: "本学期已结束", origin: "从上学期延续",
        risk: ["满员"], riskLevel: 0,
      },
      {
        id: 14, name: "非遗手作社", category: "艺术学院", leader: "宋晚晴", members: 20, capacity: 26,
        sessions: 5, present: 85, late: 3, absent: 8, leave: 4, pending: 0,
        posts: 20, speakers: 7, featured: 2, credits: 56, creditsTotal: 62,
        depth: { deep: 6, mid: 7, light: 4, none: 3 },
        weekly: [1, 1, 0, 1, 1, 1, 0, 0, 0, 0],
        lastActivity: "6月5日", active30: false, status: "本学期已结束", origin: "本学期新申报",
        risk: [], riskLevel: 0,
      },
    ],
  },
};

const attendedOf = (club) => club.present + club.late;
const trackedOf = (club) => club.present + club.late + club.absent + club.leave + club.pending;
const rateOf = (club) => (trackedOf(club) ? Math.round((attendedOf(club) / trackedOf(club)) * 100) : null);

function Kpi({ label, value, unit, note }) {
  return (
    <div className="report-kpi">
      <span>{label}</span>
      <strong>{value}{unit ? <em>{unit}</em> : null}</strong>
      <small>{note}</small>
    </div>
  );
}

function ReportSection({ index, title, children }) {
  return (
    <section className="report-section">
      <header className="report-section-head">
        <span className="report-section-index">{index}</span>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}

function ChartCard({ title, hint, wide = false, action, children }) {
  return (
    <section className={`report-chart${wide ? " wide" : ""}`}>
      <header className="report-chart-head">
        <div>
          <strong>{title}</strong>
          <span>{hint}</span>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Donut({ groups, unit = "个社团", ariaLabel = "社团类别分布" }) {
  const total = groups.reduce((sum, group) => sum + group.value, 0);
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="report-donut">
      <svg viewBox="0 0 180 180" role="img" aria-label={ariaLabel}>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#eef1f6" strokeWidth="24" />
        {groups.map((group) => {
          const length = total ? (group.value / total) * circumference : 0;
          const visible = Math.max(length - 2, 0);
          const node = (
            <circle
              key={group.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={group.color}
              strokeWidth="24"
              strokeDasharray={`${visible} ${circumference - visible}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
            />
          );
          offset += length;
          return node;
        })}
      </svg>
      <div className="report-donut-center">
        <strong>{total}</strong>
        <span>{unit}</span>
      </div>
    </div>
  );
}

function LegendList({ items, unit = "" }) {
  return (
    <ul className="report-legend">
      {items.map((item) => (
        <li key={item.label}>
          <i style={{ background: item.color }} />
          <span>{item.label}</span>
          <em>{item.value}{unit ? <small className="report-legend-unit">{unit}</small> : null}</em>
        </li>
      ))}
    </ul>
  );
}

function QuadrantChart({ clubs, xValue, yValue, xDomain, yDomain, mid, quadrantLabels, xLabel, yLabel, xTicks, yTicks, large = false }) {
  const width = large ? 1040 : 540;
  const height = large ? 520 : 340;
  const pad = large
    ? { left: 64, right: 34, top: 34, bottom: 58 }
    : { left: 46, right: 22, top: 22, bottom: 44 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yDomain;
  const x = (value) => pad.left + ((Math.min(Math.max(value, xMin), xMax) - xMin) / (xMax - xMin)) * innerWidth;
  const y = (value) => pad.top + innerHeight - ((Math.min(Math.max(value, yMin), yMax) - yMin) / (yMax - yMin)) * innerHeight;

  return (
    <div className={`report-quadrant${large ? " large" : ""}`}>
      <svg className="report-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${xLabel}与${yLabel}四象限`}>
        <rect x={pad.left} y={pad.top} width={innerWidth} height={innerHeight} fill="#fbfcfe" />
        <line x1={x(mid[0])} x2={x(mid[0])} y1={pad.top} y2={pad.top + innerHeight} stroke="#e3e8f0" strokeDasharray="4 4" />
        <line x1={pad.left} x2={pad.left + innerWidth} y1={y(mid[1])} y2={y(mid[1])} stroke="#e3e8f0" strokeDasharray="4 4" />
        {xTicks.map((tick) => (
          <text key={tick} x={x(tick)} y={height - 20} textAnchor="middle" className="report-svg-axis">{tick}</text>
        ))}
        {yTicks.map((tick) => (
          <text key={tick} x={pad.left - 8} y={y(tick) + 4} textAnchor="end" className="report-svg-axis">{tick}</text>
        ))}
        <text x={pad.left + innerWidth / 2} y={height - 4} textAnchor="middle" className="report-svg-axis">{xLabel}</text>
        <text x={pad.left - 32} y={pad.top + innerHeight / 2} className="report-svg-axis report-svg-axis-y">{yLabel}</text>
        {clubs.map((club) => {
          const radius = (large ? 10 : 6) + club.members / (large ? 8 : 9);
          return (
            <g key={club.id}>
              <circle
                cx={x(xValue(club))}
                cy={y(yValue(club))}
                r={radius}
                fill={CATEGORY_COLORS[club.category] || "#356df3"}
                fillOpacity="0.72"
                stroke="#fff"
                strokeWidth="1.5"
              >
                <title>{`${club.name} · ${xLabel} ${xValue(club)} · ${yLabel} ${yValue(club)}`}</title>
              </circle>
              <text x={x(xValue(club))} y={y(yValue(club)) + radius + (large ? 15 : 11)} textAnchor="middle" className="report-point-label">{club.name}</text>
            </g>
          );
        })}
      </svg>
      <span className="report-quadrant-tag tl">{quadrantLabels.topLeft}</span>
      <span className="report-quadrant-tag tr">{quadrantLabels.topRight}</span>
      <span className="report-quadrant-tag bl">{quadrantLabels.bottomLeft}</span>
      <span className="report-quadrant-tag br">{quadrantLabels.bottomRight}</span>
    </div>
  );
}

function StructureChart({ rows, legend }) {
  return (
    <div className="report-stack">
      {rows.map((row) => (
        <div className="report-stack-row" key={row.name}>
          <span className="report-stack-name" title={row.name}>{row.name}</span>
          <div className="report-stack-track">
            {row.parts.filter((part) => part.value > 0).map((part) => (
              <i
                key={part.key}
                style={{ flexGrow: part.value, background: part.color }}
                title={`${part.label} ${part.value} 人`}
              />
            ))}
          </div>
          <span className="report-stack-total">{row.total}</span>
        </div>
      ))}
      <ul className="report-legend">
        {legend.map((item) => (
          <li key={item.key}>
            <i style={{ background: item.color }} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskBadge({ label }) {
  const tone = label === "无活动" ? "high" : label === "满员" ? "info" : "warn";
  return <span className={`report-risk ${tone}`}>{label}</span>;
}

function useReportData(term, category) {
  const data = reportData[term] || reportData[currentTerm];
  const clubs = data.clubs.filter((club) => category === "全部" || club.category === category);
  const categories = [...new Set(data.clubs.map((club) => club.category))];

  return useMemo(() => {
    const participants = clubs.reduce((sum, club) => sum + club.members, 0);
    const tracked = clubs.reduce((sum, club) => sum + trackedOf(club), 0);
    const attended = clubs.reduce((sum, club) => sum + attendedOf(club), 0);
    const sessions = clubs.reduce((sum, club) => sum + club.sessions, 0);
    const rate = tracked ? Math.round((attended / tracked) * 100) : 0;
    const unique = data.participants
      ? Math.round((data.uniqueStudents * participants) / data.participants)
      : 0;
    const speakersSum = clubs.reduce((sum, club) => sum + club.speakers, 0);
    const speakers = data.totalSpeakers
      ? Math.round((data.speakers * speakersSum) / data.totalSpeakers)
      : 0;
    const credits = clubs.reduce((sum, club) => sum + club.credits, 0);
    const creditsTotal = clubs.reduce((sum, club) => sum + club.creditsTotal, 0);
    const activeCount = clubs.filter((club) => club.active30).length;
    const attention = clubs.filter((club) => club.riskLevel > 0);

    return {
      clubs,
      categories,
      participants,
      sessions,
      rate,
      unique,
      speakers,
      credits,
      creditsTotal,
      activeCount,
      attention,
      avgClubs: unique ? (participants / unique).toFixed(1) : "0",
      avgSessions: unique ? (attended / unique).toFixed(1) : "0",
      speakerPct: unique ? Math.round((speakers / unique) * 100) : 0,
      creditPct: creditsTotal ? Math.round((credits / creditsTotal) * 100) : 0,
      participationPct: data.schoolStudents ? Math.round((unique / data.schoolStudents) * 100) : 0,
      activePct: clubs.length ? Math.round((activeCount / clubs.length) * 100) : 0,
    };
  }, [clubs, data]);
}

function buildInsight(state, term, category) {
  const range = `${term} · ${category === "全部" ? "全部社团类别" : category}`;
  const quiet = [...state.clubs].sort((a, b) => (a.speakers / Math.max(a.members, 1)) - (b.speakers / Math.max(b.members, 1)))[0];
  const fullClubs = state.clubs.filter((club) => club.members >= club.capacity);
  const tracked = state.clubs.reduce((sum, club) => sum + trackedOf(club), 0);
  const absent = state.clubs.reduce((sum, club) => sum + club.absent, 0);

  return {
    range,
    conclusions: [
      `${state.clubs.length} 个社团本学期共开展 ${state.sessions} 场活动，平均出勤率 ${state.rate}%。`,
      `参与学生 ${state.unique} 人，占全校 ${state.participationPct}%，人均参加 ${state.avgClubs} 个社团、${state.avgSessions} 场活动。`,
      `近 30 天有活动的社团 ${state.activeCount} 个（${state.activePct}%）；有发言学生占比 ${state.speakerPct}%，已认定学时 ${state.credits}（完成率 ${state.creditPct}%），${fullClubs.length} 个社团已达人数上限。`,
    ],
    attention: state.attention.map((club) => ({
      name: club.name,
      reason: [
        ...club.risk,
        rateOf(club) !== null && rateOf(club) < 80 ? `出勤率 ${rateOf(club)}%` : null,
      ].filter(Boolean).join("、"),
      action: club.riskLevel >= 2 ? "建议约谈社长，确认是否继续运行或调整成员" : "建议跟进本学期后续活动安排",
    })),
    suggestions: [
      "对近 30 天无活动的社团发起一次运行确认，明确是否继续、暂停或提前结束。",
      `全校累计缺勤 ${absent} 人次（占应到人次 ${tracked ? Math.round((absent / tracked) * 100) : 0}%），建议要求社长在活动前一天完成一次到场提醒。`,
      `对满员社团评估是否增补名额，并引导 ${quiet ? `${quiet.name} 等讨论较沉寂的社团` : "讨论较沉寂的社团"}设置每场活动话题引导。`,
    ],
  };
}

function AiDrawer({ open, title, onClose, insight, status, onGenerate }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!open) return null;

  const copyAll = () => {
    const text = [
      `【核心结论】`,
      ...insight.conclusions.map((item) => `· ${item}`),
      "",
      `【需要关注】`,
      ...insight.attention.map((item) => `· ${item.name}：${item.reason}；${item.action}`),
      "",
      `【建议动作】`,
      ...insight.suggestions.map((item, index) => `${index + 1}. ${item}`),
    ].join("\n");
    setCopied(true);
    const clipboard = navigator.clipboard;
    if (clipboard) clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="report-drawer-mask" role="presentation" onClick={onClose}>
      <aside className="report-drawer" role="dialog" aria-modal="true" aria-label={`${title} AI 解读`} onClick={(event) => event.stopPropagation()}>
        <header className="report-drawer-head">
          <span className="report-drawer-icon"><AppIcon icon={Sparkle} size={17} weight="fill" /></span>
          <div>
            <strong>AI 解读 · {title}</strong>
            <span>{insight.range}</span>
          </div>
          <button type="button" className="report-drawer-close" onClick={onClose} aria-label="关闭"><AppIcon icon={X} size={16} weight="bold" /></button>
        </header>

        <div className="report-drawer-body">
          {status === "loading" ? (
            <div className="report-ai-loading">
              <span className="report-ai-loading-icon"><AppIcon icon={Sparkle} size={20} weight="fill" /></span>
              <strong>基于当前筛选数据生成解读</strong>
              <span className="report-ai-scope">数据范围：{insight.range} · 数据截至 2026-10-26</span>
              <div className="report-ai-skeleton"><i /><i /><i /><i /><i /></div>
            </div>
          ) : null}

          {status === "done" ? (
            <div className="report-ai-content">
              <section>
                <h4><AppIcon icon={Lightbulb} size={15} weight="fill" />核心结论</h4>
                {insight.conclusions.map((item) => <p key={item} className="report-ai-conclusion">{item}</p>)}
              </section>
              <section>
                <h4><AppIcon icon={WarningCircle} size={15} weight="fill" />需要关注</h4>
                {insight.attention.length === 0 ? <p className="report-ai-empty">当前筛选范围内没有明显风险社团。</p> : (
                  <div className="report-ai-list">
                    {insight.attention.map((item) => (
                      <article key={item.name}>
                        <div><strong>{item.name}</strong><span>{item.reason}</span></div>
                        <p>{item.action}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <h4><AppIcon icon={Sparkle} size={15} weight="fill" />建议动作</h4>
                <ol className="report-ai-actions">
                  {insight.suggestions.map((item) => <li key={item}>{item}</li>)}
                </ol>
              </section>
              <p className="report-ai-foot-note">生成时间 2026-10-26 16:35 · AI 生成内容仅供决策参考</p>
            </div>
          ) : null}
        </div>

        {status === "done" ? (
          <footer className="report-drawer-foot">
            <button type="button" className="secondary-action" onClick={onGenerate}>
              <AppIcon icon={ArrowClockwise} size={14} />重新生成
            </button>
            <button type="button" className="report-ai-copy" onClick={copyAll}>
              <AppIcon icon={CopySimple} size={14} />{copied ? "已复制" : "复制全文"}
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}

function ReportToolbar({ term, onTerm, category, onCategory, categories }) {
  return (
    <div className="report-toolbar">
      <div className="report-toolbar-filters">
        <SelectField label="学期" value={term} onChange={onTerm} options={termOptions} />
        <SelectField label="社团类别" value={category} onChange={onCategory} options={["全部", ...categories]} />
      </div>
      <div className="report-toolbar-actions">
        <button type="button" className="primary-action report-export">导出报告</button>
      </div>
    </div>
  );
}

function AiBar({ onOpen }) {
  return (
    <button type="button" className="report-ai-bar" onClick={onOpen}>
      <span className="report-ai-bar-icon"><AppIcon icon={Sparkle} size={17} weight="fill" /></span>
      <strong>AI 解读</strong>
    </button>
  );
}

export function ClubRunReportPage() {
  const [term, setTerm] = useState(currentTerm);
  const [category, setCategory] = useState("全部");
  const state = useReportData(term, category);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  useEffect(() => {
    setAiStatus("idle");
  }, [term, category]);

  const generate = () => {
    setAiStatus("loading");
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAiStatus("done"), 1400);
  };

  const openAi = () => {
    setAiOpen(true);
    generate();
  };

  const insight = buildInsight(state, term, category);

  const categoryCountRows = state.categories
    .map((name) => ({
      label: name,
      color: CATEGORY_COLORS[name] || "#356df3",
      value: state.clubs.filter((club) => club.category === name).length,
    }))
    .filter((row) => row.value > 0);

  const memberGroups = state.categories
    .map((name) => ({
      label: name,
      color: CATEGORY_COLORS[name] || "#356df3",
      value: state.clubs.filter((club) => club.category === name).reduce((sum, club) => sum + club.members, 0),
    }))
    .filter((group) => group.value > 0);
  const memberTotal = memberGroups.reduce((sum, group) => sum + group.value, 0);
  const topMemberGroup = [...memberGroups].sort((a, b) => b.value - a.value)[0];

  const ended = state.clubs.filter((club) => club.status !== "进行中").length;
  const runningCount = state.clubs.filter((club) => club.status === "进行中").length;
  const continuedCount = state.clubs.filter((club) => club.origin === "从上学期延续").length;
  const endedEarlyCount = state.clubs.filter((club) => club.status === "已提前结束").length;

  const attendanceRows = state.clubs.map((club) => ({
    name: club.name,
    total: trackedOf(club),
    parts: [
      { key: "present", label: "出勤", value: club.present, color: ATTENDANCE_COLORS.present },
      { key: "late", label: "迟到", value: club.late, color: ATTENDANCE_COLORS.late },
      { key: "absent", label: "缺勤", value: club.absent, color: ATTENDANCE_COLORS.absent },
      { key: "leave", label: "请假", value: club.leave, color: ATTENDANCE_COLORS.leave },
    ],
  }));
  const attendanceLegend = [
    { key: "present", label: "出勤", color: ATTENDANCE_COLORS.present },
    { key: "late", label: "迟到", color: ATTENDANCE_COLORS.late },
    { key: "absent", label: "缺勤", color: ATTENDANCE_COLORS.absent },
    { key: "leave", label: "请假", color: ATTENDANCE_COLORS.leave },
  ];
  const trackedTotal = state.clubs.reduce((sum, club) => sum + trackedOf(club), 0);
  const pctOf = (value) => (trackedTotal ? Number(((value / trackedTotal) * 100).toFixed(1)) : 0);
  const attendanceStats = [
    { label: "出勤率", value: pctOf(state.clubs.reduce((sum, club) => sum + club.present, 0)) },
    { label: "迟到率", value: pctOf(state.clubs.reduce((sum, club) => sum + club.late, 0)) },
    { label: "缺勤率", value: pctOf(state.clubs.reduce((sum, club) => sum + club.absent, 0)) },
    { label: "请假率", value: pctOf(state.clubs.reduce((sum, club) => sum + club.leave, 0)) },
  ];

  return (
    <div className="report-page">
      <ReportToolbar
        term={term}
        onTerm={setTerm}
        category={category}
        onCategory={setCategory}
        categories={state.categories}
      />
      <AiBar onOpen={openAi} />
      <ReportSection index="01" title="数据总览">
        <div className="report-kpi-groups">
          <div>
            <span className="report-kpi-group-label">社团维度</span>
            <div className="report-kpi-grid">
              <Kpi label="社团总数" value={state.clubs.length} unit="个" note={`进行中 ${runningCount} · 已结束 ${ended}`} />
              <Kpi label="活动场次" value={state.sessions} unit="场" note={`周均 ${(state.sessions / 10).toFixed(1)} 场`} />
              <Kpi label="活跃社团占比" value={state.activePct} unit="%" note={`近 30 天有活动 ${state.activeCount} 个`} />
              <Kpi label="需关注社团" value={state.attention.length} unit="个" note="无活动、提前结束或结束申请中" />
            </div>
          </div>
          <div>
            <span className="report-kpi-group-label">学生参与</span>
            <div className="report-kpi-grid">
              <Kpi label="参与学生" value={state.unique} unit="人" note={`占全校 ${state.participationPct}%`} />
              <Kpi label="平均出勤率" value={state.rate} unit="%" note="含迟到，按应到人次加权" />
              <Kpi label="有发言学生占比" value={state.speakerPct} unit="%" note={`${state.speakers} 人在讨论中发过言`} />
              <Kpi label="已认定学时" value={state.credits} unit="学时" note={`认定完成率 ${state.creditPct}%`} />
            </div>
          </div>
        </div>
      </ReportSection>

      <ReportSection index="02" title="数据详情">
        {state.clubs.length === 0 ? <EmptyState title="当前筛选下没有社团" /> : (
          <div className="report-grid">
            <ChartCard title="社团数量分布" hint="各类别社团数量，与右侧人员数量分布对照查看">
              <div className="report-donut-row">
                <Donut groups={categoryCountRows} unit="个社团" ariaLabel="各类别社团数量分布" />
                <LegendList items={categoryCountRows} unit="个" />
              </div>
              <div className="report-structure-stats">
                <div>
                  <span>本学期进行中</span>
                  <strong>{runningCount}<em>个</em></strong>
                </div>
                <div>
                  <span>上学期延续</span>
                  <strong>{continuedCount}<em>个</em></strong>
                </div>
                <div>
                  <span>已提前结束</span>
                  <strong>{endedEarlyCount}<em>个</em></strong>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="人员数量分布" hint="按类别统计成员人数，中心为合计人数">
              <div className="report-donut-row">
                <Donut groups={memberGroups} unit="人" ariaLabel="各类别社团成员人数分布" />
                <LegendList items={memberGroups} unit="人" />
              </div>
              {topMemberGroup ? (
                <p className="report-chart-note">
                  人数最多：{topMemberGroup.label}（{topMemberGroup.value} 人，占 {memberTotal ? Math.round((topMemberGroup.value / memberTotal) * 100) : 0}%）
                </p>
              ) : null}
            </ChartCard>

            <ChartCard wide title="社团活跃度" hint="横轴活动场次，纵轴平均出勤率，气泡大小为成员数">
              <QuadrantChart
                large
                clubs={state.clubs}
                xValue={(club) => club.sessions}
                yValue={(club) => rateOf(club) ?? 0}
                xDomain={[0, 10]}
                yDomain={[60, 100]}
                mid={[5, 85]}
                quadrantLabels={{ topLeft: "低频高质", topRight: "活跃标杆", bottomLeft: "待关注", bottomRight: "频次虚高" }}
                xLabel="活动场次"
                yLabel="出勤率"
                xTicks={[0, 5, 10]}
                yTicks={[60, 80, 100]}
              />
            </ChartCard>

            <ChartCard wide title="学生出勤分析" hint="各社团出勤结果构成：出勤 / 迟到 / 缺勤 / 请假">
              <StructureChart rows={attendanceRows} legend={attendanceLegend} />
              <div className="report-structure-stats four">
                {attendanceStats.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value.toFixed(1)}<em>%</em></strong>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard wide title="社团运行明细" hint="按社团查看活动、出勤、讨论与关注点">
              <div className="table-scroll report-table-scroll">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>社团</th>
                      <th>类别</th>
                      <th>社长</th>
                      <th>成员</th>
                      <th>活动场次</th>
                      <th>平均出勤率</th>
                      <th>讨论数</th>
                      <th>最近活动</th>
                      <th>状态</th>
                      <th>关注点</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.clubs.map((club) => (
                      <tr key={club.id}>
                        <td><strong>{club.name}</strong></td>
                        <td>{club.category}</td>
                        <td>{club.leader}</td>
                        <td>{club.members} / {club.capacity}</td>
                        <td>{club.sessions}</td>
                        <td>{rateOf(club) === null ? "—" : `${rateOf(club)}%`}</td>
                        <td>{club.posts}</td>
                        <td>{club.lastActivity}</td>
                        <td>{club.status}</td>
                        <td>
                          <span className="report-risk-group">
                            {club.risk.length === 0 ? <span className="report-risk neutral">正常</span> : club.risk.map((item) => <RiskBadge key={item} label={item} />)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        )}
      </ReportSection>

      <AiDrawer
        open={aiOpen}
        title="社团报告"
        insight={insight}
        status={aiStatus}
        onClose={() => setAiOpen(false)}
        onGenerate={generate}
      />
    </div>
  );
}
