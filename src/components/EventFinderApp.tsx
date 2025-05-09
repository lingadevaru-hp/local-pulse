'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import CitySelector from './CitySelector';
import SearchBar from './SearchBar';
import EventList from './EventList';
import type { Event, City } from '@/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';
import { handleGuessCategory } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_CITY_KEY = 'eventFinderSelectedCity';

const mockCities: City[] = [
  { id: 'new-york', name: 'New York' },
  { id: 'london', name: 'London' },
  { id: 'paris', name: 'Paris' },
  { id: 'tokyo', name: 'Tokyo' },
  { id: 'berlin', name: 'Berlin' },
];

const mockEvents: Event[] = [
  { id: '1', name: 'Summer Music Festival', description: 'An amazing outdoor music festival with top artists.', city: 'new-york', date: '2024-08-15', time: '14:00', location: 'Central Park', category: 'Music', organizer: 'NY Events Co.', imageUrl: 'https://picsum.photos/seed/musicfest/600/300', rating: 4.5 },
  { id: '2', name: 'Tech Conference 2024', description: 'The biggest tech conference of the year. Join us for innovative talks.', city: 'london', date: '2024-09-10', time: '09:00', location: 'ExCeL London', category: 'Tech', organizer: 'TechGlobal', imageUrl: 'https://picsum.photos/seed/techconf/600/300', rating: 4.8 },
  { id: '3', name: 'Art Exhibition: Modern Masters', description: 'Explore modern art from renowned artists.', city: 'paris', date: '2024-07-20', time: '10:00', location: 'Louvre Museum', category: 'Art', organizer: 'Paris Art Society', rating: 4.2 },
  { id: '4', name: 'Food Fair Tokyo', description: 'Taste the best of Japanese cuisine and international delights.', city: 'tokyo', date: '2024-08-05', time: '11:00', location: 'Yoyogi Park', category: 'Food', organizer: 'Tokyo Eats', imageUrl: 'https://picsum.photos/seed/foodfair/600/300' },
  { id: '5', name: 'Berlin Marathon', description: 'Join thousands of runners in the scenic Berlin Marathon.', city: 'berlin', date: '2024-09-29', time: '09:00', location: 'Brandenburg Gate', category: 'Sports', organizer: 'Berlin Runs', rating: 4.9 },
  { id: '6', name: 'Indie Film Screening', description: 'Discover new talent at our indie film screening night.', city: 'new-york', date: '2024-08-22', time: '19:00', location: 'Indie House Cinema', category: 'Film', organizer: 'NY Film Club', imageUrl: 'https://picsum.photos/seed/indiefilm/600/300' },
  { id: '7', name: 'Knitting Workshop', description: 'Learn to knit with experts. Materials provided.', city: 'london', date: '2024-07-28', time: '13:00', location: 'Crafty Corner', category: 'Workshop', organizer: 'London Crafts', rating: 4.0 },
  { id: '8', name: 'Jazz Night', description: 'Enjoy a relaxing evening with live jazz music.', city: 'paris', date: '2024-09-05', time: '20:00', location: 'Le Jazz Club', category: 'Music', organizer: 'Paris Music Scene' },
  { id: '9', name: 'Startup Pitch Event', description: 'Watch innovative startups pitch their ideas.', city: 'berlin', date: '2024-08-12', time: '18:00', location: 'Startup Hub Berlin', category: 'Business', organizer: 'Berlin Startups' },
  { id: '10', name: 'Charity Gala Dinner', description: 'A fundraising gala dinner for a good cause.', city: 'new-york', date: '2024-10-05', time: '19:30', location: 'The Grand Ballroom', category: 'Charity', organizer: 'NY Charities United', rating: 4.7 },
];


const EventFinderApp: FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [guessedCategory, setGuessedCategory] = useState<string | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true); // True initially
  const { toast } = useToast();

  useEffect(() => {
    const storedCity = getFromLocalStorage(LOCAL_STORAGE_CITY_KEY);
    if (storedCity && mockCities.some(c => c.id === storedCity)) {
      setSelectedCity(storedCity);
    } else if (mockCities.length > 0) {
      setSelectedCity(mockCities[0].id); // Default to first city if none stored or invalid
    }
    setIsLoadingEvents(false); // Done loading initial city/events
  }, []);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCity(cityId);
    saveToLocalStorage(LOCAL_STORAGE_CITY_KEY, cityId);
    setGuessedCategory(null); // Reset category when city changes
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    if (!searchQuery.trim()) {
      setGuessedCategory(null);
      return;
    }
    setIsLoadingCategory(true);
    try {
      const category = await handleGuessCategory(searchQuery);
      setGuessedCategory(category);
      if (category && category.toLowerCase().includes('error')) {
         toast({ title: "Category Suggestion", description: "Could not determine a category suggestion at this time.", variant: "destructive" });
      } else if (category) {
         toast({ title: "Category Suggestion", description: `We think this might be a '${category}' event.` });
      }
    } catch (error) {
      console.error("Failed to guess category:", error);
      setGuessedCategory("Error");
      toast({ title: "Error", description: "Failed to get category suggestion.", variant: "destructive" });
    } finally {
      setIsLoadingCategory(false);
    }
  }, [searchQuery, toast]);

  const filteredEvents = useMemo(() => {
    if (!selectedCity) return [];
    return mockEvents.filter(event => {
      const cityMatch = event.city === selectedCity;
      // Basic text search (can be improved)
      const queryMatch = searchQuery.trim() === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // If a category is guessed, filter by it too (optional, based on how strict the filtering should be)
      // const categoryMatch = !guessedCategory || event.category.toLowerCase() === guessedCategory.toLowerCase();

      return cityMatch && queryMatch; // && categoryMatch (if category filtering is desired)
    });
  }, [selectedCity, searchQuery, mockEvents]); // Removed guessedCategory from deps for now

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="p-6 bg-card rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Find Your Next Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <CitySelector
            cities={mockCities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            disabled={isLoadingEvents}
          />
          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            guessedCategory={guessedCategory}
            isLoadingCategory={isLoadingCategory}
          />
        </div>
      </div>
      
      <EventList events={filteredEvents} isLoading={isLoadingEvents} />
    </div>
  );
};

export default EventFinderApp;
