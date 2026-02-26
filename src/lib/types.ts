// Location type for Google Business Profile API
// Documentation: https://developers.google.com/my-business/reference/businessinformation/rest/v1/locations

export interface Location {
  name: string;
  locationId: string;
  displayName: string;
  labels: {
    [key: string]: string;
  };
  metadata: {
    "@type": string;
    [key: string]: unknown;
  };
}
