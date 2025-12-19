const express = require('express');
const router = express.Router();
const kidsService = require('../services/kids-vocab.service');
const reportService = require('../services/image-report-service');

// POST /api/v1/kids/generate
router.post('/generate', async (req, res) => {
    try {
        console.log('[API] /generate Body:', req.body); // Debug: Confirm input received

        const { word } = req.body;
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Validate Validation
        const validation = await kidsService.validateInput(word);
        if (!validation.isValid) {
            console.warn('[API] Invalid Input:', validation.message);
            return res.status(400).json({ success: false, error: validation.message });
        }

        const result = await kidsService.getOrGenerate(word, userIp);
        res.json(result);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// POST /api/v1/kids/report
router.post('/report', async (req, res) => {
    try {
        const { word, reason, imageUrl } = req.body;
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (!word || !reason) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const result = await reportService.createReport({ word, reason, imageUrl, userIp });
        res.json({ success: true, id: result.id });

    } catch (error) {
        console.error('Report API Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
