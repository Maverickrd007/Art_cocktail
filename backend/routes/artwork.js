const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

// @route   GET /api/artworks
// @desc    Get all artworks (public)
router.get('/', artworkController.getAllArtworks);

// @route   GET /api/artworks/:id
// @desc    Get single artwork (public)
router.get('/:id', artworkController.getArtworkById);

// @route   POST /api/artworks
// @desc    Create new artwork (Admin only, with image upload)
router.post('/', auth, admin, upload.single('image'), artworkController.createArtwork);

// @route   PUT /api/artworks/:id
// @desc    Update artwork (Admin only, optional image upload)
router.put('/:id', auth, admin, upload.single('image'), artworkController.updateArtwork);

// @route   DELETE /api/artworks/:id
// @desc    Delete artwork (Admin only)
router.delete('/:id', auth, admin, artworkController.deleteArtwork);

module.exports = router;
