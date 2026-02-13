import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import CategoriesSection from '../components/CategoriesSection';
import ProductsSection from '../components/ProductsSection';
import SupportSection from '../components/SupportSection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30">
            <Header />
            <main>
                <Hero />
                <Benefits />
                <CategoriesSection />
                <ProductsSection />
                <SupportSection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
