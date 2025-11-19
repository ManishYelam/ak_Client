import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaExclamationTriangle,
  FaChevronLeft, 
  FaChevronRight,
  FaPlus,
  FaFilter,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaBell,
  FaShare
} from "react-icons/fa";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month"); // "month", "week", "day"
  const [showEventModal, setShowEventModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get user role from localStorage or context
  const [userRole, setUserRole] = useState("client"); // Default to client

  useEffect(() => {
    // Get user role from localStorage or your auth context
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  const [events, setEvents] = useState([
    { 
      id: 1,
      case: "Case No. 123/2024 - Sharma vs Kumar", 
      date: "2024-12-10",
      time: "10:30 AM",
      endTime: "11:30 AM",
      court: "Session Court, Mumbai",
      judge: "Hon. Justice R. Sharma",
      status: "Hearing",
      priority: "high",
      type: "criminal",
      client: "Rajesh Sharma",
      advocate: "Adv. Priya Patel",
      description: "Bail hearing for the accused",
      reminders: ["1 day before", "1 hour before"],
      documents: 3
    },
    { 
      id: 2,
      case: "Case No. 456/2024 - Property Dispute", 
      date: "2024-12-15",
      time: "2:15 PM",
      endTime: "4:15 PM",
      court: "High Court, Delhi",
      judge: "Hon. Justice S. Verma",
      status: "Arguments",
      priority: "medium",
      type: "civil",
      client: "Amit Kumar",
      advocate: "Adv. Rohit Singh",
      description: "Final arguments in property dispute case",
      reminders: ["2 days before"],
      documents: 5
    },
    { 
      id: 3,
      case: "Case No. 789/2024 - Divorce Case", 
      date: "2024-12-18",
      time: "11:00 AM",
      endTime: "12:30 PM",
      court: "District Court, Pune",
      judge: "Hon. Justice M. Joshi",
      status: "Evidence",
      priority: "low",
      type: "family",
      client: "Neha Gupta",
      advocate: "Adv. Priya Patel",
      description: "Cross-examination of witness",
      reminders: [],
      documents: 2
    },
    { 
      id: 4,
      case: "Case No. 101/2024 - Corporate Matter", 
      date: "2024-12-20",
      time: "9:30 AM",
      endTime: "10:30 AM",
      court: "Commercial Court, Bangalore",
      judge: "Hon. Justice K. Reddy",
      status: "Hearing",
      priority: "high",
      type: "corporate",
      client: "Tech Solutions Ltd.",
      advocate: "Adv. Rohit Singh",
      description: "Preliminary hearing for contract dispute",
      reminders: ["1 week before", "1 day before"],
      documents: 4
    },
    { 
      id: 5,
      case: "Case No. 202/2024 - Recovery Suit", 
      date: "2024-12-22",
      time: "3:00 PM",
      endTime: "4:00 PM",
      court: "Civil Court, Chennai",
      judge: "Hon. Justice P. Iyer",
      status: "Arguments",
      priority: "medium",
      type: "civil",
      client: "Bank of India",
      advocate: "Adv. Priya Patel",
      description: "Recovery suit for outstanding loan amount",
      reminders: ["3 days before"],
      documents: 6
    }
  ]);

  // Filter events based on search and priority
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.case.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.court.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || event.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Get today's events
  const todayEvents = filteredEvents.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.date === today;
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return eventDate > today && eventDate <= nextWeek;
  });

  // Get events for selected date
  const selectedDateEvents = filteredEvents.filter(event => 
    event.date === selectedDate.toISOString().split('T')[0]
  );

  // Calendar navigation
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Hearing': 'bg-blue-100 text-blue-800',
      'Arguments': 'bg-purple-100 text-purple-800',
      'Evidence': 'bg-orange-100 text-orange-800',
      'Judgment': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      'criminal': 'bg-red-50 text-red-700 border-red-200',
      'civil': 'bg-blue-50 text-blue-700 border-blue-200',
      'family': 'bg-pink-50 text-pink-700 border-pink-200',
      'corporate': 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = filteredEvents.filter(event => event.date === dateString);
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        events: dayEvents
      });
    }
    
    // Next month days
    const totalDays = 42; // 6 weeks
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
        events: []
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleAddEvent = () => {
    setShowEventModal(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const handleEditEvent = (event) => {
    // Implement edit functionality
    console.log("Edit event:", event);
  };

  const handleViewDetails = (event) => {
    // Implement view details functionality
    console.log("View details:", event);
  };

  // Check if user can add events (not client)
  const canAddEvents = userRole !== "client";

  return (
    <DashboardLayout>
      <div className="m-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaCalendarAlt className="text-blue-600" />
              Court Calendar
            </h1>
            <p className="text-gray-600 mt-2">
              {userRole === "client" 
                ? "View your upcoming court hearings and schedules" 
                : "Manage and track court hearings and schedules"
              }
            </p>
          </div>
          
          {/* Conditionally render Add Hearing button */}
          {canAddEvents && (
            <div className="flex gap-3">
              <Button 
                onClick={handleAddEvent}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <FaPlus size={14} />
                Add Hearing
              </Button>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Today's Hearings</p>
                <p className="text-2xl font-bold text-blue-800">{todayEvents.length}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <FaClock className="text-blue-600" size={20} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Upcoming (7 days)</p>
                <p className="text-2xl font-bold text-green-800">{upcomingEvents.length}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <FaCalendarAlt className="text-green-600" size={20} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">High Priority</p>
                <p className="text-2xl font-bold text-red-800">
                  {events.filter(e => e.priority === 'high').length}
                </p>
              </div>
              <div className="bg-red-200 p-3 rounded-full">
                <FaExclamationTriangle className="text-red-600" size={20} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Different Courts</p>
                <p className="text-2xl font-bold text-purple-800">
                  {[...new Set(events.map(e => e.court))].length}
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <FaMapMarkerAlt className="text-purple-600" size={20} />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases, clients, courts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setView("month")}
                  className={`px-4 py-3 ${view === "month" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView("week")}
                  className={`px-4 py-3 ${view === "week" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView("day")}
                  className={`px-4 py-3 ${view === "day" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Day
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Calendar View */}
        {view === "month" && (
          <Card className="p-6 mb-6">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-800">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-all ${
                    day.isCurrentMonth
                      ? day.isToday
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  } ${
                    selectedDate.toDateString() === day.date.toDateString()
                      ? 'ring-2 ring-blue-500 border-blue-500'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setView("day");
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${
                      day.isToday ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {day.date.getDate()}
                    </span>
                    {day.events.length > 0 && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  
                  {/* Events for the day */}
                  <div className="space-y-1">
                    {day.events.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded ${
                          event.priority === 'high' ? 'bg-red-100 text-red-800' :
                          event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        <div className="font-medium truncate">{event.time}</div>
                        <div className="truncate">{event.case.split(' - ')[0]}</div>
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{day.events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Today's Cases Section */}
        {todayEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              Today's Hearings
              <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                {todayEvents.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {todayEvents.map(event => (
                <Card key={event.id} className="border-l-4 border-l-red-500 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{event.case}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                      {event.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" size={12} />
                      <span>{event.time} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" size={12} />
                      <span className="flex-1">{event.court}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBell className="text-gray-400" size={12} />
                      <span>Judge: {event.judge}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs border ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    
                    {/* Conditionally show action buttons based on role */}
                    {canAddEvents ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleViewDetails(event)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                      >
                        Details <FaEye size={12} />
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Cases Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Upcoming Hearings (Next 7 Days)
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
                {upcomingEvents.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcomingEvents.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{event.case}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                      {event.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" size={12} />
                      <span>{new Date(event.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" size={12} />
                      <span>{event.time} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" size={12} />
                      <span className="flex-1">{event.court}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs border ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(event)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                    >
                      Details <FaEye size={12} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Cases Table View */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              All Scheduled Cases
              <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                {filteredEvents.length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court & Judge</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  
                  {/* Conditionally show Actions column */}
                  {canAddEvents && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{event.case}</div>
                        <div className="text-xs text-gray-500 mt-1">{event.client}</div>
                        <div className="text-xs text-gray-400">Advocate: {event.advocate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">{event.time} - {event.endTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{event.court}</div>
                      <div className="text-xs text-gray-500">{event.judge}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                    </td>
                    
                    {/* Conditionally show action buttons */}
                    {canAddEvents && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(event)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Card className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <FaCalendarAlt size={80} className="mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Court Hearings Scheduled</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || filterPriority !== "all"
                ? "No hearings match your search criteria. Try adjusting your filters."
                : userRole === "client"
                ? "You don't have any court hearings scheduled at the moment."
                : "Get started by scheduling your first court hearing to keep track of your legal calendar."
              }
            </p>
            <div className="flex gap-3 justify-center">
              {/* Only show Add Hearing button for non-client users */}
              {canAddEvents && (
                <Button 
                  onClick={handleAddEvent}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <FaPlus size={14} />
                  Schedule Hearing
                </Button>
              )}
              {(searchTerm || filterPriority !== "all") && (
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterPriority("all");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Calendar;