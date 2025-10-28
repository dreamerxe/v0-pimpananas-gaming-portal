"use client"

import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Coins, Star, Wallet } from "lucide-react"
import { BuyCoinsDialog } from "@/components/shop/buy-coins-dialog"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { useState } from "react"
import { toast } from "sonner"

export default function ShopPage() {
  const { isConnected, address } = useWallet()
  const { balance, isLoading, refreshBalance } = useUserBalance()
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)

  const shopItems = [
    {
      id: "golden_banana",
      name: "Golden Banana",
      description: "Unlock premium features for 30 days",
      price: 5000,
      icon: "🍌",
      badge: "Popular",
      color: "from-primary/20 to-yellow-400/20",
    },
    {
      id: "power_boost",
      name: "Power Boost",
      description: "2x rewards for your next 10 games",
      price: 2500,
      icon: "⚡",
      badge: "Limited",
      color: "from-blue-500/20 to-cyan-400/20",
    },
    {
      id: "rare_avatar",
      name: "Rare Avatar",
      description: "Exclusive profile avatar frame",
      price: 3500,
      icon: "🎨",
      badge: "New",
      color: "from-purple-500/20 to-pink-400/20",
    },
    {
      id: "mystery_box",
      name: "Mystery Box",
      description: "Random rewards worth up to 10,000 coins",
      price: 4000,
      icon: "🎁",
      badge: "Mystery",
      color: "from-orange-500/20 to-red-400/20",
    },
    {
      id: "vip_pass",
      name: "VIP Pass",
      description: "Access to exclusive games and tournaments",
      price: 10000,
      icon: "👑",
      badge: "Premium",
      color: "from-primary/20 to-yellow-600/20",
    },
    {
      id: "double_coins",
      name: "Double Coins",
      description: "Earn 2x coins for 7 days",
      price: 6000,
      icon: "💰",
      badge: "Hot",
      color: "from-green-500/20 to-emerald-400/20",
    }
  ]

  const handleBuyItem = async (item: typeof shopItems[0]) => {
    if (!isConnected) {
      toast.error("🍌 Connect your wallet first!")
      return
    }

    if (balance < item.price) {
      toast.error("🍌 Not enough $PIMP coins! Buy more below.")
      setBuyDialogOpen(true)
      return
    }

    try {
      const response = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          itemId: item.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Purchase failed")
      }

      const data = await response.json()

      if (item.id === "mystery_box" && data.mysteryReward) {
        toast.success(
          `🎁 Mystery Box opened! You won ${data.mysteryReward.coins.toLocaleString()} $PIMP coins!`
        )
      } else {
        toast.success(`🍌 Purchased ${item.name}!`)
      }

      refreshBalance()
    } catch (error: any) {
      toast.error(error.message || "Failed to purchase item")
    }
  }

  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-background via-background to-card">
      <MobileHeader />
      
      <main className="px-3 pt-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl drop-shadow-[0_0_8px_rgba(255,226,71,0.5)]">🛍️</span>
            <h1 className="text-3xl font-black text-primary">Banana Shop</h1>
          </div>
          <p className="text-muted-foreground">Get awesome items with $PIMP coins</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your $PIMP Balance</p>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">
                    {isLoading ? "..." : balance.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => setBuyDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground font-bold"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Buy More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {shopItems.map((item) => (
            <Card key={item.id} className={`bg-gradient-to-br ${item.color} border-border/50 overflow-hidden`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{item.icon}</span>
                  {item.badge && (
                    <Badge className="bg-secondary text-secondary-foreground text-[9px] px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-bold line-clamp-1">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                  {item.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 py-1.5 bg-background/50 rounded-md">
                    <Coins className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-bold text-primary">{item.price.toLocaleString()}</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleBuyItem(item)}
                    disabled={!isConnected || isLoading}
                    className="w-full h-8 text-xs font-bold bg-primary hover:bg-primary/90"
                  >
                    <ShoppingBag className="mr-1 h-3 w-3" />
                    {!isConnected ? "Connect Wallet" : "Buy Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Special */}
        <Card className="mb-4 bg-gradient-to-r from-secondary/20 via-card to-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-secondary fill-secondary" />
              Daily Special Offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold mb-1">Starter Pack</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Get 5000 bonus coins + 3 power boosts
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-muted-foreground">2000</span>
                  <span className="text-lg font-bold text-primary">999 $PIMP</span>
                  <Badge className="bg-secondary text-secondary-foreground">-50%</Badge>
                </div>
              </div>
              <Button 
                onClick={() => handleBuyItem({ 
                  id: "starter_pack", 
                  name: "Starter Pack", 
                  price: 999, 
                  icon: "🎉", 
                  badge: "Special", 
                  color: "" 
                })}
                disabled={!isConnected || isLoading}
                className="bg-gradient-to-r from-secondary to-pink-600 text-white font-bold"
              >
                Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
      <BuyCoinsDialog 
        open={buyDialogOpen} 
        onOpenChange={setBuyDialogOpen}
        onSuccess={refreshBalance}
      />
    </div>
  )
}