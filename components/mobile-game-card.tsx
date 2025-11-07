"use client"

import { ThumbsUp, Eye, Flame } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
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

/* ===== Compact Game Card ===== */
export function MobileGameCard({ game }: { game: Game }) {
  const [likes, setLikes] = useState("0")
  const [views, setViews] = useState("0")
  const { isConnected, connect, address } = useWallet()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const likeCount = Math.floor(Math.random() * 6) + 93 // 93–98%
    const viewCount = Math.floor(Math.random() * 600) + 86
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

  const truncate = (t: string) => (t.length <= 16 ? t : t.slice(0, 14) + "…")

  return (
    <>
      {/* Wrapper keeps space for Play button */}
      <div className="relative w-full max-w-[160px] mx-auto pb-14">
        {/* Square Card */}
        <div
          className="
            relative w-full aspect-square
            flex flex-col items-center
            rounded-[22px]
            bg-gradient-to-b from-white via-[#F3F6FF] to-[#E9EFFF]
            shadow-[0_6px_18px_rgba(36,52,99,0.12)]
            ring-1 ring-black/5
            pt-8 pb-6 px-3
            transition-all duration-150
          "
        >
          {/* Game Icon */}
          <div className="absolute -top-8 w-[64px] h-[64px] rounded-[16px] overflow-hidden shadow-md ring-1 ring-black/10">
            <Image
              src={game.thumbnail_url || "/placeholder.svg"}
              alt={game.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Title */}
          <h3
            className="mt-1 w-full truncate text-center text-[13.5px] font-extrabold tracking-tight text-slate-900"
            title={game.title}
          >
            {truncate(game.title)}
          </h3>

          {/* Stats */}
          <div className="mt-1 mb-1 flex items-center justify-center gap-3 text-[11px]">
            <div className="flex items-center gap-1 text-slate-500">
              <ThumbsUp className="h-3 w-3 text-slate-400 fill-slate-400" />
              <span className="font-semibold text-slate-700">{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Eye className="h-3 w-3 text-slate-400" />
              <span className="font-semibold text-slate-700">{views}</span>
            </div>
          </div>

          {/* Flames */}
          <div className="mt-1 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <Flame
                key={i}
                className="h-[15px] w-[15px] text-[#FF7A1A] fill-[#FF7A1A]"
              />
            ))}
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="
              absolute left-1/2 -translate-x-1/2 -bottom-5
              h-9 w-[58%]
              rounded-full bg-[#4A7FE8] hover:bg-[#3F72E2] active:scale-[0.985]
              text-white text-[13px] font-bold
              shadow-[0_6px_14px_rgba(74,127,232,0.35)]
              ring-1 ring-black/5 z-10
              transition-all duration-150
            "
          >
            Play
          </button>
        </div>
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

/* ===== Compact Responsive Grid ===== */
export function MobileGameGrid({ games }: { games: Game[] }) {
  return (
    <div
      className="
        px-4
        grid
        grid-cols-2
        gap-x-3 sm:gap-x-4
        gap-y-20 sm:gap-y-24
        place-items-center
      "
    >
      {games.map((g) => (
        <MobileGameCard key={g.id} game={g} />
      ))}
    </div>
  )
}
