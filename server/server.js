const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const { User, Product } = require('./models'); // Import to ensure models are registered

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Database Connection and Sync
const startServer = async () => {
    await connectDB();
    // Sync models force: false ensures we don't drop tables on every restart, 
    // but creates them if they don't exist.
    // Use { force: true } only for development if you want to clear DB.
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced');
    } catch (err) {
        console.error('Error syncing database:', err);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
