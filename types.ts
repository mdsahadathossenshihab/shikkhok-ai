
export enum ClassLevel {
  CLASS_6 = '৬ষ্ঠ শ্রেণী',
  CLASS_7 = '৭ম শ্রেণী',
  CLASS_8 = '৮ম শ্রেণী',
  CLASS_9 = '৯ম শ্রেণী',
  CLASS_10 = '১০ম শ্রেণী',
  CLASS_11 = 'একাদশ শ্রেণী',
  CLASS_12 = 'দ্বাদশ শ্রেণী',
  HONOURS = 'অনার্স'
}

export enum GroupType {
  NONE = 'সাধারণ',
  SCIENCE = 'বিজ্ঞান',
  ARTS = 'মানবিক',
  COMMERCE = 'ব্যবসায় শিক্ষা'
}

export enum AppState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  WELCOME = 'WELCOME',
  CONTEXT = 'CONTEXT',
  CHAT = 'CHAT'
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  prompts: string[];
  chapters: string[];
}

export interface UserProfile {
  id: string; // Unique ID based on email
  email: string;
  password?: string; // Only for auth check
  name: string;
  classLevel: ClassLevel;
  group: GroupType;
  subject?: Subject;
  chapter?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isError?: boolean;
}

export interface RoutineActivity {
  time: string;
  activity: string;
  type: 'study' | 'school' | 'break' | 'sleep' | 'prayer';
}
