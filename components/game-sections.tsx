import { createServerClient } from "@/lib/supabase-server"
import { GameGrid } from "@/components/game-grid-mobile"
import { CTAButtons } from "@/components/cta-buttons"

export async function GameSections() {
  const supabase = createServerClient()

  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error || !games || games.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4">🍌</div>
        <p className="text-muted-foreground text-lg">No games available yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Check back soon for fresh bananas!</p>
      </div>
    )
  }

  const topBananas = games.slice(0, 6)
  const freshPicks = games.slice(6, 12)
  const strategyGames = games.filter((g) => g.category === "Strategy").slice(0, 6)

  return (
    <div className="space-y-8 pb-6 pt-4">
      {/* Top Bananas Section */}
      <section className="space-y-4">
        <div className="px-4 flex items-center gap-3">
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,51,230,0.5)]">🔥</span>
          <h2 className="text-xl font-black text-secondary">Top Bananas</h2>
        </div>
        <GameGrid games={topBananas} />
      </section>

      {/* CTA Buttons with banana theme */}
      <CTAButtons />

      {/* Fresh Picks Section */}
      {freshPicks.length > 0 && (
        <section className="space-y-4">
          <div className="px-4 flex items-center gap-3">
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,226,71,0.5)]">✨</span>
            <h2 className="text-xl font-black text-primary">Fresh Picks</h2>
          </div>
          <GameGrid games={freshPicks} />
        </section>
      )}

      {/* Strategy Masters Section */}
      {strategyGames.length > 0 && (
        <section className="space-y-4">
          <div className="px-4 flex items-center gap-3">
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,51,230,0.5)]">🎯</span>
            <h2 className="text-xl font-black text-secondary">Strategy Masters</h2>
          </div>
          <GameGrid games={strategyGames} />
        </section>
      )}
    </div>
  )
}
