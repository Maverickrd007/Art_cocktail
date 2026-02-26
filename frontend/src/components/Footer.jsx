import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[var(--charcoal)] text-white/70">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo.jpg" alt="Art Cocktail" className="h-10 w-auto object-contain brightness-200" />
                            <div>
                                <h3 className="font-display text-xl font-semibold text-white tracking-tight">Art Cocktail</h3>
                                <p className="text-[9px] tracking-[0.2em] uppercase text-white/40">by Swetnisha Sharma</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed max-w-md text-white/50">
                            Handcrafted resin and mixed-media artwork from Electronic City, Bangalore.
                            Each piece is a unique expression of color, texture, and emotion—crafted to transform your space.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-6">Navigate</h4>
                        <div className="space-y-3">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/gallery', label: 'Gallery' },
                                { to: '/cart', label: 'Cart' },
                                { to: '/login', label: 'Account' },
                            ].map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block text-sm text-white/40 hover:text-white transition-colors duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] mb-6">Contact</h4>
                        <div className="space-y-3 text-sm text-white/40">
                            <p>hello@artcocktail.com</p>
                            <p>+91 93411 88788</p>
                            <p>Electronic City, Bangalore</p>
                            <p>India</p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-[var(--gold)] transition-colors">
                                Instagram
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-[var(--gold)] transition-colors">
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-white/30">
                        © {new Date().getFullYear()} Art Cocktail by Swetnisha Sharma. All rights reserved.
                    </p>
                    <p className="text-[11px] text-white/20 text-editorial">
                        Handcrafted with love in Bangalore
                    </p>
                </div>
            </div>
        </footer>
    );
}
