

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
  price?: string; // e.g., "Free", "₹500", "₹200-₹1000"
  ageGroup?: string; // e.g., "All Ages", "18+", "21 and Above"
  mapUrl?: string; // Google Maps embed URL
  registrationLink?: string; // Link to registration page
  comments?: Comment[]; // Array of comments
}

export interface City {
  id: string;
  name: string;
}
