import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalAmount, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const handleCheckout = () => {
    setIsOpen(false);
    if (!isAuthenticated) {
      addToast('Please login to proceed to checkout', 'info');
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.95 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900 z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col h-full border-l border-slate-100"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-blue" />
                <h2 className="text-lg font-bold text-slate-900 font-sans">Shopping Cart</h2>
                <span className="bg-brand-blue/10 text-brand-blue text-xs font-semibold px-2 py-0.5 rounded-full">
                  {items.reduce((acc, item) => acc + item.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-grow overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">Your cart is empty</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs">
                    Browse our high-quality hardware and home-solutions products to add items.
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/products');
                    }}
                    className="mt-6 bg-brand-blue text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-blue-dark shadow-sm hover:shadow transition-all"
                  >
                    Shop Hardware
                  </button>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {items.map((item) => {
                    const price = item.product.discountPrice || item.product.price;
                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        layout
                        className="flex gap-3 p-3 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow bg-white relative"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg bg-slate-50 border border-slate-100"
                        />
                        <div className="flex-grow min-w-0 pr-4">
                          <h4 className="text-sm font-semibold text-slate-800 truncate">{item.product.name}</h4>
                          <p className="text-xs text-slate-400 mb-1">{item.product.brand}</p>
                          <div className="flex items-center justify-between mt-1">
                            {/* Quantity Adjuster */}
                            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold text-slate-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-white rounded text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            {/* Price */}
                            <div className="text-right">
                              <span className="text-sm font-bold text-slate-900">₹{(price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                        {/* Remove Button */}
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            addToast('Removed from cart', 'info');
                          }}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-colors rounded-full hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{getTotalAmount().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>GST (Included)</span>
                    <span>18%</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Estimated Total</span>
                    <span>₹{getTotalAmount().toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-blue hover:bg-blue-800 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-800 mt-3 block transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
