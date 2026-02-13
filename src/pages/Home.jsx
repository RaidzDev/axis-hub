import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import HowItWorks from '../components/HowItWorks';
import CategoriesSection from '../components/CategoriesSection';
import ProductsSection from '../components/ProductsSection';
import SupportSection from '../components/SupportSection';
import Footer from '../components/Footer';
import { api } from '../services/api';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products');
            }
        };
        loadProducts();
    }, []);

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30">
            <Header />
            <main>
                <Hero />
                <Benefits />
                <HowItWorks />
                <div id="assinaturas" className="scroll-mt-24"></div>
                <CategoriesSection />
                <ProductsSection products={products} />
                <SupportSection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
