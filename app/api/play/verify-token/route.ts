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

export async function POST(request: Request) {
  try {
    const { token, gameId } = await request.json()

    if (!token || !gameId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Fetch token from database
    const { data: playToken, error: tokenError } = await supabase
      .from("play_tokens")
      .select("*")
      .eq("token", token)
      .eq("game_id", gameId)
      .single()

    if (tokenError || !playToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if token is expired
    if (new Date(playToken.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 })
    }

    // Check if token has been used
    if (playToken.used) {
      return NextResponse.json({ error: "Token already used" }, { status: 401 })
    }

    const [tokenPart, signature] = token.split(".")
    const secret = process.env.PLAY_TOKEN_SECRET || "default-secret-change-in-production"
    const expectedSignature = await generateHmac(`${tokenPart}:${gameId}:${playToken.wallet_address}`, secret)

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid token signature" }, { status: 401 })
    }

    // Mark token as used
    await supabase.from("play_tokens").update({ used: true }).eq("token", token)

    // Get game URL (decrypt in production)
    const { data: game } = await supabase.from("games").select("encrypted_game_url").eq("id", gameId).single()

    return NextResponse.json({
      valid: true,
      gameUrl: game?.encrypted_game_url || "",
      walletAddress: playToken.wallet_address,
    })
  } catch (error) {
    console.error("[v0] Error in verify-token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
