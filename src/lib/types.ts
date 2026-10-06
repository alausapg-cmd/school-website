export type Role = "admin" | "teacher" | "student" | "parent";

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
  phone?: string;
  // Student record
  admissionNo?: string;
  gender?: "Male" | "Female";
  dob?: string;
  boarding?: boolean;
  parentId?: string;
  admittedOn?: string;
  address?: string;
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

export type Settings = {
  term: string;
  session: string;
  termStarts: string;
  termEnds: string;
  nextTermBegins: string;
};

export type FeeItem = {
  id: string;
  name: string;
  amount: number;
  classId: string; // "all" applies to every class
  term: string;
  session: string;
  boardingOnly?: boolean;
};

export type PaymentMethod = "Cash" | "Bank transfer" | "POS" | "Online";
export type Payment = {
  id: string;
  receiptNo: string;
  studentId: string;
  term: string;
  session: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  date: string;
  receivedBy: string;
};

export type Audience = "everyone" | "staff" | "parents" | "students";
export type Notice = {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  date: string;
  authorId: string;
  pinned?: boolean;
};

export type TimetableSlot = { classId: string; day: number; period: number; subjectId: string };

export type ApplicationStatus = "pending" | "exam booked" | "admitted" | "declined";
export type Application = {
  id: string;
  childName: string;
  gender: "Male" | "Female";
  dob: string;
  classWanted: string;
  boarding: boolean;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  previousSchool: string;
  status: ApplicationStatus;
  note: string;
  createdAt: string;
};

export type DB = {
  settings: Settings;
  feeItems: FeeItem[];
  payments: Payment[];
  notices: Notice[];
  timetable: TimetableSlot[];
  applications: Application[];
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
