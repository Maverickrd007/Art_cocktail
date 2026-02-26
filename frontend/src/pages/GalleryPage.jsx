import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import ArtworkModal from '../components/ArtworkModal';
import { useCart } from '../context/CartContext';
import { HiShoppingCart } from 'react-icons/hi';

const CATEGORIES = ['all', 'painting', 'resin', 'abstract', 'portrait', 'landscape', 'modern', 'other'];

/**
 * Full gallery page with category filtering, grid layout,
 * hover effects, and artwork modal — light theme.
 */
export default function GalleryPage() {
    const [artworks, setArtworks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        API.get('/artworks')
            .then(res => {
                setArtworks(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Filter by category
    useEffect(() => {
        if (activeCategory === 'all') {
            setFiltered(artworks);
        } else {
            setFiltered(artworks.filter(a => a.category === activeCategory));
        }
    }, [activeCategory, artworks]);

    const openModal = (artwork) => {
        setSelectedArtwork(artwork);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3 font-semibold">Browse Collection</p>
                <h1 className="text-5xl font-outfit font-bold text-text mb-4">
                    Our <span className="text-gradient-primary">Gallery</span>
                </h1>
                <div className="accent-line max-w-xs mx-auto" />
            </motion.div>

            {/* Category Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mb-12"
            >
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-medium ${activeCategory === cat
                            ? 'btn-primary'
                            : 'border border-border text-text-secondary hover:text-primary hover:border-primary/30 bg-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin" />
                </div>
            ) : filtered.length > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filtered.map((artwork, i) => (
                        <motion.div
                            key={artwork._id}
                            layout
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            exit={{ opacity: 0 }}
                            className="group cursor-pointer"
                        >
                            <div
                                className="bg-white rounded-2xl overflow-hidden transition-all duration-500 shadow-md shadow-black/5 card-hover"
                                onClick={() => openModal(artwork)}
                            >
                                {/* Image */}
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    <img
                                        src={artwork.imageUrl}
                                        alt={artwork.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Quick add button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="absolute bottom-3 right-3 w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(artwork);
                                        }}
                                    >
                                        <HiShoppingCart />
                                    </motion.button>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="text-primary/60 text-[10px] tracking-[0.2em] uppercase font-semibold">{artwork.category}</p>
                                    <h3 className="text-base font-outfit font-semibold text-text mt-1 truncate">{artwork.title}</h3>
                                    <p className="text-text-muted text-xs mt-0.5">by Swetnisha Sharma</p>
                                    <p className="text-xl font-outfit font-bold text-gradient-primary mt-2">
                                        ₹{artwork.price?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-text-muted text-lg">No artworks found in this category.</p>
                </div>
            )}

            {/* Artwork Modal */}
            <ArtworkModal
                artwork={selectedArtwork}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}
