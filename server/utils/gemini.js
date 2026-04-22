const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function geminiChat(prompt, maxRetries = 3) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Please set it in your .env file.');
  }
  if (!openai) {
    throw new Error('OpenAI client is not initialized.');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting OpenAI API call (attempt ${attempt}/${maxRetries})`);

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.7,
      });

      if (response.choices && response.choices[0]) {
        const text = response.choices[0].message.content;
        console.log('OpenAI API call successful');
        return text;
      } else {
        throw new Error('Invalid response structure from OpenAI API');
      }
    } catch (error) {
      console.error(`OpenAI API attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw new Error(`OpenAI API failed after ${maxRetries} attempts: ${error.message}`);
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