import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import GradientBlobCard from '../components/gradient-bold-card';
import Sidebar from '../components/Sidebar';
import FeaturedAchievements from '../components/FeaturedAchievements';

import { XCard } from '../components/ui/x-gradient-card';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [platformData, setPlatformData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/platforms/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setPlatformData(response.data.data || {});
        } else {
          setPlatformData({});
        }
      } catch (err) {
        console.error('Failed to fetch platform data:', err);
        setError('Failed to load badges and certificates');
        setPlatformData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl, token]);

  const credlyBadges = platformData?.credly?.badges || [];
  const codolioPlatforms = platformData?.codolio?.platforms || [];
  const codolioCertificates = codolioPlatforms.flatMap((p) => p.certificates || []);
  const codolioBadges = codolioPlatforms.flatMap((p) => p.badges || []);

  const allBadges = [
    ...credlyBadges.map((b) => ({
      id: b.id,
      image: b.image,
      title: b.name,
      source: 'Credly',
    })),
    ...codolioBadges.map((b) => ({
      id: b.id || `${b.title || 'codolio-badge'}-${b.issuedOn || ''}`,
      image: b.imageUrl || b.iconUrl,
      title: b.title,
      source: 'Codolio',
    })),
  ].filter((b) => b.image);

  const visibleBadges = allBadges.slice(0, 8);

  const importantCredly = credlyBadges.slice(0, 4);
  const importantCodolio = codolioBadges.slice(0, 4);
  const featuredBadgeImages = [
    ...importantCredly.map((b) => b.image).filter(Boolean),
    ...importantCodolio.map((b) => b.image).filter(Boolean),
  ].slice(0, 4);

  return (
    <div className="w-full bg-black min-h-screen">
      <Sidebar />
      <div className="ml-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
          <div className="relative overflow-visible text-white">
            <style>{`
              @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.5; } 100% { stroke-dashoffset: 0; opacity: 0.3; } }
              @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
              .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
              .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
              @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
              .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
            `}</style>

            {/* SVG grid background */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <pattern id="gridDashboard" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.3)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridDashboard)" />
              <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
              <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
              <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
              <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
              <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
              <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
              <circle cx="20%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3s' }} />
              <circle cx="80%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3.2s' }} />
              <circle cx="20%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.4s' }} />
              <circle cx="80%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.6s' }} />
              <circle cx="50%" cy="50%" r="1.2" className="detail-dot" style={{ animationDelay: '4s' }} />
            </svg>

            {/* Corner elements */}
            <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6" style={{ animationDelay: '4s' }}>
              <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
            </div>
            <div className="corner-element-animate top-15 left-[22%]" style={{ animationDelay: '4.2s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
            </div>
            <div className="corner-element-animate bottom-1 left-12" style={{ animationDelay: '4.4s' }}>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
            </div>

            {/* Dashboard Content */}
            <div className="relative z-10 space-y-8">
              <GradientBlobCard />
              <div className="mt-12">
                <FeaturedAchievements featuredBadgeImages={featuredBadgeImages} />
              </div>

              {/* Awards / Badges Section */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Awards</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {loading
                        ? 'Loading your badges...'
                        : allBadges.length > 0
                        ? `${allBadges.length} badges`
                        : 'Connect and verify platforms to start earning badges.'}
                    </p>
                  </div>
                  {allBadges.length > 8 && (
                    <button
                      type="button"
                      className="text-xs text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
                    >
                      show more
                    </button>
                  )}
                </div>

                {!loading && !error && allBadges.length === 0 && (
                  <div className="text-slate-500 text-sm">
                    No badges to display yet.
                  </div>
                )}

                {loading && (
                  <div className="text-slate-400 text-sm mb-2">Loading badges...</div>
                )}

                <div className="flex flex-wrap gap-4">
                  {visibleBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center justify-center rounded-xl bg-slate-900/40 border border-slate-800/60 px-4 py-4 shadow-[0_0_40px_rgba(15,23,42,0.7)] min-w-[88px] max-w-[120px]"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/80 flex items-center justify-center overflow-hidden mb-2">
                        <img
                          src={badge.image}
                          alt={badge.title || 'Badge'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-center text-slate-200 line-clamp-2">
                        {badge.title || 'Badge'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates Section */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Certificates</h2>
                </div>
                {loading && (
                  <div className="text-slate-400 text-sm">Loading badges and certificates...</div>
                )}
                {!loading && error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}
                {!loading && !error && credlyBadges.length === 0 && codolioCertificates.length === 0 && (
                  <div className="text-slate-400 text-sm">No verified badges or certificates found. Connect and verify your Credly or Codolio accounts from the platforms page.</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {credlyBadges.map((badge) => (
                    <XCard
                      key={badge.id}
                      authorName={badge.name || 'Credly Badge'}
                      authorHandle={badge.issuer ? `@${badge.issuer}` : '@credly'}
                      authorImage={badge.image}
                      content={[
                        badge.description || 'Achievement issued via Credly.',
                        badge.skills && badge.skills.length
                          ? `Skills: ${badge.skills.join(', ')}`
                          : '',
                      ].filter(Boolean)}
                      timestamp={badge.issued_on ? `Issued: ${new Date(badge.issued_on).toLocaleDateString()}` : ''}
                      isVerified={true}
                    />
                  ))}

                  {codolioCertificates.map((cert, index) => (
                    <XCard
                      key={cert.id || `${cert.title || 'codolio-cert'}-${index}`}
                      authorName={cert.title || 'Codolio Certificate'}
                      authorHandle={cert.platform ? `@${cert.platform}` : '@codolio'}
                      authorImage={cert.imageUrl || 'https://codolio.com/favicon.ico'}
                      content={[
                        cert.description || 'Certificate tracked via Codolio.',
                        cert.issuerName ? `Issuer: ${cert.issuerName}` : '',
                      ].filter(Boolean)}
                      timestamp={cert.issuedOn ? `Issued: ${new Date(cert.issuedOn).toLocaleDateString()}` : ''}
                      isVerified={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;