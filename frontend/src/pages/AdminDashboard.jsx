import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { HiPlus, HiPencil, HiTrash, HiPhotograph, HiX } from 'react-icons/hi';

const CATEGORIES = ['painting', 'resin', 'abstract', 'portrait', 'landscape', 'modern', 'other'];
const STATUS_OPTIONS = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
    Pending: 'bg-amber-50 text-amber-600 border-amber-200',
    Shipped: 'bg-blue-50 text-blue-600 border-blue-200',
    Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

/**
 * Admin Dashboard — light theme with tabs for managing artworks and orders.
 */
export default function AdminDashboard() {
    const [tab, setTab] = useState('artworks');
    const [artworks, setArtworks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Artwork form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', category: 'painting' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    // Fetch data
    useEffect(() => {
        fetchArtworks();
        fetchOrders();
    }, []);

    const fetchArtworks = async () => {
        try {
            const res = await API.get('/artworks');
            setArtworks(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchOrders = async () => {
        try {
            const res = await API.get('/orders');
            setOrders(res.data);
        } catch (err) { console.error(err); }
    };

    // ---- Artwork CRUD ----
    const openNewForm = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', price: '', category: 'painting' });
        setImageFile(null);
        setImagePreview('');
        setFormError('');
        setShowForm(true);
    };

    const openEditForm = (artwork) => {
        setEditingId(artwork._id);
        setFormData({
            title: artwork.title,
            description: artwork.description,
            price: artwork.price,
            category: artwork.category
        });
        setImageFile(null);
        setImagePreview(artwork.imageUrl);
        setFormError('');
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');

        try {
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('description', formData.description);
            fd.append('price', formData.price);
            fd.append('category', formData.category);
            if (imageFile) fd.append('image', imageFile);

            if (editingId) {
                await API.put(`/artworks/${editingId}`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                if (!imageFile) {
                    setFormError('Image is required for new artwork.');
                    setFormLoading(false);
                    return;
                }
                await API.post('/artworks', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setShowForm(false);
            fetchArtworks();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save artwork.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this artwork?')) return;
        try {
            await API.delete(`/artworks/${id}`);
            fetchArtworks();
        } catch (err) {
            alert('Failed to delete artwork.');
        }
    };

    // ---- Order Management ----
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            alert('Failed to update order status.');
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Delete this order?')) return;
        try {
            await API.delete(`/orders/${id}`);
            fetchOrders();
        } catch (err) {
            alert('Failed to delete order.');
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <p className="text-primary text-xs tracking-[0.4em] uppercase mb-3 font-semibold">Administration</p>
                <h1 className="text-5xl font-outfit font-bold text-text mb-4">
                    Admin <span className="text-gradient-primary">Dashboard</span>
                </h1>
                <div className="accent-line max-w-xs mx-auto" />
            </motion.div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-10">
                {['artworks', 'orders'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-8 py-3 rounded-full text-sm tracking-wider uppercase transition-all duration-300 font-medium ${tab === t
                            ? 'btn-primary'
                            : 'border border-border text-text-secondary hover:text-primary hover:border-primary/30 bg-white'
                            }`}
                    >
                        {t === 'artworks' ? `Artworks (${artworks.length})` : `Orders (${orders.length})`}
                    </button>
                ))}
            </div>

            {/* ======== ARTWORKS TAB ======== */}
            {tab === 'artworks' && (
                <div>
                    {/* Add Button */}
                    <div className="flex justify-end mb-6">
                        <button onClick={openNewForm} className="btn-primary px-6 py-3 rounded-full text-sm flex items-center gap-2">
                            <HiPlus /> Add Artwork
                        </button>
                    </div>

                    {/* Artwork Form Modal */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                                onClick={() => setShowForm(false)}
                            >
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                                <motion.div
                                    initial={{ scale: 0.9, y: 30 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 30 }}
                                    className="relative bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-text-muted hover:text-primary">
                                        <HiX className="text-xl" />
                                    </button>
                                    <h2 className="text-2xl font-outfit font-bold text-text mb-6">
                                        {editingId ? 'Edit Artwork' : 'Add New Artwork'}
                                    </h2>

                                    {formError && (
                                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-2xl mb-4">
                                            {formError}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-text-secondary text-xs uppercase block mb-1 font-medium">Title</label>
                                            <input
                                                type="text" required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-text text-sm outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-text-secondary text-xs uppercase block mb-1 font-medium">Description</label>
                                            <textarea
                                                required rows={3}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-text text-sm outline-none resize-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-text-secondary text-xs uppercase block mb-1 font-medium">Price (₹)</label>
                                                <input
                                                    type="number" required min="0" step="1"
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-text text-sm outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-text-secondary text-xs uppercase block mb-1 font-medium">Category</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-text text-sm outline-none"
                                                >
                                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <label className="text-text-secondary text-xs uppercase block mb-1 font-medium">Image</label>
                                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border hover:border-primary/40 rounded-2xl cursor-pointer transition-colors overflow-hidden bg-surface">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center">
                                                        <HiPhotograph className="text-3xl text-text-muted/30 mx-auto mb-2" />
                                                        <span className="text-text-muted text-sm">Click to upload image</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                            </label>
                                        </div>

                                        <button
                                            type="submit" disabled={formLoading}
                                            className="w-full btn-primary py-3.5 rounded-2xl font-semibold text-sm uppercase disabled:opacity-50 mt-4"
                                        >
                                            {formLoading ? 'Saving...' : editingId ? 'Update Artwork' : 'Add Artwork'}
                                        </button>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Artworks Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {artworks.map(artwork => (
                                <motion.div
                                    key={artwork._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl overflow-hidden group shadow-sm shadow-black/5 card-hover"
                                >
                                    <div className="aspect-[3/4] overflow-hidden relative">
                                        <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditForm(artwork)}
                                                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-md"
                                            >
                                                <HiPencil className="text-sm" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(artwork._id)}
                                                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-md"
                                            >
                                                <HiTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-primary/60 text-[10px] tracking-wider uppercase font-semibold">{artwork.category}</p>
                                        <h3 className="text-text font-outfit font-semibold truncate">{artwork.title}</h3>
                                        <p className="text-primary font-outfit font-bold mt-1">₹{artwork.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ======== ORDERS TAB ======== */}
            {tab === 'orders' && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 text-text-muted">No orders yet.</div>
                    ) : orders.map((order, i) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-text-muted text-xs">Order ID</p>
                                    <p className="text-text text-sm font-mono">{order._id}</p>
                                    <p className="text-text-muted text-xs mt-1">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs mb-1">Customer</p>
                                    <p className="text-text text-sm">{order.user?.name || 'N/A'}</p>
                                    <p className="text-text-muted text-xs">{order.user?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs mb-1">Status</p>
                                    <select
                                        value={order.status}
                                        onChange={e => handleStatusChange(order._id, e.target.value)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                                    >
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="text-right">
                                    <p className="text-text-muted text-xs">Total</p>
                                    <p className="text-xl font-outfit font-bold text-gradient-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="accent-line mb-4" />

                            {/* Items */}
                            <div className="space-y-2 mb-4">
                                {order.items.map((item, j) => (
                                    <div key={j} className="flex items-center gap-3 text-sm">
                                        <img
                                            src={item.imageUrl || item.artwork?.imageUrl}
                                            alt={item.title || item.artwork?.title}
                                            className="w-10 h-10 object-cover rounded-lg"
                                        />
                                        <span className="text-text-secondary flex-1 truncate">{item.title || item.artwork?.title}</span>
                                        <span className="text-text-muted">×{item.quantity}</span>
                                        <span className="text-primary font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping + Delete */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="text-xs text-text-muted">
                                    Ship to: {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                                </div>
                                <button
                                    onClick={() => handleDeleteOrder(order._id)}
                                    className="text-red-400 hover:text-red-600 text-sm flex items-center gap-1 transition-colors"
                                >
                                    <HiTrash /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
