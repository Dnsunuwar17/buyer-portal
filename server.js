require('dotenv').config();

const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth');
const favRoutes = require('./routes/favourites');

const app = express();
const PORT = process.env.PORT || 3000;
 
// Middleware parsing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favourites', favRoutes);

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 

