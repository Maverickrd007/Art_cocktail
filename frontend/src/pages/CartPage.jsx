import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiTrash, HiMinus, HiPlus, HiArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);
    const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', postalCode: '', phone: '' });
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { navigate('/login'); return; }
        setOrderLoading(true);
        setError('');
        try {
            const items = cartItems.map(item => ({
                artwork: item._id, title: item.title, price: item.price,
                imageUrl: item.imageUrl, quantity: item.quantity
            }));
            await API.post('/orders', { items, totalAmount: cartTotal, shippingAddress: shipping });
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
            <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--bg)]">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md">
                    <p className="text-[var(--gold)] text-5xl mb-6 font-display">✓</p>
                    <h2 className="text-display text-3xl mb-3">Order Placed</h2>
                    <p className="text-[var(--text-muted)] text-sm mb-8">Thank you. You can track your order in the Orders page.</p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/orders" className="btn-filled"><span>View Orders</span></Link>
                        <Link to="/gallery" className="btn-outline"><span>Continue</span></Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-[var(--bg)]">
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="divider-gold" />
                        <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Shopping</p>
                    </div>
                    <h1 className="text-display text-4xl sm:text-5xl">
                        Your <span className="text-editorial text-[var(--text-muted)]">Cart</span>
                    </h1>
                </motion.div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)] text-editorial text-lg mb-6">Your cart is empty</p>
                        <Link to="/gallery" className="btn-outline"><span>Browse Gallery</span><HiArrowRight className="relative z-1" /></Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-0">
                            {cartItems.map((item, i) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex gap-4 py-6 border-b border-[var(--border)]"
                                >
                                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display text-base font-semibold truncate">{item.title}</h3>
                                        <p className="text-[var(--text-muted)] text-xs mt-0.5">by Swetnisha Sharma</p>
                                        <p className="text-[var(--gold-dark)] font-display font-semibold mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <button onClick={() => removeFromCart(item._id)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors"><HiTrash /></button>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-6 h-6 border border-[var(--border)] flex items-center justify-center text-xs hover:border-[var(--charcoal)] transition-colors"><HiMinus /></button>
                                            <span className="text-sm w-5 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-6 h-6 border border-[var(--border)] flex items-center justify-center text-xs hover:border-[var(--charcoal)] transition-colors"><HiPlus /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="border border-[var(--border)] p-6">
                                <h3 className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-4">Summary</h3>
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between text-sm mb-2">
                                        <span className="text-[var(--text-muted)] truncate mr-2">{item.title} ×{item.quantity}</span>
                                        <span className="text-[var(--text-secondary)]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                                <div className="divider my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Total</span>
                                    <span className="font-display text-xl font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                {!showCheckout && (
                                    <button onClick={() => { if (!isAuthenticated) { navigate('/login'); return; } setShowCheckout(true); }}
                                        className="btn-filled w-full justify-center mt-6"><span>Checkout</span></button>
                                )}
                            </div>

                            <AnimatePresence>
                                {showCheckout && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="border border-[var(--border)] p-6 overflow-hidden">
                                        <h3 className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-4">Shipping</h3>
                                        {error && <div className="border border-red-200 text-red-600 text-sm px-3 py-2 mb-4">{error}</div>}
                                        <form onSubmit={handleCheckout} className="space-y-4">
                                            {[
                                                { key: 'fullName', label: 'Full Name', type: 'text' },
                                                { key: 'address', label: 'Address', type: 'text' },
                                                { key: 'city', label: 'City', type: 'text' },
                                                { key: 'postalCode', label: 'Postal Code', type: 'text' },
                                                { key: 'phone', label: 'Phone', type: 'tel' },
                                            ].map(f => (
                                                <div key={f.key}>
                                                    <label className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-1">{f.label}</label>
                                                    <input type={f.type} required value={shipping[f.key]}
                                                        onChange={e => setShipping({ ...shipping, [f.key]: e.target.value })}
                                                        className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--charcoal)] py-2 text-sm outline-none transition-colors" />
                                                </div>
                                            ))}
                                            <button type="submit" disabled={orderLoading} className="btn-filled w-full justify-center mt-4 disabled:opacity-50">
                                                <span>{orderLoading ? 'Placing...' : 'Place Order'}</span>
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
