/**
 * API client utilities for image generation
 */

export interface GenerateImageRequest {
  prompt: string
  systemPrompt?: string
}

export interface GenerateImageResponse {
  success: boolean
  imageUrl: string
  prompt: string
  systemPrompt?: string
  timestamp: number
}

export interface APIError {
  error: string
  status?: number
}

/**
 * Generates an image using the AI API
 */
export async function generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to generate image`)
  }

  return data
}

/**
 * Validates a prompt before sending to API
 */
export function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || typeof prompt !== "string") {
    return { isValid: false, error: "Prompt is required" }
  }

  const trimmedPrompt = prompt.trim()
  
  if (trimmedPrompt.length === 0) {
    return { isValid: false, error: "Prompt cannot be empty" }
  }

  if (trimmedPrompt.length > 1000) {
    return { isValid: false, error: "Prompt is too long (max 1000 characters)" }
  }

  // Check for potentially problematic content
  const prohibitedTerms = ["nsfw", "nude", "explicit", "violence", "gore"]
  const lowerPrompt = trimmedPrompt.toLowerCase()
  
  for (const term of prohibitedTerms) {
    if (lowerPrompt.includes(term)) {
      return { isValid: false, error: "Prompt contains prohibited content" }
    }
  }

  return { isValid: true }
}

/**
 * Enhances a prompt with additional context
 */
export function enhancePrompt(prompt: string, style?: string): string {
  let enhanced = prompt.trim()

  // Add quality modifiers if not already present
  const qualityTerms = ["high quality", "detailed", "4k", "hd", "professional"]
  const hasQuality = qualityTerms.some(term => enhanced.toLowerCase().includes(term))
  
  if (!hasQuality) {
    enhanced += ", high quality, detailed"
  }

  // Add style if specified
  if (style && !enhanced.toLowerCase().includes(style.toLowerCase())) {
    enhanced += `, ${style} style`
  }

  return enhanced
}

/**
 * Parses API errors and returns user-friendly messages
 */
export function parseAPIError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      return "Request timed out. The AI service might be busy. Please try again."
    }
    
    if (error.message.includes("fetch")) {
      return "Network error. Please check your connection and try again."
    }
    
    if (error.message.includes("400")) {
      return "Invalid request. Please check your prompt and try again."
    }
    
    if (error.message.includes("429")) {
      return "Too many requests. Please wait a moment and try again."
    }
    
    if (error.message.includes("500")) {
      return "Server error. The AI service is temporarily unavailable."
    }
    
    return error.message
  }
  
  return "An unexpected error occurred. Please try again."
}

/**
 * Retries a failed request with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      
      if (i === maxRetries - 1) {
        throw lastError
      }
      
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}