import { LogOut, Settings } from "lucide-react"
import { useMemo, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import assets from "../assets/assets.js"
import getDeveloperAvatar from "../utils/avatarHelper.js"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

type ProfileCardProps = {
  name: string
  role: string
  status: "online" | "offline" | "away"
  avatar: string
  followers?: number
  onClose?: () => void
}

export default function AnimatedProfileCard({ onClose }: { onClose?: () => void }) {
  const { user, platformData } = useContext(AppContext)

  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user")
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  const current = user || storedUser
  const resolvedAvatar = getDeveloperAvatar(current, platformData)

  const profile: ProfileCardProps = {
    name: current?.name || "Developer",
    role: current?.email || "orbito developer",
    status: "online",
    avatar: resolvedAvatar,
    followers: undefined,
    onClose,
  }

  return <ProfileCard {...profile} />
}

function ProfileCard({ name, role, status, avatar, followers, onClose }: ProfileCardProps) {
  const navigate = useNavigate()
  const { logout, user } = useContext(AppContext)

  const handleLogout = () => {
    onClose?.()
    logout()
  }

  // Handle click outside to close the card reliably
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const card = document.getElementById("profile-card")
      const trigger = document.getElementById("profile-trigger-btn")
      if (card && !card.contains(event.target as Node) && !trigger?.contains(event.target as Node)) {
        onClose?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      id="profile-card"
      className="group relative overflow-hidden rounded-3xl bg-black border border-gray-800 p-6 w-80 shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-[0_16px_60px_rgba(0,0,0,0.9)] select-none text-white animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Status indicator with pulse animation */}
      <div className="absolute right-4 top-4 z-10">
        <div className="relative">
          <div
            className={cn(
              "h-3 w-3 rounded-full border-2 border-white/60 transition-all duration-300 group-hover:scale-125",
              status === "online"
                ? "bg-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                : status === "away"
                  ? "bg-amber-400"
                  : "bg-gray-500",
            )}
          ></div>
          {status === "online" && (
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-30"></div>
          )}
        </div>
      </div>

      {/* Profile Photo with enhanced hover effects */}
      <div className="mb-4 flex justify-center relative z-10">
        <div className="relative group-hover:animate-pulse">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-black p-1 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(148,27,255,0.3)] transition-all duration-500 group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.8),inset_-8px_-8px_16px_rgba(148,27,255,0.5)] group-hover:scale-110">
            <img
              src={avatar}
              alt={name}
              className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Glowing ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 dark:border-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
        </div>
      </div>

      {/* Profile Info with slide-up animation */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-cyan-400">
          {name}
        </h3>
        <p className="font-mono text-xs text-cyan-400 mt-0.5">
          @{user?.username || user?.email?.split('@')[0] || 'developer'}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {role}
        </p>

        {followers && (
          <p className="mt-2 text-xs text-gray-500 transition-all duration-300 group-hover:text-cyan-400 group-hover:font-medium">
            {followers.toLocaleString()} followers
          </p>
        )}
      </div>

      {/* Action Buttons: Settings and Logout */}
      <div className="mt-8 flex gap-3 relative z-10">
        <button
          type="button"
          onClick={() => {
            onClose?.()
            navigate("/settings")
          }}
          className="flex-1 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 border border-gray-600/80 py-3 text-sm font-medium text-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-200 hover:from-gray-800 hover:to-gray-600 hover:border-gray-400 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-red-500 border border-red-500/80 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-200 hover:from-red-500 hover:to-red-400 hover:border-red-300 flex items-center justify-center gap-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-blue-500/40 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
}
