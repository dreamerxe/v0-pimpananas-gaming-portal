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
        setTick(t => t + 1)
      }
    }

    // initial log
    console.debug("[useWallet] init:", { wallet, address, isConnected, tonConnectUI })
    logSessionKeys()

    // polling fallback for webviews that don't dispatch storage events
    pollRef.current = window.setInterval(() => {
      const { keys, items } = readTonconnectItems()
      const snapshot = JSON.stringify({ keys, items })
      // if snapshot changed since last poll, trigger a tick so hooks update
      if (prevSnapshotRef.current !== snapshot) {
        console.debug("[useWallet][poll] tonconnect snapshot changed")
        prevSnapshotRef.current = snapshot
        setTick(t => t + 1)
      } else {
        // still log occasionally for debugging
        console.debug("[useWallet][poll] no change")
      }
    }, 2000)

    window.addEventListener("storage", onStorage)
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  // tick intentionally omitted from deps; tick is only used to force re-render when events occur
  }, [tonConnectUI])

  const connect = async () => {
    try {
      if (!tonConnectUI?.openModal) {
        console.warn("[v0] tonConnectUI not ready")
        return
      }
      await tonConnectUI.openModal()
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
    }
  }

  const disconnect = async () => {
    try {
      if (!tonConnectUI?.disconnect) {
        console.warn("[v0] tonConnectUI not ready")
        return
      }
      await tonConnectUI.disconnect()
    } catch (error) {
      console.error("[v0] Error disconnecting wallet:", error)
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