import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

// Register global error handlers to prevent sudden Node process crashes
process.on('uncaughtException', (err) => {
  console.error('\x1b[31m%s\x1b[0m', 'UNCAUGHT EXCEPTION! Shutting down gracefully...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('\x1b[31m%s\x1b[0m', 'UNHANDLED REJECTION! Shutting down gracefully...', err);
  process.exit(1);
});

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : '*';

app.use(cors({
  origin: allowedOrigins,
  // CORS standard blocks credentialed requests when origin is wildcard '*'.
  // Disable credentials if origin is wildcard to prevent browser-side CORS failures.
  credentials: allowedOrigins !== '*'
}));

app.use(express.json());

// Enforce secure JWT_SECRET in production mode
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'greyiq_secret_key_2026_xyz') {
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: Refusing to start in production mode with default/fallback JWT_SECRET. Please configure a secure JWT_SECRET in environment variables.');
    process.exit(1);
  }
}

// Rate Limiting Middlewares for Public Endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 messages per hour
  message: { message: 'Too many messages submitted from this IP. Please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters to routes before loading router groups
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/contact', contactLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Simple Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
