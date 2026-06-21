import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalAmount } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = getTotalAmount();
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const totalAmount = subtotal - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    if (promoCode.trim().toUpperCase() === 'DTC10') {
      setAppliedDiscount(10);
      setPromoSuccess('Promo code DTC10 applied successfully! 10% discount added.');
      addToast('10% discount applied!', 'success');
    } else if (promoCode.trim().toUpperCase() === 'B2BHARDWARE') {
      setAppliedDiscount(15);
      setPromoSuccess('Contractor promo applied! 15% discount added.');
      addToast('15% discount applied!', 'success');
    } else {
      setPromoError('Invalid promo code. Try DTC10 or B2BHARDWARE');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      addToast('Please login to proceed to checkout', 'info');
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout', { state: { discountPercent: appliedDiscount } });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">Your shopping cart is empty</h1>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
          Add items from our construction hardware, CCTV surveillance, or lighting catalog to get started.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-850 shadow transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-8 font-sans">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==========================================
            LINE ITEMS LIST
           ========================================== */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm p-4 sm:p-6">
            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0"
                      />
                      <div>
                        <Link to={`/products/${item.product.slug}`} className="font-bold text-slate-800 hover:text-brand-blue transition-colors text-sm sm:text-base line-clamp-1">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Brand: {item.product.brand}</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">₹{itemPrice.toLocaleString('en-IN')} each</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-8 pt-3 sm:pt-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-extrabold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Total and Delete */}
                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold text-slate-900 w-24 text-right">
                          ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            addToast('Removed from cart', 'info');
                          }}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================
            ORDER SUMMARY
           ========================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Promo code */}
          <div className="border border-slate-100 rounded-3xl p-5 bg-white shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm font-sans flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-blue-500" />
              <span>Promo Code</span>
            </h3>
            
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter DTC10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full text-sm border border-slate-200 p-2.5 rounded-xl uppercase focus:outline-none"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 rounded-xl transition-colors"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="text-xs text-rose-500 font-semibold">{promoError}</p>}
            {promoSuccess && <p className="text-xs text-emerald-600 font-semibold">{promoSuccess}</p>}
          </div>

          {/* Pricing list */}
          <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 font-sans border-b border-slate-100 pb-3">Order Summary</h2>
            
            <div className="space-y-2.5 text-sm text-slate-500 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (Included)</span>
                <span>18%</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery charges</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-extrabold text-slate-900 py-1">
              <span>Total Price</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 active:scale-[0.99] transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <div className="flex gap-2 text-[10px] text-slate-400 bg-slate-50 border border-slate-100 p-3 rounded-xl justify-center items-center">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
              <span>Full GST Invoices supplied with all shipments for ITC claims.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
