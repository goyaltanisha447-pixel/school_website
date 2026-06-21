import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, PlusCircle, Settings, 
  IndianRupee, Package, Users, ShieldCheck, Edit, Trash2, Calendar 
} from 'lucide-react';
import { api } from '../utils/api';
import { useToastStore } from '../store/toastStore';

export default function AdminDashboard() {
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState('overview'); // overview | orders | add-product
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Orders Log
  const [adminOrders, setAdminOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Categories
  const [categories, setCategories] = useState([]);

  // Add Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    brand: '',
    categoryId: '',
    images: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600', // default placeholder
    specs: '{"Material": "Premium Grade", "Warranty": "1 Year"}',
  });
  const [savingProduct, setSavingProduct] = useState(false);

  // Fetch admin stats & categories
  const fetchMetricsAndCategories = async () => {
    setLoadingMetrics(true);
    try {
      const stats = await api.get('/admin/metrics');
      setMetrics(stats);
      
      const cats = await api.get('/categories');
      setCategories(cats || []);
      if (cats.length > 0 && !productForm.categoryId) {
        setProductForm(prev => ({ ...prev, categoryId: cats[0].id }));
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load metrics', 'error');
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchAdminOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.get('/admin/orders');
      setAdminOrders(data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load admin orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchMetricsAndCategories();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchAdminOrders();
    } else if (activeTab === 'overview') {
      fetchMetricsAndCategories();
    }
  }, [activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order status updated to ${newStatus}`, 'success');
      // Refresh order list
      fetchAdminOrders();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.slug || !productForm.price || !productForm.categoryId) {
      addToast('Please fill all required fields', 'warning');
      return;
    }
    setSavingProduct(true);
    try {
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(productForm.specs);
      } catch (e) {
        parsedSpecs = { details: productForm.specs };
      }

      const payload = {
        ...productForm,
        specs: parsedSpecs
      };

      await api.post('/admin/products', payload);
      addToast('New product created successfully!', 'success');
      setProductForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        brand: '',
        categoryId: categories[0]?.id || '',
        images: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
        specs: '{"Material": "Premium Grade", "Warranty": "1 Year"}',
      });
      // Update stats
      fetchMetricsAndCategories();
    } catch (err) {
      addToast(err.message || 'Failed to create product', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-850';
      case 'CONFIRMED':
        return 'bg-blue-150 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-850';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Hand Navigation Menu */}
        <aside className="w-full md:w-64 border border-slate-100 rounded-3xl p-5 bg-white shadow-sm flex-shrink-0 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 bg-blue-600 text-white font-extrabold rounded-xl flex items-center justify-center">
              A
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Admin Control</h3>
              <p className="text-[10px] font-semibold text-slate-400">Drisha Trading Co.</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>Metrics Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span>Manage Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === 'add-product' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>Create Product</span>
            </button>
          </nav>
        </aside>

        {/* Right Hand Details Container */}
        <section className="flex-grow w-full space-y-6">
          <AnimatePresence mode="wait">
            
            {/* ==========================================
                TAB: METRICS OVERVIEW
               ========================================== */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-slate-800 font-sans border-b border-slate-100 pb-3">DTC Sales Dashboard</h2>
                
                {loadingMetrics ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-28 bg-slate-100 rounded-3xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Card */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <IndianRupee className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Total Revenue</span>
                        <span className="text-xl font-extrabold text-slate-900">₹{metrics.totalRevenue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Orders Logged</span>
                        <span className="text-xl font-extrabold text-slate-900">{metrics.totalOrders}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Catalog Products</span>
                        <span className="text-xl font-extrabold text-slate-900">{metrics.totalProducts}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block font-semibold">Customer Base</span>
                        <span className="text-xl font-extrabold text-slate-900">{metrics.totalUsers}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==========================================
                TAB: MANAGE ORDERS
               ========================================== */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4"
              >
                <h2 className="text-base font-bold text-slate-800 font-sans border-b border-slate-100 pb-3">All Customer Orders</h2>
                
                {loadingOrders ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-blue mx-auto" />
                  </div>
                ) : adminOrders.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10 font-sans">No orders placed on the system yet.</p>
                ) : (
                  <div className="overflow-x-auto border border-slate-100 rounded-2xl text-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-xs uppercase">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Order Status</th>
                          <th className="p-4">Order Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-mono font-bold text-xs text-slate-400">#{o.id.substr(0, 8)}</td>
                            <td className="p-4">
                              <p className="font-bold text-slate-800">{o.user?.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{o.user?.email}</p>
                            </td>
                            <td className="p-4 font-extrabold text-slate-900">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                            <td className="p-4">
                              <select
                                value={o.status}
                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                className={`text-xs font-bold border rounded-full px-2.5 py-1 focus:outline-none ${getStatusColor(o.status)}`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="p-4 text-xs text-slate-400 font-semibold flex items-center gap-1 mt-1 border-t-0">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==========================================
                TAB: CREATE PRODUCT CRUD FORM
               ========================================== */}
            {activeTab === 'add-product' && (
              <motion.form
                key="add-product"
                onSubmit={handleAddProduct}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 max-w-2xl"
              >
                <h2 className="text-base font-bold text-slate-800 font-sans border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <PlusCircle className="h-5 w-5 text-blue-500" />
                  <span>Create New Catalog Product</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CenturyPly Waterproof 19mm"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Unique Slug (URL) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. centuryply-waterproof-19mm"
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter detailed specifications and description..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Price (INR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5200"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Discount Price (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4850"
                      value={productForm.discountPrice}
                      onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Initial Stock *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. CenturyPly"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Category *</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Image URLs (comma-sep)</label>
                    <input
                      type="text"
                      placeholder="comma-separated URLs"
                      value={productForm.images}
                      onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                      className="w-full text-sm border border-slate-200 p-2.5 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Specifications (JSON string)</label>
                  <input
                    type="text"
                    value={productForm.specs}
                    onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                    className="w-full text-sm border border-slate-200 p-2.5 rounded-xl font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white py-3 rounded-xl font-bold mt-4 shadow flex items-center justify-center gap-1.5"
                >
                  {savingProduct ? 'Creating Product...' : 'Add Catalog Product'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
