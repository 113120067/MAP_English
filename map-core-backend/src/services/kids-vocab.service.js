const { db } = require('../config/firebase');
const llmService = require('./llm-service');
const mnemonicLogService = require('./mnemonic-log-service');
const githubStorage = require('./github-storage');
const imageGenerationManager = require('./image-generation-manager');
const ghostCleanupService = require('./ghost-cleanup-service');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class KidsVocabService {
    constructor() {
        this.collection = 'mnemonic_generations';
        this.PROMPT_PATH = path.join(__dirname, '../config/prompt.md');
    }

    async getSystemPrompt() {
        try {
            return fs.readFileSync(this.PROMPT_PATH, 'utf-8');
        } catch (e) {
            console.error('Failed to read system prompt:', e);
            return 'You are an expert etymology teacher.';
        }
    }

    async validateInput(word) {
        // Simple sanity check for now to save tokens
        if (!word || word.trim().length === 0) return { isValid: false, message: 'Empty input' };
        return { isValid: true, correction: null, type: 'word', message: '' };
    }

    async getOrGenerate(word, userIp) {
        if (!db) {
            // If DB is offline, fast fail or fallback? 
            // Depending on architecture. For now throw.
            // console.warn('DB not available, proceeding without cache...');
        }

        const cleanWord = word.trim().toLowerCase();

        // 1. Check DB for existing
        if (db) {
            const snapshot = await db.collection(this.collection)
                .where('word', '==', cleanWord)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const data = doc.data();

                // Self-healing ghost check
                const isGhost = !data.generated_image_url &&
                    data.status === 'planned' &&
                    (new Date() - new Date(data.timestamp)) > ghostCleanupService.TIMEOUT_MS;

                if (isGhost) {
                    console.warn(`[KidsService] Ghost record for "${cleanWord}". Regenerating.`);
                } else {
                    return {
                        success: true,
                        data: { ...data, id: doc.id },
                        source: 'cache'
                    };
                }
            }
        }

        // 2. Fast Path Generation (V1 Style)
        console.log(`[KidsService] Generating new for ${cleanWord}...`);

        const safetySuffix = ", cute kid-friendly style, soft colors, warm lighting, vector art, 3d render style, G-rated, masterpiece, best quality, no text, no scary elements";
        const v1Prompt = `cute cartoon illustration of ${cleanWord}` + safetySuffix;
        let imageUrl = '';

        try {
            const imageResult = await imageGenerationManager.generateImage({
                prompt: v1Prompt,
                provider: 'pollinations',
                userId: 'fast_path_v1',
                options: { model: 'flux', seed: Math.floor(Math.random() * 1000000) }
            });
            if (imageResult.success) imageUrl = imageResult.imageUrl;
        } catch (e) {
            console.error('[KidsService] Fast Path Error:', e.message);
        }

        // 3. Save to DB (Basic)
        let logId = null;
        if (db) {
            logId = await mnemonicLogService.createLog({
                word: cleanWord,
                image_prompt: v1Prompt,
                generated_image_url: imageUrl,
                client_ip: userIp
            });
        }

        // 4. Trigger Background Upgrade
        if (logId) {
            this.upgradeToEnhanced(cleanWord, logId).catch(err => console.error('[KidsService] Upgrade failed:', err));
        }

        return {
            success: true,
            data: {
                word: cleanWord,
                generated_image_url: imageUrl,
                quality_tier: 'basic'
            },
            source: 'generated'
        };
    }

    async upgradeToEnhanced(word, logId) {
        console.log(`[KidsService] Upgrading ${word} (${logId})...`);
        const systemPrompt = await this.getSystemPrompt();

        // 1. LLM Analysis
        const analysisResult = await llmService.generatePrompt(systemPrompt, word);
        let parsedResult;
        try {
            let jsonStr = typeof analysisResult === 'string' ? analysisResult.replace(/```json|```/g, '').trim() : JSON.stringify(analysisResult);
            parsedResult = JSON.parse(jsonStr);
        } catch (e) {
            console.error('[KidsService] JSON parse error:', e);
            return;
        }

        // 2. Image Generation (Enhanced)
        let corePrompt = parsedResult.image_prompt || `A cute cartoon illustration explaining ${word}`;
        const safePrompt = corePrompt + ", cute kid-friendly style, soft colors, warm lighting, vector art, 3d render style, G-rated, masterpiece, best quality, no text";

        let finalImageUrl = null;
        let uploadStatus = 'painted';
        let githubUrl = null;

        const imageResult = await imageGenerationManager.generateImage({
            prompt: safePrompt,
            provider: 'pollinations',
            userId: 'system_upgrade',
            options: { model: 'flux', seed: Math.floor(Math.random() * 1000000) }
        });

        if (imageResult.success) {
            finalImageUrl = imageResult.imageUrl;

            // 3. GitHub Upload
            try {
                const imageRes = await axios.get(finalImageUrl, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(imageRes.data, 'binary');
                githubUrl = await githubStorage.uploadImage(word, buffer, 'jpg');
                if (githubUrl) {
                    finalImageUrl = githubUrl;
                    uploadStatus = 'uploaded';
                }
            } catch (err) {
                console.error('[KidsService] GitHub upload failed:', err.message);
            }
        }

        // 4. Update DB
        if (db) {
            await db.collection(this.collection).doc(logId).update({
                analysis: parsedResult.analysis,
                teaching: parsedResult.teaching,
                image_prompt: safePrompt,
                generated_image_url: finalImageUrl,
                github_url: githubUrl,
                quality_tier: 'enhanced',
                status: uploadStatus,
                upgraded_at: new Date().toISOString()
            });
        }
        console.log(`[KidsService] Upgrade complete for ${word}`);
    }
}

module.exports = new KidsVocabService();
