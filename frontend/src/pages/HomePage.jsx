import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiArrowDown } from 'react-icons/hi';
import API from '../services/api';
import ArtworkModal from '../components/ArtworkModal';
import { useCart } from '../context/CartContext';

/* ── Scroll-based reveal ── */
function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function HomePage() {
    const [artworks, setArtworks] = useState([]);
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { addToCart } = useCart();
    const { scrollY } = useScroll();

    const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 600], [1, 1.05]);
    const textY = useTransform(scrollY, [0, 400], [0, -50]);

    useEffect(() => {
        API.get('/artworks')
            .then(res => setArtworks(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error(err));
    }, []);

    const openModal = (artwork) => {
        setSelectedArtwork(artwork);
        setModalOpen(true);
    };

    return (
        <div className="bg-[var(--bg)]">

            {/* ═══════════ HERO ═══════════ */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {artworks[0] && (
                    <motion.div style={{ scale: heroScale }} className="absolute inset-0">
                        <img src={artworks[0].imageUrl} alt="" className="w-full h-full object-cover opacity-15" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 via-[var(--bg)]/70 to-[var(--bg)]" />
                    </motion.div>
                )}

                <motion.div style={{ y: textY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-[10px] tracking-[0.5em] uppercase text-[var(--gold)] mb-8"
                    >
                        Art Cocktail — by Swetnisha Sharma
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="text-display text-6xl sm:text-7xl md:text-8xl lg:text-[110px] mb-8"
                    >
                        Resin Art.
                        <br />
                        <span className="text-editorial text-[var(--gold-dark)]">Reimagined.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
                    >
                        Handcrafted resin artwork from Electronic City, Bangalore.
                        Each piece is a one-of-a-kind creation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        <Link to="/gallery" className="btn-outline">
                            <span>Explore Gallery</span>
                            <HiArrowRight className="relative z-1" />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)]">Scroll</span>
                    <HiArrowDown className="text-[var(--text-muted)] animate-scroll-down" />
                </motion.div>
            </section>

            {/* ═══════════ FEATURED COLLECTION ═══════════ */}
            <section className="py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-8 lg:px-16">
                    <Reveal>
                        <div className="text-center mb-20">
                            <div className="flex items-center justify-center gap-6 mb-4">
                                <div className="divider-gold" />
                                <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Selected Works</p>
                                <div className="divider-gold" />
                            </div>
                            <h2 className="text-display text-4xl sm:text-5xl md:text-6xl">
                                Featured <span className="text-editorial text-[var(--text-muted)]">Collection</span>
                            </h2>
                        </div>
                    </Reveal>

                    {/* Row 1: Two equal columns */}
                    {artworks.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {artworks.slice(0, 2).map((art, i) => (
                                <Reveal key={art._id} delay={i * 0.12}>
                                    <div className="cursor-pointer group" onClick={() => openModal(art)}>
                                        <div className="aspect-[4/3] overflow-hidden mb-5">
                                            <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover img-dramatic" />
                                        </div>
                                        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">{art.category}</p>
                                        <h3 className="font-display text-xl lg:text-2xl font-semibold mb-1">{art.title}</h3>
                                        <p className="text-[var(--text-muted)] text-sm">₹{art.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {/* Row 2: Three equal columns */}
                    {artworks.length > 2 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {artworks.slice(2, 5).map((art, i) => (
                                <Reveal key={art._id} delay={i * 0.1}>
                                    <div className="cursor-pointer group" onClick={() => openModal(art)}>
                                        <div className="aspect-[3/4] overflow-hidden mb-5">
                                            <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover img-dramatic" />
                                        </div>
                                        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">{art.category}</p>
                                        <h3 className="font-display text-lg font-semibold mb-1">{art.title}</h3>
                                        <p className="text-[var(--text-muted)] text-sm">₹{art.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {/* Row 3: Full-width cinematic piece */}
                    {artworks[5] && (
                        <Reveal>
                            <div className="cursor-pointer group" onClick={() => openModal(artworks[5])}>
                                <div className="aspect-[21/9] overflow-hidden mb-5">
                                    <img src={artworks[5].imageUrl} alt={artworks[5].title} className="w-full h-full object-cover img-dramatic" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">{artworks[5].category}</p>
                                    <h3 className="font-display text-2xl font-semibold mb-1">{artworks[5].title}</h3>
                                    <p className="text-[var(--text-muted)] text-sm">₹{artworks[5].price?.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </Reveal>
                    )}

                    <Reveal delay={0.15}>
                        <div className="text-center mt-16">
                            <Link to="/gallery" className="btn-outline">
                                <span>View Full Collection</span>
                                <HiArrowRight className="relative z-1" />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════ ABOUT THE ARTIST ═══════════ */}
            <section className="py-24 lg:py-32 bg-[var(--bg-alt)]">
                <div className="max-w-7xl mx-auto px-8 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <Reveal>
                            <div className="aspect-[4/5] overflow-hidden bg-[var(--border)]">
                                {artworks[4] ? (
                                    <img src={artworks[4].imageUrl} alt="Artwork" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                        <span className="text-editorial text-lg">Artist Portrait</span>
                                    </div>
                                )}
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div>
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="divider-gold" />
                                    <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">The Artist</p>
                                </div>
                                <h2 className="text-display text-4xl sm:text-5xl mb-8">
                                    Swetnisha <span className="text-editorial text-[var(--text-muted)]">Sharma</span>
                                </h2>
                                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                                    Based in Electronic City, Bangalore, Swetnisha creates stunning resin and mixed-media
                                    artwork that blends organic fluidity with precise artistic vision. Each piece is
                                    handcrafted with premium materials, making every creation truly one of a kind.
                                </p>
                                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-10">
                                    With a passion for exploring the boundaries of resin art, her process involves layering pigments,
                                    metallic elements, and natural textures to create pieces that captivate from every angle.
                                </p>
                                <div className="flex items-center gap-8">
                                    <div>
                                        <p className="font-display text-3xl font-semibold text-[var(--charcoal)]">{artworks.length}+</p>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] mt-1">Artworks</p>
                                    </div>
                                    <div className="w-px h-12 bg-[var(--border)]" />
                                    <div>
                                        <p className="font-display text-3xl font-semibold text-[var(--charcoal)]">50+</p>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] mt-1">Collectors</p>
                                    </div>
                                    <div className="w-px h-12 bg-[var(--border)]" />
                                    <div>
                                        <p className="font-display text-3xl font-semibold text-[var(--charcoal)]">BLR</p>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] mt-1">Based in</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════ CTA BANNER ═══════════ */}
            <section className="py-24 lg:py-32 bg-[var(--charcoal)]">
                <div className="max-w-3xl mx-auto px-8">
                    <Reveal className="flex flex-col items-center text-center">
                        <p className="text-[10px] tracking-[0.5em] uppercase text-[var(--gold)] mb-8">Commission a Piece</p>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                            Let's Create Something <br />
                            <span className="text-editorial text-[var(--gold-light)]">Extraordinary</span>
                        </h2>
                        <p className="text-white/50 text-base max-w-md mx-auto mb-10 leading-relaxed">
                            Every space deserves art that speaks. Commission a custom piece tailored to your vision.
                        </p>
                        <Link to="/gallery" className="btn-gold">
                            <span>Browse Collection</span>
                            <HiArrowRight />
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* Modal */}
            <ArtworkModal
                artwork={selectedArtwork}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddToCart={addToCart}
            />
        </div>
    );
}
