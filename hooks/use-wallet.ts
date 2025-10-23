"use client"

import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { useMemo, useEffect, useRef, useState } from "react"

export function useWallet() {
  const address = useTonAddress()
  const wallet = useTonWallet()
  const [tonConnectUI] = useTonConnectUI()

  // derive connection status directly so it never goes stale
  const isConnected = useMemo(() => Boolean(wallet && address), [wallet, address])

  // debug / recovery: detect session changes in environments (Telegram webview) where events may not fire
  const [tick, setTick] = useState(0)
  const pollRef = useRef<number | null>(null)
  const prevSnapshotRef = useRef<string | null>(null)
  const reconnectAttemptedRef = useRef(false)

  useEffect(() => {
    const readTonconnectItems = () => {
      try {
        const keys = Object.keys(window.localStorage).filter(k => k.toLowerCase().includes("tonconnect"))
        const items: Record<string, string | null> = {}
        for (const k of keys) items[k] = window.localStorage.getItem(k)
        return { keys, items }
      } catch (e) {
        console.debug("[useWallet] localStorage read error", e)
        return { keys: [], items: {} as Record<string, string | null> }
      }
    }

    const logSessionKeys = () => {
      const { keys, items } = readTonconnectItems()
      console.debug("[useWallet] localStorage tonconnect keys:", keys, items)
    }

    const onStorage = (ev: StorageEvent) => {
      if (!ev.key) return
      if (ev.key.toLowerCase().includes("tonconnect")) {
        console.debug("[useWallet][storage] tonconnect key changed", ev.key, { old: ev.oldValue, new: ev.newValue })
        setTick(t => t + 1)
      }
    }

    const onFocus = () => {
      console.debug("[useWallet][focus] window focused — re-checking tonconnect keys and hook state", { wallet, address })
      logSessionKeys()
      setTick(t => t + 1)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.debug("[useWallet][visibility] visible — re-checking session")
        
        // Force refresh connection status when returning to app
        const { items } = readTonconnectItems()
        const hasConnection = Object.keys(items).some(k => 
          items[k] && items[k]?.includes('"account"')
        )
        
        if (hasConnection && !wallet && !reconnectAttemptedRef.current) {
          console.debug("[useWallet][visibility] Found connection data but no wallet, attempting restore...")
          reconnectAttemptedRef.current = true
          tonConnectUI?.connectionRestored?.then(() => {
            console.debug("[useWallet][visibility] Connection restored")
            setTick(t => t + 1)
          }).catch(err => {
            console.error("[useWallet][visibility] Failed to restore connection", err)
          })
        }
        
        setTick(t => t + 1)
      }
    }

    // initial log
    console.debug("[useWallet] init:", { wallet, address, isConnected, tonConnectUI })
    logSessionKeys()

    // polling fallback for webviews that don't dispatch storage events (crucial for Telegram)
    pollRef.current = window.setInterval(() => {
      const { keys, items } = readTonconnectItems()
      const snapshot = JSON.stringify({ keys, items })
      // if snapshot changed since last poll, trigger a tick so hooks update
      if (prevSnapshotRef.current !== snapshot) {
        console.debug("[useWallet][poll] tonconnect snapshot changed")
        prevSnapshotRef.current = snapshot
        setTick(t => t + 1)
      }
    }, 1000) // 1 second polling for Telegram

    window.addEventListener("storage", onStorage)
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibilityChange)

    // Telegram-specific: listen for viewportChanged
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const onViewportChanged = () => {
        console.debug("[useWallet][telegram] viewport changed")
        setTick(t => t + 1)
      }
      window.Telegram.WebApp.onEvent('viewportChanged', onViewportChanged)
      
      return () => {
        window.removeEventListener("storage", onStorage)
        window.removeEventListener("focus", onFocus)
        document.removeEventListener("visibilitychange", onVisibilityChange)
        window.Telegram?.WebApp?.offEvent('viewportChanged', onViewportChanged)
        if (pollRef.current) window.clearInterval(pollRef.current)
      }
    }

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [tonConnectUI, wallet, address])

  const connect = async () => {
    try {
      if (!tonConnectUI?.openModal) {
        console.warn("[useWallet] tonConnectUI not ready")
        return
      }
      
      // Check if we're in Telegram
      const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp?.platform
      
      console.debug("[useWallet] Opening wallet connection modal...", { 
        isTelegram,
        platform: window.Telegram?.WebApp?.platform,
        hasWallet: !!wallet,
        hasAddress: !!address
      })
      
      // Reset reconnect flag
      reconnectAttemptedRef.current = false
      
      await tonConnectUI.openModal()
      
      console.debug("[useWallet] Modal opened successfully")
    } catch (error) {
      console.error("[useWallet] Error connecting wallet:", error)
    }
  }

  const disconnect = async () => {
    try {
      if (!tonConnectUI?.disconnect) {
        console.warn("[useWallet] tonConnectUI not ready")
        return
      }
      
      reconnectAttemptedRef.current = false
      
      await tonConnectUI.disconnect()
      
      console.debug("[useWallet] Disconnected successfully")
    } catch (error) {
      console.error("[useWallet] Error disconnecting wallet:", error)
    }
  }

  return {
    address,
    wallet,
    isConnected,
    connect,
    disconnect,
  }
}