import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../../components/ProductCard';
import { useProductStore } from '../../store/useProductStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { AllCategoriesModal } from '../../components/AllCategoriesModal';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();
    const { products, fetchProducts, isLoading } = useProductStore();
    const { categories, fetchCategories, isLoading: categoriesLoading } = useCategoryStore();
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllProducts, setShowAllProducts] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    const displayedProducts = showAllProducts ? products : products.slice(0, 12);
    const displayCategories = categories.slice(0, 6);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {createPortal(
                <AllCategoriesModal
                    isOpen={showAllCategories}
                    onClose={() => setShowAllCategories(false)}
                />,
                document.body
            )}
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
            <section className="mt-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
                    <button
                        onClick={() => setShowAllCategories(true)}
                        className="text-sm text-primary font-bold hover:underline"
                    >
                        See All
                    </button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                    {categoriesLoading ? (
                        <div className="col-span-3 md:col-span-6 flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : displayCategories.length === 0 ? (
                        <div className="col-span-3 md:col-span-6 text-center text-gray-500 py-8 text-sm">
                            No categories found
                        </div>
                    ) : (
                        displayCategories.map((cat) => (
                            <motion.div
                                key={cat.id || cat.name}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                                className={`h-36 ${cat.color || 'bg-gray-50'} rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-2 cursor-pointer transition-colors hover:shadow-md`}
                            >
                                <img src={cat.image_url || cat.image} alt={cat.name} className="w-16 h-16 object-contain mb-3 drop-shadow-sm mix-blend-multiply" />
                                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Popular Products */}
            <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Popular Near You</h2>
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
                        {displayedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setShowAllProducts(!showAllProducts)}
                        className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                    >
                        {showAllProducts ? 'Show Less' : 'View All'}
                    </button>
                </div>
            </section>
        </div>
    );
};
