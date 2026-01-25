const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/prisma');
const logger = require('./middleware/logging');
const errorHandler = require('./middleware/errorHandler');
const { authRateLimiter } = require('./middleware/rateLimit');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(logger);

// Health endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', env: process.env.NODE_ENV || 'dev' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// Auth & user-related routes
app.use('/auth', authRateLimiter, require('./routes/auth'));
app.use('/profiles', require('./routes/profiles'));

app.use("/api", require("./routes/search.routes"));
app.use("/api", require("./routes/listings"));

app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
