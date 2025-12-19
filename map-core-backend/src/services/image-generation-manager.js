/**
 * Image Generation Manager
 * 統一管理多個圖片生成服務提供商
 */

const azureOpenAIService = require('./azure-openai-service');
const googleImagenService = require('./google-imagen-service');
const pollinationsService = require('./pollinations-service');

class ImageGenerationManager {
    constructor() {
        this.providers = {
            'azure-openai': azureOpenAIService,
            'google-imagen': googleImagenService,
            'pollinations': pollinationsService
        };

        this.defaultProvider = process.env.DEFAULT_IMAGE_PROVIDER || 'pollinations';
        this.fallbackProvider = 'azure-openai';
    }

    getAvailableProviders() {
        const available = [];
        Object.keys(this.providers).forEach(providerName => {
            const provider = this.providers[providerName];
            if (provider.isAvailable()) {
                available.push({
                    name: providerName,
                    // displayName: this.getProviderDisplayName(providerName),
                    // capabilities: provider.getCapabilities ? provider.getCapabilities() : {}
                });
            }
        });
        return available;
    }

    selectProvider(preferredProvider = null) {
        if (preferredProvider && this.providers[preferredProvider]?.isAvailable()) {
            return { name: preferredProvider, service: this.providers[preferredProvider] };
        }
        if (this.providers[this.defaultProvider]?.isAvailable()) {
            return { name: this.defaultProvider, service: this.providers[this.defaultProvider] };
        }
        for (const [name, service] of Object.entries(this.providers)) {
            if (service.isAvailable()) return { name, service };
        }
        // Fallback to Pollinations implicitly if nothing else works (it's always "available" but initialized=true)
        return { name: 'pollinations', service: this.providers['pollinations'] };
    }

    async generateImage({ prompt, provider, options = {}, userId }) {
        try {
            const selectedProvider = this.selectProvider(provider);
            console.log(`🎨 Using provider: ${selectedProvider.name} for user: ${userId}`);

            const result = await selectedProvider.service.generateImage({
                prompt,
                userId,
                ...options
            });

            result.provider = selectedProvider.name;
            return result;

        } catch (error) {
            console.error(`❌ Image generation failed with provider ${provider || 'auto'}:`, error.message);

            // Fallback logic could go here
            throw error;
        }
    }

    // Simplified Prompt Validation
    validatePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return { valid: false, error: 'Invalid prompt' };
        }
        return { valid: true, prompt: prompt.trim() };
    }
}

module.exports = new ImageGenerationManager();
