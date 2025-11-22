import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { TrendingUp, Calendar, Award, AlertTriangle } from 'lucide-react';

export const Analytics = () => {
  const { subjects, records } = useApp();

  // --- Stats Calculations ---

  // 1. Calculate Streak (consecutive records that are 'Present')
  const currentStreak = useMemo(() => {
    const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    // Simple logic: Count consecutive 'Present' records from the most recent.
    // In a real app, we'd check consecutive *days*, but this is a good approximation for the mockup.
    for (const record of sortedRecords) {
        if (record.status === 'Present') streak++;
        else break;
    }
    return streak;
  }, [records]);

  // 2. Best and Worst Subjects
  const sortedSubjects = [...subjects].sort((a, b) => {
    const pctA = (a.attendedClasses / a.totalClasses) || 0;
    const pctB = (b.attendedClasses / b.totalClasses) || 0;
    return pctB - pctA;
  });
  const bestSubject = sortedSubjects[0];
  const worstSubject = sortedSubjects[sortedSubjects.length - 1];

  // 3. Overall Breakdown Data for Pie Chart
  const totalPresent = subjects.reduce((acc, s) => acc + s.attendedClasses, 0);
  const totalClasses = subjects.reduce((acc, s) => acc + s.totalClasses, 0);
  const totalAbsent = totalClasses - totalPresent;
  
  const pieData = [
    { name: 'Present', value: totalPresent, color: '#4A90A4' },
    { name: 'Absent', value: totalAbsent, color: '#FCA5A5' },
  ];

  // 4. Mock Weekly Trend Data
  const trendData = [
    { name: 'Mon', attendance: 85 },
    { name: 'Tue', attendance: 92 },
    { name: 'Wed', attendance: 78 },
    { name: 'Thu', attendance: 90 },
    { name: 'Fri', attendance: 88 },
    { name: 'Sat', attendance: 60 },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A32] mb-2">Detailed Analytics</h1>
        <p className="text-gray-500">Deep dive into your attendance metrics.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-[#FFD29D] to-[#FFC078] p-6 rounded-3xl text-[#1E2A32] shadow-lg shadow-orange-100 relative overflow-hidden"
        >
            <div className="absolute -right-4 -top-4 opacity-20"><Award size={100}/></div>
            <div className="relative z-10">
                <p className="font-bold opacity-70 uppercase text-xs tracking-wider mb-1">Current Streak</p>
                <h3 className="text-4xl font-extrabold">{currentStreak}</h3>
                <p className="text-sm font-medium mt-1">Classes in a row!</p>
            </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
             <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Best Performer</p>
             <h3 className="text-xl font-bold text-[#4A90A4] mb-1">{bestSubject?.name || 'N/A'}</h3>
             <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div style={{ width: `${(bestSubject?.attendedClasses / bestSubject?.totalClasses * 100) || 0}%`}} className="h-full bg-[#4A90A4] rounded-full" />
                </div>
                <span className="text-xs font-bold text-gray-600">{Math.round((bestSubject?.attendedClasses / bestSubject?.totalClasses * 100) || 0)}%</span>
             </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
             <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Needs Attention</p>
             <h3 className="text-xl font-bold text-red-500 mb-1">{worstSubject?.name || 'N/A'}</h3>
             <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div style={{ width: `${(worstSubject?.attendedClasses / worstSubject?.totalClasses * 100) || 0}%`}} className="h-full bg-red-400 rounded-full" />
                </div>
                <span className="text-xs font-bold text-gray-600">{Math.round((worstSubject?.attendedClasses / worstSubject?.totalClasses * 100) || 0)}%</span>
             </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#4A90A4]" />
                Weekly Trend
            </h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4A90A4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4A90A4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'}}
                        />
                        <Area type="monotone" dataKey="attendance" stroke="#4A90A4" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Overall Breakdown Pie */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-[#4A90A4]" />
                Attendance Breakdown
            </h3>
            <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Heatmap Placeholder (Visual only representation) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Attendance Heatmap (Last 30 Days)</h3>
          <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 30 }).map((_, i) => {
                  // Randomly generate status for visual effect
                  const status = Math.random() > 0.2 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late');
                  let color = 'bg-green-400';
                  if(status === 'absent') color = 'bg-red-300';
                  if(status === 'late') color = 'bg-yellow-300';
                  
                  return (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={`w-8 h-8 rounded-lg ${color} opacity-80 hover:opacity-100 cursor-pointer transition-opacity`}
                        title={`Day ${i+1}: ${status}`}
                      />
                  )
              })}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400"></div> Present</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-300"></div> Late</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-300"></div> Absent</span>
          </div>
      </div>
    </div>
  );
};