/**
 * Pollinations Service
 * 提供免費的 AI 圖片生成功能
 */

const https = require('https');
const http = require('http');

class PollinationsService {
    constructor() {
        this.baseUrl = 'https://image.pollinations.ai/prompt';
        this.initialized = true;
        console.log('✅ Pollinations service initialized (Free AI Image Generation)');
    }

    isAvailable() {
        return this.initialized;
    }

    async generateImage({
        prompt,
        width = 1024,
        height = 1024,
        seed = null,
        model = 'flux',
        enhance = true,
        userId
    }) {
        if (!this.isAvailable()) throw new Error('Pollinations service is not available');
        if (!prompt) throw new Error('Prompt is required');

        try {
            console.log(`🌸 Generating image with Pollinations for user ${userId}`);

            const encodedPrompt = encodeURIComponent(prompt.trim());
            let imageUrl = `${this.baseUrl}/${encodedPrompt}`;

            const params = new URLSearchParams();
            if (width !== 1024) params.append('width', width.toString());
            if (height !== 1024) params.append('height', height.toString());
            if (seed !== null) params.append('seed', seed.toString());
            if (model !== 'flux') params.append('model', model);
            if (!enhance) params.append('enhance', 'false');

            if (params.toString()) {
                imageUrl += '?' + params.toString();
            }

            return {
                success: true,
                imageUrl: imageUrl,
                revisedPrompt: prompt,
                width: width,
                height: height,
                model: model,
                seed: seed,
                generatedAt: new Date().toISOString(),
                userId: userId,
                provider: 'pollinations',
                cost: 0
            };

        } catch (error) {
            console.error('❌ Pollinations image generation failed:', error.message);
            throw error;
        }
    }
}

module.exports = new PollinationsService();
