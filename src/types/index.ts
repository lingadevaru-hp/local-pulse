
export interface Comment {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  text: string;
  date: string; // ISO date string
}

export interface Event {
  id: string;
  name: string;
  description: string;
  city: string; // General city for filtering
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  location: string; // Venue name or primary location display
  locationAddress?: string; // Detailed address for display, if different from venue name
  category: string;
  imageUrl?: string;
  rating?: number;
  organizer?: string; // Name of the organizer
  organizerId?: string; // Clerk User ID of the creator
  price?: string; 
  ageGroup?: string; 
  mapUrl?: string; // Google Maps Embed URL
  registrationLink?: string;
  comments?: Comment[];
  duration?: string; // e.g., "2 hours", "All day"
  accessibilityInfo?: string; // e.g., "Wheelchair accessible"
  contactEmail?: string; // Contact email for the event
}

export interface City {
  id: string;
  name: string;
}
