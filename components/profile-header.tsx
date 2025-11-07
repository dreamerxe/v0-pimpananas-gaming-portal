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
    timeSpent: 0 // in minutes
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
      const { data: plays } = await supabase
        .from("plays")
        .select("duration_seconds")
        .eq("wallet_address", address)
      
      const gamesPlayed = plays?.length || 0
      const totalTimeSeconds = plays?.reduce((sum, play) => sum + (play.duration_seconds || 0), 0) || 0
      
      // Calculate level: 1,500 based on games*100 + time formula
      const level = Math.floor((gamesPlayed * 100 + totalTimeSeconds / 60) / 100) || 1500
      
      setStats({
        level: level,
        timeSpent: Math.floor(totalTimeSeconds / 60) || 23
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      setStats({ level: 1500, timeSpent: 23 }) // Default values from reference
    } finally {
      setIsLoading(false)
    }
  }

  const displayName = isTelegram && user?.username 
    ? `@${user.username}` 
    : address 
    ? `@${address.slice(2, 10)}`
    : "@littlebear0213"

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="px-5">
      {/* Profile Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-md p-5 mb-6">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar and Info */}
          <div className="flex items-center gap-3">
            <div 
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                <AvatarImage src={user?.photo_url} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xl font-bold">
                  {isTelegram && user ? user.first_name?.[0] || "L" : "L"}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Coins className="h-4 w-4 text-orange-500" />
                <span className="text-xl font-bold text-gray-900">
                  {balance.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600">Currency</p>
            </div>
          </div>

          {/* How to earn button */}
          <button 
            onClick={() => router.push("/shop")}
            className="text-sm font-semibold text-[#5B8FF9] hover:text-[#4A7FE8] transition-colors"
          >
            How to earn?
          </button>
        </div>

        {/* Username Badge */}
        <div className="inline-flex items-center bg-[#5B8FF9] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
          {displayName}
        </div>
      </div>

      {/* Statistics Section */}
      <h2 className="text-[28px] font-bold text-gray-900 text-center mb-4 leading-tight tracking-tight">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Level Card - Purple gradient like reference */}
        <Card className="bg-white border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 flex flex-col items-center justify-center aspect-square">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 p-3 rounded-2xl mb-2 shadow-lg">
                <Crown className="h-8 w-8 text-yellow-700" />
              </div>
              <p className="text-white text-sm font-medium">Level</p>
            </div>
            <div className="bg-white p-4 text-center">
              {isLoading ? (
                <div className="h-9 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <p className="text-3xl font-black text-purple-600">
                  {stats.level.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time Card - Green gradient like reference */}
        <Card className="bg-white border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 flex flex-col items-center justify-center aspect-square">
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-3 rounded-2xl mb-2 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-800 text-sm font-medium">Time</p>
            </div>
            <div className="bg-white p-4 text-center">
              {isLoading ? (
                <div className="h-9 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <p className="text-3xl font-black text-green-600">
                  {formatTime(stats.timeSpent)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today Toggle - matching reference */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="w-12 h-1 bg-[#5B8FF9] rounded-full"></div>
        <button className="flex items-center gap-2 text-sm font-semibold text-[#5B8FF9] bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Today
        </button>
      </div>
    </div>
  )
}