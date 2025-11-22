import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, CheckCircle } from 'lucide-react';

export const MarkAttendance = () => {
  const { subjects, markAttendance } = useApp();
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });

  const handleMark = (id: string, status: 'Present' | 'Absent' | 'Late') => {
    markAttendance(id, status);
    setToast({ message: `Marked as ${status}`, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-[#1E2A32] mb-2">Mark Attendance</h1>
            <p className="text-gray-500">Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</p>
        </div>

        <div className="space-y-4">
            {subjects.map((subject, index) => (
                <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h3 className="font-bold text-gray-800">{subject.name}</h3>
                        <p className="text-sm text-gray-500">{subject.faculty}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#F7F8FA] p-1.5 rounded-xl">
                        <button 
                            onClick={() => handleMark(subject.id, 'Present')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-white hover:text-green-600 hover:shadow-sm transition-all focus:bg-green-50 focus:text-green-600"
                        >
                            <Check size={16} /> Present
                        </button>
                        <button 
                            onClick={() => handleMark(subject.id, 'Absent')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all focus:bg-red-50 focus:text-red-500"
                        >
                            <X size={16} /> Absent
                        </button>
                        <button 
                            onClick={() => handleMark(subject.id, 'Late')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-white hover:text-yellow-500 hover:shadow-sm transition-all focus:bg-yellow-50 focus:text-yellow-600"
                        >
                            <Clock size={16} /> Late
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="mt-8 flex justify-center">
            <button className="text-sm text-[#4A90A4] font-medium hover:underline">
                Copy yesterday's pattern
            </button>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
            {toast.visible && (
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1E2A32] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50"
                >
                    <CheckCircle size={18} className="text-[#86EFAC]" />
                    <span className="font-medium text-sm">{toast.message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};