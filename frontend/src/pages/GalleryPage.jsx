import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import API from '../services/api';
import ArtworkModal from '../components/ArtworkModal';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['all', 'painting', 'resin', 'abstract', 'portrait', 'landscape', 'modern', 'other'];

function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

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
                const data = Array.isArray(res.data) ? res.data : [];
                setArtworks(data);
                setFiltered(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleFilter = (cat) => {
        setActiveCategory(cat);
        setFiltered(cat === 'all' ? artworks : artworks.filter(a => a.category === cat));
    };

    return (
        <div className="min-h-screen bg-[var(--bg)]">

            {/* ── Page Header ── centered, generous top space ── */}
            <div className="pt-40 pb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)] mb-6">Collection</p>
                    <h1 className="text-display text-5xl sm:text-6xl md:text-7xl mb-5">
                        The Gallery
                    </h1>
                    <p className="text-[var(--text-muted)] text-base max-w-lg mx-auto leading-relaxed">
                        Explore our curated collection of handcrafted resin artwork,
                        paintings, and mixed-media pieces.
                    </p>
                </motion.div>
            </div>

            {/* ── Category Filters ── centered pills ── */}
            <div className="flex justify-center px-6 mb-14">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleFilter(cat)}
                            className={`px-6 py-2.5 rounded-full text-[11px] tracking-[0.08em] capitalize font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-[var(--charcoal)] text-white shadow-lg shadow-black/10'
                                    : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--charcoal)] hover:text-white shadow-sm'
                                }`}
                        >
                            {cat === 'all' ? 'All Works' : cat}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* ── Artwork Grid ── */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-28">
                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-8 h-8 border border-[var(--border)] border-t-[var(--gold)] rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-[var(--text-muted)] text-editorial text-lg">No artworks in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                        {filtered.map((artwork, i) => (
                            <Reveal key={artwork._id} delay={(i % 3) * 0.07}>
                                <div
                                    className="cursor-pointer group"
                                    onClick={() => { setSelectedArtwork(artwork); setModalOpen(true); }}
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden aspect-[3/4] mb-5">
                                        <img
                                            src={artwork.imageUrl}
                                            alt={artwork.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <span className="text-white text-[10px] tracking-[0.15em] uppercase font-medium">View Details</span>
                                            <span className="text-white/90 text-sm font-display font-semibold">₹{artwork.price?.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    {/* Info — centered */}
                                    <div className="text-center">
                                        <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--gold)] font-medium mb-1.5">{artwork.category}</p>
                                        <h3 className="font-display text-lg font-semibold text-[var(--charcoal)] leading-snug">{artwork.title}</h3>
                                        <p className="text-[var(--text-muted)] text-xs mt-1.5">by Swetnisha Sharma</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>

            <ArtworkModal
                artwork={selectedArtwork}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddToCart={addToCart}
            />
        </div>
    );
}
