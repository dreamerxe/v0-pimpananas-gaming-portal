"use client"

import { useEffect, useState } from "react"
import type { TelegramWebApp, WebAppUser } from "@/types/telegram-webapp"

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<WebAppUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if running in Telegram
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp

      // Initialize Telegram WebApp
      tg.ready()
      tg.expand()

      setWebApp(tg)
      setUser(tg.initDataUnsafe.user || null)
      setIsReady(true)

      console.log("[v0] Telegram WebApp initialized", {
        platform: tg.platform,
        version: tg.version,
        user: tg.initDataUnsafe.user,
      })
    } else {
      // Not running in Telegram, set ready anyway for development
      setIsReady(true)
      console.log("[v0] Not running in Telegram environment")
    }
  }, [])

  return {
    webApp,
    user,
    isReady,
    isTelegram: !!webApp,
  }
}
