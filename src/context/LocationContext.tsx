import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (loc: Location) => void;
  requestLocation: () => void;
  isLoading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          address: `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (location) {
      localStorage.setItem('userLocation', JSON.stringify(location));
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation, requestLocation, isLoading, error }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};