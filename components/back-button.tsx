"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  
  return (
    <button 
      onClick={() => router.back()}
      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
    >
      <ArrowLeft className="h-5 w-5 text-gray-700" />
    </button>
  )
}