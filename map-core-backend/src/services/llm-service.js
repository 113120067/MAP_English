const axios = require('axios');

class LlmService {
    constructor() {
        this.defaultBaseUrl = 'https://text.pollinations.ai/';
        this.defaultModel = 'openai';
    }

    async generatePrompt(systemPrompt, userMessage, config = {}) {
        const baseUrl = config.baseUrl || this.defaultBaseUrl;
        const apiKey = config.apiKey || process.env.OPENAI_API_KEY || '';

        try {
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ];

            if (baseUrl.includes('pollinations.ai')) {
                // Pollinations Text optimized
                const response = await axios.post(baseUrl, {
                    messages: messages,
                    model: 'openai',
                    json: false
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                return response.data;
            } else {
                // Standard OpenAI Compatible
                const response = await axios.post(`${baseUrl}/chat/completions`, {
                    model: config.model || 'gpt-3.5-turbo',
                    messages: messages,
                    temperature: 0.7
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                return response.data.choices[0].message.content;
            }

        } catch (error) {
            console.error('LLM Generation Error:', error.message);
            throw new Error('Failed to generate prompt from LLM.');
        }
    }
}

module.exports = new LlmService();
