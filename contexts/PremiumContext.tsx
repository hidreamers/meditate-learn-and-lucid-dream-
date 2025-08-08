import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import IAP from '../utils/IAP';

interface PremiumContextType {
  isPremium: boolean;
  checkPremiumStatus: () => Promise<void>;
  isLoading: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  // Force non-premium for testing locked UI
  const [isPremium, setIsPremium] = useState(false); // Set to false to show locked/upgrade UI
  const [isLoading, setIsLoading] = useState(true);

  const checkPremiumStatus = async () => {
    setIsLoading(true);
    // const status = await IAP.isPremium();
    // setIsPremium(status);
    setIsLoading(false);
  };

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium, checkPremiumStatus, isLoading }}>
      {children}
    </PremiumContext.Provider>
  );
};
