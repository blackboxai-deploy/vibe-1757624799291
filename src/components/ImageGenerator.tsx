"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Label } from "@/components/ui/label"
import LoadingSpinner from "./LoadingSpinner"
import ImageGallery from "./ImageGallery"
import SystemPromptDialog from "./SystemPromptDialog"
import { GeneratedImage } from "@/app/page"

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void
  generatedImages: GeneratedImage[]
}

export default function ImageGenerator({ onImageGenerated, generatedImages }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("Create a high-quality, detailed, and visually appealing image based on the user's description. Use vibrant colors and professional composition.")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const suggestedPrompts = [
    "A mystical forest with glowing mushrooms and ethereal light rays",
    "Futuristic cyberpunk city at night with neon lights reflection on wet streets",
    "Majestic mountain landscape during golden hour with dramatic clouds",
    "Abstract digital art with flowing geometric patterns in vibrant colors",
    "Vintage steampunk mechanical contraption with brass gears and steam",
    "Serene japanese garden with cherry blossoms and traditional architecture"
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate an image")
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentImage(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          systemPrompt: systemPrompt.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      const newImage: GeneratedImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        timestamp: data.timestamp,
        systemPrompt: data.systemPrompt
      }

      setCurrentImage(newImage)
      onImageGenerated(newImage)

    } catch (error) {
      console.error("Generation error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
    textareaRef.current?.focus()
  }

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-generated-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Generator Card */}
      <Card className="border-purple-500/30 bg-slate-900/80 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
            Generate New Image
            <SystemPromptDialog 
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-white font-medium">
              Describe your image
            </Label>
            <Textarea
              ref={textareaRef}
              id="prompt"
              placeholder="Enter your creative prompt here... Be as detailed as you want!"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400 shadow-inner"
              disabled={isGenerating}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Generating Amazing Image...</span>
              </div>
            ) : (
              "Generate Image"
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Prompts */}
      <Card className="border-purple-500/30 bg-slate-900/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Prompt Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-purple-600 hover:text-white transition-colors bg-gray-800 text-gray-300 px-3 py-1 shadow-md"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Generated Image */}
      {currentImage && (
        <Card className="border-purple-500/30 bg-slate-900/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Latest Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGallery 
              images={[currentImage]} 
              onDownload={handleDownload}
              showSingleImage={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Recent Generations Gallery */}
      {generatedImages.length > 0 && (
        <Card className="border-purple-500/30 bg-slate-900/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGallery 
              images={generatedImages.slice(0, 6)} 
              onDownload={handleDownload}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}