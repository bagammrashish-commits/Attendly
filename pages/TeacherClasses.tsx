import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronLeft, Search, Filter, CheckCircle, XCircle, Clock, MoreVertical, Calendar, ArrowRight, Plus, X, UserPlus, Save } from 'lucide-react';

// Mock Data for Classes
const CLASSES = [
  { id: 'c1', name: 'Data Structures', code: 'CS-301', time: '09:00 AM - 10:00 AM', students: 45, avgAttendance: 82, color: '#4A90A4' },
  { id: 'c2', name: 'Computer Networks', code: 'CS-305', time: '02:00 PM - 03:00 PM', students: 38, avgAttendance: 65, color: '#FFD29D' },
  { id: 'c3', name: 'Operating Systems', code: 'CS-304', time: '10:00 AM - 11:00 AM', students: 40, avgAttendance: 88, color: '#34D399' },
  { id: 'c4', name: 'Mathematics III', code: 'MA-301', time: '01:00 PM - 02:00 PM', students: 42, avgAttendance: 76, color: '#818CF8' },
];

// Mapping Teacher Classes to Student Subject IDs (from constants.ts)
const SUBJECT_MAPPING: Record<string, string> = {
  'Data Structures': '1',
  'Computer Networks': '2',
  'Operating Systems': '3',
  'Mathematics III': '4',
  'Software Eng.': '5'
};

// Mock Data for Students
const STUDENTS = Array.from({ length: 15 }).map((_, i) => ({
  id: `s${i}`,
  name: ['Alex Rivera', 'Sarah Jones', 'Mike Chen', 'Emma Wilson', 'David Lee', 'Lisa Park', 'James Bond', 'Olivia Wilde', 'Noah Brown', 'Sophia Davis', 'Lucas Miller', 'Isabella Moore', 'Mason Taylor', 'Ava Anderson', 'Ethan Thomas'][i],
  roll: `CS-2023-${100 + i}`,
  attendance: Math.floor(Math.random() * (100 - 60) + 60), // Random between 60 and 100
  status: 'Present' as 'Present' | 'Absent' | 'Late'
}));

