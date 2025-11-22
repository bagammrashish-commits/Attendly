import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';

export const Notifications = () => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  const getIcon = (type: string) => {
    switch(type) {
        case 'warning': return <AlertTriangle size={24} className="text-amber-500" />;
        case 'success': return <CheckCircle size={24} className="text-green-500" />;
        default: return <Info size={24} className="text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
        case 'warning': return 'bg-amber-50';
        case 'success': return 'bg-green-50';
        default: return 'bg-blue-50';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#1E2A32]">Notifications</h1>
                <div className="bg-[#4A90A4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {notifications.length}
                </div>
            </div>
            {notifications.length > 0 && (
                <button 
                    onClick={clearNotifications}
                    className="text-gray-400 hover:text-red-500 flex items-center gap-2 text-sm transition-colors"
                >
                    <Trash2 size={16} /> Clear All
                </button>
            )}
        </div>

        {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Bell size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">No notifications yet</h3>
                <p className="text-gray-400 max-w-xs mt-2">We'll let you know when something important happens with your attendance.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {notifications.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => markNotificationRead(item.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${item.read ? 'bg-white border-gray-100' : 'bg-white border-l-4 border-l-[#4A90A4] shadow-md'}`}
                    >
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-full h-fit shrink-0 ${getBgColor(item.type)}`}>
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold ${item.read ? 'text-gray-600' : 'text-gray-800'}`}>{item.title}</h4>
                                    <span className="text-xs text-gray-400">{item.date}</span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.message}</p>
                            </div>
                        </div>
                        {!item.read && (
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#4A90A4]" />
                        )}
                    </motion.div>
                ))}
            </div>
        )}
    </div>
  );
};