const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, User } = require('../models');
const { auth, admin } = require('../middleware/authMiddleware');

// Dummy Payment Processing Function
const processPayment = async (amount) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, transactionId: 'TXN' + Date.now() });
        }, 1000);
    });
};

// Create Order (Checkout)
router.post('/', auth, async (req, res) => {
    try {
        const { items } = req.body; // items: [{productId, quantity}]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        // Validate stock and calculate total
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            totalAmount += parseFloat(product.price) * item.quantity;
            orderItemsData.push({
                product,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Simulate Payment
        const paymentResult = await processPayment(totalAmount);
        if (!paymentResult.success) {
            return res.status(400).json({ message: 'Payment failed' });
        }

        // Create Order
        const order = await Order.create({
            userId: req.user.id,
            totalAmount,
            status: 'pending', // Initial status
            paymentStatus: 'paid'
        });

        // Create Order Items and Update Stock
        for (const data of orderItemsData) {
            await OrderItem.create({
                orderId: order.id,
                productId: data.product.id,
                quantity: data.quantity,
                price: data.price
            });

            // Decrement Stock
            data.product.stock -= data.quantity;
            await data.product.save();
        }

        res.status(201).json(order);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get My Orders
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem, include: [Product] }]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Cancel Order (User)
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({ message: 'Cannot cancel order at this stage' });
        }

        order.status = 'cancelled';
        await order.save();

        // Restore stock logic could go here
        const items = await OrderItem.findAll({ where: { orderId: order.id } });
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Order Status (Admin)
router.put('/:id/status', auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get All Orders (Admin)
router.get('/', auth, admin, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderItem, include: [Product] },
                { model: User, attributes: ['name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
