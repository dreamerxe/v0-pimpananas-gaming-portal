"use client"

import { useTonAddress, useTonWallet } from "@tonconnect/ui-react"
import { useEffect, useState } from "react"

export function WalletDebug() {
  const address = useTonAddress()
  const wallet = useTonWallet()
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const log = `[${new Date().toISOString()}] Wallet: ${wallet?.name || 'none'}, Address: ${address || 'none'}`
    setLogs(prev => [...prev.slice(-10), log])
  }, [wallet, address])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white text-xs p-2 max-h-32 overflow-auto">
      <div className="font-bold mb-1">Wallet Debug:</div>
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  )
}