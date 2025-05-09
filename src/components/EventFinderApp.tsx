
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import SearchBar from './SearchBar';
import EventList from './EventList';
import type { Event, City } from '@/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';
import { useToast } from "@/hooks/use-toast";
import FeaturedEventCarousel from './FeaturedEventCarousel';
import CategoryChips from './CategoryChips';
import { Button } from './ui/button'; // For Nearby Events placeholder button

const LOCAL_STORAGE_CITY_KEY = 'localPulseSelectedCityKarnataka'; // Updated app name

const mockCities: City[] = [
  { id: 'bengaluru', name: 'Bengaluru' },
  { id: 'mysuru', name: 'Mysuru' },
  { id: 'mangaluru', name: 'Mangaluru' },
  { id: 'hubballi', name: 'Hubballi-Dharwad' },
  { id: 'belagavi', name: 'Belagavi' },
];

// Enhanced mock events for Karnataka with diverse categories
const mockEvents: Event[] = [
  // Featured & Trending
  { id: '1', name: 'Mysuru Dasara Celebrations', description: 'Experience the grandeur of Mysuru Dasara, a 10-day festival showcasing Karnataka\'s rich heritage.', city: 'mysuru', date: '2024-10-03', time: '10:00', location: 'Mysore Palace', category: 'Culture', organizer: 'Karnataka Tourism', imageUrl: 'https://picsum.photos/seed/mysurudasara/1200/400', rating: 4.9 },
  { id: '2', name: 'Mangaluru Coastal Food Fest', description: 'Savor authentic coastal cuisine, fresh seafood, and vibrant cultural performances by the beach.', city: 'mangaluru', date: '2025-05-20', time: '12:00', location: 'Panambur Beach', category: 'Food', organizer: 'DK Chefs Guild', imageUrl: 'https://picsum.photos/seed/mangaluru_food_fest/1200/400', rating: 4.7 },
  { id: '3', name: 'Bengaluru Tech Summit 2025', description: 'Asia\'s largest tech event focusing on innovation, startups, and future technologies.', city: 'bengaluru', date: '2025-11-15', time: '09:00', location: 'BIEC', category: 'Tech', organizer: 'Govt. of Karnataka', imageUrl: 'https://picsum.photos/seed/bengaluru_tech_summit/1200/400', rating: 4.8 },
  // Trending
  { id: '4', name: 'Bengaluru Karaga Shaktyotsava', description: 'Witness the ancient tradition of Bengaluru Karaga, a vibrant night-long festival.', city: 'bengaluru', date: '2025-04-15', time: '20:00', location: 'Dharmaraya Swamy Temple', category: 'Festival', organizer: 'Karaga Committee', rating: 4.7 },
  { id: '5', name: 'Kannada Folk Music Night - Janapada Sinchana', description: 'An enchanting evening of soulful Kannada folk music and traditional dance performances.', city: 'bengaluru', date: '2025-06-05', time: '19:00', location: 'Ravindra Kalakshetra', category: 'Music', organizer: 'Karnataka Arts Council', rating: 4.8 },
  // More Events
  { id: '6', name: 'Karnataka State Cricket League Finals', description: 'The thrilling finale of the state\'s premier T20 cricket tournament.', city: 'bengaluru', date: '2025-07-10', time: '18:30', location: 'M. Chinnaswamy Stadium', category: 'Sports', organizer: 'KSCA', rating: 4.3 },
  { id: '7', name: 'Mysuru Contemporary Art Fair', description: 'Discover works from emerging and established artists from across Karnataka.', city: 'mysuru', date: '2025-08-01', time: '11:00', location: 'Mysuru Art Gallery', category: 'Art', organizer: 'Mysore Arts Foundation', rating: 4.4 },
  { id: '8', name: 'Hubballi Startup Conclave', description: 'A platform for North Karnataka startups to connect, learn, and grow.', city: 'hubballi', date: '2025-09-12', time: '10:00', location: 'Deshpande Foundation', category: 'Tech', organizer: 'TiE Hubli', rating: 4.2 },
  { id: '9', name: 'Belagavi Kite Festival', description: 'A colourful spectacle as kites of all shapes and sizes fill the skies.', city: 'belagavi', date: '2026-01-14', time: '10:00', location: 'Nanawadi Grounds', category: 'Festival', organizer: 'Belagavi Tourism', rating: 4.1 },
];

const allEventCategories = [...new Set(mockEvents.map(event => event.category))].sort();

const EventFinderApp: FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null); // For location filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<string | null>(null); // For category chips
  
  // States for enhanced filters in SearchBar
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);

  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedCity = getFromLocalStorage(LOCAL_STORAGE_CITY_KEY);
    if (storedCity && mockCities.some(c => c.id === storedCity)) {
      setSelectedCityId(storedCity);
    } else if (mockCities.length > 0) {
      setSelectedCityId(mockCities[0].id); 
    }
    setTimeout(() => setIsLoadingEvents(false), 500);
  }, []);

  const handleCityFilterChange = useCallback((cityId: string | null) => {
    setSelectedCityId(cityId);
    if (cityId) {
      saveToLocalStorage(LOCAL_STORAGE_CITY_KEY, cityId);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_CITY_KEY);
    }
  }, []);

  const handleCategoryChipSelect = useCallback((category: string | null) => {
    setSelectedCategoryChip(category);
    // Optionally, also update the dropdown filter if they should be linked
    setCategoryFilter(category); 
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsLoadingEvents(true);
    // The filtering logic is in filteredEvents memo, this just triggers re-evaluation by state change
    // and shows a toast.
    let appliedFiltersDescription = "Searching events";
    if(searchQuery) appliedFiltersDescription += ` for "${searchQuery}"`;
    if(selectedCityId) appliedFiltersDescription += ` in ${mockCities.find(c=>c.id === selectedCityId)?.name}`;
    if(categoryFilter) appliedFiltersDescription += ` under ${categoryFilter}`;
    // Add more for date and rating if needed for toast
    
    toast({ title: "Filters Applied", description: appliedFiltersDescription });
    // Artificial delay to simulate loading
    setTimeout(() => setIsLoadingEvents(false), 300);
  }, [searchQuery, selectedCityId, categoryFilter, toast]);
  
  const handleDetectLocation = () => {
    toast({ title: "Location Detection", description: "Geolocation feature is illustrative."});
    // Example: Try to set to Bengaluru if no city is selected
    if (!selectedCityId && mockCities.find(c => c.id === 'bengaluru')) {
      handleCityFilterChange('bengaluru');
    }
  };
  
  const featuredEvents = useMemo(() => mockEvents.slice(0, 3), []);
  const trendingEvents = useMemo(() => mockEvents.slice(3, 6), []); // Example slice
  const moreEventsList = useMemo(() => mockEvents.slice(6), []); // Example slice

  const filteredEvents = useMemo(() => {
    // This combines all filters: search query, city, category chip, and dropdown filters
    return mockEvents.filter(event => {
      const cityMatch = !selectedCityId || event.city === selectedCityId;
      
      // Category matching: chip selection takes precedence, then dropdown
      const effectiveCategory = selectedCategoryChip || categoryFilter;
      const categoryMatch = !effectiveCategory || event.category === effectiveCategory;
      
      const queryMatch = searchQuery.trim() === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()));

      // TODO: Implement date filtering based on dateFilter state
      // Example: const dateFilterMatch = ... 

      // TODO: Implement rating filtering based on ratingFilter state
      // Example: const ratingFilterMatch = !ratingFilter || (event.rating && event.rating >= parseInt(ratingFilter));
      
      return cityMatch && categoryMatch && queryMatch; // && dateFilterMatch && ratingFilterMatch;
    });
  }, [selectedCityId, searchQuery, selectedCategoryChip, categoryFilter, dateFilter, ratingFilter]);


  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8 space-y-6 md:space-y-8 max-w-6xl"> {/* Constrain width */}
      
      <FeaturedEventCarousel events={featuredEvents} />
      
      <section aria-labelledby="search-events-heading">
        <h2 id="search-events-heading" className="sr-only">Search and Filter Events</h2>
        <SearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          
          selectedCategoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          availableCategories={allEventCategories}

          selectedDateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          
          selectedLocationFilter={selectedCityId}
          onLocationFilterChange={handleCityFilterChange}
          availableLocations={mockCities}

          selectedRatingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          
          onApplyFilters={handleApplyFilters}
          onDetectLocation={handleDetectLocation}
        />
      </section>

      <CategoryChips 
        categories={allEventCategories}
        selectedCategory={selectedCategoryChip}
        onCategorySelect={handleCategoryChipSelect}
      />
      
      <section aria-labelledby="trending-events-heading">
        <h2 id="trending-events-heading" className="text-xl font-semibold mb-4">
          Trending Events
        </h2>
        <EventList events={trendingEvents} isLoading={isLoadingEvents} />
      </section>

      <section aria-labelledby="more-events-heading">
         <h2 id="more-events-heading" className="text-xl font-semibold mb-4 mt-8">
          All Events
        </h2>
        {/* This list will show all events initially, then filtered results */}
        <EventList events={filteredEvents} isLoading={isLoadingEvents} />
      </section>

      <section aria-labelledby="nearby-events-heading" className="mt-8">
        <h2 id="nearby-events-heading" className="text-xl font-semibold mb-4">
          Nearby Events
        </h2>
        <div className="glass-effect rounded-2xl p-6 text-center">
          <p className="text-muted-foreground mb-3">Enable location to discover events near you!</p>
          <Button 
            onClick={handleDetectLocation} 
            aria-label="Enable location to find nearby events"
            className="rounded-full"
          >
            Enable Location
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EventFinderApp;
