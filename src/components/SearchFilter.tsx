import { useState } from 'react';

interface SearchFilterProps {
  onFilter: (filters: FilterParams) => void;
}

interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  borough?: string;
  bedrooms?: number;
  propertyType?: string;
}

const LONDON_BOROUGHS = [
  'Camden',
  'Greenwich',
  'Hackney',
  'Hammersmith and Fulham',
  'Islington',
  'Kensington and Chelsea',
  'Lambeth',
  'Lewisham',
  'Southwark',
  'Tower Hamlets',
  'Wandsworth',
  'Westminster',
];

const PROPERTY_TYPES = [
  'Studio',
  'Flat',
  'House Share',
  'Student Hall',
  'Entire House',
];

export default function SearchFilter({ onFilter }: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterParams>({});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value === '' ? undefined : 
              name.includes('Price') ? Number(value) : value,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filter Properties</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price (£)
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Min price"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price (£)
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Max price"
          />
        </div>

        {/* Borough */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Borough
          </label>
          <select
            name="borough"
            value={filters.borough || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Any Borough</option>
            {LONDON_BOROUGHS.map((borough) => (
              <option key={borough} value={borough}>
                {borough}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <select
            name="bedrooms"
            value={filters.bedrooms || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            name="propertyType"
            value={filters.propertyType || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Any Type</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
