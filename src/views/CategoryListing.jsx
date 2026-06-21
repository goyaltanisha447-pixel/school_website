import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Grid as GridIcon, List, SlidersHorizontal, ChevronLeft, ChevronRight, 
  Search, Star, ShoppingCart, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

const BRANDS = [
  'DuroSleek', 'MaxShield', 'Apex', 'L&T', 'Schneider Electric', 
  'Havells', 'Polycab', 'Finolex', 'Anchor', 'Philips', 'Syska', 
  'CenturyPly', 'Greenply', 'Action TESA', 'Tata Tiscon', 'Jindal Panther', 
  'CP PLUS', 'Hikvision', 'Dahua', 'Luminous', 'Exide', 'Microtek', 
  'Godrej', 'Yale', 'Kavacha'
];

const CATEGORIES = [
  { name: 'Building Hardware', slug: 'building-hardware' },
  { name: 'Electrical & Switchgear', slug: 'electrical-switchgear' },
  { name: 'Wires & Cables', slug: 'wires-cables' },
  { name: 'Lighting Solutions', slug: 'lighting-solutions' },
  { name: 'Wood & Boards', slug: 'wood-boards' },
  { name: 'Steel & Metal', slug: 'steel-metal' },
  { name: 'CCTV & Surveillance', slug: 'cctv-surveillance' },
  { name: 'Power Solutions', slug: 'power-solutions' },
  { name: 'Safety & Lockers', slug: 'safety-security-lockers' },
];

