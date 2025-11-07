"use client"

import { useRouter } from "next/navigation"

export function ViewAllGamesButton() {
  const router = useRouter()
  
  return (
    <button 
      onClick={() => router.push('/games')}
      className="w-full text-center text-blue-500 font-semibold py-3 hover:underline"
    >
      View all games →
    </button>
  )
}