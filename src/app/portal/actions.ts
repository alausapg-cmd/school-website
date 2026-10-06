"use server";

import { revalidatePath } from "next/cache";
import { school } from "@/lib/school";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { mutate, resetDB } from "@/lib/db";
import { saveUpload } from "@/lib/files";
import { newId, today } from "@/lib/format";
import type { ApplicationStatus, AttendanceStatus, Audience, DB, PaymentMethod, Question, User } from "@/lib/types";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string) => Number(f.get(k) ?? 0);

function assertTeaches(user: User, classId: string, subjectId?: string) {
  if (user.role === "admin") return;
  if (!user.classIds?.includes(classId)) throw new Error("You don't teach this class");
  if (subjectId && !user.subjectIds?.includes(subjectId)) throw new Error("You don't teach this subject");
}

/* ---------- Notes ---------- */

export async function createNote(formData: FormData) {
  const user = await requireUser("teacher", "admin");
  const classId = str(formData, "classId");
  const subjectId = str(formData, "subjectId");
  assertTeaches(user, classId, subjectId);
  const file = await saveUpload(formData.get("file"));
  await mutate((db) => {
    db.notes.push({
      id: newId("note"),
      title: str(formData, "title") || "Untitled note",
      body: str(formData, "body"),
      classId,
      subjectId,
      teacherId: user.id,
      ...(file ?? {}),
      createdAt: new Date().toISOString(),
    });
  });
  revalidatePath("/portal/notes");
}

export async function deleteNote(id: string) {
  const user = await requireUser("teacher", "admin");
  await mutate((db) => {
    db.notes = db.notes.filter((n) => !(n.id === id && (user.role === "admin" || n.teacherId === user.id)));
  });
  revalidatePath("/portal/notes");
}

/* ---------- Assignments ---------- */

export async function createAssignment(formData: FormData) {
  const user = await requireUser("teacher", "admin");
  const classId = str(formData, "classId");
  const subjectId = str(formData, "subjectId");
  assertTeaches(user, classId, subjectId);
  await mutate((db) => {
    db.assignments.push({
      id: newId("asg"),
      title: str(formData, "title") || "New assignment",
      instructions: str(formData, "instructions"),
      classId,
      subjectId,
      teacherId: user.id,
      dueDate: str(formData, "dueDate") || today(),
      maxScore: Math.max(1, num(formData, "maxScore") || 10),
      createdAt: new Date().toISOString(),
    });
  });
  revalidatePath("/portal/assignments");
}

export async function submitAssignment(assignmentId: string, formData: FormData) {
  const user = await requireUser("student");
  const file = await saveUpload(formData.get("file"));
  await mutate((db) => {
    const asg = db.assignments.find((a) => a.id === assignmentId);
    if (!asg || asg.classId !== user.classId) throw new Error("Assignment not found");
    const existing = db.submissions.find((s) => s.assignmentId === assignmentId && s.studentId === user.id);
    if (existing?.score !== undefined) throw new Error("Already marked");
    const data = {
      text: str(formData, "text"),
      ...(file ?? (existing ? { fileUrl: existing.fileUrl, fileName: existing.fileName } : {})),
      submittedAt: new Date().toISOString(),
    };
    if (existing) Object.assign(existing, data);
    else db.submissions.push({ id: newId("sub"), assignmentId, studentId: user.id, ...data });
  });
  revalidatePath(`/portal/assignments/${assignmentId}`);
  revalidatePath("/portal/assignments");
  redirect(`/portal/assignments/${assignmentId}?submitted=1`);
}

export async function gradeSubmission(submissionId: string, formData: FormData) {
  const user = await requireUser("teacher", "admin");
  let assignmentId = "";
  await mutate((db) => {
    const sub = db.submissions.find((s) => s.id === submissionId);
    const asg = sub && db.assignments.find((a) => a.id === sub.assignmentId);
    if (!sub || !asg) throw new Error("Submission not found");
    assertTeaches(user, asg.classId);
    assignmentId = asg.id;
    sub.score = Math.min(asg.maxScore, Math.max(0, num(formData, "score")));
    sub.feedback = str(formData, "feedback");
  });
  revalidatePath(`/portal/assignments/${assignmentId}`);
}

/* ---------- Quizzes ---------- */

