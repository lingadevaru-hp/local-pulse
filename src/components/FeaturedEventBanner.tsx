
'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Event } from '@/types';
import { CalendarDays, MapPin, ChevronRight } from 'lucide-react';

interface FeaturedEventBannerProps {
  event: Event;
}

const FeaturedEventBanner: FC<FeaturedEventBannerProps> = ({ event }) => {
  return (
    <section aria-labelledby="featured-event-heading" className="mb-6 md:mb-8">
      <div className="relative group glass-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={event.imageUrl || `https://picsum.photos/seed/${event.id}/1200/514`}
            alt={event.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority // Mark as priority as it's likely LCP
            data-ai-hint={`${event.category} featured placeholder`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <h2 id="featured-event-heading" className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            {event.name}
          </h2>
          <p className="text-sm md:text-base mb-3 line-clamp-2 md:line-clamp-none drop-shadow-md">
            {event.description}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-4 text-xs md:text-sm">
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1.5 h-4 w-4" />
              <span>{event.location}, {event.city}</span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="bg-primary/80 hover:bg-primary text-primary-foreground backdrop-blur-sm border border-primary-foreground/20 rounded-xl shadow-lg group-hover:scale-105 transition-transform"
            onClick={() => alert(`Learn more about ${event.name}`)}
          >
            Learn More <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventBanner;
