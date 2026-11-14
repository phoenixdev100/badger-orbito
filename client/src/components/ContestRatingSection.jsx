import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, Calendar, Trophy, TrendingUp, ShieldCheck } from 'lucide-react';

// ─── Platform Display Config ───────────────────────────────────────────────
const PLATFORM_META = {
  leetcode:      { label: 'LeetCode',   color: '#FFA116', bg: '#FFA11618', glow: 'rgba(255, 161, 22, 0.4)' },
  codechef:      { label: 'CodeChef',   color: '#A855F7', bg: '#A855F718', glow: 'rgba(168, 85, 247, 0.4)' },
  codestudio:    { label: 'CodeStudio', color: '#EF4444', bg: '#EF444418', glow: 'rgba(239, 68, 68, 0.4)' },
  hackerrank:    { label: 'HackerRank', color: '#22C55E', bg: '#22C55E18', glow: 'rgba(34, 197, 94, 0.4)' },
  codeforces:    { label: 'Codeforces', color: '#0EA5E9', bg: '#0EA5E918', glow: 'rgba(14, 165, 233, 0.4)' },
  geeksforgeeks: { label: 'GFG',        color: '#10B981', bg: '#10B98118', glow: 'rgba(16, 185, 129, 0.4)' },
  atcoder:       { label: 'AtCoder',    color: '#94A3B8', bg: '#94A3B818', glow: 'rgba(148, 163, 184, 0.4)' },
};

