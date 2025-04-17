import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Define the structure for filter values
export interface FilterValues {
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
}

// --- Sub Components with State & Callbacks ---

interface BudgetSliderProps {
  onChange: (min: number | undefined, max: number | undefined) => void;
}

const BudgetSlider: React.FC<BudgetSliderProps> = ({ onChange }) => {
  const t = useTranslations('filters');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const minPriceId = React.useId();
  const maxPriceId = React.useId();

  useEffect(() => {
    const min = minPrice ? parseInt(minPrice, 10) : undefined;
    const max = maxPrice ? parseInt(maxPrice, 10) : undefined;
    onChange(min, max);
  }, [minPrice, maxPrice, onChange]);

  return (
    <fieldset className="p-2 border rounded mb-4">
      <legend className="block mb-1 font-semibold px-1">{t('budget')} (£/pcm)</legend> 
      <div className="flex space-x-2">
         <label htmlFor={minPriceId} className="sr-only">Minimum Price</label> 
         <input 
            id={minPriceId}
            type="number" 
            placeholder="Min" 
            value={minPrice}
            min="0"
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 p-1 border rounded"
            aria-label="Minimum Price per month"
          />
         <label htmlFor={maxPriceId} className="sr-only">Maximum Price</label>
         <input 
            id={maxPriceId}
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            min="0"
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 p-1 border rounded"
             aria-label="Maximum Price per month"
         />
      </div>
    </fieldset>
  );
};

interface AmenityToggleProps {
  onChange: (selectedAmenities: string[]) => void;
}

const AmenityToggle: React.FC<AmenityToggleProps> = ({ onChange }) => {
  const t = useTranslations('filters');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const availableAmenities = ['WiFi', 'Gym', 'Parking', 'Pet Friendly', 'Laundry', 'Kitchen'];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedAmenities(prev => 
      checked ? [...prev, name] : prev.filter(amenity => amenity !== name)
    );
  };

 useEffect(() => {
    onChange(selectedAmenities);
  }, [selectedAmenities, onChange]);


  return (
    <fieldset className="p-2 border rounded">
      <legend className="block mb-2 font-semibold px-1">{t('amenities')}</legend>
      <div className="grid grid-cols-2 gap-2">
        {availableAmenities.map((amenity) => {
            const amenityId = React.useId ? React.useId() : `amenity-${amenity.replace(/\s+/g, '-').toLowerCase()}`;
            return (
              <div key={amenity} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={amenityId} 
                  name={amenity} 
                  className="mr-2" 
                  onChange={handleCheckboxChange}
                  checked={selectedAmenities.includes(amenity)}
                />
                <label htmlFor={amenityId}>{amenity}</label> 
              </div>
            );
        })}
      </div>
    </fieldset>
  );
};

// --- Main Filter Bar Component ---

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({});

  // Debounce function (simple implementation)
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFilterChange = React.useCallback(debounce(onFilterChange, 500), [onFilterChange]);

  useEffect(() => {
    debouncedFilterChange(currentFilters);
  }, [currentFilters, debouncedFilterChange]);

  const handleBudgetChange = (min: number | undefined, max: number | undefined) => {
    setCurrentFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    setCurrentFilters(prev => ({ ...prev, amenities: amenities.length > 0 ? amenities : undefined }));
  };

  return (
    <aside className="w-full md:w-1/4 p-4 bg-gray-100 border-r" aria-labelledby="filter-heading">
      <h2 id="filter-heading" className="text-xl font-bold mb-4">Filters</h2>
      <BudgetSlider onChange={handleBudgetChange} />
      <AmenityToggle onChange={handleAmenitiesChange} />
    </aside>
  );
};

export default FilterBar; 