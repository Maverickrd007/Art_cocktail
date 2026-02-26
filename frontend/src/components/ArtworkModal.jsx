import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiShoppingCart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

/**
 * Full-screen artwork preview modal — light frosted design.
 */
export default function ArtworkModal({ artwork, isOpen, onClose }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    if (!artwork) return null;

    const handleAddToCart = () => {
        addToCart(artwork);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative bg-white rounded-3xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl shadow-black/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-primary transition-colors shadow-md"
                        >
                            <HiX className="text-xl" />
                        </button>

                        {/* Image Section */}
                        <div className="md:w-3/5 h-64 md:h-auto relative overflow-hidden">
                            <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay at bottom for mobile */}
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent md:hidden" />
                        </div>

                        {/* Details Section */}
                        <div className="md:w-2/5 p-8 flex flex-col justify-between overflow-y-auto bg-white">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-primary text-xs tracking-[0.3em] uppercase mb-2 font-semibold"
                                >
                                    {artwork.category}
                                </motion.p>

                                <motion.h2
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl font-outfit font-bold text-text mb-2"
                                >
                                    {artwork.title}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="text-text-muted text-sm mb-6"
                                >
                                    by Swetnisha Sharma
                                </motion.p>

                                <div className="accent-line mb-6" />

                                <motion.p
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-text-secondary text-sm leading-relaxed mb-8"
                                >
                                    {artwork.description}
                                </motion.p>
                            </div>

                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <p className="text-4xl font-outfit font-bold text-gradient-primary mb-6">
                                        ₹{artwork.price?.toLocaleString('en-IN')}
                                    </p>

                                    <button
                                        onClick={handleAddToCart}
                                        className={`w-full py-4 rounded-2xl font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${added
                                            ? 'bg-emerald text-white shadow-lg shadow-emerald/30'
                                            : 'btn-primary'
                                            }`}
                                    >
                                        <HiShoppingCart className="text-lg" />
                                        {added ? 'Added to Cart!' : 'Add to Cart'}
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
