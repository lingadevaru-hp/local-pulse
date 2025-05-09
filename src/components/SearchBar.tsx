'use client';

import type { FC, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Lightbulb } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  guessedCategory: string | null;
  isLoadingCategory: boolean;
}

const SearchBar: FC<SearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  guessedCategory,
  isLoadingCategory,
}) => {
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Search for events (e.g., 'live music tonight')"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="flex-grow bg-card rounded-lg shadow-sm text-base"
        />
        <Button type="submit" disabled={isLoadingCategory || !searchQuery.trim()} className="rounded-lg shadow-sm">
          {isLoadingCategory ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </div>
      {guessedCategory && !isLoadingCategory && (
        <div className="p-3 bg-accent/20 border border-accent/30 rounded-lg text-sm text-accent-foreground flex items-center shadow-sm">
          <Lightbulb className="mr-2 h-4 w-4 text-primary" /> 
          Suggested Category: <span className="font-semibold ml-1">{guessedCategory}</span>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
