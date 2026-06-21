import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, ClipboardCheck, CreditCard, CheckCircle, Settings, 
  ShieldCheck, HelpCircle, ArrowRight, User 
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { api } from '../utils/api';

// Script loader helper for Razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotalAmount, clearCart } = useCartStore();
  const { user, updateProfile } = useAuthStore();
  const { addToast } = useToastStore();

  const discountPercent = location.state?.discountPercent || 0;
  
  // Checkout Steps: 1 = Shipping, 2 = Review, 3 = Payment, 4 = Confirmation
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  
  // Address State
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  
  // Pre-fill address if user has saved addresses
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setAddressData({
        id: defaultAddr.id,
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country,
      });
    }
  }, [user]);

  const subtotal = getTotalAmount();
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal - discountAmount;

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.postalCode) {
      addToast('Please fill all address fields', 'warning');
      return;
    }
    
    // Save address back to user profile if it's new
    if (!addressData.id) {
      try {
        await updateProfile({
          addresses: [{
            street: addressData.street,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode,
            country: addressData.country,
            isDefault: true
          }]
        });
      } catch (err) {
        console.error('Failed to save address to DB', err);
      }
    }
    setStep(2);
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // Find or create address ID
      let finalAddressId = addressData.id;
      if (!finalAddressId) {
        // Refetch user to get the newly saved address ID
        const updatedUser = await api.get('/auth/me');
        finalAddressId = updatedUser.addresses[0]?.id;
      }

      if (!finalAddressId) {
        throw new Error('Address configuration error. Please re-enter shipping details.');
      }

      // 1. Create order on Express backend
      const orderPayload = {
        addressId: finalAddressId,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price
        }))
      };

      const orderRes = await api.post('/orders', orderPayload);
      const dbOrderId = orderRes.orderId;

      if (orderRes.mode === 'RAZORPAY') {
        // 2a. Real Razorpay Mode flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Are you connected to the internet?');
        }

        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency,
          name: 'Drisha Trading Company',
          description: 'Hardware Order Payment',
          order_id: orderRes.razorpayOrderId,
          handler: async (response) => {
            setIsProcessing(true);
            try {
              // 3a. Verify Payment on Backend
              const verifyRes = await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrderId,
              });

              if (verifyRes.status === 'success') {
                setConfirmedOrderId(dbOrderId);
                clearCart();
                setStep(4);
                addToast('Payment verified, order confirmed!', 'success');
              } else {
                addToast('Payment signature verification failed', 'error');
                setStep(3); // return to payment page
              }
            } catch (err) {
              addToast(err.message || 'Payment verification failed', 'error');
              setStep(3);
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || '8121611555',
          },
          notes: {
            address: addressData.street,
          },
          theme: {
            color: '#0A2A6B',
          },
          modal: {
            ondismiss: () => {
              addToast('Payment cancelled by user', 'info');
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // 2b. Simulated Payment Flow (Fallback for missing API keys)
        addToast('Operating in Simulation Mode', 'info');
        
        // Mock a 2 second delay for processing simulation popup modal
        setTimeout(async () => {
          try {
            const mockPaymentId = `pay_sim_${Math.random().toString(36).substr(2, 9)}`;
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: orderRes.razorpayOrderId,
              razorpay_payment_id: mockPaymentId,
              orderId: dbOrderId,
            });

            if (verifyRes.status === 'success') {
              setConfirmedOrderId(dbOrderId);
              clearCart();
              setStep(4);
              addToast('Order confirmed (Simulated Mode)!', 'success');
            } else {
              throw new Error('Simulation verification failed');
            }
          } catch (err) {
            addToast(err.message, 'error');
          } finally {
            setIsProcessing(false);
          }
        }, 2200);
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Checkout failed to process', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* ==========================================
          STEP PROGRESS INDICATOR
         ========================================== */}
      <div className="mb-10 relative">
        <div className="flex justify-between items-center z-10 relative">
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border ${
              step >= 1 ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2">Shipping</span>
          </div>

          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border ${
              step >= 2 ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <ClipboardCheck className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2">Review</span>
          </div>

          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border ${
              step >= 3 ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2">Payment</span>
          </div>

          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all border ${
              step >= 4 ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-slate-400 border-slate-200'
            }`}>
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2">Receipt</span>
          </div>
        </div>

        {/* Progress Bar fills as user advances */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 z-0">
          <div 
            className="h-full bg-brand-blue transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Main container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {/* ==========================================
              STEP 1: SHIPPING ADDRESS
             ========================================== */}
          {step === 1 && (
            <motion.form
              key="step1"
              onSubmit={handleAddressSubmit}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-800 font-sans border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>Delivery Address Details</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Plot No., Street, Locality Name"
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Telangana"
                      value={addressData.state}
                      onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500067"
                      value={addressData.postalCode}
                      onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold mt-6 flex items-center justify-center gap-1.5 shadow"
              >
                <span>Continue to Review</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.form>
          )}

          {/* ==========================================
              STEP 2: ORDER REVIEW
             ========================================== */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-slate-800 font-sans border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <ClipboardCheck className="h-5 w-5 text-blue-500" />
                <span>Review Order Items</span>
              </h2>

              {/* Items listing */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                {items.map(item => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700 truncate max-w-[280px]">
                        {item.product.name} <span className="text-xs text-slate-400 font-bold">x {item.quantity}</span>
                      </span>
                      <span className="font-bold text-slate-800">₹{(price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  );
                })}
              </div>

              {/* Shipping address review */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-white space-y-2">
                <h3 className="font-bold text-xs uppercase text-slate-400">Shipping To:</h3>
                <p className="text-sm font-semibold text-slate-700">
                  {addressData.street}, {addressData.city}, {addressData.state} - {addressData.postalCode} ({addressData.country})
                </p>
              </div>

              {/* Summary */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Grand Total Price</span>
                  <span className="text-2xl font-extrabold text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-[#0A2A6B] hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold text-sm shadow flex items-center gap-1.5"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              STEP 3: PAYMENT INTERACTION
             ========================================== */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6 text-center"
            >
              <h2 className="text-lg font-bold text-slate-800 font-sans border-b border-slate-100 pb-3 flex items-center justify-center gap-1.5">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span>Secure Payment Gateway</span>
              </h2>

              {/* Sandbox Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2 max-w-md mx-auto">
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  TEST MODE — NO REAL MONEY
                </span>
                <p className="text-xs text-amber-800 font-semibold leading-relaxed font-sans">
                  We are testing this integration using Razorpay Test environment sandbox credentials.
                </p>
                <div className="border-t border-amber-100 pt-2 text-[10px] text-amber-700 font-bold space-y-1">
                  <p>💳 Card: 4111 1111 1111 1111 | Expiry: Future | CVV: Any</p>
                  <p>📱 UPI: success@razorpay</p>
                </div>
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <Settings className="h-10 w-10 text-brand-blue animate-spin" />
                  <p className="text-xs font-bold text-slate-500 animate-pulse">
                    Initializing secure Razorpay payment gateway...
                  </p>
                </div>
              ) : (
                <div className="border border-slate-100 rounded-3xl p-6 bg-slate-50/50 space-y-4 max-w-sm mx-auto">
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block font-semibold">Total Payable Amount</span>
                    <span className="text-3xl font-extrabold text-slate-900 block mt-1">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={handlePay}
                    className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold shadow-md shadow-blue-900/10 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span>Pay with Razorpay</span>
                  </button>
                  
                  <button
                    onClick={() => setStep(2)}
                    className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 block transition-colors"
                  >
                    Go back and edit order
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ==========================================
              STEP 4: ORDER CONFIRMATION
             ========================================== */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 py-6"
            >
              {/* Checkmark draw-in visual */}
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="h-12 w-12 text-emerald-500 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-950 font-sans tracking-tight">Order Placed Successfully!</h1>
                <p className="text-xs text-slate-500 font-semibold font-sans">
                  Thank you for ordering from Drisha Trading Company.
                </p>
              </div>

              {/* Order Reference Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 max-w-sm mx-auto text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-bold text-slate-800">{confirmedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-slate-800">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-600 uppercase">Confirmed</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xs mx-auto pt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-sm shadow"
                >
                  Track in Dashboard
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-sm"
                >
                  Shop More
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
