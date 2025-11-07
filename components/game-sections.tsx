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

  // Group games by category
  const gamesByCategory = games.reduce((acc, game) => {
    const category = game.category || "Other"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(game)
    return acc
  }, {} as Record<string, typeof games>)

  // Define section icons and colors
  const categoryIcons: Record<string, { emoji: string; colorClass: string; title: string }> = {
    "Action": { emoji: "🔥", colorClass: "text-secondary", title: "Action Games" },
    "Racing": { emoji: "🏎️", colorClass: "text-primary", title: "Racing Games" },
    "Puzzle": { emoji: "🧩", colorClass: "text-secondary", title: "Puzzle Games" },
    "Arcade": { emoji: "🕹️", colorClass: "text-primary", title: "Arcade Games" },
    "Casual": { emoji: "✨", colorClass: "text-secondary", title: "Casual Games" },
    "Strategy": { emoji: "🎯", colorClass: "text-primary", title: "Strategy Masters" },
    "Sports": { emoji: "⚽", colorClass: "text-secondary", title: "Sports Games" },
    "Adventure": { emoji: "🗺️", colorClass: "text-primary", title: "Adventure Games" },
    "Other": { emoji: "🎮", colorClass: "text-secondary", title: "More Games" }
  }

  // Get top 9 games for featured section (Top Bananas)
  const topBananas = games.slice(0, 9)

  return (
    <div className="space-y-8 pb-6 pt-4">
      {/* Top Bananas Section - Featured/Most Recent */}
      <section className="space-y-4">
        <div className="px-4 flex items-center gap-3">
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,51,230,0.5)]">🔥</span>
          <h2 className="text-xl font-black text-secondary">Top Bananas</h2>
        </div>
        <GameGrid games={topBananas} />
      </section>

      {/* CTA Buttons with banana theme */}
      <CTAButtons />

      {/* Category Sections - Display all categories with games */}
      {Object.entries(gamesByCategory).map(([category, categoryGames]) => {
        const config = categoryIcons[category] || categoryIcons["Other"]
        
        return (
          <section key={category} className="space-y-4">
            <div className="px-4 flex items-center gap-3">
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,226,71,0.5)]">{config.emoji}</span>
              <h2 className={`text-xl font-black ${config.colorClass}`}>{config.title}</h2>
              <span className="text-sm text-muted-foreground">({categoryGames.length})</span>
            </div>
            <GameGrid games={categoryGames} />
          </section>
        )
      })}
    </div>
  )
}