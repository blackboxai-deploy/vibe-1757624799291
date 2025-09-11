import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemPrompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      )
    }

    // Construct the final prompt with system prompt if provided
    const finalPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser request: ${prompt}`
      : prompt

    // Call AI API using custom endpoint (no API keys required)
    const aiResponse = await fetch("https://oi-server.onrender.com/chat/completions", {
      method: "POST",
      headers: {
        "customerId": "cus_S16jfiBUH2cc7P",
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx"
      },
      body: JSON.stringify({
        model: "replicate/black-forest-labs/flux-1.1-pro",
        messages: [
          {
            role: "user",
            content: finalPrompt
          }
        ]
      }),
      signal: AbortSignal.timeout(300000) // 5 minute timeout
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error("AI API Error:", aiResponse.status, errorText)
      return NextResponse.json(
        { error: `AI service error: ${aiResponse.status}` },
        { status: 500 }
      )
    }

    const aiData = await aiResponse.json()
    
    // Extract the generated image URL from the response
    let imageUrl = ""
    
    if (aiData.choices && aiData.choices[0] && aiData.choices[0].message) {
      const content = aiData.choices[0].message.content
      
      // Look for image URL in the response
      const urlMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)/i)
      if (urlMatch) {
        imageUrl = urlMatch[0]
      } else {
        // If no direct URL found, the content might be the URL itself
        if (content.startsWith('http')) {
          imageUrl = content.trim()
        }
      }
    }

    if (!imageUrl) {
      console.error("No image URL found in AI response:", aiData)
      return NextResponse.json(
        { error: "Failed to generate image - no URL returned" },
        { status: 500 }
      )
    }

    // Return the generated image data
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      systemPrompt: systemPrompt || null,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error("Image generation error:", error)
    
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Image generation timed out. Please try again with a simpler prompt." },
          { status: 408 }
        )
      }
      
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { error: "Network error. Please check your connection and try again." },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: "Internal server error occurred during image generation" },
      { status: 500 }
    )
  }
}