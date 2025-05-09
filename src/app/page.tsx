
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import SearchBar from '@/components/SearchBar';
import EventList from '@/components/EventList';
import type { Event, City } from '@/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';
import { useToast } from "@/hooks/use-toast";
import FeaturedEventCarousel from '@/components/FeaturedEventCarousel';
import CategoryChips from '@/components/CategoryChips';
import NearbyEventsSection from '@/components/NearbyEventsSection';
import AppFooter from '@/components/AppFooter';
import { Skeleton } from '@/components/ui/skeleton';


const LOCAL_STORAGE_CITY_KEY = 'localPulseSelectedCityKarnataka'; 

const mockCities: City[] = [
  { id: 'bengaluru', name: 'Bengaluru' },
  { id: 'mysuru', name: 'Mysuru' },
  { id: 'mangaluru', name: 'Mangaluru' },
  { id: 'hubballi', name: 'Hubballi-Dharwad' },
  { id: 'belagavi', name: 'Belagavi' },
];

// Enhanced mock events for Karnataka with diverse categories
// Including featured, trending, and more events
const allMockEvents: Event[] = [
  // Featured (first 3 are used in carousel by default if not overridden)
  { id: 'feat1', name: 'Mysuru Dasara Celebrations', description: 'Experience the grandeur of Mysuru Dasara, a 10-day festival showcasing Karnataka\'s rich heritage.', city: 'mysuru', date: '2024-10-03', time: '10:00', location: 'Mysore Palace', category: 'Culture', organizer: 'Karnataka Tourism', imageUrl: 'https://picsum.photos/seed/mysurudasara/1200/400', rating: 4.9 },
  { id: 'feat2', name: 'Mangaluru Coastal Food Fest', description: 'Savor authentic coastal cuisine, fresh seafood, and vibrant cultural performances by the beach.', city: 'mangaluru', date: '2025-05-20', time: '12:00', location: 'Panambur Beach', category: 'Food', organizer: 'DK Chefs Guild', imageUrl: 'https://picsum.photos/seed/mangaluru_food_fest/1200/400', rating: 4.7 },
  { id: 'feat3', name: 'Bengaluru Tech Summit 2025', description: 'Asia\'s largest tech event focusing on innovation, startups, and future technologies.', city: 'bengaluru', date: '2025-11-15', time: '09:00', location: 'BIEC', category: 'Tech', organizer: 'Govt. of Karnataka', imageUrl: 'https://picsum.photos/seed/bengaluru_tech_summit/1200/400', rating: 4.8 },
  { id: 'feat4', name: 'Kannada Folk Music Night', description: 'An enchanting evening of soulful Kannada folk music and traditional dance performances.', city: 'bengaluru', date: '2025-06-05', time: '19:00', location: 'Ravindra Kalakshetra', category: 'Music', organizer: 'Karnataka Arts Council', imageUrl: 'https://picsum.photos/seed/kannada-folk-night/1200/400', rating: 4.8 },
  { id: 'feat5', name: 'Karnataka State Cricket Tournament', description: 'The thrilling finale of the state\'s premier T20 cricket tournament.', city: 'bengaluru', date: '2025-07-10', time: '18:30', location: 'M. Chinnaswamy Stadium', category: 'Sports', organizer: 'KSCA', imageUrl: 'https://picsum.photos/seed/karnataka-cricket-league/1200/400', rating: 4.3 },
  { id: 'feat6', name: 'Mysuru Art Exhibition', description: 'Discover works from emerging and established artists from across Karnataka.', city: 'mysuru', date: '2025-08-01', time: '11:00', location: 'Mysuru Art Gallery', category: 'Art', organizer: 'Mysore Arts Foundation', imageUrl: 'https://picsum.photos/seed/mysuru-art-fair/1200/400', rating: 4.4 },
  { id: 'feat7', name: 'Bengaluru Literature Festival', description: 'Celebrate literature with authors, poets, and book lovers in the Garden City.', city: 'bengaluru', date: '2025-09-20', time: '09:00', location: 'Cubbon Park', category: 'Festival', organizer: 'BLF Trust', imageUrl: 'https://picsum.photos/seed/bengaluru-lit-fest/1200/400', rating: 4.6 },

  // Trending (can be a subset of allMockEvents or different ones)
  { id: 'trend1', name: 'Bengaluru Karaga Shaktyotsava', description: 'Witness the ancient tradition of Bengaluru Karaga, a vibrant night-long festival.', city: 'bengaluru', date: '2025-04-15', time: '20:00', location: 'Dharmaraya Swamy Temple', category: 'Festival', organizer: 'Karaga Committee', rating: 4.7 },
  { id: 'trend2', name: 'Hubballi Startup Conclave', description: 'A platform for North Karnataka startups to connect, learn, and grow.', city: 'hubballi', date: '2025-09-12', time: '10:00', location: 'Deshpande Foundation', category: 'Tech', organizer: 'TiE Hubli', rating: 4.2 },
  { id: 'trend3', name: 'Belagavi Kite Festival', description: 'A colourful spectacle as kites of all shapes and sizes fill the skies.', city: 'belagavi', date: '2026-01-14', time: '10:00', location: 'Nanawadi Grounds', category: 'Festival', organizer: 'Belagavi Tourism', rating: 4.1 },
  
  // More Events (remaining events)
  { id: 'more1', name: 'Udupi Yakshagana Performance', description: 'Traditional Yakshagana dance-drama from coastal Karnataka.', city: 'mangaluru', date: '2025-03-10', time: '19:00', location: 'Town Hall Udupi', category: 'Culture', rating: 4.6 },
  { id: 'more2', name: 'Hampi Utsav', description: 'A grand cultural extravaganza amidst the ruins of Hampi.', city: 'hubballi', date: '2025-11-01', time: '17:00', location: 'Hampi (near Hubballi)', category: 'Festival', rating: 4.9 },
  { id: 'more3', name: 'Chitradurga Fort Sound and Light Show', description: 'Experience the history of Chitradurga Fort with a captivating show.', city: 'mysuru', date: '2025-02-20', time: '19:30', location: 'Chitradurga Fort (day trip from Mysuru)', category: 'Culture', rating: 4.3 },
];


