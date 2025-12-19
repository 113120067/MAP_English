require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const ghostCleanupService = require('./services/ghost-cleanup-service');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all CORS for now (Dev mode)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/kids', require('./routes/kids.routes'));
app.use('/api/v1/immersive', require('./routes/immersive.routes'));

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'MAP Core Backend', version: '1.0.0' });
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 MAP Core Backend running on port ${PORT}`);
        console.log(`👉 Test API: http://localhost:${PORT}/api/v1/kids/generate`);

        // Start Ghost Cleanup Schedule (Every 10 minutes)
        console.log('👻 Ghost Cleanup Service started (Interval: 10m)');
        setInterval(() => {
            ghostCleanupService.cleanup().catch(err => console.error('Ghost Cleanup Error:', err));
        }, 10 * 60 * 1000);
    });
}

module.exports = app;
