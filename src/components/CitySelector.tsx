
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

interface CitySelectorProps {
  cities: City[];
  selectedCity: string | null;
  onCityChange: (cityId: string) => void;
  disabled?: boolean;
}

const CitySelector: FC<CitySelectorProps> = ({ cities, selectedCity, onCityChange, disabled }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="city-select" className="text-sm font-medium text-muted-foreground flex items-center">
        <MapPin className="mr-2 h-4 w-4" />
        Or Select a City
      </label>
      <Select
        value={selectedCity || ""}
        onValueChange={onCityChange}
        disabled={disabled}
        name="city-select" // Added name for better accessibility/forms
      >
        <SelectTrigger 
          id="city-select" 
          className="w-full h-12 md:w-auto md:min-w-[280px] bg-white/70 dark:bg-black/30 backdrop-blur-sm border-gray-300/50 dark:border-gray-700/50 rounded-xl shadow-sm text-base"
          aria-label="Select a city"
        >
          <SelectValue placeholder="Choose a city..." />
        </SelectTrigger>
        <SelectContent className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-lg">
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

