import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../data/mockData'; // Keep categories mock for now
import { ProductCard } from '../../components/ProductCard';
import { useProductStore } from '../../store/useProductStore';

export const Home = () => {
    const { products, fetchProducts, isLoading } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Banner Section */}
            <section className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0C831F] to-[#096a18] shadow-lg mx-auto max-w-7xl mt-6">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative h-full flex flex-col justify-center px-6 md:px-12 text-white max-w-2xl">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider w-fit mb-3"
                    >
                        Express Delivery
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight"
                    >
                        Groceries delivered in <br />
                        <span className="text-yellow-300">10 minutes</span>
                    </motion.h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-[#0C831F] px-8 py-3 rounded-xl font-bold w-fit shadow-md hover:shadow-xl transition-all"
                    >
                        Order Now
                    </motion.button>
                </div>

                {/* Illustration (Simulated with absolute div) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute right-0 bottom-0 h-4/5 w-1/3 hidden md:block bg-contain bg-no-repeat bg-bottom"
                    style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/3081/3081986.png')" }}
                />
            </section>

            {/* Categories Grid */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
                    <button className="text-sm text-primary font-bold">See All</button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                    {CATEGORIES.map((cat) => (
                        <motion.div
                            key={cat.id}
                            whileHover={{ y: -5 }}
                            className={`h-36 ${cat.color} rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-2 cursor-pointer transition-colors hover:shadow-md`}
                        >
                            <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain mb-3 drop-shadow-sm" />
                            <span className="text-xs font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Popular Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Popular Near You</h2>
                    <button className="text-primary font-bold text-sm hover:underline">View All</button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No products found. Please seed the database!
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
