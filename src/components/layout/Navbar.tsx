// components/Navbar.tsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogIn, Package, Wrench, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';
import logo from "/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [logoError, setLogoError] = useState(false);
  
  // Authentication state (isolated)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isTouchDevice = useRef(
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  ).current;

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const auth = localStorage.getItem('auth_user');
    if (auth) {
      try {
        const { isLoggedIn, role, name } = JSON.parse(auth);
        setIsLoggedIn(isLoggedIn === true);
        setUserRole(role || null);
        setUserName(name || '');
      } catch (e) {}
    }
  }, []);

  // Sync auth state to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('auth_user', JSON.stringify({ isLoggedIn: true, role: userRole, name: userName }));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [isLoggedIn, userRole, userName]);

  // Also sync with existing localStorage keys if they exist (optional, for compatibility)
  useEffect(() => {
    const syncWithExisting = () => {
      const existingLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const existingType = localStorage.getItem('userType');
      const existingName = localStorage.getItem('userName') || '';
      if (existingLoggedIn && !isLoggedIn) {
        setIsLoggedIn(true);
        setUserRole(existingType);
        setUserName(existingName);
      }
    };
    syncWithExisting();
    window.addEventListener('storage', syncWithExisting);
    return () => window.removeEventListener('storage', syncWithExisting);
  }, [isLoggedIn]);

  // Handle scroll, resize, and outside clicks
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowLoginModal(false);
        setIsOpen(false);
        setActiveMegaMenu(null);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Helper: determine dashboard link based on role
  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'seller') return '/seller/dashboard';
    if (userRole === 'contractor') return '/contractor/dashboard';
    if (userRole === 'rental') return '/rental/dashboard';
    return '/member';
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    setProfileDropdownOpen(false);
    // Clear both new and old storage keys
    localStorage.removeItem('auth_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  // Successful login callback from modal
  const handleLoginSuccess = (role: string, name: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    setShowLoginModal(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) scrollToSection(href.substring(1));
    else navigate(href);
    setIsOpen(false);
  };

  const toggleMobileMenu = (label: string) => {
    setMobileMenuOpen(mobileMenuOpen === label ? null : label);
  };

  const navLinks = [
    {
      label: "Services",
      href: "#services",
      icon: Package,
      megaMenu: {
        columns: [
          {
            title: "Construction Materials",
            icon: Package,
            links: [
              { name: "Cement & Concrete", href: "/products/cement" },
              { name: "Bricks & Blocks", href: "/products/bricks" },
              { name: "Steel & TMT", href: "/products/steel" },
              { name: "Sand & Aggregates", href: "/products/sand" },
              { name: "Tiles & Flooring", href: "/products/tiles" },
            ],
          },
          {
            title: "Equipment Rental",
            icon: Wrench,
            links: [
              { name: "JCB & Excavators", href: "/rentals?type=heavy" },
              { name: "Cranes & Hoists", href: "/rentals?type=cranes" },
              { name: "Scaffolding", href: "/rentals?type=scaffolding" },
              { name: "Concrete Mixers", href: "/rentals?type=mixers" },
              { name: "Power Tools", href: "/rentals?type=tools" },
            ],
          },
          {
            title: "Professional Services",
            icon: User,
            links: [
              { name: "Contractors", href: "/contractors" },
              { name: "Architects", href: "/contractors?type=architects" },
              { name: "Electricians", href: "/contractors?type=electricians" },
              { name: "Plumbers", href: "/contractors?type=plumbers" },
              { name: "Interior Designers", href: "/contractors?type=interior" },
            ],
          },
        ],
      },
    },
    {
      label: "Member",
      href: "/member",
      icon: User,
    },
    {
      label: "Contact",
      href: "#contact",
      icon: null,
    },
  ];

  const isDesktop = windowWidth >= 1024;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#502d13]/95 backdrop-blur-md shadow-lg' : 'bg-[#502d13]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              className="flex items-center space-x-1 sm:space-x-2 group shrink-0"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center overflow-hidden bg-[#e9ddc8]/10"
              >
                {!logoError ? (
                  <img
                    src={logo}
                    alt="Casa Terminal Logo"
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-[#e9ddc8] font-bold text-sm sm:text-base md:text-xl">CT</span>
                )}
              </motion.div>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#e9ddc8] group-hover:text-white transition-colors truncate max-w-[120px] sm:max-w-none">
                CASA TERMINAL
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (!isTouchDevice && isDesktop && link.megaMenu) setActiveMegaMenu(link.label);
                  }}
                  onMouseLeave={() => {
                    if (!isTouchDevice && isDesktop) setActiveMegaMenu(null);
                  }}
                >
                  {link.megaMenu ? (
                    <button
                      onClick={(e) => {
                        if (isTouchDevice || !isDesktop) {
                          setActiveMegaMenu(activeMegaMenu === link.label ? null : link.label);
                          e.stopPropagation();
                        } else {
                          scrollToSection('services');
                        }
                      }}
                      className="text-[#e9ddc8]/90 hover:text-white font-medium transition-colors relative group flex items-center gap-1 text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md"
                    >
                      {link.label}
                      <ChevronDown className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${activeMegaMenu === link.label ? 'rotate-180' : ''}`} />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e9ddc8] transition-all group-hover:w-full"></span>
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-[#e9ddc8]/90 hover:text-white font-medium transition-colors relative group text-sm xl:text-base px-2 xl:px-3 py-2 rounded-md"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e9ddc8] transition-all group-hover:w-full"></span>
                    </a>
                  )}

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {link.megaMenu && activeMegaMenu === link.label && isDesktop && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-[700px] bg-[#502d13] rounded-lg shadow-xl border border-[#e9ddc8]/20 overflow-hidden z-50"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 xl:p-6">
                          {link.megaMenu.columns.map((column, idx) => {
                            const Icon = column.icon;
                            return (
                              <div key={idx}>
                                <h4 className="font-semibold text-[#e9ddc8] mb-2 pb-1 border-b border-[#e9ddc8]/20 text-sm flex items-center gap-2">
                                  {Icon && <Icon className="w-4 h-4" />}
                                  {column.title}
                                </h4>
                                <ul className="space-y-1">
                                  {column.links.map((item) => (
                                    <li key={item.name}>
                                      <Link
                                        to={item.href}
                                        className="text-[#e9ddc8]/70 hover:text-white text-xs transition-colors block hover:translate-x-1 py-1"
                                        onClick={() => {
                                          setActiveMegaMenu(null);
                                          window.scrollTo(0, 0);
                                        }}
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* User Icon / Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowLoginModal(true);
                    } else {
                      setProfileDropdownOpen(!profileDropdownOpen);
                    }
                  }}
                  className="p-1.5 sm:p-2 rounded-lg text-[#e9ddc8] hover:bg-[#e9ddc8]/10 transition-colors"
                  aria-label="Profile"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#e9ddc8] rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#502d13]" />
                  </div>
                </button>
                <AnimatePresence>
                  {profileDropdownOpen && isLoggedIn && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      <div className="p-3 border-b bg-gray-50">
                        <p className="font-medium text-gray-800 truncate">{userName || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <User className="w-4 h-4" /> Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Become a Member / Logout Button - Responsive */}
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/member"
                    onClick={() => setIsOpen(false)}
                    className="sm:hidden flex items-center justify-center text-[#e9ddc8] hover:bg-[#e9ddc8]/10 p-1.5 rounded-lg transition-colors"
                    aria-label="Become a Member"
                  >
                    <LogIn className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/member"
                    onClick={() => setIsOpen(false)}
                    className="hidden sm:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#e9ddc8] text-[#502d13] hover:bg-white hover:shadow-md border border-[#d4c4a8] transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                    <span>Become a Member</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogout}
                    className="sm:hidden flex items-center justify-center text-[#e9ddc8] hover:bg-[#e9ddc8]/10 p-1.5 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex group items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#e9ddc8] hover:text-white hover:bg-red-500/80 transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-[#e9ddc8]/10 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#e9ddc8]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#e9ddc8]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer (unchanged) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#502d13] border-t border-[#e9ddc8]/20 overflow-y-auto max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)]"
            >
              <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-2 sm:space-y-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <div key={link.label} className="border-b border-[#e9ddc8]/10 last:border-0">
                      {link.megaMenu ? (
                        <>
                          <button
                            onClick={() => {
                              if (link.label === 'Services') toggleMobileMenu(link.label);
                              else if (link.label === 'Member') { navigate('/member'); setIsOpen(false); }
                              else toggleMobileMenu(link.label);
                            }}
                            className="w-full flex items-center justify-between py-2 sm:py-3 text-[#e9ddc8] font-medium text-sm sm:text-base"
                          >
                            <span className="flex items-center gap-2">
                              {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                              {link.label}
                            </span>
                            {link.megaMenu && (
                              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${mobileMenuOpen === link.label ? 'rotate-180' : ''}`} />
                            )}
                          </button>
                          <AnimatePresence>
                            {mobileMenuOpen === link.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pb-3 sm:pb-4 space-y-3 sm:space-y-4">
                                  {link.megaMenu.columns.map((column, idx) => {
                                    const ColumnIcon = column.icon;
                                    return (
                                      <div key={idx}>
                                        <h4 className="text-[#ece3d4] text-xs sm:text-sm font-semibold mb-1 px-2 flex items-center gap-2">
                                          {ColumnIcon && <ColumnIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                                          {column.title}
                                        </h4>
                                        <ul className="space-y-1">
                                          {column.links.map((item) => (
                                            <li key={item.name}>
                                              <Link
                                                to={item.href}
                                                className="block px-2 py-1.5 text-[#e9ddc8]/80 hover:bg-[#e9ddc8]/10 rounded-lg text-xs"
                                                onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }}
                                              >
                                                {item.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => { handleNavClick(e, link.href); setIsOpen(false); }}
                          className="flex items-center gap-2 py-2 sm:py-3 text-[#e9ddc8] font-medium hover:text-white text-sm sm:text-base"
                        >
                          {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                          {link.label}
                        </a>
                      )}
                    </div>
                  );
                })}
                <div className="pt-3 sm:pt-4 grid grid-cols-2 gap-2 sm:gap-3">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsOpen(false)}
                        className="bg-[#e9ddc8] text-[#502d13] px-3 py-2 rounded-lg font-semibold text-center hover:bg-white flex items-center justify-center gap-1 text-xs sm:text-sm"
                      >
                        <User className="w-3 h-3 sm:w-4 sm:h-4" /> Dashboard
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        className="bg-transparent border border-[#e9ddc8]/30 text-[#e9ddc8] px-3 py-2 rounded-lg font-semibold text-center hover:bg-[#e9ddc8]/10 flex items-center justify-center gap-1 text-xs sm:text-sm"
                      >
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="bg-[#e9ddc8] text-[#502d13] px-3 py-2 rounded-lg font-semibold text-center hover:bg-white col-span-2 flex items-center justify-center gap-1 text-xs sm:text-sm"
                    >
                      <LogIn className="w-3 h-3 sm:w-4 sm:h-4" /> User Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;