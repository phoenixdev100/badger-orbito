import React, { useState, useRef, useCallback } from 'react';

// ─── Platform display config ───────────────────────────────────────────────
const PLATFORM_META = {
  leetcode:      { label: 'LeetCode',   color: '#FFA116', bg: '#FFA11618' },
  codechef:      { label: 'CodeChef',   color: '#6B3FA0', bg: '#6B3FA018' },
  codestudio:    { label: 'CodeStudio', color: '#DD4015', bg: '#DD401518' },
  hackerrank:    { label: 'HackerRank', color: '#2EC866', bg: '#2EC86618' },
  codeforces:    { label: 'Codeforces', color: '#1F8ACB', bg: '#1F8ACB18' },
  geeksforgeeks: { label: 'GFG',        color: '#2F8D46', bg: '#2F8D4618' },
  atcoder:       { label: 'AtCoder',    color: '#7B7B7B', bg: '#7B7B7B18' },
};

// ─── SVG smooth area chart ─────────────────────────────────────────────────
const W = 620;
const H = 180;
const PAD = { top: 16, right: 16, bottom: 24, left: 54 };
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

function RatingChart({ contestList, color, label }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null); // { x, y, contest }

  if (!contestList || contestList.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-slate-500 text-sm">
        No contest data available for {label}.
      </div>
    );
  }

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
  const linePath = catmullRomPath(points);
  const areaPath = linePath
    + ` L ${points[points.length - 1].x} ${PAD.top + CHART_H}`
    + ` L ${points[0].x} ${PAD.top + CHART_H} Z`;

  // Y axis ticks
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
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const gradId = `areaGrad-${label}`;

  return (
    <div className="relative select-none">
      {/* Tooltip info bar */}
      <div className="flex items-stretch gap-6 mb-3 px-1">
        <div>
          <p className="text-slate-500 text-xs">Rating</p>
          <p className="text-white text-2xl font-extrabold leading-none mt-0.5" style={{ color }}>
            {tooltip ? tooltip.contest.rating : contestList[contestList.length - 1].rating}
          </p>
        </div>
        {tooltip && (
          <div className="border-l border-slate-800 pl-6">
            <p className="text-slate-400 text-xs">{fmt(tooltip.contest.contestDate)}</p>
            <p className="text-white text-sm font-semibold mt-0.5">{tooltip.contest.contestName}</p>
            <p className="text-slate-500 text-xs mt-0.5">Rank: {tooltip.contest.rank?.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* SVG chart */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y-axis grid + labels */}
        {yTicks.map((tick) => {
          const ty = toY(tick);
          return (
            <g key={tick}>
              <line
                x1={PAD.left} y1={ty} x2={PAD.left + CHART_W} y2={ty}
                stroke="rgba(100,116,139,0.2)" strokeWidth="0.8" strokeDasharray="4 4"
              />
              <text x={PAD.left - 6} y={ty + 4} textAnchor="end"
                fill="rgba(148,163,184,0.7)" fontSize="10">
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

        {/* Data dots */}
        {points.map((pt, i) => (
          <circle
            key={i} cx={pt.x} cy={pt.y} r="3.5"
            fill={color} stroke="#0a0a0a" strokeWidth="1.5"
            opacity={tooltip && tooltip.x === pt.x ? 1 : 0.5}
          />
        ))}

        {/* Hover vertical line */}
        {tooltip && (
          <>
            <line
              x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + CHART_H}
              stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6"
            />
            <circle
              cx={tooltip.x} cy={tooltip.y} r="5"
              fill={color} stroke="#0a0a0a" strokeWidth="2"
            />
          </>
        )}
      </svg>
    </div>
  );
}

// ─── Main Contests + Chart Section ─────────────────────────────────────────
const ContestRatingSection = ({ platforms, loading }) => {
  const platformsWithContests = (platforms || []).filter((p) => (p.contestList?.length || 0) > 0);

  // Default: select platform with most contests
  const defaultPlatform = platformsWithContests.length > 0
    ? [...platformsWithContests].sort((a, b) => b.contestCount - a.contestCount)[0].platform
    : null;

  const [selected, setSelected] = useState(defaultPlatform);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">Contests</h2>
        <div className="h-[300px] rounded-xl bg-slate-900/40 border border-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (platformsWithContests.length === 0) return null;

  const totalContests = platformsWithContests.reduce((s, p) => s + p.contestCount, 0);
  const activePlatform = platformsWithContests.find((p) => p.platform === selected) || platformsWithContests[0];
  const activeMeta = PLATFORM_META[activePlatform?.platform] || { label: activePlatform?.platform, color: '#888', bg: '#88888818' };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-white mb-4">Contests</h2>

      <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
        {/* Top: total + platform tabs */}
        <div className="flex flex-col sm:flex-row gap-0">

          {/* Total contests */}
          <div className="flex flex-col items-center justify-center px-8 py-6 border-b sm:border-b-0 sm:border-r border-slate-800/60 min-w-[140px]">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Contests</p>
            <p className="text-5xl font-extrabold text-white mt-2">{totalContests}</p>
          </div>

          {/* Platform list / tabs */}
          <div className="flex-1 divide-y divide-slate-800/50">
            {[...platformsWithContests]
              .sort((a, b) => b.contestCount - a.contestCount)
              .map((p) => {
                const meta   = PLATFORM_META[p.platform] || { label: p.platform, color: '#888', bg: '#88888818' };
                const isActive = p.platform === (selected || activePlatform?.platform);
                return (
                  <button
                    key={p.platform}
                    onClick={() => setSelected(p.platform)}
                    className="w-full flex items-center justify-between px-6 py-3 transition-all duration-150"
                    style={{
                      background: isActive ? meta.bg : 'transparent',
                      borderLeft: isActive ? `3px solid ${meta.color}` : '3px solid transparent',
                    }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ color: isActive ? meta.color : 'rgb(148,163,184)' }}
                    >
                      {meta.label}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: isActive ? meta.color : 'rgb(100,116,139)' }}
                    >
                      {p.contestCount}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Chart */}
        <div className="border-t border-slate-800/60 px-6 py-5">
          <RatingChart
            key={activePlatform?.platform}
            contestList={activePlatform?.contestList || []}
            color={activeMeta.color}
            label={activeMeta.label}
          />
        </div>
      </div>
    </div>
  );
};

export default ContestRatingSection;
