"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState("fadeIn")

  useEffect(() => {
    setTransitionStage("fadeOut")
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionStage("fadeIn")
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div className={`${transitionStage === "fadeIn" ? "page-fade" : "opacity-0"} transition-opacity duration-150`}>
      {displayChildren}
    </div>
  )
}
