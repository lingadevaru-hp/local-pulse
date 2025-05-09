
'use client';

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { City } from '@/types';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label'; // Import Label

interface CitySelectorProps {
  cities: City[];
  selectedCity: string | null;
  onCityChange: (cityId: string) => void;
  disabled?: boolean;
}

const CitySelector: FC<CitySelectorProps> = ({ cities, selectedCity, onCityChange, disabled }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="city-select" className="text-muted-foreground flex items-center">
        <MapPin className="mr-2 h-4 w-4" />
        Select City
      </Label>
      <Select
        name="city-select" // Added name for better accessibility/forms
        value={selectedCity || ""}
        onValueChange={onCityChange}
        disabled={disabled}
      >
        <SelectTrigger 
          id="city-select" 
          className="w-full h-12 bg-background/70 dark:bg-black/30 backdrop-blur-sm border-border/50 rounded-xl shadow-sm text-base"
          aria-label="Select a city"
        >
          <SelectValue placeholder="Choose a city in Karnataka..." />
        </SelectTrigger>
        <SelectContent className="bg-popover/80 dark:bg-popover/80 backdrop-blur-md rounded-lg">
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id} className="cursor-pointer hover:bg-accent/10">
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
