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
      <div className="relative min-h-screen pb-20 bg-[#F5F3F0]">
        <div className="pt-4">
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
    <div className="relative min-h-screen pb-20 bg-gradient-to-b from-[#E8D5F2] via-[#E8D5F2]/50 to-white max-w-[100vw] overflow-x-hidden">
      {/* Profile Header with Statistics */}
      <div className="pt-4">
        <ProfileHeader />
      </div>
      
      {/* Recommended Games Section */}
      <main className="relative z-10 px-5 mt-6">
        <h2 className="text-[28px] font-bold text-gray-900 text-center mb-5 leading-tight tracking-tight">
          Recommended games
        </h2>
        
        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6 justify-center">
          {categories.slice(0, 3).map((category, index) => (
            <div 
              key={category}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
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

        {/* Games Grid - 2 columns with proper spacing */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {games.slice(0, 6).map((game) => (
            <MobileGameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}