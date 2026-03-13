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

// ✅ CORS configuration
const allowedOrigins = [
  'https://tradingchatbot-frontend-51ld.onrender.com',
  ...(process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean),
];

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// ✅ Apply CORS to all routes
app.use(cors(corsOptions));

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Health check route - visit this to confirm new code is deployed
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    allowedOrigins,
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/conversations', require('./routes/conversation'));

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - http://localhost:${PORT}/api/auth`);
  console.log(`   - http://localhost:${PORT}/api/conversations`);
  console.log(`🌐 Allowed origins:`);
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
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
