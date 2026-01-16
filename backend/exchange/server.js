const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
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
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'dev' });
});

// Auth & user-related routes
app.use('/auth', authRateLimiter, require('./routes/auth'));
app.use('/profiles', require('./routes/profiles'));

app.use("/api", require("./routes/search.routes"));
app.use("/api", require("./routes/listings"));

// Database connection and sync
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Sync error:', err));

// if (process.env.ENABLE_DB === 'true') {
//   sequelize.sync({ alter: true })
//     .then(() => console.log('Database synced'))
//     .catch(err => console.error('Sync error:', err));
// }


app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
