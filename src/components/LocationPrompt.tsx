import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Search } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const LocationPrompt: React.FC = () => {
  const { location, requestLocation, setLocation, isLoading } = useLocation();
  const [isOpen, setIsOpen] = useState(!location);
  const [manualAddress, setManualAddress] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualAddress.trim()) {
      setLocation({
        lat: 28.6139 + Math.random() * 0.1,
        lng: 77.2090 + Math.random() * 0.1,
        address: manualAddress,
      });
      setIsOpen(false);
    }
  };

  const handleAllowLocation = () => {
    requestLocation();
    setTimeout(() => {
      if (useLocation().location) setIsOpen(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => {}}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Set Your Location</h2>
            <p className="text-gray-500 text-sm mt-2">
              Get nearby products, contractors, and rentals tailored to you.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAllowLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Navigation className="w-5 h-5" />
              {isLoading ? 'Detecting...' : 'Use Current Location'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter city or address"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationPrompt;