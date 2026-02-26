"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  UserCredits, 
  CreditPurchase, 
  UserTier, 
  CREDIT_PACKAGES,
  calculateCompanyRevenue,
  PaymentMethod 
} from './credits';

interface CreditContextType {
  credits: UserCredits | null;
  tier: UserTier;
  loading: boolean;
  purchasePackage: (packageId: string, paymentMethod?: PaymentMethod) => Promise<void>;
  useCredits: (amount: number) => boolean;
  upgradeTier: (newTier: UserTier) => Promise<void>;
  companyName: string;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

// Get initial credits from localStorage
function getInitialCredits(userId?: string): UserCredits {
  if (typeof window === 'undefined') {
    return {
      userId: userId || 'demo',
      totalCredits: 10,
      usedCredits: 0,
      remainingCredits: 10,
      purchaseHistory: [],
      tier: 'demo'
    };
  }
  
  const savedCredits = localStorage.getItem('user_credits');
  if (savedCredits) {
    try {
      return JSON.parse(savedCredits);
    } catch (e) {
      console.error('Failed to parse saved credits');
    }
  }
  
  return {
    userId: userId || 'demo',
    totalCredits: 10,
    usedCredits: 0,
    remainingCredits: 10,
    purchaseHistory: [],
    tier: 'demo'
  };
}

// Get initial tier from localStorage
function getInitialTier(): UserTier {
  if (typeof window === 'undefined') return 'demo';
  
  const savedTier = localStorage.getItem('user_tier');
  if (savedTier && ['demo', 'basic', 'pro', 'enterprise'].includes(savedTier)) {
    return savedTier as UserTier;
  }
  return 'demo';
}

export function CreditProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [credits, setCredits] = useState<UserCredits>(() => getInitialCredits(userId));
  const [tier, setTier] = useState<UserTier>(() => getInitialTier());
  const [loading, setLoading] = useState(false);

  // Save credits whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('user_credits', JSON.stringify(credits));
    }
  }, [credits, loading]);

  // Save tier whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('user_tier', tier);
    }
  }, [tier, loading]);

  const purchasePackage = async (packageId: string, paymentMethod: PaymentMethod = 'card') => {
    const creditPackage = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!creditPackage) {
      throw new Error('Invalid package');
    }

    const companyCut = calculateCompanyRevenue(creditPackage.price);

    const purchase: CreditPurchase = {
      id: `purchase_${Date.now()}`,
      packageId: creditPackage.id,
      credits: creditPackage.credits,
      amount: creditPackage.price,
      companyCut,
      timestamp: new Date(),
      status: 'completed',
      paymentMethod
    };

    setCredits(prev => ({
      ...prev,
      totalCredits: prev.totalCredits + creditPackage.credits,
      remainingCredits: prev.remainingCredits + creditPackage.credits,
      purchaseHistory: [...prev.purchaseHistory, purchase]
    }));
  };

  const useCredits = (amount: number): boolean => {
    if (credits.remainingCredits >= amount) {
      setCredits(prev => ({
        ...prev,
        usedCredits: prev.usedCredits + amount,
        remainingCredits: prev.remainingCredits - amount
      }));
      return true;
    }
    
    return false;
  };

  const upgradeTier = async (newTier: UserTier) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTier(newTier);
      
      // Add credits based on new tier
      const tierCredits: Record<UserTier, number> = {
        demo: 10,
        basic: 100,
        pro: 500,
        enterprise: 5000
      };
      
      setCredits(prev => ({
        ...prev,
        tier: newTier,
        totalCredits: prev.totalCredits + tierCredits[newTier],
        remainingCredits: prev.remainingCredits + tierCredits[newTier]
      }));
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    credits,
    tier,
    loading,
    purchasePackage,
    useCredits,
    upgradeTier,
    companyName: 'Conten-Distribution@Path_Finder#.Ltd'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [credits, tier, loading]);

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
}
