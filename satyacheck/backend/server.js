require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const detectRoutes = require('./routes/detect');
const trendingRoutes = require('./routes/trending');
const suggestionsRoutes = require('./routes/suggestions');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

app.use('/api/detect', detectRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/suggestions', suggestionsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`SatyaCheck Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;