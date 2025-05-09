
'use client';

import type { FC, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LocateFixed, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  onDetectLocation: () => void;
  onOpenFilters: () => void;
}

const SearchBar: FC<SearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onDetectLocation,
  onOpenFilters,
}) => {
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 p-2 bg-background/70 dark:bg-black/30 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events in Karnataka…"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-transparent border-none focus:ring-0 text-base"
            aria-label="Search for events"
          />
        </div>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary"
          onClick={onDetectLocation}
          aria-label="Detect My Location"
        >
          <LocateFixed className="h-5 w-5" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary"
          onClick={onOpenFilters}
          aria-label="Open Filters"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
