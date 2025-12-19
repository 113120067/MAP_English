const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');
const admin = require('firebase-admin');

/**
 * GET /library
 * Returns mnemonic cards from Firestore for the Mnemonic Library.
 */
router.get('/library', async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('mnemonic_generations')
            .limit(20)
            .get();

        const cards = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(cards);
    } catch (error) {
        console.error('[Immersive] Library fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch library content' });
    }
});

/**
 * GET /token
 * Returns a short-lived Immersive Reader token and subdomain for the client.
 */
router.get('/token', async (req, res) => {
    try {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        };

        const data = {
            grant_type: 'client_credentials',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            resource: 'https://cognitiveservices.azure.com/'
        };

        // Check for missing env variables to give better error messages
        if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.TENANT_ID || !process.env.SUBDOMAIN) {
            console.error('[Immersive] Missing Azure Credentials in .env');
            return res.status(500).json({
                error: 'Server configuration error: Missing Azure Credentials.'
            });
        }

        const url = `https://login.windows.net/${process.env.TENANT_ID}/oauth2/token`;

        const response = await axios.post(url, qs.stringify(data), config);
        const token = response.data.access_token;
        const subdomain = process.env.SUBDOMAIN;

        return res.json({ token, subdomain });

    } catch (error) {
        console.error('[Immersive] Token error:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Unable to acquire Azure AD token.' });
    }
});

module.exports = router;
