
'use client';

import type { FC} from 'react';
import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import type { Event } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from './ui/button';
import { MapPin, WifiOff } from 'lucide-react';

const mockNearbyEventsData: Event[] = [
    { id: 'nearby1', name: 'Local Market Fair', description: 'Fresh produce and local crafts.', city: 'Bengaluru', date: '2025-07-15', time: '10:00', location: 'Nearby Market', category: 'Community', imageUrl: 'https://picsum.photos/seed/localmarket/400/225', rating: 4.2, price: "Free", ageGroup: "All Ages", mapUrl:"#", registrationLink: "#", comments: [] },
    { id: 'nearby2', name: 'Street Food Carnival', description: 'Taste the best street food in town.', city: 'Bengaluru', date: '2025-07-16', time: '14:00', location: 'Nearby Street', category: 'Food', imageUrl: 'https://picsum.photos/seed/streetfood/400/225', rating: 4.5, price: "₹100", ageGroup: "All Ages", mapUrl:"#", registrationLink: "#", comments: [] },
    { id: 'nearby3', name: 'Evening Park Yoga', description: 'Relax and rejuvenate with an outdoor yoga session.', city: 'Bengaluru', date: '2025-07-17', time: '18:00', location: 'Community Park', category: 'Wellness', imageUrl: 'https://picsum.photos/seed/parkyoga/400/225', rating: 4.0, price: "Free", ageGroup: "All Ages", mapUrl:"#", registrationLink: "#", comments: [] },
];

interface NearbyEventsSectionProps {
  onEventClick: (eventId: string) => void;
}

const NearbyEventsSection: FC<NearbyEventsSectionProps> = ({ onEventClick }) => {
  const [locationState, setLocationState] = useState<'prompt' | 'detecting' | 'detected' | 'denied' | 'error' | 'notsupported'>('prompt');
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);


  const fetchNearbyEvents = async (latitude: number, longitude: number) => {
    console.log(`Fetching events near: Lat: ${latitude}, Lon: ${longitude}`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setNearbyEvents(mockNearbyEventsData);
    setLocationState('detected');
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationState('notsupported');
      return;
    }
    setLocationState('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        fetchNearbyEvents(latitude, longitude);
      },
      (err) => {
        console.error("Error getting location:", err);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationState('denied');
        } else {
          setLocationState('error');
        }
      }
    );
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation && typeof navigator.permissions?.query === 'function') {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          handleDetectLocation();
        } else if (permissionStatus.state === 'denied') {
          setLocationState('denied');
        }
      });
    } else if (typeof window !== 'undefined' && !navigator.geolocation) {
        setLocationState('notsupported');
    }
  }, []);


  const renderContent = () => {
    switch (locationState) {
      case 'prompt':
        return (
          <div className="text-center glass-effect rounded-2xl p-6">
            <p className="text-muted-foreground mb-3">Enable location to discover events near you!</p>
            <Button 
              onClick={handleDetectLocation} 
              aria-label="Enable location to find nearby events"
              className="rounded-full"
            >
              <MapPin className="mr-2 h-4 w-4" /> Enable Location
            </Button>
          </div>
        );
      case 'detecting':
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="rounded-2xl border border-border/30 bg-card/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-lg overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-3"><Skeleton className="h-6 w-3/4 rounded" /><Skeleton className="h-4 w-full rounded" /></div>
                    </div>
                ))}
            </div>
        );
      case 'denied':
        return (
          <div className="text-center glass-effect rounded-2xl p-6">
            <WifiOff className="h-12 w-12 text-destructive mx-auto mb-3" />
            <p className="text-destructive-foreground mb-2">Location access denied.</p>
            <p className="text-sm text-muted-foreground">Please enable location permissions in your browser settings to see nearby events.</p>
          </div>
        );
      case 'error':
      case 'notsupported':
        return (
          <div className="text-center glass-effect rounded-2xl p-6">
             <WifiOff className="h-12 w-12 text-destructive mx-auto mb-3" />
            <p className="text-destructive-foreground mb-2">Could not retrieve location.</p>
            <p className="text-sm text-muted-foreground">
              {locationState === 'notsupported' ? 'Geolocation is not supported by your browser.' : 'There was an error determining your location.'}
            </p>
          </div>
        );
      case 'detected':
        if (nearbyEvents.length === 0) {
          return <p className="text-center text-muted-foreground">No nearby events found for your location.</p>;
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {nearbyEvents.map(event => <EventCard key={event.id} event={event} onClick={onEventClick} />)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section aria-labelledby="nearby-events-heading" className="mb-6 md:mb-8">
      <h2 id="nearby-events-heading" className="text-xl font-semibold mb-4">
        Nearby Events
      </h2>
      {renderContent()}
    </section>
  );
};

export default NearbyEventsSection;
