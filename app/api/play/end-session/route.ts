import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { gameId, walletAddress } = await request.json()

    if (!gameId || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Find the most recent play session that hasn't ended
    const { data: plays, error: fetchError } = await supabase
      .from("plays")
      .select("*")
      .eq("game_id", gameId)
      .eq("wallet_address", walletAddress)
      .is("ended_at", null)
      .order("started_at", { ascending: false })
      .limit(1)

    if (fetchError || !plays || plays.length === 0) {
      return NextResponse.json({ error: "No active session found" }, { status: 404 })
    }

    const play = plays[0]
    const endedAt = new Date()
    const startedAt = new Date(play.started_at)
    const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000)

    // Update play session
    const { error: updateError } = await supabase
      .from("plays")
      .update({
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
      })
      .eq("id", play.id)

    if (updateError) {
      console.error("[v0] Error ending play session:", updateError)
      return NextResponse.json({ error: "Failed to end session" }, { status: 500 })
    }

    return NextResponse.json({ success: true, durationSeconds })
  } catch (error) {
    console.error("[v0] Error in end-session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
