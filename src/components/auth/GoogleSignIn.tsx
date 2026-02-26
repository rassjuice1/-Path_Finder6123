"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Twitter, Linkedin, Github, ArrowRight, Sparkles, BarChart3, Shield, Zap } from 'lucide-react';

// Social login providers
const socialProviders = [
  {
    id: 'google',
    name: 'Google',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    color: 'bg-white hover:bg-gray-100 text-gray-800',
    description: 'Connect your Google account'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: <Twitter className="w-5 h-5" />,
    color: 'bg-black hover:bg-gray-800 text-white',
    description: 'Analyze your Twitter/X data'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    description: 'Track professional network analytics'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <Github className="w-5 h-5" />,
    color: 'bg-gray-700 hover:bg-gray-600 text-white',
    description: 'Monitor repository API usage'
  }
];

export default function GoogleSignIn() {
  const { user, loading: authLoading, signInWithGoogle, isDemo } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignIn = async (providerId: string) => {
    // Demo mode: simulate different provider sign-ins
    // In production, implement real OAuth for each provider
    const providerNames: Record<string, string> = {
      google: 'Google',
      twitter: 'Twitter/X',
      linkedin: 'LinkedIn',
      github: 'GitHub'
    };
    
    // Simulate sign-in delay
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create mock user based on provider (use simple ID for demo)
    const mockUser = {
      uid: `demo_${providerId}_user`,
      email: `demo@${providerId}.com`,
      displayName: `${providerNames[providerId]} User`,
      photoURL: '',
      provider: providerId
    };
    
    // Store in localStorage
    localStorage.setItem('dashboard_user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/');
  };

  const handleDemoMode = () => {
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg shadow-indigo-500/30">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">API Dashboard</h1>
          <p className="text-gray-400">Sign in to access your personalized dashboard</p>
        </div>

        {/* Social Login Cards */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Connect Your Account
          </h2>
          
          <div className="space-y-3">
            {socialProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSignIn(provider.id)}
                className={`w-full flex items-center justify-between gap-4 ${provider.color} font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg`}
              >
                <span className="flex items-center gap-3">
                  {provider.icon}
                  <span>Sign in with {provider.name}</span>
                </span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              <br />
              1% of proceeds go to Conten-Distribution@Path_Finder#.Ltd
            </p>
          </div>
        </div>

        {/* Demo Mode */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Try Demo Mode
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Free</span>
              </h3>
              <p className="text-gray-400 text-sm mt-1 mb-4">
                Explore the dashboard with sample data. No sign-up required.
              </p>
              <button
                onClick={handleDemoMode}
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Enter Demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Zap, label: 'Real-time', color: 'text-yellow-400' },
            { icon: BarChart3, label: 'Analytics', color: 'text-indigo-400' },
            { icon: Shield, label: 'Secure', color: 'text-green-400' }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <feature.icon className={`w-6 h-6 mx-auto mb-2 ${feature.color}`} />
              <p className="text-xs text-gray-400">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
