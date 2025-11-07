"use client"

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
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-[28px] p-4 shadow-sm">
        {/* Game thumbnail */}
        <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-white shadow-sm">
          <Image
            src={game.thumbnail_url || "/placeholder.svg?height=200&width=200"}
            alt={game.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Game title */}
        <h3 className="font-bold text-[15px] line-clamp-1 text-gray-900 mb-2 tracking-tight">
          {game.title}
        </h3>
        
        {/* Stats row */}
        <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="font-medium">{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-medium">{views}</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex gap-1 mb-3">
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
          className="w-full bg-[#5B8FF9] hover:bg-[#4A7FE8] active:bg-[#3A6FD7] text-white py-2.5 rounded-full font-semibold text-[15px] shadow-sm transition-colors"
        >
          Play
        </button>
      </div>

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