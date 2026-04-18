import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter,
  Star, 
  MapPin, 
  CheckCircle,
  SlidersHorizontal,
  Truck,
  Wrench,
  Package,
  Users,
  X,
  ChevronDown,
  Heart,
  Loader,
  Zap} from 'lucide-react';

// ==================== TYPES ====================

interface RentalItem {
  id: number;
  name: string;
  type: 'vehicle' | 'tool' | 'equipment';
  category: string;
  subcategory?: string;
  images: string[];
  description: string;
  price: {
    daily: number;
    weekly?: number;
    monthly?: number;
    currency: string;
    dynamic: boolean;
    lastUpdated?: string;
  };
  stock: number;
  available: boolean;
  outOfStock: boolean;
  rating: number;
  reviews: number;
  location: string;
  distance?: number;
  provider: {
    id: number;
    name: string;
    verified: boolean;
    rating: number;
    totalRentals: number;
    joinedDate: string;
    responseTime?: string;
  };
  specifications: {
    brand?: string;
    model?: string;
    year?: number;
    capacity?: string;
    power?: string;
    fuelType?: string;
    transmission?: string;
    dimensions?: string;
    weight?: string;
    condition: 'new' | 'like-new' | 'good' | 'fair';
    warranty?: string;
    features?: string[];
  };
  premium: boolean;
  performance: number; // 1-10 score
  wishlisted?: boolean;
  createdAt: string;
}


interface FilterState {
  rentalType: string[];
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  availability: 'all' | 'in-stock' | 'out-of-stock';
  rating: number;
  location: string;
  verified: boolean;
  premium: boolean;
}

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc' | 'performance_desc' | 'newest';

// ==================== CONSTANTS ====================

const RENTAL_TYPES = [
  { id: 'vehicle', label: 'Vehicles', icon: Truck },
  { id: 'tool', label: 'Tools', icon: Wrench },
  { id: 'equipment', label: 'Equipment', icon: Package },
];

const VEHICLE_CATEGORIES = [
  'JCB', 'Truck', 'Tipper', 'Tractor', 'Excavator', 'Loader', 'Crane', 'Forklift',
  'Compactor', 'Roller', 'Dumper', 'Trailer', 'Pickup', 'Van', 'Bus', 'Car'
];

const TOOL_CATEGORIES = [
  'Drill', 'Saw', 'Grinder', 'Welder', 'Compressor', 'Generator', 'Pump', 'Mixer',
  'Vibrator', 'Jackhammer', 'Measuring', 'Safety', 'Hand Tools', 'Power Tools'
];

const EQUIPMENT_CATEGORIES = [
  'Scaffolding', 'Shuttering', 'Prop', 'Beam', 'Column', 'Slab', 'Formwork',
  'Pans', 'Sheets', 'Plates', 'Pipes', 'Fittings', 'Cables', 'Hoses'
];

const LOCATIONS = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 
  'Ahmedabad', 'Hyderabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Goa'
];

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: 'Above ₹25,000', min: 25000, max: 1000000 }
];

// ==================== MOCK DATA ====================

