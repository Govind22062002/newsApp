const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { log } = require('console');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)

        // Find the user by username
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create and sign a JWT
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '7days',
        });

        res.status(200).json({ token,user});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

