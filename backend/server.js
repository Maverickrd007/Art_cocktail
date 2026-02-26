const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./config/db');

const app = express();

// --- Middleware ---
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Multer config for image uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(null, ext && mime);
    }
});

// ============================================
// AUTH MIDDLEWARE
// ============================================
const auth = async (req, res, next) => {
    try {
        const header = req.header('Authorization');
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(header.replace('Bearer ', ''), process.env.JWT_SECRET);
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = result.rows[0];
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') next();
    else res.status(403).json({ message: 'Admin access required' });
};

// ============================================
// AUTH ROUTES
// ============================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if user exists
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, 'user']
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

app.get('/api/auth/profile', auth, (req, res) => {
    res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

// ============================================
// ARTWORK ROUTES
// ============================================
app.get('/api/artworks', async (req, res) => {
    try {
        const { category } = req.query;
        let result;
        if (category && category !== 'all') {
            result = await pool.query('SELECT * FROM artworks WHERE category = $1 ORDER BY created_at DESC', [category]);
        } else {
            result = await pool.query('SELECT * FROM artworks ORDER BY created_at DESC');
        }
        // Map snake_case to camelCase for frontend compatibility
        const artworks = result.rows.map(row => ({
            _id: row.id.toString(),
            id: row.id,
            title: row.title,
            description: row.description,
            price: parseFloat(row.price),
            imageUrl: row.image_url,
            category: row.category,
            createdAt: row.created_at
        }));
        res.json(artworks);
    } catch (err) {
        console.error('Get artworks error:', err);
        res.status(500).json({ message: 'Failed to fetch artworks' });
    }
});

app.get('/api/artworks/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM artworks WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        const row = result.rows[0];
        res.json({
            _id: row.id.toString(),
            id: row.id,
            title: row.title,
            description: row.description,
            price: parseFloat(row.price),
            imageUrl: row.image_url,
            category: row.category,
            createdAt: row.created_at
        });
    } catch (err) {
        console.error('Get artwork error:', err);
        res.status(500).json({ message: 'Failed to fetch artwork' });
    }
});

// Admin: Create artwork
app.post('/api/artworks', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, category } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const result = await pool.query(
            'INSERT INTO artworks (title, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, price, imageUrl, category || 'painting']
        );
        const row = result.rows[0];
        res.status(201).json({
            _id: row.id.toString(),
            id: row.id,
            title: row.title,
            description: row.description,
            price: parseFloat(row.price),
            imageUrl: row.image_url,
            category: row.category,
            createdAt: row.created_at
        });
    } catch (err) {
        console.error('Create artwork error:', err);
        res.status(500).json({ message: 'Failed to create artwork' });
    }
});

// Admin: Update artwork
app.put('/api/artworks/:id', auth, admin, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, category } = req.body;
        let imageUrl;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }
        const result = imageUrl
            ? await pool.query(
                'UPDATE artworks SET title=$1, description=$2, price=$3, category=$4, image_url=$5 WHERE id=$6 RETURNING *',
                [title, description, price, category, imageUrl, req.params.id]
            )
            : await pool.query(
                'UPDATE artworks SET title=$1, description=$2, price=$3, category=$4 WHERE id=$5 RETURNING *',
                [title, description, price, category, req.params.id]
            );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        const row = result.rows[0];
        res.json({
            _id: row.id.toString(),
            id: row.id,
            title: row.title,
            description: row.description,
            price: parseFloat(row.price),
            imageUrl: row.image_url,
            category: row.category,
            createdAt: row.created_at
        });
    } catch (err) {
        console.error('Update artwork error:', err);
        res.status(500).json({ message: 'Failed to update artwork' });
    }
});

// Admin: Delete artwork
app.delete('/api/artworks/:id', auth, admin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM artworks WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        res.json({ message: 'Artwork deleted successfully' });
    } catch (err) {
        console.error('Delete artwork error:', err);
        res.status(500).json({ message: 'Failed to delete artwork' });
    }
});

