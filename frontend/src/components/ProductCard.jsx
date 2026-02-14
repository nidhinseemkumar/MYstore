import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { PLACEHOLDER_IMAGE } from '../data/mockData';

export const ProductCard = ({ product }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const [displayImage, setDisplayImage] = useState(product.image_url || product.image || PLACEHOLDER_IMAGE);

  useEffect(() => {
    if (product.barcode) {
      const fetchImage = async () => {
        try {
          const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${product.barcode}.json`);
          const data = await response.json();
          if (data.status === 1 && data.product.image_front_url) {
            setDisplayImage(data.product.image_front_url);
          }
        } catch (error) {
          console.error("Error fetching image from OpenFoodFacts:", error);
        }
      };

      fetchImage();
    }
  }, [product.barcode, product.image]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full group">
      {/* Image Section */}
      <div className="relative h-40 w-full p-4 flex items-center justify-center bg-gray-50">
        <img
          src={displayImage}
          alt={product.name}
          className="h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
        />
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-1">
        <div className="text-[10px] text-gray-500 mb-1 truncate">{product.category}</div>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-auto" title={product.name}>
          {product.name}
        </h3>

        <div className="text-[10px] text-gray-500 mt-2">{product.description}</div>

        {/* Price & Action */}
        <div className="mt-3 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={() => addItem(product)}
              className="px-6 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold uppercase hover:bg-green-100 transition-colors"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-green-600 rounded-lg h-8">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-8 h-full flex items-center justify-center text-white hover:bg-green-700 rounded-l-lg transition-colors"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-white text-xs font-bold w-4 text-center">{quantity}</span>
              <button
                onClick={() => addItem(product)}
                className="w-8 h-full flex items-center justify-center text-white hover:bg-green-700 rounded-r-lg transition-colors"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
