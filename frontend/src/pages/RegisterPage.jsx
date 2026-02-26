import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 mesh-gradient relative">
            {/* Decorative blobs */}
            <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/8 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-xl shadow-black/5"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-outfit font-bold text-gradient-primary mb-2">Join Art Cocktail</h1>
                    <p className="text-text-muted text-sm">Create your account and start collecting</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-text-secondary text-xs tracking-wider uppercase block mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-text text-sm outline-none transition-all"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="text-text-secondary text-xs tracking-wider uppercase block mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-text text-sm outline-none transition-all"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="text-text-secondary text-xs tracking-wider uppercase block mb-2 font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-surface border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-2xl px-4 py-3 text-text text-sm outline-none transition-all pr-10"
                                placeholder="Min 6 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                            >
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 rounded-2xl font-semibold text-sm tracking-wider uppercase disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-text-muted text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-primary-dark transition-colors font-medium">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
