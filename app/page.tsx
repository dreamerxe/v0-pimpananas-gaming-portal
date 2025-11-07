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
      <div className="relative min-h-screen pb-20 bg-gradient-to-b from-gray-50 to-white">
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

  const categoryEmojis: Record<string, string> = {
    Survival: "⭐",
    Action: "🎯",
    Collector: "💎",
    Racing: "🏎️",
    Puzzle: "🧩",
    Arcade: "🕹️",
    Casual: "✨",
    Strategy: "♟️",
    Sports: "⚽",
    Adventure: "🗺️",
    Other: "🎮",
  }

  const categories = Array.from(new Set(games.map((game) => game.category || "Other")))

  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-[#E8E4F3] via-white to-gray-50 overflow-x-hidden">
      {/* Profile Header with Statistics */}
      <div className="pt-4">
        <ProfileHeader />
      </div>

      {/* Recommended Games Section */}
      <main className="relative z-10 px-4 mt-2">
        <h2 className="text-[32px] font-extrabold text-gray-900 mb-5 leading-none tracking-tight">Recommended games</h2>

        {/* Category Filter Tabs */}
        <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide mb-4 -mx-1 px-1">
          {categories.slice(0, 3).map((category, index) => (
            <button
              key={category}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 shadow-sm ${
                index === 0
                  ? "bg-white font-bold text-gray-900 scale-[1.02]"
                  : "bg-white/80 font-semibold text-gray-600"
              }`}
            >
              <span className="text-lg">{categoryEmojis[category] || "🎮"}</span>
              <span className="text-[15px]">{category}</span>
            </button>
          ))}
        </div>

        {/* More popular above indicator */}
        <div className="flex items-center justify-center gap-2 py-3 mb-4">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          <span className="text-sm font-semibold text-gray-600">More popular above</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4">
          {games.slice(0, 6).map((game) => (
            <MobileGameCard key={game.id} game={game} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
