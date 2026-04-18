import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter,
  Star, 
  MapPin, 
  Clock,
  CheckCircle,
  SlidersHorizontal,
  X,
  Building,
  Zap,
  Droplets,
  Paintbrush,
  HardHat,
  Navigation,
  Loader,
  Heart,
  Briefcase,
  MessageSquare,
  ChevronDown,
  RotateCcw,
  Layers,
  Eye,
  Crown} from 'lucide-react';

// ==================== TYPES ====================

interface Xxxx {
  id: number;
  name: string;
  title: string;
  company?: string;
  rating: number;
  reviews: number;
  location: string;
  distance?: number;
  experience: string;
  experienceYears: number;
  projects: number;
  verified: boolean;
  verifiedDate?: string;
  specialties: string[];
  image: string;
  gallery?: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  availability: 'available' | 'busy' | 'booked' | 'away';
  availabilityStatus?: string;
  completedProjects: number;
  ongoingProjects?: number;
  joinedDate?: string;
  responseTime?: string;
  completionRate?: number;
  languages?: string[];
  certifications?: string[];
  awards?: string[];
  featured?: boolean;
  featuredReason?: string;
  shortlisted?: boolean;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    social?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  paymentMethods?: string[];
  insurance?: boolean;
  warranty?: string;
  license?: string;
  taxId?: string;
}

interface Yyyy {
  id: string;
  name: string;
  icon: any;
  count: number;
  subcategories?: Zzzz[];
}

interface Zzzz {
  id: string;
  name: string;
  count: number;
}

interface Aaaa {
  rating: number;
  experience: number;
  location: string;
  verified: boolean;
  distance: number;
  priceRange: {
    min: number;
    max: number;
  };
  specialties: string[];
  availability: string[];
}

type Bbbb = 'relevance' | 'rating_desc' | 'rating_asc' | 'price_desc' | 'price_asc' | 'experience_desc' | 'experience_asc' | 'distance_asc';

// ==================== CONSTANTS ====================

const XXXX_CATEGORIES: Yyyy[] = [
  { 
    id: 'civil', 
    name: 'Civil', 
    icon: Building, 
    count: 156,
    subcategories: [
      { id: 'construction', name: 'Construction', count: 78 },
      { id: 'renovation', name: 'Renovation', count: 45 },
      { id: 'demolition', name: 'Demolition', count: 23 },
      { id: 'foundation', name: 'Foundation', count: 10 }
    ]
  },
  { 
    id: 'electrical', 
    name: 'Electrical', 
    icon: Zap, 
    count: 98,
    subcategories: [
      { id: 'wiring', name: 'Wiring', count: 45 },
      { id: 'lighting', name: 'Lighting', count: 32 },
      { id: 'panel', name: 'Panel Installation', count: 12 },
      { id: 'generator', name: 'Generator', count: 9 }
    ]
  },
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    icon: Droplets, 
    count: 87,
    subcategories: [
      { id: 'repair', name: 'Repair', count: 40 },
      { id: 'installation', name: 'Installation', count: 28 },
      { id: 'drainage', name: 'Drainage', count: 12 },
      { id: 'water-heater', name: 'Water Heater', count: 7 }
    ]
  },
  { 
    id: 'structural', 
    name: 'Structural', 
    icon: HardHat, 
    count: 45,
    subcategories: [
      { id: 'steel', name: 'Steel Structure', count: 18 },
      { id: 'concrete', name: 'Concrete', count: 15 },
      { id: 'inspection', name: 'Inspection', count: 7 },
      { id: 'design', name: 'Design', count: 5 }
    ]
  },
  { 
    id: 'waterproofing', 
    name: 'Waterproofing', 
    icon: Droplets, 
    count: 34,
    subcategories: [
      { id: 'roof', name: 'Roof Waterproofing', count: 15 },
      { id: 'basement', name: 'Basement', count: 10 },
      { id: 'terrace', name: 'Terrace', count: 6 },
      { id: 'bathroom', name: 'Bathroom', count: 3 }
    ]
  },
  { 
    id: 'interior', 
    name: 'Interior', 
    icon: Paintbrush, 
    count: 123,
    subcategories: [
      { id: 'residential', name: 'Residential', count: 58 },
      { id: 'commercial', name: 'Commercial', count: 35 },
      { id: 'modular', name: 'Modular Kitchen', count: 18 },
      { id: 'wardrobe', name: 'Wardrobe', count: 12 }
    ]
  },
  { 
    id: 'mep', 
    name: 'MEP', 
    icon: Zap, 
    count: 56,
    subcategories: [
      { id: 'hvac', name: 'HVAC', count: 24 },
      { id: 'fire', name: 'Fire Fighting', count: 15 },
      { id: 'plumbing', name: 'Plumbing', count: 10 },
      { id: 'electrical', name: 'Electrical', count: 7 }
    ]
  },
];