export async function createQuiz(input: {
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  questions: Question[];
}) {
  const user = await requireUser("teacher", "admin");
  assertTeaches(user, input.classId, input.subjectId);
  const questions = input.questions
    .map((q) => ({ prompt: q.prompt.trim(), options: q.options.map((o) => o.trim()), answer: q.answer }))
    .filter((q) => q.prompt && q.options.filter(Boolean).length >= 2 && q.options[q.answer]);
  if (!questions.length) return { error: "Add at least one question with two answers and pick the right one." };
  const id = newId("quiz");
  await mutate((db) => {
    db.quizzes.push({
      id,
      title: input.title.trim() || "New quiz",
      description: input.description.trim(),
      classId: input.classId,
      subjectId: input.subjectId,
      teacherId: user.id,
      questions,
      createdAt: new Date().toISOString(),
    });
  });
  revalidatePath("/portal/quizzes");
  return { id };
}

export async function submitQuiz(quizId: string, answers: number[]) {
  const user = await requireUser("student");
  return mutate((db) => {
    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz || quiz.classId !== user.classId) throw new Error("Quiz not found");
    const done = db.attempts.find((a) => a.quizId === quizId && a.studentId === user.id);
    if (done) return { score: done.score, total: done.total, answers: done.answers, correct: quiz.questions.map((q) => q.answer) };
    const score = quiz.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
    db.attempts.push({ id: newId("att"), quizId, studentId: user.id, answers, score, total: quiz.questions.length, at: new Date().toISOString() });
    return { score, total: quiz.questions.length, answers, correct: quiz.questions.map((q) => q.answer) };
  });
}

/* ---------- Attendance ---------- */

export async function saveAttendance(classId: string, date: string, formData: FormData) {
  const user = await requireUser("teacher", "admin");
  assertTeaches(user, classId);
  await mutate((db) => {
    const students = db.users.filter((u) => u.role === "student" && u.classId === classId);
    db.attendance = db.attendance.filter((r) => !(r.classId === classId && r.date === date));
    for (const s of students) {
      const status = (str(formData, `s_${s.id}`) || "present") as AttendanceStatus;
      db.attendance.push({ date, classId, studentId: s.id, status });
    }
  });
  revalidatePath("/portal/attendance");
  redirect(`/portal/attendance?class=${classId}&date=${date}&saved=1`);
}

/* ---------- Results ---------- */

export async function saveResults(classId: string, subjectId: string, term: string, session: string, formData: FormData) {
  const user = await requireUser("teacher", "admin");
  assertTeaches(user, classId, subjectId);
  await mutate((db) => {
    const students = db.users.filter((u) => u.role === "student" && u.classId === classId);
    for (const s of students) {
      const caRaw = str(formData, `ca_${s.id}`);
      const examRaw = str(formData, `exam_${s.id}`);
      const existing = db.results.find((r) => r.studentId === s.id && r.subjectId === subjectId && r.term === term && r.session === session);
      if (caRaw === "" && examRaw === "") continue;
      const ca = Math.min(40, Math.max(0, Number(caRaw) || 0));
      const exam = Math.min(60, Math.max(0, Number(examRaw) || 0));
      const comment = str(formData, `comment_${s.id}`);
      if (existing) Object.assign(existing, { ca, exam, comment });
      else db.results.push({ id: newId("res"), studentId: s.id, subjectId, term, session, ca, exam, comment });
    }
  });
  revalidatePath("/portal/results");
  redirect(`/portal/results?class=${classId}&subject=${subjectId}&term=${encodeURIComponent(term)}&session=${encodeURIComponent(session)}&saved=1`);
}

/* ---------- Admin: news, events, people ---------- */

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF5DA8", "#A855F7", "#06B6D4"];

export async function createNews(formData: FormData) {
  await requireUser("admin");
  await mutate((db) => {
    db.news.push({
      id: newId("news"),
      title: str(formData, "title"),
      summary: str(formData, "summary"),
      body: str(formData, "body"),
      emoji: str(formData, "emoji") || "📣",
      color: COLORS[db.news.length % COLORS.length],
      date: str(formData, "date") || today(),
    });
  });
  revalidatePath("/", "layout");
}

export async function deleteNews(id: string) {
  await requireUser("admin");
  await mutate((db) => {
    db.news = db.news.filter((n) => n.id !== id);
  });
  revalidatePath("/", "layout");
}

export async function createEvent(formData: FormData) {
  await requireUser("admin");
  await mutate((db) => {
    db.events.push({
      id: newId("evt"),
      title: str(formData, "title"),
      date: str(formData, "date") || today(),
      time: str(formData, "time"),
      location: str(formData, "location"),
      description: str(formData, "description"),
      emoji: str(formData, "emoji") || "🎉",
    });
  });
  revalidatePath("/", "layout");
}

export async function deleteEvent(id: string) {
  await requireUser("admin");
  await mutate((db) => {
    db.events = db.events.filter((e) => e.id !== id);
  });
  revalidatePath("/", "layout");
}

