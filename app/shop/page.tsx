"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Coins, Star, Wallet, ArrowLeft } from "lucide-react"
import { BuyCoinsDialog } from "@/components/shop/buy-coins-dialog"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ShopPage() {
  const { isConnected, address } = useWallet()
  const { balance, isLoading, refreshBalance } = useUserBalance()
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const router = useRouter()

  const shopItems = [
    {
      id: "golden_banana",
      name: "Golden Banana",
      description: "Unlock premium features for 30 days",
      price: 5000,
      icon: "🍌",
      badge: "Popular",
      color: "from-yellow-400/30 to-yellow-600/30",
    },
    {
      id: "power_boost",
      name: "Power Boost",
      description: "2x rewards for your next 10 games",
      price: 2500,
      icon: "⚡",
      badge: "Limited",
      color: "from-blue-400/30 to-cyan-400/30",
    },
    {
      id: "rare_avatar",
      name: "Rare Avatar",
      description: "Exclusive profile avatar frame",
      price: 3500,
      icon: "🎨",
      badge: "New",
      color: "from-purple-400/30 to-pink-400/30",
    },
    {
      id: "mystery_box",
      name: "Mystery Box",
      description: "Random rewards worth up to 10,000 coins",
      price: 4000,
      icon: "🎁",
      badge: "Mystery",
      color: "from-orange-400/30 to-red-400/30",
    },
  ]

  const handleBuyItem = async (item: (typeof shopItems)[0]) => {
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
        toast.success(`🎁 Mystery Box opened! You won ${data.mysteryReward.coins.toLocaleString()} $PIMP coins!`)
      } else {
        toast.success(`🍌 Purchased ${item.name}!`)
      }

      refreshBalance()
    } catch (error: any) {
      toast.error(error.message || "Failed to purchase item")
    }
  }

  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-[#E8D5F2] via-[#E8D5F2]/50 to-white">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-[32px] font-extrabold text-gray-900 mb-6 leading-none tracking-tight flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-[#5B8FF9]" />
          Banana Shop
        </h1>
      </div>

      <main className="px-4 pt-6 max-w-2xl mx-auto">
        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-br from-blue-400/20 to-purple-400/20 border-blue-200 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your $PIMP Balance</p>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-[#5B8FF9]" />
                  <span className="text-3xl font-bold text-gray-900">
                    {isLoading ? "..." : balance.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setBuyDialogOpen(true)}
                className="bg-[#5B8FF9] text-white font-bold hover:bg-[#4A7FE8] shadow-md"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Buy More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {shopItems.map((item) => (
            <Card
              key={item.id}
              className={`bg-gradient-to-br ${item.color} border-gray-200 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-200`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-4xl">{item.icon}</span>
                  {item.badge && <Badge className="bg-[#5B8FF9] text-white text-xs px-2 py-0">{item.badge}</Badge>}
                </div>
                <CardTitle className="text-base font-bold text-gray-900">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">{item.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 py-2 bg-white/70 rounded-md">
                    <Coins className="h-4 w-4 text-[#5B8FF9]" />
                    <span className="text-sm font-bold text-[#5B8FF9]">{item.price.toLocaleString()}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleBuyItem(item)}
                    disabled={!isConnected || isLoading}
                    className="w-full h-9 text-xs font-bold bg-[#5B8FF9] hover:bg-[#4A7FE8] text-white shadow-sm"
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
        <Card className="mb-6 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border-purple-200 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              Daily Special Offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Starter Pack</h3>
                <p className="text-xs text-gray-600 mb-2">Get 5000 bonus coins + 3 power boosts</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-gray-500">2000</span>
                  <span className="text-lg font-bold text-[#5B8FF9]">999 $PIMP</span>
                  <Badge className="bg-pink-500 text-white">-50%</Badge>
                </div>
              </div>
              <Button
                onClick={() =>
                  handleBuyItem({
                    id: "starter_pack",
                    name: "Starter Pack",
                    price: 999,
                    icon: "🎉",
                    badge: "Special",
                    color: "",
                    description: "",
                  })
                }
                disabled={!isConnected || isLoading}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold hover:from-pink-600 hover:to-pink-700 shadow-md"
              >
                Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
      <BuyCoinsDialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen} onSuccess={refreshBalance} />
    </div>
  )
}
