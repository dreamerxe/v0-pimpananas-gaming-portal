"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useTelegram } from "@/hooks/use-telegram"
import type { TelegramWebApp, WebAppUser } from "@/types/telegram-webapp"

interface TelegramContextType {
  webApp: TelegramWebApp | null
  user: WebAppUser | null
  isReady: boolean
  isTelegram: boolean
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
  isTelegram: false,
})

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram()

  return <TelegramContext.Provider value={telegram}>{children}</TelegramContext.Provider>
}

export function useTelegramContext() {
  return useContext(TelegramContext)
}
