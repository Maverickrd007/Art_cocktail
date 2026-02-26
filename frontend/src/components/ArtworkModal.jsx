import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

/**
 * Fullscreen dark backdrop modal — cinematic art viewing experience.
 */
export default function ArtworkModal({ artwork, isOpen, onClose, onAddToCart }) {
    if (!artwork) return null;

    const handleAdd = () => {
        onAddToCart(artwork);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
                    onClick={onClose}
                >
                    {/* Dark backdrop */}
                    <div className="absolute inset-0 bg-black/90" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                        <HiX className="text-xl" />
                    </button>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl w-full max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                className="max-w-full max-h-[75vh] object-contain"
                            />
                        </div>

                        {/* Details */}
                        <div className="lg:w-80 flex flex-col justify-center text-white">
                            <p className="text-[9px] tracking-[0.4em] uppercase text-[var(--gold)] mb-3">
                                {artwork.category}
                            </p>
                            <h2 className="font-display text-3xl lg:text-4xl font-semibold mb-2">
                                {artwork.title}
                            </h2>
                            <p className="text-white/40 text-sm mb-6">
                                by Swetnisha Sharma
                            </p>

                            <div className="w-12 h-px bg-[var(--gold)] mb-6" />

                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                {artwork.description}
                            </p>

                            <p className="font-display text-2xl font-semibold text-[var(--gold-light)] mb-8">
                                ₹{artwork.price?.toLocaleString('en-IN')}
                            </p>

                            <button onClick={handleAdd} className="btn-gold w-full justify-center">
                                <span>Add to Collection</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
