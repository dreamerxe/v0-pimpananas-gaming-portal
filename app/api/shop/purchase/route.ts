import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

// Shop items configuration
const SHOP_ITEMS = {
  golden_banana: { name: "Golden Banana", price: 5000, type: "vip_pass", duration_days: 30 },
  power_boost: { name: "Power Boost", price: 2500, type: "power_boost", quantity: 10 },
  rare_avatar: { name: "Rare Avatar", price: 3500, type: "cosmetic" },
  mystery_box: { name: "Mystery Box", price: 4000, type: "mystery_box" },
  vip_pass: { name: "VIP Pass", price: 10000, type: "vip_pass", duration_days: 30 },
  double_coins: { name: "Double Coins", price: 6000, type: "boost", duration_days: 7 },
  starter_pack: { name: "Starter Pack", price: 999, type: "bundle" },
}

export async function POST(request: Request) {
  try {
    const { walletAddress, itemId } = await request.json()

    if (!walletAddress || !itemId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const item = SHOP_ITEMS[itemId as keyof typeof SHOP_ITEMS]
    if (!item) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check balance
    const { data: balanceData, error: balanceError } = await supabase
      .from("user_balances")
      .select("balance")
      .eq("wallet_address", walletAddress)
      .single()

    if (balanceError || !balanceData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (balanceData.balance < item.price) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Spend coins
    const { data: newBalance, error: spendError } = await supabase.rpc("spend_coins", {
      p_wallet_address: walletAddress,
      p_amount: item.price,
      p_description: `Purchased ${item.name}`,
      p_metadata: { item_id: itemId, item_name: item.name, item_type: item.type },
    })

    if (spendError) {
      console.error("Error spending coins:", spendError)
      return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 })
    }

    // Add item to inventory
    const expiresAt = item.duration_days
      ? new Date(Date.now() + item.duration_days * 24 * 60 * 60 * 1000).toISOString()
      : null

    await supabase.from("user_items").upsert({
      wallet_address: walletAddress,
      item_id: itemId,
      item_type: item.type,
      quantity: (item as any).quantity || 1,
      expires_at: expiresAt,
      metadata: { name: item.name, purchased_price: item.price },
    })

    // Handle special items
    if (itemId === "mystery_box") {
      const randomCoins = Math.floor(Math.random() * 8000) + 2000
      await supabase.rpc("add_coins", {
        p_wallet_address: walletAddress,
        p_amount: randomCoins,
        p_type: "bonus",
        p_description: "Mystery Box reward",
        p_metadata: { source: "mystery_box" },
      })

      return NextResponse.json({
        success: true,
        newBalance,
        mysteryReward: { coins: randomCoins },
      })
    }

    if (itemId === "starter_pack") {
      await supabase.rpc("add_coins", {
        p_wallet_address: walletAddress,
        p_amount: 5000,
        p_type: "bonus",
        p_description: "Starter Pack bonus coins",
      })
    }

    return NextResponse.json({
      success: true,
      newBalance,
      item: { id: itemId, name: item.name, type: item.type },
    })
  } catch (error) {
    console.error("Error in purchase item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}