import { GameSections } from "@/components/game-sections"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"

export default function HomePage() {
  return (
    <div className="relative min-h-screen pb-20 bg-gradient-to-b from-background via-background to-card max-w-[100vw] overflow-x-hidden">
      <MobileHeader />
      <main className="relative z-10">
        <GameSections />
      </main>
      <BottomNav />
    </div>
  )
}
