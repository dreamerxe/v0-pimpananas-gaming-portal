"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { GameList } from "@/components/admin/game-list"
import { GameForm } from "@/components/admin/game-form"
import { createClient } from "@/lib/supabase-client"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  encrypted_game_url: string
  category: string
  is_active: boolean
  created_at: string
}

export function GameManagement() {
  const [games, setGames] = useState<Game[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("games").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching games:", error)
    } else {
      setGames(data || [])
    }
    setIsLoading(false)
  }

  const handleAddGame = () => {
    setEditingGame(null)
    setIsFormOpen(true)
  }

  const handleEditGame = (game: Game) => {
    setEditingGame(game)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingGame(null)
    fetchGames()
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Game Management</CardTitle>
        <Button onClick={handleAddGame} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Game
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading games...</div>
        ) : (
          <GameList games={games} onEdit={handleEditGame} onRefresh={fetchGames} />
        )}
      </CardContent>

      {isFormOpen && <GameForm game={editingGame} onClose={handleFormClose} />}
    </Card>
  )
}
