// src/components/admin/AdminLayout.tsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { HardHat, Wrench, CheckCircle } from 'lucide-react';

// Simple error boundary
import { Component, ErrorInfo, ReactNode } from 'react';
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AdminLayout error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-600 rounded-lg">
          <h2 className="text-lg font-bold">Something went wrong</h2>
          <pre className="mt-2 text-sm">{this.state.error?.message}</pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');
    const currentPath = location.pathname;

    if (!isLoggedIn || userType !== 'admin') {
      if (currentPath !== '/admin/login') {
        navigate('/admin/login');
      }
      return;
    }

    setIsLoading(false);

    // Show welcome message only once per session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      sessionStorage.setItem('hasSeenWelcome', 'true');
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [navigate, location]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('sellers')) return 'Seller Management';
    if (path.includes('contractors')) return 'Contractor Management';
    if (path.includes('rentals')) return 'Rental Management';
    if (path.includes('products')) return 'Products Management';
    if (path.includes('payments')) return 'Payments & Commission';
    if (path.includes('reports')) return 'Reports & Analytics';
    if (path.includes('settings')) return 'Settings';
    return 'Admin Panel';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#502d13] to-[#7b4a26] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-4 border-[#e9ddc8] border-t-transparent rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <HardHat className="w-10 h-10 text-[#e9ddc8]" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[#e9ddc8] font-medium"
          >
            Loading Admin Panel...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #502d13 0px, #502d13 4px, transparent 4px, transparent 24px)`
        }}></div>
      </div>

      {/* Welcome Toast */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl border-l-4 border-green-500 p-4 min-w-[300px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Welcome back, Admin!</p>
                <p className="text-sm text-gray-500">You have 12 new notifications</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : ''}`}>
        {/* Breadcrumb */}
        <div className="fixed top-16 right-0 left-0 lg:left-80 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30 py-2 px-4 transition-all duration-300">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Pages</span>
            <span className="text-gray-400">/</span>
            <span className="text-[#502d13] font-medium">{getPageTitle()}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative p-4 sm:p-6 md:p-8 mt-24"
          >
            <ErrorBoundary>
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#502d13] via-[#7b4a26] to-[#a06e3a]" />
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #502d13 0px, #502d13 4px, transparent 4px, transparent 12px)`
                }} />
                <div className="relative p-6">
                  <Outlet />
                </div>
              </div>
            </ErrorBoundary>
            <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <Wrench className="w-3 h-3" />
              <span>Casa Terminal Admin Panel v2.5.0 • Construction Management System</span>
              <HardHat className="w-3 h-3" />
            </div>
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Mobile Quick Action Button */}
      {isMobile && !sidebarOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#502d13] to-[#7b4a26] rounded-full shadow-2xl flex items-center justify-center text-white z-40 lg:hidden"
        >
          <HardHat className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default AdminLayout;