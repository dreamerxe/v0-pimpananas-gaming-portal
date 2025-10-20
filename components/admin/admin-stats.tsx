import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase-server"
import { Gamepad2, Star, Users, TrendingUp } from "lucide-react"

export async function AdminStats() {
  const supabase = createServerClient()

  // Fetch statistics
  const { data: games } = await supabase.from("games").select("id").eq("is_active", true)
  const { data: ratings } = await supabase.from("ratings").select("rating")
  const { data: plays } = await supabase.from("plays").select("id")
  const { data: recentPlays } = await supabase
    .from("plays")
    .select("wallet_address")
    .gte("started_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  const totalGames = games?.length || 0
  const totalRatings = ratings?.length || 0
  const averageRating = ratings?.length
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : "0.0"
  const totalPlays = plays?.length || 0
  const uniquePlayers = new Set(recentPlays?.map((p) => p.wallet_address)).size

  const stats = [
    {
      title: "Total Games",
      value: totalGames,
      icon: Gamepad2,
      description: "Active games",
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: Star,
      description: `${totalRatings} total ratings`,
    },
    {
      title: "Total Plays",
      value: totalPlays,
      icon: TrendingUp,
      description: "All time",
    },
    {
      title: "Active Players",
      value: uniquePlayers,
      icon: Users,
      description: "Last 24 hours",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
