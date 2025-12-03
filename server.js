// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET;

app.post('/api/run-code', async (req, res) => {
    const { code } = req.body;
    const program = {
        script: code,
        language: 'java',
        versionIndex: '4',
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
    };

    try {
        const response = await axios.post('https://api.jdoodle.com/v1/execute', program);
        res.json(response.data);
    } catch (error) {
        console.error('Error calling JDoodle API:', error.message);
        res.status(500).json({ error: 'Failed to execute code.' });
    }
});

app.listen(port, () => {
    console.log(`✅ Backend server is live on http://localhost:${port}`);
});