"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Loader2, Maximize2, Minimize2, RotateCcw, AlertCircle } from "lucide-react"
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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playDuration, setPlayDuration] = useState(0)

  // Track play duration
  useEffect(() => {
    if (!isOpen) {
      setPlayDuration(0)
      return
    }

    const interval = setInterval(() => {
      setPlayDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setGameUrl("")
      setError("")
      return
    }

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
        toast.success("🎮 Game loaded successfully!")
      } catch (err) {
        console.error("[GamePlayer] Error initializing game:", err)
        setError("Failed to load game. Please try again.")
        toast.error("❌ Failed to load game")
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
      
      const minutes = Math.floor(playDuration / 60)
      const seconds = playDuration % 60
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
      toast.success(`🎮 Play session ended. Duration: ${timeStr}`)
    } catch (err) {
      console.error("[GamePlayer] Error ending session:", err)
    }

    setGameUrl("")
    setError("")
    onClose()
  }

  const toggleFullscreen = () => {
    const elem = document.documentElement
    
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      }
      setIsFullscreen(true)
      toast.success("🎮 Fullscreen mode enabled")
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      setIsFullscreen(false)
      toast.success("🎮 Fullscreen mode disabled")
    }
  }

  const handleReload = () => {
    setIsLoading(true)
    setError("")
    // Reload by re-fetching
    const iframe = document.querySelector('iframe')
    if (iframe) {
      iframe.src = iframe.src
    }
    setTimeout(() => setIsLoading(false), 1000)
    toast.success("🔄 Game reloaded")
  }

  const formatPlayTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-[98vw] max-h-[98vh] h-[98vh] p-0 bg-black border-primary/50 shadow-2xl shadow-primary/20"
        showCloseButton={false}
      >
        <div className="relative w-full h-full flex flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-md border-b border-primary/30 shadow-lg">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-primary truncate">{gameTitle}</h2>
                <p className="text-xs text-muted-foreground">
                  Playing for {formatPlayTime(playDuration)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Reload Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReload}
                disabled={isLoading || !!error}
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                title="Reload game"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                title="Close game"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Game Content */}
          <div className="flex-1 relative bg-black">
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-card z-10">
                <div className="text-center space-y-6 px-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
                    <Loader2 className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-primary mb-2">🎮 Loading {gameTitle}...</p>
                    <p className="text-sm text-muted-foreground">Preparing your gaming experience</p>
                  </div>
                  <div className="flex gap-1 justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-card z-10">
                <div className="text-center space-y-6 px-4 max-w-md">
                  <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-destructive mb-2">❌ Oops! Something went wrong</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleReload} variant="outline">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={handleClose} variant="destructive">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Game iframe */}
            {!isLoading && !error && gameUrl && (
              <iframe
                src={gameUrl}
                className="w-full h-full border-0"
                title={gameTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}

            {/* No URL State */}
            {!isLoading && !error && !gameUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-card z-10">
                <div className="text-center space-y-6 px-4 max-w-md">
                  <div className="text-6xl mb-4">🍌</div>
                  <div>
                    <p className="text-xl font-bold text-primary mb-2">Game URL Not Available</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a demo environment. In production, encrypted game URLs would be decrypted and loaded here.
                    </p>
                  </div>
                  <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}