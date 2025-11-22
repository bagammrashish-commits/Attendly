import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, CheckCircle, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateAttendanceInsights } from '../services/geminiService';

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

export const Dashboard = () => {
  const { user, subjects } = useApp();
  const [aiAdvice, setAiAdvice] = useState<string>('Analyzing your attendance patterns...');
  const [loadingAi, setLoadingAi] = useState(true);

  const lowAttendanceSubjects = subjects.filter(s => {
    const percentage = s.totalClasses > 0 ? (s.attendedClasses / s.totalClasses) * 100 : 0;
    return percentage < 75;
  });

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingAi(true);
      const advice = await generateAttendanceInsights(subjects);
      setAiAdvice(advice);
      setLoadingAi(false);
    };
    fetchInsights();
  }, [subjects]);

  const totalClasses = subjects.reduce((acc, cur) => acc + cur.totalClasses, 0);
  const attendedClasses = subjects.reduce((acc, cur) => acc + cur.attendedClasses, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  const chartData = subjects.map(s => ({
    name: s.name.length > 10 ? s.name.substring(0, 8) + '..' : s.name,
    full: s.name,
    attendance: s.totalClasses > 0 ? Math.round((s.attendedClasses / s.totalClasses) * 100) : 0,
    color: s.color
  }));

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E2A32]">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500">Here's what's happening with your attendance today.</p>
        </div>
        {/* Removed Mark Attendance Button */}
      </div>

      {/* Alerts Banner */}
      {lowAttendanceSubjects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4 shadow-sm"
        >
          <div className="bg-red-100 text-red-500 p-2.5 rounded-full shrink-0 mt-1">
             <AlertTriangle size={24} />
           </div>
           <div className="flex-1">
             <h3 className="font-bold text-red-900 text-lg">Attendance Alert</h3>
             <p className="text-red-700/80 text-sm mt-1 leading-relaxed">
               You are falling behind the 75% requirement in <span className="font-bold">{lowAttendanceSubjects.length} subjects</span>. 
               Action is needed to avoid shortage.
             </p>
             <div className="flex flex-wrap gap-3 mt-4">
               {lowAttendanceSubjects.map(sub => {
                 const pct = Math.round((sub.attendedClasses/sub.totalClasses)*100);
                 return (
                   <Link key={sub.id} to="/subjects" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-colors shadow-sm">
                     <span>{sub.name}</span>
                     <span className="bg-red-100 px-1.5 rounded text-xs">{pct}%</span>
                   </Link>
                 );
               })}
             </div>
           </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Overall Attendance" 
          value={`${overallPercentage}%`} 
          subtext="Average across all subjects" 
          color="#4A90A4"
          icon={CheckCircle}
        />
        <StatCard 
          title="Classes Attended" 
          value={attendedClasses} 
          subtext={`Out of ${totalClasses} total classes`} 
          color="#FFD29D"
          icon={CalendarIcon}
        />
        <StatCard 
          title="At Risk Subjects" 
          value={lowAttendanceSubjects.length} 
          subtext="Subjects below 75%" 
          color="#FCA5A5"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Subject Overview</h3>
             <Link to="/subjects" className="text-sm text-[#4A90A4] font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight size={14}/>
             </Link>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}
                  itemStyle={{ color: '#1E2A32', fontWeight: 600 }}
                />
                <Bar dataKey="attendance" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.attendance >= 75 ? '#4A90A4' : '#FCA5A5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations / AI Box */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#4A90A4] to-[#3B7D91] p-6 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-[#4A90A4]/20"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={80} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-[#FFD29D]" />
              <span className="font-bold tracking-wide text-sm uppercase opacity-90">Smart AI Insights</span>
            </div>
            
            {loadingAi ? (
               <div className="animate-pulse flex space-x-4">
                 <div className="flex-1 space-y-4 py-1">
                   <div className="h-4 bg-white/30 rounded w-3/4"></div>
                   <div className="h-4 bg-white/30 rounded"></div>
                   <div className="h-4 bg-white/30 rounded w-5/6"></div>
                 </div>
               </div>
            ) : (
              <p className="text-white/90 text-sm leading-relaxed font-medium">
                {aiAdvice}
              </p>
            )}
            
            <button 
              onClick={() => setAiAdvice('Refreshing insights...')}
              className="mt-6 w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Refresh Analysis
            </button>
          </motion.div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              {/* Removed Mark Today Link */}
              <Link to="/calendar" className="flex items-center justify-between p-3 hover:bg-[#F7F8FA] rounded-xl group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF4E5] text-[#FFD29D] flex items-center justify-center">
                    <CalendarIcon size={20} />
                  </div>
                  <span className="font-medium text-gray-700">View Calendar</span>
                </div>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/subjects" className="flex items-center justify-between p-3 hover:bg-[#F7F8FA] rounded-xl group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E3F2F4] text-[#4A90A4] flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <span className="font-medium text-gray-700">View Subjects</span>
                </div>
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};