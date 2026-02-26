const Artwork = require('../models/Artwork');
const fs = require('fs');
const path = require('path');

/**
 * @route   GET /api/artworks
 * @desc    Get all artworks (with optional category filter)
 * @access  Public
 */
exports.getAllArtworks = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category && category !== 'all' ? { category } : {};

        const artworks = await Artwork.find(filter).sort({ createdAt: -1 });
        res.json(artworks);
    } catch (error) {
        console.error('Get artworks error:', error);
        res.status(500).json({ message: 'Server error fetching artworks.' });
    }
};

/**
 * @route   GET /api/artworks/:id
 * @desc    Get single artwork by ID
 * @access  Public
 */
exports.getArtworkById = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found.' });
        }
        res.json(artwork);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

/**
 * @route   POST /api/artworks
 * @desc    Create a new artwork (Admin only)
 * @access  Private/Admin
 */
exports.createArtwork = async (req, res) => {
    try {
        const { title, description, price, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        // Build image URL from uploaded file
        const imageUrl = `/uploads/${req.file.filename}`;

        const artwork = await Artwork.create({
            title,
            description,
            price: parseFloat(price),
            imageUrl,
            category
        });

        res.status(201).json(artwork);
    } catch (error) {
        console.error('Create artwork error:', error);
        res.status(500).json({ message: 'Server error creating artwork.' });
    }
};

/**
 * @route   PUT /api/artworks/:id
 * @desc    Update an artwork (Admin only)
 * @access  Private/Admin
 */
exports.updateArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found.' });
        }

        const { title, description, price, category } = req.body;

        // Update fields
        if (title) artwork.title = title;
        if (description) artwork.description = description;
        if (price) artwork.price = parseFloat(price);
        if (category) artwork.category = category;

        // If a new image file was uploaded, replace the old one
        if (req.file) {
            // Delete old image file if it exists
            const oldImagePath = path.join(__dirname, '..', artwork.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            artwork.imageUrl = `/uploads/${req.file.filename}`;
        }

        await artwork.save();
        res.json(artwork);
    } catch (error) {
        console.error('Update artwork error:', error);
        res.status(500).json({ message: 'Server error updating artwork.' });
    }
};

/**
 * @route   DELETE /api/artworks/:id
 * @desc    Delete an artwork (Admin only)
 * @access  Private/Admin
 */
exports.deleteArtwork = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found.' });
        }

        // Delete the image file
        const imagePath = path.join(__dirname, '..', artwork.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Artwork.findByIdAndDelete(req.params.id);
        res.json({ message: 'Artwork deleted successfully.' });
    } catch (error) {
        console.error('Delete artwork error:', error);
        res.status(500).json({ message: 'Server error deleting artwork.' });
    }
};
