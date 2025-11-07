import { GameSections } from "@/components/game-sections"
import { ProfileHeader } from "@/components/profile-header"
import { BottomNav } from "@/components/bottom-nav"

export default function HomePage() {
  return (
    <div className="relative min-h-screen pb-20 bg-gradient-to-b from-purple-200 via-purple-100 to-white max-w-[100vw] overflow-x-hidden">
      <div className="pt-12 pb-6">
        <ProfileHeader />
      </div>
      <main className="relative z-10">
        <GameSections />
      </main>
      <BottomNav />
    </div>
  )
}