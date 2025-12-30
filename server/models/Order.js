const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'),
        defaultValue: 'pending',
    },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'unpaid',
    },
    paymentMethod: {
        type: DataTypes.ENUM('card', 'cod'),
        defaultValue: 'card',
    },
});

module.exports = Order;
