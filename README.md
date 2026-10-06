# Owlberry International School: website + school management system

A treehouse-jungle themed school website for a fictional school (Home, About, News, Events, Gallery, Admissions, Apply), joined to a learning portal where teachers share notes, set assignments and quizzes, take attendance and enter results, and pupils learn, hand in work and see their report cards.

School management features:

- **Student records**: enrolment with automatic admission numbers, day/boarding, parent links, full pupil profiles.
- **School fees**: fee lists per class and term, recording payments with printable receipts, debtors list, collection totals.
- **Parent portal**: each parent sees their children's attendance, results, homework, fees and receipts, timetable and notices.
- **Online admissions**: a public Apply page; the office reviews applications and tracks status.
- **Notice board**: messages for everyone, parents, pupils or staff only.
- **Class timetables**: the admin edits each class's weekly timetable.
- **Printable report cards**: subjects, CA/exam, grades, average, position, remarks and next-term date.
- **Settings**: current term and session, term dates, classes and subjects.

School details (name, address, phones, motto) live in `src/lib/school.ts`; the logo is `public/images/logo.svg`, and every illustration (the treehouse, Professor Hoot the owl, gallery scenes) is drawn in SVG in `src/components/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

### Demo logins (password for all: `owlberry`)

| Who | Email |
|---|---|
| Pupil (Zainab, Primary 4 Acacia) | student@owlberry.test |
| Teacher (Mrs Okafor: Maths, English, Social Studies) | teacher@owlberry.test |
| Teacher (Mr Bakare: Science, Computer, Arts) | science@owlberry.test |
| Parent (Mrs Bello: Zainab and Kemi) | parent@owlberry.test |
| Admin (Head Teacher) | admin@owlberry.test |

The login page also has one-tap demo buttons.

## How data works right now

This first version stores everything in `data/db.json` (created from `src/lib/seed.ts` on first run) and uploaded files in `data/uploads/`. Delete the `data/` folder, or use "Reset sample data" on the admin dashboard, to start fresh. This is for trying the app out and is not meant for real pupils' data.

## Going live with Supabase

`supabase/schema.sql` holds the production database: tables, row-level security (pupils only see their own class and their own results; quiz answers are hidden from pupils), and notes on storage buckets. Going live means creating a Supabase project, running that file, and swapping `src/lib/db.ts` / `src/lib/auth.ts` for Supabase calls. The school management tables (parents, fees, payments, notices, timetable, applications, settings) are not in `schema.sql` yet and need adding at that point.

## Where things are

- `src/app/(site)/` public website pages
- `src/app/portal/` learning portal pages; `actions.ts` has every save/update with role checks
- `src/app/login/` sign-in
- `src/lib/` data store, auth, seed data, grading scale (A ≥ 70, B ≥ 60, C ≥ 50, D ≥ 45, E ≥ 40)
