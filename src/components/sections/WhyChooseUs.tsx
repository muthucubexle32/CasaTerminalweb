import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Shield, Zap, Eye, Users, Award, Clock, ChevronRight, CheckCircle } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Quality Assured",
    description: "All materials tested and certified for construction standards",
    stat: "100%",
    statLabel: "Quality Checked",
    features: ["ISO Certified", "Lab Tested", "Warranty Included"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Same-day delivery and instant service booking",
    stat: "24/7",
    statLabel: "Service Available",
    features: ["Same Day Delivery", "Instant Booking", "Real-time Tracking"],
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Eye,
    title: "Best Prices",
    description: "Direct from manufacturers, no middlemen markup",
    stat: "30%",
    statLabel: "Cost Savings",
    features: ["Factory Direct", "Price Match", "Bulk Discounts"],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Expert Network",
    description: "10,000+ verified contractors and skilled workers",
    stat: "10k+",
    statLabel: "Professionals",
    features: ["Background Verified", "Skill Tested", "Insured"],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Trusted Brand",
    description: "Preferred by top construction companies in India",
    stat: "500+",
    statLabel: "Corporate Clients",
    features: ["5+ Years", "Industry Leaders", "Award Winning"],
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service and site support",
    stat: "24/7",
    statLabel: "Support Available",
    features: ["Live Chat", "Phone Support", "Site Visit"],
    color: "from-indigo-500 to-blue-500",
  },
];

const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  const handleCardClick = (index: number) => {
    if (isMobile) {
      setExpandedIndex(expandedIndex === index ? null : index);
    }
  };

  // For mobile: show fewer items initially with "View More" option
  const visibleReasons = isMobile ? reasons.slice(0, 3) : reasons;
  const [showAll, setShowAll] = useState(false);

  const displayReasons = isMobile && !showAll ? visibleReasons : reasons;

  return (
    <section 
      ref={ref} 
      className="py-16 sm:py-20 md:py-24 bg-[#502d13] relative overflow-hidden"
    >
      {/* Decorative Elements - Responsive sizing */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-[#e9ddc8]/5 rounded-full blur-2xl sm:blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-[#e9ddc8]/5 rounded-full blur-2xl sm:blur-3xl" />
        
        {/* Animated particles - only on desktop */}
        {!isMobile && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#e9ddc8]/20 rounded-full"
            initial={{
              x: Math.random() * windowWidth,
              y: Math.random() * 1000,
            }}
            animate={{
              y: [null, -500],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block text-[#e9ddc8]/60 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2"
          >
            Why Choose Us
          </motion.span>
          
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#e9ddc8] mt-2 px-4">
            The CASA Terminal Advantage
          </h2>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={isInView ? { width: "6rem" } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-1 bg-[#e9ddc8] mx-auto mt-4 sm:mt-6 rounded-full"
          />
        </motion.div>

        {/* Grid Layout - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {displayReasons.map((reason, i) => {
            const Icon = reason.icon;
            const isActive = activeIndex === i || expandedIndex === i;
            
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onHoverStart={() => !isMobile && setActiveIndex(i)}
                onHoverEnd={() => !isMobile && setActiveIndex(null)}
                onClick={() => handleCardClick(i)}
                className={`group relative bg-[#e9ddc8]/5 backdrop-blur-sm border border-[#e9ddc8]/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 
                  hover:bg-[#e9ddc8]/10 transition-all duration-500 overflow-hidden cursor-pointer
                  ${isMobile ? 'active:scale-[0.98] transition-transform' : ''}
                  ${expandedIndex === i ? 'ring-2 ring-[#e9ddc8]' : ''}`}
              >
                {/* Animated Gradient Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#e9ddc8]/0 via-[#e9ddc8]/10 to-[#e9ddc8]/0"
                  animate={{
                    x: isActive ? ["-100%", "200%"] : "-100%",
                  }}
                  transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                />

                {/* Icon Container with Gradient */}
                <motion.div
                  animate={{ 
                    rotate: isActive ? 360 : 0,
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.6 }}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${reason.color} p-[1px] mb-4 sm:mb-5 md:mb-6`}
                >
                  <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#502d13] flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#e9ddc8]" />
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#e9ddc8] mb-2">
                  {reason.title}
                </h3>
                
                <p className="text-[#e9ddc8]/60 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {reason.description}
                </p>

                {/* Features - Visible on hover (desktop) or expanded (mobile) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mb-3 sm:mb-4">
                        {reason.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-xs sm:text-sm text-[#e9ddc8]/70">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#e9ddc8] flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stat Badge - Always visible on mobile, hover on desktop */}
                <motion.div
                  animate={{ 
                    opacity: isMobile ? 1 : (isActive ? 1 : 0.7),
                    y: isMobile ? 0 : (isActive ? 0 : 10),
                  }}
                  className={`flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#e9ddc8]/10`}
                >
                  <div>
                    <div className="text-lg sm:text-xl md:text-2xl font-display font-bold text-[#e9ddc8]">
                      {reason.stat}
                    </div>
                    <div className="text-[#e9ddc8]/40 text-[10px] sm:text-xs">
                      {reason.statLabel}
                    </div>
                  </div>
                  
                  {/* Mobile indicator */}
                  {isMobile && (
                    <ChevronRight 
                      className={`w-4 h-4 text-[#e9ddc8]/60 transition-transform duration-300 ${
                        expandedIndex === i ? 'rotate-90' : ''
                      }`} 
                    />
                  )}
                </motion.div>

                {/* Shine Effect - Desktop only */}
                {!isMobile && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e9ddc8]/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View More Button */}
        {isMobile && !showAll && reasons.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 bg-[#e9ddc8] text-[#502d13] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#d4c4a8] transition-colors shadow-lg"
            >
              View All Features
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Trust Badges - Mobile */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-3 gap-2"
          >
            {[
              { icon: Shield, label: "Secure" },
              { icon: Award, label: "Trusted" },
              { icon: Users, label: "Verified" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 bg-[#e9ddc8]/5 rounded-lg p-2">
                <Icon className="w-4 h-4 text-[#e9ddc8]" />
                <span className="text-[10px] text-[#e9ddc8]/60">{label}</span>
              </div>
            ))}
          </motion.div>
        )}

      
      </div>

    
    </section>
  );
};

export default WhyChooseUs;