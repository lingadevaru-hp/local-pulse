
'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event, Comment } from '@/types';
import { allMockEvents } from '@/app/page'; // Assuming allMockEvents is exported from page.tsx or a shared source
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';


const EventDetailsPage: FC = () => {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [currentRating, setCurrentRating] = useState(0);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      const foundEvent = allMockEvents.find(e => e.id === eventId);
      setEvent(foundEvent || null);
      setIsLoading(false);
    }
  }, [eventId]);

  const handleStarClick = (ratingValue: number) => {
    setCurrentRating(ratingValue);
  };

  const handleSubmitComment = () => {
    if (!user || !event) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a comment.",
        variant: "destructive",
      });
      openSignIn();
      return;
    }
    if (!commentText.trim() || currentRating === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a rating and write a comment.",
        variant: "destructive",
      });
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      userName: user.firstName || user.fullName || 'Anonymous User',
      userImage: user.imageUrl,
      rating: currentRating,
      text: commentText,
      date: new Date().toISOString(),
    };

    // In a real app, you would send this to a backend to update the event
    // For this mock, we update the local state
    const updatedEvent = { ...event, comments: [...(event.comments || []), newComment] };
    setEvent(updatedEvent);
    
    // Update allMockEvents for demo purposes (if needed elsewhere, otherwise this might not be necessary)
    const eventIndex = allMockEvents.findIndex(e => e.id === event.id);
    if (eventIndex > -1) {
      allMockEvents[eventIndex] = updatedEvent;
    }

    setCommentText('');
    setCurrentRating(0);
    toast({ title: "Comment Submitted", description: "Thank you for your feedback!" });
  };


  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading event details...</div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-8 text-center">Event not found.</div>;
  }
  
  const aiHint = `${event.category || 'event'} ${event.city || 'city'}`.toLowerCase();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="glass-effect shadow-xl">
        <CardHeader className="p-0">
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.name}
              width={1200}
              height={400}
              className="w-full h-auto max-h-96 object-cover rounded-t-2xl"
              data-ai-hint={aiHint}
              priority
            />
          )}
           <div className="p-6">
             <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{event.name}</CardTitle>
             <CardDescription className="text-base mt-1">{event.category} Event in {event.city}</CardDescription>
           </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <section className="text-base leading-relaxed">
            <h3 className="text-xl font-semibold mb-2 mt-4">About this Event</h3>
            <p>{event.description}</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h3 className="text-xl font-semibold mb-2">Details</h3>
              <ul className="space-y-1 text-sm">
                <li><strong className="font-semibold">Date & Time:</strong> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {event.time}</li>
                <li><strong className="font-semibold">Venue:</strong> {event.location}, {event.city}</li>
                {event.organizer && <li><strong className="font-semibold">Organizer:</strong> {event.organizer}</li>}
                <li><strong className="font-semibold">Price:</strong> {event.price || 'N/A'}</li>
                <li><strong className="font-semibold">Age Group:</strong> {event.ageGroup || 'All Ages'}</li>
              </ul>
              {event.registrationLink && event.registrationLink !== "#" && (
                <Button asChild className="mt-4 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 transition-transform hover:scale-105">
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">Register Now</a>
                </Button>
              )}
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              {event.mapUrl && event.mapUrl !== "#" ? (
                <iframe
                  src={event.mapUrl}
                  width="100%"
                  height="300"
                  className="border-0 rounded-xl shadow-md"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map for ${event.name}`}
                ></iframe>
              ) : <p className="text-sm text-muted-foreground">Map data not available.</p>}
            </section>
          </div>

          {/* Comments and Ratings Section */}
          <section className="mt-8 pt-6 border-t border-[var(--glass-border-light)] dark:border-[var(--glass-border-dark)]">
            <h3 className="text-2xl font-semibold mb-4">Comments & Ratings</h3>
            {!user ? (
              <div className="text-center p-4 glass-effect rounded-xl">
                <p className="text-muted-foreground mb-3">Please sign in to leave a comment or rating.</p>
                <Button onClick={() => openSignIn()} className="rounded-full">Sign In to Comment</Button>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium mb-1">Your Rating:</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        aria-label={`Rate ${star} stars`}
                        className={`p-1 rounded-full transition-colors ${currentRating >= star ? 'text-yellow-400 dark:text-yellow-500' : 'text-muted-foreground/50 hover:text-yellow-400/70'}`}
                      >
                        <Star fill={currentRating >= star ? 'currentColor' : 'none'} className="w-7 h-7" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Comment:</label>
                  <Textarea
                    id="comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-lg border-border bg-input shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Share your thoughts about this event..."
                  />
                </div>
                <Button onClick={handleSubmitComment} className="rounded-full">Submit Comment</Button>
              </div>
            )}

            <div className="space-y-4">
              {event.comments && event.comments.length > 0 ? (
                event.comments.map((comment) => (
                  <Card key={comment.id} className="glass-effect shadow">
                    <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                       {comment.userImage && <Image src={comment.userImage} alt={comment.userName} data-ai-hint="profile avatar" width={32} height={32} className="w-8 h-8 rounded-full"/>}
                       {!comment.userImage && <UserCircle className="w-8 h-8 text-muted-foreground"/>}
                      <div>
                        <p className="font-semibold text-foreground">{comment.userName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400 dark:text-yellow-500' : 'text-muted-foreground/30'}`} fill={i < comment.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </section>
        </CardContent>
        <CardFooter>
            <Button variant="outline" asChild>
                <Link href="/">Back to Events</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventDetailsPage;
