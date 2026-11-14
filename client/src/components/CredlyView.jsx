import React, { useMemo, useState } from 'react';
import { Award, BadgeCheck, Building2, Calendar, Search, ExternalLink, Layers, Tag, X } from 'lucide-react';

const CredlyView = ({ credly, username, loading }) => {
  const [search, setSearch] = useState('');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = useMemo(() => credly?.badges || [], [credly]);

  const issuers = useMemo(() => {
    const map = {};
    badges.forEach((b) => { if (b.issuer) map[b.issuer] = (map[b.issuer] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [badges]);

  const allSkills = useMemo(() => {
    const map = {};
    badges.forEach((b) => (b.skills || []).forEach((s) => { map[s] = (map[s] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [badges]);

  const categories = useMemo(() => {
    const map = {};
    badges.forEach((b) => { const c = b.type_category || 'Other'; map[c] = (map[c] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [badges]);

  const filtered = useMemo(() => badges.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (b.name || '').toLowerCase().includes(q) || (b.issuer || '').toLowerCase().includes(q);
    const matchIssuer = issuerFilter === 'all' || b.issuer === issuerFilter;
    return matchSearch && matchIssuer;
  }), [badges, search, issuerFilter]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => new Date(b.issued_on || 0) - new Date(a.issued_on || 0)), [filtered]);

  if (loading) {
    return <div className="w-full space-y-4"><div className="h-28 rounded-2xl bg-white/5 animate-pulse" /><div className="h-64 rounded-2xl bg-white/5 animate-pulse" /></div>;
  }

  if (!credly || badges.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-10 text-center">
        <p className="text-slate-400 text-sm">No Credly badges found. Make sure your Credly profile is public.</p>
      </div>
    );
  }

  const profileUrl = `https://www.credly.com/users/${encodeURIComponent(username || credly.username || '')}`;

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="rounded-2xl bg-[#0c0d12]/95 border border-orange-500/20 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
            <BadgeCheck className="w-7 h-7 text-orange-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">Credly Badges</h2>
              <span className="text-xs font-mono text-slate-500">@{username || credly.username}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{badges.length} verified badges & credentials</p>
          </div>
          <a href={profileUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold hover:bg-orange-500/25 transition-all shrink-0">
            <ExternalLink className="w-3.5 h-3.5" /> Credly Profile
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Badges', value: badges.length, icon: Award, color: 'text-orange-400' },
          { label: 'Issuers', value: issuers.length, icon: Building2, color: 'text-sky-400' },
          { label: 'Skills', value: allSkills.length, icon: Tag, color: 'text-emerald-400' },
          { label: 'Categories', value: categories.length, icon: Layers, color: 'text-violet-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-[#0c0d12]/90 border border-white/10 p-4 flex items-center gap-3">
            <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
            <div>
              <p className="text-lg font-black text-white font-mono leading-none">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search badges or issuers..."
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/40"
          />
        </div>
        <select
          value={issuerFilter}
          onChange={(e) => setIssuerFilter(e.target.value)}
          className="px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500/40"
        >
          <option value="all">All Issuers</option>
          {issuers.map(([name]) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Badge grid */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white mb-3">Badges ({sorted.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sorted.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBadge(b)}
                className="flex flex-col items-center gap-2 rounded-xl bg-black/40 border border-white/10 p-4 text-center hover:border-orange-500/30 transition-all cursor-pointer group"
              >
                {b.image ? (
                  <img src={b.image} alt={b.name} className="w-14 h-14 object-contain" />
                ) : (
                  <Award className="w-12 h-12 text-slate-500" />
                )}
                <p className="text-[11px] font-semibold text-white leading-tight line-clamp-2">{b.name}</p>
                {b.issuer && <p className="text-[9px] text-slate-500 truncate w-full">{b.issuer}</p>}
                {b.issued_on && (
                  <p className="text-[9px] text-slate-600 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{new Date(b.issued_on).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
          {sorted.length === 0 && <p className="text-xs text-slate-500 py-6 text-center">No badges match your filters</p>}
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-[#0c0d12] border border-orange-500/30 p-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex flex-col sm:flex-row gap-5">
                {selectedBadge.image ? (
                  <img src={selectedBadge.image} alt={selectedBadge.name} className="w-24 h-24 object-contain rounded-xl bg-black/40 border border-white/10" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                    <Award className="w-10 h-10 text-orange-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-white">{selectedBadge.name}</h3>
                  {selectedBadge.issuer && <p className="text-xs text-slate-400 mt-1">{selectedBadge.issuer}</p>}
                  {selectedBadge.issued_on && (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> Issued {new Date(selectedBadge.issued_on).toLocaleDateString()}</p>
                  )}
                  {selectedBadge.image && (
                    <a href={selectedBadge.image} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold hover:bg-orange-500/25 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> View Original
                    </a>
                  )}
                </div>
              </div>
              {selectedBadge.description && (
                <p className="text-xs text-slate-300 mt-4 border-t border-white/10 pt-4">{selectedBadge.description}</p>
              )}
              {selectedBadge.skills?.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBadge.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-300">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Side: categories + skills */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-300 flex-1 truncate">{cat}</span>
                  <span className="text-[10px] font-mono text-orange-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-[#0c0d12]/95 border border-white/10 p-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white mb-3">Top Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map(([skill]) => (
                <span key={skill} className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-300">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredlyView;
