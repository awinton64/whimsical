import OpenAI from 'openai'

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, you might want to proxy through your backend
})

export const generateMemeText = async (prompt: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a creative meme generator. Generate funny and engaging meme text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    })

    return completion.choices[0]?.message?.content || 'Could not generate meme text'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate meme text')
  }
}

export const generateMemeImage = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a meme image for: ${prompt}. Make it funny and suitable for memes. Use bold, clear visuals.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
    })

    return response.data[0]?.url || ''
  } catch (error) {
    console.error('DALL-E API error:', error)
    throw new Error('Failed to generate meme image')
  }
}

export default openai
