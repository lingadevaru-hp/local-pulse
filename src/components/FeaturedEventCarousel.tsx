
'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Event } from '@/types';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define a specific type for featured events if it differs, or reuse Event
const featuredEventsData: Event[] = [
  { id: 'feat1', name: 'Mysuru Dasara Celebrations', description: 'Grandeur of Mysuru Dasara, a 10-day festival of Karnataka\'s heritage.', city: 'Mysuru', date: '2024-10-03', time: '10:00', location: 'Mysore Palace', category: 'Culture', imageUrl: 'https://picsum.photos/seed/mysore-dasara/1200/300', rating: 4.9, organizer: 'Karnataka Tourism' },
  { id: 'feat2', name: 'Mangalore Food Festival', description: 'Savor authentic coastal cuisine and fresh seafood by the beach.', city: 'Mangaluru', date: '2025-05-20', time: '12:00', location: 'Kadri Park', category: 'Food', imageUrl: 'https://picsum.photos/seed/mangalore-food/1200/300', rating: 4.7, organizer: 'DK Chefs Guild' },
  { id: 'feat3', name: 'Bengaluru Tech Summit 2025', description: 'Asia\'s largest tech event focusing on innovation and startups.', city: 'Bengaluru', date: '2025-11-15', time: '09:00', location: 'BIEC', category: 'Tech', imageUrl: 'https://picsum.photos/seed/bengaluru-tech/1200/300', rating: 4.8, organizer: 'Govt. of Karnataka' },
  { id: 'feat4', name: 'Kannada Folk Music Night', description: 'Experience the soulful melodies of Karnataka’s folk traditions.', city: 'Bengaluru', date: '2025-06-05', time: '19:00', location: 'Ravindra Kalakshetra', category: 'Music', imageUrl: 'https://picsum.photos/seed/kannada-folk/1200/300', rating: 4.8, organizer: 'Karnataka Arts Council' },
  { id: 'feat5', name: 'Karnataka State Cricket Tournament', description: 'Cheer for your favorite teams in this thrilling cricket tournament.', city: 'Bengaluru', date: '2025-07-10', time: '10:00', location: 'M. Chinnaswamy Stadium', category: 'Sports', imageUrl: 'https://picsum.photos/seed/karnataka-cricket/1200/300', rating: 4.3, organizer: 'KSCA' },
  { id: 'feat6', name: 'Mysuru Art Exhibition', description: 'Discover stunning artworks by local and regional artists.', city: 'Mysuru', date: '2025-08-01', time: '11:00', location: 'Mysuru Art Gallery', category: 'Art', imageUrl: 'https://picsum.photos/seed/mysuru-art/1200/300', rating: 4.4, organizer: 'Mysore Arts Foundation' },
  { id: 'feat7', name: 'Bengaluru Literature Festival', description: 'Celebrate literature with authors, poets, and book lovers.', city: 'Bengaluru', date: '2025-09-20', time: '09:00', location: 'Cubbon Park', category: 'Festival', imageUrl: 'https://picsum.photos/seed/bengaluru-litfest/1200/300', rating: 4.6, organizer: 'BLF Trust' },
];

interface FeaturedEventCarouselProps {
  events?: Event[]; // Optional prop, defaults to internal data
}

const FeaturedEventCarousel: FC<FeaturedEventCarouselProps> = ({ events = featuredEventsData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  }, [events.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, [events.length, handleNext]);

  if (!events || events.length === 0) {
    return ( // Skeleton or placeholder for loading state
        <div className="mb-6 md:mb-8">
            <div className="glass-effect rounded-2xl overflow-hidden shadow-xl animate-pulse">
                <div className="relative w-full aspect-[16/7] sm:aspect-[16/5] md:aspect-[21/6] lg:aspect-[21/5] bg-muted"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <div className="h-6 bg-muted-foreground/30 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-muted-foreground/30 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    );
  }

  const currentEvent = events[currentIndex];
  const aiHint = `${currentEvent.category || 'event'} ${currentEvent.city || 'city'}`.toLowerCase();


  return (
    <section aria-labelledby="featured-events-heading" className="mb-6 md:mb-8">
       <h2 id="featured-events-heading" className="sr-only">Featured Events</h2>
      <div className="relative glass-effect rounded-2xl overflow-hidden shadow-xl">
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/5] md:aspect-[21/6] lg:aspect-[21/5]"> {/* Adjusted aspect ratio */}
          {events.map((event, index) => (
            <Image
              key={event.id}
              src={event.imageUrl || `https://picsum.photos/seed/${event.id}/1200/300`}
              alt={event.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
              className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
              priority={index === 0} 
              data-ai-hint={aiHint}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white"> {/* Reduced padding for smaller banner */}
          <h3 className="text-lg md:text-2xl font-bold mb-1 drop-shadow-lg truncate">
            {currentEvent.name}
          </h3>
          <p className="text-xs md:text-sm mb-1.5 line-clamp-2 drop-shadow-md">
            {currentEvent.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2 mb-2 text-xs">
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-3 w-3 md:h-3.5 md:w-3.5" />
              <span>{new Date(currentEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {currentEvent.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-3 w-3 md:h-3.5 md:w-3.5" />
              <span>{currentEvent.location}, {currentEvent.city}</span>
            </div>
          </div>
          <Button 
            size="sm" // Smaller button
            variant="default"
            className="bg-primary/80 hover:bg-primary text-primary-foreground backdrop-blur-sm border border-primary-foreground/20 rounded-lg shadow-lg hover:scale-105 transition-transform text-xs h-8 px-4"
            onClick={() => alert(`Learn more about ${currentEvent.name}`)} // Placeholder action
            aria-label={`Learn more about ${currentEvent.name}`}
          >
            Learn More
          </Button>
        </div>

        {events.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white w-7 h-7 md:w-9 md:h-9" // Smaller nav buttons
              onClick={handlePrev}
              aria-label="Previous featured event"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white w-7 h-7 md:w-9 md:h-9" // Smaller nav buttons
              onClick={handleNext}
              aria-label="Next featured event"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-1"> {/* Smaller dots */}
              {events.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to featured event ${index + 1}`}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all", // Smaller dots
                    currentIndex === index ? "bg-white w-3 md:w-4" : "bg-white/50 hover:bg-white/75"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedEventCarousel;
