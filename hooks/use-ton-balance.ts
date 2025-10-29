"use client"

import { useState, useEffect } from "react"
import { useTonConnectUI } from "@tonconnect/ui-react"
import { useWallet } from "@/hooks/use-wallet"

export function useTonBalance() {
  const { address, isConnected } = useWallet()
  const [tonConnectUI] = useTonConnectUI()
  const [balance, setBalance] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!address || !isConnected) {
      setBalance("0")
      return
    }

    const fetchBalance = async () => {
      setIsLoading(true)
      try {
        // Fetch balance from TON blockchain
        const response = await fetch(
          `https://tonapi.io/v2/accounts/${address}`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        )

        if (response.ok) {
          const data = await response.json()
          // Convert from nanotons to TON (divide by 1,000,000,000)
          const tonBalance = (parseInt(data.balance) / 1000000000).toFixed(2)
          setBalance(tonBalance)
        } else {
          console.error("Failed to fetch TON balance")
          setBalance("0")
        }
      } catch (error) {
        console.error("Error fetching TON balance:", error)
        setBalance("0")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000)
    
    return () => clearInterval(interval)
  }, [address, isConnected])

  return {
    balance: parseFloat(balance),
    balanceFormatted: balance,
    isLoading
  }
}