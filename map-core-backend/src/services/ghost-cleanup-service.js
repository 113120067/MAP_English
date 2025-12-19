const { db } = require('../config/firebase');

class GhostCleanupService {
    constructor() {
        this.collection = 'mnemonic_generations';
        this.archiveCollection = 'mnemonic_ghosts_archive';
        this.TIMEOUT_MS = 10 * 60 * 1000;
    }

    async scanGhosts() {
        if (!db) return [];
        const cutoffTime = new Date(Date.now() - this.TIMEOUT_MS).toISOString();
        const ghosts = [];
        try {
            const snapshot = await db.collection(this.collection)
                .where('status', '==', 'planned')
                .get();

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.timestamp && data.timestamp < cutoffTime) {
                    if (!data.generated_image_url && !data.github_url) {
                        ghosts.push({ id: doc.id, ...data });
                    }
                }
            });
            console.log(`[GhostCleanup] Found ${ghosts.length} ghost records.`);
            return ghosts;
        } catch (error) {
            console.error('[GhostCleanup] Scan failed:', error);
            return [];
        }
    }

    async cleanup() {
        if (!db) return { success: false, message: 'DB not initialized' };
        const ghosts = await this.scanGhosts();
        if (ghosts.length === 0) return { success: true, count: 0 };

        const batch = db.batch();
        const mainRef = db.collection(this.collection);
        const archiveRef = db.collection(this.archiveCollection);
        let count = 0;

        for (const ghost of ghosts) {
            const docRef = archiveRef.doc(ghost.id);
            batch.set(docRef, { ...ghost, archived_at: new Date().toISOString() });
            batch.delete(mainRef.doc(ghost.id));
            count++;
        }

        try {
            await batch.commit();
            console.log(`[GhostCleanup] Cleaned up ${count} records.`);
            return { success: true, count: count };
        } catch (error) {
            console.error('[GhostCleanup] Batch failed:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new GhostCleanupService();
