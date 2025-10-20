"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface GamePlayerProps {
  gameId: string
  gameTitle: string
  walletAddress: string
  isOpen: boolean
  onClose: () => void
}

export function GamePlayer({ gameId, gameTitle, walletAddress, isOpen, onClose }: GamePlayerProps) {
  const [gameUrl, setGameUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!isOpen) return

    const initializeGame = async () => {
      setIsLoading(true)
      setError("")

      try {
        // Generate play token
        const tokenResponse = await fetch("/api/play/generate-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId, walletAddress }),
        })

        if (!tokenResponse.ok) {
          throw new Error("Failed to generate play token")
        }

        const { token } = await tokenResponse.json()

        // Verify token and get game URL
        const verifyResponse = await fetch("/api/play/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, gameId }),
        })

        if (!verifyResponse.ok) {
          throw new Error("Failed to verify token")
        }

        const { gameUrl: url } = await verifyResponse.json()
        setGameUrl(url)
      } catch (err) {
        console.error("[v0] Error initializing game:", err)
        setError("Failed to load game. Please try again.")
        toast.error("Failed to load game")
      } finally {
        setIsLoading(false)
      }
    }

    initializeGame()
  }, [isOpen, gameId, walletAddress])

  const handleClose = async () => {
    // End play session
    try {
      await fetch("/api/play/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, walletAddress }),
      })
    } catch (err) {
      console.error("[v0] Error ending session:", err)
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0 bg-black border-primary/50">
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm border-b border-border">
            <h2 className="text-xl font-bold text-primary">{gameTitle}</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-foreground hover:text-primary">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Game iframe */}
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading game...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                  <p className="text-destructive">{error}</p>
                  <Button onClick={handleClose}>Close</Button>
                </div>
              </div>
            )}

            {!isLoading && !error && gameUrl && (
              <iframe
                src={gameUrl}
                className="w-full h-full border-0"
                title={gameTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {!isLoading && !error && !gameUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Game URL not available</p>
                  <p className="text-sm text-muted-foreground">
                    {"This is a demo. In production, encrypted game URLs would be decrypted here."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
