// Google Analytics 4 Data API Client
// Documentation: https://developers.google.com/analytics/devguides/reporting/data/v1

export interface GAConfig {
  propertyId: string;
  credentials: string; // JSON string of service account credentials
}

export interface GAMetrics {
  activeUsers: number;
  sessions: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  newUsers: number;
}

export interface SocialSource {
  source: string;
  sessions: number;
  users: number;
  engagementRate: number;
}

export interface TrafficData {
  date: string;
  pageviews: number;
  users: number;
}

// Google Analytics Data API endpoint
const GA_DATA_API = 'https://analyticsdata.googleapis.com/v1beta';

// Mock data for demonstration (replace with actual API calls in production)
export async function fetchGAMetrics(config: GAConfig): Promise<GAMetrics> {
  // In production, this would make actual API calls to Google Analytics
  // Using mock data for demonstration
  return {
    activeUsers: 12453,
    sessions: 28934,
    pageviews: 156789,
    bounceRate: 42.3,
    avgSessionDuration: 185, // in seconds
    newUsers: 8234,
  };
}

export async function fetchSocialSources(config: GAConfig): Promise<SocialSource[]> {
  // In production, this would query GA4 for traffic sources
  // Social media platforms tracked:
  return [
    { source: 'google', sessions: 12500, users: 9800, engagementRate: 68.5 },
    { source: 'direct', sessions: 8200, users: 7100, engagementRate: 72.3 },
    { source: 'facebook', sessions: 3450, users: 2890, engagementRate: 58.2 },
    { source: 'twitter', sessions: 2100, users: 1750, engagementRate: 61.4 },
    { source: 'instagram', sessions: 1890, users: 1620, engagementRate: 55.8 },
    { source: 'linkedin', sessions: 1240, users: 980, engagementRate: 71.2 },
    { source: 'youtube', sessions: 890, users: 720, engagementRate: 64.5 },
    { source: 'tiktok', sessions: 664, users: 590, engagementRate: 48.2 },
  ];
}

export async function fetchTrafficData(config: GAConfig, days: number = 7): Promise<TrafficData[]> {
  // Generate traffic data for the past N days
  const data: TrafficData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      pageviews: Math.floor(Math.random() * 20000) + 10000,
      users: Math.floor(Math.random() * 5000) + 2000,
    });
  }
  
  return data;
}

// Validate Google Analytics configuration
export function validateGAConfig(config: GAConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.propertyId || config.propertyId.trim() === '') {
    errors.push('Property ID is required');
  } else if (!/^\d+$/.test(config.propertyId)) {
    errors.push('Property ID must be a numeric string');
  }
  
  if (!config.credentials || config.credentials.trim() === '') {
    errors.push('Service account credentials are required');
  } else {
    try {
      JSON.parse(config.credentials);
    } catch {
      errors.push('Invalid JSON format for credentials');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get display name for social source
export function getSocialSourceDisplayName(source: string): string {
  const names: Record<string, string> = {
    google: '🔍 Google Search',
    direct: '🔗 Direct',
    facebook: '📘 Facebook',
    twitter: '🐦 Twitter/X',
    instagram: '📸 Instagram',
    linkedin: '💼 LinkedIn',
    youtube: '▶️ YouTube',
    tiktok: '🎵 TikTok',
    reddit: '🤖 Reddit',
    pinterest: '📌 Pinterest',
  };
  
  return names[source] || source;
}
