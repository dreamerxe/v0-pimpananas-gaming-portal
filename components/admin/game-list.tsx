"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"
import Image from "next/image"

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

interface GameListProps {
  games: Game[]
  onEdit: (game: Game) => void
  onRefresh: () => void
}

export function GameList({ games, onEdit, onRefresh }: GameListProps) {
  const handleToggleActive = async (game: Game) => {
    const supabase = createClient()
    const { error } = await supabase.from("games").update({ is_active: !game.is_active }).eq("id", game.id)

    if (error) {
      console.error("[v0] Error toggling game status:", error)
      toast.error("Failed to update game status")
    } else {
      toast.success(`Game ${!game.is_active ? "activated" : "deactivated"}`)
      onRefresh()
    }
  }

  const handleDelete = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game? This action cannot be undone.")) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from("games").delete().eq("id", gameId)

    if (error) {
      console.error("[v0] Error deleting game:", error)
      toast.error("Failed to delete game")
    } else {
      toast.success("Game deleted successfully")
      onRefresh()
    }
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">No games found. Add your first game to get started.</div>
    )
  }

  return (
    <div className="rounded-md border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell>
                <div className="relative w-12 h-12 rounded overflow-hidden">
                  <Image
                    src={game.thumbnail_url || "/placeholder.svg"}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{game.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">{game.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{game.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={game.is_active ? "default" : "secondary"}
                  className={game.is_active ? "bg-primary" : ""}
                >
                  {game.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(game)}
                    title={game.is_active ? "Deactivate" : "Activate"}
                  >
                    {game.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(game)} title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(game.id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
