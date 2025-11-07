"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Coins, ExternalLink } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { toast } from "sonner"

export default function ShopPage() {
  const { isConnected, address } = useWallet()
  const { balance, isLoading, refreshBalance } = useUserBalance()

  const shopItems = [
    {
      id: "power_boost",
      name: "Power Boost",
      description: "2x rewards for your next 10 games",
      price: 2500,
      icon: "⚡",
      badge: "Limited",
      color: "from-blue-50 to-cyan-50",
    },
    {
      id: "rare_avatar",
      name: "Rare Avatar",
      description: "Exclusive profile avatar frame",
      price: 3500,
      icon: "🎨",
      badge: "New",
      color: "from-purple-50 to-pink-50",
    },
    {
      id: "mystery_box",
      name: "Mystery Box",
      description: "Random rewards worth up to 10,000 coins",
      price: 4000,
      icon: "🎁",
      badge: "Mystery",
      color: "from-orange-50 to-red-50",
    },
  ]

  const handleBuyItem = async (item: (typeof shopItems)[0]) => {
    if (!isConnected) {
      toast.error("🍌 Connect your wallet first!")
      return
    }

    if (balance < item.price) {
      toast.error("🍌 Not enough $PIMP coins!")
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
    <div className="relative min-h-screen pb-24 bg-app-gradient page-fade">
      <main className="px-4 pt-6 max-w-2xl mx-auto animate-in fade-in duration-300">
        <h1 className="text-[32px] font-extrabold text-gray-900 mb-6 leading-none tracking-tight">Store</h1>

        {/* Balance Card */}
        <Card className="mb-6 bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-[22px]">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Your Balance</p>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-[#4A7FE8]" />
                  <span className="text-3xl font-black text-gray-900">
                    {isLoading ? "..." : balance.toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                asChild
                className="bg-[#4A7FE8] text-white font-bold hover:bg-[#3D6ED6] shadow-md rounded-full px-5 h-11 active:scale-95 transition-all"
              >
                <a href="https://ton.org" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Buy More
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {shopItems.map((item, index) => (
            <Card
              key={item.id}
              className={`bg-gradient-to-br ${item.color} border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-[22px] overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-5xl">{item.icon}</span>
                  {item.badge && (
                    <Badge className="bg-[#4A7FE8] text-white text-xs px-2.5 py-0.5 font-bold rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-extrabold text-gray-900 tracking-tight">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] leading-snug">{item.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 py-2.5 bg-white rounded-xl">
                    <Coins className="h-5 w-5 text-[#4A7FE8]" />
                    <span className="text-base font-black text-[#4A7FE8]">{item.price.toLocaleString()}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleBuyItem(item)}
                    disabled={!isConnected || isLoading}
                    className="w-full h-11 text-sm font-bold bg-[#4A7FE8] hover:bg-[#3D6ED6] text-white shadow-md rounded-full active:scale-95 transition-all touch-manipulation"
                  >
                    <ShoppingBag className="mr-1.5 h-4 w-4" />
                    {!isConnected ? "Connect Wallet" : "Buy Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
