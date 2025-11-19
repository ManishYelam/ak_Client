import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

// Date utility functions
const getDateRange = (filterType) => {
  const today = new Date();
  const start = new Date();
  const end = new Date();

  switch (filterType) {
    case 'today':
      return { start: today, end: today };
    
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: yesterday };
    
    case 'this_week':
      start.setDate(today.getDate() - today.getDay());
      end.setDate(today.getDate() + (6 - today.getDay()));
      return { start, end };
    
    case 'last_week':
      start.setDate(today.getDate() - today.getDay() - 7);
      end.setDate(today.getDate() - today.getDay() - 1);
      return { start, end };
    
    case 'this_month':
      start.setDate(1);
      end.setMonth(today.getMonth() + 1, 0);
      return { start, end };
    
    case 'last_month':
      start.setMonth(today.getMonth() - 1, 1);
      end.setMonth(today.getMonth(), 0);
      return { start, end };
    
    case 'this_year':
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      return { start, end };
    
    case 'last_year':
      start.setFullYear(today.getFullYear() - 1, 0, 1);
      end.setFullYear(today.getFullYear() - 1, 11, 31);
      return { start, end };
    
    case 'last_7_days':
      start.setDate(today.getDate() - 7);
      return { start, end: today };
    
    case 'last_30_days':
      start.setDate(today.getDate() - 30);
      return { start, end: today };
    
    case 'last_90_days':
      start.setDate(today.getDate() - 90);
      return { start, end: today };
    
    default:
      return { start: null, end: null };
  }
};

const formatDateForDisplay = (dateFilter, dateValue) => {
  if (!dateFilter) return "Select Date Filter";
  
  const displayNames = {
    'today': 'Today',
    'yesterday': 'Yesterday',
    'this_week': 'This Week',
    'last_week': 'Last Week',
    'this_month': 'This Month',
    'last_month': 'Last Month',
    'this_year': 'This Year',
    'last_year': 'Last Year',
    'last_7_days': 'Last 7 Days',
    'last_30_days': 'Last 30 Days',
    'last_90_days': 'Last 90 Days',
    'specific_date': `Date: ${dateValue}`,
    'date_range': `Range: ${dateValue}`,
  };

  return displayNames[dateFilter] || dateFilter;
};

