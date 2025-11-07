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
  const truncateTitle = (title: string, maxLength = 16) => {
    if (title.length <= maxLength) return title
    return title.slice(0, maxLength) + "..."
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50/80 via-white to-purple-50/60 rounded-[22px] p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200">
        <div className="relative w-full aspect-square mb-2.5 rounded-[18px] overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 shadow-inner">
          <Image
            src={game.thumbnail_url || "/placeholder.svg?height=200&width=200"}
            alt={game.title}
            fill
            className="object-cover"
            priority={false}
          />
        </div>

        <h3 className="font-extrabold text-[15px] line-clamp-1 text-gray-900 mb-2 tracking-tight">
          {truncateTitle(game.title, 14)}
        </h3>

        <div className="flex items-center justify-center gap-3 mb-2 text-xs">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-gray-400 fill-gray-400" />
            <span className="font-bold text-gray-700">{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-gray-700">{views}</span>
          </div>
        </div>

        <div className="flex gap-1 mb-3 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Flame key={i} className="w-[18px] h-[18px] text-orange-500 fill-orange-500" />
          ))}
        </div>

        <button
          onClick={handlePlay}
          className="w-full bg-[#4A7FE8] hover:bg-[#3D6ED6] active:scale-[0.96] text-white py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150"
        >
          Play
        </button>
      </div>

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
