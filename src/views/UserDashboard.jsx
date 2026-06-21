import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, ClipboardList, Settings, ShieldCheck, 
  ChevronRight, Calendar, Info, Clock, Truck, PackageCheck 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { api } from '../utils/api';

export default function UserDashboard() {
  const { user, updateProfile } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState('orders'); // orders | profile | address
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Add Form State
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', postalCode: '', country: 'India' });
  const [addingAddress, setAddingAddress] = useState(false);

  // Fetch orders
  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await api.get('/orders');
        setOrders(data || []);
        if (data.length > 0) {
          setSelectedOrder(data[0]); // default select first order
        }
      } catch (err) {
        console.error(err);
        addToast('Failed to load orders', 'error');
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchUserOrders();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName) return;
    setSavingProfile(true);
    try {
      await updateProfile({ name: profileName, phone: profilePhone });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Profile update failed', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode) {
      addToast('Please fill all fields', 'warning');
      return;
    }
    setAddingAddress(true);
    try {
      await updateProfile({
        addresses: [addressForm]
      });
      addToast('New address saved!', 'success');
      setAddressForm({ street: '', city: '', state: '', postalCode: '', country: 'India' });
    } catch (err) {
      addToast('Failed to add address', 'error');
    } finally {
      setAddingAddress(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-850 border-amber-200';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-800 border-blue-150';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-850 border-emerald-250';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTimelineStep = (status) => {
    if (status === 'PENDING') return 1;
    if (status === 'CONFIRMED') return 2;
    if (status === 'SHIPPED') return 3;
    if (status === 'DELIVERED') return 4;
    return 1;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Hand Navigation Menu */}
        <aside className="w-full md:w-64 border border-slate-100 rounded-3xl p-5 bg-white shadow-sm flex-shrink-0 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 bg-[#0A2A6B] text-white font-extrabold rounded-xl flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800 truncate">{user?.name}</h3>
              <p className="text-[10px] font-semibold text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ClipboardList className="h-4.5 w-4.5" />
              <span>Order Tracking</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="h-4.5 w-4.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === 'address' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="h-4.5 w-4.5" />
              <span>Saved Addresses</span>
            </button>
          </nav>
        </aside>

        {/* Right Hand Details Container */}
        <section className="flex-grow w-full space-y-6">
          <AnimatePresence mode="wait">
            
            {/* ==========================================
                TAB: ORDER LIST AND TRACKING TIMELINE
               ========================================== */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Orders Log list */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-800 font-sans border-b border-slate-100 pb-3">My Orders</h2>
                  
                  {loadingOrders ? (
                    <div className="text-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-blue mx-auto" />
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-10 font-sans">You have not placed any orders yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                      {orders.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className={`w-full border p-3.5 rounded-2xl flex flex-col text-left transition-all ${
                            selectedOrder?.id === o.id
                              ? 'border-brand-blue ring-2 ring-blue-500/5 bg-blue-50/10'
                              : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">#{o.id.substr(0, 8)}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${getStatusColor(o.status)}`}>
                              {o.status}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-end mt-3 w-full">
                            <div>
                              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                                <Calendar className="h-3 w-3" />
                                {new Date(o.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs font-semibold text-slate-700 block mt-1">
                                {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                            <span className="text-sm font-extrabold text-slate-900">₹{o.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Order Detailed Progress */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                  {selectedOrder ? (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <span className="text-[10px] text-slate-400 font-mono block">Order ID: {selectedOrder.id}</span>
                        <h2 className="text-base font-extrabold text-slate-800 mt-1 font-sans">Order Details</h2>
                      </div>

                      {/* Animated tracking timeline */}
                      <div className="py-2 border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-6">Delivery Timeline</h3>
                        
                        <div className="relative flex justify-between items-center mb-4">
                          {/* Progress Line */}
                          <div className="absolute left-6 right-6 top-5 h-0.5 bg-slate-200 z-0">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${((getTimelineStep(selectedOrder.status) - 1) / 3) * 100}%` }}
                            />
                          </div>

                          {/* Steps */}
                          <div className="flex flex-col items-center z-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                              getTimelineStep(selectedOrder.status) >= 1 ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'
                            }`}>
                              <Clock className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-slate-500">Placed</span>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                              getTimelineStep(selectedOrder.status) >= 2 ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'
                            }`}>
                              <ShieldCheck className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-slate-500">Confirmed</span>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                              getTimelineStep(selectedOrder.status) >= 3 ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'
                            }`}>
                              <Truck className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-slate-500">Shipped</span>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                              getTimelineStep(selectedOrder.status) >= 4 ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'
                            }`}>
                              <PackageCheck className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-slate-500">Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Items lists */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Items</h3>
                        <div className="space-y-2 border border-slate-100 rounded-2xl p-4 divide-y divide-slate-150">
                          {selectedOrder.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                              <div className="min-w-0 pr-4">
                                <p className="text-sm font-bold text-slate-800 truncate">{item.product.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quantity: {item.quantity}</p>
                              </div>
                              <span className="text-sm font-extrabold text-slate-800">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliver address details */}
                      <div className="flex gap-2.5 items-start text-xs border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                        <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-500 uppercase tracking-wider">Deliver Address</p>
                          <p className="font-semibold text-slate-700 mt-1">
                            {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400">
                      <Info className="h-10 w-10 mx-auto text-slate-300 mb-2 animate-bounce" />
                      <p className="text-sm font-semibold">Select an order from the list to track details.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ==========================================
                TAB: PROFILE UPDATE
               ========================================== */}
            {activeTab === 'profile' && (
              <motion.form
                key="profile"
                onSubmit={handleUpdateProfile}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 max-w-md"
              >
                <h2 className="text-base font-bold text-slate-800 font-sans border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <User className="h-5 w-5 text-blue-500" />
                  <span>Update Profile Credentials</span>
                </h2>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Company / Customer Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={user?.email}
                    className="w-full text-sm border border-slate-200 p-3 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white py-3 rounded-xl font-bold mt-6 shadow flex items-center justify-center gap-1.5"
                >
                  {savingProfile ? 'Saving updates...' : 'Save Changes'}
                </button>
              </motion.form>
            )}

            {/* ==========================================
                TAB: SAVED ADDRESSES
               ========================================== */}
            {activeTab === 'address' && (
              <motion.div
                key="address"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* List of existing saved addresses */}
                <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-800 font-sans border-b border-slate-100 pb-3">Saved Shipping Points</h2>
                  
                  {user?.addresses?.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-10 font-sans">No saved addresses found.</p>
                  ) : (
                    <div className="space-y-3">
                      {user?.addresses?.map((addr) => (
                        <div key={addr.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex gap-2.5 items-start">
                          <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            {addr.isDefault && (
                              <span className="bg-blue-100 text-blue-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Default Shipping
                              </span>
                            )}
                            <p className="text-xs font-semibold text-slate-700 mt-1">
                              {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add new address Form */}
                <form
                  onSubmit={handleAddAddress}
                  className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4"
                >
                  <h2 className="text-base font-bold text-slate-800 font-sans border-b border-slate-100 pb-3">Add New Address</h2>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. H.No. 1-007, Angadipet"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full text-sm border border-slate-200 p-2.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">State *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Telangana"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full text-sm border border-slate-200 p-2.5 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500067"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white py-3 rounded-xl font-bold mt-2 shadow"
                  >
                    {addingAddress ? 'Saving Address...' : 'Add Address'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
