"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface CaptchaProps {
  onVerify: (verified: boolean) => void
  isEnabled?: boolean // to check if roll no is filled or not (if not verify disable)
}

const Captcha = ({ onVerify, isEnabled = true }: CaptchaProps) => {
  const [captchaText, setCaptchaText] = useState("")
  const [userCaptchaInput, setUserCaptchaInput] = useState("")
  const [message, setMessage] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotated, setRotated] = useState(false);

  // Generate random 6-character string with upper and lowercase letters
  const generateRandomString = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Draw CAPTCHA on canvas with visual noise and effects
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 180
    canvas.height = 48

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#f0f0f0")
    gradient.addColorStop(1, "#e0e0e0")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add background noise (random dots)
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2)
    }

    // Add random lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
      ctx.lineWidth = Math.random() * 2 + 1
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    // Draw each character with random effects
    const charWidth = canvas.width / 6
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const x = i * charWidth + charWidth / 2
      const y = canvas.height / 2

      // Random font size and style
      const fontSize = 20 + Math.random() * 10
      const fonts = ["Arial", "Times", "Courier", "Helvetica", "Georgia"]
      const font = fonts[Math.floor(Math.random() * fonts.length)]

      ctx.font = `${fontSize}px ${font}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Random color
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`

      // Save context for rotation
      ctx.save()

      // Random rotation (-15 to 15 degrees)
      const rotation = (Math.random() - 0.5) * 0.5
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Draw character with shadow effect
      ctx.shadowColor = "rgba(0,0,0,0.3)"
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      ctx.fillText(char, 0, 0)

      // Restore context
      ctx.restore()
    }

    // Add more visual noise on top
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }
  }

  // Generate captcha when component loads
  useEffect(() => {
    generateCaptcha()
  }, [])

  // Generate new captcha
  const generateCaptcha = () => {
    const random = generateRandomString()
    setCaptchaText(random)
    setUserCaptchaInput("")
    setMessage("")
    onVerify(false)

    // added so that new captha can be generated if user click frequently
    setTimeout(() => {
      drawCaptcha(random)
    }, 50)
  }

  // Verify captcha
  const verifyCaptcha = () => {
    if (!captchaText) {
      setMessage("CAPTCHA has expired. Generating a new one.")
      generateCaptcha()
      return false
    } else if (userCaptchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      setMessage("Invalid CAPTCHA text. Please try again.")
      generateCaptcha()
      return false
    } else {
      setMessage("CAPTCHA verified successfully!")
      onVerify(true)
      return true
    }
  }

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault()
    verifyCaptcha()
  }

  // Prevent right-click context menu on canvas
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  // Prevent drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <canvas
            ref={canvasRef}
            width={180}
            height={48}
            className="h-12 border rounded-lg shadow-sm"
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          />
        </div>
        <div className="flex-grow">
          <input
            type="text"
            required
            placeholder="Enter CAPTCHA"
            value={userCaptchaInput}
            onChange={(e) => setUserCaptchaInput(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={generateCaptcha} className="text-sm text-blue-500 hover:text-blue-600 p-2">
          <img
            src="/loading-arrow.png"
            alt="Reload CAPTCHA"
            // className={`w-5 h-5 ${onclick=()=>{"rotate-180 transition-transform duration-300"}}`}
            onClick={() => setRotated(!rotated)}
            className={`w-5 h-5 transition-transform duration-300 cursor-pointer ${
              rotated ? "rotate-360" : "-rotate:360"
            }`}
          />
        </button>
        <button
          onClick={handleVerify}
          disabled={!isEnabled} // if there is no roll no
          className={`py-2 px-4 rounded-lg ${
            isEnabled ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition-all`}
        >
          Verify
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.includes("Invalid") || message.includes("expired")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {message}
        </div>
      )}

      <input type="hidden" name="randomString" value={captchaText} />
    </div>
  )
}

export default Captcha;
