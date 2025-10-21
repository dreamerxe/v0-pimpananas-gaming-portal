import ProfilePage from "@/components/profile-page"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"

export default function Profile() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-card">
      <MobileHeader />
      <ProfilePage />
      <BottomNav />
    </div>
  )
}