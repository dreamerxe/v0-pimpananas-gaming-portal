import { createServerClient } from "@/lib/supabase-server"
import { GameGrid } from "@/components/game-grid-mobile"

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

  // Map categories to emojis
  const categoryEmojis: Record<string, string> = {
    "Action": "👊",
    "Racing": "🏎️",
    "Puzzle": "🧩",
    "Arcade": "🕹️",
    "Casual": "✨",
    "Strategy": "🎯",
    "Sports": "⚽",
    "Adventure": "🗺️",
    "Other": "🎮"
  }

  // Get all categories
  const categories = Object.keys(gamesByCategory)

  return (
    <div className="pb-6 pt-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen">
      <div className="px-4 mb-4">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Recommended games</h2>
        
        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2">
          {categories.map((category, index) => (
            <div 
              key={category}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap shadow-sm transition-all ${
                index === 0 
                  ? 'bg-white font-semibold text-gray-900' 
                  : 'bg-white/60 font-medium text-gray-700 hover:bg-white/80'
              }`}
            >
              <span className="text-lg">{categoryEmojis[category] || "🎮"}</span>
              <span className="text-sm">{category}</span>
            </div>
          ))}
        </div>

        {/* More popular above toggle */}
        <button className="flex items-center justify-center gap-2 text-sm text-gray-600 font-medium mb-4 mx-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          More popular above
        </button>
      </div>

      {/* Games Grid - Show all games */}
      <div className="px-4">
        <GameGrid games={games} />
      </div>
    </div>
  )
}