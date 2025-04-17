import {
  FaWifi,
  FaWater,
  FaThermometerHalf,
  FaParking,
  FaLock,
  FaSnowflake,
  FaFireExtinguisher,
  FaShieldAlt,
} from 'react-icons/fa';
import {
  MdLocalLaundryService,
  MdKitchen,
  MdPets,
  MdCleaningServices,
  MdOutlineChair,
  MdBalcony,
  MdElevator,
  MdOutlineCable,
} from 'react-icons/md';

interface PropertyAmenitiesProps {
  amenities: {
    wifi: boolean;
    laundry: boolean;
    kitchen: boolean;
    waterBills: boolean;
    petsAllowed: boolean;
    heating: boolean;
    parking: boolean;
    security: boolean;
    airConditioning: boolean;
    furnished: boolean;
    balcony: boolean;
    elevator: boolean;
    cableTv: boolean;
    cleaning: boolean;
    fireAlarm: boolean;
    [key: string]: boolean;
  };
}

const amenitiesConfig = [
  { key: 'wifi', icon: FaWifi, label: 'WiFi Included' },
  { key: 'laundry', icon: MdLocalLaundryService, label: 'Laundry Facilities' },
  { key: 'kitchen', icon: MdKitchen, label: 'Modern Kitchen' },
  { key: 'waterBills', icon: FaWater, label: 'Water Bills Included' },
  { key: 'petsAllowed', icon: MdPets, label: 'Pets Allowed' },
  { key: 'heating', icon: FaThermometerHalf, label: 'Central Heating' },
  { key: 'parking', icon: FaParking, label: 'Parking Available' },
  { key: 'security', icon: FaLock, label: '24/7 Security' },
  { key: 'airConditioning', icon: FaSnowflake, label: 'Air Conditioning' },
  { key: 'furnished', icon: MdOutlineChair, label: 'Fully Furnished' },
  { key: 'balcony', icon: MdBalcony, label: 'Balcony' },
  { key: 'elevator', icon: MdElevator, label: 'Elevator' },
  { key: 'cableTv', icon: MdOutlineCable, label: 'Cable TV' },
  { key: 'cleaning', icon: MdCleaningServices, label: 'Cleaning Service' },
  { key: 'fireAlarm', icon: FaFireExtinguisher, label: 'Fire Alarm' },
];

export default function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  const availableAmenities = amenitiesConfig.filter(
    (amenity) => amenities[amenity.key]
  );
  const unavailableAmenities = amenitiesConfig.filter(
    (amenity) => !amenities[amenity.key]
  );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableAmenities.map((amenity) => (
          <div
            key={amenity.key}
            className="flex items-center p-3 bg-blue-50 rounded-lg"
          >
            <amenity.icon className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-gray-800">{amenity.label}</span>
          </div>
        ))}
      </div>

      {unavailableAmenities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Not Included</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unavailableAmenities.map((amenity) => (
              <div
                key={amenity.key}
                className="flex items-center p-3 bg-gray-50 rounded-lg opacity-60"
              >
                <amenity.icon className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-500">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
