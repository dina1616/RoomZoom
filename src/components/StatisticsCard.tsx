import React from 'react';
import { 
  FiHome, 
  FiEye, 
  FiMessageSquare, 
  FiHeart, 
  FiDollarSign, 
  FiCalendar, 
  FiUser 
} from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: 'property' | 'view' | 'inquiry' | 'favorite' | 'price' | 'date' | 'user';
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  change?: number;
  isLoading?: boolean;
}

/**
 * A reusable statistics card component for dashboards
 */
const StatisticsCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  change,
  isLoading = false
}) => {
  // Map icon types to components
  const icons = {
    property: FiHome,
    view: FiEye,
    inquiry: FiMessageSquare,
    favorite: FiHeart,
    price: FiDollarSign,
    date: FiCalendar,
    user: FiUser
  };
  
  // Map color names to tailwind classes
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    red: 'bg-red-50 text-red-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-orange-50 text-orange-500'
  };
  
  const IconComponent = icons[icon];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:shadow-lg">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-600">{title}</h2>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <IconComponent className="w-5 h-5" />
            </div>
          </div>
          
          {change !== undefined && (
            <div className="mt-4">
              <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last period</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatisticsCard; 