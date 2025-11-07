import { createServerClient } from "@/lib/supabase-server"
import { MobileGameCard } from "@/components/mobile-game-card"
import { ProfileHeader } from "@/components/profile-header"
import { BottomNav } from "@/components/bottom-nav"

export default async function HomePage() {
  const supabase = createServerClient()

  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error || !games || games.length === 0) {
    return (
      <div className="relative min-h-screen pb-20 bg-gradient-to-b from-purple-200 via-purple-100 to-white">
        <div className="pt-12 pb-6">
          <ProfileHeader />
        </div>
        <div className="text-center py-16 px-4">
          <div className="text-6xl mb-4">🍌</div>
          <p className="text-gray-600 text-lg">No games available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for fresh bananas!</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  // Map categories to emojis matching the design
  const categoryEmojis: Record<string, string> = {
    "Survival": "⭐",
    "Action": "👊",
    "Collector": "💎",
    "Racing": "🏎️",
    "Puzzle": "🧩",
    "Arcade": "🕹️",
    "Casual": "✨",
    "Strategy": "🎯",
    "Sports": "⚽",
    "Adventure": "🗺️",
    "Other": "🎮"
  }

  // Get unique categories from games
  const categories = Array.from(new Set(games.map(game => game.category || "Other")))

  return (
    <div className="relative min-h-screen pb-20 bg-gradient-to-b from-purple-200 via-purple-100 to-white max-w-[100vw] overflow-x-hidden">
      {/* Profile Header with Statistics - Shows real data only */}
      <div className="pt-12 pb-6">
        <ProfileHeader />
      </div>
      
      {/* Recommended Games Section */}
      <main className="relative z-10 px-5">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Recommended games
        </h2>
        
        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6 justify-center">
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

        {/* More popular above button */}
        <button className="flex items-center justify-center gap-2 w-full py-2 mb-4 text-sm text-gray-600 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          More popular above
        </button>

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