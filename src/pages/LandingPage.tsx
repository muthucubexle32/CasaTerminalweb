import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import CoreServices from '../components/sections/CoreServices';

import WhyChooseUs from '../components/sections/WhyChooseUs';
import LocationPrompt from '../components/LocationPrompt';


const LandingPage: React.FC = () => {
  return (
    <>
      <LocationPrompt />
      <HeroSection />
      <CoreServices />
      <WhyChooseUs />
    </>
  );
};

export default LandingPage;