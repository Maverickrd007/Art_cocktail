import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiArrowDown } from 'react-icons/hi';
import API from '../services/api';
import ArtworkModal from '../components/ArtworkModal';
import { useCart } from '../context/CartContext';

/* ── Fade-in wrapper for scroll-based reveals ── */
function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
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
    const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
    const textY = useTransform(scrollY, [0, 400], [0, -60]);

    useEffect(() => {
        API.get('/artworks')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setArtworks(data);
            })
            .catch(err => console.error(err));
    }, []);

    const openModal = (artwork) => {
        setSelectedArtwork(artwork);
        setModalOpen(true);
    };

    /* Testimonials */
    const testimonials = [
        { name: 'Priya Menon', text: 'The resin artwork transformed our living room into a gallery. Absolutely exquisite craftsmanship.', location: 'Mumbai' },
        { name: 'Arjun Reddy', text: 'Each piece tells a story. The attention to detail and vibrancy of colors is unmatched.', location: 'Hyderabad' },
        { name: 'Sneha Kapoor', text: 'I commissioned a custom piece and was blown away by the result. True artistry.', location: 'Delhi' },
    ];

    return (
        <div className="bg-[var(--bg)]">
            {/* ═══════════ HERO ═══════════ */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background artwork — dramatic oversized */}
                {artworks[0] && (
                    <motion.div
                        style={{ scale: heroScale }}
                        className="absolute inset-0"
                    >
                        <img
                            src={artworks[0].imageUrl}
                            alt=""
                            className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/60 via-[var(--bg)]/80 to-[var(--bg)]" />
                    </motion.div>
                )}

                {/* Hero text */}
                <motion.div
                    style={{ y: textY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-6 max-w-5xl"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-[10px] tracking-[0.5em] uppercase text-[var(--gold)] mb-8"
                    >
                        Art Cocktail — by Swetnisha Sharma
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="text-display text-6xl sm:text-7xl md:text-8xl lg:text-[110px] mb-8"
                    >
                        Resin Art.
                        <br />
                        <span className="text-editorial text-[var(--gold-dark)]">Reimagined.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
                    >
                        Handcrafted resin artwork from Electronic City, Bangalore.
                        Each piece is a one-of-a-kind creation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/gallery" className="btn-outline">
                            <span>Explore Gallery</span>
                            <HiArrowRight className="relative z-1" />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)]">Scroll</span>
                    <HiArrowDown className="text-[var(--text-muted)] animate-scroll-down" />
                </motion.div>
            </section>

            {/* ═══════════ DRAMATIC ARTWORK SHOWCASE ═══════════ */}
            <section className="section-padding">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <Reveal>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="divider-gold" />
                            <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Selected Works</p>
                        </div>
                        <h2 className="text-display text-4xl sm:text-5xl md:text-6xl mb-16">
                            Featured
                            <br />
                            <span className="text-editorial text-[var(--text-muted)]">Collection</span>
                        </h2>
                    </Reveal>

                    {/* Asymmetrical grid — like a gallery exhibition */}
                    <div className="space-y-12">
                        {/* First row — large + small */}
                        {artworks.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <Reveal className="lg:col-span-3">
                                    <div
                                        className="relative overflow-hidden cursor-pointer group"
                                        onClick={() => openModal(artworks[0])}
                                    >
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img
                                                src={artworks[0].imageUrl}
                                                alt={artworks[0].title}
                                                className="w-full h-full object-cover img-dramatic"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                                        <div className="mt-4">
                                            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">{artworks[0].category}</p>
                                            <h3 className="font-display text-2xl font-semibold">{artworks[0].title}</h3>
                                            <p className="text-[var(--text-muted)] text-sm mt-1">₹{artworks[0].price?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </Reveal>

                                {artworks[1] && (
                                    <Reveal className="lg:col-span-2" delay={0.15}>
                                        <div
                                            className="relative overflow-hidden cursor-pointer group"
                                            onClick={() => openModal(artworks[1])}
                                        >
                                            <div className="aspect-[3/4] overflow-hidden">
                                                <img
                                                    src={artworks[1].imageUrl}
                                                    alt={artworks[1].title}
                                                    className="w-full h-full object-cover img-dramatic"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                                            <div className="mt-4">
                                                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">{artworks[1].category}</p>
                                                <h3 className="font-display text-xl font-semibold">{artworks[1].title}</h3>
                                                <p className="text-[var(--text-muted)] text-sm mt-1">₹{artworks[1].price?.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </Reveal>
                                )}
                            </div>
                        )}

                        {/* Second row — small + large */}
                        {artworks.length > 2 && (
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                {artworks[2] && (
                                    <Reveal className="lg:col-span-2">
                                        <div
                                            className="relative overflow-hidden cursor-pointer group"
                                            onClick={() => openModal(artworks[2])}
                                        >
                                            <div className="aspect-[3/4] overflow-hidden">
                                                <img
                                                    src={artworks[2].imageUrl}
                                                    alt={artworks[2].title}
                                                    className="w-full h-full object-cover img-dramatic"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                                            <div className="mt-4">
                                                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">{artworks[2].category}</p>
                                                <h3 className="font-display text-xl font-semibold">{artworks[2].title}</h3>
                                                <p className="text-[var(--text-muted)] text-sm mt-1">₹{artworks[2].price?.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </Reveal>
                                )}

                                {artworks[3] && (
                                    <Reveal className="lg:col-span-3" delay={0.15}>
                                        <div
                                            className="relative overflow-hidden cursor-pointer group"
                                            onClick={() => openModal(artworks[3])}
                                        >
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={artworks[3].imageUrl}
                                                    alt={artworks[3].title}
                                                    className="w-full h-full object-cover img-dramatic"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                                            <div className="mt-4">
                                                <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-1">{artworks[3].category}</p>
                                                <h3 className="font-display text-2xl font-semibold">{artworks[3].title}</h3>
                                                <p className="text-[var(--text-muted)] text-sm mt-1">₹{artworks[3].price?.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </Reveal>
                                )}
                            </div>
                        )}
                    </div>

                    <Reveal delay={0.2}>
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
            <section className="section-padding bg-[var(--bg-alt)]">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <Reveal>
                            <div className="aspect-[4/5] overflow-hidden">
                                {artworks[4] && (
                                    <img
                                        src={artworks[4].imageUrl}
                                        alt="Artist at work"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="max-w-lg">
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="divider-gold" />
                                    <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">The Artist</p>
                                </div>
                                <h2 className="text-display text-4xl sm:text-5xl mb-8">
                                    Swetnisha
                                    <br />
                                    <span className="text-editorial text-[var(--text-muted)]">Sharma</span>
                                </h2>
                                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                                    Based in Electronic City, Bangalore, Swetnisha creates stunning resin and mixed-media
                                    artwork that blends organic fluidity with precise artistic vision. Each piece is
                                    handcrafted with premium materials, making every creation truly one of a kind.
                                </p>
                                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
                                    With a passion for exploring the boundaries of resin art, Swetnisha's work has found
                                    homes in collections across India. Her process involves layering pigments, metallic
                                    elements, and natural textures to create pieces that captivate from every angle.
                                </p>
                                <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                                    <div>
                                        <p className="font-display text-3xl font-semibold text-[var(--charcoal)]">{artworks.length}+</p>
                                        <p className="text-[10px] tracking-[0.2em] uppercase mt-1">Artworks</p>
                                    </div>
                                    <div className="w-px h-12 bg-[var(--border)]" />
                                    <div>
                                        <p className="font-display text-3xl font-semibold text-[var(--charcoal)]">50+</p>
                                        <p className="text-[10px] tracking-[0.2em] uppercase mt-1">Collectors</p>
                                    </div>
                                    <div className="w-px h-12 bg-[var(--border)]" />
                                    <div>
                                        <p className="font-display text-3xl font-semibold text-[var(--charcoal)]">BLR</p>
                                        <p className="text-[10px] tracking-[0.2em] uppercase mt-1">Based in</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════ TESTIMONIALS ═══════════ */}
            <section className="section-padding">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <Reveal>
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-6 mb-4">
                                <div className="divider-gold" />
                                <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Testimonials</p>
                                <div className="divider-gold" />
                            </div>
                            <h2 className="text-display text-4xl sm:text-5xl">
                                What Collectors
                                <br />
                                <span className="text-editorial text-[var(--text-muted)]">Say</span>
                            </h2>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className="border border-[var(--border)] p-8 lg:p-10">
                                    <p className="text-editorial text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
                                        "{t.text}"
                                    </p>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--charcoal)]">{t.name}</p>
                                        <p className="text-[11px] text-[var(--text-muted)]">{t.location}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ CTA ═══════════ */}
            <section className="section-padding bg-[var(--charcoal)]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <Reveal>
                        <p className="text-[10px] tracking-[0.5em] uppercase text-[var(--gold)] mb-8">
                            Commission a Piece
                        </p>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                            Let's Create Something
                            <br />
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
