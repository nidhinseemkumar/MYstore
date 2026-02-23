import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ShoppingCart, Search, User, MapPin, LogIn, Package, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useLocationStore } from '../store/useLocationStore';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

const SearchBar = ({ className, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 1) {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, image_url, price, category')
                .ilike('name', `%${term}%`)
                .limit(5);

            if (data) {
                setSuggestions(data);
                setShowSuggestions(true);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectProduct = (productId) => {
        setSearchTerm('');
        setShowSuggestions(false);
        navigate(`/product/${productId}`);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSuggestions([]);
        setShowSuggestions(false);
    }

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="h-5 w-5" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
                placeholder={placeholder || "Search for 'milk', 'chips', 'bread'..."}
            />
            {searchTerm && (
                <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg border border-gray-100 shadow-xl overflow-hidden z-50">
                    {suggestions.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product.id)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                        >
                            <img
                                src={product.image_url || "https://via.placeholder.com/40"}
                                alt={product.name}
                                className="w-10 h-10 object-contain rounded bg-white border border-gray-100 p-0.5"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                                <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-xs text-gray-500">{product.category}</span>
                                    <span className="text-xs font-bold text-primary">₹{product.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-2 bg-gray-50 text-center text-xs font-medium text-primary cursor-pointer hover:underline">
                        View all results for "{searchTerm}"
                    </div>
                </div>
            )}
        </div>
    );
};

export const Navbar = () => {
    const { isAuthenticated, login, user, logout } = useAuthStore();
    const { itemCount, total } = useCartStore();
    const { location, setLocation } = useLocationStore();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Local state for editing in modal
    const [editForm, setEditForm] = useState({ address: '', city: '' });

    useEffect(() => {
        if (showLocationModal) {
            setEditForm({ address: location.address, city: location.city });
        }
    }, [showLocationModal, location]);

    const handleSaveLocation = () => {
        setLocation(editForm);
        setShowLocationModal(false);
    };

    const handleLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100/50 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0'
                }`}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Location */}
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link to="/" className="flex items-center gap-0.5">
                            <span className="text-2xl font-bold text-primary tracking-tighter">MY</span>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">store</span>
                        </Link>

                        <div className="flex flex-col justify-center border-l pl-4 border-gray-200 h-10">
                            <span className="text-xs font-extrabold text-gray-900 leading-tight">10 mins</span>
                            <div
                                onClick={() => setShowLocationModal(true)}
                                className="flex items-center gap-1 text-[10px] text-gray-500 leading-tight cursor-pointer hover:text-primary transition-colors"
                            >
                                <span className="truncate max-w-[100px]">{location.address || 'Home'}</span> - <span className="truncate max-w-[80px]">{location.city || 'Bangalore'}</span> <MapPin size={10} />
                            </div>
                        </div>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                        <SearchBar />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="text-gray-700 font-medium text-sm hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <LogIn size={16} />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        ) : (
                            // Only show profile for Admin or Seller
                            (user?.role === 'admin' || user?.role === 'seller') && (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to={user.role === 'seller' ? '/seller' : '/admin'}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 p-2 rounded-lg"
                                    >
                                        <User size={18} />
                                        <span className="hidden sm:inline">Dashboard</span>
                                    </Link>
                                    <button onClick={() => setShowLogoutConfirm(true)} className="text-gray-500 hover:text-red-500 p-2" title="Logout">
                                        <LogIn size={20} className="rotate-180" />
                                    </button>
                                </div>
                            )
                        )}

                        {/* Show Orders link for logged in buyers */}
                        {isAuthenticated && user?.role === 'buyer' && (
                            <div className="flex items-center gap-2">
                                <Link to="/orders" className="text-gray-500 hover:text-primary p-2" title="My Orders">
                                    <Package size={20} />
                                </Link>
                                <button onClick={() => setShowLogoutConfirm(true)} className="text-gray-500 hover:text-red-500 p-2" title="Logout">
                                    <LogIn size={20} className="rotate-180" />
                                </button>
                            </div>
                        )}

                        {/* Fallback for authenticated users with unknown/missing role */}
                        {isAuthenticated && !['admin', 'seller', 'buyer'].includes(user?.role) && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-red-500 font-bold px-2">Role: {user?.role || 'None'}</span>
                                <button onClick={() => setShowLogoutConfirm(true)} className="text-gray-500 hover:text-red-500 p-2" title="Logout">
                                    <LogIn size={20} className="rotate-180" />
                                </button>
                            </div>
                        )}

                        {itemCount === 0 ? (
                            <button
                                onClick={() => navigate('/cart')}
                                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-bold"
                            >
                                <ShoppingCart size={18} />
                                <span className="hidden sm:inline">My Cart</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/cart')}
                                className="flex items-center gap-3 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md animate-in fade-in zoom-in duration-200"
                            >
                                <ShoppingCart size={20} />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] font-medium opacity-90">{itemCount} items</span>
                                    <span className="text-sm font-bold">₹{total}</span>
                                </div>
                            </button>
                        )}

                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Visible only on mobile */}
            <div className="md:hidden px-4 pb-3">
                <SearchBar placeholder="Search products..." />
            </div>

            {/* Logout Confirmation Modal */}
            {/* Logout Confirmation Modal */}
            {createPortal(
                <AnimatePresence>
                    {showLogoutConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
                                <p className="text-gray-500 mb-6 text-sm">
                                    Are you sure you want to log out of your account?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Location Edit Modal */}
            {createPortal(
                <AnimatePresence>
                    {showLocationModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                            onClick={() => setShowLocationModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Location</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Label / Area</label>
                                        <input
                                            type="text"
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            placeholder="e.g. Home, Office, Koramangala"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={editForm.city}
                                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            placeholder="e.g. Bangalore"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end mt-6">
                                    <button
                                        onClick={() => setShowLocationModal(false)}
                                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveLocation}
                                        className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm"
                                    >
                                        Save Location
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </nav>
    );
};
