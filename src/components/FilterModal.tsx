
'use client';

import React from 'react'; // Added missing React import
import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CitySelector from './CitySelector';
import type { City } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Star } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
  selectedCity: string | null;
  onCityChange: (cityId: string) => void;
  // TODO: Add props for category, date, rating filters and their handlers
  // selectedCategory: string | null;
  // onCategoryChange: (category: string) => void;
  // selectedDate: Date | null;
  // onDateChange: (date: Date | null) => void;
  // selectedRating: number | null;
  // onRatingChange: (rating: number) => void;
}

const eventCategories = ['Culture', 'Festival', 'Food', 'Music', 'Tech', 'Art', 'Sports']; // Example categories

const FilterModal: FC<FilterModalProps> = ({
  isOpen,
  onClose,
  cities,
  selectedCity,
  onCityChange,
}) => {
  // Temporary states for filters within the modal until parent state is managed
  const [tempDate, setTempDate] = React.useState<Date | undefined>(undefined);
  const [tempCategory, setTempCategory] = React.useState<string | undefined>(undefined);
  const [tempRating, setTempRating] = React.useState<number>(0);


  const handleApplyFilters = () => {
    // TODO: Call actual filter update functions passed via props
    console.log("Applying filters:", { selectedCity, tempCategory, tempDate, tempRating });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] glass-card p-6">
        <DialogHeader>
          <DialogTitle>Filter Events</DialogTitle>
          <DialogDescription>
            Refine your event search using the options below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <CitySelector
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={onCityChange}
          />
          
          <div className="space-y-2">
            <Label htmlFor="category-filter" className="text-muted-foreground">Category</Label>
            <RadioGroup id="category-filter" value={tempCategory} onValueChange={setTempCategory}>
              <div className="grid grid-cols-2 gap-2">
              {eventCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={`cat-${category}`} />
                  <Label htmlFor={`cat-${category}`} className="font-normal">{category}</Label>
                </div>
              ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-filter" className="text-muted-foreground">Date</Label>
            <Calendar
              mode="single"
              selected={tempDate}
              onSelect={setTempDate}
              className="rounded-md border bg-background/70 dark:bg-black/30 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating-filter" className="text-muted-foreground">Minimum Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button 
                  key={star} 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setTempRating(star)}
                  className={tempRating >= star ? 'text-yellow-400 dark:text-yellow-500' : 'text-muted-foreground/50'}
                >
                  <Star className="h-5 w-5" fill={tempRating >= star ? 'currentColor' : 'none'} />
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