const XXXX_LOCATIONS = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 
  'Ahmedabad', 'Hyderabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Goa'
];

const XXXX_RATINGS = [5, 4.5, 4, 3.5, 3];
const XXXX_EXPERIENCES = [20, 15, 10, 5, 3, 1];
const XXXX_DISTANCES = [5, 10, 25, 50, 100];
const XXXX_PRICE_RANGES = [
  { label: 'Budget', min: 0, max: 50000 },
  { label: 'Moderate', min: 50000, max: 200000 },
  { label: 'Premium', min: 200000, max: 500000 },
  { label: 'Luxury', min: 500000, max: 1000000 }
];

const XXXX_AVAILABILITY = ['available', 'busy', 'booked'];

// ==================== MOCK DATA ====================

const generateMockXxxx = (count: number): Xxxx[] => {
  const names = [
    'XXXX Construction', 'YYYY Builders', 'ZZZZ Developers', 'AAAA Contractors',
    'BBBB Engineering', 'CCCC Interiors', 'DDDD Plumbing', 'EEEE Electrical',
    'FFFF HVAC', 'GGGG Waterproofing', 'HHHH Renovation', 'IIII Design Studio',
    'JJJJ Architecture', 'KKKK Structural', 'LLLL MEP Solutions', 'MMMM Civil Works',
    'NNNN Painting', 'OOOO Flooring', 'PPPP Roofing', 'QQQQ Landscaping'
  ];
  
  const titles = [
    'General Contractor', 'Civil Engineer', 'Electrical Engineer', 'Plumbing Expert',
    'Structural Engineer', 'Interior Designer', 'MEP Consultant', 'Waterproofing Specialist',
    'Renovation Expert', 'Construction Manager', 'Project Supervisor', 'Site Engineer'
  ];
  
  const locations = XXXX_LOCATIONS;
  const specialties = [
    'Residential', 'Commercial', 'Industrial', 'Institutional',
    'Renovation', 'New Construction', 'Maintenance', 'Consulting'
  ];
  
  const images = [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200'
  ];

  return Array.from({ length: count }, (_, i) => {
    const isFeatured = i < 3; // First 3 are featured
    const rating = 4 + Math.random();
    const experienceYears = Math.floor(Math.random() * 20) + 1;
    const priceMin = Math.floor(Math.random() * 50000) + 10000;
    const priceMax = priceMin + Math.floor(Math.random() * 100000) + 50000;
    
    return {
      id: i + 1,
      name: names[i % names.length],
      title: titles[i % titles.length],
      company: names[i % names.length],
      rating: Math.min(5, parseFloat(rating.toFixed(1))),
      reviews: Math.floor(Math.random() * 300) + 20,
      location: locations[Math.floor(Math.random() * locations.length)],
      distance: Math.floor(Math.random() * 50) + 1,
      experience: `${experienceYears}+ years`,
      experienceYears,
      projects: Math.floor(Math.random() * 200) + 20,
      verified: Math.random() > 0.2,
      verifiedDate: Math.random() > 0.5 ? '2024-01-15' : undefined,
      specialties: [
        specialties[Math.floor(Math.random() * specialties.length)],
        specialties[Math.floor(Math.random() * specialties.length)]
      ],
      image: images[i % images.length],
      gallery: [1, 2, 3].map(() => images[Math.floor(Math.random() * images.length)]),
      priceRange: {
        min: priceMin,
        max: priceMax,
        currency: '₹'
      },
      availability: XXXX_AVAILABILITY[Math.floor(Math.random() * XXXX_AVAILABILITY.length)] as any,
      availabilityStatus: Math.random() > 0.7 ? 'Available next week' : undefined,
      completedProjects: Math.floor(Math.random() * 150) + 10,
      ongoingProjects: Math.floor(Math.random() * 10),
      joinedDate: `202${Math.floor(Math.random() * 4)}-0${Math.floor(Math.random() * 9) + 1}-15`,
      responseTime: `${Math.floor(Math.random() * 12) + 1} hours`,
      completionRate: 85 + Math.floor(Math.random() * 15),
      languages: ['English', 'Hindi', Math.random() > 0.5 ? 'Marathi' : 'Tamil'].filter(Boolean),
      certifications: ['ISO 9001', 'OSHA', 'LEED'].slice(0, Math.floor(Math.random() * 3) + 1),
      awards: ['Best Contractor 2023', 'Safety Excellence'].slice(0, Math.floor(Math.random() * 2)),
      featured: isFeatured,
      featuredReason: isFeatured ? 'Top Rated' : undefined,
      shortlisted: Math.random() > 0.8,
      contact: {
        phone: '+91 98765 43210',
        email: `contact${i + 1}@example.com`,
        website: `https://www.example${i + 1}.com`
      },
      businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      },
      paymentMethods: ['Cash', 'Card', 'UPI', 'Bank Transfer'].slice(0, Math.floor(Math.random() * 4) + 1),
      insurance: Math.random() > 0.3,
      warranty: Math.random() > 0.5 ? '1 year' : '2 years',
      license: `LIC-2024-${1000 + i}`,
      taxId: `GST-${Math.floor(Math.random() * 10000)}`
    };
  });
};

