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
    // Generate realistic stats matching reference (98%, 84.6K)
    const likeCount = Math.floor(Math.random() * 7) + 92 // 92-98%
    const viewCount = Math.floor(Math.random() * 600) + 86 // 86-686
    
    setLikes(`${likeCount}%`)
    setViews(`${(viewCount / 10).toFixed(1)}K`)
    setDifficulty(3) // Always 3 flames like reference
  }, [game.id])

  const handlePlay = async () => {
    if (!isConnected) {
      toast.error("🍌 Connect your wallet to play!")
      await connect()
      return
    }
    setIsPlaying(true)
  }

  // Truncate title like reference "Sonic Speed Si..."
  const truncateTitle = (title: string, maxLength: number = 16) => {
    if (title.length <= maxLength) return title
    return title.slice(0, maxLength) + "..."
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-purple-50 rounded-[24px] p-4 shadow-md hover:shadow-lg transition-all duration-200">
        {/* Game thumbnail with darker background */}
        <div className="relative w-full aspect-square mb-3 rounded-[20px] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm">
          <Image
            src={game.thumbnail_url || "/placeholder.svg?height=200&width=200"}
            alt={game.title}
            fill
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Game title - truncated with ... */}
        <h3 className="font-bold text-[15px] line-clamp-1 text-gray-900 mb-2 tracking-tight text-center">
          {truncateTitle(game.title)}
        </h3>
        
        {/* Stats row - compact spacing */}
        <div className="flex items-center justify-center gap-3 mb-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold">{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold">{views}</span>
          </div>
        </div>

        {/* Difficulty flames - centered and closer together */}
        <div className="flex gap-0.5 mb-3 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Flame 
              key={i} 
              className="w-4 h-4 text-orange-500 fill-orange-500"
            />
          ))}
        </div>

        {/* Play button - exact blue from reference */}
        <button
          onClick={handlePlay}
          className="w-full bg-[#2E7EF6] hover:bg-[#2563EB] active:scale-[0.98] text-white py-3 rounded-full font-bold text-[15px] shadow-md transition-all duration-150"
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