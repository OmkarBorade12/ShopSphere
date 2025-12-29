const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const email = 'admin@shopsphere.com';
        const rawPassword = 'admin123';
        const name = 'Admin User';

        // Check if exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            console.log('User already exists. Updating to Admin role and resetting password...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(rawPassword, salt);

            existingUser.role = 'admin';
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new Admin user...');
            // The beforeCreate hook will handle hashing
            await User.create({
                name,
                email,
                password: rawPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

        console.log('-----------------------------------');
        console.log('Login Email: ' + email);
        console.log('Login Password: ' + rawPassword);
        console.log('-----------------------------------');

    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

createAdmin();
