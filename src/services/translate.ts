const GOOGLE_TRANSLATE_API_BASE = 'https://translation.googleapis.com/language/translate/v2'

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_API_BASE}?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Translation failed with status: ${response.status}`)
    }

    const data = await response.json()
    return data.data.translations[0].translatedText
  } catch (error) {
    console.error('Translation API error:', error)
    throw new Error('Failed to translate text')
  }
}

export const getSupportedLanguages = async (): Promise<
  Array<{ language: string; name: string }>
> => {
  try {
    const response = await fetch(
      `${GOOGLE_TRANSLATE_API_BASE}/languages?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}&target=en`,
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch languages with status: ${response.status}`)
    }

    const data = await response.json()
    return data.data.languages
  } catch (error) {
    console.error('Failed to fetch supported languages:', error)
    throw new Error('Failed to fetch supported languages')
  }
}
