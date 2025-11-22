import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, User, GraduationCap, Briefcase } from 'lucide-react';

export const Login = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) login(email, name, loginType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#E3F2F4] rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FFD29D] rounded-full blur-3xl opacity-30" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/70 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-xl border border-white/50 w-full max-w-md mx-4"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-[#4A90A4] text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#4A90A4]/30"
          >
            <CheckCircle size={40} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-bold text-[#1E2A32] mb-1">Attendly</h1>
          <p className="text-gray-500 text-sm font-medium">Track Better. Attend Smarter.</p>
        </div>

        {/* Login Type Toggle */}
        <div className="bg-gray-100 p-1 rounded-xl flex mb-6 relative">
            <motion.div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
                animate={{ x: loginType === 'student' ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
                onClick={() => setLoginType('student')}
                className={`flex-1 py-2 text-sm font-bold z-10 relative transition-colors flex items-center justify-center gap-2 ${loginType === 'student' ? 'text-[#1E2A32]' : 'text-gray-400'}`}
            >
                <GraduationCap size={16} /> Student
            </button>
            <button 
                onClick={() => setLoginType('teacher')}
                className={`flex-1 py-2 text-sm font-bold z-10 relative transition-colors flex items-center justify-center gap-2 ${loginType === 'teacher' ? 'text-[#1E2A32]' : 'text-gray-400'}`}
            >
                <Briefcase size={16} /> Teacher
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
             <label className="block text-sm font-medium text-gray-600 mb-2">
                 {loginType === 'student' ? 'Student Name' : 'Faculty Name'}
             </label>
             <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                 <input 
                   type="text" 
                   required
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
                   placeholder={loginType === 'student' ? 'John Doe' : 'Prof. Smith'}
                 />
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
                {loginType === 'student' ? 'College Email' : 'Faculty Email'}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
              placeholder={loginType === 'student' ? 'student@college.edu' : 'faculty@college.edu'}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <a href="#" className="text-xs text-[#4A90A4] font-medium hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 bg-[#4A90A4] text-white rounded-xl font-bold shadow-lg shadow-[#4A90A4]/30 flex items-center justify-center gap-2 overflow-hidden group"
          >
            <span className="relative z-10">
                {loginType === 'student' ? 'Login to Student Portal' : 'Login to Faculty Portal'}
            </span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          By logging in, you agree to our Terms & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};