"use client"

import { useEffect, useRef } from "react"

interface Leaf {
  x: number
  y: number
  size: number
  speed: number
  rotation: number
  rotationSpeed: number
  color: string
}

export function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const leavesRef = useRef<Leaf[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create leaves
    const createLeaves = () => {
      const leaves: Leaf[] = []
      const leafColors = ["#e9c46a", "#f4a261", "#e76f51", "#d62828"]

      for (let i = 0; i < 30; i++) {
        leaves.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 15 + 5,
          speed: Math.random() * 1 + 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          color: leafColors[Math.floor(Math.random() * leafColors.length)],
        })
      }

      leavesRef.current = leaves
    }

    createLeaves()

    // Draw a leaf
    const drawLeaf = (leaf: Leaf) => {
      if (!ctx) return

      ctx.save()
      ctx.translate(leaf.x, leaf.y)
      ctx.rotate(leaf.rotation)

      ctx.beginPath()
      ctx.moveTo(0, -leaf.size / 2)
      ctx.bezierCurveTo(leaf.size / 2, -leaf.size / 4, leaf.size / 2, leaf.size / 4, 0, leaf.size / 2)
      ctx.bezierCurveTo(-leaf.size / 2, leaf.size / 4, -leaf.size / 2, -leaf.size / 4, 0, -leaf.size / 2)

      ctx.fillStyle = leaf.color
      ctx.fill()
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      leavesRef.current.forEach((leaf) => {
        leaf.y += leaf.speed
        leaf.rotation += leaf.rotationSpeed

        // Reset leaf position when it goes off screen
        if (leaf.y > canvas.height + leaf.size) {
          leaf.y = -leaf.size
          leaf.x = Math.random() * canvas.width
        }

        drawLeaf(leaf)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
}
