const Order = require('../models/Order');

/**
 * @route   POST /api/orders
 * @desc    Place a new order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order.' });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address ||
            !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
            return res.status(400).json({ message: 'Complete shipping address is required.' });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            status: 'Pending'
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error creating order.' });
    }
};

/**
 * @route   GET /api/orders/my
 * @desc    Get logged-in user's orders
 * @access  Private
 */
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.artwork', 'title imageUrl')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin only)
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.artwork', 'title imageUrl')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error updating order.' });
    }
};

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order (Admin only)
 * @access  Private/Admin
 */
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.json({ message: 'Order deleted successfully.' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ message: 'Server error deleting order.' });
    }
};
