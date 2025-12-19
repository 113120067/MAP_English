/**
 * Azure OpenAI Service
 * 提供 DALL-E 圖片生成功能
 */

const { AzureOpenAI } = require('openai');
// const usageLimiter = require('./usage-limiter'); // TODO: Migrate usage limiter if needed

class AzureOpenAIService {
    constructor() {
        this.client = null;
        this.initialized = false;
        this.endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        this.apiKey = process.env.AZURE_OPENAI_API_KEY;
        this.deploymentName = process.env.AZURE_OPENAI_DALLE_DEPLOYMENT || 'dall-e-3';

        this.init();
    }

    init() {
        if (!this.endpoint) {
            // console.warn('⚠️ Warning: AZURE_OPENAI_ENDPOINT not set');
            return;
        }

        try {
            if (this.apiKey) {
                this.client = new AzureOpenAI({
                    endpoint: this.endpoint,
                    apiKey: this.apiKey,
                    apiVersion: '2024-02-01'
                });
            } else {
                return;
            }

            this.initialized = true;
            console.log('✅ Azure OpenAI service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Azure OpenAI service:', error.message);
        }
    }

    isAvailable() {
        return this.initialized && this.client;
    }

    async generateImage({ prompt, size = '1024x1024', quality = 'standard', style = 'vivid', userId }) {
        if (!this.isAvailable()) {
            throw new Error('Azure OpenAI service is not available');
        }

        try {
            console.log(`🎨 Generating image for user ${userId}:`, { prompt: prompt.substring(0, 50) });

            const result = await this.client.images.generate({
                prompt: prompt,
                model: this.deploymentName,
                n: 1,
                size: size,
                quality: quality,
                style: style,
                response_format: 'url'
            });

            if (!result.data || result.data.length === 0) {
                throw new Error('No image generated');
            }

            const imageData = result.data[0];

            return {
                success: true,
                imageUrl: imageData.url,
                revisedPrompt: imageData.revised_prompt || prompt,
                size: size,
                quality: quality,
                style: style,
                generatedAt: new Date().toISOString(),
                userId: userId
            };

        } catch (error) {
            console.error('❌ Image generation failed:', error.message);
            throw error;
        }
    }
}

module.exports = new AzureOpenAIService();
