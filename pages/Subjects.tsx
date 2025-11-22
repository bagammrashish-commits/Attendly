import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, BookOpen, AlertCircle, Plus, X, User } from 'lucide-react';

export const Subjects = () => {
  const { subjects, addSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newSubject, setNewSubject] = useState({
    name: '',
    faculty: '',
    totalClasses: 0,
    attendedClasses: 0,
    targetPercentage: 75,
    color: '#4A90A4'
  });

  const handleAddSubject = (e: React.FormEvent) => {
      e.preventDefault();
      if(newSubject.name && newSubject.faculty) {
          addSubject(newSubject);
          setIsModalOpen(false);
          setNewSubject({ name: '', faculty: '', totalClasses: 0, attendedClasses: 0, targetPercentage: 75, color: '#4A90A4' });
      }
  };

  const colors = ['#4A90A4', '#FFD29D', '#818CF8', '#34D399', '#F472B6', '#FDE047'];

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#1E2A32]">Your Subjects</h1>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#4A90A4] text-white font-medium hover:bg-[#3B7D91] px-4 py-2 rounded-xl transition-colors shadow-lg shadow-[#4A90A4]/20 flex items-center gap-2"
            >
                <Plus size={18}/> Add Subject
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => {
                const percentage = subject.totalClasses > 0 ? Math.round((subject.attendedClasses / subject.totalClasses) * 100) : 0;
                const isLow = percentage < subject.targetPercentage;
                const classesNeeded = Math.ceil(((subject.targetPercentage / 100) * subject.totalClasses - subject.attendedClasses) / (1 - (subject.targetPercentage/100)));
                const safeMessage = classesNeeded > 0 
                    ? `Attend next ${classesNeeded} classes to safe zone` 
                    : 'You are in the safe zone';

                return (
                    <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className={`bg-white rounded-3xl p-6 shadow-sm border ${isLow ? 'border-red-100 ring-2 ring-red-50' : 'border-gray-100'} relative group cursor-pointer flex flex-col`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-opacity-20 ${isLow ? 'text-red-500 bg-red-100' : 'text-white'}`} style={!isLow ? { backgroundColor: `${subject.color}20` } : {}}>
                                {isLow ? <AlertCircle size={24} /> : <BookOpen size={24} color={subject.color} />}
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <h3 className="font-bold text-xl text-gray-800 mb-6">{subject.name}</h3>

                        <div className="space-y-3 flex-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Progress</span>
                                <span className={`font-bold ${isLow ? 'text-red-500' : 'text-green-500'}`}>
                                    {percentage}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full rounded-full ${isLow ? 'bg-[#FCA5A5]' : 'bg-[#4A90A4]'}`} 
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 pt-2">
                                <span>{subject.attendedClasses}/{subject.totalClasses} Attended</span>
                            </div>
                            
                            <div className={`text-xs px-3 py-2 rounded-lg mt-2 ${isLow ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                {isLow ? safeMessage : "Great attendance! Keep it up."}
                            </div>
                        </div>

                        {/* Footer Section: Faculty, Target, Tag */}
                        <div className="mt-6 pt-4 border-t border-gray-50 grid grid-cols-3 gap-2">
                             <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Faculty</p>
                                <div className="flex items-center gap-1.5">
                                    <User size={14} className="text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-700 truncate" title={subject.faculty}>
                                        {subject.faculty.split(' ')[0]}..
                                    </p>
                                </div>
                             </div>
                             <div className="text-center border-l border-gray-50">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Target</p>
                                <p className="text-xs font-semibold text-gray-700">{subject.targetPercentage}%</p>
                             </div>
                             <div className="flex flex-col items-end border-l border-gray-50 pl-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Color</p>
                                <div className="w-12 h-4 rounded-full" style={{ backgroundColor: subject.color, opacity: 0.4 }}></div>
                             </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* Add Subject Modal */}
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#1E2A32]">Add New Subject</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Subject Name</label>
                                <input 
                                    required
                                    value={newSubject.name}
                                    onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border-transparent focus:bg-white focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
                                    placeholder="e.g. Advanced Physics"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Faculty Name</label>
                                <input 
                                    required
                                    value={newSubject.faculty}
                                    onChange={e => setNewSubject({...newSubject, faculty: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border-transparent focus:bg-white focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
                                    placeholder="e.g. Dr. Robert Langdon"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Total Classes</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={newSubject.totalClasses}
                                        onChange={e => setNewSubject({...newSubject, totalClasses: parseInt(e.target.value) || 0})}
                                        className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border-transparent focus:bg-white focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Attended</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        max={newSubject.totalClasses}
                                        value={newSubject.attendedClasses}
                                        onChange={e => setNewSubject({...newSubject, attendedClasses: parseInt(e.target.value) || 0})}
                                        className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border-transparent focus:bg-white focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Color Tag</label>
                                <div className="flex gap-2">
                                    {colors.map(c => (
                                        <button
                                            type="button"
                                            key={c}
                                            onClick={() => setNewSubject({...newSubject, color: c})}
                                            className={`w-8 h-8 rounded-full transition-transform ${newSubject.color === c ? 'scale-110 ring-2 ring-offset-2 ring-[#4A90A4]' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full mt-4 py-3 bg-[#4A90A4] text-white rounded-xl font-bold shadow-lg shadow-[#4A90A4]/30 hover:bg-[#3B7D91] transition-colors"
                            >
                                Save Subject
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};
