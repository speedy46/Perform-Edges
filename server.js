const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Versioned Routes
app.get(['/v1', '/v1/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v1.html'));
});

app.get(['/v2', '/v2/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

app.get(['/compare', '/compare/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'compare.html'));
});

// Default root defaults to V2 with prominent version switcher
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

// Subpages
app.get(['/about', '/about/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get(['/privacy-policy', '/privacy-policy/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

app.get(['/terms', '/terms/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

// Service aliases
app.get(['/services/mobile-performance', '/mobile-performance'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

app.get(['/services/web-app-retargeting', '/web-app-retargeting'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

app.get(['/services/programmatic-advertising', '/programmatic-advertising'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

app.get(['/advertiser-form', '/advertiser-form/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

app.get(['/publisher-form', '/publisher-form/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'v2.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        prototype: 'Performedges Prototype Suite',
        versions: {
            v1: {
                name: 'Version 1 (Refactored Original Theme)',
                url: 'http://localhost:' + PORT + '/v1',
                description: 'Original theme layout with all P0-P4 bugs resolved and legal compliance added'
            },
            v2: {
                name: 'Version 2 (InMobi-Inspired Enterprise AdTech)',
                url: 'http://localhost:' + PORT + '/v2',
                description: 'Persona-driven architecture (Media Buyers vs Media Owners), interactive rich media canvas, verified case studies, and enterprise scale proof'
            },
            comparison: {
                name: 'V1 vs V2 Architectural Comparison',
                url: 'http://localhost:' + PORT + '/compare'
            }
        }
    });
});

// Fallback 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'v2.html'));
});

app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Performedges Multi-Version Prototype Suite Live!`);
    console.log(`🌐 Version 2 (InMobi Style): http://localhost:${PORT}/v2 (Default: /)`);
    console.log(`🌐 Version 1 (Original):     http://localhost:${PORT}/v1`);
    console.log(`📊 Comparison Matrix:        http://localhost:${PORT}/compare`);
    console.log(`🛡️ Health Endpoint:          http://localhost:${PORT}/health`);
    console.log(`======================================================\n`);
});
