// src/components/admin/DashboardCards.tsx
import { motion } from 'framer-motion';
import { 
   MoreVertical, 
  ArrowUpRight, ArrowDownRight,
  Building2
} from 'lucide-react';

interface DashboardCardsProps {
  data: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: number;
    trendLabel?: string;
    bgColor?: string;
  }[];
}

const DashboardCards = ({ data }: DashboardCardsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Construction-themed color gradients
  const getGradient = (color: string) => {
    const gradients: Record<string, string> = {
      'blue': 'from-blue-500 to-blue-600',
      'green': 'from-emerald-500 to-green-600',
      'orange': 'from-orange-500 to-amber-600',
      'purple': 'from-purple-500 to-violet-600',
      'red': 'from-red-500 to-rose-600',
      'yellow': 'from-yellow-500 to-amber-500',
      'indigo': 'from-indigo-500 to-blue-600',
      'pink': 'from-pink-500 to-rose-500',
    };
    return gradients[color] || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {data.map((card, index) => {
        const Icon = card.icon;
        const gradient = getGradient(card.color);
        const isPositive = card.trend && card.trend > 0;

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              y: -4,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            {/* Card with construction-themed border */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-[#502d13] hover:shadow-xl transition-all duration-300">
              {/* Diagonal construction pattern overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #502d13 0px, #502d13 2px, transparent 2px, transparent 8px)`
                }}></div>
              </div>

              <div className="relative p-5 md:p-6">
                {/* Header with icon and menu */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Value and title */}
                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {card.value}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {card.title}
                  </p>
                </div>

                {/* Trend indicator */}
                {card.trend !== undefined && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span className="text-xs font-semibold">
                        {Math.abs(card.trend)}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {card.trendLabel || 'vs last month'}
                    </span>
                  </div>
                )}

                {/* Construction-themed bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#502d13] via-[#7b4a26] to-[#a06e3a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>

            {/* Decorative element - hard hat icon for construction theme */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#502d13] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardCards;