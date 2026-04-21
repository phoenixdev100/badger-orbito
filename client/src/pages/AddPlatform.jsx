import React, { useState, useContext, useRef, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import { ButtonGroup, ButtonGroupText } from '../components/button-group'
import { Link2, Copy, Check, Trash2, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { Confetti } from '../components/ui/confetti'

// Platforms that Codolio aggregates — mutually exclusive with codolio
const CODOLIO_TRACKED = ['leetcode', 'codechef', 'codestudio']

// ── Visibility Checkbox ────────────────────────────────────────────────────
const VisibilityCheckbox = ({ platform, isVerified, isPublic, onToggle, disabled }) => {
  if (!isVerified) {
    // Not connected — grey disabled checkbox
    return (
      <div className="flex items-center gap-1.5 ml-2" title="Connect this platform first">
        <div className="w-4 h-4 rounded border border-gray-700 bg-gray-900 opacity-40 cursor-not-allowed" />
        <Lock className="w-3 h-3 text-gray-600" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(platform, !isPublic)}
      disabled={disabled}
      title={isPublic ? 'Public — click to make private' : 'Private — click to make public'}
      className="flex items-center gap-1.5 ml-2 group"
    >
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          isPublic
            ? 'bg-green-500 border-green-400'
            : 'bg-transparent border-gray-600 group-hover:border-gray-400'
        }`}
      >
        {isPublic && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {isPublic
        ? <Eye className="w-3 h-3 text-green-400" />
        : <EyeOff className="w-3 h-3 text-gray-500 group-hover:text-gray-400" />}
    </button>
  )
}

// ── Mutual Exclusivity Note (No longer a banner/warning) ──────────────────
const ConflictNote = ({ blockedBy }) => {
  return null // Removed detailed error messages as requested
}

// ── Single Platform Row ────────────────────────────────────────────────────
const PlatformRow = ({
  name, image, urlPrefix, platform, placeholder = 'your-username',
  username, setUsername,
  isConnecting, isVerifying, isDeleting,
  isVerified, isPublic,
  verificationData,
  copiedCode,
  blockedBy,
  onConnect, onVerify, onDelete, onToggleVisibility, onCopy,
}) => {
  const isLocked = !!blockedBy

  return (
    <div className="relative overflow-hidden rounded-xl p-6 shadow-[12px_12px_30px_#111,-12px_-12px_30px_#222] mb-6">
      <div className="absolute inset-[2px] bg-black rounded-[10px] border border-gray-800" />

      <div className="relative z-10">
        <div className="flex items-center gap-4">
          {/* Visibility checkbox + icon */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <VisibilityCheckbox
              platform={platform}
              isVerified={isVerified}
              isPublic={isPublic}
              onToggle={onToggleVisibility}
            />
            <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222] overflow-hidden p-1">
              <img src={image} alt={name} className="w-full h-full object-contain" />
            </div>
            <h2 className="text-lg font-semibold text-white">{name}</h2>
          </div>

          {/* URL + username input + action button */}
          <ButtonGroup className="flex-1">
            <ButtonGroupText className="bg-black border-gray-800 text-gray-300 shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]">
              {urlPrefix}
            </ButtonGroupText>
            <input
              type="text"
              placeholder={placeholder}
              value={username}
              onChange={(e) => !isVerified && !isLocked && setUsername(e.target.value)}
              disabled={isVerified || isLocked}
              className={`flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                isLocked
                  ? 'bg-gray-900 border border-gray-800 cursor-not-allowed opacity-50'
                  : isVerified
                  ? 'bg-green-900/30 border border-green-600/50 cursor-not-allowed'
                  : 'bg-black border border-gray-800 focus:ring-1 focus:ring-gray-600 focus:border-gray-600'
              }`}
            />
            {isVerified ? (
              <button
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 border border-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            ) : (
              <button
                className={`flex items-center gap-1.5 px-3 py-2 border text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLocked
                    ? 'bg-gray-900/50 border-gray-800/50 cursor-not-allowed opacity-50'
                    : 'bg-black border-gray-800 hover:bg-gray-900'
                }`}
                onClick={onConnect}
                disabled={isConnecting || !username.trim() || isLocked}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{isConnecting ? 'Connecting...' : 'Connect'}</span>
              </button>
            )}
          </ButtonGroup>
        </div>

        {/* Removed Conflict banner */}

        {/* Verification UI */}
        {verificationData && (
          <div className="mt-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-400 mb-2">Verification Required</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-gray-300">{verificationData.instructions}</span>
              <div className="flex items-center gap-1">
                <code className="px-2 py-1 bg-gray-800 text-yellow-400 rounded font-mono">
                  {verificationData.verificationCode}
                </code>
                <button
                  onClick={() => onCopy(verificationData.verificationCode)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy code"
                >
                  {copiedCode
                    ? <Check className="w-3 h-3 text-green-400" />
                    : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>
              <button
                onClick={onVerify}
                disabled={isVerifying}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
const AddPlatform = () => {
  const [usernames, setUsernames] = useState({
    credly: '', leetcode: '', codechef: '', codestudio: '', codolio: ''
  })
  const [isConnecting, setIsConnecting] = useState({
    credly: false, leetcode: false, codechef: false, codestudio: false, codolio: false
  })
  const [isVerifying, setIsVerifying] = useState({
    credly: false, leetcode: false, codechef: false, codestudio: false, codolio: false
  })
  const [verificationData, setVerificationData] = useState({
    credly: null, leetcode: null, codechef: null, codestudio: null, codolio: null
  })
  const [copiedCode, setCopiedCode] = useState({
    credly: false, leetcode: false, codechef: false, codestudio: false, codolio: false
  })
  const [verifiedPlatforms, setVerifiedPlatforms] = useState({
    credly: null, leetcode: null, codechef: null, codestudio: null, codolio: null
  })
  const [isPublicMap, setIsPublicMap] = useState({
    credly: true, leetcode: true, codechef: true, codestudio: true, codolio: true
  })
  const [isDeleting, setIsDeleting] = useState({
    credly: false, leetcode: false, codechef: false, codestudio: false, codolio: false
  })
  const [isTogglingVisibility, setIsTogglingVisibility] = useState({})

  const confettiRef = useRef(null)
  const { linkPlatform, verifyPlatform, deletePlatform, getUserPlatforms, updatePlatformVisibility } = useContext(AppContext)

  // ── Load platform data on mount ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const result = await getUserPlatforms()
      if (!result.success) return
      const platforms = result.platforms

      const verified = {}
      const publicMap = {}
      const names = {}
      Object.keys(platforms).forEach((p) => {
        verified[p] = platforms[p].verified && platforms[p].username ? platforms[p].username : null
        publicMap[p] = platforms[p].isPublic ?? true
        names[p] = platforms[p].username || ''
      })
      setVerifiedPlatforms(verified)
      setIsPublicMap(publicMap)
      setUsernames((prev) => ({ ...prev, ...names }))
    }
    load()
  }, [getUserPlatforms])

  // ── Conflict detection ──────────────────────────────────────────────────
  const getConflict = (platform) => {
    if (verifiedPlatforms[platform]) return null // already connected   — no warning
    if (platform === 'codolio') {
      const conflict = CODOLIO_TRACKED.find((p) => verifiedPlatforms[p])
      return conflict || null
    }
    if (CODOLIO_TRACKED.includes(platform)) {
      return verifiedPlatforms.codolio ? 'codolio' : null
    }
    return null
  }

  // ── Confetti ───────────────────────────────────────────────────────────
  const triggerFireworks = useCallback(() => {
    if (!confettiRef.current) return
    const duration = 3000
    const end = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }
    const rnd = (min, max) => Math.random() * (max - min) + min
    const interval = setInterval(() => {
      const timeLeft = end - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)
      const count = 50 * (timeLeft / duration)
      confettiRef.current.fire({ ...defaults, particleCount: count, origin: { x: rnd(0.1, 0.3), y: rnd(0.5, 0.7) } })
      confettiRef.current.fire({ ...defaults, particleCount: count, origin: { x: rnd(0.7, 0.9), y: rnd(0.5, 0.7) } })
      confettiRef.current.fire({ ...defaults, particleCount: count / 2, origin: { x: rnd(0.4, 0.6), y: rnd(0.3, 0.5) } })
    }, 250)
  }, [])

  // ── Clipboard ──────────────────────────────────────────────────────────
  const copyToClipboard = async (text, platform) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode((prev) => ({ ...prev, [platform]: true }))
      setTimeout(() => setCopiedCode((prev) => ({ ...prev, [platform]: false })), 2000)
    } catch {}
  }

  // ── Generic connect handler ─────────────────────────────────────────────
  const handleConnect = async (platform, instructions) => {
    const username = usernames[platform]?.trim()
    if (!username) return
    setIsConnecting((p) => ({ ...p, [platform]: true }))
    const result = await linkPlatform(platform, username)
    setIsConnecting((p) => ({ ...p, [platform]: false }))
    if (result.success) {
      setVerificationData((p) => ({
        ...p,
        [platform]: { username, verificationCode: result.verificationCode, instructions }
      }))
      setUsernames((p) => ({ ...p, [platform]: '' }))
    }
  }

  // ── Generic verify handler ─────────────────────────────────────────────
  const handleVerify = async (platform) => {
    setIsVerifying((p) => ({ ...p, [platform]: true }))
    const result = await verifyPlatform(platform)
    setIsVerifying((p) => ({ ...p, [platform]: false }))
    if (result.success) {
      const username = verificationData[platform].username
      setVerificationData((p) => ({ ...p, [platform]: null }))
      setVerifiedPlatforms((p) => ({ ...p, [platform]: username }))
      setUsernames((p) => ({ ...p, [platform]: username }))
      triggerFireworks()
    }
  }

  // ── Delete handler ─────────────────────────────────────────────────────
  const handleDelete = async (platform) => {
    if (!window.confirm(`Are you sure you want to unlink your ${platform} account?`)) return
    setIsDeleting((p) => ({ ...p, [platform]: true }))
    const result = await deletePlatform(platform)
    setIsDeleting((p) => ({ ...p, [platform]: false }))
    if (result.success) {
      setVerifiedPlatforms((p) => ({ ...p, [platform]: null }))
      setVerificationData((p) => ({ ...p, [platform]: null }))
      setUsernames((p) => ({ ...p, [platform]: '' }))
      setIsPublicMap((p) => ({ ...p, [platform]: true }))
    }
  }

  // ── Visibility toggle handler ──────────────────────────────────────────
  const handleToggleVisibility = async (platform, newVal) => {
    setIsTogglingVisibility((p) => ({ ...p, [platform]: true }))
    const result = await updatePlatformVisibility(platform, newVal)
    setIsTogglingVisibility((p) => ({ ...p, [platform]: false }))
    if (result.success) {
      setIsPublicMap((p) => ({ ...p, [platform]: newVal }))
    }
  }

  // ── Platform configs ───────────────────────────────────────────────────
  const platforms = [
    {
      platform: 'credly',
      name: 'Credly',
      image: assets.credlyImage,
      urlPrefix: 'https://www.credly.com/users/',
      instructions: `Temporarily add the verification code to your Credly profile last name, then click Verify.`,
    },
    {
      platform: 'codolio',
      name: 'Codolio',
      image: assets.codolioImage,
      urlPrefix: 'https://codolio.com/profile/',
      placeholder: 'your-user-key',
      instructions: `Add the verification code to your Codolio profile name field, then click Verify.`,
    },
    {
      platform: 'codechef',
      name: 'CodeChef',
      image: assets.codechefImage,
      urlPrefix: 'https://www.codechef.com/users/',
      instructions: `Add the verification code to your CodeChef profile "Name" field, then click Verify.`,
    },
    {
      platform: 'leetcode',
      name: 'LeetCode',
      image: assets.leetcodeImage,
      urlPrefix: 'https://leetcode.com/u/',
      instructions: `Add the verification code to your LeetCode profile bio or about section, then click Verify.`,
    },
    {
      platform: 'codestudio',
      name: 'CodeStudio',
      image: assets.codestudioImage,
      urlPrefix: 'https://www.codingninjas.com/studio/profile/',
      instructions: `Add the verification code to your CodeStudio profile "Name" field, then click Verify.`,
    },
  ]

  return (
    <>
      <div className="w-full bg-black min-h-screen">
        <Sidebar />
        <div className="ml-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
            <div className="relative overflow-visible text-white">
              <style>{`
                @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.4; } 100% { stroke-dashoffset: 0; opacity: 0.25; } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
                .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
                .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
              `}</style>

              <svg className="pointer-events-none absolute inset-0 h-full w-full z-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <pattern id="gridAddPlatform" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.15)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridAddPlatform)" />
                <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
                <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
                <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
                <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
                <circle cx="20%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3s' }} />
                <circle cx="80%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3.2s' }} />
                <circle cx="20%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.4s' }} />
                <circle cx="80%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.6s' }} />
              </svg>

              <div className="relative z-10">
                {/* Header */}
                <div className="pointer-events-none select-none absolute -top-10 -right-16 sm:-top-12 sm:-right-20 opacity-90">
                  <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                    <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-white/10 blur-[1px]" />
                    <div className="absolute -top-6 -left-4 h-20 w-20 rounded-full bg-white/16" />
                    <div className="absolute inset-4 rounded-[32px] border border-white/20" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Add Platform
                </h1>
                <p className="text-gray-400 text-sm mb-2">
                  Sync, verify, and flex your platforms in one smooth flow
                </p>

                {/* Legend for checkbox */}
                <div className="flex items-center gap-4 mb-8 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded border-2 bg-green-500 border-green-400" />
                    <Eye className="w-3 h-3 text-green-400" />
                    <span>Public — shown on dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded border-2 bg-transparent border-gray-600" />
                    <EyeOff className="w-3 h-3 text-gray-500" />
                    <span>Private — hidden from dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded border border-gray-700 opacity-40" />
                    <Lock className="w-3 h-3 text-gray-600" />
                    <span>Not connected</span>
                  </div>
                </div>

                {/* Codolio exclusivity note */}
                <div className="mb-8 px-5 py-4 rounded-xl bg-gray-900/40 border border-gray-800/60 text-xs text-gray-400">
                  <div className="flex flex-col gap-2">
                    <span className="text-white font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      Important: Codolio Exclusivity
                    </span>
                    <ul className="list-disc list-inside space-y-1 ml-1 text-gray-400">
                      <li>Codolio aggregates LeetCode, CodeChef, and CodeStudio automatically.</li>
                      <li>To maintain data integrity, you can either connect <strong>Codolio</strong> OR connect these platforms <strong>individually</strong>.</li>
                      <li>Credly is categorized separately and can be connected at any time.</li>
                    </ul>
                  </div>
                </div>

                {/* Platform rows */}
                {platforms.map(({ platform, name, image, urlPrefix, placeholder, instructions }) => (
                  <PlatformRow
                    key={platform}
                    platform={platform}
                    name={name}
                    image={image}
                    urlPrefix={urlPrefix}
                    placeholder={placeholder}
                    username={usernames[platform]}
                    setUsername={(val) => setUsernames((p) => ({ ...p, [platform]: val }))}
                    isConnecting={isConnecting[platform]}
                    isVerifying={isVerifying[platform]}
                    isDeleting={isDeleting[platform]}
                    isVerified={!!verifiedPlatforms[platform]}
                    isPublic={isPublicMap[platform] ?? true}
                    verificationData={verificationData[platform]}
                    copiedCode={copiedCode[platform]}
                    blockedBy={getConflict(platform)}
                    onConnect={() => handleConnect(platform, instructions)}
                    onVerify={() => handleVerify(platform)}
                    onDelete={() => handleDelete(platform)}
                    onToggleVisibility={handleToggleVisibility}
                    onCopy={(text) => copyToClipboard(text, platform)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Confetti
        ref={confettiRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        style={{ zIndex: 9999 }}
        manualstart={true}
      />
    </>
  )
}

export default AddPlatform