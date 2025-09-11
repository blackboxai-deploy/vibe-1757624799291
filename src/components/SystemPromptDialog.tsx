"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface SystemPromptDialogProps {
  systemPrompt: string
  onSystemPromptChange: (prompt: string) => void
}

export default function SystemPromptDialog({ systemPrompt, onSystemPromptChange }: SystemPromptDialogProps) {
  const [localPrompt, setLocalPrompt] = useState(systemPrompt)
  const [isOpen, setIsOpen] = useState(false)

  const presetPrompts = [
    {
      name: "Default",
      prompt: "Create a high-quality, detailed, and visually appealing image based on the user's description. Use vibrant colors and professional composition."
    },
    {
      name: "Photorealistic",
      prompt: "Generate a photorealistic, high-resolution image with natural lighting and realistic textures. Focus on accurate details and professional photography quality."
    },
    {
      name: "Artistic Style",
      prompt: "Create an artistic interpretation with creative styling, bold colors, and unique composition. Emphasize visual impact and creative expression."
    },
    {
      name: "Minimalist",
      prompt: "Design a clean, minimalist image with simple composition, limited color palette, and focus on essential elements. Emphasize clarity and simplicity."
    },
    {
      name: "Fantasy/Surreal",
      prompt: "Create a fantastical or surreal image with imaginative elements, dramatic lighting, and otherworldly atmosphere. Push creative boundaries."
    }
  ]

  const handleSave = () => {
    onSystemPromptChange(localPrompt)
    setIsOpen(false)
  }

  const handlePresetSelect = (preset: typeof presetPrompts[0]) => {
    setLocalPrompt(preset.prompt)
  }

  const handleReset = () => {
    const defaultPrompt = presetPrompts[0].prompt
    setLocalPrompt(defaultPrompt)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-purple-300 border-purple-500/50 hover:bg-purple-600/20">
          Customize AI Behavior
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Customize System Prompt</DialogTitle>
          <p className="text-sm text-gray-400 mt-2">
            The system prompt guides how the AI interprets and generates your images. 
            Customize it to achieve specific styles, quality levels, or artistic approaches.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Prompts */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Presets</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetPrompts.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(preset)}
                  className={`justify-start text-left h-auto py-2 px-3 ${
                    localPrompt === preset.prompt 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-slate-600 hover:border-purple-500/50'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {preset.prompt.slice(0, 80)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-prompt" className="text-sm font-medium">
                Custom System Prompt
              </Label>
              <Badge variant="secondary" className="text-xs">
                {localPrompt.length} characters
              </Badge>
            </div>
            <Textarea
              id="system-prompt"
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              placeholder="Enter your custom system prompt here..."
              className="min-h-[120px] bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400 shadow-inner"
            />
            <p className="text-xs text-gray-500">
              Tip: Be specific about style, quality, composition, colors, and mood for best results.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-slate-600 hover:border-red-500/50 hover:bg-red-500/20"
            >
              Reset to Default
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-slate-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Current Prompt Preview */}
          <div className="p-4 bg-gray-900/60 rounded-lg border border-gray-700/60 shadow-inner">
            <Label className="text-sm font-medium mb-2 block">Current Active Prompt</Label>
            <p className="text-sm text-gray-300 leading-relaxed">
              {systemPrompt}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}