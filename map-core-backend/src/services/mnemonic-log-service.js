const { db } = require('../config/firebase');

class MnemonicLogService {
    constructor() {
        this.collection = 'mnemonic_generations';
    }

    async createLog(data) {
        if (!db) {
            console.warn('[MnemonicLog] DB not initialized, skipping log.');
            return null;
        }
        try {
            const docRef = db.collection(this.collection).doc();
            const payload = {
                word: data.word || 'unknown',
                timestamp: new Date().toISOString(),
                analysis: data.analysis || {},
                teaching: data.teaching || {},
                image_prompt: data.image_prompt || '',
                status: 'planned',
                has_image: false,
                is_uploaded: false,
                client_ip: data.client_ip || 'unknown',
                source: data.source || 'kids-v2',
                quality_tier: data.quality_tier || 'basic'
            };
            await docRef.set(payload);
            return docRef.id;
        } catch (error) {
            console.error('[MnemonicLog] Create failed:', error);
            return null;
        }
    }

    async logImageGeneration(logId, imageUrl) {
        if (!db || !logId) return;
        try {
            await db.collection(this.collection).doc(logId).update({
                status: 'painted',
                has_image: true,
                generated_image_url: imageUrl,
                painted_at: new Date().toISOString()
            });
        } catch (error) {
            console.error('[MnemonicLog] Image update failed:', error);
        }
    }

    async logUpload(logId, githubUrl) {
        if (!db || !logId) return;
        try {
            await db.collection(this.collection).doc(logId).update({
                status: 'uploaded',
                is_uploaded: true,
                github_url: githubUrl,
                uploaded_at: new Date().toISOString()
            });
        } catch (error) {
            console.error('[MnemonicLog] Upload update failed:', error);
        }
    }
}

module.exports = new MnemonicLogService();
