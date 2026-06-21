import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

export default function ProductCard({ product }) {
  const { addItem, setIsOpen } = useCartStore();
  const { addToast } = useToastStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addItem(product, 1);
      addToast(`${product.name} added to cart`, 'success');
      
      // Trigger cart bounce event for navbar
      const event = new CustomEvent('cart-item-added', { detail: { product } });
      window.dispatchEvent(event);
    } catch (err) {
      addToast(err.message || 'Failed to add item', 'error');
    } finally {
      setTimeout(() => setIsAdding(false), 800);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    addToast(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      isWishlisted ? 'info' : 'success'
    );
  };

  return (
    <motion.div
      className="group relative border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${product.slug}`} className="flex-grow flex flex-col">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-50 flex items-center justify-center p-4">
          {/* Badge */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
              {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 shadow-sm border border-slate-100/50 backdrop-blur-sm z-10 transition-colors"
            whileTap={{ scale: 1.4 }}
            animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </motion.button>

          {/* Image Swap on Hover */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.name}
              className={`max-h-48 max-w-full object-contain transition-all duration-500 ${
                isHovered && product.images[1] ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            />
            {product.images[1] && (
              <img
                src={product.images[1]}
                alt={`${product.name} secondary`}
                className={`absolute max-h-48 max-w-full object-contain transition-all duration-500 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 flex-grow flex flex-col">
          <p className="text-xs text-brand-blue font-bold tracking-wide uppercase mb-1">
            {product.category?.name || 'Hardware'}
          </p>
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-brand-blue transition-colors mb-2">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(product.rating || 4.5) ? 'fill-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {product.rating || '4.5'}
            </span>
          </div>

          {/* Price & Buy Section */}
          <div className="mt-auto pt-3 border-t border-slate-50 flex items-end justify-between overflow-hidden">
            <div>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through block">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-base font-bold text-slate-900">
                ₹{price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Slide-up Add to Cart Button */}
            <div className="relative h-10 w-28 overflow-hidden">
              <AnimatePresence initial={false}>
                {!isHovered && !isAdding ? (
                  <motion.div
                    key="brand"
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-end text-xs font-medium text-slate-400"
                  >
                    {product.brand}
                  </motion.div>
                ) : (
                  <motion.button
                    key="add-to-cart"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 25, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold text-white transition-colors shadow-sm ${
                      product.stock === 0
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-brand-blue hover:bg-blue-800'
                    }`}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
