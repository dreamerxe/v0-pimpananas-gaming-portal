import { GameSections } from "@/components/game-sections"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"

export default function HomePage() {
  return (
    <div className="relative min-h-screen pb-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 max-w-[100vw] overflow-x-hidden">
      <MobileHeader />
      <main className="relative z-10">
        <GameSections />
      </main>
      <BottomNav />
    </div>
  )
}