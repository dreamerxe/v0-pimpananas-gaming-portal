import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { gameId, walletAddress, rating } = await request.json()

    if (!gameId || !walletAddress || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user already rated this game
    const { data: existingRating } = await supabase
      .from("ratings")
      .select("*")
      .eq("game_id", gameId)
      .eq("wallet_address", walletAddress)
      .single()

    if (existingRating) {
      // Update existing rating
      const { error: updateError } = await supabase
        .from("ratings")
        .update({ rating })
        .eq("game_id", gameId)
        .eq("wallet_address", walletAddress)

      if (updateError) {
        console.error("[v0] Error updating rating:", updateError)
        return NextResponse.json({ error: "Failed to update rating" }, { status: 500 })
      }

      return NextResponse.json({ success: true, updated: true })
    } else {
      // Insert new rating
      const { error: insertError } = await supabase.from("ratings").insert({
        game_id: gameId,
        wallet_address: walletAddress,
        rating,
      })

      if (insertError) {
        console.error("[v0] Error inserting rating:", insertError)
        return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 })
      }

      return NextResponse.json({ success: true, updated: false })
    }
  } catch (error) {
    console.error("[v0] Error in submit rating:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
