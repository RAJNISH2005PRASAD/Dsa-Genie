const { OpenAI } = require('openai');

// Initialize OpenAI with Ollama
const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

async function testOllama() {
  try {
    console.log('🧪 Testing Ollama connection...');
    
    const completion = await openai.chat.completions.create({
      model: 'llama3',
      messages: [{ role: 'user', content: 'Say "Hello from Ollama!"' }],
      max_tokens: 50,
    });
    
    console.log('✅ Ollama is working!');
    console.log('Response:', completion.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Ollama test failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. Ollama is installed');
    console.log('2. Run: ollama run llama3');
    console.log('3. Ollama is running on http://localhost:11434');
  }
}

testOllama(); 