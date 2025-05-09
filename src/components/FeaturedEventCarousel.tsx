
'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Event } from '@/types';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedEventCarouselProps {
  events: Event[];
}

const FeaturedEventCarousel: FC<FeaturedEventCarouselProps> = ({ events }) => {
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
    return null; // Or a placeholder skeleton
  }

  const currentEvent = events[currentIndex];

  return (
    <section aria-labelledby="featured-events-heading" className="mb-6 md:mb-8">
       <h2 id="featured-events-heading" className="sr-only">Featured Events</h2>
      <div className="relative glass-effect rounded-2xl overflow-hidden shadow-xl">
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[21/7] lg:aspect-[21/6]">
          {events.map((event, index) => (
            <Image
              key={event.id}
              src={event.imageUrl || `https://picsum.photos/seed/${event.id}/1200/400`}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
              priority={index === 0} // Mark first image as priority
              data-ai-hint={`${event.category || 'event'} placeholder`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <h3 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 drop-shadow-lg">
            {currentEvent.name}
          </h3>
          <p className="text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 drop-shadow-md">
            {currentEvent.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-3 mb-3 text-xs md:text-sm">
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{new Date(currentEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {currentEvent.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{currentEvent.location}, {currentEvent.city}</span>
            </div>
          </div>
          <Button 
            size="lg" 
            variant="default"
            className="bg-primary/80 hover:bg-primary text-primary-foreground backdrop-blur-sm border border-primary-foreground/20 rounded-xl shadow-lg hover:scale-105 transition-transform text-sm h-10 px-6"
            onClick={() => alert(`Learn more about ${currentEvent.name}`)}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white w-8 h-8 md:w-10 md:h-10"
              onClick={handlePrev}
              aria-label="Previous featured event"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 text-white w-8 h-8 md:w-10 md:h-10"
              onClick={handleNext}
              aria-label="Next featured event"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {events.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to featured event ${index + 1}`}
                  className={cn(
                    "h-1.5 w-1.5 md:h-2 md:w-2 rounded-full transition-all",
                    currentIndex === index ? "bg-white w-4 md:w-5" : "bg-white/50 hover:bg-white/75"
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
