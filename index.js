const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
});
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied.');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

// Routes
// User registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Ensure 10 is passed here
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.send('User registered');

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});


// User login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.log(error)
        res.status(500).send('Error logging in');
    }
});

// CRUD for Products
app.post('/products', authenticate, async (req, res) => {
    try {
        const { name, price } = req.body;
        const product = new Product({ name, price });
        await product.save();
        res.status(201).send('Product created');
    } catch (error) {
        res.status(500).send('Error creating product');
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send('Error retrieving products');
    }
});

app.put('/products/:id', authenticate, async (req, res) => {
    try {
        const { name, price } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, price }, { new: true });
        res.send('Product updated');
    } catch (error) {
        res.status(500).send('Error updating product');
    }
});

app.delete('/products/:id', authenticate, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send('Product deleted');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
});

// CRUD for Orders
app.post('/orders', authenticate, async (req, res) => {
    try {
        const { products } = req.body;
        const order = new Order({ userId: req.user.id, products });
        await order.save();
        res.status(201).send('Order created');
    } catch (error) {
        res.status(500).send('Error creating order');
    }
});

app.get('/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products');
        res.json(orders);
    } catch (error) {
        res.status(500).send('Error retrieving orders');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
