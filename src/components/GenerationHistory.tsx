"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GeneratedImage } from "@/app/page"

interface GenerationHistoryProps {
  images: GeneratedImage[]
  onPromptSelect: (prompt: string) => void
}

export default function GenerationHistory({ images, onPromptSelect }: GenerationHistoryProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="border-purple-500/30 bg-slate-900/80 backdrop-blur-sm h-fit shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center justify-between">
          Generation History
          <Badge variant="secondary" className="bg-purple-600 text-white">
            {images.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No generations yet</p>
            <p className="text-xs mt-1">Your history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group p-3 rounded-lg border border-gray-700/60 hover:border-purple-500/60 transition-all duration-200 bg-gray-800/40 shadow-md"
              >
                {/* Thumbnail */}
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={image.imageUrl}
                      alt={`Generated ${index + 1}`}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-600"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/86e023a6-4dc1-41f7-adf2-0b48c28c2c68.png"
                      }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 line-clamp-2 mb-1">
                      {image.prompt}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(image.timestamp)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-2 space-y-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onPromptSelect(image.prompt)}
                    className="w-full justify-start text-xs h-7 text-purple-300 hover:text-purple-200 hover:bg-purple-600/20"
                  >
                    Use This Prompt
                  </Button>
                  
                  {image.systemPrompt && (
                    <Badge variant="outline" className="text-xs text-gray-400 border-gray-600 w-full justify-center">
                      Custom System
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="pt-3 border-t border-slate-600/50">
            <p className="text-xs text-gray-500 text-center">
              {images.length} generation{images.length !== 1 ? 's' : ''} total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}