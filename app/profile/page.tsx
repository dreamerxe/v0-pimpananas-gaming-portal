import ProfilePage from "@/components/profile-page"
import { BottomNav } from "@/components/bottom-nav"

export default function Profile() {
  return (
    <div className="relative min-h-screen pb-24 bg-gradient-to-b from-[#E8D5F2] via-[#E8D5F2]/50 to-white">
      <ProfilePage />
      <BottomNav />
    </div>
  )
}
