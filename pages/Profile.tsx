import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Book, Award, Settings, Bell, LogOut, Send, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const Profile = () => {
  const { user, logout, addNotification } = useApp();
  const [teacherMsg, setTeacherMsg] = useState('');
  const [msgType, setMsgType] = useState<'info' | 'warning' | 'success'>('info');

  const handleSendTeacherNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherMsg) return;

    addNotification({
        title: 'Faculty Message 👨‍🏫',
        message: teacherMsg,
        type: msgType
    });
    
    setTeacherMsg('');
    alert('Notification sent! Check the Notifications tab.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <h1 className="text-2xl font-bold text-[#1E2A32]">Student Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-[#E3F2F4] flex items-center justify-center border-4 border-white shadow-lg">
                    <User size={64} className="text-[#4A90A4]" />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#4A90A4] p-2 rounded-full text-white border-2 border-white">
                    <Settings size={16} />
                </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3">
                <div>
                    <h2 className="text-2xl font-bold text-[#1E2A32]">{user?.name}</h2>
                    <p className="text-gray-400 font-medium">
                        {user?.role === 'student' ? 'Student ID: 2023-CS-042' : 'Faculty ID: FAC-001'}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {user?.role === 'student' ? (
                        <>
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Book size={16} className="text-[#4A90A4]" />
                                {user.course}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                                <Award size={16} className="text-[#FFD29D]" />
                                {user.year}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Book size={16} className="text-[#4A90A4]" />
                            {user && 'department' in user ? user.department : 'Department N/A'}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Mail size={16} className="text-gray-400" />
                        {user?.email}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Settings Column */}
            <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Settings size={20} className="text-gray-400" />
                        App Settings
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                            <span className="text-gray-600 font-medium">Dark Mode</span>
                            <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                            <span className="text-gray-600 font-medium">Daily Reminders</span>
                            <div className="w-10 h-6 bg-[#4A90A4] rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                             <span className="text-gray-600 font-medium">Export Report (PDF)</span>
                             <span className="text-xs bg-[#E3F2F4] text-[#4A90A4] font-bold px-2 py-1 rounded">PRO</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={logout}
                    className="w-full py-4 rounded-2xl border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>

            {/* Faculty / Dev Mode Column */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E3F2F4] rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none" />
                
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#4A90A4]">
                    <Shield size={20} />
                    Faculty Dashboard <span className="text-xs bg-[#E3F2F4] px-2 py-0.5 rounded text-[#4A90A4]">DEMO</span>
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                    Simulate a notification sent by a teacher or admin to the student.
                </p>

                <form onSubmit={handleSendTeacherNotification} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Message</label>
                        <textarea 
                            rows={3}
                            className="w-full mt-1 p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#4A90A4]/20 outline-none resize-none text-sm"
                            placeholder="e.g. 'Class for Data Structures is cancelled tomorrow due to illness.'"
                            value={teacherMsg}
                            onChange={(e) => setTeacherMsg(e.target.value)}
                        />
                    </div>
                    
                    <div>
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Priority</label>
                         <div className="flex gap-2 mt-1">
                             {['info', 'warning', 'success'].map((t) => (
                                 <button
                                    key={t}
                                    type="button"
                                    onClick={() => setMsgType(t as any)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${msgType === t ? 'bg-[#1E2A32] text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                 >
                                     {t}
                                 </button>
                             ))}
                         </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={!teacherMsg}
                        className="w-full py-3 bg-[#4A90A4] text-white rounded-xl font-bold shadow-lg shadow-[#4A90A4]/20 hover:bg-[#3B7D91] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                        Send Notification
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};