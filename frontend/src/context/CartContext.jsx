import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

/**
 * CartProvider manages shopping cart state.
 * Cart items are persisted in localStorage.
 */
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) setCartItems(JSON.parse(saved));
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (artwork) => {
        setCartItems(prev => {
            const exists = prev.find(item => item._id === artwork._id);
            if (exists) {
                // Increase quantity if already in cart
                return prev.map(item =>
                    item._id === artwork._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...artwork, quantity: 1 }];
        });
    };

    const removeFromCart = (artworkId) => {
        setCartItems(prev => prev.filter(item => item._id !== artworkId));
    };

    const updateQuantity = (artworkId, quantity) => {
        if (quantity < 1) return removeFromCart(artworkId);
        setCartItems(prev =>
            prev.map(item =>
                item._id === artworkId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
