"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTelegram } from "@/hooks/use-telegram"
import { useWallet } from "@/hooks/use-wallet"
import { useUserBalance } from "@/hooks/use-user-balance"
import { useRouter } from "next/navigation"
import { Coins } from "lucide-react"

export function ProfileHeader() {
  const { user, isTelegram } = useTelegram()
  const { address } = useWallet()
  const { balance } = useUserBalance()
  const router = useRouter()

  const displayName =
    isTelegram && user?.username ? `@${user.username}` : address ? `@${address.slice(2, 10)}` : "@littlebear0213"

  return (
    <div className="px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-[28px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3.5">
            <div
              className="cursor-pointer transition-transform active:scale-95"
              onClick={() => router.push("/settings")}
            >
              <Avatar className="h-[72px] w-[72px] border-[3px] border-white shadow-lg ring-2 ring-orange-200/50">
                <AvatarImage src={user?.photo_url || "/placeholder.svg"} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white text-2xl font-black">
                  {isTelegram && user ? user.first_name?.[0] || "L" : "L"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-1 rounded-lg shadow-sm">
                  <Coins className="h-4 w-4 text-white" />
                </div>
                <span className="text-[22px] font-black text-gray-900">{balance.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Currency</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/shop")}
            className="text-sm font-bold text-[#4A7FE8] hover:text-[#3D6ED6] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            How to earn?
          </button>
        </div>

        <div className="inline-flex items-center bg-[#4A7FE8] text-white px-4 py-2 rounded-full text-[13px] font-bold shadow-sm">
          {displayName}
        </div>
      </div>
    </div>
  )
}
