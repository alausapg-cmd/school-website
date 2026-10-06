-- Sunshine Academy portal: Supabase schema (for when the real project is connected).
-- Run in the Supabase SQL editor. Users sign in with Supabase Auth; profiles extend auth.users.

create type user_role as enum ('admin', 'teacher', 'student');
create type attendance_status as enum ('present', 'late', 'absent');

create table classes (id text primary key, name text not null, emoji text default '🏫');
create table subjects (id text primary key, name text not null, emoji text, color text);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  role user_role not null default 'student',
  avatar text default '🙂',
  class_id text references classes
);
create table teacher_classes (teacher_id uuid references profiles on delete cascade, class_id text references classes, primary key (teacher_id, class_id));
create table teacher_subjects (teacher_id uuid references profiles on delete cascade, subject_id text references subjects, primary key (teacher_id, subject_id));

create table notes (
  id uuid primary key default gen_random_uuid(),
  title text not null, body text default '',
  class_id text not null references classes, subject_id text not null references subjects,
  teacher_id uuid not null references profiles,
  file_path text, file_name text,             -- object in the "materials" storage bucket
  created_at timestamptz default now()
);

create table assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null, instructions text default '',
  class_id text not null references classes, subject_id text not null references subjects,
  teacher_id uuid not null references profiles,
  due_date date not null, max_score int not null default 10,
  created_at timestamptz default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments on delete cascade,
  student_id uuid not null references profiles,
  text text default '', file_path text, file_name text,
  submitted_at timestamptz default now(),
  score int, feedback text,
  unique (assignment_id, student_id)
);

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text default '',
  class_id text not null references classes, subject_id text not null references subjects,
  teacher_id uuid not null references profiles,
  created_at timestamptz default now()
);
-- Answers live in their own table so pupils can read questions without seeing answers.
create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes on delete cascade,
  position int not null, prompt text not null, options text[] not null
);
create table quiz_answers (question_id uuid primary key references quiz_questions on delete cascade, answer int not null);
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes on delete cascade,
  student_id uuid not null references profiles,
  answers int[] not null, score int not null, total int not null,
  at timestamptz default now(),
  unique (quiz_id, student_id)
);

create table attendance (
  date date not null, class_id text not null references classes,
  student_id uuid not null references profiles, status attendance_status not null,
  primary key (date, student_id)
);

create table results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles, subject_id text not null references subjects,
  term text not null, session text not null,
  ca int check (ca between 0 and 40), exam int check (exam between 0 and 60), comment text,
  unique (student_id, subject_id, term, session)
);

create table news (id uuid primary key default gen_random_uuid(), title text not null, summary text, body text, emoji text, color text, date date default current_date);
create table events (id uuid primary key default gen_random_uuid(), title text not null, date date not null, time text, location text, description text, emoji text);

-- Helpers
create function my_role() returns user_role language sql stable security definer as $$ select role from profiles where id = auth.uid() $$;
create function my_class() returns text language sql stable security definer as $$ select class_id from profiles where id = auth.uid() $$;
create function teaches(c text) returns boolean language sql stable security definer as $$
  select exists (select 1 from teacher_classes where teacher_id = auth.uid() and class_id = c) $$;

-- Row level security
alter table profiles enable row level security;
alter table notes enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_answers enable row level security;
alter table quiz_attempts enable row level security;
alter table attendance enable row level security;
alter table results enable row level security;
alter table news enable row level security;
alter table events enable row level security;

create policy "public reads news" on news for select using (true);
create policy "public reads events" on events for select using (true);
create policy "admin writes news" on news for all using (my_role() = 'admin') with check (my_role() = 'admin');
create policy "admin writes events" on events for all using (my_role() = 'admin') with check (my_role() = 'admin');

create policy "see own profile, staff see all" on profiles for select using (id = auth.uid() or my_role() in ('admin', 'teacher'));
create policy "admin manages profiles" on profiles for all using (my_role() = 'admin') with check (my_role() = 'admin');

-- Class content: pupils read their class, teachers manage classes they teach.
create policy "read class notes" on notes for select using (class_id = my_class() or teaches(class_id) or my_role() = 'admin');
create policy "teachers write notes" on notes for all using (teaches(class_id)) with check (teaches(class_id) and teacher_id = auth.uid());
create policy "read class assignments" on assignments for select using (class_id = my_class() or teaches(class_id) or my_role() = 'admin');
create policy "teachers write assignments" on assignments for all using (teaches(class_id)) with check (teaches(class_id) and teacher_id = auth.uid());
create policy "read class quizzes" on quizzes for select using (class_id = my_class() or teaches(class_id) or my_role() = 'admin');
create policy "teachers write quizzes" on quizzes for all using (teaches(class_id)) with check (teaches(class_id));
create policy "read questions" on quiz_questions for select using (exists (select 1 from quizzes q where q.id = quiz_id and (q.class_id = my_class() or teaches(q.class_id))));
create policy "teachers write questions" on quiz_questions for all using (exists (select 1 from quizzes q where q.id = quiz_id and teaches(q.class_id)));
create policy "teachers only see answers" on quiz_answers for all using (exists (select 1 from quiz_questions qq join quizzes q on q.id = qq.quiz_id where qq.id = question_id and teaches(q.class_id)));

-- Pupils hand in their own work; teachers mark it. Quiz attempts are written by a server function that scores them.
create policy "own submissions" on submissions for select using (student_id = auth.uid() or exists (select 1 from assignments a where a.id = assignment_id and teaches(a.class_id)));
create policy "pupils submit" on submissions for insert with check (student_id = auth.uid());
create policy "pupils edit unmarked" on submissions for update using (student_id = auth.uid() and score is null) with check (student_id = auth.uid() and score is null);
create policy "teachers mark" on submissions for update using (exists (select 1 from assignments a where a.id = assignment_id and teaches(a.class_id)));
create policy "see attempts" on quiz_attempts for select using (student_id = auth.uid() or exists (select 1 from quizzes q where q.id = quiz_id and teaches(q.class_id)));

create policy "see attendance" on attendance for select using (student_id = auth.uid() or teaches(class_id) or my_role() = 'admin');
create policy "teachers take register" on attendance for all using (teaches(class_id) or my_role() = 'admin') with check (teaches(class_id) or my_role() = 'admin');

create policy "see results" on results for select using (student_id = auth.uid() or my_role() in ('admin', 'teacher'));
create policy "staff enter results" on results for all using (my_role() in ('admin', 'teacher')) with check (my_role() in ('admin', 'teacher'));

-- Storage: create private buckets "materials" (teacher uploads) and "submissions" (pupil uploads) in the dashboard.
