import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Package, HardHat, Wrench, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const coreServices = [
  {
    icon: Package,
    title: "Products",
    description: "Premium construction materials at factory prices. Cement, steel, bricks, and more.",
    features: ["50+ Brands", "Quality Guaranteed", "Bulk Discounts"],
    color: "from-amber-600 to-orange-600",
    bgImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500",
    link: "/products",
  },
  {
    icon: Wrench,
    title: "Rental",
    description: "Heavy equipment and machinery on flexible rental terms. JCB, cranes, and more.",
    features: ["Latest Models", "Maintained Fleet", "Operator Available"],
    color: "from-purple-600 to-pink-600",
    bgImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500",
    link: "/rentals",
  },
  {
    icon: HardHat,
    title: "Contractors",
    description: "Verified professionals and skilled workforce for your construction needs.",
    features: ["Background Verified", "Skill Tested", "Insurance Covered"],
    color: "from-green-600 to-emerald-600",
    bgImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500",
    link: "/contractors",
  },
];

const CoreServices = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const handleCardClick = (index: number) => {
    if (isMobile) {
      setActiveCard(activeCard === index ? null : index);
    }
  };

  return (
    <section
      id="services"
      ref={ref}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#e9ddc8] relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 bg-[#502d13] rounded-full blur-2xl md:blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 bg-[#502d13] rounded-full blur-2xl md:blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[#502d13] text-[#e9ddc8] px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 md:mb-4"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-semibold">Premium Services</span>
          </motion.div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#502d13] mt-2 md:mt-3 px-4">
            Everything Under One Roof
          </h2>
          <p className="text-[#502d13]/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-2 md:mt-4 px-4">
            From raw materials to skilled workforce — we've got your construction needs covered
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {coreServices.map((service, i) => {
            const Icon = service.icon;
            const isActive = hoveredCard === i || activeCard === i;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                onHoverStart={() => !isMobile && setHoveredCard(i)}
                onHoverEnd={() => !isMobile && setHoveredCard(null)}
                onClick={() => handleCardClick(i)}
                className={`group relative ${
                  isMobile ? "h-[340px] sm:h-[360px]" : "h-[380px] md:h-[420px]"
                } rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300`}
              >
                {/* Background Image with Overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={service.bgImage}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-80 md:opacity-90 mix-blend-multiply`}
                  />
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end text-white">
                  <motion.div
                    animate={{
                      y: isActive ? (isMobile ? -8 : -12) : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 md:mb-4 ${
                        isActive ? "scale-110" : ""
                      } transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-xl sm:text-2xl md:text-2xl lg:text-3xl mb-1 md:mb-2">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/80 text-xs sm:text-sm md:text-base mb-3 md:mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    {/* Features (only visible on hover/active) */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        height: isActive ? "auto" : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-1.5 md:space-y-2 mb-3 md:mb-4 overflow-hidden"
                    >
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm"
                        >
                          <div className="w-1 h-1 bg-white rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </motion.div>

                    {/* Explore Button – always visible on mobile, appears on hover/active on desktop */}
                    <motion.div
                      animate={{
                        opacity: isMobile ? 1 : isActive ? 1 : 0,
                        y: isMobile ? 0 : isActive ? 0 : 10,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={service.link}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-white/30 transition-colors duration-200"
                      >
                        Explore {service.title}
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Shine Effect (desktop only) */}
                {!isMobile && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                )}

                {/* Touch feedback overlay for mobile – now with pointer-events: none to allow button clicks */}
                {isMobile && (
                  <div
                    className={`absolute inset-0 bg-black/0 transition-colors duration-300 pointer-events-none ${
                      isActive ? "bg-black/20" : ""
                    }`}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
       
      </div>
    </section>
  );
};

export default CoreServices;