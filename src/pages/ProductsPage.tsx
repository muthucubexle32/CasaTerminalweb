// src/pages/ProductsPage.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, SlidersHorizontal, X,
  Star, MapPin, Truck,
  Eye, GitCompare, Heart, TrendingUp, Zap, Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== TYPES ====================
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  deliveryCharge: number;
  seller: string;
  sellerId: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  stock: number;
  isBestPrice?: boolean;
  isRecommended?: boolean;
  deliveryTimeMinDays?: number;
  createdAt: string;
}

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
  PRODUCTS: 'construction_products',
  WISHLIST: 'product_wishlist',
  SEARCH_HISTORY: 'product_search_history',
  COMPARE_LIST: 'compare_list'
};

// ==================== INITIAL MOCK DATA ====================
const initialProducts: Product[] = [
  {
    id: 'p1', name: 'UltraTech Cement (50kg)', brand: 'UltraTech', category: 'Cement',
    price: 350, deliveryCharge: 50, seller: 'ABC Constructions', sellerId: 's1',
    rating: 4.5, reviewCount: 1250, location: 'Mumbai', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    stock: 5000, isBestPrice: true, isRecommended: true, deliveryTimeMinDays: 2, createdAt: new Date().toISOString()
  },
  {
    id: 'p2', name: 'TATA TMT Steel Bars (12mm)', brand: 'TATA', category: 'Steel',
    price: 750, deliveryCharge: 100, seller: 'XYZ Enterprises', sellerId: 's2',
    rating: 4.8, reviewCount: 850, location: 'Delhi', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    stock: 2500, isBestPrice: false, isRecommended: true, deliveryTimeMinDays: 3, createdAt: new Date().toISOString()
  },
  {
    id: 'p3', name: 'Asian Paints Royale', brand: 'Asian Paints', category: 'Paint',
    price: 2200, deliveryCharge: 80, seller: 'PQR Builders', sellerId: 's3',
    rating: 4.3, reviewCount: 430, location: 'Bangalore', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    stock: 0, isBestPrice: false, isRecommended: false, deliveryTimeMinDays: 4, createdAt: new Date().toISOString()
  },
  {
    id: 'p4', name: 'JCB 3DX Backhoe Loader', brand: 'JCB', category: 'Equipment',
    price: 8500, deliveryCharge: 1500, seller: 'JCB Rentals', sellerId: 's4',
    rating: 4.2, reviewCount: 12, location: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    stock: 5, isBestPrice: true, isRecommended: false, deliveryTimeMinDays: 5, createdAt: new Date().toISOString()
  },
  {
    id: 'p5', name: 'Birla White Putty', brand: 'Birla', category: 'Paint',
    price: 450, deliveryCharge: 30, seller: 'Singh Traders', sellerId: 's5',
    rating: 4.6, reviewCount: 320, location: 'Pune', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    stock: 1200, isBestPrice: false, isRecommended: false, deliveryTimeMinDays: 2, createdAt: new Date().toISOString()
  }
];

// Helper to load products from localStorage or initial
const loadProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  return initialProducts;
};

// ==================== CUSTOM HOOKS ====================
const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const newList = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(newList));
      toast.success(prev.includes(id) ? 'Removed from wishlist' : 'Added to wishlist');
      return newList;
    });
  };

  return { wishlist, toggleWishlist };
};

const useCompare = () => {
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPARE_LIST);
    return saved ? JSON.parse(saved) : [];
  });

  const addToCompare = (id: string) => {
    if (compareIds.includes(id)) {
      toast.error('Already in compare list');
      return;
    }
    if (compareIds.length >= 4) {
      toast.error('You can compare up to 4 products');
      return;
    }
    setCompareIds(prev => [...prev, id]);
    toast.success('Added to compare');
  };

  const removeFromCompare = (id: string) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  const clearCompare = () => setCompareIds([]);

  return { compareIds, addToCompare, removeFromCompare, clearCompare };
};

