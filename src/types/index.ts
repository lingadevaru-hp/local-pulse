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
  organizer: string;
}

export interface City {
  id: string;
  name: string;
}