const allEventCategories = [...new Set(allMockEvents.map(event => event.category))].sort();

const Home: FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null); // e.g., 'today', 'this_week'
  const [ratingFilter, setRatingFilter] = useState<string | null>(null); // e.g., '4' for 4+ stars

  const [isLoading, setIsLoading] = useState<boolean>(true); // Combined loading state
  const { toast } = useToast();

  useEffect(() => {
    const storedCity = getFromLocalStorage(LOCAL_STORAGE_CITY_KEY);
    if (storedCity && mockCities.some(c => c.id === storedCity)) {
      setSelectedCityId(storedCity);
    } else if (mockCities.length > 0) {
      setSelectedCityId(mockCities[0].id); 
    }
    // Simulate initial data load
    setTimeout(() => setIsLoading(false), 700); 
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
    setCategoryFilter(category); // Sync chip selection with dropdown filter
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsLoading(true);
    // This toast shows what filters are being applied
    const filters = [
      searchQuery ? `query "${searchQuery}"` : null,
      selectedCityId ? `in ${mockCities.find(c => c.id === selectedCityId)?.name}` : null,
      categoryFilter ? `category ${categoryFilter}` : null,
      dateFilter ? `date ${dateFilter.replace('_', ' ')}` : null,
      ratingFilter ? `rating ${ratingFilter}+ stars` : null,
    ].filter(Boolean).join(', ');

    toast({ 
      title: "Applying Filters", 
      description: filters ? `Searching with: ${filters}` : "Showing all events" 
    });
    
    setTimeout(() => setIsLoading(false), 500); // Simulate filtering
  }, [searchQuery, selectedCityId, categoryFilter, dateFilter, ratingFilter, toast]);
  
  const handleDetectLocation = useCallback(() => {
    // This function is now primarily handled by NearbyEventsSection
    // but can be used to set the city filter if desired.
    toast({ title: "Location Detection", description: "Nearby events section will attempt to use your location."});
    if (!selectedCityId && mockCities.find(c => c.id === 'bengaluru')) {
       // handleCityFilterChange('bengaluru'); // Optionally set a default city
    }
  }, [selectedCityId, handleCityFilterChange, toast]);
  
  const featuredEventsForCarousel = useMemo(() => allMockEvents.slice(0, 7), []);
  
  const filteredAndSortedEvents = useMemo(() => {
    return allMockEvents.filter(event => {
      const cityMatch = !selectedCityId || event.city === selectedCityId;
      const effectiveCategory = selectedCategoryChip || categoryFilter;
      const categoryMatch = !effectiveCategory || event.category.toLowerCase() === effectiveCategory.toLowerCase();
      
      const queryMatch = searchQuery.trim() === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase()));

      const dateMatches = () => {
        if (!dateFilter || dateFilter === 'all') return true;
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0,0,0,0); 

        if (dateFilter === 'today') return eventDate.toDateString() === today.toDateString();
        if (dateFilter === 'this_week') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        }
        if (dateFilter === 'this_month') {
          return eventDate.getFullYear() === today.getFullYear() && eventDate.getMonth() === today.getMonth();
        }
        return true;
      };

      const ratingMatches = () => {
        if (!ratingFilter || ratingFilter === 'all') return true;
        const minRating = parseInt(ratingFilter);
        return event.rating !== undefined && event.rating >= minRating;
      };
      
      return cityMatch && categoryMatch && queryMatch && dateMatches() && ratingMatches();
    });
  }, [selectedCityId, searchQuery, selectedCategoryChip, categoryFilter, dateFilter, ratingFilter]);

  // Split events for "Trending" and "More Events" sections from the filtered list
  const trendingEvents = useMemo(() => filteredAndSortedEvents.slice(0, 3), [filteredAndSortedEvents]);
  const moreEvents = useMemo(() => filteredAndSortedEvents.slice(3), [filteredAndSortedEvents]);


  if (isLoading && !searchQuery && !selectedCityId && !categoryFilter && !dateFilter && !ratingFilter) { // Show full page skeleton only on initial load
    return (
      <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8 space-y-6 md:space-y-8 max-w-6xl">
        <Skeleton className="h-[250px] md:h-[300px] w-full rounded-2xl glass-effect" />
        <Skeleton className="h-32 w-full rounded-2xl glass-effect" />
        <Skeleton className="h-12 w-full rounded-2xl glass-effect" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-2xl glass-effect" />)}
        </div>
         <AppFooter />
      </div>
    );
  }


  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8 space-y-6 md:space-y-8 max-w-6xl">
      
      <FeaturedEventCarousel events={featuredEventsForCarousel} />
      
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
      
      {trendingEvents.length > 0 && (
        <section aria-labelledby="trending-events-heading">
          <h2 id="trending-events-heading" className="text-xl font-semibold mb-4">
            Trending Events
          </h2>
          <EventList events={trendingEvents} isLoading={isLoading} />
        </section>
      )}

      {moreEvents.length > 0 && (
        <section aria-labelledby="more-events-heading">
          <h2 id="more-events-heading" className="text-xl font-semibold mb-4 mt-8">
            More Events
          </h2>
          <EventList events={moreEvents} isLoading={isLoading} />
        </section>
      )}

      {/* Show message if no events match filters and not initial loading */}
      {!isLoading && filteredAndSortedEvents.length === 0 && (searchQuery || selectedCityId || categoryFilter || dateFilter || ratingFilter) && (
         <div className="text-center py-10 glass-effect rounded-2xl">
            <p className="text-lg font-semibold">No events match your current filters.</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      
      <NearbyEventsSection />
      <AppFooter />
    </div>
  );
};

export default Home;
