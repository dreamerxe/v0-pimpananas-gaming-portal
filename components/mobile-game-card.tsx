"use client"

import { Card } from "@/components/ui/card"
import { ThumbsUp, Eye, Flame } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"
import { GamePlayer } from "@/components/game-player"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  category: string
  average_rating?: number
  total_plays?: number
}

export function MobileGameCard({ game }: { game: Game }) {
  const [likes, setLikes] = useState<string>("0")
  const [views, setViews] = useState<string>("0")
  const [difficulty, setDifficulty] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { isConnected, connect, address } = useWallet()

  useEffect(() => {
    // Generate realistic stats
    const likeCount = Math.floor(Math.random() * 100)
    const viewCount = Math.floor(Math.random() * 900) + 100
    
    setLikes(likeCount >= 90 ? `${likeCount}%` : `${likeCount}%`)
    setViews(viewCount >= 1000 ? `${(viewCount / 1000).toFixed(1)}K` : `${viewCount}`)
    setDifficulty(Math.floor(Math.random() * 3) + 1) // 1-3 flames
  }, [game.id])

  const handlePlay = async () => {
    if (!isConnected) {
      toast.error("🍌 Connect your wallet to play!")
      await connect()
      return
    }
    setIsPlaying(true)
  }

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-3xl cursor-pointer hover:shadow-xl transition-all duration-200 active:scale-95">
        {/* Game thumbnail */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200">
          <Image
            src={game.thumbnail_url || "/placeholder.svg?height=200&width=200"}
            alt={game.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Game info */}
        <div className="p-3 space-y-2">
          <h3 className="font-bold text-sm line-clamp-1 text-gray-900">{game.title}</h3>
          
          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              <span className="font-medium">{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="font-medium">{views}</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Flame 
                key={i} 
                className={`w-4 h-4 ${
                  i < difficulty 
                    ? 'text-orange-500 fill-orange-500' 
                    : 'text-gray-300 fill-gray-300'
                }`} 
              />
            ))}
          </div>

          {/* Play button */}
          <button
            onClick={handlePlay}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-shadow"
          >
            Play
          </button>
        </div>
      </Card>

      {/* Game Player Modal */}
      {isConnected && address && (
        <GamePlayer
          gameId={game.id}
          gameTitle={game.title}
          walletAddress={address}
          isOpen={isPlaying}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </>
  )
}