import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';

const STATUS_COLORS = {
    Pending: 'bg-amber-50 text-amber-600 border-amber-200',
    Shipped: 'bg-blue-50 text-blue-600 border-blue-200',
    Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/orders/my')
            .then(res => { setOrders(Array.isArray(res.data) ? res.data : []); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3 font-semibold">My Account</p>
                <h1 className="text-5xl font-outfit font-bold text-text mb-4">
                    Order <span className="text-gradient-primary">History</span>
                </h1>
                <div className="accent-line max-w-xs mx-auto" />
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin" />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 text-text-muted">
                    <p className="text-lg">No orders yet.</p>
                    <p className="text-sm mt-2">Start shopping to see your order history here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, i) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-text-muted text-xs">Order ID</p>
                                    <p className="text-text text-sm font-mono">{order._id}</p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs">Date</p>
                                    <p className="text-text text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[order.status] || ''}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="accent-line mb-4" />

                            <div className="space-y-3">
                                {order.items.map((item, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <img
                                            src={item.imageUrl || item.artwork?.imageUrl}
                                            alt={item.title || item.artwork?.title}
                                            className="w-12 h-12 object-cover rounded-xl"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-text text-sm truncate">{item.title || item.artwork?.title}</p>
                                            <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-primary text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="accent-line my-4" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-text-muted text-xs">Shipping to</p>
                                    <p className="text-text-secondary text-sm">{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-text-muted text-xs">Total</p>
                                    <p className="text-xl font-outfit font-bold text-gradient-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
