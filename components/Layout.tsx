import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, BookOpen, CheckCircle, 
  BarChart2, Bell, User, LogOut, Menu, X, Users, MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout, notifications } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BookOpen, label: 'Subjects', path: '/subjects' },
    // Removed Mark Attendance
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const teacherNavItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Users, label: 'My Classes', path: '/classes' }, // Mock route
    { icon: Calendar, label: 'Schedule', path: '/calendar' },
    { icon: MessageSquare, label: 'Requests', path: '/requests' }, // Mock route
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-2 text-[#4A90A4]">
          <div className="bg-[#4A90A4] text-white p-2 rounded-lg">
            <CheckCircle size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Attendly</span>
        </div>
        {user?.role === 'teacher' && (
            <span className="ml-10 text-xs font-bold text-[#FFD29D] uppercase tracking-widest bg-[#1E2A32] px-2 py-0.5 rounded">Faculty</span>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                isActive 
                  ? 'bg-[#4A90A4] text-white shadow-lg shadow-[#4A90A4]/20' 
                  : 'text-gray-500 hover:bg-[#E3F2F4] hover:text-[#4A90A4]'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.badge ? (
                <span className="absolute right-4 bg-[#FFD29D] text-[#1E2A32] text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 border-b px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[#4A90A4]">
            <div className="bg-[#4A90A4] text-white p-1.5 rounded-lg">
              <CheckCircle size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold">Attendly</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-white z-40 md:hidden pt-16"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};