import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Hammer, 
  Truck,
  ChevronRight,
  CheckCircle,
  Shield,
  Star,
  Clock,
  Users,
  X,
} from 'lucide-react';
import SellerSection from './Seller/SellerSection';
import ContractorSection from './Contractor/ContractorSection';
import RentalSection from './Rental/RentalSection';

const MemberPage = (): JSX.Element => {
  const navigate = useNavigate();

  // Redirect logged‑in business users to their dashboards
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');

    if (userType === 'customer') {
      navigate('/');
      return;
    }
    if (isLoggedIn && ['seller', 'contractor', 'rental'].includes(userType || '')) {
      navigate(`/${userType}/dashboard`);
      return;
    }
    window.scrollTo(0, 0);
  }, [navigate]);

  const [expandedId, setExpandedId] = useState<'seller' | 'contractor' | 'rental' | null>(null);

  const membershipCards = [
    {
      id: 'seller' as const,
      title: 'Seller',
      icon: Store,
      description: 'Sell construction materials and products directly to buyers across the country.',
      color: 'from-orange-500 to-red-500',
      stats: '500+ Active Sellers',
      features: ['Product Listing', 'Order Management', 'Payment Protection'],
    },
    {
      id: 'contractor' as const,
      title: 'Contractor',
      icon: Hammer,
      description: 'Offer construction, renovation, and professional maintenance services.',
      color: 'from-blue-500 to-cyan-500',
      stats: '1000+ Verified Contractors',
      features: ['Project Management', 'Client Connect', 'Rating System'],
    },
    {
      id: 'rental' as const,
      title: 'Rental Support',
      icon: Truck,
      description: 'Provide heavy equipment, tools, and vehicle rentals for site operations.',
      color: 'from-green-500 to-emerald-500',
      stats: '300+ Rental Partners',
      features: ['Asset Management', 'Booking System', 'Insurance Cover'],
    },
  ];

  const handleTogglePanel = (id: 'seller' | 'contractor' | 'rental') => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setTimeout(() => {
        const element = document.getElementById('expanded-wide-panel');
        if (element) {
          const yOffset = -40;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 200);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 md:mb-14"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-500 mb-2 sm:mb-4">
            Join Our Marketplace
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Choose your membership type and start your journey with India's leading
            construction platform.
          </p>
        </motion.div>

        {/* 3 Cards Grid - Fully Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {membershipCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col border-2 overflow-hidden ${
                expandedId === card.id ? 'border-secondary-500 scale-[1.02] shadow-2xl' : 'border-transparent'
              }`}
            >
              <div className={`h-1.5 sm:h-2 w-full bg-gradient-to-r ${card.color}`}></div>

              <div className="p-5 sm:p-6 md:p-8 flex-grow flex flex-col">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${card.color} p-3 sm:p-4 mb-4 sm:mb-5 md:mb-6 shadow-md`}>
                  <card.icon className="w-full h-full text-white" />
                </div>

                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-500 mb-2 sm:mb-3">
                  {card.title}
                </h2>
                
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6 flex-grow">
                  {card.description}
                </p>

                <div className="flex items-center space-x-2 text-xs sm:text-sm text-primary-600 mb-4 sm:mb-5 md:mb-6 font-medium bg-primary-50 p-2 sm:p-3 rounded-lg w-max">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500" />
                  <span className="text-secondary-600">{card.stats}</span>
                </div>

                <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-5 sm:mb-6 md:mb-8">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-700">
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    onClick={() => handleTogglePanel(card.id)}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm ${
                      expandedId === card.id
                        ? 'bg-secondary-700 text-white ring-2 ring-secondary-300 ring-offset-2'
                        : 'bg-secondary-500 text-white hover:bg-secondary-600 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <span>Get Started</span>
                  </button>
                </div>

                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-[0.03] pointer-events-none hidden sm:block">
                  <card.icon className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Panel – Registration & Login */}
        <AnimatePresence mode="wait">
          {expandedId && (
            <motion.div
              key={`${expandedId}-auth`}
              id="expanded-wide-panel"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-6 sm:mt-8 md:mt-12 w-full overflow-hidden relative"
            >
              <div className="bg-gray-50 border border-gray-200 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-inner">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-secondary-500 px-2 border-l-4 border-secondary-500 pl-3">
                    {expandedId.charAt(0).toUpperCase() + expandedId.slice(1)} Registration & Login
                  </h3>
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-600 hover:text-red-600 font-medium bg-white px-4 sm:px-5 py-2 rounded-full shadow-sm border border-gray-200 hover:border-red-200 transition-all hover:bg-red-50 w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" /> Close Panel
                  </button>
                </div>

                <div className="w-full">
                  {expandedId === 'seller' && <SellerSection />}
                  {expandedId === 'contractor' && <ContractorSection />}
                  {expandedId === 'rental' && <RentalSection />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-10 md:pt-12 border-t border-gray-200"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-secondary-500 mb-6 sm:mb-8 md:mb-12">
            Why Partner With Us?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {[
              { icon: Users, title: 'Large Customer Base', desc: 'Access to thousands of verified customers across India.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Guaranteed, hassle-free and timely payments straight to your bank.' },
              { icon: Star, title: 'Build Reputation', desc: 'Earn ratings, reviews, and a trusted badge to grow your business.' },
              { icon: Clock, title: '24/7 Support', desc: 'Dedicated technical and business support team always ready to help.' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, y: -3 }}
                className="text-center p-5 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-secondary-500" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-secondary-500 mb-2 sm:mb-3">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MemberPage;