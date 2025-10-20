import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

async function generateHmac(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)

  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", key, messageData)
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function generateRandomToken(): Promise<string> {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function POST(request: Request) {
  try {
    const { gameId, walletAddress } = await request.json()

    if (!gameId || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verify game exists and is active
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .eq("is_active", true)
      .single()

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const token = await generateRandomToken()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    const secret = process.env.PLAY_TOKEN_SECRET || "default-secret-change-in-production"
    const signature = await generateHmac(`${token}:${gameId}:${walletAddress}`, secret)

    // Store token in database
    const { error: tokenError } = await supabase.from("play_tokens").insert({
      token: `${token}.${signature}`,
      game_id: gameId,
      wallet_address: walletAddress,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (tokenError) {
      console.error("[v0] Error creating play token:", tokenError)
      return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
    }

    // Create play session
    const { error: playError } = await supabase.from("plays").insert({
      game_id: gameId,
      wallet_address: walletAddress,
      started_at: new Date().toISOString(),
    })

    if (playError) {
      console.error("[v0] Error creating play session:", playError)
    }

    return NextResponse.json({
      token: `${token}.${signature}`,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in generate-token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
