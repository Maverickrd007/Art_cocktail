const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['painting', 'resin', 'abstract', 'portrait', 'landscape', 'modern', 'other'],
        default: 'painting'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Artwork', artworkSchema);