// ==================== CUSTOM HOOKS ====================

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
        
        // Reverse geocoding to get city name
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

const useShortlist = () => {
  const [shortlisted, setShortlisted] = useState<number[]>(() => {
    const saved = localStorage.getItem('shortlisted');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleShortlist = (id: number) => {
    setShortlisted(prev => {
      const newList = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      localStorage.setItem('shortlisted', JSON.stringify(newList));
      return newList;
    });
  };

  const isShortlisted = (id: number) => shortlisted.includes(id);

  return { shortlisted, toggleShortlist, isShortlisted };
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLocations = XXXX_LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
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
            <Navigation className="w-4 h-4 text-secondary-500" />
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

// Category Filter Component
interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  categories: Yyyy[];
}

const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  categories
}: CategoryFilterProps) => {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const Icon = category.icon;
        const isExpanded = expandedCat === category.id;
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;

        return (
          <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => {
                setSelectedCategory(category.id);
                if (hasSubcategories) {
                  setExpandedCat(isExpanded ? null : category.id);
                }
              }}
              className={`w-full flex items-center justify-between p-3 transition-colors ${
                selectedCategory === category.id
                  ? 'bg-secondary-500 text-white'
                  : 'hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </div>
              {hasSubcategories && (
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && category.subcategories && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gray-50"
                >
                  <div className="p-2 space-y-1">
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubcategory(sub.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                          selectedSubcategory === sub.id
                            ? 'bg-secondary-500 text-white'
                            : 'hover:bg-white'
                        }`}
                      >
                        <span>{sub.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          selectedSubcategory === sub.id
                            ? 'bg-white/20'
                            : 'bg-gray-200'
                        }`}>
                          {sub.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

// Advanced Filters Component
interface AdvancedFiltersProps {
  filters: Aaaa;
  setFilters: (filters: Aaaa) => void;
  onClear: () => void;
}

const AdvancedFilters = ({ filters, setFilters, onClear }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFilters({ ...filters, rating: filters.rating === rating ? 0 : rating });
  };

  const handleExperienceChange = (exp: number) => {
    setFilters({ ...filters, experience: filters.experience === exp ? 0 : exp });
  };

  const handleDistanceChange = (distance: number) => {
    setFilters({ ...filters, distance: filters.distance === distance ? 0 : distance });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-secondary-500" />
          <span className="font-medium text-gray-700">Advanced Filters</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-6">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Minimum Rating
                </label>
                <div className="flex flex-wrap gap-2">
                  {XXXX_RATINGS.map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingChange(rating)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.rating === rating
                          ? 'bg-secondary-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rating}+ ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Minimum Experience (Years)
                </label>
                <div className="flex flex-wrap gap-2">
                  {XXXX_EXPERIENCES.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => handleExperienceChange(exp)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.experience === exp
                          ? 'bg-secondary-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {exp}+ Years
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Maximum Distance (km)
                </label>
                <div className="flex flex-wrap gap-2">
                  {XXXX_DISTANCES.map((dist) => (
                    <button
                      key={dist}
                      onClick={() => handleDistanceChange(dist)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.distance === dist
                          ? 'bg-secondary-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Within {dist} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Budget Range (₹)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <input
                      type="number"
                      value={filters.priceRange.min || ''}
                      onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <input
                      type="number"
                      value={filters.priceRange.max || ''}
                      onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 0)}
                      placeholder="Any"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {XXXX_PRICE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setFilters({
                        ...filters,
                        priceRange: { min: range.min, max: range.max }
                      })}
                      className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Availability
                </label>
                <div className="flex flex-wrap gap-2">
                  {XXXX_AVAILABILITY.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        const newStatus = filters.availability.includes(status)
                          ? filters.availability.filter(s => s !== status)
                          : [...filters.availability, status];
                        setFilters({ ...filters, availability: newStatus });
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        filters.availability.includes(status)
                          ? 'bg-secondary-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Only Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                    className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
                  />
                  <span className="text-sm text-gray-700">Verified contractors only</span>
                </label>

                <button
                  onClick={onClear}
                  className="flex items-center gap-1 text-sm text-secondary-500 hover:text-primary-600"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear all
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Contractor Card Component
interface ContractorCardProps {
  contractor: Xxxx;
  onViewDetails: (id: number) => void;
  onRequestQuote: (id: number) => void;
  onShortlist: (id: number) => void;
  isShortlisted: boolean;
  index: number;
}

const ContractorCard = ({
  contractor,
  onViewDetails,
  onRequestQuote,
  onShortlist,
  isShortlisted,
  index
}: ContractorCardProps) => {
  const [, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getAvailabilityColor = () => {
    switch (contractor.availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'booked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityText = () => {
    switch (contractor.availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'Currently Busy';
      case 'booked': return 'Fully Booked';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group relative"
    >
      {/* Featured Badge */}
      {contractor.featured && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium shadow-lg">
            <Crown className="w-3 h-3" />
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden" onClick={() => onViewDetails(contractor.id)}>
        {!imageError ? (
          <img
            src={contractor.image}
            alt={contractor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Verification Badge */}
          {contractor.verified && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium shadow-lg">
              <CheckCircle className="w-3 h-3" />
              <span>Verified</span>
            </div>
          )}

          {/* Availability Badge */}
          <div className={`${getAvailabilityColor()} text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium shadow-lg`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-white animate-pulse`} />
            <span>{getAvailabilityText()}</span>
          </div>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-base sm:text-lg truncate">{contractor.name}</h3>
          <p className="text-white/90 text-xs sm:text-sm truncate">{contractor.title}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Rating and Projects */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-secondary-500">{contractor.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({contractor.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Briefcase className="w-3 h-3" />
            <span>{contractor.completedProjects} projects</span>
          </div>
        </div>

        {/* Location and Experience */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{contractor.location}</span>
            {contractor.distance && (
              <span className="text-gray-400">· {contractor.distance} km</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{contractor.experience} experience</span>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex items-center justify-between mb-3 p-2 bg-primary-50 rounded-lg">
          <span className="text-xs text-gray-600">Project Budget</span>
          <span className="text-sm font-bold text-secondary-500">
            {contractor.priceRange.currency}{contractor.priceRange.min.toLocaleString()} - {contractor.priceRange.currency}{contractor.priceRange.max.toLocaleString()}
          </span>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {contractor.specialties.map((specialty, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-primary-50 text-secondary-500 rounded-lg text-xs"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(contractor.id)}
            className="col-span-1 px-2 py-1.5 bg-primary-50 text-secondary-500 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
          
          <button
            onClick={() => onRequestQuote(contractor.id)}
            className="col-span-1 px-2 py-1.5 bg-secondary-500 text-white rounded-lg text-xs font-medium hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Quote</span>
          </button>
          
          <button
            onClick={() => onShortlist(contractor.id)}
            className={`col-span-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              isShortlisted
                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isShortlisted ? (
              <>
                <Heart className="w-3 h-3 fill-red-500" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Heart className="w-3 h-3" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
    <div className="h-40 sm:h-44 md:h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-28 bg-gray-200 rounded" />
      </div>
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="flex gap-1">
        <div className="h-6 w-16 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="h-8 bg-gray-200 rounded" />
        <div className="h-8 bg-gray-200 rounded" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No contractors found</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
      We couldn't find any contractors matching your criteria. Try adjusting your filters or search term.
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

// Main Component
const ContractorListing = () => {
  const navigate = useNavigate();
  const { location: geoLocation, detectLocation } = useGeolocation();
  const { isShortlisted, toggleShortlist } = useShortlist();
  
  // State
  const [contractors, setContractors] = useState<Xxxx[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<Xxxx[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filters, setFilters] = useState<Aaaa>({
    rating: 0,
    experience: 0,
    location: '',
    verified: false,
    distance: 0,
    priceRange: { min: 0, max: 0 },
    specialties: [],
    availability: []
  });
  
  // Sorting
  const [sortBy, setSortBy] = useState<Bbbb>('relevance');

  // Load initial data
  useEffect(() => {
    const loadContractors = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = generateMockXxxx(50);
      setContractors(data);
      setFilteredContractors(data);
      setLoading(false);
    };
    loadContractors();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...contractors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(c =>
        c.specialties.some(s => s.toLowerCase().includes(selectedCategory))
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(c => c.location === selectedLocation);
    } else if (geoLocation.city) {
      filtered = filtered.filter(c => c.location === geoLocation.city);
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(c => c.rating >= filters.rating);
    }

    // Experience filter
    if (filters.experience > 0) {
      filtered = filtered.filter(c => c.experienceYears >= filters.experience);
    }

    // Distance filter
    if (filters.distance > 0 && geoLocation.lat) {
      // In real app, calculate actual distance
      filtered = filtered.filter(c => (c.distance || 0) <= filters.distance);
    }

    // Price range filter
    if (filters.priceRange.min > 0) {
      filtered = filtered.filter(c => c.priceRange.max >= filters.priceRange.min);
    }
    if (filters.priceRange.max > 0) {
      filtered = filtered.filter(c => c.priceRange.min <= filters.priceRange.max);
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(c => c.verified);
    }

    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(c => filters.availability.includes(c.availability));
    }

    // Sorting
    switch (sortBy) {
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_asc':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.priceRange.min - a.priceRange.min);
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
      case 'experience_desc':
        filtered.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'experience_asc':
        filtered.sort((a, b) => a.experienceYears - b.experienceYears);
        break;
      case 'distance_asc':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      default:
        // Relevance - featured first, then by rating
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredContractors(filtered);
  }, [contractors, searchTerm, selectedCategory, selectedLocation, filters, sortBy, geoLocation]);

  // Handlers
  const handleViewDetails = (id: number) => {
    navigate(`/contractor/${id}`);
  };

  const handleRequestQuote = (id: number) => {
    navigate(`/request-quote/${id}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedLocation('');
    setFilters({
      rating: 0,
      experience: 0,
      location: '',
      verified: false,
      distance: 0,
      priceRange: { min: 0, max: 0 },
      specialties: [],
      availability: []
    });
    setSortBy('relevance');
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    // In real app, fetch more data
    if (page >= 3) {
      setHasMore(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: filteredContractors.length,
    avgPriceMin: filteredContractors.length > 0
      ? Math.round(filteredContractors.reduce((sum, c) => sum + c.priceRange.min, 0) / filteredContractors.length)
      : 0,
    avgPriceMax: filteredContractors.length > 0
      ? Math.round(filteredContractors.reduce((sum, c) => sum + c.priceRange.max, 0) / filteredContractors.length)
      : 0,
    avgRating: filteredContractors.length > 0
      ? parseFloat((filteredContractors.reduce((sum, c) => sum + c.rating, 0) / filteredContractors.length).toFixed(1))
      : 0
  };

  // Featured contractors (pinned at top)
  const featuredContractors = filteredContractors.filter(c => c.featured);
  const regularContractors = filteredContractors.filter(c => !c.featured);

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
                Find Verified Contractors Near You
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {selectedCategory 
                  ? `Browse trusted ${XXXX_CATEGORIES.find(c => c.id === selectedCategory)?.name} contractors`
                  : 'Connect with trusted professionals for your construction needs'
                }
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-secondary-500" />
                  Categories
                </h3>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  setSelectedSubcategory={setSelectedSubcategory}
                  categories={XXXX_CATEGORIES}
                />
              </div>

              {/* Advanced Filters */}
              <AdvancedFilters
                filters={filters}
                setFilters={setFilters}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Mobile Filter Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, location, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>
              
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-secondary-500" />
                <span className="text-sm">Filters</span>
              </button>
            </div>

            {/* Summary and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-secondary-500">{stats.total}</span> contractors found
                {stats.total > 0 && (
                  <span className="text-gray-500 ml-2">
                    · Avg. budget: {contractors[0]?.priceRange.currency}{stats.avgPriceMin.toLocaleString()} - {stats.avgPriceMax.toLocaleString()}
                    · ⭐ {stats.avgRating}
                  </span>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as Bbbb)}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="rating_desc">Rating: High to Low</option>
                <option value="rating_asc">Rating: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="experience_desc">Experience: Most to Least</option>
                <option value="experience_asc">Experience: Least to Most</option>
                <option value="distance_asc">Distance: Nearest First</option>
              </select>
            </div>

            {/* Contractor Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </div>
            ) : filteredContractors.length === 0 ? (
              <EmptyState onClear={handleClearFilters} />
            ) : (
              <>
                {/* Featured Contractors */}
                {featuredContractors.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-lg font-semibold text-gray-900">Featured Contractors</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {featuredContractors.map((contractor, index) => (
                        <ContractorCard
                          key={contractor.id}
                          contractor={contractor}
                          onViewDetails={handleViewDetails}
                          onRequestQuote={handleRequestQuote}
                          onShortlist={toggleShortlist}
                          isShortlisted={isShortlisted(contractor.id)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Contractors */}
                {regularContractors.length > 0 && (
                  <div>
                    {featuredContractors.length > 0 && (
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Contractors</h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {regularContractors.slice(0, page * 12).map((contractor, index) => (
                        <ContractorCard
                          key={contractor.id}
                          contractor={contractor}
                          onViewDetails={handleViewDetails}
                          onRequestQuote={handleRequestQuote}
                          onShortlist={toggleShortlist}
                          isShortlisted={isShortlisted(contractor.id)}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Load More */}
                    {hasMore && regularContractors.length > page * 12 && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleLoadMore}
                          className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Load More Contractors
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer isOpen={showMobileFilters} onClose={() => setShowMobileFilters(false)}>
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              categories={XXXX_CATEGORIES}
            />
          </div>

          {/* Advanced Filters */}
          <AdvancedFilters
            filters={filters}
            setFilters={setFilters}
            onClear={handleClearFilters}
          />

          {/* Apply Button */}
          <button
            onClick={() => setShowMobileFilters(false)}
            className="w-full py-3 bg-secondary-500 text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </MobileFilterDrawer>
    </div>
  );
};

export default ContractorListing;