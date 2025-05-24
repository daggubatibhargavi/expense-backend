const express = require('express');
const cors = require('cors');
const db = require('./db/db.js');  // ✅ Corrected import
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
readdirSync('./routes').map((route) => app.use('/api/v1', require(`./routes/${route}`)));

const server = async () => {
    try {
        await db(); // ✅ Ensure DB is connected before starting
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server failed to start:', error.message);
        process.exit(1);
    }
};

server();
