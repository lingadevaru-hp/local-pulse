
'use client';

import type { FC, FormEvent } from 'react';
import { useState }  from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, CheckCircle, RotateCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { City } from '@/types';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  
  selectedCategoryFilter: string | null;
  onCategoryFilterChange: (category: string | null) => void;
  availableCategories: string[];

  selectedDateFilter: string | null;
  onDateFilterChange: (dateFilter: string | null) => void;
  
  selectedLocationFilter: string | null;
  onLocationFilterChange: (locationId: string | null) => void;
  availableLocations: City[]; 

  selectedRatingFilter: string | null;
  onRatingFilterChange: (rating: string | null) => void;

  onApplyFilters: () => void; 
  onDetectLocation: () => void;
}

const dateFilterOptions = [
  { value: 'all', label: 'Any Date' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
];

const ratingFilterOptions = [
  { value: 'all', label: 'Any Rating' },
  { value: '4', label: '4+ Stars' }, // Value as number string
  { value: '3', label: '3+ Stars' },
  { value: '2', label: '2+ Stars' },
];

const SearchBar: FC<SearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
  availableCategories,
  selectedDateFilter,
  onDateFilterChange,
  selectedLocationFilter,
  onLocationFilterChange,
  availableLocations,
  selectedRatingFilter,
  onRatingFilterChange,
  onApplyFilters,
  onDetectLocation,
}) => {
  
  const [applyButtonState, setApplyButtonState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (applyButtonState === 'loading') return;

    setApplyButtonState('loading');
    onApplyFilters(); // Call the passed-in filter function

    // Simulate API call or processing
    setTimeout(() => {
      setApplyButtonState('success');
      setTimeout(() => setApplyButtonState('idle'), 1500); // Reset after 1.5s
    }, 1000); // Simulate 1s loading
  };

  return (
    <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-4 space-y-4 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events in Karnataka…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-transparent border-none focus:ring-0 text-base rounded-xl"
            aria-label="Search for events by keyword"
          />
        </div>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary shrink-0"
          onClick={onDetectLocation}
          aria-label="Detect My Location"
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={selectedCategoryFilter || "all"} onValueChange={(val) => onCategoryFilterChange(val === "all" ? null : val)} aria-label="Filter by category">
          <SelectTrigger className="rounded-full bg-background/70 dark:bg-black/30 backdrop-blur-sm border-border/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-popover/80 dark:bg-popover/80 backdrop-blur-md">
            <SelectItem value="all">All Categories</SelectItem>
            {availableCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={selectedDateFilter || "all"} onValueChange={(val) => onDateFilterChange(val === "all" ? null : val)} aria-label="Filter by date">
          <SelectTrigger className="rounded-full bg-background/70 dark:bg-black/30 backdrop-blur-sm border-border/50">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent className="bg-popover/80 dark:bg-popover/80 backdrop-blur-md">
            {dateFilterOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={selectedLocationFilter || "all"} onValueChange={(val) => onLocationFilterChange(val === "all" ? null : val)} aria-label="Filter by location">
          <SelectTrigger className="rounded-full bg-background/70 dark:bg-black/30 backdrop-blur-sm border-border/50">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-popover/80 dark:bg-popover/80 backdrop-blur-md">
            <SelectItem value="all">All Locations</SelectItem>
            {availableLocations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>)}
          </SelectContent>
        </Select>
        
        <Select value={selectedRatingFilter || "all"} onValueChange={(val) => onRatingFilterChange(val === "all" ? null : val)} aria-label="Filter by rating">
          <SelectTrigger className="rounded-full bg-background/70 dark:bg-black/30 backdrop-blur-sm border-border/50">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent className="bg-popover/80 dark:bg-popover/80 backdrop-blur-md">
             {ratingFilterOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit" 
        className={cn(
            "w-full sm:w-auto sm:ml-auto rounded-full h-11 text-base px-8 transition-all duration-300 ease-in-out",
            applyButtonState === 'loading' && 'opacity-70 cursor-not-allowed',
            applyButtonState === 'success' && 'bg-success text-success-foreground animate-pulse-once'
        )}
        aria-label="Apply all selected filters and search query"
        disabled={applyButtonState === 'loading'}
      >
        {applyButtonState === 'loading' && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
        {applyButtonState === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
        {applyButtonState === 'idle' && 'Apply Filters'}
        {applyButtonState === 'loading' && 'Applying...'}
        {applyButtonState === 'success' && 'Applied!'}
      </Button>
    </form>
  );
};

export default SearchBar;
