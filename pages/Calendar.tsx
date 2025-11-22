import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Calendar = () => {
  const { records } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  // Helper to find status for a day
  const getStatusForDay = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    // Find if ANY class was missed that day
    const dayRecords = records.filter(r => r.date === dateStr);
    if (dayRecords.length === 0) return 'none';
    const hasAbsent = dayRecords.some(r => r.status === 'Absent');
    return hasAbsent ? 'absent' : 'present';
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#1E2A32]">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-gray-400 text-sm font-medium uppercase tracking-wider">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {emptyDays.map(d => <div key={`empty-${d}`} />)}
        {days.map(day => {
          const status = getStatusForDay(day);
          let bgClass = 'bg-gray-50 text-gray-700';
          if (status === 'present') bgClass = 'bg-green-100 text-green-700 font-bold';
          if (status === 'absent') bgClass = 'bg-red-100 text-red-700 font-bold';

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square rounded-2xl flex items-center justify-center text-sm cursor-pointer transition-colors ${bgClass}`}
            >
              {day}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-8 flex gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-500">All Present</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-500">Missed Class</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-gray-500">No Data</span>
        </div>
      </div>
    </div>
  );
};
