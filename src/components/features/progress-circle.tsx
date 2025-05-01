"use client"

import { useEffect, useRef } from "react"

interface ProgressCircleProps {
  value: number
  maxValue: number
  size?: number
}

export default function ProgressCircle({ value, maxValue, size = 150 }: ProgressCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = size
    canvas.height = size

    // Calculate percentage
    const percentage = Math.min(value / maxValue, 1)

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4
    const lineWidth = size * 0.08

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#f3f4f6"
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Draw progress arc
    const startAngle = -0.5 * Math.PI // Start at top
    const endAngle = startAngle + 2 * Math.PI * percentage

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, "#f59e0b")
    gradient.addColorStop(0.5, "#ef4444")
    gradient.addColorStop(1, "#10b981")

    ctx.strokeStyle = gradient
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Draw text
    ctx.font = `bold ${size * 0.2}px sans-serif`
    ctx.fillStyle = "#1f2937"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(value.toString(), centerX, centerY)
  }, [value, maxValue, size])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={size} height={size}></canvas>
    </div>
  )
}
