const { db } = require('../config/firebase');

class ImageReportService {
    constructor() {
        this.collection = 'image_reports';
    }

    /**
     * Create a new report
     * @param {string} word - The word being reported
     * @param {string} reason - limit to: 'scary', 'wrong', 'glitch', 'other'
     * @param {string} imageUrl - The URL of the image being reported
     * @param {string} userIp - Reporter's IP
     */
    async createReport({ word, reason, imageUrl, userIp }) {
        if (!db) {
            console.warn('[ReportService] DB offline, skipping report save.');
            return { saved: false };
        }

        try {
            const reportData = {
                word,
                reason,
                imageUrl,
                reporterIp: userIp,
                status: 'pending', // pending, reviewed, dismissed
                timestamp: new Date().toISOString()
            };

            const docRef = await db.collection(this.collection).add(reportData);
            console.log(`[ReportService] New report created for "${word}" (ID: ${docRef.id})`);

            // --- Archiving Logic ---
            // 1. Find the active record in mnemonic_generations
            const vocabRef = db.collection('mnemonic_generations');
            const snapshot = await vocabRef.where('word', '==', word).limit(1).get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const data = doc.data();

                // 2. Move to archive
                await db.collection('mnemonic_archive').add({
                    ...data,
                    originalId: doc.id,
                    archivedAt: new Date().toISOString(),
                    reportId: docRef.id,
                    reportReason: reason
                });
                console.log(`[ReportService] Archived data for "${word}"`);

                // 3. Delete from active collection (Forces regeneration next time)
                await doc.ref.delete();
                console.log(`[ReportService] Deleted active record for "${word}" (Regeneration primed)`);
            } else {
                console.warn(`[ReportService] No active record found for "${word}" to archive.`);
            }

            return {
                saved: true,
                id: docRef.id
            };

        } catch (error) {
            console.error('[ReportService] Failed to save report:', error);
            throw error;
        }
    }
}

module.exports = new ImageReportService();