export async function createPerson(formData: FormData) {
  await requireUser("admin");
  const roleIn = str(formData, "role");
  const role = roleIn === "teacher" ? "teacher" : roleIn === "parent" ? "parent" : "student";
  const email = str(formData, "email").toLowerCase();
  const result = await mutate((db) => {
    if (db.users.some((u) => u.email === email)) return "That email is already in use.";
    db.users.push({
      id: newId(role === "teacher" ? "tch" : role === "parent" ? "par" : "stu"),
      name: str(formData, "name"),
      email,
      password: str(formData, "password") || school.demoPassword,
      role,
      avatar: role === "teacher" ? "🍎" : role === "parent" ? "👪" : ["🐣", "🐢", "🦒", "🐧", "🐻"][db.users.length % 5],
      phone: str(formData, "phone") || undefined,
      ...(role === "parent"
        ? {}
        : role === "student"
        ? { classId: str(formData, "classId") }
        : { classIds: formData.getAll("classIds").map(String), subjectIds: formData.getAll("subjectIds").map(String) }),
    });
    return null;
  });
  revalidatePath("/portal/people");
  redirect(`/portal/people${result ? `?error=${encodeURIComponent(result)}` : "?added=1"}`);
}

export async function resetDemo() {
  await requireUser("admin");
  await resetDB();
  revalidatePath("/", "layout");
}

/* ---------- Students (admin) ---------- */

function nextAdmissionNo(db: DB) {
  const year = new Date().getFullYear();
  const n = db.users.filter((u) => u.admissionNo?.includes(`/${year}/`)).length + 1;
  return `${school.admissionPrefix}/${year}/${String(n).padStart(3, "0")}`;
}

export async function createStudent(formData: FormData) {
  await requireUser("admin");
  const id = await mutate((db) => {
    let parentId = str(formData, "parentId");
    if (parentId === "new") {
      const email = str(formData, "parentEmail").toLowerCase();
      const existing = db.users.find((u) => u.email === email && u.role === "parent");
      if (existing) parentId = existing.id;
      else {
        parentId = newId("par");
        db.users.push({
          id: parentId,
          name: str(formData, "parentName") || "Parent",
          email: email || `${parentId}@${school.demoDomain}`,
          phone: str(formData, "parentPhone"),
          password: school.demoPassword,
          role: "parent",
          avatar: "👪",
        });
      }
    }
    const name = str(formData, "name");
    const sid = newId("stu");
    db.users.push({
      id: sid,
      name,
      email: str(formData, "email").toLowerCase() || `${name.split(" ")[0].toLowerCase()}.${sid.slice(-4)}@${school.demoDomain}`,
      password: school.demoPassword,
      role: "student",
      avatar: ["🐣", "🐢", "🦒", "🐧", "🐻", "🦓"][db.users.length % 6],
      classId: str(formData, "classId"),
      gender: str(formData, "gender") === "Male" ? "Male" : "Female",
      dob: str(formData, "dob"),
      boarding: str(formData, "boarding") === "yes",
      parentId: parentId || undefined,
      admissionNo: nextAdmissionNo(db),
      admittedOn: today(),
      address: str(formData, "address"),
    });
    return sid;
  });
  revalidatePath("/portal/students");
  redirect(`/portal/students/${id}?added=1`);
}

export async function updateStudent(id: string, formData: FormData) {
  await requireUser("admin");
  await mutate((db) => {
    const s = db.users.find((u) => u.id === id && u.role === "student");
    if (!s) throw new Error("Student not found");
    s.name = str(formData, "name") || s.name;
    s.classId = str(formData, "classId") || s.classId;
    s.gender = str(formData, "gender") === "Male" ? "Male" : "Female";
    s.dob = str(formData, "dob");
    s.boarding = str(formData, "boarding") === "yes";
    s.address = str(formData, "address");
  });
  revalidatePath(`/portal/students/${id}`);
  redirect(`/portal/students/${id}?saved=1`);
}

/* ---------- Fees ---------- */

export async function recordPayment(formData: FormData) {
  const admin = await requireUser("admin");
  const studentId = str(formData, "studentId");
  const amount = Math.round(num(formData, "amount"));
  if (!studentId || amount <= 0) redirect(`/portal/fees?error=${encodeURIComponent("Choose a pupil and enter an amount above zero.")}`);
  const id = await mutate((db) => {
    const n = db.payments.length + 1;
    const pid = newId("pay");
    db.payments.push({
      id: pid,
      receiptNo: `${school.receiptPrefix}-${String(n).padStart(5, "0")}`,
      studentId,
      term: db.settings.term,
      session: db.settings.session,
      amount,
      method: (["Cash", "Bank transfer", "POS", "Online"].includes(str(formData, "method")) ? str(formData, "method") : "Cash") as PaymentMethod,
      reference: str(formData, "reference"),
      date: str(formData, "date") || today(),
      receivedBy: admin.id,
    });
    return pid;
  });
  revalidatePath("/portal/fees");
  redirect(`/portal/fees/receipt/${id}?new=1`);
}

