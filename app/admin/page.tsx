import { GameManagement } from "@/components/admin/game-management"
import { AdminStats } from "@/components/admin/admin-stats"
import { Header } from "@/components/header"
import { AnimatedBackground } from "@/components/animated-background"

export default function AdminPage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage games and view platform statistics</p>
        </div>

        <div className="space-y-8">
          <AdminStats />
          <GameManagement />
        </div>
      </main>
    </div>
  )
}
