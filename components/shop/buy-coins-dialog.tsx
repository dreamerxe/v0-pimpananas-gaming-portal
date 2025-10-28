"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Zap, TrendingUp, Wallet, Check } from "lucide-react"
import { useState } from "react"
import { useTonConnectUI } from "@tonconnect/ui-react"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"

interface BuyCoinsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

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

export function BuyCoinsDialog({ open, onOpenChange, onSuccess }: BuyCoinsDialogProps) {
  const [tonConnectUI] = useTonConnectUI()
  const { address, isConnected } = useWallet()
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBuyCoins = async (pkg: CoinPackage) => {
    if (!isConnected || !address) {
      toast.error("🍌 Please connect your wallet first!")
      return
    }

    setSelectedPackage(pkg)
    setIsProcessing(true)

    try {
      // Create the transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: PLATFORM_WALLET,
            amount: (pkg.ton * 1000000000).toString(), // Convert TON to nanotons
            payload: btoa(JSON.stringify({
              type: "buy_coins",
              package_id: pkg.id,
              coins: pkg.coins,
              wallet: address
            }))
          }
        ]
      }

      console.log("Sending transaction:", transaction)
      const result = await tonConnectUI.sendTransaction(transaction)
      
      console.log("Transaction sent:", result)
      
      // Call backend to credit coins
      const response = await fetch("/api/coins/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          packageId: pkg.id,
          txHash: result.boc || "pending",
          isFirstPurchase: true, // You can track this
        })
      })

      if (!response.ok) {
        throw new Error("Failed to credit coins")
      }

      const data = await response.json()
      
      toast.success(`🍌 Successfully purchased ${data.coinsAdded.toLocaleString()} $PIMP coins!`)
      
      onOpenChange(false)
      onSuccess?.()
      
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Coins className="h-6 w-6 text-primary" />
            Buy PIMPANANAS Coins
          </DialogTitle>
          <DialogDescription>
            Purchase $PIMP coins with TON. Bigger packages = bigger bonuses! 🍌
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* First Purchase Bonus Banner */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-primary">First Purchase Bonus!</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get <span className="text-primary font-bold">+100% extra coins</span> on your first purchase! Limited time offer.
            </p>
          </div>

          {/* Coin Packages */}
          <div className="grid gap-3">
            {COIN_PACKAGES.map((pkg) => {
              const baseCoins = pkg.ton * 1000
              const bonusCoins = pkg.coins - baseCoins
              
              return (
                <div
                  key={pkg.id}
                  className={`relative border rounded-lg p-4 transition-all cursor-pointer hover:border-primary/50 ${
                    pkg.bestValue ? "border-secondary/50 bg-secondary/5" : "border-border"
                  } ${
                    selectedPackage?.id === pkg.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => !isProcessing && setSelectedPackage(pkg)}
                >
                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {pkg.popular && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        🔥 Popular
                      </Badge>
                    )}
                    {pkg.bestValue && (
                      <Badge className="bg-secondary text-secondary-foreground text-xs">
                        💎 Best Value
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-bold">{pkg.ton} TON</span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <Coins className="h-5 w-5 text-primary" />
                        <span className="text-xl font-bold text-primary">
                          {pkg.coins.toLocaleString()} $PIMP
                        </span>
                      </div>

                      {pkg.bonus > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-semibold">
                            +{pkg.bonus}% Bonus ({bonusCoins.toLocaleString()} extra)
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        Rate: 1 TON = {(pkg.coins / pkg.ton).toLocaleString()} $PIMP
                      </p>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuyCoins(pkg)
                      }}
                      disabled={isProcessing || !isConnected}
                      className="ml-4 bg-primary hover:bg-primary/90"
                    >
                      {isProcessing && selectedPackage?.id === pkg.id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Wallet className="mr-2 h-4 w-4" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Info Footer */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
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
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-3">
                Connect your TON wallet to purchase coins
              </p>
              <Button onClick={() => onOpenChange(false)} className="bg-primary">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}