const generateMockRentals = (count: number): RentalItem[] => {
  const types: ('vehicle' | 'tool' | 'equipment')[] = ['vehicle', 'tool', 'equipment'];
  const vehicleNames = [
    'JCB 3DX Backhoe Loader', 'Tata 407 Truck', 'Ashok Leyland Tipper', 'Mahindra Tractor',
    'Hyundai Excavator', 'CAT Wheel Loader', 'L&T Crane 20Ton', 'Godrej Forklift 3Ton',
    'Bomag Compactor', 'Dynapac Roller', 'Ashok Leyland Dumper', 'Eicher Trailer'
  ];
  const toolNames = [
    'Bosch Rotary Hammer', 'Makita Angle Grinder', 'Hitachi Welding Machine',
    'Atlas Copco Compressor', 'Kirloskar Generator', 'Koshin Water Pump',
    'Wacker Neuson Concrete Mixer', 'Chicago Pneumatic Jackhammer', 'Stanley Measuring Tape',
    '3M Safety Helmet', 'DEWALT Power Drill', 'Hilti Breaker'
  ];
  const equipmentNames = [
    'Cuplock Scaffolding System', 'Acrow Shuttering Props', 'Steel Beams IPE 300',
    'Concrete Columns Set', 'Slab Formwork Panels', 'Plastic Pans 800x800',
    'Plywood Sheets 8x4', 'MS Plates 12mm', 'GI Pipes 2 inch', 'Hydraulic Hoses'
  ];
  const providerNames = [
    'XXXX Rentals', 'YYYY Equipment', 'ZZZZ Tools', 'AAAA Machinery',
    'BBBB Construction', 'CCCC Vehicles', 'DDDD Scaffolding', 'EEEE Power Solutions'
  ];
  const locations = LOCATIONS;
  const images = [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500'
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const isVehicle = type === 'vehicle';
    const isTool = type === 'tool';
    
    let name = '';
    let category = '';
    let subcategory = '';
    
    if (isVehicle) {
      name = vehicleNames[Math.floor(Math.random() * vehicleNames.length)];
      category = 'Vehicle';
      subcategory = VEHICLE_CATEGORIES[Math.floor(Math.random() * VEHICLE_CATEGORIES.length)];
    } else if (isTool) {
      name = toolNames[Math.floor(Math.random() * toolNames.length)];
      category = 'Tool';
      subcategory = TOOL_CATEGORIES[Math.floor(Math.random() * TOOL_CATEGORIES.length)];
    } else {
      name = equipmentNames[Math.floor(Math.random() * equipmentNames.length)];
      category = 'Equipment';
      subcategory = EQUIPMENT_CATEGORIES[Math.floor(Math.random() * EQUIPMENT_CATEGORIES.length)];
    }

    const stock = Math.floor(Math.random() * 10);
    const isPremium = i < 5; // First 5 are premium
    const performance = 5 + Math.floor(Math.random() * 5); // 5-10
    const dailyPrice = Math.floor(Math.random() * 20000) + 1000;
    const rating = 4 + Math.random();
    const providerRating = 4 + Math.random();

    return {
      id: i + 1,
      name,
      type,
      category,
      subcategory,
      images: [images[Math.floor(Math.random() * images.length)]],
      description: `High-quality ${subcategory} for construction and industrial use. Well-maintained and regularly serviced.`,
      price: {
        daily: dailyPrice,
        weekly: dailyPrice * 5,
        monthly: dailyPrice * 20,
        currency: '₹',
        dynamic: Math.random() > 0.7,
        lastUpdated: new Date().toISOString()
      },
      stock,
      available: stock > 0,
      outOfStock: stock === 0,
      rating: parseFloat(rating.toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 20,
      location: locations[Math.floor(Math.random() * locations.length)],
      distance: Math.floor(Math.random() * 50) + 1,
      provider: {
        id: Math.floor(Math.random() * 100) + 1,
        name: providerNames[Math.floor(Math.random() * providerNames.length)],
        verified: Math.random() > 0.2,
        rating: parseFloat(providerRating.toFixed(1)),
        totalRentals: Math.floor(Math.random() * 500) + 50,
        joinedDate: `202${Math.floor(Math.random() * 4)}-0${Math.floor(Math.random() * 9) + 1}`,
        responseTime: `${Math.floor(Math.random() * 6) + 1} hours`
      },
      specifications: {
        brand: ['Bosch', 'Makita', 'CAT', 'JCB', 'Tata', 'Ashok Leyland'][Math.floor(Math.random() * 6)],
        model: `Model-${Math.floor(Math.random() * 1000)}`,
        year: 2020 + Math.floor(Math.random() * 4),
        capacity: `${Math.floor(Math.random() * 20) + 1} ton`,
        power: `${Math.floor(Math.random() * 100) + 10} HP`,
        fuelType: ['Diesel', 'Petrol', 'Electric', 'Hybrid'][Math.floor(Math.random() * 4)],
        transmission: ['Manual', 'Automatic'][Math.floor(Math.random() * 2)],
        dimensions: `${Math.floor(Math.random() * 10) + 2}x${Math.floor(Math.random() * 5) + 2}x${Math.floor(Math.random() * 3) + 1} m`,
        weight: `${Math.floor(Math.random() * 5000) + 500} kg`,
        condition: ['new', 'like-new', 'good', 'fair'][Math.floor(Math.random() * 4)] as any,
        warranty: Math.random() > 0.5 ? '6 months' : '1 year',
        features: ['GPS Tracking', 'Insurance Included', 'Maintenance Included', 'Operator Available'].slice(0, Math.floor(Math.random() * 4) + 1)
      },
      premium: isPremium,
      performance,
      wishlisted: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

// ==================== CUSTOM HOOKS ====================

const useWishlist = () => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('rentalWishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const newList = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      localStorage.setItem('rentalWishlist', JSON.stringify(newList));
      return newList;
    });
  };

  const isWishlisted = (id: number) => wishlist.includes(id);

  return { wishlist, toggleWishlist, isWishlisted };
};

const useGeolocation = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    city: string;
    loading: boolean;
    error: string | null;
  }>({
    lat: 0,
    lng: 0,
    city: '',
    loading: false,
    error: null
  });

  const detectLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || 'Unknown';
          
          setLocation({
            lat: latitude,
            lng: longitude,
            city,
            loading: false,
            error: null
          });
        } catch (error) {
          setLocation({
            lat: latitude,
            lng: longitude,
            city: 'Unknown',
            loading: false,
            error: null
          });
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    );
  };

  return { location, detectLocation };
};

