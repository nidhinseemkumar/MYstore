import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Search, Loader } from 'lucide-react';
import { AddProductModal } from '../../components/AddProductModal';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

export const SellerProducts = () => {
    const { user } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSellerProducts = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellerProducts();
    }, [user]);

    const handleDelete = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            alert("Error deleting product");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin text-primary" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <p>No products found.</p>
                        <p className="text-sm">Click "Add Product" to start selling.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No Img</span>
                                                    )}
                                                </div>
                                                <div className="line-clamp-1 max-w-[200px]" title={product.name}>{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4">₹{product.price}</td>
                                        <td className="px-6 py-4">{product.stock_quantity}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"><Trash size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={fetchSellerProducts}
            />
        </div>
    );
};
