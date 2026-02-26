// Credit and Token System for API Dashboard
// Company: Conten-Distribution@Path_Finder#.Ltd receives 1% revenue
// Dashboard: AI API Revenue Tracker for Creators

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  features: string[];
}

export interface UserCredits {
  userId: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  purchaseHistory: CreditPurchase[];
  tier: UserTier;
}

export interface CreditPurchase {
  id: string;
  packageId: string;
  credits: number;
  amount: number;
  companyCut: number; // 1% to Conten-Distribution@Path_Finder#.Ltd
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: PaymentMethod;
}

export type UserTier = 'demo' | 'basic' | 'pro' | 'enterprise';

export type PaymentMethod = 'paypal' | 'phantom' | 'coinbase' | 'card' | 'bank';

export interface PricingTier {
  id: UserTier;
  name: string;
  price: number;
  interval: 'month' | 'year';
  credits: number;
  features: string[];
  popular?: boolean;
}

// Payment method display info
export const PAYMENT_METHODS = [
  {
    id: 'paypal' as PaymentMethod,
    name: 'PayPal',
    icon: '💳',
    description: 'Pay with your PayPal account'
  },
  {
    id: 'card' as PaymentMethod,
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, Amex'
  },
  {
    id: 'bank' as PaymentMethod,
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Direct bank transfer'
  },
  {
    id: 'phantom' as PaymentMethod,
    name: 'Phantom Wallet',
    icon: '👻',
    description: 'Solana wallet (Crypto)'
  },
  {
    id: 'coinbase' as PaymentMethod,
    name: 'Coinbase Wallet',
    icon: '₿',
    description: 'Bitcoin & Ethereum wallet'
  }
];

// Company info for revenue allocation
export const COMPANY_INFO = {
  name: 'Conten-Distribution@Path_Finder#.Ltd',
  revenueShare: 0.01, // 1%
  platformFee: 0.05,  // 5% platform fee
};

// Credit packages available for purchase
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 100,
    price: 9.99,
    features: ['100 API credits', 'Basic analytics', 'Email support']
  },
  {
    id: 'growth',
    name: 'Growth Pack',
    credits: 500,
    price: 39.99,
    features: ['500 API credits', 'Advanced analytics', 'Priority support', 'Custom reports']
  },
  {
    id: 'scale',
    name: 'Scale Pack',
    credits: 2000,
    price: 129.99,
    features: ['2000 API credits', 'Full analytics suite', '24/7 support', 'Custom reports', 'API access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 10000,
    price: 499.99,
    features: ['10000 API credits', 'Enterprise analytics', 'Dedicated support', 'White-label reports', 'Full API access', 'SLA guarantee']
  }
];

// Subscription tiers
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'demo',
    name: 'Demo',
    price: 0,
    interval: 'month',
    credits: 10,
    features: [
      '10 free credits',
      'Basic dashboard',
      'Sample data',
      'Community support'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 19.99,
    interval: 'month',
    credits: 100,
    features: [
      '100 credits/month',
      'Full dashboard access',
      'Basic customization',
      'Email support',
      'Export data'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49.99,
    interval: 'month',
    credits: 500,
    features: [
      '500 credits/month',
      'Advanced customization',
      'Priority support',
      'Custom themes',
      'API access',
      'White-label'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.99,
    interval: 'month',
    credits: 5000,
    features: [
      '5000 credits/month',
      'Full customization',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option'
    ]
  }
];

// Calculate company revenue share (1%)
export function calculateCompanyRevenue(amount: number): number {
  return amount * COMPANY_INFO.revenueShare;
}

// Calculate platform fee (5%)
export function calculatePlatformFee(amount: number): number {
  return amount * COMPANY_INFO.platformFee;
}

// Calculate net revenue after company and platform cuts
export function calculateNetRevenue(amount: number): number {
  return amount - calculateCompanyRevenue(amount) - calculatePlatformFee(amount);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Generate unique purchase ID
export function generatePurchaseId(): string {
  return `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Mock function to simulate credit purchase (would integrate with Stripe in production)
export async function purchaseCredits(
  userId: string,
  packageId: string,
  paymentMethod: PaymentMethod = 'card'
): Promise<CreditPurchase> {
  const creditPackage = CREDIT_PACKAGES.find(p => p.id === packageId);
  if (!creditPackage) {
    throw new Error('Invalid credit package');
  }

  const companyCut = calculateCompanyRevenue(creditPackage.price);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: generatePurchaseId(),
    packageId: creditPackage.id,
    credits: creditPackage.credits,
    amount: creditPackage.price,
    companyCut,
    timestamp: new Date(),
    status: 'completed',
    paymentMethod
  };
}

// Get tier by ID
export function getTierById(tierId: string): PricingTier | undefined {
  return PRICING_TIERS.find(t => t.id === tierId);
}

// Check if user can use feature based on tier
export function canAccessFeature(tier: UserTier, feature: string): boolean {
  const tierConfig = PRICING_TIERS.find(t => t.id === tier);
  return tierConfig?.features.includes(feature) ?? false;
}
