"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  const handleDisconnect = async () => {
    await tonConnectUI.disconnect()
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="relative z-20 border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl float-animation">🍌</div>
            <div>
              <h2 className="text-xl font-bold text-primary">PIMPANANAS</h2>
              <p className="text-xs text-muted-foreground">Web3 Gaming Portal</p>
            </div>
          </div>

          {address ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                  <Wallet className="mr-2 h-5 w-5" />
                  {formatAddress(address)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleDisconnect}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="ton-connect-button-wrapper">
              <TonConnectButton className="ton-connect-custom" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
