import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import API from '../services/api';
import ArtworkModal from '../components/ArtworkModal';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['all', 'painting', 'resin', 'abstract', 'portrait', 'landscape', 'modern', 'other'];

/* Scroll reveal wrapper */
function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
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
        <div className="min-h-screen pt-28 pb-20 bg-[var(--bg)]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-6 mb-4">
                        <div className="divider-gold" />
                        <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Collection</p>
                    </div>
                    <h1 className="text-display text-5xl sm:text-6xl md:text-7xl mb-6">
                        The
                        <br />
                        <span className="text-editorial text-[var(--text-muted)]">Gallery</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base max-w-lg leading-relaxed">
                        Explore our curated collection of handcrafted resin artwork, paintings, and mixed-media pieces.
                    </p>
                </motion.div>

                {/* Category filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-3 mb-12"
                >
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleFilter(cat)}
                            className={`text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                                    : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--charcoal)] hover:text-[var(--charcoal)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border border-[var(--border)] border-t-[var(--gold)] rounded-full animate-spin" />
                    </div>
                ) : (
                    /* Masonry Grid */
                    <div className="masonry-grid">
                        {filtered.map((artwork, i) => (
                            <Reveal key={artwork._id} delay={(i % 3) * 0.08}>
                                <div
                                    className="relative overflow-hidden cursor-pointer group"
                                    onClick={() => { setSelectedArtwork(artwork); setModalOpen(true); }}
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={artwork.imageUrl}
                                            alt={artwork.title}
                                            className="w-full object-cover img-dramatic"
                                        />
                                    </div>
                                    {/* Hover overlay — minimal */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700 flex items-end">
                                        <div className="p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold-light)]">{artwork.category}</p>
                                            <h3 className="font-display text-lg font-semibold text-white">{artwork.title}</h3>
                                            <p className="text-white/60 text-sm mt-1">₹{artwork.price?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)] text-editorial text-lg">No artworks found in this category.</p>
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
