
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
  city: string; 
  date: string; 
  time: string; 
  location: string; 
  category: string;
  imageUrl?: string;
  rating?: number;
  organizer?: string;
  price?: string; 
  ageGroup?: string; 
  mapUrl?: string; 
  registrationLink?: string;
  comments?: Comment[];
  duration?: string; // e.g., "2 hours", "All day"
  accessibilityInfo?: string; // e.g., "Wheelchair accessible"
  contactEmail?: string; // e.g., "info@example.com"
}

export interface City {
  id: string;
  name: string;
}
