
'use client';

import type { FC, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, SlidersHorizontal, CalendarDays, Star, LocateFixed } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  // isLoadingCategory: boolean; // Removed
}

const SearchBar: FC<SearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  // isLoadingCategory, // Removed
}) => {
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events, categories, or locations…"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full h-14 pl-12 pr-4 bg-white/70 dark:bg-black/30 backdrop-blur-sm border-gray-300/50 dark:border-gray-700/50 rounded-2xl shadow-sm text-base focus:ring-primary focus:border-primary"
          aria-label="Search for events"
        />
        {/* Removed submit button from input group, form submission handles it */}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button 
          type="button" 
          variant="outline" 
          className="h-10 rounded-xl bg-white/70 dark:bg-black/30 backdrop-blur-sm border-gray-300/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-black/50"
          onClick={() => alert("Geolocation detection placeholder")}
        >
          <LocateFixed className="mr-2 h-4 w-4" />
          Detect My Location
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" aria-label="Filter by category">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" aria-label="Filter by date">
            <CalendarDays className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" aria-label="Filter by rating">
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </div>
       {/* Guessed category display removed */}
    </form>
  );
};

export default SearchBar;
