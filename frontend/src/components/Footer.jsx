import { Link } from 'react-router-dom';

/**
 * Elegant light footer with Art Cocktail branding.
 */
export default function Footer() {
    return (
        <footer className="relative mt-20">
            <div className="accent-line" />
            <div className="bg-white/60 backdrop-blur-sm py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo.jpg" alt="Art Cocktail" className="h-10 w-auto object-contain" />
                                <div>
                                    <h3 className="text-2xl font-outfit font-bold text-gradient-primary leading-tight">Art Cocktail</h3>
                                    <p className="text-[10px] tracking-[0.15em] text-text-muted italic">by Swetnisha Sharma</p>
                                </div>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                A curated collection of exquisite paintings and resin artwork.
                                Each piece tells a story, each brushstroke captures emotion.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-primary font-semibold mb-4 tracking-wider uppercase text-sm">Quick Links</h4>
                            <div className="space-y-2">
                                {[
                                    { to: '/', label: 'Home' },
                                    { to: '/gallery', label: 'Gallery' },
                                    { to: '/cart', label: 'Cart' },
                                ].map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="block text-text-muted hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-primary font-semibold mb-4 tracking-wider uppercase text-sm">Contact</h4>
                            <div className="space-y-2 text-text-muted text-sm">
                                <p>hello@artcocktail.com</p>
                                <p>+91 93411 88788</p>
                                <p>Bengaluru, India</p>
                            </div>
                        </div>
                    </div>

                    <div className="accent-line mt-12 mb-8" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-text-muted text-xs">
                            © {new Date().getFullYear()} Art Cocktail by Swetnisha Sharma. All rights reserved.
                        </p>
                        <p className="text-text-muted/50 text-xs">
                            Crafted with passion for art lovers
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
