"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { GameGrid } from "@/components/game-grid-mobile"
import { CTAButtons } from "@/components/cta-buttons"
import { useUserBalance } from "@/hooks/use-user-balance"
import { useWallet } from "@/hooks/use-wallet"
import { Coins, TrendingUp, Sparkles, Crown, Zap, Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  category: string
  is_active: boolean
  created_at: string
}

export function GameSections() {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { balance, isLoading: balanceLoading } = useUserBalance()
  const { isConnected } = useWallet()

  useEffect(() => {
    const fetchGames = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setGames(data)
      }
      setIsLoading(false)
    }

    fetchGames()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🍌</div>
          <p className="text-muted-foreground font-light">Loading amazing games...</p>
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4 animate-pulse">🍌</div>
        <p className="text-muted-foreground text-lg font-light">No games available yet.</p>
        <p className="text-sm text-muted-foreground/70 mt-2">Check back soon for fresh bananas!</p>
      </div>
    )
  }

  const topBananas = games.slice(0, 6)
  const freshPicks = games.slice(6, 12)
  const strategyGames = games.filter((g) => g.category === "Strategy").slice(0, 6)
  const actionGames = games.filter((g) => g.category === "Action").slice(0, 6)

  return (
    <div className="space-y-8 pb-6">
      {/* Premium Hero Section with Balance */}
      <section className="px-4 pt-6 pb-4 space-y-6">
        {/* Balance Card - Premium Design */}
        {isConnected && (
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/10 backdrop-blur-xl shadow-xl shadow-primary/5">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-50" />
            
            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary/70" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Your Balance
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black bg-gradient-to-br from-primary via-yellow-400 to-primary bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,226,71,0.3)]">
                      {balanceLoading ? "..." : balance.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold text-primary/80">$PIMP</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 font-light">
                    Play games to earn more coins
                  </p>
                </div>
                
                {/* Decorative coin icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                    <Coins className="h-10 w-10 text-primary drop-shadow-[0_0_15px_rgba(255,226,71,0.5)]" />
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="mt-6 pt-4 border-t border-primary/10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground/70">Earning</p>
                </div>
                <div className="text-center">
                  <Star className="h-4 w-4 text-secondary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground/70">VIP Status</p>
                </div>
                <div className="text-center">
                  <Crown className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground/70">Premium</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Welcome Header */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight tracking-tight">
            Discover Games
          </h1>
          <p className="text-base text-muted-foreground/80 font-light max-w-md leading-relaxed">
            Play premium WebGL games, earn $PIMP coins, and compete with players worldwide
          </p>
        </div>
      </section>

      {/* Featured Top Bananas - Premium Grid */}
      <section className="space-y-5">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-pink-500/20 border border-secondary/30 flex items-center justify-center backdrop-blur-sm">
              <Crown className="h-5 w-5 text-secondary drop-shadow-[0_0_8px_rgba(255,51,230,0.5)]" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Top Picks</h2>
              <p className="text-xs text-muted-foreground/70 font-light">Most played this week</p>
            </div>
          </div>
          <Zap className="h-5 w-5 text-secondary/50" />
        </div>
        <GameGrid games={topBananas} />
      </section>

      {/* CTA Buttons */}
      <CTAButtons />

      {/* Fresh Picks Section */}
      {freshPicks.length > 0 && (
        <section className="space-y-5">
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-yellow-500/20 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(255,226,71,0.5)]" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Fresh Drops</h2>
                <p className="text-xs text-muted-foreground/70 font-light">Just added for you</p>
              </div>
            </div>
          </div>
          <GameGrid games={freshPicks} />
        </section>
      )}

      {/* Action Games Section */}
      {actionGames.length > 0 && (
        <section className="space-y-5">
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center backdrop-blur-sm">
                <Zap className="h-5 w-5 text-orange-500 drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Action Zone</h2>
                <p className="text-xs text-muted-foreground/70 font-light">High-octane gameplay</p>
              </div>
            </div>
          </div>
          <GameGrid games={actionGames} />
        </section>
      )}

      {/* Strategy Masters Section */}
      {strategyGames.length > 0 && (
        <section className="space-y-5">
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
                <Star className="h-5 w-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Brain Games</h2>
                <p className="text-xs text-muted-foreground/70 font-light">Think & conquer</p>
              </div>
            </div>
          </div>
          <GameGrid games={strategyGames} />
        </section>
      )}
    </div>
  )
}