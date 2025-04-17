import { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, isAfter } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

interface BookingCalendarProps {
  propertyId: string;
  availableFrom: Date;
}

export default function BookingCalendar({
  propertyId,
  availableFrom,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const previousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateAvailable = (date: Date) => {
    return isAfter(date, availableFrom) || isSameMonth(date, availableFrom);
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
    }
  };

  const handleBookViewing = async () => {
    if (!selectedDate) return;

    try {
      // Add your booking logic here
      console.log('Booking viewing for:', selectedDate);
    } catch (error) {
      console.error('Error booking viewing:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Book a Viewing
          </h2>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Previous month"
            aria-label="Previous month"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Next month"
            aria-label="Next month"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 p-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {monthDays.map((day, index) => {
            const isAvailable = isDateAvailable(day);
            const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={!isAvailable}
                className={`
                  p-2 text-center rounded-full
                  ${isToday(day) ? 'border border-blue-600' : ''}
                  ${isSelected ? 'bg-blue-600 text-white' : ''}
                  ${
                    isAvailable
                      ? 'hover:bg-blue-50 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed bg-gray-50'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Selected viewing date:{' '}
              <span className="font-medium">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </span>
            </p>
          </div>
        )}

        {/* Book Viewing Button */}
        <button
          onClick={handleBookViewing}
          disabled={!selectedDate}
          className={`
            w-full mt-4 py-2 px-4 rounded-lg font-medium
            ${
              selectedDate
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Book Viewing
        </button>

        <p className="mt-3 text-xs text-gray-500 text-center">
          Available from {format(availableFrom, 'MMMM d, yyyy')}
        </p>
      </div>
    </div>
  );
}
