"use client"

import { ThumbsUp, Users } from "lucide-react"
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
  const [isPlaying, setIsPlaying] = useState(false)
  const { isConnected, connect, address } = useWallet()

  useEffect(() => {
    // Generate realistic stats matching reference (98%, 84.6K)
    const likeCount = Math.floor(Math.random() * 7) + 92 // 92-98%
    const viewCount = Math.floor(Math.random() * 600) + 86 // 86-686

    setLikes(`${likeCount}%`)
    setViews(`${(viewCount / 10).toFixed(1)}K`)
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
      <div
        className="rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-200 flex flex-col items-center min-h-[320px]"
        style={{
          background: "linear-gradient(to bottom right, rgba(239, 246, 255, 0.9), white, rgba(239, 246, 255, 0.5))",
        }}
      >
        <div className="relative w-[120px] h-[120px] rounded-[24px] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-lg mb-5 mt-1">
          <Image
            src={game.thumbnail_url || "/placeholder.svg?height=200&width=200"}
            alt={game.title}
            fill
            className="object-cover"
            priority={false}
          />
        </div>

        <h3 className="font-bold text-[18px] text-gray-900 mb-4 tracking-tight text-center leading-tight px-2">
          {truncateTitle(game.title, 14)}
        </h3>

        <div className="flex items-center justify-center gap-6 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4 text-gray-400 fill-gray-400" />
            <span className="font-semibold text-gray-700">{likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-700">{views}</span>
          </div>
        </div>

        <div className="flex gap-1 mb-6 justify-center text-[24px]">🔥🔥🔥</div>

        <div className="flex-grow" />
        <button
          onClick={handlePlay}
          className="w-full bg-[#4A7FE8] hover:bg-[#3D6ED6] active:scale-[0.97] text-white py-4 rounded-full font-bold text-[17px] shadow-md hover:shadow-lg transition-all duration-150"
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
