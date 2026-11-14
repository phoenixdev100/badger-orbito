import React, { useMemo, useState } from 'react';
import { Trophy, Award, Flame, CalendarClock, Medal } from 'lucide-react';

const PLATFORM_LABELS = {
  leetcode: 'LeetCode',
  codechef: 'CodeChef',
  codestudio: 'CodeStudio',
  hackerrank: 'HackerRank',
  geeksforgeeks: 'GeeksForGeeks',
  codeforces: 'CodeForces',
  atcoder: 'AtCoder',
  credly: 'Credly',
};

const PERIODS = [
  { id: 7, label: '7D' },
  { id: 30, label: '30D' },
  { id: 90, label: '90D' },
];

// Normalise unix seconds/ms or date strings into a Date
const toDate = (value) => {
  if (!value) return null;
  if (typeof value === 'number') {
    const ms = value > 1e12 ? value : value * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const dayKey = (d) => d.toISOString().slice(0, 10);

const RecentActivityTimeline = ({ platforms = [], credlyBadges = [], loading = false }) => {
  const [period, setPeriod] = useState(30);

  const events = useMemo(() => {
    const list = [];

    platforms.forEach((p) => {
      const label = PLATFORM_LABELS[p.platform] || p.platform || 'Platform';
      const color = p.platformColor || '#06b6d4';

      // Badge unlocks
      (p.badges || []).forEach((b) => {
        const d = toDate(b.creationDate);
        if (!d) return;
        list.push({
          id: b.id || `badge-${label}-${b.title}`,
          date: d,
          type: 'badge',
          title: b.title || b.name || 'Badge Unlocked',
          subtitle: `${label} · ${b.level || 'Achievement'}`,
          color,
        });
      });

      // Contest participations
      (p.contestList || []).forEach((c, i) => {
        const d = toDate(c.contestDate);
        if (!d) return;
        list.push({
          id: `contest-${p.platform}-${i}-${c.contestName}`,
          date: d,
          type: 'contest',
          title: c.contestName || 'Contest',
          subtitle: `${label} · Rating ${c.rating ?? '-'} · Rank #${c.rank?.toLocaleString() || '-'}`,
          color,
        });
      });

      // Daily submission activity (aggregated per day)
      const dayMap = {};
      Object.entries(p.submissionCalendar || {}).forEach(([ts, count]) => {
        const d = toDate(Number(ts));
        if (!d) return;
        const key = dayKey(d);
        dayMap[key] = (dayMap[key] || 0) + (Number(count) || 0);
      });
      Object.entries(dayMap).forEach(([key, count]) => {
        if (count <= 0) return;
        list.push({
          id: `activity-${p.platform}-${key}`,
          date: new Date(`${key}T12:00:00`),
          type: 'activity',
          title: `${count} submission${count === 1 ? '' : 's'}`,
          subtitle: `${label} · Active day`,
          color,
        });
      });
    });

    // Credly badge issuances
    credlyBadges.forEach((b) => {
      const d = toDate(b.issued_on);
      if (!d) return;
      list.push({
        id: b.id || `credly-${b.name}`,
        date: d,
        type: 'credly',
        title: b.name || 'Credly Badge',
        subtitle: `Credly${b.issuer ? ` · ${b.issuer}` : ''}`,
        color: '#FF6B00',
      });
    });

    return list.sort((a, b) => b.date - a.date);
  }, [platforms, credlyBadges]);

  const filtered = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - period);
    cutoff.setHours(0, 0, 0, 0);
    return events.filter((e) => e.date >= cutoff).slice(0, 15);
  }, [events, period]);

  const typeIcon = (type) => {
    switch (type) {
      case 'contest': return <Trophy className="w-3.5 h-3.5" />;
      case 'activity': return <Flame className="w-3.5 h-3.5" />;
      case 'credly': return <Medal className="w-3.5 h-3.5" />;
      default: return <Award className="w-3.5 h-3.5" />;
    }
  };

  const fmtDate = (d) =>
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <div>
      {/* Period selector */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <CalendarClock className="w-3.5 h-3.5 text-cyan-400" />
          Latest milestones &amp; activity
        </p>
        <div className="flex items-center gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                period === p.id
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3.5 w-1/2 rounded bg-white/5" />
                <div className="h-3 w-1/3 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm border border-dashed border-white/10 rounded-2xl">
          No activity found in the last {period} days.
        </div>
      ) : (
        <div className="relative min-h-[250px]">
          {/* Vertical line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/10" />

          <div className="space-y-3">
            {filtered.map((event) => (
              <div key={event.id} className="relative flex gap-4 items-start">
                {/* Icon node */}
                <div
                  className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${event.color}18`,
                    borderColor: `${event.color}40`,
                    color: event.color,
                  }}
                >
                  {typeIcon(event.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {fmtDate(event.date)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{event.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTimeline;
