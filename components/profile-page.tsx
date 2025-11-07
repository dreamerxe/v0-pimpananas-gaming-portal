"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTonAddress } from "@tonconnect/ui-react"
import { useTelegram } from "@/hooks/use-telegram"
import { useUserBalance } from "@/hooks/use-user-balance"
import { Crown, Clock, TrendingUp, Gamepad2, Coins } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const address = useTonAddress()
  const { user, isTelegram } = useTelegram()
  const { balance: pimpBalance } = useUserBalance()
  const router = useRouter()
  const [stats, setStats] = useState({
    level: 0,
    timeSpent: 0,
    skills: 0,
    gamesPlayed: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (address) {
      fetchUserStats()
    } else {
      setStats({ level: 0, timeSpent: 0, skills: 0, gamesPlayed: 0 })
      setIsLoading(false)
    }
  }, [address, pimpBalance])

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
      
      // Calculate level based on games played and time
      const level = Math.floor((gamesPlayed * 100 + totalTimeSeconds / 60) / 100)
      
      setStats({
        level: level,
        timeSpent: Math.floor(totalTimeSeconds / 60),
        skills: pimpBalance, // Skills = coins balance
        gamesPlayed: gamesPlayed
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      setStats({ level: 0, timeSpent: 0, skills: pimpBalance, gamesPlayed: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  const displayName = isTelegram && user 
    ? user.first_name 
    : address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Guest"

  const username = isTelegram && user?.username 
    ? user.username 
    : address 
    ? `${address.slice(0, 8)}`
    : "guest"

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-pink-300 via-purple-300 to-orange-300">
      {/* Hero Background */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"800\" height=\"400\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3ClinearGradient id=\"grad\" x1=\"0%25\" y1=\"0%25\" x2=\"100%25\" y2=\"100%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:rgb(219,39,119);stop-opacity:1\" /%3E%3Cstop offset=\"50%25\" style=\"stop-color:rgb(168,85,247);stop-opacity:1\" /%3E%3Cstop offset=\"100%25\" style=\"stop-color:rgb(251,146,60);stop-opacity:1\" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\"800\" height=\"400\" fill=\"url(%23grad)\" /%3E%3C/svg%3E')"
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pink-900/50 to-transparent" />
        </div>
        
        {/* Profile Avatar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Avatar className="h-24 w-24 border-4 border-white shadow-2xl">
            <AvatarImage src={user?.photo_url} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-yellow-400 text-primary-foreground text-3xl font-bold">
              {isTelegram && user ? user.first_name?.[0] || "G" : "G"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 px-4 text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-1">{displayName}</h1>
        <p className="text-sm text-gray-600 mb-6">{username}</p>

        {/* Coins and How to Earn */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => router.push("/shop")}
          >
            <Coins className="h-5 w-5" />
            <span className="text-lg font-bold">{pimpBalance.toLocaleString()}</span>
          </div>
          <button 
            className="text-sm text-blue-600 font-semibold hover:underline"
            onClick={() => router.push("/shop")}
          >
            How to earn coins?
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Level Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mb-3 shadow-md">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-gray-600 mb-1">Level</div>
              {isLoading ? (
                <div className="h-9 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="text-3xl font-black text-gray-900">{stats.level}</div>
              )}
            </CardContent>
          </Card>

          {/* Time Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mb-3 shadow-md">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-gray-600 mb-1">Time</div>
              {isLoading ? (
                <div className="h-9 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="text-2xl font-black text-gray-900">{formatTime(stats.timeSpent)}</div>
              )}
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center mb-3 shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-gray-600 mb-1">Skills</div>
              <div className="text-3xl font-black text-gray-900">{stats.skills.toLocaleString()}</div>
            </CardContent>
          </Card>

          {/* Games Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3 shadow-md">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-gray-600 mb-1">Games</div>
              {isLoading ? (
                <div className="h-9 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                </div>
              ) : (
                <div className="text-3xl font-black text-gray-900">{stats.gamesPlayed}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Games Section */}
      <div className="px-4">
        <h2 className="text-xl font-black text-gray-900 mb-4 text-center">Recommended games</h2>
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
            <span className="text-lg">⭐</span>
            <span className="text-sm font-semibold text-gray-900">Survival</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full whitespace-nowrap">
            <span className="text-lg">👊</span>
            <span className="text-sm font-medium text-gray-700">Action</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full whitespace-nowrap">
            <span className="text-lg">💎</span>
            <span className="text-sm font-medium text-gray-700">Collector</span>
          </div>
        </div>

        {/* More popular above button */}
        <button 
          className="flex items-center justify-center gap-2 w-full py-2 mb-4 text-sm text-gray-600 font-medium"
          onClick={() => router.push("/")}
        >
          <TrendingUp className="h-4 w-4" />
          More popular above
        </button>
      </div>
    </div>
  )
}