"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  Bell,
  Volume2,
  Shield,
  HelpCircle,
  Info,
  ExternalLink,
  FileText,
  Wallet,
  Crown,
  Clock,
  TrendingUp,
  Gamepad2,
  Coins,
} from "lucide-react"
import { useTelegram } from "@/hooks/use-telegram"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { TonConnectButton } from "@tonconnect/ui-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user, isTelegram } = useTelegram()
  const { address } = useWallet()
  const { balance: pimpBalance } = useUserBalance()
  const router = useRouter()
  const [stats, setStats] = useState({
    level: 0,
    timeSpent: 0,
    skills: 0,
    gamesPlayed: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (address) {
      fetchUserStats()
    } else {
      setStats({ level: 0, timeSpent: 0, skills: pimpBalance, gamesPlayed: 0 })
      setIsLoading(false)
    }
  }, [address, pimpBalance])

  const fetchUserStats = async () => {
    if (!address) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data: plays } = await supabase.from("plays").select("duration_seconds").eq("wallet_address", address)

      const gamesPlayed = plays?.length || 0
      const totalTimeSeconds = plays?.reduce((sum, play) => sum + (play.duration_seconds || 0), 0) || 0
      const level = Math.floor((gamesPlayed * 100 + totalTimeSeconds / 60) / 100)

      setStats({
        level: level,
        timeSpent: Math.floor(totalTimeSeconds / 60),
        skills: pimpBalance,
        gamesPlayed: gamesPlayed,
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      setStats({ level: 0, timeSpent: 0, skills: pimpBalance, gamesPlayed: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  const displayName =
    isTelegram && user ? user.first_name : address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Guest"

  const username = isTelegram && user?.username ? `@${user.username}` : address ? `@${address.slice(2, 10)}` : "@guest"

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-[#E8D5F2] via-[#E8D5F2]/50 to-white">
      <main className="px-4 pt-6 max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-[28px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-6 mb-5">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-purple-200/50 mb-4">
              <AvatarImage src={user?.photo_url || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 text-white text-3xl font-black">
                {isTelegram && user ? user.first_name?.[0] || "G" : "G"}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-black text-gray-900 mb-1">{displayName}</h2>
            <p className="text-sm text-gray-600 mb-4">{username}</p>

            {/* Coins Display */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2.5 rounded-full shadow-lg mb-4">
              <Coins className="h-5 w-5" />
              <span className="text-lg font-bold">{pimpBalance.toLocaleString()}</span>
            </div>

            {/* Statistics Grid */}
            <div className="w-full grid grid-cols-2 gap-3 mb-4">
              {/* Level Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 flex flex-col items-center">
                <Crown className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-xs text-gray-600 mb-1">Level</div>
                {isLoading ? (
                  <div className="h-7 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-purple-600">{stats.level}</div>
                )}
              </div>

              {/* Time Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 flex flex-col items-center">
                <Clock className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-xs text-gray-600 mb-1">Time</div>
                {isLoading ? (
                  <div className="h-7 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <div className="text-xl font-black text-green-600">{formatTime(stats.timeSpent)}</div>
                )}
              </div>

              {/* Skills Card */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 flex flex-col items-center">
                <TrendingUp className="h-8 w-8 text-pink-600 mb-2" />
                <div className="text-xs text-gray-600 mb-1">Skills</div>
                <div className="text-2xl font-black text-pink-600">{stats.skills.toLocaleString()}</div>
              </div>

              {/* Games Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 flex flex-col items-center">
                <Gamepad2 className="h-8 w-8 text-orange-600 mb-2" />
                <div className="text-xs text-gray-600 mb-1">Games</div>
                {isLoading ? (
                  <div className="h-7 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-orange-600">{stats.gamesPlayed}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Wallet className="h-5 w-5 text-[#5B8FF9]" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3">
              {address ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 mb-2">Connected Wallet</p>
                  <p className="text-xs text-gray-600 font-mono bg-gray-100 px-3 py-2 rounded-lg mb-3">
                    {address.slice(0, 8)}...{address.slice(-8)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-2">Connect your wallet to save progress and earn rewards</p>
              )}
              <TonConnectButton className="ton-connect-button" />
            </div>
          </CardContent>
        </Card>

        {/* Settings Title */}
        <h1 className="text-[32px] font-extrabold text-gray-900 mb-6 leading-none tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8 text-[#5B8FF9]" />
          Settings
        </h1>

        {/* Notifications */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Bell className="h-5 w-5 text-[#5B8FF9]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-600">Get notified about new games</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Game Updates</p>
                <p className="text-xs text-gray-600">Updates about your favorite games</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Rewards Alerts</p>
                <p className="text-xs text-gray-600">Get notified about rewards</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Sound & Vibration */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Volume2 className="h-5 w-5 text-[#5B8FF9]" />
              Sound & Vibration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Sound Effects</p>
                <p className="text-xs text-gray-600">In-app sound effects</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Haptic Feedback</p>
                <p className="text-xs text-gray-600">Vibration on interactions</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Shield className="h-5 w-5 text-[#5B8FF9]" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show Profile</p>
                <p className="text-xs text-gray-600">Make your profile visible</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Share Activity</p>
                <p className="text-xs text-gray-600">Share your gaming activity</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Support & Info */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
              <Info className="h-5 w-5 text-[#5B8FF9]" />
              Support & Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between text-gray-900 hover:bg-gray-100/50">
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#5B8FF9]" />
                Help Center
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" className="w-full justify-between text-gray-900 hover:bg-gray-100/50">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#5B8FF9]" />
                Terms of Service
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" className="w-full justify-between text-gray-900 hover:bg-gray-100/50">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#5B8FF9]" />
                Privacy Policy
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-4 bg-white/90 border-gray-200 backdrop-blur-sm shadow-sm">
          <CardContent className="pt-6 text-center space-y-2">
            <div className="text-4xl mb-2">🍌</div>
            <h3 className="font-bold text-[#5B8FF9]">PIMPANANAS</h3>
            <p className="text-xs text-gray-600">Version 1.0.0</p>
            <p className="text-xs text-gray-500">© 2025 PIMPANANAS. All rights reserved.</p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
