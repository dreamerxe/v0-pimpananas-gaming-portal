import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")
    const walletAddress = searchParams.get("walletAddress")

    if (!gameId || !walletAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get user's rating for the game
    const { data: rating, error } = await supabase
      .from("ratings")
      .select("rating")
      .eq("game_id", gameId)
      .eq("wallet_address", walletAddress)
      .single()

    if (error) {
      // No rating found
      return NextResponse.json({ userRating: null })
    }

    return NextResponse.json({ userRating: rating?.rating || null })
  } catch (error) {
    console.error("[v0] Error in get user rating:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
