"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  encrypted_game_url: string
  category: string
  is_active: boolean
}

interface GameFormProps {
  game: Game | null
  onClose: () => void
}

const categories = ["Action", "Racing", "Puzzle", "Arcade", "Casual", "Strategy", "Sports", "Adventure"]

export function GameForm({ game, onClose }: GameFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
    encrypted_game_url: "",
    category: "Action",
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title,
        description: game.description || "",
        thumbnail_url: game.thumbnail_url || "",
        encrypted_game_url: game.encrypted_game_url,
        category: game.category,
        is_active: game.is_active,
      })
    }
  }, [game])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.encrypted_game_url) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      if (game) {
        // Update existing game
        const { error } = await supabase.from("games").update(formData).eq("id", game.id)

        if (error) throw error
        toast.success("Game updated successfully")
      } else {
        // Create new game
        const { error } = await supabase.from("games").insert([formData])

        if (error) throw error
        toast.success("Game created successfully")
      }

      onClose()
    } catch (error) {
      console.error("[v0] Error saving game:", error)
      toast.error("Failed to save game")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{game ? "Edit Game" : "Add New Game"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter game title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter game description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="encrypted_game_url">
              Game URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="encrypted_game_url"
              value={formData.encrypted_game_url}
              onChange={(e) => setFormData({ ...formData, encrypted_game_url: e.target.value })}
              placeholder="Enter game URL (will be encrypted in production)"
              required
            />
            <p className="text-xs text-muted-foreground">In production, this URL will be encrypted for security</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-border"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active (visible to users)
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : game ? "Update Game" : "Create Game"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
