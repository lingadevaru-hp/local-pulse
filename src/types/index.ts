
export interface Event {
  id: string;
  name: string;
  description: string;
  city: string; // city id, maps to City type
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string; // Venue name or address
  category: string;
  imageUrl?: string;
  rating?: number;
  organizer?: string; // Made optional as some mock data might not have it
}

export interface City {
  id: string;
  name: string;
}
