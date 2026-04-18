import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Star, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  Shield,
 
  ChevronRight
} from 'lucide-react';

const RentalDetail = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState(3);
  const [includeOperator, setIncludeOperator] = useState(false);

  const equipment = {
    id: 1,
    name: 'JCB 3DX Backhoe Loader',
    category: 'Heavy Equipment',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    rating: 4.8,
    reviews: 124,
    location: 'Mumbai, Maharashtra',
    pricePerDay: 8500,
    securityDeposit: 25000,
    available: true,
    description: 'Powerful backhoe loader perfect for excavation, digging, and material handling. Well-maintained and regularly serviced.',
    specifications: [
      { label: 'Engine Power', value: '75 HP' },
      { label: 'Operating Weight', value: '7.5 tons' },
      { label: 'Bucket Capacity', value: '0.8 cu.m' },
      { label: 'Fuel Tank', value: '120 liters' },
      { label: 'Year', value: '2022' },
      { label: 'Hours Used', value: '850 hrs' },
    ],
    features: [
      'GPS Tracking',
      'AC Cabin',
      'Reverse Camera',
      'Service Record Available',
    ],
    provider: {
      name: 'Mumbai Rentals Pvt Ltd',
      rating: 4.7,
      rentals: 342,
      verified: true,
      phone: '+91 98765 43210',
      email: 'info@mumbairentals.com',
    },
  };

  return (
    <div className="min-h-screen bg-primary-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-secondary-500 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to Listings</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4 sm:space-y-6"
          >
            {/* Image Gallery */}
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-48 sm:h-64 md:h-80">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
                {equipment.available && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Available Now
                  </div>
                )}
              </div>
            </div>

            {/* Equipment Details */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-500">{equipment.name}</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">{equipment.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-secondary-500 text-sm sm:text-base">{equipment.rating}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">({equipment.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">{equipment.location}</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium">Verified Equipment</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
                {equipment.description}
              </p>

              {/* Specifications */}
              <h3 className="text-lg sm:text-xl font-bold text-secondary-500 mb-3">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {equipment.specifications.map((spec, index) => (
                  <div key={index} className="bg-primary-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600">{spec.label}</div>
                    <div className="font-semibold text-secondary-500 text-sm sm:text-base">{spec.value}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <h3 className="text-lg sm:text-xl font-bold text-secondary-500 mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
                {equipment.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Booking Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Booking Details</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Rental Period</span>
                  <span className="text-xs text-gray-500">Min. 1 day</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))}
                    className="w-8 h-8 rounded-lg bg-primary-100 hover:bg-primary-200 text-secondary-500 font-bold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    min="1"
                  />
                  <button
                    onClick={() => setSelectedDays(selectedDays + 1)}
                    className="w-8 h-8 rounded-lg bg-primary-100 hover:bg-primary-200 text-secondary-500 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeOperator}
                    onChange={(e) => setIncludeOperator(e.target.checked)}
                    className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
                  />
                  <span className="text-sm text-gray-700">Include Operator (+₹1,500/day)</span>
                </label>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rental Price ({selectedDays} days)</span>
                  <span className="font-medium text-secondary-500">₹{(equipment.pricePerDay * selectedDays).toLocaleString()}</span>
                </div>
                {includeOperator && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Operator Charges</span>
                    <span className="font-medium text-secondary-500">₹{(1500 * selectedDays).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium text-secondary-500">₹{equipment.securityDeposit.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-800">Total Amount</span>
                    <span className="text-secondary-500 text-lg">
                      ₹{(equipment.pricePerDay * selectedDays + (includeOperator ? 1500 * selectedDays : 0)).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+ security deposit refundable on return</p>
                </div>
              </div>

              <button className="w-full bg-secondary-500 text-white py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors mb-3">
                Book Now
              </button>
              <button className="w-full border border-secondary-500 text-secondary-500 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Contact Provider
              </button>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Rental Provider</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">MR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-500 text-sm sm:text-base">{equipment.provider.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-medium">{equipment.provider.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({equipment.provider.rentals} rentals)</span>
                    {equipment.provider.verified && (
                      <>
                        <span className="text-gray-300">|</span>
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <span className="text-xs text-green-600">Verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{equipment.provider.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{equipment.provider.email}</span>
                </div>
              </div>

              <button className="w-full mt-4 text-sm text-secondary-500 font-medium hover:text-primary-600 transition-colors flex items-center justify-center gap-1">
                View Provider Profile
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Insurance Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-blue-800">Insurance Included</h4>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
                    This rental comes with basic insurance coverage against damage and theft.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetail;