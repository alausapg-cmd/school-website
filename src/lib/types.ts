export type Role = "admin" | "teacher" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  classId?: string;
  subjectIds?: string[];
  classIds?: string[];
};

export type SchoolClass = { id: string; name: string; emoji: string };
export type Subject = { id: string; name: string; emoji: string; color: string };

export type Note = {
  id: string;
  title: string;
  body: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
};

export type Assignment = {
  id: string;
  title: string;
  instructions: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  dueDate: string;
  maxScore: number;
  createdAt: string;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  text: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
};

export type Question = { prompt: string; options: string[]; answer: number };

export type Quiz = {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  questions: Question[];
  createdAt: string;
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  studentId: string;
  answers: number[];
  score: number;
  total: number;
  at: string;
};

export type AttendanceStatus = "present" | "late" | "absent";
export type AttendanceRecord = {
  date: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
};

export type Result = {
  id: string;
  studentId: string;
  subjectId: string;
  term: string;
  session: string;
  ca: number;
  exam: number;
  comment: string;
};

export type NewsPost = {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string;
  emoji: string;
  color: string;
};

export type SchoolEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  emoji: string;
};

export type DB = {
  users: User[];
  classes: SchoolClass[];
  subjects: Subject[];
  notes: Note[];
  assignments: Assignment[];
  submissions: Submission[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  attendance: AttendanceRecord[];
  results: Result[];
  news: NewsPost[];
  events: SchoolEvent[];
};
