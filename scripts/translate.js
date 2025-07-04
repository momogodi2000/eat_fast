const fs = require('fs')
const path = require('path')
const axios = require('axios')

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const DEEPL_API_KEY = process.env.DEEPL_API_KEY
const USE_GPT = true // Set to false to use DeepL

// Language mapping
const LANGUAGE_MAP = {
  fr: 'French',
  es: 'Spanish',
  // Add more languages as needed
}

async function translateWithGPT(text, targetLanguage) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the given text to ${targetLanguage}. Keep the same tone and context. If the text contains placeholders like {0}, {1}, etc., keep them exactly as they are.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.choices[0].message.content
  } catch (error) {
    console.error('GPT Translation error:', error.response?.data || error.message)
    return text // Return original text if translation fails
  }
}

async function translateWithDeepL(text, targetLanguage) {
  try {
    const langCode = targetLanguage === 'French' ? 'FR' : 
                     targetLanguage === 'Spanish' ? 'ES' : 'EN'
    
    const response = await axios.post('https://api-free.deepl.com/v2/translate', 
      new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text: text,
        target_lang: langCode,
        source_lang: 'EN'
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    return response.data.translations[0].text
  } catch (error) {
    console.error('DeepL Translation error:', error.response?.data || error.message)
    return text
  }
}

async function translatePoFile(locale) {
  const poFilePath = path.join(__dirname, '..', 'src', 'locales', locale, 'messages.po')
  
  if (!fs.existsSync(poFilePath)) {
    console.log(`PO file not found for locale: ${locale}`)
    return
  }

  const content = fs.readFileSync(poFilePath, 'utf8')
  const lines = content.split('\n')
  const translatedLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('msgid ') && !line.includes('msgid ""')) {
      // Extract the message to translate
      const msgid = line.substring(7, line.length - 1) // Remove 'msgid "' and '"'
      
      // Check if next line is empty msgstr
      if (i + 1 < lines.length && lines[i + 1] === 'msgstr ""') {
        console.log(`Translating: ${msgid}`)
        
        const translation = USE_GPT 
          ? await translateWithGPT(msgid, LANGUAGE_MAP[locale])
          : await translateWithDeepL(msgid, LANGUAGE_MAP[locale])
        
        translatedLines.push(line)
        translatedLines.push(`msgstr "${translation}"`)
        i++ // Skip the empty msgstr line
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        translatedLines.push(line)
      }
    } else {
      translatedLines.push(line)
    }
  }

  // Write back the translated content
  fs.writeFileSync(poFilePath, translatedLines.join('\n'))
  console.log(`Translation completed for ${locale}`)
}

async function main() {
  const locales = ['fr', 'es'] // Add your target locales here
  
  for (const locale of locales) {
    await translatePoFile(locale)
  }
  
  console.log('All translations completed!')
}

main().catch(console.error)