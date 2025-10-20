"use client"

import { useState, useEffect } from "react"
import { RatingStars } from "@/components/rating-stars"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"

interface GameRatingProps {
  gameId: string
  gameTitle: string
}

export function GameRating({ gameId, gameTitle }: GameRatingProps) {
  const [averageRating, setAverageRating] = useState<number>(0)
  const [totalRatings, setTotalRatings] = useState<number>(0)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { address, isConnected } = useWallet()

  useEffect(() => {
    fetchRatings()
    if (isConnected && address) {
      fetchUserRating()
    }
  }, [gameId, address, isConnected])

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/ratings/get?gameId=${gameId}`)
      if (response.ok) {
        const data = await response.json()
        setAverageRating(data.averageRating)
        setTotalRatings(data.totalRatings)
      }
    } catch (error) {
      console.error("[v0] Error fetching ratings:", error)
    }
  }

  const fetchUserRating = async () => {
    if (!address) return

    try {
      const response = await fetch(`/api/ratings/user?gameId=${gameId}&walletAddress=${address}`)
      if (response.ok) {
        const data = await response.json()
        setUserRating(data.userRating)
        if (data.userRating) {
          setSelectedRating(data.userRating)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching user rating:", error)
    }
  }

  const handleSubmitRating = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    if (selectedRating === 0) {
      toast.error("Please select a rating")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/ratings/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          walletAddress: address,
          rating: selectedRating,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setUserRating(selectedRating)
        toast.success(data.updated ? "Rating updated!" : "Rating submitted!")
        setIsDialogOpen(false)
        fetchRatings() // Refresh average rating
      } else {
        toast.error("Failed to submit rating")
      }
    } catch (error) {
      console.error("[v0] Error submitting rating:", error)
      toast.error("Failed to submit rating")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openRatingDialog = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <RatingStars rating={averageRating} size="md" />
        <span className="text-sm font-semibold text-primary">{averageRating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({totalRatings})</span>
        {userRating && <span className="text-xs text-secondary ml-1">You rated: {userRating}</span>}
      </div>

      <Button variant="outline" size="sm" onClick={openRatingDialog} className="mt-2 bg-transparent">
        {userRating ? "Update Rating" : "Rate Game"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {gameTitle}</DialogTitle>
            <DialogDescription>{"How would you rate this game? Your feedback helps other players."}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <RatingStars rating={selectedRating} size="lg" interactive onRatingChange={setSelectedRating} />
              <p className="text-sm text-muted-foreground">
                {selectedRating === 0 && "Click to rate"}
                {selectedRating === 1 && "Poor"}
                {selectedRating === 2 && "Fair"}
                {selectedRating === 3 && "Good"}
                {selectedRating === 4 && "Very Good"}
                {selectedRating === 5 && "Excellent"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitRating} disabled={isSubmitting || selectedRating === 0} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Rating"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
