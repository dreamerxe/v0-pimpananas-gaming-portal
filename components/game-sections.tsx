import { createServerClient } from "@/lib/supabase-server"
import { MobileGameCard } from "@/components/mobile-game-card"

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
        <p className="text-gray-600 text-lg">No games available yet.</p>
        <p className="text-sm text-gray-500 mt-2">Check back soon for fresh bananas!</p>
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
    <div className="pb-6 pt-6 bg-[#F5F3F0] min-h-screen">
      <div className="px-5 mb-6">
        <h1 className="text-[28px] font-bold text-gray-900 mb-5 leading-tight tracking-tight">Recommended games</h1>
        
        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
          {categories.map((category, index) => (
            <div 
              key={category}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                index === 0 
                  ? 'bg-white font-semibold text-gray-900 shadow-sm' 
                  : 'bg-white/70 font-medium text-gray-700'
              }`}
            >
              <span className="text-base">{categoryEmojis[category] || "🎮"}</span>
              <span className="text-[15px]">{category}</span>
            </div>
          ))}
        </div>

        {/* More popular above toggle */}
        <button className="flex items-center justify-center gap-2 text-[15px] text-gray-700 font-medium mb-6 mx-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          More popular above
        </button>
      </div>

      {/* Games Grid - 2 columns */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <MobileGameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  )
}