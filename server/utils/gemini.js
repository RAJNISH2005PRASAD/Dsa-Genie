const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function geminiChat(prompt, maxRetries = 3) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
  }

  const data = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting Gemini API call (attempt ${attempt}/${maxRetries})`);
      
      const response = await axios.post(GEMINI_URL, data, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const text = response.data.candidates[0].content.parts[0].text;
        console.log('Gemini API call successful');
        return text;
      } else {
        throw new Error('Invalid response structure from Gemini API');
      }
    } catch (error) {
      console.error(`Gemini API attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Gemini API failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Helper function to generate structured JSON responses
async function geminiGenerateJSON(prompt, schema = null) {
  try {
    let enhancedPrompt = prompt;
    
    if (schema) {
      enhancedPrompt = `${prompt}\n\nPlease respond with valid JSON only. Follow this exact schema structure:\n${JSON.stringify(schema, null, 2)}\n\nIMPORTANT RULES:\n- Return ONLY the JSON object, no additional text or markdown formatting\n- Use exact field names as shown in the schema\n- Ensure all arrays contain valid objects/values\n- Use proper data types (strings, numbers, booleans)\n- Escape any special characters in strings\n- Do not include any fields not in the schema`;
    } else {
      enhancedPrompt = `${prompt}\n\nPlease respond with valid JSON only. Return only the JSON object, no additional text or markdown formatting.`;
    }
    
    const response = await geminiChat(enhancedPrompt);
    
    // Clean the response to extract JSON
    let cleanedResponse = response.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to extract JSON from the response
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    // Parse the JSON
    let parsed;
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', response);
      console.error('Cleaned response:', cleanedResponse);
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }
    
    return parsed;
  } catch (error) {
    console.error('Error generating JSON with Gemini:', error);
    throw new Error(`Failed to generate valid JSON: ${error.message}`);
  }
}

module.exports = { 
  geminiChat, 
  geminiGenerateJSON 
}; 