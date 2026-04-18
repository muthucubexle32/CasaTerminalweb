import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { MapPin } from 'lucide-react';

interface NearbySectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getLocation: (item: T) => { lat: number; lng: number };
}

const NearbySection = <T,>({
  title,
  items,
  renderItem,
  getLocation,
}: NearbySectionProps<T>) => {
  const { location } = useLocation();

  const sortedItems = React.useMemo(() => {
    if (!location) return items;
    return [...items].sort((a, b) => {
      const aLoc = getLocation(a);
      const bLoc = getLocation(b);
      const distA = Math.hypot(aLoc.lat - location.lat, aLoc.lng - location.lng);
      const distB = Math.hypot(bLoc.lat - location.lat, bLoc.lng - location.lng);
      return distA - distB;
    });
  }, [items, location, getLocation]);

  if (items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {location && (
          <span className="text-sm text-primary-600 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Near {location.address}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.slice(0, 6).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NearbySection;