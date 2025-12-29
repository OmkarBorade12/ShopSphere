const { sequelize, Product } = require('./models');

const products = [
    // Electronics
    { name: 'Smartphone X', description: 'Latest flagship smartphone with amazing camera.', price: 999.99, category: 'Electronics', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60' },
    { name: 'Laptop Pro', description: 'High performance laptop for professionals.', price: 1499.99, category: 'Electronics', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60' },
    { name: 'Wireless Earbuds', description: 'Noise cancelling earbuds.', price: 199.99, category: 'Electronics', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60' },
    { name: 'Smart Watch', description: 'Track your fitness and health.', price: 299.99, category: 'Electronics', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&auto=format&fit=crop&q=60' },
    { name: '4K Monitor', description: 'Ultra HD monitor for crisp visuals.', price: 399.99, category: 'Electronics', stock: 20, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60' },

    // Fashion
    { name: 'Leather Jacket', description: 'Genuine leather jacket, stylish and warm.', price: 199.99, category: 'Fashion', stock: 15, imageUrl: 'https://images.unsplash.com/photo-1551028919-ac7bcb7d7162?w=500&auto=format&fit=crop&q=60' },
    { name: 'Denim Jeans', description: 'Classic fit denim jeans.', price: 49.99, category: 'Fashion', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1542272617-0858607c2242?w=500&auto=format&fit=crop&q=60' },
    { name: 'Sneakers', description: 'Comfortable running shoes.', price: 89.99, category: 'Fashion', stock: 40, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
    { name: 'Classic T-Shirt', description: 'Cotton crew neck t-shirt.', price: 24.99, category: 'Fashion', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60' },
    { name: 'Sunglasses', description: 'UV protection sunglasses.', price: 129.99, category: 'Fashion', stock: 25, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60' },

    // Home
    { name: 'Coffee Maker', description: 'Brew the perfect cup every morning.', price: 79.99, category: 'Home', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60' },
    { name: 'Throw Pillow', description: 'Soft and decorative pillow.', price: 19.99, category: 'Home', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1584100936595-f06ee2b4146c?w=500&auto=format&fit=crop&q=60' },
    { name: 'Desk Lamp', description: 'Adjustable LED desk lamp.', price: 34.99, category: 'Home', stock: 40, imageUrl: 'https://images.unsplash.com/photo-1507473888900-52a10b546dbd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Plant Pot', description: 'Ceramic pot for indoor plants.', price: 14.99, category: 'Home', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60' },
    { name: 'Wall Clock', description: 'Modern minimalist wall clock.', price: 29.99, category: 'Home', stock: 20, imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868c62586?w=500&auto=format&fit=crop&q=60' }
];

const seedProducts = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');
        await Product.bulkCreate(products);
        console.log('Products seeded successfully!');
    } catch (err) {
        console.error('Error seeding products:', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

seedProducts();
