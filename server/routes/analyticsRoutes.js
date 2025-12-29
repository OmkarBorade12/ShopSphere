const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, sequelize } = require('../models');
const { auth, admin } = require('../middleware/authMiddleware');

// Get Sales Analytics (Admin)
router.get('/sales', auth, admin, async (req, res) => {
    try {
        const totalSales = await Order.sum('totalAmount', {
            where: { status: 'delivered' }
        });
        const orderCount = await Order.count();

        res.json({
            totalRevenue: totalSales || 0,
            totalOrders: orderCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Top Products (Admin)
router.get('/top-products', auth, admin, async (req, res) => {
    try {
        const topProducts = await OrderItem.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']
            ],
            group: ['productId'],
            order: [[sequelize.literal('totalSold'), 'DESC']],
            limit: 5,
            include: [{ model: Product, attributes: ['name', 'price'] }]
        });
        res.json(topProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
