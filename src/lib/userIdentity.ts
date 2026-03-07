/**
 * User Identity Configuration
 * 
 * This file stores the user's identity information including:
 * - Starting point (YouTube channel as source)
 * - Endpoint (Gmail inbox as return destination)
 * - Wallet addresses for receiving payments
 * 
 * These URLs are used to authenticate and recognize the user address.
 */

// YouTube Channel - Starting point / Source
export const USER_YOUTUBE_CHANNEL = "https://www.youtube.com/channel/UCECRGdrsdIGHwZdbw6PJgdg";

// Gmail Inbox - Endpoint / Return destination
export const USER_EMAIL_INBOX = "https://mail.google.com/mail/u/0/#inbox/FMfcgzQfCDRsBzGQSVkvKQf";

// Coinbase Home - Wallet provider homepage
export const USER_COINBASE_HOME = "https://www.coinbase.com/home";

// Manus AI - External AI Agent Platform
export const USER_MANUS_APP = "https://manus.im/app";

// Telegram - Community/Channel
export const USER_TELEGRAM = "https://t.me/PATHCoin@Path_Finder#.Ltd";

// User identity information
export const USER_IDENTITY = {
  youtubeChannel: USER_YOUTUBE_CHANNEL,
  emailInbox: USER_EMAIL_INBOX,
  // These URLs are used as authentication endpoints
  authReturnUrl: USER_EMAIL_INBOX,
  viewDescriptionUrl: USER_YOUTUBE_CHANNEL,
  // External tools and platforms
  manusApp: USER_MANUS_APP,
  telegram: USER_TELEGRAM,
  // Personal wallet addresses for receiving payments
  wallets: {
    coinbase: "", // TODO: Add your Coinbase wallet address (e.g., 0x... for ETH or bc1... for BTC)
    coinbaseHome: USER_COINBASE_HOME, // Coinbase homepage link
    phantom: "",   // TODO: Add your Phantom wallet address (Solana)
    paypal: "",   // TODO: Add your PayPal email
  },
} as const;

/**
 * Check if a given URL matches the user's identity
 * Used for authentication and recognition
 */
export function isUserAddress(url: string): boolean {
  return url === USER_YOUTUBE_CHANNEL || url === USER_EMAIL_INBOX;
}

/**
 * Get the return URL for authentication flow
 */
export function getReturnUrl(): string {
  return USER_EMAIL_INBOX;
}

/**
 * Get the view description URL (YouTube channel)
 */
export function getViewDescriptionUrl(): string {
  return USER_YOUTUBE_CHANNEL;
}

/**
 * Get user's Coinbase wallet address
 */
export function getCoinbaseWallet(): string {
  return USER_IDENTITY.wallets.coinbase;
}

/**
 * Get all wallet addresses
 */
export function getWalletAddresses() {
  return USER_IDENTITY.wallets;
}

/**
 * Get Manus AI app URL
 */
export function getManusAppUrl(): string {
  return USER_MANUS_APP;
}

/**
 * Get Telegram channel URL
 */
export function getTelegramUrl(): string {
  return USER_TELEGRAM;
}
