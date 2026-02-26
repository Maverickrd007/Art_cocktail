import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-[#F6F3EE]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/logo.jpg" alt="Art Cocktail" className="h-10 w-auto object-contain" />
                        <div>
                            <span className="font-display text-lg font-semibold tracking-tight text-[var(--charcoal)]">
                                Art Cocktail
                            </span>
                            <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                                by Swetnisha Sharma
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/gallery', label: 'Gallery' },
                            ...(isAdmin ? [{ to: '/admin', label: 'Dashboard' }] : []),
                            ...(isAuthenticated ? [{ to: '/orders', label: 'Orders' }] : []),
                        ].map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--charcoal)] transition-colors duration-300"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/cart"
                            className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--charcoal)] transition-colors relative"
                        >
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-4 w-4 h-4 bg-[var(--gold)] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] tracking-[0.1em] text-[var(--text-muted)]">
                                    {user?.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    to="/login"
                                    className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--charcoal)] transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-outline px-5 py-2 text-[10px]"
                                >
                                    <span>Register</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-[var(--charcoal)] text-2xl"
                    >
                        {mobileOpen ? <HiX /> : <HiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[var(--bg)]/98 backdrop-blur-lg border-t border-[var(--border)]"
                    >
                        <div className="px-6 py-8 space-y-4">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/gallery', label: 'Gallery' },
                                { to: '/cart', label: `Cart (${cartCount})` },
                                ...(isAdmin ? [{ to: '/admin', label: 'Dashboard' }] : []),
                                ...(isAuthenticated ? [{ to: '/orders', label: 'Orders' }] : []),
                            ].map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-[12px] tracking-[0.2em] uppercase text-[var(--text-secondary)] hover:text-[var(--charcoal)] py-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="divider my-4" />
                            {isAuthenticated ? (
                                <button onClick={handleLogout} className="text-[12px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                                    Logout
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-[12px] tracking-[0.2em] uppercase text-[var(--text-secondary)]">Login</Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-outline px-4 py-2 text-[10px]"><span>Register</span></Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
