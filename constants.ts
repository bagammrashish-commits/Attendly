import { Subject, DailySchedule, NotificationItem, Student } from './types';

export const COLORS = {
  primary: '#4A90A4', // Soft Aqua Blue
  secondary: '#E3F2F4', // Pastel Mint
  accent: '#FFD29D', // Warm Peach
  neutral: '#F7F8FA', // Off-white
  text: '#1E2A32', // Deep Slate
  success: '#86EFAC',
  danger: '#FCA5A5',
  warning: '#FDE047',
};

export const MOCK_STUDENT: Student = {
  name: 'Alex Rivera',
  email: 'alex.rivera@college.edu',
  course: 'Computer Science',
  year: '3rd Year',
  avatarUrl: 'https://picsum.photos/200/200',
  role: 'student',
};

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: '1',
    name: 'Data Structures',
    faculty: 'Dr. Smith',
    totalClasses: 24,
    attendedClasses: 20,
    targetPercentage: 75,
    color: '#4A90A4',
  },
  {
    id: '2',
    name: 'Computer Networks',
    faculty: 'Prof. Johnson',
    totalClasses: 22,
    attendedClasses: 15, // Low attendance
    targetPercentage: 75,
    color: '#FFD29D',
  },
  {
    id: '3',
    name: 'Operating Systems',
    faculty: 'Dr. Emily Chen',
    totalClasses: 20,
    attendedClasses: 18,
    targetPercentage: 75,
    color: '#818CF8',
  },
  {
    id: '4',
    name: 'Mathematics III',
    faculty: 'Prof. Alan',
    totalClasses: 25,
    attendedClasses: 24,
    targetPercentage: 75,
    color: '#34D399',
  },
  {
    id: '5',
    name: 'Software Eng.',
    faculty: 'Dr. Lisa',
    totalClasses: 18,
    attendedClasses: 12,
    targetPercentage: 75,
    color: '#F472B6',
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Attendance Alert', message: 'Attendance falling: Computer Networks (68%)', type: 'warning', date: '2023-10-25', read: false },
  { id: '2', title: 'Streak!', message: 'Great job! 7-day streak achieved.', type: 'success', date: '2023-10-24', read: false },
  { id: '3', title: 'Class Cancelled', message: 'Operating Systems cancelled for tomorrow.', type: 'info', date: '2023-10-23', read: true },
];