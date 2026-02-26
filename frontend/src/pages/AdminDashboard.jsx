import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { HiPlus, HiPencil, HiTrash, HiPhotograph, HiX } from 'react-icons/hi';

const CATEGORIES = ['painting', 'resin', 'abstract', 'portrait', 'landscape', 'modern', 'other'];
const STATUS_OPTIONS = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminDashboard() {
    const [tab, setTab] = useState('artworks');
    const [artworks, setArtworks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', category: 'painting' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => { fetchArtworks(); fetchOrders(); }, []);

    const fetchArtworks = async () => {
        try { const res = await API.get('/artworks'); setArtworks(Array.isArray(res.data) ? res.data : []); } catch (e) { console.error(e); }
        setLoading(false);
    };
    const fetchOrders = async () => {
        try { const res = await API.get('/orders'); setOrders(Array.isArray(res.data) ? res.data : []); } catch (e) { console.error(e); }
    };

    const openNewForm = () => { setEditingId(null); setFormData({ title: '', description: '', price: '', category: 'painting' }); setImageFile(null); setImagePreview(''); setFormError(''); setShowForm(true); };
    const openEditForm = (a) => { setEditingId(a._id); setFormData({ title: a.title, description: a.description, price: a.price, category: a.category }); setImageFile(null); setImagePreview(a.imageUrl); setFormError(''); setShowForm(true); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setFormLoading(true); setFormError('');
        try {
            const fd = new FormData();
            fd.append('title', formData.title); fd.append('description', formData.description);
            fd.append('price', formData.price); fd.append('category', formData.category);
            if (imageFile) fd.append('image', imageFile);
            if (editingId) { await API.put(`/artworks/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); }
            else { if (!imageFile) { setFormError('Image required.'); setFormLoading(false); return; } await API.post('/artworks', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); }
            setShowForm(false); fetchArtworks();
        } catch (err) { setFormError(err.response?.data?.message || 'Failed.'); }
        finally { setFormLoading(false); }
    };

    const handleDelete = async (id) => { if (!confirm('Delete this artwork?')) return; try { await API.delete(`/artworks/${id}`); fetchArtworks(); } catch { } };
    const handleStatusChange = async (id, s) => { try { await API.put(`/orders/${id}/status`, { status: s }); fetchOrders(); } catch { } };
    const handleDeleteOrder = async (id) => { if (!confirm('Delete this order?')) return; try { await API.delete(`/orders/${id}`); fetchOrders(); } catch { } };

    return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-[var(--bg)]">
            <div className="max-w-[1400px] mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="divider-gold" />
                        <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Administration</p>
                    </div>
                    <h1 className="text-display text-4xl sm:text-5xl">
                        Admin <span className="text-editorial text-[var(--text-muted)]">Dashboard</span>
                    </h1>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 mb-10">
                    {['artworks', 'orders'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 border transition-all duration-300 ${tab === t ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--charcoal)]'
                                }`}>
                            {t} ({t === 'artworks' ? artworks.length : orders.length})
                        </button>
                    ))}
                </div>

                {/* ARTWORKS TAB */}
                {tab === 'artworks' && (
                    <div>
                        <div className="flex justify-end mb-6">
                            <button onClick={openNewForm} className="btn-outline text-[10px]"><HiPlus className="relative z-1" /><span>Add Artwork</span></button>
                        </div>

                        {/* Form Modal */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                                    <div className="absolute inset-0 bg-black/60" />
                                    <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} className="relative bg-[var(--bg)] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-[var(--text-muted)]"><HiX /></button>
                                        <h2 className="font-display text-xl font-semibold mb-6">{editingId ? 'Edit Artwork' : 'New Artwork'}</h2>
                                        {formError && <div className="border border-red-200 text-red-600 text-sm px-3 py-2 mb-4">{formError}</div>}
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {[{ key: 'title', label: 'Title', type: 'text' }, { key: 'description', label: 'Description', type: 'textarea' }].map(f => (
                                                <div key={f.key}>
                                                    <label className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-1">{f.label}</label>
                                                    {f.type === 'textarea' ? (
                                                        <textarea required rows={3} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                                            className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--charcoal)] p-3 text-sm outline-none resize-none" />
                                                    ) : (
                                                        <input type={f.type} required value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                                            className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--charcoal)] p-3 text-sm outline-none" />
                                                    )}
                                                </div>
                                            ))}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-1">Price (₹)</label>
                                                    <input type="number" required min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                        className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--charcoal)] p-3 text-sm outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-1">Category</label>
                                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--charcoal)] p-3 text-sm outline-none">
                                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-1">Image</label>
                                                <label className="flex flex-col items-center justify-center w-full h-36 border border-dashed border-[var(--border)] hover:border-[var(--charcoal)] cursor-pointer transition-colors overflow-hidden">
                                                    {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" /> : (
                                                        <div className="text-center"><HiPhotograph className="text-2xl text-[var(--text-muted)]/30 mx-auto mb-1" /><span className="text-[var(--text-muted)] text-xs">Upload image</span></div>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
                                                </label>
                                            </div>
                                            <button type="submit" disabled={formLoading} className="btn-filled w-full justify-center mt-4 disabled:opacity-50">
                                                <span>{formLoading ? 'Saving...' : editingId ? 'Update' : 'Add Artwork'}</span>
                                            </button>
                                        </form>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {loading ? (
                            <div className="flex justify-center py-20"><div className="w-8 h-8 border border-[var(--border)] border-t-[var(--gold)] rounded-full animate-spin" /></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {artworks.map(a => (
                                    <div key={a._id} className="group relative">
                                        <div className="aspect-[3/4] overflow-hidden">
                                            <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover img-dramatic" />
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditForm(a)} className="w-8 h-8 bg-white/90 flex items-center justify-center text-[var(--charcoal)] hover:bg-[var(--gold)] hover:text-white transition-colors"><HiPencil className="text-sm" /></button>
                                                <button onClick={() => handleDelete(a._id)} className="w-8 h-8 bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"><HiTrash className="text-sm" /></button>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--gold)]">{a.category}</p>
                                            <h3 className="font-display font-semibold truncate">{a.title}</h3>
                                            <p className="text-[var(--text-muted)] text-sm">₹{a.price?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ORDERS TAB */}
                {tab === 'orders' && (
                    <div className="space-y-0">
                        {orders.length === 0 ? <p className="text-center py-20 text-[var(--text-muted)] text-editorial">No orders yet.</p> :
                            orders.map((o, i) => (
                                <motion.div key={o._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                    className="border-b border-[var(--border)] py-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                        <div>
                                            <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Order</p>
                                            <p className="text-sm font-mono">{o._id}</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Customer</p>
                                            <p className="text-sm">{o.user?.name || 'N/A'}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{o.user?.email || ''}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1">Status</p>
                                            <select value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)}
                                                className="text-xs border border-[var(--border)] px-2 py-1 outline-none bg-transparent">
                                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)]">Total</p>
                                            <p className="font-display text-lg font-semibold">₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex gap-2">
                                            {o.items.map((item, j) => (
                                                <img key={j} src={item.imageUrl || item.artwork?.imageUrl} alt="" className="w-8 h-8 object-cover" />
                                            ))}
                                        </div>
                                        <button onClick={() => handleDeleteOrder(o._id)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                                            <HiTrash /> Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
