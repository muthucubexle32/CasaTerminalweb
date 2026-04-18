import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  Award,
  Hammer,
  MessageCircle,
  Share2,
  Bookmark,
  Briefcase,
  Clock,
  Users,
  ThumbsUp,
  X,
  HardHat,
  ChevronRight,
  Send,
  User,
  FileText,
  DollarSign
} from 'lucide-react';

const ContractorDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    date: '',
    description: ''
  });

  const contractor = {
    name: 'XX XXX',
    title: 'XX XXX & XXX',
    rating: 4.8,
    reviews: 156,
    location: 'XXX, YYY',
    phone: '+91 XXXXXXXXXX',
    email: 'xx.xxx@xxxxx.xxx',
    experience: 'XX+ years',
    projects: 85,
    verified: true,
    description: 'XX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX.',
    skills: ['XXX XXX', 'XXX XXX', 'XXX', 'XXX XXX'],
    certifications: ['XXX XXX', 'XXX XXX XXX', 'XXX XXX'],
  };

  const projects = [
    { 
      id: 1, 
      name: 'XXX XXX', 
      location: 'XXX, YYY', 
      year: '20XX', 
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500',
      description: 'XX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX.',
      client: 'XXX XXX',
      value: 'XX XXX'
    },
    { 
      id: 2, 
      name: 'XXX XXX', 
      location: 'XXX, YYY', 
      year: '20XX', 
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
      description: 'XX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX.',
      client: 'XXX XXX',
      value: 'XX XXX'
    },
    { 
      id: 3, 
      name: 'XXX XXX', 
      location: 'XXX, YYY', 
      year: '20XX', 
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
      description: 'XX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX.',
      client: 'XXX XXX',
      value: 'XX XXX'
    },
  ];

  const reviews = [
    { id: 1, user: 'XX XXX', rating: 5, comment: 'XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX.', date: 'X days ago' },
    { id: 2, user: 'XX XXX', rating: 5, comment: 'XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX.', date: 'X week ago' },
    { id: 3, user: 'XX XXX', rating: 4, comment: 'XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX.', date: 'X weeks ago' },
  ];

  const stats = [
    { icon: Briefcase, label: 'Experience', value: contractor.experience },
    { icon: HardHat, label: 'Projects', value: `${contractor.projects}+` },
    { icon: Users, label: 'Clients', value: 'XX+' },
    { icon: ThumbsUp, label: 'Success Rate', value: 'XX%' },
  ];

  const handleCall = () => {
    window.location.href = `tel:${contractor.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contractor.email}`;
  };

  const handleChat = () => {
    // Open chat widget or redirect to chat
    console.log('Opening chat...');
    // You can implement your chat functionality here
    alert('Chat feature coming soon!');
  };

  const handleBooking = () => {
    setShowBookingForm(true);
    // Smooth scroll to booking form
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingData);
    // Here you would send the booking data to your backend
    alert('Booking request sent successfully! The contractor will contact you shortly.');
    setShowBookingForm(false);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      projectType: '',
      date: '',
      description: ''
    });
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const handleReviewClick = () => {
    setActiveTab('reviews');
    // Smooth scroll to reviews section
    setTimeout(() => {
      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-primary-50 py-4 sm:py-6 md:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-secondary-500 mb-3 sm:mb-4 md:mb-6 transition-colors text-xs sm:text-sm md:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span>Back to Listings</span>
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg mb-3 sm:mb-4 md:mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">XX</span>
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="text-center sm:text-left">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary-500">
                    {contractor.name}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">
                    {contractor.title}
                  </p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                  <button 
                    onClick={() => alert('Share feature coming soon!')}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => alert('Saved to bookmarks!')}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Stats Row - Responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="bg-primary-50 rounded-lg p-2 sm:p-3 text-center hover:shadow-md transition-shadow">
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-500 mx-auto mb-1" />
                      <div className="text-xs sm:text-sm font-semibold text-secondary-500">{stat.value}</div>
                      <div className="text-[8px] sm:text-xs text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Rating and Location */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button 
                  onClick={handleReviewClick}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-secondary-500 text-xs sm:text-sm md:text-base">
                    {contractor.rating}
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                    ({contractor.reviews} reviews)
                  </span>
                </button>
                <span className="text-gray-300 hidden xs:inline">|</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span className="text-[10px] sm:text-xs md:text-sm">{contractor.location}</span>
                </div>
                {contractor.verified && (
                  <>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="text-[10px] sm:text-xs md:text-sm font-medium">Verified</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact Buttons - Fully Responsive Grid with Hover Effects */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCall}
              className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-2.5 md:p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all group relative overflow-hidden"
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-secondary-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">Call</span>
              <span className="absolute inset-0 bg-secondary-500/0 group-hover:bg-secondary-500/5 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEmail}
              className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-2.5 md:p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all group relative overflow-hidden"
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-secondary-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">Email</span>
              <span className="absolute inset-0 bg-secondary-500/0 group-hover:bg-secondary-500/5 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChat}
              className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-2.5 md:p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all group relative overflow-hidden"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-secondary-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">Chat</span>
              <span className="absolute inset-0 bg-secondary-500/0 group-hover:bg-secondary-500/5 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBooking}
              className="flex items-center justify-center gap-1 sm:gap-2 p-2 sm:p-2.5 md:p-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-all group relative overflow-hidden shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-xs md:text-sm font-medium">Book Now</span>
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-1 inline-flex flex-wrap gap-1 mb-3 sm:mb-4 md:mb-6 overflow-x-auto w-full sm:w-auto"
        >
          {['Overview', 'Projects', 'Reviews', 'Contact'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.toLowerCase()
                  ? 'bg-secondary-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-primary-100'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6"
          >
            {/* About - Always Visible */}
            <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-secondary-500 mb-2 sm:mb-3">
                About
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                {contractor.description}
              </p>
            </div>

            {/* Skills & Certifications - Always Visible */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg">
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-secondary-500 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <Hammer className="w-4 h-4 sm:w-5 sm:h-5" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {contractor.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-primary-50 text-secondary-500 rounded-full text-[10px] sm:text-xs md:text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg">
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-secondary-500 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  Certifications
                </h2>
                <div className="space-y-1 sm:space-y-2">
                  {contractor.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-700">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Section - Conditionally Visible */}
            {(activeTab === 'overview' || activeTab === 'projects') && (
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-secondary-500 mb-2 sm:mb-3">
                  Recent Projects
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="group cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className="relative h-20 sm:h-24 md:h-28 lg:h-32 rounded-lg overflow-hidden mb-1 sm:mb-2 shadow-md group-hover:shadow-xl transition-all">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-white text-[8px] sm:text-xs font-medium">
                          {project.year}
                        </span>
                      </div>
                      <h3 className="font-medium text-secondary-500 text-xs sm:text-sm truncate">
                        {project.name}
                      </h3>
                      <p className="text-[8px] sm:text-xs text-gray-600 flex items-center gap-0.5">
                        <MapPin className="w-2 h-2 sm:w-3 sm:h-3" />
                        <span className="truncate">{project.location}</span>
                      </p>
                    </motion.div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('projects')}
                  className="mt-3 sm:mt-4 text-xs sm:text-sm text-secondary-500 font-medium hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  View All Projects
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Reviews Section - Conditionally Visible */}
            {(activeTab === 'overview' || activeTab === 'reviews') && (
              <div id="reviews-section" className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-secondary-500 mb-2 sm:mb-3">
                  Client Reviews
                </h2>
                
                {/* Rating Overview */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-500">
                    {contractor.rating}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            star <= Math.floor(contractor.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                      Based on {contractor.reviews} reviews
                    </p>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-2 sm:space-y-3">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2 sm:p-3 bg-primary-50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-secondary-500 text-xs sm:text-sm">
                          {review.user}
                        </span>
                        <span className="text-[8px] sm:text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-2 h-2 sm:w-3 sm:h-3 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-700 line-clamp-2">
                        {review.comment}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="w-full mt-3 sm:mt-4 text-xs sm:text-sm text-secondary-500 font-medium hover:text-primary-600 transition-colors"
                >
                  View All Reviews
                </button>
              </div>
            )}

            {/* Contact Section - Conditionally Visible */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-secondary-500 mb-2 sm:mb-3">
                  Contact Information
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-primary-50 rounded-lg">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="text-sm sm:text-base font-medium text-secondary-500">{contractor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-primary-50 rounded-lg">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500" />
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="text-sm sm:text-base font-medium text-secondary-500">{contractor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-primary-50 rounded-lg">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500" />
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-sm sm:text-base font-medium text-secondary-500">{contractor.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar - Always Visible */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3 sm:space-y-4 md:space-y-6"
          >
            {/* Quick Stats */}
            <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-secondary-500 mb-2 sm:mb-3">
                Quick Stats
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm p-2 hover:bg-primary-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold text-secondary-500">{contractor.experience}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm p-2 hover:bg-primary-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-semibold text-secondary-500">{contractor.projects}+</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm p-2 hover:bg-primary-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-secondary-500">{'< XX hrs'}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm p-2 hover:bg-primary-50 rounded-lg transition-colors">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-semibold text-green-600">Available</span>
                </div>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-green-800">Available Now</h4>
                  <p className="text-[10px] sm:text-xs text-green-700 mt-0.5">
                    Usually responds within XX hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Booking Form Modal */}
        <AnimatePresence>
          {showBookingForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowBookingForm(false)}
            >
              <motion.div
                id="booking-form"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-500">Book a Consultation</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Project Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={bookingData.projectType}
                      onChange={(e) => setBookingData({ ...bookingData, projectType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    >
                      <option value="">Select project type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="renovation">Renovation</option>
                      <option value="infrastructure">Infrastructure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Project Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        value={bookingData.description}
                        onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                        rows={3}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        placeholder="Brief description of your project"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Request
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="relative h-40 sm:h-56 md:h-64 rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-secondary-500 mb-2">{selectedProject.name}</h2>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div className="bg-primary-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-[10px] sm:text-xs text-gray-600">Location</span>
                    <p className="text-xs sm:text-sm font-medium text-secondary-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedProject.location}
                    </p>
                  </div>
                  <div className="bg-primary-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-[10px] sm:text-xs text-gray-600">Year</span>
                    <p className="text-xs sm:text-sm font-medium text-secondary-500">{selectedProject.year}</p>
                  </div>
                  <div className="bg-primary-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-[10px] sm:text-xs text-gray-600">Client</span>
                    <p className="text-xs sm:text-sm font-medium text-secondary-500">{selectedProject.client}</p>
                  </div>
                  <div className="bg-primary-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-[10px] sm:text-xs text-gray-600">Project Value</span>
                    <p className="text-xs sm:text-sm font-medium text-secondary-500 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {selectedProject.value}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                  {selectedProject.description}
                </p>

                <button
                  onClick={handleBooking}
                  className="w-full bg-secondary-500 text-white py-2 sm:py-3 rounded-lg text-sm font-medium hover:bg-secondary-600 transition-colors"
                >
                  Book Similar Project
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContractorDetail;