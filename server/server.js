require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[API Auth] Endpoint: http://localhost:${PORT}/api/auth/login`);
  });
}).catch((err) => {
  console.error('[Server Init Error]:', err.message);
});
