
'use client';

import { useState, useEffect, type FC } from 'react';
import { UserProfile, useUser, useClerk } from "@clerk/nextjs";
import type { UserResource } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Event } from '@/types';
import { allMockEvents } from '../page'; // Import the shared mutable array
import { useToast } from '@/hooks/use-toast';

// Assume allEventCategories is available or define it
const allEventCategoriesStatic = [...new Set(allMockEvents.map(event => event.category))].sort();
const mockCitiesStatic = [ // Define or import mockCities
  { id: 'bengaluru', name: 'Bengaluru' },
  { id: 'mysuru', name: 'Mysuru' },
  { id: 'mangaluru', name: 'Mangaluru' },
  { id: 'hubballi', name: 'Hubballi-Dharwad' },
  { id: 'belagavi', name: 'Belagavi' },
];


interface EditEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit: Event | null;
  onEventUpdate: (updatedEvent: Event) => void;
  currentUser: UserResource | null | undefined;
}

const EditEventForm: FC<EditEventFormProps> = ({ isOpen, onClose, eventToEdit, onEventUpdate, currentUser }) => {
  const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});
  const [dateTimeLocal, setDateTimeLocal] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (eventToEdit) {
      setEditedEvent({ ...eventToEdit });
      if (eventToEdit.date && eventToEdit.time) {
        setDateTimeLocal(`${eventToEdit.date}T${eventToEdit.time}`);
      } else {
        setDateTimeLocal('');
      }
    } else {
      setEditedEvent({});
      setDateTimeLocal('');
    }
  }, [eventToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'dateTimeLocal') {
      setDateTimeLocal(value);
    } else {
      setEditedEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventToEdit) return;

    const [datePart, timePart] = dateTimeLocal.split('T');
    if (!editedEvent.name || !editedEvent.description || !datePart || !timePart || !editedEvent.locationAddress || !editedEvent.price || !editedEvent.ageGroup || !editedEvent.registrationLink || !editedEvent.category) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive"});
      return;
    }
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (editedEvent.mapUrl && !urlPattern.test(editedEvent.mapUrl)) {
        toast({ title: "Validation Error", description: "Please enter a valid Google Maps URL.", variant: "destructive"});
        return;
    }
    if (editedEvent.registrationLink && !urlPattern.test(editedEvent.registrationLink)) {
        toast({ title: "Validation Error", description: "Please enter a valid Registration URL.", variant: "destructive"});
        return;
    }

    const updatedEventData: Event = {
      ...eventToEdit,
      ...editedEvent,
      date: datePart,
      time: timePart,
      location: editedEvent.locationAddress || eventToEdit.location, // Update primary location display
    } as Event;
    onEventUpdate(updatedEventData);
    onClose();
  };

  if (!eventToEdit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Event: {eventToEdit.name}</DialogTitle>
          <DialogDescription>Update the details for your event.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Event Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Event Name*</Label>
            <Input id="name" name="name" value={editedEvent.name || ''} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description*</Label>
            <Textarea id="description" name="description" value={editedEvent.description || ''} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Date & Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateTimeLocal" className="text-right">Date & Time*</Label>
            <Input id="dateTimeLocal" name="dateTimeLocal" type="datetime-local" value={dateTimeLocal} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Location Address */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="locationAddress" className="text-right">Location Address*</Label>
            <Input id="locationAddress" name="locationAddress" value={editedEvent.locationAddress || ''} onChange={handleChange} className="col-span-3" required />
          </div>
          {/* Google Maps URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mapUrl" className="text-right">Google Maps URL</Label>
            <Input id="mapUrl" name="mapUrl" type="url" value={editedEvent.mapUrl || ''} onChange={handleChange} className="col-span-3" placeholder="https://maps.google.com/?q=..." />
          </div>
           {/* Price */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price*</Label>
            <Input id="price" name="price" value={editedEvent.price || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., Free, ₹200" required />
          </div>
          {/* Age Group */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ageGroup" className="text-right">Age Group*</Label>
            <Input id="ageGroup" name="ageGroup" value={editedEvent.ageGroup || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., All Ages, 18+" required />
          </div>
          {/* Registration URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="registrationLink" className="text-right">Registration URL*</Label>
            <Input id="registrationLink" name="registrationLink" type="url" value={editedEvent.registrationLink || ''} onChange={handleChange} className="col-span-3" placeholder="https://example.com/register" required />
          </div>
          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category*</Label>
            <Select name="category" value={editedEvent.category || ''} onValueChange={(value) => handleSelectChange('category', value)} required>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{allEventCategoriesStatic.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {/* Organizer Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organizer" className="text-right">Organizer</Label>
            <Input id="organizer" name="organizer" value={editedEvent.organizer || ''} onChange={handleChange} className="col-span-3" />
          </div>
          {/* Contact Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactEmail" className="text-right">Contact Email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" value={editedEvent.contactEmail || ''} onChange={handleChange} className="col-span-3" />
          </div>
          {/* Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">Duration</Label>
            <Input id="duration" name="duration" value={editedEvent.duration || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., 2 hours" />
          </div>
          {/* Accessibility Info */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accessibilityInfo" className="text-right">Accessibility</Label>
            <Input id="accessibilityInfo" name="accessibilityInfo" value={editedEvent.accessibilityInfo || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., Wheelchair accessible" />
          </div>
           {/* City */}
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">City*</Label>
            <Select name="city" value={editedEvent.city || ''} onValueChange={(value) => handleSelectChange('city', value)} required>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>{mockCitiesStatic.map(city => <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Update Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const UserProfilePage: FC = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const { toast } = useToast();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const filteredEvents = allMockEvents.filter(event => event.organizerId === user.id);
      setUserEvents(filteredEvents);
    }
  }, [isLoaded, user]);

  // Listen for global event updates
   useEffect(() => {
    const handleEventsUpdated = () => {
      if (user) {
        const filtered = allMockEvents.filter(event => event.organizerId === user.id);
        setUserEvents(filtered);
      }
    };
    window.addEventListener('eventsUpdated', handleEventsUpdated);
    return () => window.removeEventListener('eventsUpdated', handleEventsUpdated);
  }, [user]);


  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setIsEditModalOpen(true);
  };

  const handleEventUpdate = (updatedEvent: Event) => {
    const index = allMockEvents.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      allMockEvents[index] = updatedEvent; // Update the shared mutable array
    }
    setUserEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setIsEditModalOpen(false);
    setEventToEdit(null);
    toast({ title: "Event Updated!", description: `${updatedEvent.name} has been updated.`});
    window.dispatchEvent(new CustomEvent('eventsUpdated')); // Notify other components
  };

  if (!isLoaded) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl glass-effect mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <UserProfile routing="path" path="/profile" appearance={{
              elements: {
                card: "shadow-none border-none bg-transparent",
                navbar: "hidden",
                headerTitle: "text-foreground",
                profileSectionTitleText: "text-foreground",
                formFieldLabel: "text-foreground",
                formFieldInput: "bg-input border-border text-foreground",
                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                accordionTriggerButton: "text-foreground hover:bg-muted/50",
                badge: "bg-secondary text-secondary-foreground",
                dividerLine: "bg-border",
              }
            }}/>
          </div>
        </CardContent>
      </Card>

      {user ? (
        <Card className="w-full max-w-4xl glass-effect mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">My Created Events</CardTitle>
            <CardDescription>Manage events you have created.</CardDescription>
          </CardHeader>
          <CardContent>
            {userEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userEvents.map(event => (
                  <Card key={event.id} className="glass-effect">
                    <CardHeader>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Date: {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                      <Button onClick={() => handleEditEvent(event)} className="mt-4 w-full" variant="outline">Edit Event</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">You haven't created any events yet.</p>
            )}
          </CardContent>
        </Card>
      ) : (
         <Card className="w-full max-w-4xl glass-effect mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">My Created Events</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-3">Please sign in to view and manage your created events.</p>
            <Button onClick={() => openSignIn()} >Sign In</Button>
          </CardContent>
        </Card>
      )}
      
      <EditEventForm 
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEventToEdit(null); }}
        eventToEdit={eventToEdit}
        onEventUpdate={handleEventUpdate}
        currentUser={user}
      />
    </div>
  );
};

export default UserProfilePage;
