import ProfilePage from "@/components/profile-page"
import { BottomNav } from "@/components/bottom-nav"

export default function Profile() {
  return (
    <div className="relative min-h-screen pb-24 bg-app-gradient page-fade">
      <div className="animate-in fade-in duration-300">
        <ProfilePage />
      </div>
      <BottomNav />
    </div>
  )
}
