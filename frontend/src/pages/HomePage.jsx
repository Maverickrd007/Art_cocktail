import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';
import API from '../services/api';
import ArtworkModal from '../components/ArtworkModal';
import { useCart } from '../context/CartContext';

/**
 * Immersive homepage with animated mesh gradient hero, parallax effects,
 * floating blobs, and artwork showcase — light theme.
 */
export default function HomePage() {
    const [artworks, setArtworks] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { addToCart } = useCart();
    const { scrollY } = useScroll();

    // Parallax transforms for hero
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const textY = useTransform(scrollY, [0, 300], [0, -50]);

    useEffect(() => {
        API.get('/artworks')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setArtworks(data);
            })
            .catch(err => console.error('Error fetching artworks:', err));
    }, []);

    const openModal = (artwork) => {
        setSelectedArtwork(artwork);
        setModalOpen(true);
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    };

    return (
        <div className="min-h-screen">
            {/* ====== HERO SECTION ====== */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob" />
                    <div className="absolute top-40 right-20 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000" />
                    <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary-light/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000" />
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${4 + Math.random() * 6}px`,
                                height: `${4 + Math.random() * 6}px`,
                                background: i % 2 === 0
                                    ? 'linear-gradient(135deg, #E85D75, #FF8A65)'
                                    : 'linear-gradient(135deg, #6366F1, #818CF8)',
                                opacity: 0.3,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.15, 0.4, 0.15],
                                scale: [1, 1.3, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                            }}
                        />
                    ))}
                </div>

                {/* Background mesh */}
                <motion.div
                    style={{ y: heroY }}
                    className="absolute inset-0 mesh-gradient"
                />

                {/* Hero Content */}
                <motion.div
                    style={{ y: textY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-4 max-w-4xl"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <HiSparkles className="text-primary text-sm" />
                        <span className="text-primary/70 text-xs tracking-[0.4em] uppercase font-medium">Premium Virtual Gallery</span>
                        <HiSparkles className="text-primary text-sm" />
                    </motion.div>

                    <motion.img
                        src="/logo.jpg"
                        alt="Art Cocktail"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-24 sm:h-32 w-auto mx-auto mb-4 object-contain"
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-6xl sm:text-7xl lg:text-8xl font-outfit font-bold mb-2"
                    >
                        <span className="text-gradient-primary">Art</span>{' '}
                        <span className="text-text">Cocktail</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.55 }}
                        className="text-text-muted text-base sm:text-lg italic mb-8 font-outfit"
                    >
                        by Swetnisha Sharma
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Discover an exquisite collection of paintings and resin artwork.
                        Each piece is a masterpiece crafted with passion and precision.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/gallery"
                            className="btn-primary px-10 py-4 rounded-full text-sm tracking-wider uppercase flex items-center gap-2"
                        >
                            Explore Gallery <HiArrowRight />
                        </Link>
                        <a
                            href="#featured"
                            className="text-text-secondary hover:text-primary transition-colors px-8 py-4 border border-border hover:border-primary/30 rounded-full text-sm tracking-wider uppercase"
                        >
                            View Collection
                        </a>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1 h-2 bg-primary rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* ====== FEATURED ARTWORKS ====== */}
            <section id="featured" className="py-24 px-4 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-primary text-xs tracking-[0.4em] uppercase mb-4 font-semibold">Our Collection</p>
                    <h2 className="text-4xl sm:text-5xl font-outfit font-bold text-text mb-4">
                        Featured <span className="text-gradient-primary">Masterpieces</span>
                    </h2>
                    <div className="accent-line max-w-xs mx-auto" />
                </motion.div>

                {/* Artwork Grid */}
                {artworks.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {artworks.slice(0, 6).map((artwork) => (
                            <motion.div
                                key={artwork._id}
                                variants={cardVariants}
                                className="group cursor-pointer"
                                onClick={() => openModal(artwork)}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/5 card-hover">
                                    {/* Image with hover zoom */}
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img
                                            src={artwork.imageUrl}
                                            alt={artwork.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

                                    {/* Content overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500">
                                        <p className="text-primary/80 text-xs tracking-[0.2em] uppercase mb-1 font-semibold">{artwork.category}</p>
                                        <h3 className="text-xl font-outfit font-bold text-text mb-1">{artwork.title}</h3>
                                        <p className="text-text-muted text-xs mb-3">by Swetnisha Sharma</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-2xl font-outfit font-bold text-gradient-primary">
                                                ₹{artwork.price?.toLocaleString('en-IN')}
                                            </p>
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                                            >
                                                View →
                                            </motion.span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-text-muted text-lg">No artworks available yet.</p>
                        <p className="text-text-muted/50 text-sm mt-2">Check back soon for new pieces.</p>
                    </div>
                )}

                {/* View All Link */}
                {artworks.length > 6 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            to="/gallery"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm tracking-wider uppercase font-medium"
                        >
                            View All Artworks <HiArrowRight />
                        </Link>
                    </motion.div>
                )}
            </section>

            {/* ====== CTA SECTION ====== */}
            <section className="py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-white rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden shadow-xl shadow-primary/5"
                >
                    <div className="absolute top-0 left-0 w-60 h-60 bg-primary/5 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-text mb-4">
                            Begin Your Art Journey
                        </h2>
                        <p className="text-text-secondary max-w-lg mx-auto mb-8">
                            Explore our complete collection and find the perfect piece that speaks to your soul.
                        </p>
                        <Link
                            to="/gallery"
                            className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm tracking-wider uppercase"
                        >
                            Enter Gallery <HiArrowRight />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Artwork Modal */}
            <ArtworkModal
                artwork={selectedArtwork}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}
