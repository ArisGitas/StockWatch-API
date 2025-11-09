//server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 



// 1. Ρύθμιση Environment & Σύνδεση DB
dotenv.config();
connectDB();

// 2. Αρχικοποίηση Express App
const app = express();

// Middleware για να δέχεται JSON requests
app.use(express.json());

// 3. Test Route
app.get('/', (req, res) => {
    res.send('StockWatch API Running...');
});

// 4. Εκκίνηση Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server τρέχει σε λειτουργία ${process.env.NODE_ENV} στο port ${PORT}'));