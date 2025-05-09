'use client';

import type { FC } from 'react';
import EventCard from './EventCard';
import type { Event } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";
import { Ghost } from 'lucide-react';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
}

const EventList: FC<EventListProps> = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl shadow-sm">
        <Ghost className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No Events Found</h3>
        <p className="text-muted-foreground">Try adjusting your search or city selection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

const CardSkeleton: FC = () => (
  <div className="rounded-xl border bg-card text-card-foreground shadow-lg">
    <Skeleton className="h-48 md:h-56 w-full rounded-t-xl" />
    <div className="p-4 md:p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
    <div className="p-4 md:p-6 bg-secondary/30 rounded-b-xl">
      <Skeleton className="h-6 w-1/4" />
    </div>
  </div>
);


export default EventList;
