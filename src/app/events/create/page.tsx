
import type { NextPage } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CreateEventPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Create New Event</CardTitle>
          <CardDescription>Fill in the details to create your event.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Event creation form will be here. This page is protected and only accessible to signed-in users.
          </p>
          {/* Placeholder for form fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-foreground">Event Name</label>
              <input type="text" id="eventName" className="mt-1 block w-full rounded-md border-border bg-input px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="e.g., Summer Music Festival"/>
            </div>
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-foreground">Event Date</label>
              <input type="date" id="eventDate" className="mt-1 block w-full rounded-md border-border bg-input px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button>Save Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventPage;
