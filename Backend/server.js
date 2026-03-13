const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB with error handling
connectDB()
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  });

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from any localhost port (dev) or no origin (e.g. Postman)
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/conversations', require('./routes/conversation'));

const PORT = process.env.PORT || 5000;

// Handle port conflicts gracefully
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - http://localhost:${PORT}/api/auth`);
  console.log(`   - http://localhost:${PORT}/api/conversations`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log(`\n🔧 To fix this:`);
    console.log(`   1. Run: taskkill /F /IM node.exe`);
    console.log(`   2. Then run: npm start again\n`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});