export async function saveFeeItem(formData: FormData) {
  await requireUser("admin");
  await mutate((db) => {
    db.feeItems.push({
      id: newId("fee"),
      name: str(formData, "name") || "Fee",
      amount: Math.max(0, Math.round(num(formData, "amount"))),
      classId: str(formData, "classId") || "all",
      term: db.settings.term,
      session: db.settings.session,
      boardingOnly: str(formData, "boardingOnly") === "yes",
    });
  });
  revalidatePath("/portal/fees");
}

export async function deleteFeeItem(id: string) {
  await requireUser("admin");
  await mutate((db) => {
    db.feeItems = db.feeItems.filter((f) => f.id !== id);
  });
  revalidatePath("/portal/fees");
}

/* ---------- Notice board ---------- */

export async function createNotice(formData: FormData) {
  const user = await requireUser("admin", "teacher");
  const wanted = str(formData, "audience") as Audience;
  const allowed: Audience[] = user.role === "admin" ? ["everyone", "staff", "parents", "students"] : ["students", "parents", "everyone"];
  await mutate((db) => {
    db.notices.push({
      id: newId("ntc"),
      title: str(formData, "title"),
      body: str(formData, "body"),
      audience: allowed.includes(wanted) ? wanted : "everyone",
      date: new Date().toISOString(),
      authorId: user.id,
      pinned: user.role === "admin" && str(formData, "pinned") === "yes",
    });
  });
  revalidatePath("/portal/notices");
}

export async function deleteNotice(id: string) {
  const user = await requireUser("admin", "teacher");
  await mutate((db) => {
    db.notices = db.notices.filter((n) => !(n.id === id && (user.role === "admin" || n.authorId === user.id)));
  });
  revalidatePath("/portal/notices");
}

/* ---------- Timetable ---------- */

export async function saveTimetable(classId: string, formData: FormData) {
  await requireUser("admin");
  await mutate((db) => {
    db.timetable = db.timetable.filter((t) => t.classId !== classId);
    for (const [key, value] of formData.entries()) {
      const m = /^slot_(\d)_(\d)$/.exec(key);
      if (m && typeof value === "string" && value) db.timetable.push({ classId, day: Number(m[1]), period: Number(m[2]), subjectId: value });
    }
  });
  revalidatePath("/portal/timetable");
  redirect(`/portal/timetable?class=${classId}&saved=1`);
}

/* ---------- Admissions ---------- */

export async function updateApplication(id: string, formData: FormData) {
  await requireUser("admin");
  const status = str(formData, "status") as ApplicationStatus;
  await mutate((db) => {
    const a = db.applications.find((x) => x.id === id);
    if (!a) throw new Error("Application not found");
    if (["pending", "exam booked", "admitted", "declined"].includes(status)) a.status = status;
    a.note = str(formData, "note");
  });
  revalidatePath("/portal/admissions");
}

/* ---------- Settings ---------- */

export async function saveSettings(formData: FormData) {
  await requireUser("admin");
  await mutate((db) => {
    const session = str(formData, "session");
    db.settings = {
      term: ["First Term", "Second Term", "Third Term"].includes(str(formData, "term")) ? str(formData, "term") : db.settings.term,
      session: /^\d{4}\/\d{4}$/.test(session) ? session : db.settings.session,
      termStarts: str(formData, "termStarts"),
      termEnds: str(formData, "termEnds"),
      nextTermBegins: str(formData, "nextTermBegins"),
    };
  });
  revalidatePath("/portal", "layout");
  redirect("/portal/settings?saved=1");
}

export async function addClass(formData: FormData) {
  await requireUser("admin");
  const name = str(formData, "name");
  if (!name) return;
  await mutate((db) => {
    db.classes.push({ id: newId("cls"), name, emoji: str(formData, "emoji") || "📘" });
  });
  revalidatePath("/portal/settings");
}

export async function addSubject(formData: FormData) {
  await requireUser("admin");
  const name = str(formData, "name");
  if (!name) return;
  await mutate((db) => {
    db.subjects.push({ id: newId("sub"), name, emoji: str(formData, "emoji") || "📘", color: COLORS[db.subjects.length % COLORS.length] });
  });
  revalidatePath("/portal/settings");
}
