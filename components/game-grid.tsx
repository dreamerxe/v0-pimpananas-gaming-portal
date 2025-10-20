import { GameCard } from "@/components/game-card"
import { createServerClient } from "@/lib/supabase-server"

export async function GameGrid() {
  const supabase = createServerClient()

  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching games:", error)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load games. Please try again later.</p>
      </div>
    )
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No games available yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
