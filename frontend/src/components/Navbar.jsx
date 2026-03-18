import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ShoppingCart, Search, User, MapPin, LogIn, Package, X, LocateFixed } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useLocationStore } from '../store/useLocationStore';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center && center.lat && center.lng) {
            map.flyTo([center.lat, center.lng], map.getZoom() || 16, { animate: true });
        }
    }, [center, map]);
    return null;
};

const MapEvents = ({ onMoveEnd }) => {
    const map = useMap();
    useEffect(() => {
        const handleMoveEnd = () => {
            const center = map.getCenter();
            onMoveEnd(center.lat, center.lng);
        };
        map.on('moveend', handleMoveEnd);
        return () => map.off('moveend', handleMoveEnd);
    }, [map, onMoveEnd]);
    return null;
};

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
                .limit(10);

            if (data) {
                const mockProductNames = [
                    'Amul Taaza Fresh Toned Milk',
                    "Lay's India's Magic Masala Chips",
                    'Coca-Cola Soft Drink - Original Taste',
                    'Onion (Loose)',
                    'Fortune Sunlite Refined Sunflower Oil',
                    'Tata Salt Vacuum Evaporated Iodised Salt'
                ];
                const realSellerProducts = data.filter(p => !mockProductNames.includes(p.name)).slice(0, 5);
                setSuggestions(realSellerProducts);
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

    const [editForm, setEditForm] = useState({ 
        address: '', 
        city: '', 
        pincode: '', 
        landmark: '', 
        type: 'Home', 
        phone: '',
        lat: 12.9716,
        lng: 77.5946
    });
    const [isLocating, setIsLocating] = useState(false);
    const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });
    const reverseGeocodeRef = useRef(null);

    useEffect(() => {
        if (showLocationModal) {
            setEditForm({ 
                address: location.address || '', 
                city: location.city || '',
                pincode: location.pincode || '',
                landmark: location.landmark || '',
                type: location.type || 'Home',
                phone: location.phone || '',
                lat: location.lat || 12.9716,
                lng: location.lng || 77.5946,
            });
            setMapCenter({
                lat: location.lat || 12.9716,
                lng: location.lng || 77.5946
            });
        }
    }, [showLocationModal, location]);

    const handleSaveLocation = () => {
        if (!editForm.address?.trim()) {
            toast.error('Detailed Address is required');
            return;
        }
        if (!editForm.city?.trim()) {
            toast.error('City is required');
            return;
        }
        if (!editForm.pincode?.trim()) {
            toast.error('Pincode is required');
            return;
        }
        if (!editForm.phone?.trim()) {
            toast.error('Contact Number is required');
            return;
        }

        setLocation(editForm);
        setShowLocationModal(false);
        toast.success('Location updated successfully!');
    };

    const handleMapMoveEnd = (lat, lng) => {
        setEditForm(prev => ({ ...prev, lat, lng }));

        if (reverseGeocodeRef.current) clearTimeout(reverseGeocodeRef.current);
        reverseGeocodeRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                if (!res.ok) return;
                const data = await res.json();
                
                const city = data.address?.city || data.address?.town || data.address?.county || data.address?.state_district || '';
                const area = data.address?.suburb || data.address?.neighbourhood || data.address?.village || city;
                const pincode = data.address?.postcode || '';
                
                setEditForm(prev => ({
                    ...prev,
                    address: (data.address?.road ? data.address.road + ', ' : '') + area,
                    city: city,
                    pincode: pincode
                }));
            } catch (error) {
                // Ignore API rate limits or network issues quietly while dragging
            }
        }, 1500); 
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Reverse geocoding using Nominatim (OpenStreetMap)
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    if (!res.ok) throw new Error('Failed to fetch address');
                    const data = await res.json();
                    
                    const city = data.address.city || data.address.town || data.address.county || data.address.state_district || 'Unknown City';
                    const area = data.address.suburb || data.address.neighbourhood || data.address.village || city;
                    const pincode = data.address.postcode || '';
                    
                    setEditForm(prev => ({
                        ...prev,
                        lat: latitude,
                        lng: longitude,
                        address: (data.address.road ? data.address.road + ', ' : '') + area,
                        city: city,
                        pincode: pincode
                    }));
                    setMapCenter({
                        lat: latitude,
                        lng: longitude
                    });
                    toast.success('Location detected!');
                } catch (error) {
                    toast.error('Could not determine exact address from location');
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                setIsLocating(false);
                toast.error('Please allow location permissions to use this feature');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
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
                                <span className="truncate max-w-[80px] font-bold text-gray-800">{location.type || 'Home'}</span> - <span className="truncate max-w-[100px]">{location.address || location.city || 'Select Address'}</span> <MapPin size={10} className="shrink-0" />
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

                        {/* Show links for logged in buyers */}
                        {isAuthenticated && user?.role === 'buyer' && (
                            <div className="flex items-center gap-2">
                                <Link to="/account" className="text-gray-500 hover:text-primary p-2" title="My Account">
                                    <User size={20} />
                                </Link>
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
                                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                                    <h3 className="text-lg font-bold text-gray-900">Edit Delivery Location</h3>
                                    <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                    {/* Map Area */}
                                    <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden shadow-inner mb-4">
                                        <MapContainer 
                                            center={[mapCenter.lat, mapCenter.lng]} 
                                            zoom={16} 
                                            scrollWheelZoom={true} 
                                            zoomControl={false}
                                            style={{ height: "100%", width: "100%", zIndex: 10 }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <MapUpdater center={mapCenter} />
                                            <MapEvents onMoveEnd={handleMapMoveEnd} />
                                        </MapContainer>
                                        
                                        {/* Center Fixed Marker */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[85%] z-[400] pointer-events-none drop-shadow-md">
                                            <div className="relative flex flex-col items-center">
                                                <div className="bg-gray-900 text-white p-2 rounded-full shadow-lg">
                                                    <MapPin size={24} className="fill-current" />
                                                </div>
                                                <div className="w-1.5 h-1.5 bg-black/40 rounded-full mt-1 blur-[1px]"></div>
                                            </div>
                                        </div>

                                        {/* Floating Detect Button */}
                                        <button
                                            onClick={handleDetectLocation}
                                            disabled={isLocating}
                                            className="absolute bottom-3 right-3 z-[400] bg-white text-primary p-2.5 rounded-full shadow-lg border border-gray-100 font-bold hover:bg-gray-50 flex items-center justify-center transition-colors disabled:opacity-50"
                                            title="Use my current location"
                                        >
                                            {isLocating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div> : <LocateFixed size={20} />}
                                        </button>
                                        <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow border border-gray-100 text-xs font-bold text-gray-700 pointer-events-none">
                                            Drag map to adjust pin
                                        </div>
                                    </div>

                                    {/* Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Save address as</label>
                                        <div className="flex gap-2">
                                            {['Home', 'Office', 'Other'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setEditForm(prev => ({ ...prev, type }))}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${editForm.type === type ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                    disabled={isLocating}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Address</label>
                                        <textarea
                                            rows="2"
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                                            placeholder="House No, Building Name, Street, Area"
                                            disabled={isLocating}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Landmark (Optional)</label>
                                        <input
                                            type="text"
                                            value={editForm.landmark}
                                            onChange={(e) => setEditForm({ ...editForm, landmark: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            placeholder="e.g. Opposite Metro Station"
                                            disabled={isLocating}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                value={editForm.city}
                                                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                                placeholder="e.g. Bangalore"
                                                disabled={isLocating}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                            <input
                                                type="text"
                                                value={editForm.pincode}
                                                onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                                placeholder="e.g. 560001"
                                                disabled={isLocating}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                            placeholder="10-digit mobile number"
                                            disabled={isLocating}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
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