const DateFilterDropdown = ({ 
  value = { filterType: '', value: '' }, 
  onChange, 
  placeholder = "Select Date Filter",
  className = "",
  size = "md" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2 py-1 text-[9px]',
    lg: 'px-3 py-2 text-sm'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterSelect = useCallback((filterType) => {
    if (filterType === 'specific_date') {
      onChange({
        filterType,
        value: new Date().toISOString().split('T')[0] // Default to today
      });
    } else if (filterType === 'date_range') {
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const defaultStart = sevenDaysAgo.toISOString().split('T')[0];
      
      onChange({
        filterType,
        value: `${defaultStart} to ${today}`
      });
    } else {
      onChange({
        filterType,
        value: ""
      });
    }
    setIsOpen(false);
  }, [onChange]);

  const handleSpecificDateChange = (e) => {
    onChange({
      filterType: 'specific_date',
      value: e.target.value
    });
  };

  const handleDateRangeChange = (type, dateValue) => {
    const currentRange = value.value ? value.value.split(' to ') : ['', ''];
    
    let newValue;
    if (type === 'start') {
      newValue = `${dateValue} to ${currentRange[1] || dateValue}`;
    } else {
      newValue = `${currentRange[0] || dateValue} to ${dateValue}`;
    }
    
    onChange({
      filterType: 'date_range',
      value: newValue
    });
  };

  const clearFilter = () => {
    onChange({
      filterType: "",
      value: ""
    });
    setIsOpen(false);
  };

  const quickFilters = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_year', label: 'Last Year' },
  ];

  const recentPeriods = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded bg-white hover:border-green-500 focus:border-green-500 focus:outline-none flex items-center justify-between ${sizes[size]}`}
        aria-label="Open date filter options"
      >
        <span className="truncate">
          {value.filterType 
            ? formatDateForDisplay(value.filterType, value.value)
            : placeholder
          }
        </span>
        <FaCalendarAlt size={size === 'sm' ? 10 : 12} className="text-gray-500 flex-shrink-0 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px] max-w-[280px]">
          {/* Header */}
          <div className="p-2 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className={`font-semibold text-gray-700 ${size === 'sm' ? 'text-[8px]' : 'text-[9px]'}`}>
                Date Filters
              </span>
              {value.filterType && (
                <button
                  onClick={clearFilter}
                  className={`text-red-500 hover:text-red-700 ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'}`}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {/* Quick Date Options */}
            <div className="p-2">
              <div className={`font-semibold text-gray-500 mb-1 ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'}`}>
                QUICK FILTERS
              </div>
              <div className="space-y-0.5">
                {quickFilters.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(option.value)}
                    className={`w-full text-left px-2 py-1 hover:bg-green-50 rounded ${
                      value.filterType === option.value ? 'bg-green-100 text-green-800' : ''
                    } ${size === 'sm' ? 'text-[8px]' : 'text-[9px]'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Time Periods */}
            <div className="p-2 border-t border-gray-100">
              <div className={`font-semibold text-gray-500 mb-1 ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'}`}>
                RECENT PERIODS
              </div>
              <div className="space-y-0.5">
                {recentPeriods.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(option.value)}
                    className={`w-full text-left px-2 py-1 hover:bg-green-50 rounded ${
                      value.filterType === option.value ? 'bg-green-100 text-green-800' : ''
                    } ${size === 'sm' ? 'text-[8px]' : 'text-[9px]'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Options */}
            <div className="p-2 border-t border-gray-100">
              <div className={`font-semibold text-gray-500 mb-1 ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'}`}>
                CUSTOM DATES
              </div>
              
              {/* Specific Date */}
              <div className="mb-2">
                <button
                  onClick={() => handleFilterSelect('specific_date')}
                  className={`w-full text-left px-2 py-1 hover:bg-green-50 rounded ${
                    value.filterType === 'specific_date' ? 'bg-green-100 text-green-800' : ''
                  } ${size === 'sm' ? 'text-[8px]' : 'text-[9px]'}`}
                >
                  Specific Date
                </button>
                {value.filterType === 'specific_date' && (
                  <div className="mt-1 px-2">
                    <input
                      type="date"
                      value={value.value}
                      onChange={handleSpecificDateChange}
                      className={`w-full border rounded ${size === 'sm' ? 'px-1 py-0.5 text-[7px]' : 'px-1 py-0.5 text-[8px]'}`}
                    />
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div>
                <button
                  onClick={() => handleFilterSelect('date_range')}
                  className={`w-full text-left px-2 py-1 hover:bg-green-50 rounded ${
                    value.filterType === 'date_range' ? 'bg-green-100 text-green-800' : ''
                  } ${size === 'sm' ? 'text-[8px]' : 'text-[9px]'}`}
                >
                  Date Range
                </button>
                {value.filterType === 'date_range' && (
                  <div className="mt-1 px-2 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className={`text-gray-600 ${size === 'sm' ? 'text-[7px] w-10' : 'text-[8px] w-12'}`}>
                        From:
                      </span>
                      <input
                        type="date"
                        value={value.value ? value.value.split(' to ')[0] : ''}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className={`flex-1 border rounded ${size === 'sm' ? 'px-1 py-0.5 text-[7px]' : 'px-1 py-0.5 text-[8px]'}`}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-gray-600 ${size === 'sm' ? 'text-[7px] w-10' : 'text-[8px] w-12'}`}>
                        To:
                      </span>
                      <input
                        type="date"
                        value={value.value ? value.value.split(' to ')[1] : ''}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className={`flex-1 border rounded ${size === 'sm' ? 'px-1 py-0.5 text-[7px]' : 'px-1 py-0.5 text-[8px]'}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the utility functions for use in parent components
export { getDateRange, formatDateForDisplay };
export default DateFilterDropdown;