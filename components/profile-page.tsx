"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { useTelegram } from "@/hooks/use-telegram"
import { Wallet, LogOut, User, Star, Gamepad2, Trophy, Copy, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

export default function ProfilePage() {
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()
  const { user, isTelegram } = useTelegram()
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalPlayTime: 0,
    ratingsGiven: 0,
    averageRating: 0
  })

  useEffect(() => {
    if (address) {
      fetchUserStats()
    }
  }, [address])

  const fetchUserStats = async () => {
    if (!address) return
    
    const supabase = createClient()
    
    // Get plays
    const { data: plays } = await supabase
      .from("plays")
      .select("duration_seconds")
      .eq("wallet_address", address)
    
    // Get ratings
    const { data: ratings } = await supabase
      .from("ratings")
      .select("rating")
      .eq("wallet_address", address)
    
    const gamesPlayed = plays?.length || 0
    const totalPlayTime = plays?.reduce((sum, play) => sum + (play.duration_seconds || 0), 0) || 0
    const ratingsGiven = ratings?.length || 0
    const averageRating = ratings?.length 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0

    setStats({
      gamesPlayed,
      totalPlayTime: Math.floor(totalPlayTime / 60), // Convert to minutes
      ratingsGiven,
      averageRating: Number(averageRating.toFixed(1))
    })
  }

  const handleDisconnect = async () => {
    await tonConnectUI.disconnect()
    toast.success("🍌 Wallet disconnected")
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success("Address copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="text-6xl mb-4">🍌</div>
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your TON wallet to view your profile and gaming stats
            </p>
            <Button 
              onClick={() => tonConnectUI.openModal()}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 pt-4 px-3 max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <Card className="mb-4 bg-gradient-to-br from-card via-card to-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary shadow-lg">
              <AvatarImage src={user?.photo_url} alt={user?.first_name || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {isTelegram && user ? (
                  user.first_name?.[0] || "U"
                ) : (
                  <User className="h-8 w-8" />
                )}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold truncate">
                  {isTelegram && user 
                    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
                    : "TON Gamer"
                  }
                </h2>
                {user?.is_premium && (
                  <Badge className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground">
                    ⭐ Premium
                  </Badge>
                )}
              </div>
              
              {user?.username && (
                <p className="text-sm text-muted-foreground mb-2">
                  @{user.username}
                </p>
              )}

              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 mt-2">
                <Wallet className="h-4 w-4 text-primary flex-shrink-0" />
                <code className="text-xs font-mono truncate flex-1">
                  {formatAddress(address)}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-6 w-6 flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full mt-4 bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="bg-gradient-to-br from-primary/10 to-card">
          <CardContent className="pt-4 text-center">
            <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{stats.gamesPlayed}</div>
            <div className="text-xs text-muted-foreground">Games Played</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-card">
          <CardContent className="pt-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold text-secondary">{stats.totalPlayTime}m</div>
            <div className="text-xs text-muted-foreground">Play Time</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-card">
          <CardContent className="pt-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{stats.ratingsGiven}</div>
            <div className="text-xs text-muted-foreground">Ratings Given</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-card">
          <CardContent className="pt-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-secondary fill-secondary" />
            <div className="text-2xl font-bold text-secondary">
              {stats.averageRating > 0 ? stats.averageRating : "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Platform</span>
            <span className="text-sm font-medium">
              {isTelegram ? "Telegram Mini App" : "Web Browser"}
            </span>
          </div>
          
          {user?.language_code && (
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Language</span>
              <span className="text-sm font-medium uppercase">{user.language_code}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Telegram User ID</span>
            <span className="text-sm font-medium font-mono">
              {user?.id || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">Wallet Type</span>
            <span className="text-sm font-medium">TON</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}