"use client"

import { useState, useCallback } from "react"
import ImageGenerator from "@/components/ImageGenerator"
import GenerationHistory from "@/components/GenerationHistory"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  timestamp: number
  systemPrompt?: string
}

export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const handleImageGenerated = useCallback((image: GeneratedImage) => {
    setGeneratedImages(prev => [image, ...prev])
  }, [])

  const handlePromptSelect = useCallback((prompt: string) => {
    // This will be passed to ImageGenerator to set the prompt
    setIsHistoryOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Image Generator
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with advanced AI technology. 
            Create, explore, and download beautiful images in seconds.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Mobile History Button */}
          <div className="lg:hidden">
            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                  View History ({generatedImages.length})
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <GenerationHistory 
                  images={generatedImages}
                  onPromptSelect={handlePromptSelect}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop History Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <GenerationHistory 
                images={generatedImages}
                onPromptSelect={handlePromptSelect}
              />
            </div>
          </div>

          {/* Main Generator */}
          <div className="lg:col-span-3">
            <ImageGenerator 
              onImageGenerated={handleImageGenerated}
              generatedImages={generatedImages}
            />
          </div>
        </div>
      </div>
    </div>
  )
}