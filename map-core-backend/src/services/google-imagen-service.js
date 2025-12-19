/**
 * Google Gemini Imagen Service (Stub)
 * Prevents crash if @google/generative-ai is missing
 */

class GoogleImagenService {
    constructor() {
        this.initialized = false;
        this.apiKey = process.env.GOOGLE_AI_API_KEY;
        // this.init(); // Skip init to avoid require error
    }

    init() {
        // Stub
    }

    isAvailable() {
        return false;
    }

    async generateImage() {
        throw new Error('Google Imagen service is not available');
    }
}

module.exports = new GoogleImagenService();