// ============================================
// ORDER ROUTES
// ============================================
app.post('/api/orders', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        const { items, totalAmount, shippingAddress } = req.body;
        await client.query('BEGIN');

        // Create order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total_amount, status, shipping_name, shipping_address, shipping_city, shipping_postal_code, shipping_phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                req.user.id, totalAmount, 'Pending',
                shippingAddress.fullName, shippingAddress.address,
                shippingAddress.city, shippingAddress.postalCode, shippingAddress.phone
            ]
        );
        const order = orderResult.rows[0];

        // Insert order items
        const orderItems = [];
        for (const item of items) {
            const artworkId = parseInt(item.artwork) || null;
            const itemResult = await client.query(
                `INSERT INTO order_items (order_id, artwork_id, title, price, image_url, quantity)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [order.id, artworkId, item.title, item.price, item.imageUrl, item.quantity]
            );
            orderItems.push(itemResult.rows[0]);
        }

        await client.query('COMMIT');

        res.status(201).json({
            _id: order.id.toString(),
            id: order.id,
            user: { _id: req.user.id.toString(), name: req.user.name, email: req.user.email },
            items: orderItems.map(i => ({
                title: i.title,
                price: parseFloat(i.price),
                imageUrl: i.image_url,
                quantity: i.quantity
            })),
            totalAmount: parseFloat(order.total_amount),
            shippingAddress: {
                fullName: order.shipping_name,
                address: order.shipping_address,
                city: order.shipping_city,
                postalCode: order.shipping_postal_code,
                phone: order.shipping_phone
            },
            status: order.status,
            createdAt: order.created_at
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Create order error:', err);
        res.status(500).json({ message: 'Failed to create order' });
    } finally {
        client.release();
    }
});

// Get current user's orders
app.get('/api/orders/my', auth, async (req, res) => {
    try {
        const ordersResult = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        const orders = [];
        for (const order of ordersResult.rows) {
            const itemsResult = await pool.query(
                'SELECT * FROM order_items WHERE order_id = $1',
                [order.id]
            );
            orders.push({
                _id: order.id.toString(),
                id: order.id,
                user: { _id: req.user.id.toString(), name: req.user.name, email: req.user.email },
                items: itemsResult.rows.map(i => ({
                    title: i.title,
                    price: parseFloat(i.price),
                    imageUrl: i.image_url,
                    quantity: i.quantity
                })),
                totalAmount: parseFloat(order.total_amount),
                shippingAddress: {
                    fullName: order.shipping_name,
                    address: order.shipping_address,
                    city: order.shipping_city,
                    postalCode: order.shipping_postal_code,
                    phone: order.shipping_phone
                },
                status: order.status,
                createdAt: order.created_at
            });
        }
        res.json(orders);
    } catch (err) {
        console.error('Get my orders error:', err);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Admin: Get all orders
app.get('/api/orders', auth, admin, async (req, res) => {
    try {
        const ordersResult = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        const orders = [];
        for (const order of ordersResult.rows) {
            // Get user info
            const userResult = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [order.user_id]);
            const user = userResult.rows[0] || { id: 0, name: 'Deleted User', email: 'N/A' };
            // Get items
            const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
            orders.push({
                _id: order.id.toString(),
                id: order.id,
                user: { _id: user.id.toString(), name: user.name, email: user.email },
                items: itemsResult.rows.map(i => ({
                    title: i.title,
                    price: parseFloat(i.price),
                    imageUrl: i.image_url,
                    quantity: i.quantity
                })),
                totalAmount: parseFloat(order.total_amount),
                shippingAddress: {
                    fullName: order.shipping_name,
                    address: order.shipping_address,
                    city: order.shipping_city,
                    postalCode: order.shipping_postal_code,
                    phone: order.shipping_phone
                },
                status: order.status,
                createdAt: order.created_at
            });
        }
        res.json(orders);
    } catch (err) {
        console.error('Get all orders error:', err);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Admin: Update order status
app.put('/api/orders/:id/status', auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const order = result.rows[0];
        res.json({ _id: order.id.toString(), status: order.status, message: 'Status updated' });
    } catch (err) {
        console.error('Update order status error:', err);
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

// Admin: Delete order
app.delete('/api/orders/:id', auth, admin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Delete order error:', err);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
        res.json({ status: 'ok', database: 'disconnected' });
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🎨 ART COCKTAIL API running on port ${PORT}`);
    console.log(`🐘 Connected to PostgreSQL database`);
    console.log(`\n📌 Admin login: admin@artcocktail.com / admin123`);
});
