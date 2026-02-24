import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus, Share2, Heart } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { ProductReviews } from '../../components/ProductReviews';
import { PLACEHOLDER_IMAGE } from '../../data/mockData';

export const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedProduct, fetchProduct, isLoading, error } = useProductStore();
    const { items, addItem, updateQuantity } = useCartStore();

    // Local state for image if fetched from external API
    const [displayImage, setDisplayImage] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id, fetchProduct]);

    useEffect(() => {
        if (selectedProduct) {
            setDisplayImage(selectedProduct.image_url || selectedProduct.image || PLACEHOLDER_IMAGE);

            // Fetch from OpenFoodFacts if barcode exists
            if (selectedProduct.barcode) {
                const fetchImage = async () => {
                    try {
                        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${selectedProduct.barcode}.json`);
                        const data = await response.json();
                        if (data.status === 1 && data.product.image_front_url) {
                            setDisplayImage(data.product.image_front_url);
                        }
                    } catch (err) {
                        console.error("Error fetching image:", err);
                    }
                };
                fetchImage();
            }
        }
    }, [selectedProduct]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !selectedProduct) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 gap-4">
                <p className="text-gray-500 text-lg">Product not found.</p>
                <button
                    onClick={() => navigate('/')}
                    className="text-primary font-bold hover:underline flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
            </div>
        );
    }

    const cartItem = items.find(item => item.id === selectedProduct.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <div className="pb-20 pt-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="hover:text-primary transition-colors cursor-pointer">{selectedProduct.category}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{selectedProduct.name}</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                        {/* Image Section */}
                        <div className="p-8 flex items-center justify-center bg-gray-50/50 relative group">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={displayImage}
                                alt={selectedProduct.name}
                                className="w-full max-w-sm object-contain mix-blend-multiply drop-shadow-lg max-h-[400px]"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                            />
                            {selectedProduct.discount > 0 && (
                                <div className="absolute top-6 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-sm">
                                    {selectedProduct.discount}% OFF
                                </div>
                            )}
                            <button className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                                <Heart size={20} />
                            </button>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-primary font-bold tracking-wide uppercase mb-2">{selectedProduct.category}</p>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                                        {selectedProduct.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < Math.floor(selectedProduct.rating || 0) ? "currentColor" : "none"}
                                                    className={i < Math.floor(selectedProduct.rating || 0) ? "" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">
                                            ({selectedProduct.reviews || 0} reviews)
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            <div className="border-t border-b border-gray-100 py-6 my-2">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-4xl font-bold text-gray-900">₹{selectedProduct.price}</span>
                                    {selectedProduct.originalPrice > selectedProduct.price && (
                                        <span className="text-lg text-gray-400 line-through mb-1">₹{selectedProduct.originalPrice}</span>
                                    )}
                                </div>
                                <p className="text-green-600 text-sm font-medium">Inclusive of all taxes</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {selectedProduct.description || "No description available for this product."}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto">
                                <div className="flex items-center gap-4">
                                    {quantity === 0 ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => addItem(selectedProduct)}
                                            className="flex-1 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={20} />
                                            Add to Cart
                                        </motion.button>
                                    ) : (
                                        <div className="flex items-center bg-gray-100 rounded-xl p-1 flex-1 max-w-[200px]">
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => updateQuantity(selectedProduct.id, quantity - 1)}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:text-red-500 transition-colors"
                                            >
                                                <Minus size={20} />
                                            </motion.button>
                                            <span className="flex-1 text-center font-bold text-xl text-gray-900">{quantity}</span>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => addItem(selectedProduct)}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:text-green-500 transition-colors"
                                            >
                                                <Plus size={20} />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews productId={selectedProduct.id} />

            </div>
        </div>
    );
};
