export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Cancelled';

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string; // ISO String YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Subject {
  id: string;
  name: string;
  faculty: string;
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
  color: string;
}

export interface BaseUser {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Student extends BaseUser {
  role: 'student';
  course: string;
  year: string;
}

export interface Teacher extends BaseUser {
  role: 'teacher';
  department: string;
}

export type User = Student | Teacher;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'success' | 'info';
  date: string;
  read: boolean;
}

export interface DailySchedule {
  day: string;
  subjects: string[]; // Subject IDs
}