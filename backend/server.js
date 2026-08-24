const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Global Request Logger Middleware
const requestLogger = require('./middleware/requestLogger');
app.use(requestLogger);

// Import Routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authGuard = require('./middleware/authGuard');

// Mount Routes under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/orders', authGuard, orderRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to QuickBite Food Ordering System API',
    version: '1.0.0',
    status: 'Running'
  });
});

// Global Error Handler Middleware (Must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
