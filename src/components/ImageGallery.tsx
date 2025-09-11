"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { GeneratedImage } from "@/app/page"

interface ImageGalleryProps {
  images: GeneratedImage[]
  onDownload: (imageUrl: string, prompt: string) => void
  showSingleImage?: boolean
}

export default function ImageGallery({ images, onDownload, showSingleImage = false }: ImageGalleryProps) {

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No images generated yet. Create your first AI masterpiece!</p>
      </div>
    )
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const gridClass = showSingleImage 
    ? "grid grid-cols-1"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

  return (
    <div className={gridClass}>
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/60 hover:border-purple-500/60 transition-all duration-300 shadow-lg"
        >
          {/* Image */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer">
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9572a4d9-ffc8-4c38-9f8e-02b231c23687.png"
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge variant="secondary" className="text-xs">
                    Click to expand
                  </Badge>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="p-4 space-y-2">
                  <p className="text-sm text-gray-300">{image.prompt}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(image.timestamp)}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Image Info & Actions */}
          <div className="p-3 space-y-3">
            <div>
              <p className="text-sm text-gray-300 line-clamp-2 mb-1">
                {image.prompt}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(image.timestamp)}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(image.imageUrl, image.prompt)}
                className="flex-1 bg-gray-800/60 border-gray-600 hover:bg-purple-600 hover:border-purple-500 text-white shadow-md"
              >
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(image.prompt)
                  // You could add a toast notification here
                }}
                className="flex-1 bg-gray-800/60 border-gray-600 hover:bg-blue-600 hover:border-blue-500 text-white shadow-md"
              >
                Copy Prompt
              </Button>
            </div>

            {image.systemPrompt && (
              <div className="pt-2 border-t border-slate-600/50">
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  Custom System Prompt
                </Badge>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}