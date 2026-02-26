import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiTrash, HiMinus, HiPlus, HiArrowRight, HiShoppingCart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Checkout form state
    const [showCheckout, setShowCheckout] = useState(false);
    const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', postalCode: '', phone: '' });
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setOrderLoading(true);
        setError('');
        try {
            const items = cartItems.map(item => ({
                artwork: item._id,
                title: item.title,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: item.quantity
            }));
            await API.post('/orders', {
                items,
                totalAmount: cartTotal,
                shippingAddress: shipping
            });
            clearCart();
            setOrderSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order.');
        } finally {
            setOrderLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-20 mesh-gradient">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-12 text-center max-w-lg shadow-xl shadow-black/5"
                >
                    <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-emerald">✓</span>
                    </div>
                    <h2 className="text-3xl font-outfit font-bold text-text mb-3">Order Placed!</h2>
                    <p className="text-text-secondary mb-8">Thank you for your purchase. You can track your order in the Orders page.</p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/orders" className="btn-primary px-6 py-3 rounded-full text-sm">View Orders</Link>
                        <Link to="/gallery" className="text-primary border border-primary/30 px-6 py-3 rounded-full text-sm hover:bg-primary-50 transition-colors font-medium">Continue Shopping</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3 font-semibold">Shopping</p>
                <h1 className="text-5xl font-outfit font-bold text-text mb-4">
                    Your <span className="text-gradient-primary">Cart</span>
                </h1>
                <div className="accent-line max-w-xs mx-auto" />
            </motion.div>

            {cartItems.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <HiShoppingCart className="text-6xl text-border mx-auto mb-4" />
                    <p className="text-text-muted text-lg mb-6">Your cart is empty</p>
                    <Link to="/gallery" className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm">
                        Browse Gallery <HiArrowRight />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cartItems.map(item => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm shadow-black/5"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-text font-outfit font-semibold truncate">{item.title}</h3>
                                        <p className="text-text-muted text-xs mt-0.5">by Swetnisha Sharma</p>
                                        <p className="text-primary font-outfit font-bold mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-text-muted hover:text-red-500 transition-colors p-1"
                                        >
                                            <HiTrash />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"
                                            >
                                                <HiMinus className="text-xs" />
                                            </button>
                                            <span className="text-text text-sm w-6 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"
                                            >
                                                <HiPlus className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary / Checkout */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5">
                            <h3 className="text-lg font-outfit font-bold text-text mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-4">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span className="text-text-muted truncate mr-2">{item.title} ×{item.quantity}</span>
                                        <span className="text-text-secondary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="accent-line my-4" />
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-text">Total</span>
                                <span className="text-gradient-primary font-outfit">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>

                            {!showCheckout ? (
                                <button
                                    onClick={() => {
                                        if (!isAuthenticated) { navigate('/login'); return; }
                                        setShowCheckout(true);
                                    }}
                                    className="w-full btn-primary py-3.5 rounded-2xl font-semibold text-sm tracking-wider uppercase mt-6"
                                >
                                    Proceed to Checkout
                                </button>
                            ) : null}
                        </div>

                        {/* Checkout Form */}
                        <AnimatePresence>
                            {showCheckout && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white rounded-2xl p-6 overflow-hidden shadow-sm shadow-black/5"
                                >
                                    <h3 className="text-lg font-outfit font-bold text-text mb-4">Shipping Details</h3>
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-2xl mb-4">
                                            {error}
                                        </div>
                                    )}
                                    <form onSubmit={handleCheckout} className="space-y-3">
                                        {[
                                            { key: 'fullName', label: 'Full Name', type: 'text' },
                                            { key: 'address', label: 'Address', type: 'text' },
                                            { key: 'city', label: 'City', type: 'text' },
                                            { key: 'postalCode', label: 'Postal Code', type: 'text' },
                                            { key: 'phone', label: 'Phone', type: 'tel' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label className="text-text-muted text-xs uppercase block mb-1 font-medium">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    required
                                                    value={shipping[field.key]}
                                                    onChange={e => setShipping({ ...shipping, [field.key]: e.target.value })}
                                                    className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-xl px-3 py-2.5 text-text text-sm outline-none transition-all"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="submit"
                                            disabled={orderLoading}
                                            className="w-full btn-primary py-3.5 rounded-2xl font-semibold text-sm tracking-wider uppercase mt-4 disabled:opacity-50"
                                        >
                                            {orderLoading ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
