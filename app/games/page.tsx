import { createServerClient } from "@/lib/supabase-server"
import { MobileGameCard } from "@/components/mobile-game-card"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import { BackButton } from "@/components/back-button"

export default async function GamesPage() {
  const supabase = createServerClient()

  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error || !games || games.length === 0) {
    return (
      <div className="relative min-h-screen pb-20 bg-[#F5F3F0]">
        <MobileHeader />
        <div className="text-center py-16 px-4">
          <div className="text-6xl mb-4">🍌</div>
          <p className="text-gray-600 text-lg">No games available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for fresh bananas!</p>
        </div>
        <BottomNav />
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

  const categories = Object.keys(gamesByCategory)

  return (
    <div className="relative min-h-screen pb-20 bg-[#F5F3F0] max-w-[100vw] overflow-x-hidden">
      <MobileHeader />
      
      <main className="relative z-10 px-5 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <BackButton />
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
            All Games
          </h1>
        </div>
        
        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6">
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

        {/* Games Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {games.map((game) => (
            <MobileGameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
