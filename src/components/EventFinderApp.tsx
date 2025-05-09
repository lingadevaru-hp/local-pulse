
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC } from 'react';
// CitySelector is now part of FilterModal
import SearchBar from './SearchBar';
import EventList from './EventList';
import type { Event, City } from '@/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';
import { useToast } from "@/hooks/use-toast";
import FeaturedEventBanner from './FeaturedEventBanner';
import CategoryChips from './CategoryChips';
import FilterModal from './FilterModal'; // New import

const LOCAL_STORAGE_CITY_KEY = 'vibrateMenuxSelectedCityKarnataka';

const mockCities: City[] = [
  { id: 'bengaluru', name: 'Bengaluru' },
  { id: 'mysuru', name: 'Mysuru' },
  { id: 'mangaluru', name: 'Mangaluru' },
  { id: 'hubballi', name: 'Hubballi-Dharwad' },
  { id: 'belagavi', name: 'Belagavi' },
];

const mockEvents: Event[] = [
  { id: '1', name: 'Mysuru Dasara Celebrations', description: 'Experience the grandeur of Mysuru Dasara, a 10-day festival with majestic processions, cultural events, and exhibitions showcasing Karnataka\'s rich heritage.', city: 'mysuru', date: '2024-10-03', time: '10:00', location: 'Mysore Palace & Bannimantap Grounds', category: 'Culture', organizer: 'Karnataka Tourism Dept.', imageUrl: 'https://picsum.photos/seed/mysurudasara/600/340', rating: 4.9 },
  { id: '2', name: 'Bengaluru Karaga Shaktyotsava', description: 'Witness the ancient tradition of Bengaluru Karaga, a vibrant night-long festival dedicated to Goddess Draupadi, celebrated with fervor in the heart of the city.', city: 'bengaluru', date: '2025-04-15', time: '20:00', location: 'Shri Dharmaraya Swamy Temple, Tigalarpet', category: 'Festival', organizer: 'Karaga Festival Committee', imageUrl: 'https://picsum.photos/seed/bengalukakaraga/600/340', rating: 4.7 },
  { id: '3', name: 'Mangaluru Seafood & Coastal Food Festival', description: 'Indulge in an array of fresh coastal delicacies, traditional Mangalorean cuisine, and vibrant cultural performances at Panambur Beach.', city: 'mangaluru', date: '2024-11-22', time: '12:00', location: 'Panambur Beach', category: 'Food', organizer: 'Coastal Chefs Association', imageUrl: 'https://picsum.photos/seed/mangalorefood/600/340', rating: 4.5 },
  { id: '4', name: 'Kannada Folk Music & Dance Night - Janapada Habba', description: 'Enjoy an enchanting evening of soulful Kannada folk music (Janapada Geete) and traditional dance performances by renowned artists from across Karnataka.', city: 'bengaluru', date: '2024-12-05', time: '18:30', location: 'Ravindra Kalakshetra, Bengaluru', category: 'Music', organizer: 'Karnataka Arts & Culture Council', imageUrl: 'https://picsum.photos/seed/kannadafolk/600/340', rating: 4.6 },
];

const allEventCategories = [...new Set(mockEvents.map(event => event.category))];

const EventFinderApp: FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedCity = getFromLocalStorage(LOCAL_STORAGE_CITY_KEY);
    if (storedCity && mockCities.some(c => c.id === storedCity)) {
      setSelectedCity(storedCity);
    } else if (mockCities.length > 0) {
      setSelectedCity(mockCities[0].id); 
    }
    setTimeout(() => setIsLoadingEvents(false), 500);
  }, []);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCity(cityId);
    saveToLocalStorage(LOCAL_STORAGE_CITY_KEY, cityId);
  }, []);

  const handleCategorySelect = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    if (searchQuery.trim()) {
      toast({ title: "Search Initiated", description: `Looking for events: "${searchQuery}".` });
    }
    // Actual search/filtering is done by filteredEvents memo
  }, [searchQuery, toast]);
  
  const handleDetectLocation = () => {
    // Placeholder for geolocation logic
    toast({ title: "Location Detection", description: "Geolocation feature coming soon!"});
    // Example: Try to set to Bengaluru if no city is selected
    if (!selectedCity && mockCities.find(c => c.id === 'bengaluru')) {
      handleCityChange('bengaluru');
    }
  };

  const handleOpenFilters = () => setIsFilterModalOpen(true);
  const handleCloseFilters = () => setIsFilterModalOpen(false);

  const featuredEvent = useMemo(() => mockEvents.find(event => event.id === '1'), []); // Mysuru Dasara as featured

  const filteredEvents = useMemo(() => {
    if (!selectedCity) return [];
    setIsLoadingEvents(true); 
    
    const events = mockEvents.filter(event => {
      const cityMatch = event.city === selectedCity;
      const categoryMatch = !selectedCategory || event.category === selectedCategory;
      const queryMatch = searchQuery.trim() === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());
      return cityMatch && categoryMatch && queryMatch;
    });
    
    setTimeout(() => setIsLoadingEvents(false), 300);
    return events;
  }, [selectedCity, searchQuery, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      {featuredEvent && <FeaturedEventBanner event={featuredEvent} />}
      
      <section 
        aria-labelledby="search-and-filter-heading"
        className="p-0" // Removed padding as SearchBar has its own styling
      >
        <h2 id="search-and-filter-heading" className="sr-only">Search and Filter Events</h2>
        <SearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onDetectLocation={handleDetectLocation}
          onOpenFilters={handleOpenFilters}
        />
      </section>

      <CategoryChips 
        categories={allEventCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      <EventList events={filteredEvents} isLoading={isLoadingEvents} />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilters}
        cities={mockCities}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        // Pass other filter states and handlers here
      />
    </div>
  );
};

export default EventFinderApp;
