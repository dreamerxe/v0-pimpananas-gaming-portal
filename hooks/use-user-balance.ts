"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { createClient } from "@/lib/supabase-client"

export function useUserBalance() {
  const { address, isConnected } = useWallet()
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected) {
      setBalance(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("user_balances")
        .select("balance")
        .eq("wallet_address", address)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // User doesn't exist, create with 0 balance
          const { error: insertError } = await supabase
            .from("user_balances")
            .insert({ wallet_address: address, balance: 0 })
          
          if (!insertError) {
            setBalance(0)
          }
        } else {
          console.error("Error fetching balance:", error)
        }
      } else {
        setBalance(data?.balance || 0)
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const refreshBalance = useCallback(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    balance,
    isLoading,
    refreshBalance,
  }
}
