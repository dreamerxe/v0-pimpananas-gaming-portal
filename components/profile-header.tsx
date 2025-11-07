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
    level: 1500,
    timeSpent: 83 // in minutes
  })

  useEffect(() => {
    if (address) {
      fetchUserStats()
    }
  }, [address])

  const fetchUserStats = async () => {
    if (!address) return
    
    const supabase = createClient()
    
    const { data: plays } = await supabase
      .from("plays")
      .select("duration_seconds")
      .eq("wallet_address", address)
    
    const gamesPlayed = plays?.length || 0
    const totalTimeSeconds = plays?.reduce((sum, play) => sum + (play.duration_seconds || 0), 0) || 0
    
    // Calculate level based on games played and time
    const level = Math.floor((gamesPlayed * 100 + totalTimeSeconds / 60) / 100) || 1500
    
    setStats({
      level: level,
      timeSpent: Math.floor(totalTimeSeconds / 60) || 83
    })
  }

  const displayName = isTelegram && user?.username 
    ? `@${user.username}` 
    : address 
    ? `@${address.slice(2, 10)}`
    : "@littlebear0213"

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="px-5">
      {/* Profile Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-5 mb-6">
        <div className="flex items-start justify-between mb-4">
          {/* Avatar and Info */}
          <div className="flex items-center gap-3">
            <div 
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage src={user?.photo_url} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xl font-bold">
                  {isTelegram && user ? user.first_name?.[0] || "G" : "G"}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Coins className="h-4 w-4 text-orange-500" />
                <span className="text-xl font-bold text-gray-900">{balance.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500">Currency</p>
            </div>
          </div>

          {/* How to earn button */}
          <button 
            onClick={() => router.push("/shop")}
            className="text-sm font-semibold text-blue-500 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
          >
            How to earn?
          </button>
        </div>

        {/* Username Badge */}
        <div className="inline-flex items-center bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
          {displayName}
        </div>
      </div>

      {/* Statistics Section */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Level Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 flex flex-col items-center justify-center aspect-square">
              <Crown className="h-12 w-12 text-yellow-300 mb-2" />
              <p className="text-white text-sm font-medium">Level</p>
            </div>
            <div className="bg-white p-4 text-center">
              <p className="text-3xl font-black text-purple-600">{stats.level.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Time Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 flex flex-col items-center justify-center aspect-square">
              <Clock className="h-12 w-12 text-gray-700 mb-2" />
              <p className="text-gray-800 text-sm font-medium">Time</p>
            </div>
            <div className="bg-white p-4 text-center">
              <p className="text-3xl font-black text-green-600">{formatTime(stats.timeSpent)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
        <button className="flex items-center gap-2 text-sm font-semibold text-blue-500 bg-white px-4 py-2 rounded-full shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Today
        </button>
      </div>
    </div>
  )
}