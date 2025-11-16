import React, { useState, useContext, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { ButtonGroup, ButtonGroupText } from '../components/button-group'
import { Link2, Copy, Check, Trash2 } from 'lucide-react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { Confetti } from '../components/ui/confetti'

const AddPlatform = () => {
  const [credlyUsername, setCredlyUsername] = useState('')
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [codechefUsername, setCodechefUsername] = useState('')
  const [codestudioUsername, setCodestudioUsername] = useState('')
  const [codolioUserKey, setCodolioUserKey] = useState('')
  const [isConnecting, setIsConnecting] = useState({ 
    credly: false, 
    leetcode: false, 
    codechef: false, 
    codestudio: false,
    codolio: false 
  })
  const [isVerifying, setIsVerifying] = useState({ 
    credly: false, 
    leetcode: false, 
    codechef: false, 
    codestudio: false,
    codolio: false 
  })
  const [verificationData, setVerificationData] = useState({ 
    credly: null, 
    leetcode: null, 
    codechef: null, 
    codestudio: null,
    codolio: null 
  })
  const [copiedCode, setCopiedCode] = useState({ 
    credly: false, 
    leetcode: false, 
    codechef: false, 
    codestudio: false,
    codolio: false 
  })
  const [verifiedPlatforms, setVerifiedPlatforms] = useState({ 
    credly: null, 
    leetcode: null, 
    codechef: null, 
    codestudio: null,
    codolio: null 
  })
  const [isDeleting, setIsDeleting] = useState({ 
    credly: false, 
    leetcode: false, 
    codechef: false, 
    codestudio: false,
    codolio: false 
  })
  const confettiRef = useRef(null)
  
  const { linkPlatform, verifyPlatform, deletePlatform, getUserPlatforms } = useContext(AppContext)

  // Fetch user's platform data on component mount
  useEffect(() => {
    const loadPlatformData = async () => {
      const result = await getUserPlatforms()
      if (result.success) {
        const platforms = result.platforms
        
        // Set verified platforms
        const verified = {}
        Object.keys(platforms).forEach(platform => {
          if (platforms[platform].verified && platforms[platform].username) {
            verified[platform] = platforms[platform].username
          } else {
            verified[platform] = null
          }
        })
        setVerifiedPlatforms(verified)
        
        // Set usernames for verified platforms
        if (platforms.credly?.verified && platforms.credly?.username) {
          setCredlyUsername(platforms.credly.username)
        }
        if (platforms.leetcode?.verified && platforms.leetcode?.username) {
          setLeetcodeUsername(platforms.leetcode.username)
        }
        if (platforms.codechef?.verified && platforms.codechef?.username) {
          setCodechefUsername(platforms.codechef.username)
        }
        if (platforms.codestudio?.verified && platforms.codestudio?.username) {
          setCodestudioUsername(platforms.codestudio.username)
        }
        if (platforms.codolio?.verified && platforms.codolio?.username) {
          setCodolioUserKey(platforms.codolio.username)
        }
      }
    }
    
    loadPlatformData()
  }, [getUserPlatforms])

  const copyToClipboard = async (text, platform) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(prev => ({ ...prev, [platform]: true }))
      setTimeout(() => {
        setCopiedCode(prev => ({ ...prev, [platform]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const triggerFireworks = () => {
    if (confettiRef.current) {
      // Fireworks effect with multiple bursts across the entire screen
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 9999,
        disableForReducedMotion: false
      }

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // Fire from multiple points across the screen
        confettiRef.current.fire({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.5, 0.7) }
        })
        confettiRef.current.fire({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.5, 0.7) }
        })
        confettiRef.current.fire({
          ...defaults,
          particleCount: particleCount / 2,
          origin: { x: randomInRange(0.4, 0.6), y: randomInRange(0.3, 0.5) }
        })
      }, 250)
    }
  }

  const handleCredlyConnect = async () => {
    if (!credlyUsername.trim()) {
      return
    }
    
    setIsConnecting(prev => ({ ...prev, credly: true }))
    const result = await linkPlatform('credly', credlyUsername.trim())
    setIsConnecting(prev => ({ ...prev, credly: false }))
    
    if (result.success) {
      setVerificationData(prev => ({ 
        ...prev, 
        credly: {
          username: credlyUsername.trim(),
          verificationCode: result.verificationCode,
          instructions: `Please temporarily add the text given beside to your Credly profile last name, then click 'Verify'.`
        }
      }))
      setCredlyUsername('')
    }
  }

  const handleCredlyVerify = async () => {
    setIsVerifying(prev => ({ ...prev, credly: true }))
    const result = await verifyPlatform('credly')
    setIsVerifying(prev => ({ ...prev, credly: false }))
    
    if (result.success) {
      const username = verificationData.credly.username
      setVerificationData(prev => ({ ...prev, credly: null }))
      setVerifiedPlatforms(prev => ({ ...prev, credly: username }))
      setCredlyUsername(username)
      triggerFireworks()
    }
  }

  const handleLeetcodeConnect = async () => {
    if (!leetcodeUsername.trim()) {
      return
    }
    
    setIsConnecting(prev => ({ ...prev, leetcode: true }))
    const result = await linkPlatform('leetcode', leetcodeUsername.trim())
    setIsConnecting(prev => ({ ...prev, leetcode: false }))
    
    if (result.success) {
      setVerificationData(prev => ({ 
        ...prev, 
        leetcode: {
          username: leetcodeUsername.trim(),
          verificationCode: result.verificationCode,
          instructions: `Please temporarily add the text "${result.verificationCode}" to your LeetCode profile bio or about section, then click 'Verify'.`
        }
      }))
      setLeetcodeUsername('')
    }
  }

  const handleLeetcodeVerify = async () => {
    setIsVerifying(prev => ({ ...prev, leetcode: true }))
    const result = await verifyPlatform('leetcode')
    setIsVerifying(prev => ({ ...prev, leetcode: false }))
    
    if (result.success) {
      const username = verificationData.leetcode.username
      setVerificationData(prev => ({ ...prev, leetcode: null }))
      setVerifiedPlatforms(prev => ({ ...prev, leetcode: username }))
      setLeetcodeUsername(username)
      triggerFireworks()
    }
  }

  const handleCodechefConnect = async () => {
    if (!codechefUsername.trim()) {
      return
    }
    
    setIsConnecting(prev => ({ ...prev, codechef: true }))
    const result = await linkPlatform('codechef', codechefUsername.trim())
    setIsConnecting(prev => ({ ...prev, codechef: false }))
    
    if (result.success) {
      setVerificationData(prev => ({ 
        ...prev, 
        codechef: {
          username: codechefUsername.trim(),
          verificationCode: result.verificationCode,
          instructions: `Please temporarily add the text "${result.verificationCode}" to your CodeChef profile's "Name" field, then click 'Verify'.`
        }
      }))
      setCodechefUsername('')
    }
  }

  const handleCodechefVerify = async () => {
    setIsVerifying(prev => ({ ...prev, codechef: true }))
    const result = await verifyPlatform('codechef')
    setIsVerifying(prev => ({ ...prev, codechef: false }))
    
    if (result.success) {
      const username = verificationData.codechef.username
      setVerificationData(prev => ({ ...prev, codechef: null }))
      setVerifiedPlatforms(prev => ({ ...prev, codechef: username }))
      setCodechefUsername(username)
      triggerFireworks()
    }
  }

  const handleCodestudioConnect = async () => {
    if (!codestudioUsername.trim()) {
      return
    }
    
    setIsConnecting(prev => ({ ...prev, codestudio: true }))
    const result = await linkPlatform('codestudio', codestudioUsername.trim())
    setIsConnecting(prev => ({ ...prev, codestudio: false }))
    
    if (result.success) {
      setVerificationData(prev => ({
        ...prev,
        codestudio: {
          username: codestudioUsername.trim(),
          verificationCode: result.verificationCode,
          instructions: `Please temporarily add the text "${result.verificationCode}" to your CodeStudio profile's "Name" field, then click 'Verify'.`
        }
      }))
      setCodestudioUsername('')
    }
  }

  const handleCodestudioVerify = async () => {
    setIsVerifying(prev => ({ ...prev, codestudio: true }))
    const result = await verifyPlatform('codestudio')
    setIsVerifying(prev => ({ ...prev, codestudio: false }))
    
    if (result.success) {
      const username = verificationData.codestudio.username
      setVerificationData(prev => ({ ...prev, codestudio: null }))
      setVerifiedPlatforms(prev => ({ ...prev, codestudio: username }))
      setCodestudioUsername(username)
      triggerFireworks()
    }
  }

  const handleCodolioConnect = async () => {
    if (!codolioUserKey.trim()) {
      return
    }
    
    setIsConnecting(prev => ({ ...prev, codolio: true }))
    const result = await linkPlatform('codolio', codolioUserKey.trim())
    setIsConnecting(prev => ({ ...prev, codolio: false }))
    
    if (result.success) {
      setVerificationData(prev => ({
        ...prev,
        codolio: {
          username: codolioUserKey.trim(),
          verificationCode: result.verificationCode,
          instructions: `Please add the text "${result.verificationCode}" to your Codolio profile's name field, then click 'Verify'.`
        }
      }))
      setCodolioUserKey('')
    }
  }

  const handleCodolioVerify = async () => {
    setIsVerifying(prev => ({ ...prev, codolio: true }))
    const result = await verifyPlatform('codolio')
    setIsVerifying(prev => ({ ...prev, codolio: false }))
    
    if (result.success) {
      const userKey = verificationData.codolio.username
      setVerificationData(prev => ({ ...prev, codolio: null }))
      setVerifiedPlatforms(prev => ({ ...prev, codolio: userKey }))
      setCodolioUserKey(userKey)
      triggerFireworks()
    }
  }

  const handleDeletePlatform = async (platform) => {
    if (window.confirm(`Are you sure you want to unlink your ${platform} account?`)) {
      setIsDeleting(prev => ({ ...prev, [platform]: true }))
      const result = await deletePlatform(platform)
      setIsDeleting(prev => ({ ...prev, [platform]: false }))
      
      if (result.success) {
        setVerifiedPlatforms(prev => ({ ...prev, [platform]: null }))
        setVerificationData(prev => ({ ...prev, [platform]: null }))
        
        // Clear the username field for the deleted platform
        if (platform === 'credly') {
          setCredlyUsername('')
        } else if (platform === 'leetcode') {
          setLeetcodeUsername('')
        } else if (platform === 'codechef') {
          setCodechefUsername('')
        } else if (platform === 'codestudio') {
          setCodestudioUsername('')
        }
      }
    }
  }

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
              @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
              .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
            `}</style>

            {/* SVG grid background */}
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
              <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.08' }} />
              <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.08' }} />
              <circle cx="20%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3s' }} />
              <circle cx="80%" cy="20%" r="1.5" className="detail-dot" style={{ animationDelay: '3.2s' }} />
              <circle cx="20%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.4s' }} />
              <circle cx="80%" cy="80%" r="1.5" className="detail-dot" style={{ animationDelay: '3.6s' }} />
              <circle cx="50%" cy="50%" r="1.2" className="detail-dot" style={{ animationDelay: '4s' }} />
            </svg>

           

            {/* Main Content */}
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Add Platform
              </h1>
              <p className="text-gray-400 text-sm mb-10">
                Sync, verify, and flex your platforms in one smooth flow
              </p>
              
              <div className="space-y-6">
                {/* Credly Section */}
                <div className="relative overflow-hidden rounded-xl p-6 shadow-[12px_12px_30px_#111,-12px_-12px_30px_#222] mb-6">
                  {/* Glass morphism background */}
                  <div className="absolute inset-[2px] bg-black rounded-[10px] border border-gray-800"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                        <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222] overflow-hidden p-1">
                          <img src={assets.credlyImage} alt="Credly" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Credly</h2>
                      </div>
                      
                      <ButtonGroup className="flex-1">
                        <ButtonGroupText className="bg-black border-gray-800 text-gray-300 shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]">
                          https://www.credly.com/users/
                        </ButtonGroupText>
                        <input
                          type="text"
                          placeholder="your-username"
                          value={credlyUsername}
                          onChange={(e) => !verifiedPlatforms.credly && setCredlyUsername(e.target.value)}
                          disabled={verifiedPlatforms.credly}
                          className={`flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                            verifiedPlatforms.credly 
                              ? 'bg-green-900/30 border border-green-600/50 cursor-not-allowed' 
                              : 'bg-black border border-gray-800 focus:ring-1 focus:ring-gray-600 focus:border-gray-600'
                          }`}
                        />
                        {verifiedPlatforms.credly ? (
                          <button 
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 border border-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                            onClick={() => handleDeletePlatform('credly')}
                            disabled={isDeleting.credly}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">
                              {isDeleting.credly ? 'Deleting...' : 'Delete'}
                            </span>
                          </button>
                        ) : (
                          <button 
                            className="flex items-center gap-1.5 px-3 py-2 bg-black border border-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                            onClick={handleCredlyConnect}
                            disabled={isConnecting.credly || !credlyUsername.trim()}
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">
                              {isConnecting.credly ? 'Connecting...' : 'Connect'}
                            </span>
                          </button>
                        )}
                      </ButtonGroup>
                    </div>
                    
                    {/* Verification Instructions for Credly */}
                    {verificationData.credly && (
                      <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                        <h3 className="text-sm font-semibold text-yellow-400 mb-2">Verification Required</h3>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-300">{verificationData.credly.instructions}</span>
                          <div className="flex items-center gap-1">
                            <code className="px-2 py-1 bg-gray-800 text-yellow-400 rounded font-mono">
                              {verificationData.credly.verificationCode}
                            </code>
                            <button
                              onClick={() => copyToClipboard(verificationData.credly.verificationCode, 'credly')}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy code"
                            >
                              {copiedCode.credly ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <button
                            onClick={handleCredlyVerify}
                            disabled={isVerifying.credly}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
                          >
                            {isVerifying.credly ? 'Verifying...' : 'Verify'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                 {/* Codolio Section */}
              <div className="relative overflow-hidden rounded-xl p-6 shadow-[12px_12px_30px_#111,-12px_-12px_30px_#222] mb-6">
                <div className="absolute inset-[2px] bg-black rounded-[10px] border border-gray-800"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                      <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222] overflow-hidden p-1">
                        <img src={assets.codolioImage} alt="Codolio" className="w-full h-full object-contain" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">Codolio</h2>
                    </div>
                    
                    <ButtonGroup className="flex-1">
                      <ButtonGroupText className="bg-black border-gray-800 text-gray-300 shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]">
                        https://codolio.com/profile/
                      </ButtonGroupText>
                      <input
                        type="text"
                        placeholder="your-user-key"
                        value={codolioUserKey}
                        onChange={(e) => !verifiedPlatforms.codolio && setCodolioUserKey(e.target.value)}
                        disabled={verifiedPlatforms.codolio}
                        className={`flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                          verifiedPlatforms.codolio 
                            ? 'bg-green-900/30 border border-green-600/50 cursor-not-allowed' 
                            : 'bg-black border border-gray-800 focus:ring-1 focus:ring-gray-600 focus:border-gray-600'
                        }`}
                      />
                      {verifiedPlatforms.codolio ? (
                        <button 
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 border border-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                          onClick={() => handleDeletePlatform('codolio')}
                          disabled={isDeleting.codolio}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {isDeleting.codolio ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      ) : (
                        <button 
                          className="flex items-center gap-1.5 px-3 py-2 bg-black border border-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                          onClick={handleCodolioConnect}
                          disabled={isConnecting.codolio || !codolioUserKey.trim()}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {isConnecting.codolio ? 'Connecting...' : 'Connect'}
                          </span>
                        </button>
                      )}
                    </ButtonGroup>
                  </div>
                  
                  {/* Verification Instructions for Codolio */}
                  {verificationData.codolio && (
                    <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                      <h3 className="text-sm font-semibold text-yellow-400 mb-2">Verification Required</h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-300">{verificationData.codolio.instructions}</span>
                        <div className="flex items-center gap-1">
                          <code className="px-2 py-1 bg-gray-800 text-yellow-400 rounded font-mono">
                            {verificationData.codolio.verificationCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(verificationData.codolio.verificationCode, 'codolio')}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy code"
                          >
                            {copiedCode.codolio ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={handleCodolioVerify}
                          disabled={isVerifying.codolio}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
                        >
                          {isVerifying.codolio ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {/* CodeChef Section */}
              <div className="relative overflow-hidden rounded-xl p-6 shadow-[12px_12px_30px_#111,-12px_-12px_30px_#222] mb-6">
                {/* Glass morphism background */}
                <div className="absolute inset-[2px] bg-black rounded-[10px] border border-gray-800"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                      <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222] overflow-hidden p-1">
                        <img src={assets.codechefImage} alt="CodeChef" className="w-full h-full object-contain" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">CodeChef</h2>
                    </div>
                    
                    <ButtonGroup className="flex-1">
                      <ButtonGroupText className="bg-black border-gray-800 text-gray-300 shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]">
                        https://www.codechef.com/users/
                      </ButtonGroupText>
                      <input
                        type="text"
                        placeholder="your-username"
                        value={codechefUsername}
                        onChange={(e) => !verifiedPlatforms.codechef && setCodechefUsername(e.target.value)}
                        disabled={verifiedPlatforms.codechef}
                        className={`flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                          verifiedPlatforms.codechef 
                            ? 'bg-green-900/30 border border-green-600/50 cursor-not-allowed' 
                            : 'bg-black border border-gray-800 focus:ring-1 focus:ring-gray-600 focus:border-gray-600'
                        }`}
                      />
                      {verifiedPlatforms.codechef ? (
                        <button 
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 border border-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                          onClick={() => handleDeletePlatform('codechef')}
                          disabled={isDeleting.codechef}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {isDeleting.codechef ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      ) : (
                        <button 
                          className="flex items-center gap-1.5 px-3 py-2 bg-black border border-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                          onClick={handleCodechefConnect}
                          disabled={isConnecting.codechef || !codechefUsername.trim()}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {isConnecting.codechef ? 'Connecting...' : 'Connect'}
                          </span>
                        </button>
                      )}
                    </ButtonGroup>
                  </div>
                  
                  {/* Verification Instructions for CodeChef */}
                  {verificationData.codechef && (
                    <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                      <h3 className="text-sm font-semibold text-yellow-400 mb-2">Verification Required</h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-300">{verificationData.codechef.instructions}</span>
                        <div className="flex items-center gap-1">
                          <code className="px-2 py-1 bg-gray-800 text-yellow-400 rounded font-mono">
                            {verificationData.codechef.verificationCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(verificationData.codechef.verificationCode, 'codechef')}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy code"
                          >
                            {copiedCode.codechef ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={handleCodechefVerify}
                          disabled={isVerifying.codechef}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
                        >
                          {isVerifying.codechef ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                {/* LeetCode Section */}
                <div className="relative overflow-hidden rounded-xl p-6 shadow-[12px_12px_30px_#111,-12px_-12px_30px_#222] mb-6">
                  {/* Glass morphism background */}
                  <div className="absolute inset-[2px] bg-black rounded-[10px] border border-gray-800"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                        <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222] overflow-hidden p-1">
                          <img src={assets.leetcodeImage} alt="LeetCode" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">LeetCode</h2>
                      </div>
                      
                      <ButtonGroup className="flex-1">
                        <ButtonGroupText className="bg-black border-gray-800 text-gray-300 shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]">
                          https://leetcode.com/u/
                        </ButtonGroupText>
                        <input
                          type="text"
                          placeholder="your-username"
                          value={leetcodeUsername}
                          onChange={(e) => !verifiedPlatforms.leetcode && setLeetcodeUsername(e.target.value)}
                          disabled={verifiedPlatforms.leetcode}
                          className={`flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                            verifiedPlatforms.leetcode 
                              ? 'bg-green-900/30 border border-green-600/50 cursor-not-allowed' 
                              : 'bg-black border border-gray-800 focus:ring-1 focus:ring-gray-600 focus:border-gray-600'
                          }`}
                        />
                        {verifiedPlatforms.leetcode ? (
                          <button 
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 border border-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                            onClick={() => handleDeletePlatform('leetcode')}
                            disabled={isDeleting.leetcode}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">
                              {isDeleting.leetcode ? 'Deleting...' : 'Delete'}
                            </span>
                          </button>
                        ) : (
                          <button 
                            className="flex items-center gap-1.5 px-3 py-2 bg-black border border-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                            onClick={handleLeetcodeConnect}
                            disabled={isConnecting.leetcode || !leetcodeUsername.trim()}
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">
                              {isConnecting.leetcode ? 'Connecting...' : 'Connect'}
                            </span>
                          </button>
                        )}
                      </ButtonGroup>
                    </div>
                    
                    {/* Verification Instructions for LeetCode */}
                    {verificationData.leetcode && (
                      <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                        <h3 className="text-sm font-semibold text-yellow-400 mb-2">Verification Required</h3>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-300">{verificationData.leetcode.instructions}</span>
                          <div className="flex items-center gap-1">
                            <code className="px-2 py-1 bg-gray-800 text-yellow-400 rounded font-mono">
                              {verificationData.leetcode.verificationCode}
                            </code>
                            <button
                              onClick={() => copyToClipboard(verificationData.leetcode.verificationCode, 'leetcode')}
                              className="p-1 hover:bg-gray-700 rounded transition-colors"
                              title="Copy code"
                            >
                              {copiedCode.leetcode ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <button
                            onClick={handleLeetcodeVerify}
                            disabled={isVerifying.leetcode}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
                          >
                            {isVerifying.leetcode ? 'Verifying...' : 'Verify'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                </div>

              

              {/* CodeStudio Section */}
              <div className="relative overflow-hidden rounded-xl p-6 shadow-[12px_12px_30px_#111,-12px_-12px_30px_#222] mb-6">
                {/* Glass morphism background */}
                <div className="absolute inset-[2px] bg-black rounded-[10px] border border-gray-800"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                      <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222] overflow-hidden p-1">
                        <img src={assets.codestudioImage} alt="CodeStudio" className="w-full h-full object-contain" />
                      </div>
                      <h2 className="text-lg font-semibold text-white">CodeStudio</h2>
                    </div>
                    
                    <ButtonGroup className="flex-1">
                      <ButtonGroupText className="bg-black border-gray-800 text-gray-300 shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]">
                        https://www.codingninjas.com/studio/profile/
                      </ButtonGroupText>
                      <input
                        type="text"
                        placeholder="your-username"
                        value={codestudioUsername}
                        onChange={(e) => !verifiedPlatforms.codestudio && setCodestudioUsername(e.target.value)}
                        disabled={verifiedPlatforms.codestudio}
                        className={`flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                          verifiedPlatforms.codestudio 
                            ? 'bg-green-900/30 border border-green-600/50 cursor-not-allowed' 
                            : 'bg-black border border-gray-800 focus:ring-1 focus:ring-gray-600 focus:border-gray-600'
                        }`}
                      />
                      {verifiedPlatforms.codestudio ? (
                        <button 
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 border border-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                          onClick={() => handleDeletePlatform('codestudio')}
                          disabled={isDeleting.codestudio}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {isDeleting.codestudio ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      ) : (
                        <button 
                          className="flex items-center gap-1.5 px-3 py-2 bg-black border border-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[2px_2px_8px_#111,-2px_-2px_8px_#222] hover:shadow-[4px_4px_12px_#111,-4px_-4px_12px_#222]"
                          onClick={handleCodestudioConnect}
                          disabled={isConnecting.codestudio || !codestudioUsername.trim()}
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {isConnecting.codestudio ? 'Connecting...' : 'Connect'}
                          </span>
                        </button>
                      )}
                    </ButtonGroup>
                  </div>
                  
                  {/* Verification Instructions for CodeStudio */}
                  {verificationData.codestudio && (
                    <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                      <h3 className="text-sm font-semibold text-yellow-400 mb-2">Verification Required</h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-300">{verificationData.codestudio.instructions}</span>
                        <div className="flex items-center gap-1">
                          <code className="px-2 py-1 bg-gray-800 text-yellow-400 rounded font-mono">
                            {verificationData.codestudio.verificationCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(verificationData.codestudio.verificationCode, 'codestudio')}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy code"
                          >
                            {copiedCode.codestudio ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={handleCodestudioVerify}
                          disabled={isVerifying.codestudio}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
                        >
                          {isVerifying.codestudio ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

             
            </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confetti for celebration */}
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