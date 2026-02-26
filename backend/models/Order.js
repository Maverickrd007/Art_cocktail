const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        artwork: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artwork',
            required: true
        },
        title: String,
        price: Number,
        imageUrl: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
