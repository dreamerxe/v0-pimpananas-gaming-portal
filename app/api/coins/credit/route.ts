import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

// Coin packages configuration
const COIN_PACKAGES = {
  starter: { ton: 1, coins: 1000, bonus: 0 },
  standard: { ton: 5, coins: 5500, bonus: 10 },
  premium: { ton: 10, coins: 12000, bonus: 20 },
  vip: { ton: 25, coins: 32500, bonus: 30 },
  whale: { ton: 50, coins: 70000, bonus: 40 },
}

export async function POST(request: Request) {
  try {
    const { walletAddress, packageId, txHash, isFirstPurchase } = await request.json()

    if (!walletAddress || !packageId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const pkg = COIN_PACKAGES[packageId as keyof typeof COIN_PACKAGES]
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 })
    }

    const supabase = createServerClient()

    let totalCoins = pkg.coins

    // Check if first purchase
    const { data: existingPurchases } = await supabase
      .from("coin_purchases")
      .select("id")
      .eq("wallet_address", walletAddress)
      .eq("status", "confirmed")
      .limit(1)

    const isActuallyFirstPurchase = !existingPurchases || existingPurchases.length === 0

    // Apply first purchase bonus (100% extra)
    if (isActuallyFirstPurchase) {
      totalCoins *= 2
    }

    // Record purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from("coin_purchases")
      .insert({
        wallet_address: walletAddress,
        package_id: packageId,
        ton_amount: pkg.ton,
        coins_amount: pkg.coins,
        bonus_coins: totalCoins - pkg.coins,
        ton_tx_hash: txHash,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (purchaseError) {
      console.error("Error recording purchase:", purchaseError)
      return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 })
    }

    // Add coins to user balance
    const { data: balanceData, error: balanceError } = await supabase.rpc("add_coins", {
      p_wallet_address: walletAddress,
      p_amount: totalCoins,
      p_type: "purchase",
      p_description: `Purchased ${packageId} package`,
      p_metadata: {
        package_id: packageId,
        purchase_id: purchase.id,
        tx_hash: txHash,
        first_purchase_bonus: isActuallyFirstPurchase,
      },
    })

    if (balanceError) {
      console.error("Error adding coins:", balanceError)
      return NextResponse.json({ error: "Failed to credit coins" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      coinsAdded: totalCoins,
      newBalance: balanceData,
      firstPurchaseBonus: isActuallyFirstPurchase,
    })
  } catch (error) {
    console.error("Error in credit coins:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}