export const TeacherClasses = () => {
  const { markAttendance, addNotification } = useApp();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState(STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', roll: '' });

  // Toast State
  const [toast, setToast] = useState<{message: string, visible: boolean}>({ message: '', visible: false });

  const handleClassSelect = (id: string) => {
    setSelectedClass(id);
    // In a real app, fetch students for this class ID here
    // Reset statuses to default Present for the new view or fetch from backend
    setStudents(STUDENTS.map(s => ({...s, status: 'Present'})));
  };

  const toggleStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const currentClass = CLASSES.find(c => c.id === selectedClass);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAll = (status: 'Present' | 'Absent') => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSubmitAttendance = () => {
    if (!currentClass) return;

    // 1. Find the Mock Student User (Alex Rivera)
    // In a real app, we would loop through ALL students and send a batch update API call.
    // For this demo, we specifically sync "Alex Rivera's" status to the Global App Context
    // so the student dashboard updates.
    const mockStudent = students.find(s => s.name === 'Alex Rivera');
    const subjectId = SUBJECT_MAPPING[currentClass.name];

    if (mockStudent && subjectId) {
        // Update Global Context
        markAttendance(subjectId, mockStudent.status);
    }

    // 2. Show Confirmation
    addNotification({
        title: 'Class Register Submitted',
        message: `Attendance for ${currentClass.name} has been successfully recorded.`,
        type: 'success'
    });

    setToast({ message: 'Attendance Submitted Successfully', visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
    
    // Optional: Go back to list
    // setSelectedClass(null); 
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if(newStudent.name && newStudent.roll) {
        const studentToAdd = {
            id: `new-${Date.now()}`,
            name: newStudent.name,
            roll: newStudent.roll,
            attendance: 100, // Starts with 100%
            status: 'Present' as 'Present' | 'Absent' | 'Late'
        };
        setStudents([studentToAdd, ...students]);
        setIsAddModalOpen(false);
        setNewStudent({ name: '', roll: '' });
    }
  };

  // Class List View
  if (!selectedClass) {
    return (
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2A32] mb-2">My Classes</h1>
          <p className="text-gray-500">Select a class to view attendance and student details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLASSES.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleClassSelect(cls.id)}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 cursor-pointer group hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-2 h-full`} style={{ backgroundColor: cls.color }} />
              
              <div className="flex justify-between items-start mb-4 pl-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#4A90A4] transition-colors">{cls.name}</h3>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{cls.code}</p>
                </div>
                <div className="bg-[#F7F8FA] p-2 rounded-lg text-gray-400">
                    <Users size={20} />
                </div>
              </div>

              <div className="pl-4 space-y-3">
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={16} /> {cls.time}
                 </div>
                 <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-50">
                    <span className="text-gray-500">Avg. Attendance</span>
                    <span className={`font-bold ${cls.avgAttendance < 75 ? 'text-red-500' : 'text-green-500'}`}>
                        {cls.avgAttendance}%
                    </span>
                 </div>
                 <div className="flex items-center justify-between mt-2">
                     <span className="text-xs text-gray-400">{cls.students} Students Enrolled</span>
                     <ArrowRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Detail View
  return (
    <div className="space-y-6 pb-20 relative">
       {/* Header with Back Button */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button 
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#4A90A4] transition-colors"
          >
             <ChevronLeft size={20} /> Back to Classes
          </button>
          <div className="flex items-center gap-3">
             <button onClick={() => markAll('Present')} className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                Mark All Present
             </button>
             <button 
                onClick={handleSubmitAttendance}
                className="bg-[#4A90A4] text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-[#4A90A4]/20 hover:bg-[#3B7D91] transition-colors flex items-center gap-2"
             >
                <Save size={18} />
                Submit Attendance
             </button>
          </div>
       </div>

       {/* Class Details Header */}
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-6">
          <div>
             <h1 className="text-2xl font-bold text-[#1E2A32]">{currentClass?.name}</h1>
             <p className="text-gray-500 flex items-center gap-2 mt-1">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold">{currentClass?.code}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <Calendar size={14} /> {new Date().toLocaleDateString()}
             </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex items-center gap-3 bg-[#F7F8FA] px-4 py-2.5 rounded-xl flex-1 md:flex-none">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full min-w-[150px]"
                />
             </div>
             
             <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#1E2A32] text-white p-2.5 rounded-xl shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                title="Add Student"
             >
                 <UserPlus size={18} />
                 <span className="hidden sm:inline font-medium text-sm">Add Student</span>
             </button>
          </div>
       </div>

       {/* Student List */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead className="bg-[#F7F8FA] border-b border-gray-100">
                   <tr>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Overall %</th>
                      <th className="text-center py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E3F2F4] to-[#C4E1E6] flex items-center justify-center text-[#4A90A4] font-bold text-sm">
                                  {student.name.charAt(0)}
                               </div>
                               <span className="font-medium text-[#1E2A32]">{student.name}</span>
                            </div>
                         </td>
                         <td className="py-4 px-6 text-sm text-gray-500">{student.roll}</td>
                         <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                               <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    style={{ width: `${student.attendance}%` }} 
                                    className={`h-full rounded-full ${student.attendance < 75 ? 'bg-red-400' : 'bg-[#4A90A4]'}`}
                                  />
                               </div>
                               <span className={`text-xs font-bold ${student.attendance < 75 ? 'text-red-500' : 'text-gray-600'}`}>
                                  {student.attendance}%
                               </span>
                            </div>
                         </td>
                         <td className="py-4 px-6">
                            <div className="flex justify-center items-center gap-2">
                               <button 
                                 onClick={() => toggleStatus(student.id, 'Present')}
                                 className={`p-2 rounded-lg transition-all ${student.status === 'Present' ? 'bg-green-100 text-green-600 ring-2 ring-green-200 shadow-sm' : 'text-gray-300 hover:bg-gray-100'}`}
                                 title="Present"
                               >
                                  <CheckCircle size={20} />
                               </button>
                               <button 
                                 onClick={() => toggleStatus(student.id, 'Absent')}
                                 className={`p-2 rounded-lg transition-all ${student.status === 'Absent' ? 'bg-red-100 text-red-500 ring-2 ring-red-200 shadow-sm' : 'text-gray-300 hover:bg-gray-100'}`}
                                 title="Absent"
                               >
                                  <XCircle size={20} />
                               </button>
                               <button 
                                 onClick={() => toggleStatus(student.id, 'Late')}
                                 className={`p-2 rounded-lg transition-all ${student.status === 'Late' ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-200 shadow-sm' : 'text-gray-300 hover:bg-gray-100'}`}
                                 title="Late"
                               >
                                  <Clock size={20} />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          {filteredStudents.length === 0 && (
             <div className="text-center py-10 text-gray-400">
                No students found matching "{searchTerm}"
             </div>
          )}
       </div>

       {/* Add Student Modal */}
       <AnimatePresence>
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAddModalOpen(false)}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#1E2A32]">Add New Student</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Student Name</label>
                                <input 
                                    required
                                    value={newStudent.name}
                                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border-transparent focus:bg-white focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Roll Number / ID</label>
                                <input 
                                    required
                                    value={newStudent.roll}
                                    onChange={e => setNewStudent({...newStudent, roll: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border-transparent focus:bg-white focus:border-[#4A90A4] focus:ring-2 focus:ring-[#4A90A4]/20 outline-none transition-all"
                                    placeholder="e.g. CS-2024-101"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full mt-4 py-3 bg-[#4A90A4] text-white rounded-xl font-bold shadow-lg shadow-[#4A90A4]/30 hover:bg-[#3B7D91] transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add to Class
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

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