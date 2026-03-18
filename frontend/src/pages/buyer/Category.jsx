import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageSearch } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { useProductStore } from '../../store/useProductStore';
import { motion } from 'framer-motion';

export const Category = () => {
    const { categoryName } = useParams();
    const decodedCategoryName = decodeURIComponent(categoryName);
    const navigate = useNavigate();

    const { products, fetchProducts, isLoading } = useProductStore();

    useEffect(() => {
        window.scrollTo(0, 0);
        // Fetch all products if not already loaded (simple approach)
        fetchProducts();
    }, [fetchProducts]);

    const categoryProducts = products.filter(
        p => p.category?.toLowerCase() === decodedCategoryName.toLowerCase()
    );

    return (
        <div className="pb-20 pt-6 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <nav className="flex items-center text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium truncate">{decodedCategoryName}</span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {decodedCategoryName}
                        </h1>
                        <span className="text-sm font-medium text-gray-500 bg-gray-200/50 px-3 py-1 rounded-full">
                            {categoryProducts.length} items
                        </span>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                ) : categoryProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm text-center min-h-[400px]"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <PackageSearch size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
                        <p className="text-gray-500 max-w-sm mb-6">
                            We currently don't have any products available in the "{decodedCategoryName}" category. Please check back later.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-primary text-white font-bold px-6 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                        >
                            Explore Other Categories
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categoryProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
