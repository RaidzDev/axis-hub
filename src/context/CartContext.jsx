import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage if available
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('axis-hub-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('axis-hub-cart', JSON.stringify(cart));
    }, [cart]);

    // "Buy Now" functionality: Clears cart and adds the single item
    const buyNow = (product, variationId = null) => {
        const item = {
            id: product.id,
            name: product.name,
            price: variationId
                ? product.variations.find(v => v.id === variationId).price
                : product.price,
            image: product.image,
            variation: variationId
                ? product.variations.find(v => v.id === variationId).name
                : null,
            quantity: 1
        };
        setCart([item]); // Replace cart with single item
    };

    const addToCart = (product, variationId = null) => {
        const existingItemIndex = cart.findIndex(item =>
            item.id === product.id && item.variation === (variationId ? product.variations.find(v => v.id === variationId).name : null)
        );

        if (existingItemIndex > -1) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += 1;
            setCart(newCart);
        } else {
            const item = {
                id: product.id,
                name: product.name,
                price: variationId
                    ? product.variations.find(v => v.id === variationId).price
                    : product.price,
                image: product.image,
                variation: variationId
                    ? product.variations.find(v => v.id === variationId).name
                    : null,
                quantity: 1
            };
            setCart([...cart, item]);
        }
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        const newQuantity = newCart[index].quantity + delta;
        if (newQuantity > 0) {
            newCart[index].quantity = newQuantity;
            setCart(newCart);
        }
    };

    const cartTotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(',', '.'));
        return total + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ cart, buyNow, addToCart, removeFromCart, updateQuantity, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
