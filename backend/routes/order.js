const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/orders
// @desc    Place a new order (authenticated users)
router.post('/', auth, orderController.createOrder);

// @route   GET /api/orders/my
// @desc    Get current user's orders
router.get('/my', auth, orderController.getMyOrders);

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
router.get('/', auth, admin, orderController.getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Delete order (Admin only)
router.delete('/:id', auth, admin, orderController.deleteOrder);

module.exports = router;
