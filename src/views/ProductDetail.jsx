import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShieldCheck, ShoppingCart, CreditCard, ChevronLeft, Minus, Plus, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, setIsOpen } = useCartStore();
  const { addToast } = useToastStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  // Fetch product detail and related products
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/products/${slug}`);
        setProduct(data);
        setActiveImageIdx(0);
        setQuantity(1);
        
        // Fetch related products in category
        if (data.categoryId) {
          setRelatedLoading(true);
          const related = await api.get(`/products?category=${data.category.slug}&limit=5`);
          // Filter out current product
          const filtered = (related.products || []).filter(p => p.id !== data.id);
          setRelatedProducts(filtered);
          setRelatedLoading(false);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
        addToast('Product not found', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  // Image Zoom Hover Logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[activeImageIdx]})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity);
      addToast(`${quantity} x ${product.name} added to cart`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(product, quantity);
      setIsOpen(false);
      navigate('/checkout');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Settings className="h-10 w-10 text-brand-blue animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading catalog item...</span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const price = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A2A6B] hover:text-blue-800 transition-colors mb-8">
        <ChevronLeft className="h-4.5 w-4.5" />
        <span>Back to Products</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm mb-16">
        
        {/* ==========================================
            IMAGE GALLERY
           ========================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-6 cursor-zoom-in">
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                {discountPercent}% OFF
              </span>
            )}
            
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="max-h-full max-w-full object-contain z-10 transition-transform duration-200"
            />

            {/* Hover Zoom Box */}
            <div
              className="absolute inset-0 z-20 pointer-events-none bg-no-repeat border border-slate-200 rounded-2xl bg-white bg-[size:200%]"
              style={{
                ...zoomStyle,
                backgroundSize: '220%'
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 border rounded-xl overflow-hidden p-1 bg-white hover:border-blue-300 transition-colors ${
                    activeImageIdx === idx ? 'border-brand-blue ring-2 ring-blue-500/10' : 'border-slate-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ==========================================
            PRODUCT INFO
           ========================================== */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs text-brand-blue font-bold tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
              {product.category?.name}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4.5 w-4.5 ${i < Math.round(product.rating || 4.5) ? 'fill-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-500">
                {product.rating} ({product.reviews?.length || 0} customer reviews)
              </span>
            </div>

            <p className="text-sm text-slate-400 font-medium">Brand: <span className="text-slate-700 font-semibold">{product.brand}</span></p>

            <hr className="border-slate-100" />

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3">
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                ₹{price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-slate-400">(Inclusive of all GST)</span>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed font-sans">{product.description}</p>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            {/* Stock / Quantity Adjuster */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-700">Quantity</span>
              {product.stock > 0 ? (
                <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50 shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">Out of Stock</span>
              )}
              
              {product.stock > 0 && (
                <span className="text-xs font-semibold text-slate-400">
                  Only {product.stock} units left in stock.
                </span>
              )}
            </div>

            {/* CTA Buy Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full sm:w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-40"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full sm:w-1/2 bg-brand-blue hover:bg-blue-800 text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.99] transition-all disabled:opacity-40"
              >
                <CreditCard className="h-5 w-5" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Quality assurances */}
            <div className="flex gap-6 text-xs text-slate-400 border-t border-slate-50 pt-4">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
                <span>100% Genuine product</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
                <span>GST Tax Invoice Provided</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          SPECIFICATIONS TABLE & REVIEWS
         ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Specs Table */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 font-sans">Product Specifications</h2>
          <div className="border border-slate-100 rounded-2xl overflow-hidden text-sm">
            {Object.entries(product.specs || {}).map(([key, val], idx) => (
              <div
                key={key}
                className={`grid grid-cols-3 p-3.5 border-b border-slate-100 last:border-0 ${
                  idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                }`}
              >
                <span className="font-bold text-slate-500 col-span-1">{key}</span>
                <span className="font-semibold text-slate-800 col-span-2">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 font-sans">Customer Feedback</h2>
            
            {product.reviews?.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No reviews yet for this product. Be the first to buy and share feedback!</p>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {product.reviews.map((r, idx) => (
                  <div key={r.id || idx} className="border-b border-slate-50 pb-3 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-700 text-xs">{r.user?.name || 'Customer'}</span>
                      <div className="flex text-amber-400">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          RELATED PRODUCTS CAROUSEL
         ========================================== */}
      {relatedProducts.length > 0 && (
        <section className="py-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6 font-sans">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedLoading ? (
              [...Array(4)].map((_, idx) => <ProductCardSkeleton key={idx} />)
            ) : (
              relatedProducts.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