// ==================== COMPONENTS ====================

// Location Selector Component
interface LocationSelectorProps {
  location: string;
  setLocation: (loc: string) => void;
  onAutoDetect: () => void;
  isDetecting: boolean;
}

const LocationSelector = ({ location, setLocation, onAutoDetect, isDetecting }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
          >
            <span className={location ? 'text-gray-900' : 'text-gray-500'}>
              {location || 'Select location'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <button
          onClick={onAutoDetect}
          disabled={isDetecting}
          className="px-3 py-2.5 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors disabled:opacity-50"
          title="Auto-detect location"
        >
          {isDetecting ? (
            <Loader className="w-4 h-4 animate-spin text-secondary-500" />
          ) : (
            <MapPin className="w-4 h-4 text-secondary-500" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl"
          >
            <div className="p-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        location === loc
                          ? 'bg-secondary-500 text-white'
                          : 'hover:bg-primary-50 text-gray-700'
                      }`}
                    >
                      {loc}
                    </button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">No locations found</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
    <div className="h-40 sm:h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  </div>
);

// Empty State Component
interface EmptyStateProps {
  onClear: () => void;
}

const EmptyState = ({ onClear }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Package className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No rentals found</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
      We couldn't find any rentals matching your criteria. Try adjusting your filters.
    </p>
    <button
      onClick={onClear}
      className="px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
    >
      Clear all filters
    </button>
  </motion.div>
);

// Mobile Filter Drawer
interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileFilterDrawer = ({ isOpen, onClose, children }: MobileFilterDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Rental Card Component
interface RentalCardProps {
  item: RentalItem;
  onViewDetails: (id: number) => void;
  onBookNow: (id: number) => void;
  onWishlist: (id: number) => void;
  isWishlisted: boolean;
  index: number;
}

const RentalCard = ({ item, onViewDetails, onBookNow, onWishlist, isWishlisted, index }: RentalCardProps) => {
  const [imageError, setImageError] = useState(false);
 

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'text-green-600 bg-green-100';
      case 'like-new': return 'text-emerald-600 bg-emerald-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
        item.premium ? 'ring-2 ring-yellow-400' : ''
      }`}
      onClick={() => onViewDetails(item.id)}
    >
      {/* Premium Badge */}
      {item.premium && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium shadow-lg">
            <Zap className="w-3 h-3" />
            <span>Premium</span>
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {!imageError ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            {item.type === 'vehicle' && <Truck className="w-12 h-12 text-gray-400" />}
            {item.type === 'tool' && <Wrench className="w-12 h-12 text-gray-400" />}
            {item.type === 'equipment' && <Package className="w-12 h-12 text-gray-400" />}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {item.outOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Verified Badge */}
        {item.provider.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium shadow-lg">
            <CheckCircle className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}

        {/* Availability Badge */}
        {!item.outOfStock && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium shadow-lg ${
              item.stock > 3 
                ? 'bg-green-500 text-white' 
                : item.stock > 0 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-red-500 text-white'
            }`}>
              {item.stock > 3 ? 'In Stock' : item.stock > 0 ? 'Limited Stock' : 'Out of Stock'}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-secondary-500 text-sm sm:text-base line-clamp-1 flex-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm font-semibold text-secondary-500">{item.rating}</span>
          </div>
        </div>

        {/* Category and Subcategory */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-xs px-2 py-1 bg-primary-50 text-secondary-500 rounded-full">
            {item.category}
          </span>
          {item.subcategory && (
            <span className="text-[10px] sm:text-xs text-gray-500">
              {item.subcategory}
            </span>
          )}
        </div>

        {/* Provider Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Users className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{item.provider.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{item.provider.rating}</span>
          </div>
          <span className="text-xs text-gray-400">· {item.reviews} reviews</span>
        </div>

        {/* Location and Distance */}
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{item.location}</span>
          {item.distance && (
            <span className="text-gray-400">· {item.distance} km</span>
          )}
        </div>

        {/* Specifications Preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.specifications.capacity && (
            <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {item.specifications.capacity}
            </span>
          )}
          {item.specifications.power && (
            <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {item.specifications.power}
            </span>
          )}
          {item.specifications.year && (
            <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {item.specifications.year}
            </span>
          )}
          <span className={`text-[10px] px-2 py-1 rounded-full ${getConditionColor(item.specifications.condition)}`}>
            {item.specifications.condition}
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div>
            <span className="text-xs text-gray-500">from</span>
            <span className="font-bold text-secondary-500 text-sm sm:text-base ml-1">
              {item.price.currency}{item.price.daily.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">/day</span>
            {item.price.dynamic && (
              <span className="text-[10px] text-blue-500 ml-2">*Dynamic</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWishlist(item.id);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isWishlisted ? (
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              ) : (
                <Heart className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(item.id);
              }}
              disabled={item.outOfStock}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                item.outOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-secondary-500 text-white hover:bg-secondary-600'
              }`}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const RentalListing = () => {
  const navigate = useNavigate();
  const { location: geoLocation, detectLocation } = useGeolocation();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // State
  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  
  const [filters, setFilters] = useState<FilterState>({
    rentalType: [],
    categories: [],
    priceRange: { min: 0, max: 0 },
    availability: 'all',
    rating: 0,
    location: '',
    verified: false,
    premium: false
  });

  // Load data
  useEffect(() => {
    const loadRentals = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = generateMockRentals(50);
      setRentals(data);
      setFilteredRentals(data);
      setLoading(false);
    };
    loadRentals();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...rentals];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation);
    } else if (geoLocation.city) {
      filtered = filtered.filter(item => item.location === geoLocation.city);
    }

    // Rental type filter
    if (filters.rentalType.length > 0) {
      filtered = filtered.filter(item => filters.rentalType.includes(item.type));
    }

    // Categories filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => 
        filters.categories.includes(item.category) || 
        (item.subcategory && filters.categories.includes(item.subcategory))
      );
    }

    // Price range filter
    if (filters.priceRange.min > 0) {
      filtered = filtered.filter(item => item.price.daily >= filters.priceRange.min);
    }
    if (filters.priceRange.max > 0) {
      filtered = filtered.filter(item => item.price.daily <= filters.priceRange.max);
    }

    // Availability filter
    if (filters.availability === 'in-stock') {
      filtered = filtered.filter(item => !item.outOfStock);
    } else if (filters.availability === 'out-of-stock') {
      filtered = filtered.filter(item => item.outOfStock);
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(item => item.rating >= filters.rating);
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(item => item.provider.verified);
    }

    // Premium filter
    if (filters.premium) {
      filtered = filtered.filter(item => item.premium);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price.daily - b.price.daily);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price.daily - a.price.daily);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'performance_desc':
        filtered.sort((a, b) => b.performance - a.performance);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Relevance - premium first, then by rating
        filtered.sort((a, b) => {
          if (a.premium && !b.premium) return -1;
          if (!a.premium && b.premium) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredRentals(filtered);
  }, [rentals, searchTerm, selectedLocation, filters, sortBy, geoLocation]);

  // Handlers
  const handleViewDetails = (id: number) => {
    navigate(`/rental/${id}`);
  };

  const handleBookNow = (id: number) => {
    navigate(`/rental/${id}/book`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setFilters({
      rentalType: [],
      categories: [],
      priceRange: { min: 0, max: 0 },
      availability: 'all',
      rating: 0,
      location: '',
      verified: false,
      premium: false
    });
    setSortBy('relevance');
  };

  // Calculate statistics
  const stats = {
    total: filteredRentals.length,
    avgPrice: filteredRentals.length > 0
      ? Math.round(filteredRentals.reduce((sum, item) => sum + item.price.daily, 0) / filteredRentals.length)
      : 0,
    avgRating: filteredRentals.length > 0
      ? parseFloat((filteredRentals.reduce((sum, item) => sum + item.rating, 0) / filteredRentals.length).toFixed(1))
      : 0
  };

  // Premium rentals (show at top)
  const premiumRentals = filteredRentals.filter(item => item.premium);
  const regularRentals = filteredRentals.filter(item => !item.premium);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-500">
                Find Rental Vehicles and Equipment Near You
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Vehicles • Tools • Construction Equipment
              </p>
            </div>

            {/* Location Selector */}
            <LocationSelector
              location={selectedLocation || geoLocation.city}
              setLocation={setSelectedLocation}
              onAutoDetect={detectLocation}
              isDetecting={geoLocation.loading}
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="hidden lg:flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-secondary-500" />
            <span className="text-sm">Filters</span>
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-secondary-500" />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {/* Desktop Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="hidden lg:block bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <div className="grid grid-cols-4 gap-6">
                {/* Rental Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Type
                  </label>
                  <div className="space-y-2">
                    {RENTAL_TYPES.map((type) => (
                      <label key={type.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.rentalType.includes(type.id as any)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                rentalType: [...filters.rentalType, type.id]
                              });
                            } else {
                              setFilters({
                                ...filters,
                                rentalType: filters.rentalType.filter(t => t !== type.id)
                              });
                            }
                          }}
                          className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
                        />
                        <type.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    multiple
                    value={filters.categories}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setFilters({ ...filters, categories: values });
                    }}
                    className="w-full h-32 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    <optgroup label="Vehicles">
                      {VEHICLE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Tools">
                      {TOOL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Equipment">
                      {EQUIPMENT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (per day)
                  </label>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.label} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                          onChange={() => setFilters({
                            ...filters,
                            priceRange: { min: range.min, max: range.max }
                          })}
                          className="w-4 h-4 text-secondary-500 focus:ring-secondary-500"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange.min === 0 && filters.priceRange.max === 0}
                        onChange={() => setFilters({
                          ...filters,
                          priceRange: { min: 0, max: 0 }
                        })}
                        className="w-4 h-4 text-secondary-500 focus:ring-secondary-500"
                      />
                      <span className="text-sm text-gray-700">Any Price</span>
                    </label>
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 mb-4"
                  >
                    <option value="all">All Items</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 mb-4"
                  >
                    <option value="0">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                        className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
                      />
                      <span className="text-sm text-gray-700">Verified Providers Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.premium}
                        onChange={(e) => setFilters({ ...filters, premium: e.target.checked })}
                        className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
                      />
                      <span className="text-sm text-gray-700">Premium Items Only</span>
                    </label>
                  </div>

                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-sm text-secondary-500 hover:text-primary-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-secondary-500">{stats.total}</span> rentals found
            {stats.total > 0 && (
              <span className="text-gray-500 ml-2">
                · Avg. ₹{stats.avgPrice.toLocaleString()}/day · ⭐ {stats.avgRating}
              </span>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Rating: High to Low</option>
            <option value="performance_desc">Performance: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Rental Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : filteredRentals.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <>
            {/* Premium Rentals */}
            {premiumRentals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Premium Rentals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {premiumRentals.map((item, index) => (
                    <RentalCard
                      key={item.id}
                      item={item}
                      onViewDetails={handleViewDetails}
                      onBookNow={handleBookNow}
                      onWishlist={toggleWishlist}
                      isWishlisted={isWishlisted(item.id)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Rentals */}
            {regularRentals.length > 0 && (
              <div>
                {premiumRentals.length > 0 && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">All Rentals</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {regularRentals.map((item, index) => (
                    <RentalCard
                      key={item.id}
                      item={item}
                      onViewDetails={handleViewDetails}
                      onBookNow={handleBookNow}
                      onWishlist={toggleWishlist}
                      isWishlisted={isWishlisted(item.id)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer isOpen={showMobileFilters} onClose={() => setShowMobileFilters(false)}>
        <div className="space-y-6">
          {/* Rental Type */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Rental Type</h3>
            <div className="space-y-2">
              {RENTAL_TYPES.map((type) => (
                <label key={type.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.rentalType.includes(type.id as any)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          rentalType: [...filters.rentalType, type.id]
                        });
                      } else {
                        setFilters({
                          ...filters,
                          rentalType: filters.rentalType.filter(t => t !== type.id)
                        });
                      }
                    }}
                    className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
                  />
                  <type.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Category</h3>
            <select
              multiple
              value={filters.categories}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFilters({ ...filters, categories: values });
              }}
              className="w-full h-40 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <optgroup label="Vehicles">
                {VEHICLE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Tools">
                {TOOL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Equipment">
                {EQUIPMENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Price Range (per day)</h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <label key={range.label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mobilePriceRange"
                    checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                    onChange={() => setFilters({
                      ...filters,
                      priceRange: { min: range.min, max: range.max }
                    })}
                    className="w-4 h-4 text-secondary-500 focus:ring-secondary-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mobilePriceRange"
                  checked={filters.priceRange.min === 0 && filters.priceRange.max === 0}
                  onChange={() => setFilters({
                    ...filters,
                    priceRange: { min: 0, max: 0 }
                  })}
                  className="w-4 h-4 text-secondary-500 focus:ring-secondary-500"
                />
                <span className="text-sm text-gray-700">Any Price</span>
              </label>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
            >
              <option value="0">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          {/* Additional Filters */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
              />
              <span className="text-sm text-gray-700">Verified Providers Only</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.premium}
                onChange={(e) => setFilters({ ...filters, premium: e.target.checked })}
                className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
              />
              <span className="text-sm text-gray-700">Premium Items Only</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-1 px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm font-medium hover:bg-secondary-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </MobileFilterDrawer>
    </div>
  );
};

export default RentalListing;