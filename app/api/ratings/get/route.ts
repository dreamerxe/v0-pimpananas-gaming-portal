import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")

    if (!gameId) {
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get all ratings for the game
    const { data: ratings, error } = await supabase.from("ratings").select("rating").eq("game_id", gameId)

    if (error) {
      console.error("[v0] Error fetching ratings:", error)
      return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
    }

    if (!ratings || ratings.length === 0) {
      return NextResponse.json({ averageRating: 0, totalRatings: 0 })
    }

    // Calculate average rating
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
    const averageRating = sum / ratings.length

    return NextResponse.json({
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
    })
  } catch (error) {
    console.error("[v0] Error in get ratings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
