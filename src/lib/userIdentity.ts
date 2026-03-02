/**
 * User Identity Configuration
 * 
 * This file stores the user's identity information including:
 * - Starting point (YouTube channel as source)
 * - Endpoint (Gmail inbox as return destination)
 * 
 * These URLs are used to authenticate and recognize the user address.
 */

// YouTube Channel - Starting point / Source
export const USER_YOUTUBE_CHANNEL = "https://www.youtube.com/channel/UCECRGdrsdIGHwZdbw6PJgdg";

// Gmail Inbox - Endpoint / Return destination
export const USER_EMAIL_INBOX = "https://mail.google.com/mail/u/0/#inbox/FMfcgzQfCDRsBzGQSVkvKQf";

// User identity information
export const USER_IDENTITY = {
  youtubeChannel: USER_YOUTUBE_CHANNEL,
  emailInbox: USER_EMAIL_INBOX,
  // These URLs are used as authentication endpoints
  authReturnUrl: USER_EMAIL_INBOX,
  viewDescriptionUrl: USER_YOUTUBE_CHANNEL,
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
