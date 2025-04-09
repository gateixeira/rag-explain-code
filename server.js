const express = require('express');
const { processCodebase } = require('./ragService');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/analyze', async (req, res) => {
    const { path, question } = req.body;
    
    if (!path || !question) {
        return res.status(400).json({ error: 'Both path and question are required' });
    }

    try {
        const answer = await processCodebase(path, question);
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