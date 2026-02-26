import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--bg)]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md"
            >
                <div className="mb-10">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="divider-gold" />
                        <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Join us</p>
                    </div>
                    <h1 className="text-display text-4xl sm:text-5xl">
                        Create <span className="text-editorial text-[var(--text-muted)]">Account</span>
                    </h1>
                </div>

                {error && (
                    <div className="border border-red-200 text-red-600 text-sm px-4 py-3 mb-6 bg-red-50/50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-2">Full Name</label>
                        <input
                            type="text" value={name} onChange={e => setName(e.target.value)} required
                            className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--charcoal)] py-3 text-[var(--charcoal)] text-sm outline-none transition-colors"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-2">Email</label>
                        <input
                            type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--charcoal)] py-3 text-[var(--charcoal)] text-sm outline-none transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] block mb-2">Password</label>
                        <input
                            type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                            className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--charcoal)] py-3 text-[var(--charcoal)] text-sm outline-none transition-colors"
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-filled w-full justify-center mt-8 disabled:opacity-50">
                        <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                    </button>
                </form>

                <p className="text-center text-[var(--text-muted)] text-sm mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--charcoal)] hover:text-[var(--gold)] transition-colors underline underline-offset-4">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