const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const addSearchTerm = (term: string) => {
    if (!term.trim()) return;
    setHistory(prev => {
      const filtered = prev.filter(t => t !== term);
      const newHistory = [term, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  };

  return { history, addSearchTerm, clearHistory };
};

// ==================== PRODUCT CARD PROPS TYPE ====================
interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlist: () => void;
  onCompare: () => void;
  isCompared: boolean;
  onViewDetails: () => void;
}

const ProductCard = ({
  product,
  isWishlisted,
  onWishlist,
  onCompare,
  isCompared,
  onViewDetails
}: ProductCardProps) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all relative">
      {product.isBestPrice && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10"><Zap className="w-3 h-3" /> Best Price</span>}
      {product.isRecommended && !product.isBestPrice && <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10"><TrendingUp className="w-3 h-3" /> Recommended</span>}
      <div className="relative h-48 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
        {product.stock === 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Out of Stock</span></div>}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div><h3 className="font-bold text-secondary-500 line-clamp-1">{product.name}</h3><p className="text-sm text-gray-500">{product.brand}</p></div>
          <div className="flex gap-1">
            <button onClick={onWishlist} className="p-1 rounded-full hover:bg-gray-100">{isWishlisted ? <Heart className="w-5 h-5 fill-red-500 text-red-500" /> : <Heart className="w-5 h-5 text-gray-400" />}</button>
            <button onClick={onCompare} className="p-1 rounded-full hover:bg-gray-100"><GitCompare className={`w-5 h-5 ${isCompared ? 'text-secondary-500' : 'text-gray-400'}`} /></button>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-medium">{product.rating}</span><span className="text-xs text-gray-500">({product.reviewCount})</span></div>
        <div className="mt-2"><span className="text-xl font-bold text-secondary-500">₹{product.price.toLocaleString()}</span><span className="text-sm text-gray-500 ml-1">+ ₹{product.deliveryCharge} delivery</span></div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1"><MapPin className="w-3 h-3" />{product.location} | <Truck className="w-3 h-3" />{product.deliveryTimeMinDays} days</div>
        <p className="text-xs text-gray-600 mt-2">by {product.seller}</p>
        <button onClick={onViewDetails} className="mt-3 w-full bg-secondary-500 text-white py-2 rounded-lg text-sm hover:bg-secondary-600 transition flex items-center justify-center gap-1"><Eye className="w-4 h-4" /> View Details</button>
      </div>
    </motion.div>
  );
};

// ==================== MAIN COMPONENT ====================
const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const { history, addSearchTerm, clearHistory } = useSearchHistory();
  const { wishlist, toggleWishlist } = useWishlist();
  const { compareIds, addToCompare, removeFromCompare } = useCompare();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxDeliveryDays, setMaxDeliveryDays] = useState<number | null>(null);
  const [availability, setAvailability] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'fastDelivery' | 'popular' | 'recommended'>('recommended');

  // UI states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [hasMore, setHasMore] = useState(true);

  // Load products (with auto‑sync)
  useEffect(() => {
    const load = () => {
      const allProducts = loadProducts();
      setProducts(allProducts);
      setLoading(false);
    };
    load();
    // Listen for storage changes (when seller adds product)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS) load();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Apply filters & sorting
  useEffect(() => {
    let filtered = [...products];

    // Category
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term));
    }

    // Price
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Brand
    if (selectedBrands.length) filtered = filtered.filter(p => selectedBrands.includes(p.brand));

    // Location
    if (selectedLocation) filtered = filtered.filter(p => p.location === selectedLocation);

    // Delivery time
    if (maxDeliveryDays) filtered = filtered.filter(p => (p.deliveryTimeMinDays || 999) <= maxDeliveryDays);

    // Availability
    if (availability === 'inStock') filtered = filtered.filter(p => p.stock > 0);
    if (availability === 'outOfStock') filtered = filtered.filter(p => p.stock === 0);

    // Sorting
    switch (sortBy) {
      case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'fastDelivery': filtered.sort((a, b) => (a.deliveryTimeMinDays || 999) - (b.deliveryTimeMinDays || 999)); break;
      case 'popular': filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'recommended': filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0)); break;
      default: break;
    }

    setFilteredProducts(filtered);
    setVisibleCount(12);
    setHasMore(filtered.length > 12);
  }, [products, selectedCategory, searchTerm, priceRange, selectedBrands, selectedLocation, maxDeliveryDays, availability, sortBy]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
    if (visibleCount + 12 >= filteredProducts.length) setHasMore(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) addSearchTerm(searchTerm);
    setShowSearchSuggestions(false);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 10000 });
    setSelectedBrands([]);
    setSelectedLocation('');
    setMaxDeliveryDays(null);
    setAvailability('all');
    setSortBy('recommended');
    setSearchTerm('');
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];
  const locations = [...new Set(products.map(p => p.location))];

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-500">Construction Materials</h1>
          <p className="text-gray-600">Find the best quality products at competitive prices</p>
        </div>

        {/* Search Bar with suggestions */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary-500"
            />
          </div>
          <AnimatePresence>
            {showSearchSuggestions && history.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg border">
                <div className="p-2">
                  <div className="flex justify-between items-center px-3 py-2">
                    <span className="text-xs font-medium text-gray-500">Recent searches</span>
                    <button onClick={clearHistory} className="text-xs text-red-500">Clear</button>
                  </div>
                  {history.map(term => (
                    <button key={term} onClick={() => { setSearchTerm(term); addSearchTerm(term); setShowSearchSuggestions(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg">
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDEBAR – Sticky Filters (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 h-fit bg-white rounded-xl shadow-md p-5 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</h3>
              <button onClick={clearFilters} className="text-xs text-secondary-500">Clear all</button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full p-2 border rounded-lg">
                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={priceRange.min} onChange={e => setPriceRange({ ...priceRange, min: +e.target.value })} className="w-1/2 p-2 border rounded-lg" />
                <input type="number" placeholder="Max" value={priceRange.max} onChange={e => setPriceRange({ ...priceRange, max: +e.target.value })} className="w-1/2 p-2 border rounded-lg" />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={e => setSelectedBrands(e.target.checked ? [...selectedBrands, brand] : selectedBrands.filter(b => b !== brand))} />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="">All</option>
                {locations.map(loc => <option key={loc}>{loc}</option>)}
              </select>
            </div>

            {/* Delivery Time */}
            <div>
              <label className="block text-sm font-medium mb-2">Max Delivery Days</label>
              <select value={maxDeliveryDays || ''} onChange={e => setMaxDeliveryDays(e.target.value ? +e.target.value : null)} className="w-full p-2 border rounded-lg">
                <option value="">Any</option>
                <option value="2">Within 2 days</option>
                <option value="5">Within 5 days</option>
                <option value="7">Within 7 days</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <div className="flex gap-3">
                {(['all', 'inStock', 'outOfStock'] as const).map(opt => (
                  <button key={opt} onClick={() => setAvailability(opt)} className={`px-3 py-1 text-sm rounded-full ${availability === opt ? 'bg-secondary-500 text-white' : 'bg-gray-100'}`}>
                    {opt === 'all' ? 'All' : opt === 'inStock' ? 'In Stock' : 'Out of Stock'}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            {/* Top bar: Sorting + Mobile filter button */}
            <div className="flex justify-between items-center mb-5">
              <div className="text-sm text-gray-500">{filteredProducts.length} products found</div>
              <div className="flex gap-2">
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="p-2 border rounded-lg text-sm">
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="fastDelivery">Fast Delivery</option>
                  <option value="popular">Popular</option>
                </select>
                <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border rounded-lg">
                  <Filter className="w-4 h-4" /> Filters
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12"><Package className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3>No products found</h3><button onClick={clearFilters} className="mt-4 text-secondary-500">Clear filters</button></div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.slice(0, visibleCount).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onWishlist={() => toggleWishlist(product.id)}
                      onCompare={() => compareIds.includes(product.id) ? removeFromCompare(product.id) : addToCompare(product.id)}
                      isCompared={compareIds.includes(product.id)}
                      onViewDetails={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button onClick={loadMore} className="px-6 py-2 bg-white border rounded-lg hover:bg-gray-50">Load More</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto p-5">
              <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Filters</h3><button onClick={() => setShowMobileFilters(false)}><X /></button></div>
              <div className="space-y-5">
                <div><label>Category</label><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full p-2 border rounded">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label>Price Range</label><div className="flex gap-2"><input type="number" placeholder="Min" value={priceRange.min} onChange={e => setPriceRange({ ...priceRange, min: +e.target.value })} className="w-1/2 p-2 border rounded" /><input type="number" placeholder="Max" value={priceRange.max} onChange={e => setPriceRange({ ...priceRange, max: +e.target.value })} className="w-1/2 p-2 border rounded" /></div></div>
                <div><label>Brand</label>{brands.map(b => (<label key={b} className="flex items-center gap-2"><input type="checkbox" checked={selectedBrands.includes(b)} onChange={e => setSelectedBrands(e.target.checked ? [...selectedBrands, b] : selectedBrands.filter(brand => brand !== b))} />{b}</label>))}</div>
                <div><label>Location</label><select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full p-2 border rounded"><option value="">All</option>{locations.map(l => <option key={l}>{l}</option>)}</select></div>
                <div><label>Max Delivery Days</label><select value={maxDeliveryDays || ''} onChange={e => setMaxDeliveryDays(e.target.value ? +e.target.value : null)} className="w-full p-2 border rounded"><option value="">Any</option><option value="2">Within 2 days</option><option value="5">Within 5 days</option><option value="7">Within 7 days</option></select></div>
                <div><label>Availability</label><div className="flex gap-2">{(['all','inStock','outOfStock'] as const).map(opt => <button key={opt} onClick={() => setAvailability(opt)} className={`px-3 py-1 rounded-full ${availability === opt ? 'bg-secondary-500 text-white' : 'bg-gray-100'}`}>{opt}</button>)}</div></div>
                <button onClick={() => { clearFilters(); setShowMobileFilters(false); }} className="w-full bg-secondary-500 text-white py-2 rounded-lg">Apply Filters</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;