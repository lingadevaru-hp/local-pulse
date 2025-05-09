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
    <div className="flex flex-col space-y-2">
      <label htmlFor="city-select" className="text-sm font-medium text-muted-foreground flex items-center">
        <MapPin className="mr-2 h-4 w-4" />
        Select City
      </label>
      <Select
        value={selectedCity || ""}
        onValueChange={onCityChange}
        disabled={disabled}
      >
        <SelectTrigger id="city-select" className="w-full md:w-[280px] bg-card rounded-lg shadow-sm">
          <SelectValue placeholder="Choose a city..." />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
