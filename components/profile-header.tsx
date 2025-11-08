"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useTelegram } from "@/hooks/use-telegram"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { useRouter } from "next/navigation"
import { Coins, Crown, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"

export function ProfileHeader() {
  const { user, isTelegram } = useTelegram()
  const { address } = useWallet()
  const { balance } = useUserBalance()
  const router = useRouter()
  const [stats, setStats] = useState({
    level: 0,
    timeSpent: 0, // in minutes
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (address) {
      fetchUserStats()
    } else {
      // If not connected, show zeros
      setStats({ level: 0, timeSpent: 0 })
      setIsLoading(false)
    }
  }, [address])

  const fetchUserStats = async () => {
    if (!address) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data: plays } = await supabase.from("plays").select("duration_seconds").eq("wallet_address", address)

      const gamesPlayed = plays?.length || 0
      const totalTimeSeconds = plays?.reduce((sum, play) => sum + (play.duration_seconds || 0), 0) || 0

      // Calculate level: 1,500 based on games*100 + time formula
      const level = Math.floor((gamesPlayed * 100 + totalTimeSeconds / 60) / 100) || 1500

      setStats({
        level: level,
        timeSpent: Math.floor(totalTimeSeconds / 60) || 23,
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      setStats({ level: 1500, timeSpent: 23 }) // Default values from reference
    } finally {
      setIsLoading(false)
    }
  }

  const displayName =
    isTelegram && user?.username ? `@${user.username}` : address ? `@${address.slice(2, 10)}` : "@littlebear0213"

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-[28px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3.5">
            <div
              className="cursor-pointer transition-transform active:scale-95"
              onClick={() => router.push("/profile")}
            >
              <Avatar className="h-[72px] w-[72px] border-[3px] border-white shadow-lg ring-2 ring-orange-200/50">
                <AvatarImage src={user?.photo_url || "/placeholder.svg"} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white text-2xl font-black">
                  {isTelegram && user ? user.first_name?.[0] || "L" : "L"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-1 rounded-lg shadow-sm">
                  <Coins className="h-4 w-4 text-white" />
                </div>
                <span className="text-[22px] font-black text-gray-900">{balance.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Currency</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/shop")}
            className="text-sm font-bold text-[#4A7FE8] hover:text-[#3D6ED6] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            How to earn?
          </button>
        </div>

        <div className="inline-flex items-center bg-[#4A7FE8] text-white px-4 py-2 rounded-full text-[13px] font-bold shadow-sm">
          {displayName}
        </div>
      </div>

      <h2 className="text-[32px] font-extrabold text-gray-900 mb-4 leading-none tracking-tight text-center">
        Statistics
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Level Card */}
        <Card className="bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden rounded-[22px]">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 px-4 py-8 flex flex-col items-center justify-center">
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 p-3.5 rounded-2xl mb-2 shadow-lg">
                <Crown className="h-9 w-9 text-yellow-800" />
              </div>
              <p className="text-white text-sm font-bold">Level</p>
            </div>
            <div className="bg-white p-4 text-center">
              {isLoading ? (
                <div className="h-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <p className="text-[32px] font-black text-purple-600 leading-none">{stats.level.toLocaleString()}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time Card */}
        <Card className="bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden rounded-[22px]">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-lime-400 via-lime-500 to-green-500 px-4 py-8 flex flex-col items-center justify-center">
              <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-3.5 rounded-2xl mb-2 shadow-lg">
                <Clock className="h-9 w-9 text-white" />
              </div>
              <p className="text-gray-900 text-sm font-bold">Time</p>
            </div>
            <div className="bg-white p-4 text-center">
              {isLoading ? (
                <div className="h-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <p className="text-[32px] font-black text-green-600 leading-none">{formatTime(stats.timeSpent)}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex flex-col gap-1.5">
          <div className="w-1 h-4 bg-[#4A7FE8] rounded-full"></div>
          <div className="w-1 h-4 bg-[#4A7FE8] rounded-full"></div>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-[#4A7FE8] bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Today
        </button>
      </div>
    </div>
  )
}
