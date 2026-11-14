import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

const PLATFORM_LABELS = {
  leetcode: 'LeetCode',
  codechef: 'CodeChef',
  codestudio: 'CodeStudio',
  hackerrank: 'HackerRank',
  geeksforgeeks: 'GeeksForGeeks',
  codeforces: 'Codeforces',
  atcoder: 'AtCoder',
};

// Engagement score derived from real activity signals:
// submissions (calendar), questions solved, active days, contests
const computeEngagement = (p) => {
  const submissions = Object.values(p.submissionCalendar || {}).reduce(
    (sum, c) => sum + (Number(c) || 0),
    0
  );
  const questions = p.questionsSolved || 0;
  const activeDays = p.activeDays || 0;
  const contests = p.contestCount || 0;

  return {
    submissions,
    questions,
    score: submissions * 1 + questions * 0.4 + activeDays * 3 + contests * 15,
  };
};

const PlatformEngagementChart = ({ platforms = [], loading = false }) => {
  const rows = useMemo(() => {
    const data = platforms.map((p) => {
      const eng = computeEngagement(p);
      return {
        platform: p.platform,
        label: PLATFORM_LABELS[p.platform] || p.platform || 'Platform',
        color: p.platformColor || '#06b6d4',
        submissions: eng.submissions,
        questions: eng.questions,
        score: eng.score,
      };
    });

    const max = Math.max(...data.map((d) => d.score), 1);
    return data
      .map((d) => ({ ...d, pct: Math.round((d.score / max) * 100) }))
      .sort((a, b) => b.score - a.score);
  }, [platforms]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5 animate-pulse">
            <div className="h-3 w-24 rounded bg-white/5" />
            <div className="h-2.5 w-full rounded-full bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm border border-dashed border-white/10 rounded-2xl">
        No platform activity data available.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-4">
        <BarChart3 className="w-4 h-4 text-cyan-400" />
        <p className="text-xs text-slate-400">Where your effort goes — submissions, problems &amp; active days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
        {rows.map((row) => (
          <div key={row.platform}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-xs font-semibold text-white truncate">{row.label}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {row.submissions > 0
                  ? `${row.submissions.toLocaleString()} subs`
                  : `${row.questions} solved`}
              </span>
            </div>

            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max(row.pct, 4)}%`,
                  background: `linear-gradient(90deg, ${row.color}80, ${row.color})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformEngagementChart;
