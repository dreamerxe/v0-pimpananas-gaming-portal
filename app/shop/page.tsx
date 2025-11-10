"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Zap, TrendingUp, Wallet, Check, AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { useTonBalance } from "@/hooks/use-ton-balance"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTonConnectUI } from "@tonconnect/ui-react"

interface CoinPackage {
  id: string
  ton: number
  coins: number
  bonus: number
  popular?: boolean
  bestValue?: boolean
}

const COIN_PACKAGES: CoinPackage[] = [
  {
    id: "starter",
    ton: 1,
    coins: 1000,
    bonus: 0,
  },
  {
    id: "standard",
    ton: 5,
    coins: 5500,
    bonus: 10,
    popular: true,
  },
  {
    id: "premium",
    ton: 10,
    coins: 12000,
    bonus: 20,
  },
  {
    id: "vip",
    ton: 25,
    coins: 32500,
    bonus: 30,
    bestValue: true,
  },
  {
    id: "whale",
    ton: 50,
    coins: 70000,
    bonus: 40,
  },
]

const PLATFORM_WALLET = process.env.NEXT_PUBLIC_PLATFORM_WALLET || "UQBvzM7HFJ5ptvPXx_XSfBV8z6NQuNqJPW9SrNr5_Q5XHNWZ"

export default function ShopPage() {
  const { isConnected, address } = useWallet()
  const { balance, refreshBalance } = useUserBalance()
  const { balance: tonBalance, balanceFormatted, isLoading: isLoadingBalance } = useTonBalance()
  const [tonConnectUI] = useTonConnectUI()
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleBuyCoins = async (pkg: CoinPackage) => {
    if (!isConnected || !address) {
      toast.error("🍌 Please connect your wallet first!")
      return
    }

    if (tonBalance < pkg.ton) {
      toast.error(`🍌 Insufficient TON! You need ${pkg.ton} TON but only have ${balanceFormatted} TON`)
      return
    }

    setSelectedPackage(pkg)
    setIsProcessing(true)

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: PLATFORM_WALLET,
            amount: (pkg.ton * 1000000000).toString(),
            payload: btoa(
              JSON.stringify({
                type: "buy_coins",
                package_id: pkg.id,
                coins: pkg.coins,
                wallet: address,
              }),
            ),
          },
        ],
      }

      const result = await tonConnectUI.sendTransaction(transaction)

      const response = await fetch("/api/coins/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          packageId: pkg.id,
          txHash: result.boc || "pending",
          isFirstPurchase: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to credit coins")
      }

      const data = await response.json()

      toast.success(`🍌 Successfully purchased ${data.coinsAdded.toLocaleString()} $PIMP coins!`)

      refreshBalance()
    } catch (error: any) {
      console.error("Transaction error:", error)

      if (error.message?.includes("user rejected")) {
        toast.error("🍌 Transaction cancelled")
      } else {
        toast.error("🍌 Transaction failed. Please try again.")
      }
    } finally {
      setIsProcessing(false)
      setSelectedPackage(null)
    }
  }

  const hasEnoughTon = (pkg: CoinPackage) => {
    return tonBalance >= pkg.ton
  }

  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-[#E8D5F2] via-[#E8D5F2]/50 to-white">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 mb-2">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-2xl sm:text-[32px] font-extrabold text-gray-900 leading-none tracking-tight flex items-center gap-2 sm:gap-3">
          <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-[#5B8FF9]" />
          Buy $PIMP Coins
        </h1>
      </div>

      <main className="px-4 max-w-2xl mx-auto">
        {/* Your $PIMP Balance Card */}
        <Card className="mb-4 bg-gradient-to-br from-purple-400/20 to-pink-400/20 border-purple-200 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Your $PIMP Balance</p>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Coins className="h-6 w-6 sm:h-7 sm:w-7 text-[#5B8FF9]" />
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">{balance.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TON Balance Display */}
        {isConnected && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your TON Balance</p>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-500">
                    {isLoadingBalance ? "..." : balanceFormatted} TON
                  </span>
                </div>
                {tonBalance === 0 && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    You need TON to purchase coins. Get TON from an exchange or bridge.
                  </p>
                )}
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mt-1">
                  {tonBalance > 0 ? "✓ Ready" : "⚠ Low Balance"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* First Purchase Bonus Banner */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-primary">First Purchase Bonus!</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get <span className="text-primary font-bold">+100% extra coins</span> on your first purchase! Limited time
            offer.
          </p>
        </div>

        {/* Coin Packages */}
        <div className="space-y-3 mb-6">
          {COIN_PACKAGES.map((pkg) => {
            const baseCoins = pkg.ton * 1000
            const bonusCoins = pkg.coins - baseCoins
            const canAfford = hasEnoughTon(pkg)

            return (
              <Card
                key={pkg.id}
                className={`relative transition-all ${!canAfford ? "opacity-50" : "hover:shadow-lg"} ${
                  pkg.bestValue ? "border-secondary/50 bg-secondary/5" : ""
                } ${selectedPackage?.id === pkg.id ? "border-primary ring-2 ring-primary/20" : ""}`}
              >
                <CardContent className="pt-6 pb-6">
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-1 flex-wrap justify-end max-w-[50%]">
                    {pkg.popular && <Badge className="bg-primary text-primary-foreground text-xs">🔥 Popular</Badge>}
                    {pkg.bestValue && (
                      <Badge className="bg-secondary text-secondary-foreground text-xs">💎 Best Value</Badge>
                    )}
                    {!canAfford && (
                      <Badge variant="outline" className="text-xs border-red-500 text-red-500 whitespace-nowrap">
                        Insufficient TON
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        <span className="text-2xl sm:text-3xl font-bold">{pkg.ton} TON</span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          {pkg.coins.toLocaleString()} $PIMP
                        </span>
                      </div>

                      {pkg.bonus > 0 && (
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-semibold">
                            +{pkg.bonus}% Bonus ({bonusCoins.toLocaleString()} extra)
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Rate: 1 TON = {(pkg.coins / pkg.ton).toLocaleString()} $PIMP
                      </p>
                    </div>

                    <Button
                      onClick={() => handleBuyCoins(pkg)}
                      disabled={isProcessing || !isConnected || !canAfford}
                      size="lg"
                      className="w-full sm:w-auto sm:ml-4 bg-[#5B8FF9] hover:bg-[#4A7FE8] text-white font-bold shadow-md sm:min-w-[140px]"
                    >
                      {isProcessing && selectedPackage?.id === pkg.id ? (
                        "Processing..."
                      ) : !canAfford ? (
                        <span className="text-sm">Need More TON</span>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-4 w-4" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Footer */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm mb-6">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5" />
            <span>Instant delivery after transaction confirmation</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5" />
            <span>Secure payment via TON blockchain</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5" />
            <span>No hidden fees - what you see is what you pay</span>
          </div>
        </div>

        {!isConnected && (
          <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20 mb-6">
            <p className="text-sm text-muted-foreground mb-3">Connect your TON wallet to purchase coins</p>
            <Button className="bg-[#5B8FF9] hover:bg-[#4A7FE8] text-white font-bold">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
