import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';

const STATUS_STYLES = {
    Pending: 'text-amber-600',
    Shipped: 'text-blue-600',
    Delivered: 'text-emerald-600',
    Cancelled: 'text-red-600',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/orders/my')
            .then(res => { setOrders(Array.isArray(res.data) ? res.data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--bg)]">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="divider-gold" />
                        <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Account</p>
                    </div>
                    <h1 className="text-display text-4xl sm:text-5xl">
                        Order <span className="text-editorial text-[var(--text-muted)]">History</span>
                    </h1>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border border-[var(--border)] border-t-[var(--gold)] rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)] text-editorial text-lg">No orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {orders.map((order, i) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-[var(--border)] py-8"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div>
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Order</p>
                                        <p className="text-sm font-mono text-[var(--text-secondary)]">{order._id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Date</p>
                                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    </div>
                                    <span className={`text-[10px] tracking-[0.2em] uppercase font-medium ${STATUS_STYLES[order.status] || ''}`}>
                                        {order.status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Total</p>
                                        <p className="font-display text-lg font-semibold">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <img src={item.imageUrl || item.artwork?.imageUrl} alt="" className="w-10 h-10 object-cover" />
                                            <span className="text-sm text-[var(--text-secondary)] flex-1 truncate">{item.title || item.artwork?.title}</span>
                                            <span className="text-xs text-[var(--text-muted)]">×{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
