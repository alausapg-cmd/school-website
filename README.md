# Life Builders International Schools: website + learning portal

A colourful school website (Home, About, News, Events, Gallery, Contact) joined to a learning portal where teachers share notes, set assignments and quizzes, take attendance and enter results, and pupils learn, hand in work and see their report cards.

School details (name, address, phones, motto) live in `src/lib/school.ts`; logo and photos are in `public/images/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

### Demo logins (password for all: `lifebuilders`)

| Who | Email |
|---|---|
| Pupil (Zainab, Primary 4) | student@lifebuilders.test |
| Teacher (Mrs Okafor: Maths, English, Social Studies) | teacher@lifebuilders.test |
| Teacher (Mr Bakare: Science, Computer, Arts) | science@lifebuilders.test |
| Admin (Head Teacher) | admin@lifebuilders.test |

The login page also has one-tap demo buttons.

## How data works right now

This first version stores everything in `data/db.json` (created from `src/lib/seed.ts` on first run) and uploaded files in `data/uploads/`. Delete the `data/` folder, or use "Reset sample data" on the admin dashboard, to start fresh. This is for trying the app out and is not meant for real pupils' data.

## Going live with Supabase

`supabase/schema.sql` holds the production database: tables, row-level security (pupils only see their own class and their own results; quiz answers are hidden from pupils), and notes on storage buckets. Going live means creating a Supabase project, running that file, and swapping `src/lib/db.ts` / `src/lib/auth.ts` for Supabase calls.

## Where things are

- `src/app/(site)/` public website pages
- `src/app/portal/` learning portal pages; `actions.ts` has every save/update with role checks
- `src/app/login/` sign-in
- `src/lib/` data store, auth, seed data, grading scale (A ≥ 70, B ≥ 60, C ≥ 50, D ≥ 45, E ≥ 40)
