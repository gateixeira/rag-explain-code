const express = require('express');
const { loadCodebase, analyzeCode } = require('./ragService');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/load', async (req, res) => {
    const { path } = req.body;
    
    if (!path) {
        return res.status(400).json({ error: 'Path is required' });
    }

    try {
        const result = await loadCodebase(path);
        res.json(result);
    } catch (error) {
        console.error('Error loading codebase:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/analyze', async (req, res) => {
    const { question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    try {
        const answer = await analyzeCode(question);
        res.json({ answer });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});