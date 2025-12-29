const express = require('express');
const router = express.Router();
const { Product, Review, User } = require('../models');
const { auth, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Single Product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: Review,
                    include: [{ model: User, attributes: ['name'] }]
                }
            ]
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add Review
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const review = await Review.create({
            userId: req.user.id,
            productId: product.id,
            rating,
            comment
        });

        const newReview = await Review.findByPk(review.id, {
            include: [{ model: User, attributes: ['name'] }]
        });

        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add Product (Admin)
router.post('/', auth, admin, upload, async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl } = req.body;
        let finalImageUrl = imageUrl;
        if (req.file) {
            finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            imageUrl: finalImageUrl,
        });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Product (Admin)
router.put('/:id', auth, admin, upload, async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        let finalImageUrl = imageUrl || product.imageUrl;
        if (req.file) {
            finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.imageUrl = finalImageUrl;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete Product (Admin)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
