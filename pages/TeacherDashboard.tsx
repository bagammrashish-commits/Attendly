import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, Send, Calendar, CheckCircle, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, subtext, color, icon: Icon }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 text-[${color}]`}>
      <Icon size={60} />
    </div>
    <div className="z-10">
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-[#1E2A32] mb-1">{value}</h3>
      <p className="text-xs text-gray-400">{subtext}</p>
    </div>
  </motion.div>
);

export const TeacherDashboard = () => {
  const { user, addNotification } = useApp();
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [targetClass, setTargetClass] = useState('all');

  const handleBroadcast = (e: React.FormEvent) => {
      e.preventDefault();
      if(!broadcastMsg) return;
      
      // In a real app, this would send to backend. 
      // For demo, we just show a success notification to the teacher.
      addNotification({
          title: 'Announcement Sent',
          message: `Message sent to ${targetClass === 'all' ? 'all students' : targetClass}: "${broadcastMsg}"`,
          type: 'success'
      });
      setBroadcastMsg('');
  };

  const mockClasses = [
      { id: 'c1', name: 'Data Structures', time: '09:00 AM', students: 45, status: 'upcoming' },
      { id: 'c2', name: 'Algorithms', time: '11:30 AM', students: 42, status: 'completed' },
      { id: 'c3', name: 'Computer Networks', time: '02:00 PM', students: 38, status: 'upcoming' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E2A32]">
            Welcome, Professor {user?.name.split(' ')[1] || user?.name}! 👨‍🏫
          </h1>
          <p className="text-gray-500">Manage your classes and students from here.</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Students" 
          value="125" 
          subtext="Across 3 subjects" 
          color="#4A90A4"
          icon={Users}
        />
        <StatCard 
          title="Classes Today" 
          value="3" 
          subtext="1 completed, 2 remaining" 
          color="#FFD29D"
          icon={BookOpen}
        />
        <StatCard 
          title="Pending Requests" 
          value="5" 
          subtext="Leave applications" 
          color="#FCA5A5"
          icon={MessageSquare}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Class Schedule / List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Calendar size={20} className="text-[#4A90A4]"/> Today's Schedule
                </h3>
                <Link to="/calendar" className="text-sm text-[#4A90A4] font-medium hover:underline">View Calendar</Link>
              </div>

              <div className="space-y-4">
                  {mockClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${cls.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-[#E3F2F4] text-[#4A90A4]'}`}>
                                  {cls.name.charAt(0)}
                              </div>
                              <div>
                                  <h4 className="font-bold text-gray-800">{cls.name}</h4>
                                  <p className="text-sm text-gray-500 flex items-center gap-2">
                                      <Users size={14} /> {cls.students} Students • {cls.time}
                                  </p>
                              </div>
                          </div>
                          <div>
                              {cls.status === 'completed' ? (
                                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full flex items-center gap-1">
                                      <CheckCircle size={12} /> Completed
                                  </span>
                              ) : (
                                  <Link to="/classes" className="bg-[#1E2A32] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-colors inline-block">
                                      Start Class
                                  </Link>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Broadcast / Quick Actions */}
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Bell size={20} className="text-[#FFD29D]"/> Broadcast Message
                  </h3>
                  <form onSubmit={handleBroadcast} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Target Class</label>
                          <select 
                            value={targetClass}
                            onChange={(e) => setTargetClass(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-[#4A90A4]/20 outline-none"
                          >
                              <option value="all">All Classes</option>
                              <option value="Data Structures">Data Structures</option>
                              <option value="Algorithms">Algorithms</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Message</label>
                          <textarea 
                              value={broadcastMsg}
                              onChange={(e) => setBroadcastMsg(e.target.value)}
                              rows={3}
                              className="w-full p-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-[#4A90A4]/20 outline-none resize-none"
                              placeholder="e.g. Assignment deadline extended..."
                          />
                      </div>
                      <button 
                        type="submit"
                        disabled={!broadcastMsg}
                        className="w-full py-3 bg-[#4A90A4] text-white rounded-xl font-bold hover:bg-[#3B7D91] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                          <Send size={16} /> Send Alert
                      </button>
                  </form>
              </div>

              <div className="bg-[#E3F2F4] p-6 rounded-3xl border border-transparent">
                  <h3 className="font-bold text-[#4A90A4] mb-2">Student Lookup</h3>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Search student name..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-[#4A90A4]/20 outline-none text-sm"
                      />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};