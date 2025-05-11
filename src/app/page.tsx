'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useClerk, type UserResource } from '@clerk/nextjs'; // Import UserResource
import SearchBar from '@/components/SearchBar';
import EventList from '@/components/EventList';
import type { Event, City, Comment } from '@/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';
import { useToast } from '@/hooks/use-toast';
import FeaturedEventCarousel from '@/components/FeaturedEventCarousel';
import CategoryChips from '@/components/CategoryChips';
import NearbyEventsSection from '@/components/NearbyEventsSection';
import AppFooter from '@/components/AppFooter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Share2, CalendarPlus, XCircle, Send, UserCircle as UserCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const LOCAL_STORAGE_CITY_KEY = 'localPulseSelectedCityKarnataka';
const PWA_PROMPT_DISMISSED_KEY = 'localPulsePwaPromptDismissed';

const mockCities: City[] = [
  { id: 'bengaluru', name: 'Bengaluru' },
  { id: 'mysuru', name: 'Mysuru' },
  { id: 'mangaluru', name: 'Mangaluru' },
  { id: 'hubballi', name: 'Hubballi-Dharwad' },
  { id: 'belagavi', name: 'Belagavi' },
];

// Export allMockEvents to be accessible by other modules (e.g., profile page)
export let allMockEvents: Event[] = [
  { id: 'feat1', name: 'Mysuru Dasara Celebrations', description: 'Experience the grandeur of Mysuru Dasara, a 10-day festival showcasing Karnataka\'s rich heritage.', city: 'mysuru', date: '2024-10-03', time: '10:00', location: 'Mysore Palace', category: 'Festival', organizer: 'Karnataka Tourism', imageUrl: 'https://picsum.photos/seed/mysurudasara/1200/400', rating: 4.9, price: "Free", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.305678500188!2d76.65298781481616!3d12.300888991292539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7011c0dc4339%3A0x1ad793a6289a687c!2sMysore%20Palace!5e0!3m2!1sen!2sin!4v1620000000001", registrationLink: "#", comments: [{id: 'c1', userName: 'Ravi K.', userImage: 'https://picsum.photos/seed/ravi/40/40', rating: 5, text: 'Absolutely breathtaking! A must-see.', date: '2023-10-15T10:00:00Z'}], duration: "10 days", accessibilityInfo: "Partially accessible", contactEmail: "info@mysuradasara.gov.in", organizerId: 'system' },
  { id: 'feat2', name: 'Mangaluru Coastal Food Fest', description: 'Savor authentic coastal cuisine, fresh seafood, and vibrant cultural performances by the beach.', city: 'mangaluru', date: '2025-05-20', time: '12:00', location: 'Panambur Beach', category: 'Food', organizer: 'DK Chefs Guild', imageUrl: 'https://picsum.photos/seed/mangaluru_food_fest/1200/400', rating: 4.7, price: "₹200 entry", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.009231079427!2d74.8017893148167!3d12.906105890852295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35bb5b5ffffff%3A0x856a191c9e74e976!2sPanambur%20Beach!5e0!3m2!1sen!2sin!4v1620000000002", registrationLink: "#", comments: [], duration: "3 days", accessibilityInfo: "Beach access, limited wheelchair support", contactEmail: "contact@dkchefs.org", organizerId: 'system' },
  { id: 'feat3', name: 'Bengaluru Tech Summit 2025', description: 'Asia\'s largest tech event focusing on innovation, startups, and future technologies.', city: 'bengaluru', date: '2025-11-15', time: '09:00', location: 'BIEC', category: 'Tech', organizer: 'Govt. of Karnataka', imageUrl: 'https://picsum.photos/seed/bengaluru_tech_summit/1200/400', rating: 4.8, price: "₹500 onwards", ageGroup: "18+", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.211868693664!2d77.465441!3d13.062614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f1b3e5c9b5d%3A0x4a2b5b8d1e5c9b5d!2sBIEC%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1620000000003", registrationLink: "#", comments: [{id: 'c2', userName: 'Priya S.', userImage: 'https://picsum.photos/seed/priya/40/40', rating: 5, text: 'Great summit, very informative!', date: '2023-11-18T14:30:00Z'}], duration: "3 days", accessibilityInfo: "Fully wheelchair accessible", contactEmail: "bts@karnataka.gov.in", organizerId: 'system' },
  { id: 'feat4', name: 'Kannada Folk Music Night', description: 'An enchanting evening of soulful Kannada folk music and traditional dance performances.', city: 'bengaluru', date: '2025-06-05', time: '19:00', location: 'Ravindra Kalakshetra', category: 'Music', organizer: 'Karnataka Arts Council', imageUrl: 'https://picsum.photos/seed/kannada-folk-night/1200/400', rating: 4.8, price: "₹300", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789012!2d77.596789!3d12.971599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sRavindra%20Kalakshetra!5e0!3m2!1sen!2sin!4v1620000000004", registrationLink: "#", comments: [], duration: "3 hours", accessibilityInfo: "Accessible", contactEmail: "info@karnatakaarts.org", organizerId: 'system' },
  { id: 'feat5', name: 'Karnataka State Cricket Tournament', description: 'The thrilling finale of the state\'s premier T20 cricket tournament.', city: 'bengaluru', date: '2025-07-10', time: '18:30', location: 'M. Chinnaswamy Stadium', category: 'Sports', organizer: 'KSCA', imageUrl: 'https://picsum.photos/seed/karnataka-cricket-league/1200/400', rating: 4.3, price: "₹200 onwards", ageGroup: "12+", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.234567890123!2d77.599789!3d12.978899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sM.%20Chinnaswamy%20Stadium!5e0!3m2!1sen!2sin!4v1620000000005", registrationLink: "#", comments: [], duration: "4 hours", accessibilityInfo: "Wheelchair ramps available", contactEmail: "tickets@ksca.co.in", organizerId: 'system' },
  { id: 'feat6', name: 'Mysuru Art Exhibition', description: 'Discover works from emerging and established artists from across Karnataka.', city: 'mysuru', date: '2025-08-01', time: '11:00', location: 'Mysuru Art Gallery', category: 'Art', organizer: 'Mysuru Art Society', imageUrl: 'https://picsum.photos/seed/mysuru-art-fair/1200/400', rating: 4.4, price: "₹100", ageGroup: "10+", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.567890123456!2d76.655789!3d12.305599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf7011029b1e3f%3A0x5d2b5b8d1e5c9b5d!2sMysuru%20Art%20Gallery!5e0!3m2!1sen!2sin!4v1620000000006", registrationLink: "#", comments: [], duration: "Full Day", accessibilityInfo: "Accessible venue", contactEmail: "gallery@mysuruart.org", organizerId: 'system' },
  { id: 'feat7', name: 'Bengaluru Literature Festival', description: 'Celebrate literature with authors, poets, and book lovers in the Garden City.', city: 'bengaluru', date: '2025-09-20', time: '09:00', location: 'Cubbon Park', category: 'Festival', organizer: 'BLF Trust', imageUrl: 'https://picsum.photos/seed/bengaluru-lit-fest/1200/400', rating: 4.6, price: "Free Entry, Workshops may be paid", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.345678901234!2d77.595789!3d12.975599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sCubbon%20Park!5e0!3m2!1sen!2sin!4v1620000000007", registrationLink: "#", comments: [], duration: "2 days", accessibilityInfo: "Park terrain, some accessible paths", contactEmail: "connect@blflitfest.com", organizerId: 'system' },
  { id: 'trend1', name: 'Bengaluru Karaga Shaktyotsava', description: 'Witness the ancient tradition of Bengaluru Karaga, a vibrant night-long festival.', city: 'bengaluru', date: '2025-04-15', time: '20:00', location: 'Dharmaraya Swamy Temple', category: 'Festival', organizer: 'Karaga Committee', rating: 4.7, price: "Free", ageGroup: "All Ages", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.456789012345!2d77.590789!3d12.965599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b4d6b3%3A0x5d2b5b8d1e5c9b5d!2sDharmaraya%20Swamy%20Temple!5e0!3m2!1sen!2sin!4v1620000000008", registrationLink: "#", comments: [], duration: "Overnight", accessibilityInfo: "Crowded, limited accessibility", contactEmail: "karaga@bengaluru.org", organizerId: 'system' },
];

const allEventCategories = [...new Set(allMockEvents.map(event => event.category))].sort();

const CreateEventForm: FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onEventCreate: (event: Event) => void; 
  currentUser: UserResource | null | undefined;
}> = ({ isOpen, onClose, onEventCreate, currentUser }) => {
  const initialEventState: Partial<Event> = { 
    city: 'bengaluru', 
    category: 'Music',
    organizer: currentUser?.fullName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || '',
    contactEmail: currentUser?.emailAddresses?.[0]?.emailAddress || ''
  };
  const [newEvent, setNewEvent] = useState<Partial<Event>>(initialEventState);
  const [dateTimeLocal, setDateTimeLocal] = useState('');

  useEffect(() => {
    if (currentUser) {
      setNewEvent(prev => ({
        ...prev,
        organizer: currentUser.fullName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || '',
        contactEmail: currentUser.emailAddresses?.[0]?.emailAddress || ''
      }));
    }
  }, [currentUser]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'dateTimeLocal') {
      setDateTimeLocal(value);
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [datePart, timePart] = dateTimeLocal.split('T');
    if (!newEvent.name || !newEvent.description || !datePart || !timePart || !newEvent.locationAddress || !newEvent.price || !newEvent.ageGroup || !newEvent.registrationLink || !newEvent.category) {
      alert("Please fill all required fields: Name, Description, Date & Time, Location Address, Price, Age Group, Registration URL, and Category.");
      return;
    }
    // Basic URL validation
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (newEvent.mapUrl && !urlPattern.test(newEvent.mapUrl)) {
        alert("Please enter a valid Google Maps URL.");
        return;
    }
    if (newEvent.registrationLink && !urlPattern.test(newEvent.registrationLink)) {
        alert("Please enter a valid Registration URL.");
        return;
    }

    const fullEvent: Event = {
      id: `evt-${Date.now().toString()}`, 
      rating: 0, 
      comments: [], 
      imageUrl: `https://picsum.photos/seed/event${Date.now()}/400/225`, 
      ...newEvent,
      date: datePart,
      time: timePart,
      organizerId: currentUser?.id || 'anonymous', // Store organizerId
      city: newEvent.city || 'bengaluru', // Default city if not set
      location: newEvent.locationAddress || 'To be announced', // Use locationAddress as primary location display
    } as Event; 
    onEventCreate(fullEvent);
    onClose();
    setNewEvent(initialEventState); 
    setDateTimeLocal('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details for your new event.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Event Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Event Name*</Label>
            <Input id="name" name="name" value={newEvent.name || ''} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description*</Label>
            <Textarea id="description" name="description" value={newEvent.description || ''} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Date & Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateTimeLocal" className="text-right">Date & Time*</Label>
            <Input id="dateTimeLocal" name="dateTimeLocal" type="datetime-local" value={dateTimeLocal} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Location Address */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="locationAddress" className="text-right">Location Address*</Label>
            <Input id="locationAddress" name="locationAddress" value={newEvent.locationAddress || ''} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Google Maps URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mapUrl" className="text-right">Google Maps URL</Label>
            <Input id="mapUrl" name="mapUrl" type="url" value={newEvent.mapUrl || ''} onChange={handleChange} className="col-span-3" placeholder="https://maps.google.com/?q=..." />
          </div>
          {/* Price */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price*</Label>
            <Input id="price" name="price" value={newEvent.price || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., Free, ₹200, or $25" required />
          </div>
          {/* Age Group */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ageGroup" className="text-right">Age Group*</Label>
            <Input id="ageGroup" name="ageGroup" value={newEvent.ageGroup || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., All Ages, 18+, Kids Only" required />
          </div>
          {/* Registration URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="registrationLink" className="text-right">Registration URL*</Label>
            <Input id="registrationLink" name="registrationLink" type="url" value={newEvent.registrationLink || ''} onChange={handleChange} className="col-span-3" placeholder="https://example.com/register" required />
          </div>
          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category*</Label>
             <Select name="category" value={newEvent.category || 'Music'} onValueChange={(value) => handleSelectChange('category', value)} required>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category"/>
                </SelectTrigger>
                <SelectContent>
                    {allEventCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
           {/* Organizer Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organizer" className="text-right">Organizer Name</Label>
            <Input id="organizer" name="organizer" value={newEvent.organizer || ''} onChange={handleChange} className="col-span-3" />
          </div>
          {/* Contact Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactEmail" className="text-right">Contact Email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" value={newEvent.contactEmail || ''} onChange={handleChange} className="col-span-3" />
          </div>
          {/* Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">Duration</Label>
            <Input id="duration" name="duration" value={newEvent.duration || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., 2 hours, All day" />
          </div>
          {/* Accessibility Info */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accessibilityInfo" className="text-right">Accessibility</Label>
            <Input id="accessibilityInfo" name="accessibilityInfo" value={newEvent.accessibilityInfo || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., Wheelchair accessible" />
          </div>
          {/* City (Optional, could be derived or a separate field if events span multiple cities not in dropdown) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">City*</Label>
            <Select name="city" value={newEvent.city || 'bengaluru'} onValueChange={(value) => handleSelectChange('city', value)} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {mockCities.map(city => <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Event</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const Home: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestedQuery, setSuggestedQuery] = useState<string>('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentReviewRating, setCurrentReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventsData, setEventsData] = useState<Event[]>([]); 

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const { toast } = useToast();

  const eventDetailsRef = useRef<HTMLDivElement>(null);

  // Initialize eventsData and listen for updates
  useEffect(() => {
    setEventsData([...allMockEvents]); // Initial load

    const handleEventsUpdated = () => {
      console.log('eventsUpdated custom event received');
      setEventsData([...allMockEvents]);
    };
    window.addEventListener('eventsUpdated', handleEventsUpdated);
    return () => window.removeEventListener('eventsUpdated', handleEventsUpdated);
  }, []);


  useEffect(() => {
    const storedCity = getFromLocalStorage(LOCAL_STORAGE_CITY_KEY);
    if (storedCity && mockCities.some(c => c.id === storedCity)) {
      setSelectedCityId(storedCity);
    } else if (mockCities.length > 0) {
      setSelectedCityId(mockCities[0].id);
    }
    setTimeout(() => setIsLoading(false), 700);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const dismissed = getFromLocalStorage(PWA_PROMPT_DISMISSED_KEY);
      if (dismissed !== 'true') {
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    
    // Handle ?createEvent=true query param from AppHeader
    if (searchParams.get('createEvent') === 'true') {
      if (user && isLoaded) {
        setShowCreateEventModal(true);
        // Remove the query parameter after handling
        const newPath = window.location.pathname;
        window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);

      } else if (isLoaded && !user) {
        openSignIn({ redirectUrl: `${window.location.pathname}?createEvent=trueAfterSignIn` });
      }
    } else if (searchParams.get('createEvent') === 'trueAfterSignIn' && user && isLoaded) {
      setShowCreateEventModal(true);
      const newPath = window.location.pathname;
      window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
    }


    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
  }, [isLoaded, user, openSignIn, searchParams]);

  const handleInstallPrompt = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
          saveToLocalStorage(PWA_PROMPT_DISMISSED_KEY, 'true'); 
        }
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      });
    }
  };
  
  const handleDismissInstallPrompt = () => {
    saveToLocalStorage(PWA_PROMPT_DISMISSED_KEY, 'true'); 
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

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
    setCategoryFilter(category); 
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsLoading(true);
    const filters = [
      searchQuery ? `query "${searchQuery}"` : null,
      selectedCityId ? `in ${mockCities.find(c => c.id === selectedCityId)?.name}` : null,
      categoryFilter ? `category ${categoryFilter}` : null,
      dateFilter ? `date ${dateFilter?.replace('_', ' ')}` : null,
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
  }, [toast]);

  const featuredEventsForCarousel = useMemo(() => eventsData.slice(0, 7), [eventsData]);

  const filteredAndSortedEvents = useMemo(() => {
    let eventsToFilter = eventsData;

    if (searchQuery.trim() !== '') {
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
  }, [selectedCityId, searchQuery, selectedCategoryChip, categoryFilter, dateFilter, ratingFilter, eventsData]);

  const trendingEvents = useMemo(() => filteredAndSortedEvents.slice(0, 3), [filteredAndSortedEvents]);
  const moreEvents = useMemo(() => filteredAndSortedEvents.slice(3), [filteredAndSortedEvents]);

  const handleEventCardClick = (eventId: string) => {
    const event = eventsData.find(e => e.id === eventId);
    setSelectedEvent(event || null);
    setCurrentReviewRating(0);
    setReviewText('');
    if (event) {
      setTimeout(() => {
        eventDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleCreateEvent = (newEventData: Event) => {
    // Update the global mutable array
    allMockEvents.unshift(newEventData); // Add to the beginning
    // Trigger state update in Home component
    setEventsData(prevEvents => [newEventData, ...prevEvents]);
    // Dispatch custom event for other components like profile page
    window.dispatchEvent(new CustomEvent('eventsUpdated'));
    toast({ title: "Event Created!", description: `${newEventData.name} has been added.` });
  };

  const handleReviewStarClick = (ratingValue: number) => {
    setCurrentReviewRating(ratingValue);
  };

  const handleSubmitReview = () => {
    if (!user || !selectedEvent) {
      toast({ title: "Authentication Required", description: "Please sign in to submit a review.", variant: "destructive" });
      openSignIn();
      return;
    }
    if (!reviewText.trim() || currentReviewRating === 0) {
      toast({ title: "Missing Information", description: "Please select a rating and write a review.", variant: "destructive" });
      return;
    }

    const newReview: Comment = {
      id: Date.now().toString(),
      userName: user.firstName || user.fullName || 'Anonymous User',
      userImage: user.imageUrl,
      rating: currentReviewRating,
      text: reviewText,
      date: new Date().toISOString(),
    };
    
    // Update the event in the global allMockEvents array
    const eventIndexGlobal = allMockEvents.findIndex(event => event.id === selectedEvent.id);
    if (eventIndexGlobal !== -1) {
      const updatedCommentsGlobal = [...(allMockEvents[eventIndexGlobal].comments || []), newReview];
      allMockEvents[eventIndexGlobal] = {
        ...allMockEvents[eventIndexGlobal],
        comments: updatedCommentsGlobal,
        rating: calculateNewAverageRating(allMockEvents[eventIndexGlobal].rating, updatedCommentsGlobal)
      };
    }
    
    // Update eventsData state for local re-render
    setEventsData(prevEventsData => prevEventsData.map(event => {
      if (event.id === selectedEvent.id) {
        const updatedComments = [...(event.comments || []), newReview];
        return { ...event, comments: updatedComments, rating: calculateNewAverageRating(event.rating, updatedComments) };
      }
      return event;
    }));

    // Update selectedEvent state for immediate UI update in details view
    setSelectedEvent(prevSelected => prevSelected ? {
        ...prevSelected, 
        comments: [...(prevSelected.comments || []), newReview], 
        rating: calculateNewAverageRating(prevSelected.rating, [...(prevSelected.comments || []), newReview])
      } : null);
    
    setReviewText('');
    setCurrentReviewRating(0);
    toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
    window.dispatchEvent(new CustomEvent('eventsUpdated')); // Notify other components
  };
  
  const calculateNewAverageRating = (currentAvg: number | undefined, comments: Comment[]): number => {
    if (!comments || comments.length === 0) return currentAvg || 0;
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return parseFloat((totalRating / comments.length).toFixed(1));
  };

  const handleShareEvent = (event: Event | null) => {
    if (!event) return;
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/#event-details-section` : `https://your-app-url.com/#event-details-section`; 
    const shareText = `Check out this event: ${event.name} - ${event.description.substring(0,50)}...`;
    
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: shareText,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({ title: "Link Copied!", description: "Event link copied to clipboard." });
    }
  };

  const handleAddToCalendar = (event: Event | null) => {
    if (!event) return;
    const formatGoogleCalendarDate = (dateStr: string, timeStr: string) => {
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = timeStr.split(':');
        return `${year}${month}${day}T${hours}${minutes}00`;
    };
    
    const startTime = formatGoogleCalendarDate(event.date, event.time);
    let endTime = startTime; 
    if (event.duration) {
        const eventStartDate = new Date(`${event.date}T${event.time}`);
        if (event.duration.includes("hour")) {
            const hours = parseInt(event.duration);
            if (!isNaN(hours)) {
                eventStartDate.setHours(eventStartDate.getHours() + hours);
                endTime = formatGoogleCalendarDate(
                    eventStartDate.toISOString().split('T')[0], 
                    eventStartDate.toTimeString().split(' ')[0].substring(0,5)
                );
            }
        } else if (event.duration.toLowerCase() === "all day") {
             const nextDay = new Date(eventStartDate);
             nextDay.setDate(eventStartDate.getDate() + 1);
             endTime = formatGoogleCalendarDate(nextDay.toISOString().split('T')[0], "00:00");
        }
    }

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location + ", " + event.city)}`;
    window.open(googleCalendarUrl, '_blank');
    toast({ title: "Add to Calendar", description: "Opening Google Calendar..." });
  };

  if (isLoading && !selectedEvent && !showCreateEventModal && (!isLoaded || (isLoaded && !user)) ) {
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
       {showInstallPrompt && (
        <div className="glass-effect p-4 rounded-lg mb-6 flex items-center justify-between shadow-lg">
          <div>
            <h3 className="font-semibold text-foreground">Install Local Pulse!</h3>
            <p className="text-sm text-muted-foreground">Get the best event experience on your device.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleInstallPrompt} size="sm" className="bg-primary text-primary-foreground">Install</Button>
            <Button onClick={handleDismissInstallPrompt} size="sm" variant="ghost">Dismiss</Button>
          </div>
        </div>
      )}

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
          allEvents={eventsData}
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
      
      {selectedEvent && (
        <section ref={eventDetailsRef} id="event-details-section" className="mt-8 pt-6 border-t border-border/30">
          <div className="glass-effect p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">{selectedEvent.name}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)} aria-label="Close event details">
                <XCircle className="h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {selectedEvent.imageUrl && (
                  <Image
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.name}
                    width={600}
                    height={300}
                    className="w-full h-auto max-h-72 object-cover rounded-xl mb-4 shadow-md"
                    data-ai-hint={`${selectedEvent.category || 'event'} ${selectedEvent.city || 'city'}`}
                  />
                )}
                <h3 className="text-lg font-semibold mb-1">About this Event</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{selectedEvent.description}</p>
                
                <h3 className="text-lg font-semibold mb-1">Details</h3>
                <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                  <li><strong>Date & Time:</strong> {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {selectedEvent.time}</li>
                  {selectedEvent.duration && <li><strong>Duration:</strong> {selectedEvent.duration}</li>}
                  <li><strong>Venue:</strong> {selectedEvent.location}</li>
                  {selectedEvent.locationAddress && selectedEvent.locationAddress !== selectedEvent.location && <li><strong>Address:</strong> {selectedEvent.locationAddress}</li>}
                  <li><strong>City:</strong> {selectedEvent.city}</li>
                  <li><strong>Category:</strong> <Badge variant="secondary">{selectedEvent.category}</Badge></li>
                  {selectedEvent.organizer && <li><strong>Organizer:</strong> {selectedEvent.organizer}</li>}
                  {selectedEvent.price && <li><strong>Price:</strong> {selectedEvent.price}</li>}
                  {selectedEvent.ageGroup && <li><strong>Age Group:</strong> {selectedEvent.ageGroup}</li>}
                  {selectedEvent.accessibilityInfo && <li><strong>Accessibility:</strong> {selectedEvent.accessibilityInfo}</li>}
                  {selectedEvent.contactEmail && <li><strong>Contact:</strong> <a href={`mailto:${selectedEvent.contactEmail}`} className="text-primary hover:underline">{selectedEvent.contactEmail}</a></li>}
                </ul>

                 {selectedEvent.registrationLink && selectedEvent.registrationLink !== "#" && (
                  <Button asChild className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 transition-transform hover:scale-105 mr-2">
                    <a href={selectedEvent.registrationLink} target="_blank" rel="noopener noreferrer">Register Now</a>
                  </Button>
                )}
                 <Button onClick={() => handleShareEvent(selectedEvent)} variant="outline" className="rounded-full mr-2">
                  <Share2 className="h-4 w-4 mr-2"/> Share Event
                </Button>
                <Button onClick={() => handleAddToCalendar(selectedEvent)} variant="outline" className="rounded-full">
                  <CalendarPlus className="h-4 w-4 mr-2"/> Add to Calendar
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Location Map</h3>
                {selectedEvent.mapUrl && selectedEvent.mapUrl !== "#" ? (
                  <iframe
                    src={selectedEvent.mapUrl}
                    width="100%"
                    height="300"
                    className="border-0 rounded-xl shadow-md mb-6"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map for ${selectedEvent.name}`}
                  ></iframe>
                ) : <p className="text-sm text-muted-foreground mb-6">Map data not available.</p>}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-6 pt-6 border-t border-border/30">
              <h3 className="text-xl font-semibold mb-3">Reviews & Ratings</h3>
              {!user && isLoaded ? (
                <div className="text-center p-4 glass-effect rounded-xl">
                  <p className="text-muted-foreground mb-3">Please sign in to write a review or see all reviews.</p>
                  <Button onClick={() => openSignIn({ redirectUrl: typeof window !== 'undefined' ? `${window.location.pathname}#event-details-section` : '/' })} className="rounded-full">Sign In to Review</Button>
                </div>
              ) : user ? (
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-2">Write a Review</h4>
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => handleReviewStarClick(starVal)}
                        aria-label={`Rate ${starVal} stars`}
                        className={`p-1 rounded-full transition-colors ${currentReviewRating >= starVal ? 'text-yellow-400 dark:text-yellow-500' : 'text-muted-foreground/50 hover:text-yellow-400/70'}`}
                      >
                        <Star fill={currentReviewRating >= starVal ? 'currentColor' : 'none'} className="w-7 h-7" />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full p-3 rounded-lg border-border bg-input shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                    rows={3}
                  />
                  <Button onClick={handleSubmitReview} className="rounded-full">
                    <Send className="h-4 w-4 mr-2" /> Submit Review
                  </Button>
                </div>
              ) : <Skeleton className="h-24 w-full rounded-lg glass-effect" />}
              
              <div className="space-y-4">
                {selectedEvent.comments && selectedEvent.comments.length > 0 ? (
                  selectedEvent.comments.map((comment) => (
                    <div key={comment.id} className="glass-effect p-4 rounded-lg shadow">
                      <div className="flex items-center mb-1">
                        {comment.userImage ? 
                           <Image src={comment.userImage} alt={comment.userName} data-ai-hint="profile avatar" width={32} height={32} className="w-8 h-8 rounded-full mr-2"/>
                           : <UserCircleIcon className="w-8 h-8 text-muted-foreground mr-2"/>
                        }
                        <div>
                            <p className="font-semibold text-foreground text-sm">{comment.userName}</p>
                            <p className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                       <div className="flex items-center my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400 dark:text-yellow-500' : 'text-muted-foreground/30'}`} fill={i < comment.rating ? 'currentColor' : 'none'} />
                          ))}
                        </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                  ))
                ) : (
                   user && <p className="text-muted-foreground text-sm">No reviews yet. Be the first one!</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {!isLoading && filteredAndSortedEvents.length === 0 && (searchQuery || selectedCityId || categoryFilter || dateFilter || ratingFilter) && (
         <div className="text-center py-10 glass-effect rounded-2xl">
            <p className="text-lg font-semibold">No events match your current filters.</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      
      <NearbyEventsSection onEventClick={handleEventCardClick} />
      <CreateEventForm 
        isOpen={showCreateEventModal} 
        onClose={() => setShowCreateEventModal(false)} 
        onEventCreate={handleCreateEvent}
        currentUser={user}
      />
      <AppFooter />
    </div>
  );
};

export default Home;
