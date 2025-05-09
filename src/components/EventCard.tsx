import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Event } from '@/types';
import { CalendarDays, MapPin, Tag, UserCircle } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 md:h-56">
          <Image
            src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/300`}
            alt={event.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${event.category} event`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-3">
        <CardTitle className="text-xl md:text-2xl font-semibold leading-tight">{event.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">{event.description}</CardDescription>
        
        <div className="space-y-2 pt-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}, {event.city}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Organized by: {event.organizer}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 md:p-6 bg-secondary/30 flex justify-between items-center">
        <Badge variant="outline" className="flex items-center py-1 px-2 rounded-md">
          <Tag className="mr-1.5 h-3 w-3" />
          {event.category}
        </Badge>
        {event.rating && (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < event.rating! ? 'text-primary' : 'text-muted-foreground/50'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.963c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.176 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.052 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            ))}
            <span className="ml-1.5 text-xs text-muted-foreground">({event.rating.toFixed(1)})</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
