
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
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

// This list should ideally be fetched or managed centrally
export const allMockEvents: Event[] = [
  // Featured (first 7 are used in carousel by default if not overridden)
  { id: 'feat1', name: 'Mysuru Dasara Celebrations', description: 'Experience the grandeur of Mysuru Dasara, a 10-day festival showcasing Karnataka\'s rich heritage.', city: 'mysuru', date: '2024-10-03', time: '10:00', location: 'Mysore Palace', category: 'Culture', organizer: 'Karnataka Tourism', imageUrl: 'https://picsum.photos/seed/mysurudasara/1200/400', rating: 4.9, price: "Free", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.305678500188!2d76.65298781481616!3d12.300888991292539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7011c0dc4339%3A0x1ad793a6289a687c!2sMysore%20Palace!5e0!3m2!1sen!2sin!4v1620000000001", registrationLink: "#", comments: [{id: 'c1', userName: 'Ravi K.', rating: 5, text: 'Absolutely breathtaking! A must-see.', date: '2023-10-15T10:00:00Z'}] },
  { id: 'feat2', name: 'Mangaluru Coastal Food Fest', description: 'Savor authentic coastal cuisine, fresh seafood, and vibrant cultural performances by the beach.', city: 'mangaluru', date: '2025-05-20', time: '12:00', location: 'Panambur Beach', category: 'Food', organizer: 'DK Chefs Guild', imageUrl: 'https://picsum.photos/seed/mangaluru_food_fest/1200/400', rating: 4.7, price: "₹200", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.009231079427!2d74.8017893148167!3d12.906105890852295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35bb5b5ffffff%3A0x856a191c9e74e976!2sPanambur%20Beach!5e0!3m2!1sen!2sin!4v1620000000002", registrationLink: "#", comments: [] },
  { id: 'feat3', name: 'Bengaluru Tech Summit 2025', description: 'Asia\'s largest tech event focusing on innovation, startups, and future technologies.', city: 'bengaluru', date: '2025-11-15', time: '09:00', location: 'BIEC', category: 'Tech', organizer: 'Govt. of Karnataka', imageUrl: 'https://picsum.photos/seed/bengaluru_tech_summit/1200/400', rating: 4.8, price: "₹500", ageGroup: "18+", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.211868693664!2d77.465441!3d13.062614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f1b3e5c9b5d%3A0x4a2b5b8d1e5c9b5d!2sBIEC%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1620000000003", registrationLink: "#", comments: [{id: 'c2', userName: 'Priya S.', rating: 5, text: 'Great summit, very informative!', date: '2023-11-18T14:30:00Z'}] },
  { id: 'feat4', name: 'Kannada Folk Music Night', description: 'An enchanting evening of soulful Kannada folk music and traditional dance performances.', city: 'bengaluru', date: '2025-06-05', time: '19:00', location: 'Ravindra Kalakshetra', category: 'Music', organizer: 'Karnataka Arts Council', imageUrl: 'https://picsum.photos/seed/kannada-folk-night/1200/400', rating: 4.8, price: "₹300", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789012!2d77.596789!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sRavindra%20Kalakshetra!5e0!3m2!1sen!2sin!4v1620000000004", registrationLink: "#", comments: [] },
  { id: 'feat5', name: 'Karnataka State Cricket Tournament', description: 'The thrilling finale of the state\'s premier T20 cricket tournament.', city: 'bengaluru', date: '2025-07-10', time: '18:30', location: 'M. Chinnaswamy Stadium', category: 'Sports', organizer: 'KSCA', imageUrl: 'https://picsum.photos/seed/karnataka-cricket-league/1200/400', rating: 4.3, price: "₹200", ageGroup: "12+", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.234567890123!2d77.599789!3d12.978899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sM.%20Chinnaswamy%20Stadium!5e0!3m2!1sen!2sin!4v1620000000005", registrationLink: "#", comments: [] },
  { id: 'feat6', name: 'Mysuru Art Exhibition', description: 'Discover works from emerging and established artists from across Karnataka.', city: 'mysuru', date: '2025-08-01', time: '11:00', location: 'Mysuru Art Gallery', category: 'Art', organizer: 'Mysuru Art Society', imageUrl: 'https://picsum.photos/seed/mysuru-art-fair/1200/400', rating: 4.4, price: "₹100", ageGroup: "10+", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.567890123456!2d76.655789!3d12.305599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7011029b1e3f%3A0x5d2b5b8d1e5c9b5d!2sMysuru%20Art%20Gallery!5e0!3m2!1sen!2sin!4v1620000000006", registrationLink: "#", comments: [] },
  { id: 'feat7', name: 'Bengaluru Literature Festival', description: 'Celebrate literature with authors, poets, and book lovers in the Garden City.', city: 'bengaluru', date: '2025-09-20', time: '09:00', location: 'Cubbon Park', category: 'Festival', organizer: 'BLF Trust', imageUrl: 'https://picsum.photos/seed/bengaluru-lit-fest/1200/400', rating: 4.6, price: "Free", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.345678901234!2d77.595789!3d12.975599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sCubbon%20Park!5e0!3m2!1sen!2sin!4v1620000000007", registrationLink: "#", comments: [] },

  { id: 'trend1', name: 'Bengaluru Karaga Shaktyotsava', description: 'Witness the ancient tradition of Bengaluru Karaga, a vibrant night-long festival.', city: 'bengaluru', date: '2025-04-15', time: '20:00', location: 'Dharmaraya Swamy Temple', category: 'Festival', organizer: 'Karaga Committee', rating: 4.7, price: "Free", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.456789012345!2d77.590789!3d12.965599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sDharmaraya%20Swamy%20Temple!5e0!3m2!1sen!2sin!4v1620000000008", registrationLink: "#", comments: [] },
  { id: 'trend2', name: 'Hubballi Startup Conclave', description: 'A platform for North Karnataka startups to connect, learn, and grow.', city: 'hubballi', date: '2025-09-12', time: '10:00', location: 'Deshpande Foundation', category: 'Tech', organizer: 'TiE Hubli', rating: 4.2, price: "₹1000", ageGroup: "18+", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.037889914095!2d75.11998231484946!3d15.34787898924804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d61000000001%3A0x28a1d53a37a0a4b6!2sDeshpande%20Foundation!5e0!3m2!1sen!2sin!4v1620000000009", registrationLink: "#", comments: [] },
  { id: 'trend3', name: 'Belagavi Kite Festival', description: 'A colourful spectacle as kites of all shapes and sizes fill the skies.', city: 'belagavi', date: '2026-01-14', time: '10:00', location: 'Nanawadi Grounds', category: 'Festival', organizer: 'Belagavi Tourism', rating: 4.1, price: "Free", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.016714754712!2d74.5108103148543!3d15.844841989050988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf675000000001%3A0x6c0b3c7e1e0d6c5c!2sNanawadi%20Grounds!5e0!3m2!1sen!2sin!4v1620000000010", registrationLink: "#", comments: [] },
  
  { id: 'more1', name: 'Udupi Yakshagana Performance', description: 'Traditional Yakshagana dance-drama from coastal Karnataka.', city: 'mangaluru', date: '2025-03-10', time: '19:00', location: 'Town Hall Udupi', category: 'Culture', rating: 4.6, price: "₹150", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3884.533882956293!2d74.7478013148193!3d13.34472999071684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcbb6000000001%3A0x8f805a9e9e1e7a5e!2sUdupi%20Town%20Hall!5e0!3m2!1sen!2sin!4v1620000000011", registrationLink: "#", comments: [] },
  { id: 'more2', name: 'Hampi Utsav', description: 'A grand cultural extravaganza amidst the ruins of Hampi.', city: 'hubballi', date: '2025-11-01', time: '17:00', location: 'Hampi (near Hubballi)', category: 'Festival', rating: 4.9, price: "Free", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3848.32850097617!2d76.46070031484665!3d15.32986898936267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d6d000000001%3A0xb2e2a27e1f1b7a4a!2sHampi!5e0!3m2!1sen!2sin!4v1620000000012", registrationLink: "#", comments: [] },
  { id: 'more3', name: 'Chitradurga Fort Sound and Light Show', description: 'Experience the history of Chitradurga Fort with a captivating show.', city: 'mysuru', date: '2025-02-20', time: '19:30', location: 'Chitradurga Fort (day trip from Mysuru)', category: 'Culture', rating: 4.3, price: "₹50", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3870.553696626484!2d76.39603631482895!3d14.22355198999465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbaf10000000001%3A0x8c7c2c1e1c1d6a0a!2sChitradurga%20Fort!5e0!3m2!1sen!2sin!4v1620000000013", registrationLink: "#", comments: [] },
];


const allEventCategories = [...new Set(allMockEvents.map(event => event.category))].sort();

const Home: FC = () => {
  const router = useRouter();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestedQuery, setSuggestedQuery] = useState<string>('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { toast } = useToast();

  useEffect(() => {
    const storedCity = getFromLocalStorage(LOCAL_STORAGE_CITY_KEY);
    if (storedCity && mockCities.some(c => c.id === storedCity)) {
      setSelectedCityId(storedCity);
    } else if (mockCities.length > 0) {
      setSelectedCityId(mockCities[0].id);
    }
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
    setCategoryFilter(category); // Also apply to main filter
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsLoading(true);
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

    setTimeout(() => setIsLoading(false), 500);
  }, [searchQuery, selectedCityId, categoryFilter, dateFilter, ratingFilter, toast]);

  const handleDetectLocation = useCallback(() => {
    toast({ title: "Location Detection", description: "Nearby events section will attempt to use your location." });
    // Logic for NearbyEventsSection will handle actual detection
  }, [toast]);

  const featuredEventsForCarousel = useMemo(() => allMockEvents.slice(0, 7), []);

  const filteredAndSortedEvents = useMemo(() => {
    let eventsToFilter = allMockEvents;

    if (searchQuery.trim() !== '') {
       // For SearchBar, direct filtering is used. Autocomplete suggestions are handled separately in SearchBar.
       eventsToFilter = eventsToFilter.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return eventsToFilter.filter(event => {
      const cityMatch = !selectedCityId || event.city === selectedCityId;
      const effectiveCategory = selectedCategoryChip || categoryFilter;
      const categoryMatch = !effectiveCategory || event.category.toLowerCase() === effectiveCategory.toLowerCase();
      
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
      
      return cityMatch && categoryMatch && dateMatches() && ratingMatches();
    });
  }, [selectedCityId, searchQuery, selectedCategoryChip, categoryFilter, dateFilter, ratingFilter]);

  const trendingEvents = useMemo(() => filteredAndSortedEvents.slice(0, 3), [filteredAndSortedEvents]);
  const moreEvents = useMemo(() => filteredAndSortedEvents.slice(3), [filteredAndSortedEvents]);

  const handleEventCardClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };


  if (isLoading && !searchQuery && !selectedCityId && !categoryFilter && !dateFilter && !ratingFilter) {
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
      
      <FeaturedEventCarousel events={featuredEventsForCarousel} onEventClick={handleEventCardClick}/>
      
      <section aria-labelledby="search-events-heading">
        <h2 id="search-events-heading" className="sr-only">Search and Filter Events</h2>
        <SearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          suggestedQuery={suggestedQuery}
          onSuggestedQueryChange={setSuggestedQuery}
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
          allEvents={allMockEvents}
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
          <EventList events={trendingEvents} isLoading={isLoading} onEventClick={handleEventCardClick} />
        </section>
      )}

      {moreEvents.length > 0 && (
        <section aria-labelledby="more-events-heading">
          <h2 id="more-events-heading" className="text-xl font-semibold mb-4 mt-8">
            More Events
          </h2>
          <EventList events={moreEvents} isLoading={isLoading} onEventClick={handleEventCardClick} />
        </section>
      )}

      {!isLoading && filteredAndSortedEvents.length === 0 && (searchQuery || selectedCityId || categoryFilter || dateFilter || ratingFilter) && (
         <div className="text-center py-10 glass-effect rounded-2xl">
            <p className="text-lg font-semibold">No events match your current filters.</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      
      <NearbyEventsSection onEventClick={handleEventCardClick} />
      <AppFooter />
    </div>
  );
};

export default Home;
