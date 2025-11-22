import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Teacher, User, Subject, AttendanceRecord, NotificationItem } from '../types';
import { MOCK_STUDENT, MOCK_SUBJECTS, MOCK_NOTIFICATIONS } from '../constants';

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name: string, role: 'student' | 'teacher') => void;
  logout: () => void;
  subjects: Subject[];
  records: AttendanceRecord[];
  notifications: NotificationItem[];
  markAttendance: (subjectId: string, status: 'Present' | 'Absent' | 'Late', date?: string) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'date' | 'read'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Simulate initial data load
  useEffect(() => {
    // Generate some past records for analytics
    const initialRecords: AttendanceRecord[] = [];
    const today = new Date();
    
    subjects.forEach(sub => {
      for (let i = 0; i < sub.totalClasses; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (i * 2)); // Every other day roughly
        const isAttended = i < sub.attendedClasses;
        initialRecords.push({
          id: Math.random().toString(36).substr(2, 9),
          subjectId: sub.id,
          date: date.toISOString().split('T')[0],
          status: isAttended ? 'Present' : 'Absent'
        });
      }
    });
    setRecords(initialRecords);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (email: string, name: string, role: 'student' | 'teacher') => {
    if (role === 'student') {
        const studentUser: Student = {
            ...MOCK_STUDENT,
            email,
            name,
            role: 'student'
        };
        setUser(studentUser);
    } else {
        const teacherUser: Teacher = {
            name,
            email,
            avatarUrl: 'https://picsum.photos/200/200',
            role: 'teacher',
            department: 'Computer Science Dept'
        };
        setUser(teacherUser);
    }
    
    setIsLoggedIn(true);
    
    // Welcome notification
    addNotification({
        title: `Welcome ${role === 'teacher' ? 'Professor' : ''}`,
        message: `Hello ${name}, welcome to Attendly.`,
        type: 'info'
    });
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'date' | 'read'>) => {
    const newItem: NotificationItem = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        read: false,
        ...item
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const markAttendance = (subjectId: string, status: 'Present' | 'Absent' | 'Late', dateStr?: string) => {
    const date = dateStr || new Date().toISOString().split('T')[0];
    
    // Add record
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      subjectId,
      date,
      status
    };
    setRecords(prev => [newRecord, ...prev]);

    // Update subject totals and check for alerts
    setSubjects(prev => prev.map(sub => {
      if (sub.id === subjectId) {
        const isPresent = status === 'Present' || status === 'Late';
        const newTotal = sub.totalClasses + 1;
        const newAttended = isPresent ? sub.attendedClasses + 1 : sub.attendedClasses;
        
        // Calculate Percentages
        const oldPct = sub.totalClasses > 0 ? (sub.attendedClasses / sub.totalClasses) * 100 : 100;
        const newPct = (newAttended / newTotal) * 100;

        // Alert Logic (Only if logged in as student or generic system update)
        if (newPct < 75 && oldPct >= 75) {
            addNotification({
                title: 'Attendance Alert ⚠️',
                message: `Attendance for ${sub.name} has dropped below 75% (${newPct.toFixed(1)}%).`,
                type: 'warning'
            });
        } else if (newPct >= 75 && oldPct < 75) {
             addNotification({
                title: 'Back on Track! 🎉',
                message: `Great job! Your attendance for ${sub.name} is back above 75%.`,
                type: 'success'
            });
        }

        return {
          ...sub,
          totalClasses: newTotal,
          attendedClasses: newAttended
        };
      }
      return sub;
    }));
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
        id: Math.random().toString(36).substr(2, 9),
        ...subjectData
    };
    setSubjects(prev => [...prev, newSubject]);
    addNotification({
        title: 'New Subject Added',
        message: `${subjectData.name} has been added to your dashboard.`,
        type: 'success'
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
      setNotifications([]);
  };

  return (
    <AppContext.Provider value={{ 
      user, isLoggedIn, login, logout, subjects, records, notifications, 
      markAttendance, addSubject, markNotificationRead, clearNotifications, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};