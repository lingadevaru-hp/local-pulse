
import type { FC } from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import type { Event } from '@/types';
import { CalendarDays, MapPin, Tag, UserCircle, Star as StarIcon } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  return (
    <div className="group glass-card rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/338`} // Adjusted height for 16:9
          alt={event.name}
          fill // Changed from layout="fill" to fill for Next 13+
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          data-ai-hint={`${event.category} event placeholder`}
        />
      </div>
      <div className="p-4 md:p-5 space-y-3">
        <h3 className="text-lg md:text-xl font-semibold leading-tight text-foreground truncate" title={event.name}>
          {event.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 h-[2.5em]"> {/* Fixed height for 2 lines */}
          {event.description}
        </p>
        
        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex items-center text-muted-foreground">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {event.time}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            <span>{event.location}, {event.city}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <UserCircle className="mr-1.5 h-3.5 w-3.5" />
            <span>Organized by: {event.organizer}</span>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-5 bg-white/30 dark:bg-black/30 border-t border-white/20 dark:border-black/20 flex justify-between items-center">
        <Badge variant="outline" className="flex items-center py-1 px-2.5 rounded-lg text-xs bg-primary/10 border-primary/30 text-primary">
          <Tag className="mr-1 h-3 w-3" />
          {event.category}
        </Badge>
        {event.rating && (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i} 
                className={`w-4 h-4 ${i < Math.round(event.rating!) ? 'text-yellow-400 dark:text-yellow-500' : 'text-muted-foreground/30'}`} 
                fill={i < Math.round(event.rating!) ? 'currentColor' : 'none'} 
              />
            ))}
            <span className="ml-1.5 text-xs text-muted-foreground">({event.rating.toFixed(1)})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;

