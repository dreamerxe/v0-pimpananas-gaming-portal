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
    <div className="pb-6">
      <div className="px-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-5 leading-tight tracking-tight">
          Recommended<br />games
        </h2>
        
        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4 justify-center">
          {categories.slice(0, 3).map((category, index) => (
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
      </div>

      {/* Games Grid - Show first game only for home preview */}
      <div className="px-5 flex justify-center">
        <div className="w-full max-w-sm">
          {games.slice(0, 1).map((game) => (
            <div key={game.id} className="mb-4">
              <MobileGameCard game={game} />
            </div>
          ))}
          
          {/* View All Games Button */}
          <button 
            onClick={() => window.location.href = '/games'}
            className="w-full text-center text-blue-500 font-semibold py-3 hover:underline"
          >
            View all games →
          </button>
        </div>
      </div>
    </div>
  )
}