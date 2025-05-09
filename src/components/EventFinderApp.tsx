
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import CitySelector from './CitySelector';
import SearchBar from './SearchBar';
import EventList from './EventList';
import type { Event, City } from '@/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';
// import { handleGuessCategory } from '@/lib/actions'; // AI category guess UI removed for now
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_CITY_KEY = 'vibrateMenuxSelectedCity'; // Updated key

const mockCities: City[] = [
  { id: 'new-york', name: 'New York' },
  { id: 'london', name: 'London' },
  { id: 'paris', name: 'Paris' },
  { id: 'tokyo', name: 'Tokyo' },
  { id: 'berlin', name: 'Berlin' },
];

// Using only 3 mock events as requested for the mockup
const mockEvents: Event[] = [
  { id: '1', name: 'Summer Music Festival', description: 'An amazing outdoor music festival with top artists performing live. Enjoy the vibrant atmosphere and great music under the stars.', city: 'new-york', date: '2024-08-15', time: '14:00', location: 'Central Park Amphitheater', category: 'Music', organizer: 'NY Events Co.', imageUrl: 'https://picsum.photos/seed/musicfest/600/340', rating: 4.7 },
  { id: '2', name: 'Global Tech Summit 2024', description: 'The biggest tech conference of the year. Join us for innovative talks, workshops, and networking opportunities with industry leaders.', city: 'london', date: '2024-09-10', time: '09:00', location: 'ExCeL London', category: 'Tech', organizer: 'TechGlobal Ltd.', imageUrl: 'https://picsum.photos/seed/techconf/600/340', rating: 4.9 },
  { id: '3', name: 'Modern Art Showcase', description: 'Explore a stunning collection of modern art from renowned international and local artists. A visual treat for art enthusiasts.', city: 'paris', date: '2024-07-20', time: '10:00', location: 'Grand Palais Gallery', category: 'Art', organizer: 'Paris Art Society', rating: 4.3 },
  // { id: '4', name: 'Food Fair Tokyo', description: 'Taste the best of Japanese cuisine and international delights.', city: 'tokyo', date: '2024-08-05', time: '11:00', location: 'Yoyogi Park', category: 'Food', organizer: 'Tokyo Eats', imageUrl: 'https://picsum.photos/seed/foodfair/600/340' },
  // { id: '5', name: 'Berlin Marathon', description: 'Join thousands of runners in the scenic Berlin Marathon.', city: 'berlin', date: '2024-09-29', time: '09:00', location: 'Brandenburg Gate', category: 'Sports', organizer: 'Berlin Runs', rating: 4.9 },
];


const EventFinderApp: FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // const [guessedCategory, setGuessedCategory] = useState<string | null>(null); // UI for this removed
  // const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false); // UI for this removed
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedCity = getFromLocalStorage(LOCAL_STORAGE_CITY_KEY);
    if (storedCity && mockCities.some(c => c.id === storedCity)) {
      setSelectedCity(storedCity);
    } else if (mockCities.length > 0) {
      setSelectedCity(mockCities[0].id); 
    }
    // Simulate loading delay
    setTimeout(() => setIsLoadingEvents(false), 500);
  }, []);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCity(cityId);
    saveToLocalStorage(LOCAL_STORAGE_CITY_KEY, cityId);
    // setGuessedCategory(null); // No guessed category UI
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    // Search submission logic if any (e.g. calling an API)
    // For now, filtering is client-side based on searchQuery
    // AI category guess logic removed from direct UI interaction path here
    if (searchQuery.trim()) {
      toast({ title: "Search Initiated", description: `Looking for events related to "${searchQuery}".` });
    }
  }, [searchQuery, toast]);

  const filteredEvents = useMemo(() => {
    if (!selectedCity) return [];
    setIsLoadingEvents(true); // Show loading state during filtering
    const events = mockEvents.filter(event => {
      const cityMatch = event.city === selectedCity;
      const queryMatch = searchQuery.trim() === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());
      return cityMatch && queryMatch;
    });
    // Simulate loading delay for filtering
    setTimeout(() => setIsLoadingEvents(false), 300);
    return events;
  }, [selectedCity, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      {/* Control Panel: Search, City Selection, Filters */}
      <section 
        aria-labelledby="search-and-filter-heading"
        className="p-4 sm:p-6 bg-background/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-border/30"
      >
        <h2 id="search-and-filter-heading" className="sr-only">Search and Filter Events</h2>
        <div className="space-y-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            // isLoadingCategory={isLoadingCategory} // Removed
          />
          <CitySelector
            cities={mockCities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            disabled={isLoadingEvents}
          />
          {/* Placeholder for filter icons/buttons if added directly here */}
        </div>
      </section>
      
      <EventList events={filteredEvents} isLoading={isLoadingEvents} />
    </div>
  );
};

export default EventFinderApp;

