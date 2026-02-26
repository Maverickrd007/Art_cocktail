import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShoppingCart, HiMenu, HiX, HiUser } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Premium frosted glass Navbar — light theme with Art Cocktail logo.
 */
export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/gallery', label: 'Gallery' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 glass-strong"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.jpg"
                            alt="Art Cocktail"
                            className="h-12 w-auto object-contain"
                        />
                        <div>
                            <h1 className="text-xl font-outfit font-bold text-gradient-primary group-hover:opacity-80 transition-opacity leading-tight">
                                Art Cocktail
                            </h1>
                            <p className="text-[10px] tracking-[0.15em] text-text-muted italic">by Swetnisha Sharma</p>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-text-secondary hover:text-primary transition-colors duration-300 text-sm tracking-wider uppercase font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="text-text-secondary hover:text-primary transition-colors duration-300 text-sm tracking-wider uppercase font-medium"
                            >
                                Dashboard
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link
                                to="/orders"
                                className="text-text-secondary hover:text-primary transition-colors duration-300 text-sm tracking-wider uppercase font-medium"
                            >
                                Orders
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Cart Icon */}
                        <Link to="/cart" className="relative group p-2">
                            <HiShoppingCart className="text-2xl text-text-secondary group-hover:text-primary transition-colors" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-primary-light text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-secondary-light flex items-center justify-center">
                                        <HiUser className="text-white text-sm" />
                                    </div>
                                    <span className="font-medium">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-text-muted hover:text-primary transition-colors border border-border hover:border-primary/30 px-4 py-1.5 rounded-full"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-sm text-text-secondary hover:text-primary transition-colors font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-sm px-5 py-2 rounded-full"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-text text-2xl p-2"
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
                        className="md:hidden glass overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-text-secondary hover:text-primary transition-colors py-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-text-secondary hover:text-primary py-2">
                                    Dashboard
                                </Link>
                            )}
                            {isAuthenticated && (
                                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-text-secondary hover:text-primary py-2">
                                    Orders
                                </Link>
                            )}
                            <Link to="/cart" onClick={() => setMobileOpen(false)} className="block text-text-secondary hover:text-primary py-2">
                                Cart ({cartCount})
                            </Link>
                            <div className="accent-line my-3" />
                            {isAuthenticated ? (
                                <button onClick={handleLogout} className="text-text-muted hover:text-primary transition-colors">
                                    Logout
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-primary">Login</Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary px-4 py-1.5 rounded-full text-sm">Register</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
