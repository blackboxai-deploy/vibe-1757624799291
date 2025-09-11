/**
 * Utility functions for image processing and handling
 */

/**
 * Downloads an image from a URL and saves it with a specified filename
 */
export async function downloadImage(imageUrl: string, filename: string): Promise<void> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // Clean up the object URL
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading image:", error)
    throw error
  }
}

/**
 * Generates a safe filename from a prompt
 */
export function generateFilename(prompt: string, extension: string = "png"): string {
  // Clean the prompt to create a safe filename
  const cleanPrompt = prompt
    .slice(0, 50) // Limit length
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .toLowerCase()
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, "")
  return `ai-generated-${cleanPrompt}-${timestamp}.${extension}`
}

/**
 * Validates if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname.toLowerCase()
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(pathname) || 
           url.includes("image") || 
           url.includes("img")
  } catch {
    return false
  }
}

/**
 * Preloads an image to ensure it's cached
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error("Failed to preload image"))
    img.src = url
  })
}

/**
 * Gets image dimensions from URL
 */
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = url
  })
}

/**
 * Copies an image URL to clipboard
 */
export async function copyImageUrl(url: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(url)
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    const textArea = document.createElement("textarea")
    textArea.value = url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }
}

/**
 * Shares image using Web Share API if available
 */
export async function shareImage(imageUrl: string, title: string): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `Check out this AI-generated image: ${title}`,
        url: imageUrl
      })
    } catch (error) {
      console.error("Error sharing image:", error)
      // Fallback to copying URL
      await copyImageUrl(imageUrl)
    }
  } else {
    // Fallback to copying URL
    await copyImageUrl(imageUrl)
  }
}