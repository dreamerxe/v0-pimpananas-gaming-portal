import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Coins, Zap, Star, Gift } from "lucide-react"

export default function ShopPage() {
  const shopItems = [
    {
      id: 1,
      name: "Golden Banana",
      description: "Unlock premium features for 30 days",
      price: 5000,
      icon: "🍌",
      badge: "Popular",
      color: "from-primary/20 to-yellow-400/20"
    },
    {
      id: 2,
      name: "Power Boost",
      description: "2x rewards for your next 10 games",
      price: 2500,
      icon: "⚡",
      badge: "Limited",
      color: "from-blue-500/20 to-cyan-400/20"
    },
    {
      id: 3,
      name: "Rare Avatar",
      description: "Exclusive profile avatar frame",
      price: 3500,
      icon: "🎨",
      badge: "New",
      color: "from-purple-500/20 to-pink-400/20"
    },
    {
      id: 4,
      name: "Mystery Box",
      description: "Random rewards worth up to 10,000 coins",
      price: 4000,
      icon: "🎁",
      badge: "Mystery",
      color: "from-orange-500/20 to-red-400/20"
    },
    {
      id: 5,
      name: "VIP Pass",
      description: "Access to exclusive games and tournaments",
      price: 10000,
      icon: "👑",
      badge: "Premium",
      color: "from-primary/20 to-yellow-600/20"
    },
    {
      id: 6,
      name: "Double Coins",
      description: "Earn 2x coins for 7 days",
      price: 6000,
      icon: "💰",
      badge: "Hot",
      color: "from-green-500/20 to-emerald-400/20"
    }
  ]

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
          <p className="text-muted-foreground">Get awesome items with your coins</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">12,500</span>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground font-bold">
                <Gift className="mr-2 h-4 w-4" />
                Earn More
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
                  <Button size="sm" className="w-full h-8 text-xs font-bold bg-primary hover:bg-primary/90">
                    <ShoppingBag className="mr-1 h-3 w-3" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Offers */}
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
                  <span className="text-lg font-bold text-primary">999 coins</span>
                  <Badge className="bg-secondary text-secondary-foreground">-50%</Badge>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-secondary to-pink-600 text-white font-bold">
                Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}