export default function CategoryListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  // State derived from URL search parameters
  const activeCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  // Core filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // UI states
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state search query to URL parameter on trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery) prev.set('search', searchQuery);
      else prev.delete('search');
      prev.set('page', '1');
      return prev;
    });
    setCurrentPage(1);
  };

  // Fetch products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let queryParams = `?page=${currentPage}&limit=9`;
        if (activeCategory) queryParams += `&category=${activeCategory}`;
        if (initialSearch) queryParams += `&search=${initialSearch}`;
        if (minPrice) queryParams += `&minPrice=${minPrice}`;
        if (maxPrice) queryParams += `&maxPrice=${maxPrice}`;
        if (selectedBrand) queryParams += `&brand=${selectedBrand}`;
        if (sortBy) queryParams += `&sort=${sortBy}`;

        const data = await api.get(`/products${queryParams}`);
        setProducts(data.products || []);
        setPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
        });
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [activeCategory, initialSearch, minPrice, maxPrice, selectedBrand, sortBy, currentPage]);

  const handleCategoryChange = (slug) => {
    setSearchParams(prev => {
      if (slug) prev.set('category', slug);
      else prev.delete('category');
      prev.set('page', '1');
      return prev;
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    setSearchParams(prev => {
      prev.set('page', String(page));
      return prev;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
    setSortBy('newest');
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            {activeCategory
              ? CATEGORIES.find(c => c.slug === activeCategory)?.name
              : 'DTC Hardware Catalog'}
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-sans">
            Showing products verified with GST invoices, ready for Hyderabad dispatch.
          </p>
        </div>

        {/* View and Filter Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1 text-sm font-semibold border border-slate-200 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center gap-2">
            {/* Grid/List View Toggles */}
            <div className="hidden sm:flex border border-slate-200 rounded-xl p-1 bg-white shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-100 text-[#0A2A6B]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <GridIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-slate-100 text-[#0A2A6B]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ==========================================
            FILTER SIDEBAR (DESKTOP)
           ========================================== */}
        <aside className="hidden md:block space-y-6">
          
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 bg-white shadow-sm font-sans"
            />
            <button type="submit" className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600">
              <Search className="h-4.5 w-4.5" />
            </button>
          </form>

          {/* Category Filter */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Categories</h3>
            <div className="space-y-1.5 text-sm">
              <button
                onClick={() => handleCategoryChange('')}
                className={`block text-left w-full px-2 py-1 rounded transition-colors ${
                  !activeCategory ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                All Products
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`block text-left w-full px-2 py-1 rounded transition-colors ${
                    activeCategory === cat.slug ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Price Range (₹)</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-sm border border-slate-200 p-2 rounded-lg text-center"
              />
              <span className="text-slate-400">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-sm border border-slate-200 p-2 rounded-lg text-center"
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">Brand</h3>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-sm border border-slate-200 p-2.5 rounded-lg bg-white"
            >
              <option value="">All Brands</option>
              {BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors uppercase border border-dashed border-slate-200 hover:border-rose-200 p-2.5 rounded-xl"
          >
            Clear All Filters
          </button>
        </aside>

        {/* ==========================================
            MOBILE FILTER DRAWER
           ========================================== */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-slate-900 z-50 md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white p-6 shadow-2xl z-50 flex flex-col md:hidden"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <span className="font-bold text-slate-900">Filters</span>
                  <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 font-bold">X</button>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Category</h4>
                    <select
                      value={activeCategory}
                      onChange={(e) => {
                        handleCategoryChange(e.target.value);
                        setShowMobileFilters(false);
                      }}
                      className="w-full text-sm border border-slate-200 p-2 rounded-lg"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Brand</h4>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full text-sm border border-slate-200 p-2 rounded-lg"
                    >
                      <option value="">All Brands</option>
                      {BRANDS.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Price Range</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full border p-2 rounded-lg text-center"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full border p-2 rounded-lg text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      clearFilters();
                      setShowMobileFilters(false);
                    }}
                    className="w-1/2 text-center text-sm font-semibold text-slate-500 border border-slate-200 py-2.5 rounded-lg"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-1/2 bg-blue-500 text-white font-bold py-2.5 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ==========================================
            PRODUCT GRID / LIST AREA
           ========================================== */}
        <section className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] border border-slate-100 rounded-2xl bg-white p-8 text-center shadow-sm">
              <ShieldAlert className="h-12 w-12 text-slate-300 mb-3 animate-bounce" />
              <h3 className="text-base font-bold text-slate-800">No products match search criteria</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Try widening your price range, choosing another category, or cleaning search terms.
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 bg-brand-blue text-white px-5 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-800 transition-colors"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {products.map(product => {
                const price = product.discountPrice || product.price;
                const hasDiscount = !!product.discountPrice;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm flex flex-col sm:flex-row gap-4 items-center hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/products/${product.slug}`} className="w-full sm:w-40 h-40 flex-shrink-0 flex items-center justify-center p-2 bg-slate-50 border border-slate-100 rounded-xl relative">
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          Sale
                        </span>
                      )}
                      <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </Link>
                    
                    <div className="flex-grow min-w-0">
                      <Link to={`/products/${product.slug}`}>
                        <span className="text-xs text-brand-blue font-bold tracking-wide uppercase">{product.category?.name}</span>
                        <h3 className="text-base font-bold text-slate-800 hover:text-brand-blue transition-colors mt-0.5 line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-slate-400 font-semibold mb-2">Brand: {product.brand}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{product.description}</p>
                      
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating || 4.5) ? 'fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{product.rating}</span>
                      </div>
                    </div>
                    
                    <div className="sm:border-l sm:border-slate-100 sm:pl-6 w-full sm:w-48 flex-shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-3">
                      <div>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through block">₹{product.price.toLocaleString('en-IN')}</span>
                        )}
                        <span className="text-lg font-bold text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <button
                        onClick={async () => {
                          try {
                            await addItem(product, 1);
                            addToast('Added to cart', 'success');
                          } catch (e) {
                            addToast(e.message, 'error');
                          }
                        }}
                        className="bg-brand-blue hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ==========================================
              PAGINATION
             ========================================== */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 border-t border-slate-100 pt-6">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 flex items-center justify-center font-bold text-sm rounded-xl transition-all ${
                      pagination.page === pageNum
                        ? 'bg-brand-blue text-white shadow-md shadow-blue-500/10'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
