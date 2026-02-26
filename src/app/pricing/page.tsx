"use client";

import { useState } from 'react';
import { PRICING_TIERS, CREDIT_PACKAGES, formatCurrency, calculateCompanyRevenue, COMPANY_INFO } from '@/lib/credits';
import { useCredits } from '@/lib/CreditContext';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Check, X, CreditCard, Zap, Star, Crown, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const { user } = useAuth();
  const { tier: currentTier, upgradeTier, purchasePackage, credits } = useCredits();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');
  const router = useRouter();

  const handleUpgrade = async (tierId: string) => {
    if (!user && tierId !== 'demo') {
      router.push('/login');
      return;
    }
    
    setLoading(tierId);
    try {
      await upgradeTier(tierId as any);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setLoading(null);
    }
  };

  const handlePurchaseCredits = async (packageId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setLoading(packageId);
    try {
      await purchasePackage(packageId);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(null);
    }
  };

  const isCurrentTier = (tierId: string) => currentTier === tierId;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold">API Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {credits ? `${credits.remainingCredits} credits remaining` : '10 free credits'}
            </span>
            {user && (
              <button
                onClick={() => router.push('/')}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Go to Dashboard →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Revenue Share Notice */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-indigo-300">
              {COMPANY_INFO.name} receives 1% of all transactions
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Start with our free demo, then upgrade for full customization and unlimited API access.
            All plans include a 1% contribution to {COMPANY_INFO.name}.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setBillingCycle('month')}
              className={`px-4 py-2 rounded-md transition-all ${
                billingCycle === 'month' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('year')}
              className={`px-4 py-2 rounded-md transition-all ${
                billingCycle === 'year' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly <span className="text-xs text-green-400 ml-1">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PRICING_TIERS.map((tier) => {
            const price = billingCycle === 'year' && tier.price > 0 
              ? tier.price * 0.8 
              : tier.price;
            
            return (
              <div
                key={tier.id}
                className={`relative bg-gray-800 rounded-2xl border ${
                  tier.popular 
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' 
                    : 'border-gray-700'
                } p-6 flex flex-col`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {tier.name}
                    {tier.id === 'demo' && <Sparkles className="w-4 h-4 text-yellow-400" />}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {tier.credits} credits/month
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {tier.price === 0 ? 'Free' : formatCurrency(price)}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-gray-400 text-sm">/{billingCycle}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={loading === tier.id || isCurrentTier(tier.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isCurrentTier(tier.id)
                      ? 'bg-green-600/20 text-green-400 cursor-default'
                      : tier.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {loading === tier.id 
                    ? 'Processing...' 
                    : isCurrentTier(tier.id) 
                      ? 'Current Plan' 
                      : tier.price === 0 
                        ? 'Get Started Free' 
                        : 'Upgrade Now'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Credit Packages Section */}
        <div className="border-t border-gray-800 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Need More Credits?</h2>
            <p className="text-gray-400">
              Purchase additional credits anytime. 1% of each purchase goes to {COMPANY_INFO.name}.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKAGES.map((pkg) => {
              const companyCut = calculateCompanyRevenue(pkg.price);
              
              return (
                <div
                  key={pkg.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6"
                >
                  <h3 className="text-lg font-bold mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{pkg.credits}</span>
                    <span className="text-gray-400"> credits</span>
                  </div>
                  <div className="text-2xl font-bold mb-4">{formatCurrency(pkg.price)}</div>
                  
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs text-gray-500 mb-4">
                    +{formatCurrency(companyCut)} to {COMPANY_INFO.name}
                  </div>

                  <button
                    onClick={() => handlePurchaseCredits(pkg.id)}
                    disabled={loading === pkg.id}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {loading === pkg.id ? 'Processing...' : 'Purchase'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-gray-800 mt-16 pt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">What are credits used for?</h3>
              <p className="text-gray-400 text-sm">
                Credits are used for API calls, data exports, custom report generation, and premium features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How does the revenue share work?</h3>
              <p className="text-gray-400 text-sm">
                1% of all payments go directly to {COMPANY_INFO.name} to support the platform development.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I switch plans anytime?</h3>
              <p className="text-gray-400 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
