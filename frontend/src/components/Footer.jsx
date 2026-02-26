import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[var(--charcoal)] text-white/70">
            <div className="max-w-4xl mx-auto px-8 py-20 text-center">
                {/* Brand */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <img src="/logo.jpg" alt="Art Cocktail" className="h-10 w-auto object-contain brightness-200" />
                    <div className="text-left">
                        <h3 className="font-display text-xl font-semibold text-white tracking-tight">Art Cocktail</h3>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-white/40">by Swetnisha Sharma</p>
                    </div>
                </div>

                <p className="text-sm leading-relaxed max-w-md mx-auto text-white/40 mb-10">
                    Handcrafted resin and mixed-media artwork from Electronic City, Bangalore.
                    Each piece is a unique expression of color, texture, and emotion.
                </p>

                {/* Navigation */}
                <div className="flex flex-wrap justify-center gap-8 mb-10">
                    {[
                        { to: '/', label: 'Home' },
                        { to: '/gallery', label: 'Gallery' },
                        { to: '/cart', label: 'Cart' },
                        { to: '/login', label: 'Account' },
                    ].map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors duration-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Contact */}
                <div className="mb-10 space-y-1 text-sm text-white/40">
                    <p>hello@artcocktail.com</p>
                    <p>+91 93411 88788</p>
                    <p>Electronic City, Bangalore, India</p>
                </div>

                {/* Social */}
                <div className="flex justify-center gap-6 mb-12">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-[var(--gold)] transition-colors">
                        Instagram
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-[var(--gold)] transition-colors">
                        Facebook
                    </a>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 pt-8">
                    <p className="text-[11px] text-white/25 mb-1">
                        © {new Date().getFullYear()} Art Cocktail by Swetnisha Sharma. All rights reserved.
                    </p>
                    <p className="text-[11px] text-white/15 text-editorial">
                        Handcrafted with love in Bangalore
                    </p>
                </div>
            </div>
        </footer>
    );
}
