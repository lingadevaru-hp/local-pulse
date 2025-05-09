
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryChips: FC<CategoryChipsProps> = ({ categories, selectedCategory, onCategorySelect }) => {
  const allCategories = [null, ...categories]; // Add "All" option

  return (
    <section aria-labelledby="category-filter-heading" className="mb-6 md:mb-8">
      <h3 id="category-filter-heading" className="sr-only">Filter by Category</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex space-x-2 pb-2.5">
          {allCategories.map((category, index) => (
            <Button
              key={index}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategorySelect(category)}
              className={cn(
                "rounded-full px-4 py-2 h-auto text-sm transition-all duration-200 ease-in-out",
                "bg-background/70 dark:bg-black/30 backdrop-blur-sm border-border/50 hover:bg-accent/70 dark:hover:bg-accent/50",
                selectedCategory === category && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 dark:hover:bg-primary/90"
              )}
            >
              {category === null ? 'All Events' : category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

export default CategoryChips;