// ─── SVG Smooth Spline Chart Math ──────────────────────────────────────────
const W = 650;
const H = 210;
const PAD = { top: 20, right: 20, bottom: 28, left: 52 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

function catmullRomPath(points) {
  if (points.length < 2) return '';
  const pts = [points[0], ...points, points[points.length - 1]];
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// ─── Rating Curve Component ────────────────────────────────────────────────
function RatingChart({ contestList, color, label }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const ratings  = contestList.map((c) => c.rating);
  const minR     = Math.min(...ratings);
  const maxR     = Math.max(...ratings);
  const rangeR   = maxR - minR || 100;
  const padded   = rangeR * 0.15;
  const yMin     = Math.floor((minR - padded) / 50) * 50;
  const yMax     = Math.ceil((maxR + padded) / 50) * 50;
  const yRange   = yMax - yMin;

  const toX = (i) => PAD.left + (i / Math.max(contestList.length - 1, 1)) * CHART_W;
  const toY = (r) => PAD.top + (1 - (r - yMin) / yRange) * CHART_H;

  const points   = contestList.map((c, i) => ({ x: toX(i), y: toY(c.rating) }));
  const linePath = points.length ? catmullRomPath(points) : '';
  const areaPath = points.length
    ? linePath
      + ` L ${points[points.length - 1].x} ${PAD.top + CHART_H}`
      + ` L ${points[0].x} ${PAD.top + CHART_H} Z`
    : '';

  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    yMin + Math.round((yRange / tickCount) * i)
  );

  const handleMouseMove = useCallback(
    (e) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = (e.clientX - rect.left) * (W / rect.width) - PAD.left;
      const idx = Math.min(
        Math.max(Math.round((mx / CHART_W) * (contestList.length - 1)), 0),
        contestList.length - 1
      );
      setTooltip({ x: points[idx].x, y: points[idx].y, contest: contestList[idx] });
    },
    [contestList, points]
  );

  const fmt = (ts) => {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const gradId = `areaGrad-${label.replace(/\s+/g, '')}`;

  if (!contestList || contestList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[210px] text-slate-500 text-sm">
        <Trophy className="w-8 h-8 text-slate-600 mb-2" />
        No contest rating history available for {label}.
      </div>
    );
  }

  return (
    <div className="relative select-none w-full">
      {/* Top Details & Tooltip HUD */}
      <div className="flex items-center justify-between min-h-[50px] mb-3 px-1">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Latest Rating</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono" style={{ color }}>
              {tooltip ? tooltip.contest.rating : contestList[contestList.length - 1].rating}
            </p>
          </div>

          <div className="border-l border-white/10 pl-4">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Peak</p>
            <p className="text-sm sm:text-base font-bold text-white font-mono">
              {maxR}
            </p>
          </div>
        </div>

        {tooltip ? (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <p className="text-xs font-semibold text-white truncate max-w-[220px]">
              {tooltip.contest.contestName}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {fmt(tooltip.contest.contestDate)} · Rank #{tooltip.contest.rank?.toLocaleString() || '-'}
            </p>
          </motion.div>
        ) : (
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Hover along the curve to inspect past contests
          </p>
        )}
      </div>

      {/* Responsive SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto max-h-[220px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.38" />
              <stop offset="70%" stopColor={color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={color} stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Y-axis gridlines & labels */}
          {yTicks.map((tick) => {
            const ty = toY(tick);
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={ty}
                  x2={PAD.left + CHART_W}
                  y2={ty}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD.left - 8}
                  y={ty + 3}
                  textAnchor="end"
                  fill="rgba(148,163,184,0.6)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradId})`} />

          {/* Trajectory Line */}
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill={color}
              stroke="#0c0d12"
              strokeWidth="2"
              opacity={tooltip && tooltip.x === pt.x ? 1 : 0.6}
            />
          ))}

          {/* Active Hover Indicator */}
          {tooltip && (
            <>
              <line
                x1={tooltip.x}
                y1={PAD.top}
                x2={tooltip.x}
                y2={PAD.top + CHART_H}
                stroke={color}
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              <circle
                cx={tooltip.x}
                cy={tooltip.y}
                r="6"
                fill={color}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

// ─── Realtime Activity Heatmap Component ───────────────────────────────────
function ActivityHeatmap({ calendar, activeDaysCount = 0 }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate real calendar days for the past 28 weeks (196 days)
  const TOTAL_WEEKS = 28;
  const { weeks } = useMemo(() => {
    const dayMap = {};

    if (calendar && typeof calendar === 'object') {
      Object.entries(calendar).forEach(([ts, count]) => {
        const d = new Date(Number(ts) * 1000);
        if (!isNaN(d.getTime())) {
          const key = d.toISOString().split('T')[0];
          const val = Number(count) || 0;
          dayMap[key] = (dayMap[key] || 0) + val;
        }
      });
    }

    const totalDays = TOTAL_WEEKS * 7;
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const flatDays = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const count = dayMap[key] || 0;
      flatDays.push({
        date: key,
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayOfWeek: d.getDay(),
        count,
      });
    }

    // Split into columns of 7 days
    const cols = [];
    for (let i = 0; i < flatDays.length; i += 7) {
      cols.push(flatDays.slice(i, i + 7));
    }

    return { weeks: cols };
  }, [calendar]);

  // Intensity color mapper based on real submission counts
  const getCellColor = (count) => {
    if (!count || count <= 0) return 'bg-white/[0.04] border border-white/[0.03]';
    if (count <= 2) return 'bg-emerald-500/35 border border-emerald-500/20';
    if (count <= 5) return 'bg-emerald-500/65 border border-emerald-500/40';
    return 'bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-400/30';
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Header Info - Stable Layout, No Jumping or Flickering */}
      <div className="flex items-start justify-between min-h-[52px] mb-3 px-1">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Activity Heatmap</span>
          </p>
          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 leading-none">
            {activeDaysCount} <span className="text-xs text-slate-400 font-sans font-normal">Active Days</span>
          </p>
        </div>

        <div className="flex flex-col items-end text-right">
          {/* Permanent Realtime Sync Badge - Never unmounts or blinks */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Realtime Sync
          </span>
          {/* Stable inspection readout - fixed height prevents layout shifts */}
          <div className="h-5 flex items-center justify-end mt-1">
            {hoveredDay ? (
              <p className="text-xs font-mono font-medium text-emerald-400 truncate">
                <span className="font-bold">{hoveredDay.count}</span> {hoveredDay.count === 1 ? 'submission' : 'submissions'} · <span className="text-slate-400 font-sans text-[11px]">{hoveredDay.formatted}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Hover cells to inspect activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Heatmap Grid Matrix - Auto-stretches edge-to-edge with no scrollbar */}
      <div
        className="w-full overflow-hidden p-1.5 scrollbar-none select-none"
        onMouseLeave={() => setHoveredDay(null)}
      >
        <div className="w-full flex justify-between gap-1 sm:gap-1.5">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex-1 flex flex-col gap-1 sm:gap-1.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  className={`w-full aspect-square rounded-[3px] sm:rounded-[4px] cursor-pointer relative z-0 hover:z-10 transition-all duration-100 hover:scale-115 hover:ring-1 hover:ring-emerald-400/80 ${getCellColor(
                    day.count
                  )}`}
                  title={`${day.count} submissions on ${day.formatted}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Legend & Summary */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>Past {TOTAL_WEEKS} weeks</span>
        </span>

        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.04] border border-white/[0.05]" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/35" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/65" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Contests + Rating + Heatmap Dual Section ─────────────────────────
const ContestRatingSection = ({ platforms = [], summary = {}, loading = false }) => {
  const platformsWithContests = (platforms || []).filter((p) => (p.contestList?.length || 0) > 0);

  // Default: select platform with most contests, or first available
  const defaultPlatform =
    platformsWithContests.length > 0
      ? [...platformsWithContests].sort((a, b) => b.contestCount - a.contestCount)[0].platform
      : platforms[0]?.platform || 'leetcode';

  const [selected, setSelected] = useState(defaultPlatform);

  if (loading) {
    return (
      <div className="w-full mt-10">
        <div className="h-8 w-48 bg-white/10 rounded-lg mb-4 animate-pulse" />
        <div className="h-[360px] rounded-2xl bg-[#0c0d12]/60 border border-white/10 animate-pulse" />
      </div>
    );
  }

  // Active platform & metadata
  const activePlatform =
    platforms.find((p) => p.platform === selected) ||
    platformsWithContests[0] ||
    platforms[0];

  const activeMeta = PLATFORM_META[activePlatform?.platform] || {
    label: activePlatform?.platform || 'Platform',
    color: '#06b6d4',
    bg: '#06b6d418',
  };




  // Real submission calendar: active platform calendar OR combined calendar from summary
  const activeCalendar = activePlatform?.submissionCalendar || summary?.submissionCalendar || null;
  const activeDays = activePlatform?.activeDays || summary?.totalActiveDays || 0;

  return (
    <div className="w-full mt-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Contest Ratings & Realtime Heatmap</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Realtime contest progression and verified submission frequency across linked platforms.
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(platforms.length > 0 ? platforms : [{ platform: 'leetcode' }]).map((p) => {
            const meta = PLATFORM_META[p.platform] || { label: p.platform, color: '#06b6d4' };
            const isSelected = (activePlatform?.platform || selected) === p.platform;
            const count = p.contestCount || 0;

            return (
              <button
                key={p.platform}
                type="button"
                onClick={() => setSelected(p.platform)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border-white/10'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? meta.color : meta.color }}
                />
                <span>{meta.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Pane Card: Left = Rating Curve | Right = Activity Heatmap */}
      <div className="w-full rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column (7 cols): Rating Chart */}
          <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
            <RatingChart
              key={activePlatform?.platform}
              contestList={activePlatform?.contestList || []}
              color={activeMeta.color}
              label={activeMeta.label}
            />
          </div>

          {/* Right Column (5 cols): Activity Heatmap */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <ActivityHeatmap
              calendar={activeCalendar}
              activeDaysCount={activeDays}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestRatingSection;
