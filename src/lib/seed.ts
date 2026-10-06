import type { AttendanceRecord, DB, FeeItem, Payment, Result, TimetableSlot, User } from "./types";
import { school } from "@/lib/school";

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function schoolDaysBack(count: number) {
  const days: string[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() - 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(d.toISOString().slice(0, 10));
  }
  return days.reverse();
}

const PASSWORD = school.demoPassword;
const DOMAIN = school.demoDomain;

type Kid = readonly [name: string, avatar: string, gender: "Male" | "Female", boarding: boolean, dob: string];
const p4: Kid[] = [
  ["Zainab Bello", "🦊", "Female", false, "2017-03-14"],
  ["Chidi Okeke", "🐯", "Male", false, "2017-06-02"],
  ["Tomi Adewale", "🐼", "Female", false, "2017-01-21"],
  ["David Mensah", "🦁", "Male", false, "2016-11-09"],
  ["Amara Nwosu", "🦄", "Female", false, "2017-08-30"],
  ["Ibrahim Musa", "🐸", "Male", false, "2017-04-17"],
];
const p5: Kid[] = [
  ["Kemi Bello", "🐨", "Female", false, "2016-02-11"],
  ["Emeka Obi", "🐙", "Male", false, "2016-05-25"],
  ["Fatima Sani", "🦋", "Female", false, "2015-12-03"],
  ["Joshua Etim", "🐬", "Male", false, "2016-07-19"],
  ["Ngozi Eze", "🐝", "Female", false, "2016-03-08"],
  ["Seyi Coker", "🦉", "Male", false, "2016-09-27"],
];

const PARENT_TITLES = ["Mrs", "Mr", "Mrs", "Dr", "Mrs", "Mr"];

// Students plus one parent account per family (children who share a surname share a parent).
function family(): User[] {
  const out: User[] = [];
  const parents = new Map<string, User>();
  let n = 1;
  for (const [list, classId, start] of [[p4, "p4", 1], [p5, "p5", 7]] as const) {
    list.forEach(([name, avatar, gender, boarding, dob], i) => {
      const surname = name.split(" ")[1];
      let parent = parents.get(surname);
      if (!parent) {
        const first = parents.size === 0;
        parent = {
          id: `par_${parents.size + 1}`,
          name: `${PARENT_TITLES[parents.size % PARENT_TITLES.length]} ${surname}`,
          email: first ? `parent@${DOMAIN}` : `${surname.toLowerCase()}.family@${DOMAIN}`,
          password: PASSWORD,
          role: "parent",
          avatar: "👪",
          phone: `0803 ${String(1000 + parents.size * 137).slice(0, 3)} ${String(4000 + parents.size * 211)}`,
        };
        parents.set(surname, parent);
        out.push(parent);
      }
      out.push({
        id: `stu_${start + i}`,
        name,
        avatar,
        role: "student",
        classId,
        email: i === 0 && classId === "p4" ? `student@${DOMAIN}` : `${name.split(" ")[0].toLowerCase()}@${DOMAIN}`,
        password: PASSWORD,
        gender,
        boarding,
        dob,
        parentId: parent.id,
        admissionNo: `${school.admissionPrefix}/${classId === "p4" ? "2023" : "2022"}/${String(n++).padStart(3, "0")}`,
        admittedOn: classId === "p4" ? "2023-09-11" : "2022-09-12",
        address: "Wuse 2, Abuja",
      });
    });
  }
  return out;
}

export function buildSeed(): DB {
  const users: User[] = [
    { id: "adm_1", name: "Mrs Funmi Adeyemi", email: `admin@${DOMAIN}`, password: PASSWORD, role: "admin", avatar: "👑" },
    {
      id: "tch_1",
      name: "Mrs Adaeze Okafor",
      email: `teacher@${DOMAIN}`,
      password: PASSWORD,
      role: "teacher",
      avatar: "🌻",
      classIds: ["p4", "p5"],
      subjectIds: ["maths", "english", "social", "crs"],
    },
    {
      id: "tch_2",
      name: "Mr Tunde Bakare",
      email: `science@${DOMAIN}`,
      password: PASSWORD,
      role: "teacher",
      avatar: "🔬",
      classIds: ["p4", "p5"],
      subjectIds: ["science", "computer", "arts"],
    },
    ...family(),
  ];

  const studentIds = users.filter((u) => u.role === "student");

  const attendance: AttendanceRecord[] = [];
  schoolDaysBack(12).forEach((date, di) => {
    studentIds.forEach((s, si) => {
      const roll = (di * 7 + si * 3) % 17;
      attendance.push({
        date,
        classId: s.classId!,
        studentId: s.id,
        status: roll === 0 ? "absent" : roll === 5 ? "late" : "present",
      });
    });
  });

  const subjectsForResults = ["maths", "english", "science", "social", "arts", "computer", "crs"];
  const results: Result[] = [];
  studentIds.forEach((s, si) => {
    subjectsForResults.forEach((sub, j) => {
      const ca = 20 + ((si * 5 + j * 7) % 19);
      const exam = 28 + ((si * 11 + j * 13) % 31);
      results.push({
        id: `res_${s.id}_${sub}`,
        studentId: s.id,
        subjectId: sub,
        term: "Third Term",
        session: "2025/2026",
        ca,
        exam,
        comment: ca + exam >= 70 ? "Brilliant work, keep shining!" : ca + exam >= 50 ? "Good effort, keep it up." : "Let's practise a bit more together.",
      });
    });
  });

  const SESSION = "2026/2027";
  const TERM = "First Term";
  const feeItems: FeeItem[] = [
    { id: "fee_1", name: "Tuition", amount: 85000, classId: "p4", term: TERM, session: SESSION },
    { id: "fee_2", name: "Tuition", amount: 90000, classId: "p5", term: TERM, session: SESSION },
    { id: "fee_3", name: "Books & stationery", amount: 15000, classId: "all", term: TERM, session: SESSION },
    { id: "fee_4", name: "Lunch & snacks", amount: 45000, classId: "all", term: TERM, session: SESSION },
    { id: "fee_5", name: "PTA levy", amount: 5000, classId: "all", term: TERM, session: SESSION },
    { id: "fee_6", name: "Art materials & sketchbooks", amount: 8000, classId: "all", term: TERM, session: SESSION },
  ];
  const payPlan = [1, 0.5, 1, 0, 1, 0.6, 1, 0.4, 1, 1, 0, 0.75];
  const payments: Payment[] = [];
  let receipt = 1;
  studentIds.forEach((st, i) => {
    const billed = feeItems
      .filter((f) => (f.classId === "all" || f.classId === st.classId) && (!f.boardingOnly || st.boarding))
      .reduce((t, f) => t + f.amount, 0);
    const share = payPlan[i % payPlan.length];
    if (!share) return;
    const total = Math.round((billed * share) / 1000) * 1000;
    const parts = share === 1 && i % 3 === 0 ? [Math.round(total * 0.6 / 1000) * 1000, 0] : [total];
    if (parts.length === 2) parts[1] = total - parts[0];
    parts.forEach((amount, k) => {
      payments.push({
        id: `pay_${receipt}`,
        receiptNo: `${school.receiptPrefix}-${String(receipt).padStart(5, "0")}`,
        studentId: st.id,
        term: TERM,
        session: SESSION,
        amount,
        method: (["Bank transfer", "POS", "Cash"] as const)[(i + k) % 3],
        reference: (i + k) % 3 === 2 ? "" : `TRF${7310 + receipt * 13}`,
        date: daysFromNow(-30 + i + k * 9),
        receivedBy: "adm_1",
      });
      receipt++;
    });
  });

  const DAY_PLAN: Record<string, string[]> = {
    p4: ["maths", "english", "science", "social", "crs", "arts", "computer"],
    p5: ["english", "maths", "crs", "science", "computer", "social", "arts"],
  };
  const timetable: TimetableSlot[] = [];
  for (const classId of ["p4", "p5"]) {
    for (let day = 1; day <= 5; day++) {
      for (let period = 1; period <= 6; period++) {
        const plan = DAY_PLAN[classId];
        // Maths and English every morning, the rest rotate.
        const subjectId = period <= 2 ? plan[(period - 1 + day) % 2] : plan[2 + ((day * 3 + period) % 5)];
        timetable.push({ classId, day, period, subjectId });
      }
    }
  }

  return {
    settings: { term: TERM, session: SESSION, termStarts: "2026-09-14", termEnds: "2026-12-18", nextTermBegins: "2027-01-11" },
    feeItems,
    payments,
    timetable,
    notices: [
      { id: "ntc_1", title: "Mid-term break", body: "Mid-term break runs from Thursday 29th October to Monday 2nd November. School closes at 12 noon on Wednesday 28th, and resumes on Tuesday 3rd November. Happy holidays, little artists!", audience: "everyone", date: daysFromNow(-2), authorId: "adm_1", pinned: true },
      { id: "ntc_2", title: "School fees reminder", body: "Parents with outstanding first term fees are kindly reminded to complete payment before mid-term. Please send your proof of payment to the school office or email hello@doodlebrook-schools.example.", audience: "parents", date: daysFromNow(-5), authorId: "adm_1" },
      { id: "ntc_3", title: "Staff meeting on Friday", body: "All teaching staff should attend the staff meeting on Friday at 2:30pm in the staff room. Please bring your scheme of work and lesson notes for the term.", audience: "staff", date: daysFromNow(-1), authorId: "adm_1" },
      { id: "ntc_4", title: "Bring an old T-shirt for art", body: "Next Tuesday we are painting with our hands and feet! Please bring an old, big T-shirt to wear as an art smock. Pip says: messy is marvellous.", audience: "students", date: daysFromNow(-3), authorId: "tch_2" },
    ],
    applications: [
      { id: "app_1", childName: "Esther Adebayo", gender: "Female", dob: "2018-05-12", classWanted: "Primary 3", boarding: false, parentName: "Mrs Bola Adebayo", phone: "0802 555 1234", email: "bola.adebayo@example.com", address: "Garki, Abuja", previousSchool: "Little Acorns Playschool", status: "pending", note: "", createdAt: daysFromNow(-1) },
      { id: "app_2", childName: "Daniel Okon", gender: "Male", dob: "2022-02-03", classWanted: "Nursery 2", boarding: false, parentName: "Mr Ime Okon", phone: "0813 222 9876", email: "ime.okon@example.com", address: "Jabi, Abuja", previousSchool: "Sunbeam Kids Club", status: "exam booked", note: "Play-and-draw assessment booked for Saturday.", createdAt: daysFromNow(-6) },
      { id: "app_3", childName: "Hannah Lawal", gender: "Female", dob: "2016-10-22", classWanted: "Primary 5", boarding: false, parentName: "Dr Kunle Lawal", phone: "0809 111 4567", email: "kunle.lawal@example.com", address: "Maitama, Abuja", previousSchool: "Treetop Nursery", status: "admitted", note: "Lovely assessment morning. Welcome letter and starter sketchbook sent.", createdAt: daysFromNow(-15) },
    ],
    users,
    classes: [
      { id: "p4", name: "Primary 4 Crayon", emoji: "🖍️" },
      { id: "p5", name: "Primary 5 Palette", emoji: "🎨" },
    ],
    subjects: [
      { id: "maths", name: "Mathematics", emoji: "🔢", color: "#1F5FC4" },
      { id: "english", name: "English", emoji: "📖", color: "#C02675" },
      { id: "science", name: "Basic Science", emoji: "🔬", color: "#1C7A44" },
      { id: "social", name: "Social Studies", emoji: "🌍", color: "#B45309" },
      { id: "arts", name: "Creative Arts", emoji: "🎨", color: "#6B3FC0" },
      { id: "computer", name: "Computer Studies", emoji: "💻", color: "#0E7490" },
      { id: "crs", name: "Religious & Moral Studies", emoji: "🕊️", color: "#9A3412" },
    ],
    notes: [
      {
        id: "note_1",
        title: "Fractions are slices of pizza 🍕",
        body: "A fraction shows part of a whole.\n\nThe top number (numerator) tells us how many slices we have. The bottom number (denominator) tells us how many slices the whole pizza was cut into.\n\nExample: if a pizza is cut into 8 slices and you eat 3, you ate 3/8 of the pizza.\n\nTry it: draw a circle, cut it into 4 parts, and shade 1. What fraction did you shade?",
        subjectId: "maths",
        classId: "p4",
        teacherId: "tch_1",
        createdAt: daysFromNow(-6),
      },
      {
        id: "note_2",
        title: "Nouns: naming words",
        body: "A noun is a naming word. It names a person, place, animal or thing.\n\nPerson: teacher, Zainab, doctor\nPlace: Abuja, school, market\nAnimal: goat, parrot, fish\nThing: pencil, ball, chair\n\nHomework idea: find 5 nouns in your bedroom!",
        subjectId: "english",
        classId: "p4",
        teacherId: "tch_1",
        createdAt: daysFromNow(-4),
      },
      {
        id: "note_3",
        title: "Parts of a plant 🌱",
        body: "Roots hold the plant in the soil and drink water.\nThe stem carries water up to the leaves.\nLeaves make food for the plant using sunlight.\nFlowers make seeds so new plants can grow.\n\nExperiment: put a white flower in coloured water and watch what happens in 2 days!",
        subjectId: "science",
        classId: "p4",
        teacherId: "tch_2",
        createdAt: daysFromNow(-2),
      },
      {
        id: "note_4",
        title: "Our states and capitals",
        body: "Nigeria has 36 states and the Federal Capital Territory (Abuja).\n\nLagos State: Ikeja\nOyo State: Ibadan\nKano State: Kano\nEnugu State: Enugu\nRivers State: Port Harcourt\n\nCan you find your state on the map?",
        subjectId: "social",
        classId: "p5",
        teacherId: "tch_1",
        createdAt: daysFromNow(-3),
      },
    ],
    assignments: [
      {
        id: "asg_1",
        title: "Fraction pizza drawing",
        instructions: "Draw three pizzas. Shade 1/2 of the first, 1/4 of the second and 3/8 of the third. Write the fraction under each one. You can type your answers or upload a photo of your drawing.",
        subjectId: "maths",
        classId: "p4",
        teacherId: "tch_1",
        dueDate: daysFromNow(3),
        maxScore: 10,
        createdAt: daysFromNow(-5),
      },
      {
        id: "asg_2",
        title: "Noun hunt at home",
        instructions: "Find 10 nouns around your home. Sort them into Person, Place, Animal and Thing.",
        subjectId: "english",
        classId: "p4",
        teacherId: "tch_1",
        dueDate: daysFromNow(-1),
        maxScore: 10,
        createdAt: daysFromNow(-7),
      },
      {
        id: "asg_3",
        title: "Grow a bean in a jar",
        instructions: "Put a bean seed on wet cotton wool in a jar. Write down what you see every day for 5 days.",
        subjectId: "science",
        classId: "p4",
        teacherId: "tch_2",
        dueDate: daysFromNow(6),
        maxScore: 20,
        createdAt: daysFromNow(-1),
      },
    ],
    submissions: [
      {
        id: "sub_1",
        assignmentId: "asg_2",
        studentId: "stu_1",
        text: "Person: Mummy, baby. Place: kitchen, garden. Animal: cat, lizard. Thing: spoon, TV, bed, shoe.",
        submittedAt: daysFromNow(-2),
        score: 9,
        feedback: "Super noun hunting, Zainab! 🌟",
      },
      {
        id: "sub_2",
        assignmentId: "asg_2",
        studentId: "stu_2",
        text: "Person: Daddy, sister, Aunty. Place: room, parlour. Animal: dog. Thing: chair, cup, phone, bag.",
        submittedAt: daysFromNow(-2),
      },
    ],
    quizzes: [
      {
        id: "quiz_1",
        title: "Fraction fun quiz",
        description: "5 quick questions about fractions. You can do it!",
        subjectId: "maths",
        classId: "p4",
        teacherId: "tch_1",
        createdAt: daysFromNow(-3),
        questions: [
          { prompt: "A pizza is cut into 4 equal slices. You eat 1. What fraction did you eat?", options: ["1/2", "1/4", "4/1", "1/3"], answer: 1 },
          { prompt: "Which fraction is the same as one half?", options: ["2/4", "1/3", "3/4", "2/3"], answer: 0 },
          { prompt: "In 3/5, what is the bottom number called?", options: ["Numerator", "Denominator", "Divider", "Total"], answer: 1 },
          { prompt: "Which is bigger?", options: ["1/8", "1/2", "1/4", "1/6"], answer: 1 },
          { prompt: "How many quarters make a whole?", options: ["2", "3", "4", "5"], answer: 2 },
        ],
      },
      {
        id: "quiz_2",
        title: "Plant parts check",
        description: "Do you know what each part of a plant does?",
        subjectId: "science",
        classId: "p4",
        teacherId: "tch_2",
        createdAt: daysFromNow(-1),
        questions: [
          { prompt: "Which part of a plant drinks water from the soil?", options: ["Leaf", "Flower", "Root", "Seed"], answer: 2 },
          { prompt: "Leaves make food using…", options: ["Moonlight", "Sunlight", "Sand", "Rain only"], answer: 1 },
          { prompt: "Which part makes seeds?", options: ["Flower", "Stem", "Root", "Bark"], answer: 0 },
        ],
      },
    ],
    attempts: [
      { id: "att_1", quizId: "quiz_1", studentId: "stu_2", answers: [1, 0, 1, 1, 2], score: 5, total: 5, at: daysFromNow(-2) },
      { id: "att_2", quizId: "quiz_1", studentId: "stu_3", answers: [1, 0, 0, 1, 2], score: 4, total: 5, at: daysFromNow(-2) },
    ],
    attendance,
    results,
    news: [
      {
        id: "news_1",
        title: "Admissions open for 2026/2027 🎒",
        summary: "Places are open in the creche, nursery and every primary class. Book a play-and-draw morning for your child.",
        body: "We are delighted to welcome new families to Doodlebrook Schools for the 2026/2027 session. Places are open in the creche, nursery and every primary class.\n\nInstead of a scary test, new pupils join us for a relaxed play-and-draw morning with their future teachers. To book one, call 0800 000 3301 or 0800 000 3302, or apply online and the office will call you back.",
        date: daysFromNow(-3),
        emoji: "🎒",
        color: "#1F5FC4",
      },
      {
        id: "news_2",
        title: "Our giant class mural is finished! 🖍️",
        summary: "Primary 4 Crayon and Primary 5 Palette spent three weeks painting a rainbow river along the playground wall.",
        body: "If you have walked past the playground this week, you will have seen it: a forty-metre rainbow river full of fish, boats, hippos and one very proud pencil called Pip.\n\nEvery pupil in Primary 4 Crayon and Primary 5 Palette painted at least one creature. Parents are welcome to come and find their child's signature at pick-up time.",
        date: daysFromNow(-12),
        emoji: "🌈",
        color: "#E5484D",
      },
      {
        id: "news_3",
        title: "Welcome back for First Term",
        summary: "A warm welcome to new and returning pupils, and a big hello to our newest creche babies.",
        body: "Welcome back, everyone! The classrooms have fresh paint, new reading corners and boxes and boxes of crayons.\n\nPupils should arrive by 7:30am for hello circle. Please label water bottles, lunch boxes and art smocks with your child's name.",
        date: daysFromNow(-24),
        emoji: "✏️",
        color: "#FFC83D",
      },
    ],
    events: [
      { id: "evt_1", title: "Colour Day Carnival", date: daysFromNow(4), time: "9:00am", location: "School playground", description: "Each class dresses in one colour of the rainbow for songs, games and a giant group drawing.", emoji: "🌈" },
      { id: "evt_2", title: "Science & Make Fair", date: daysFromNow(11), time: "10:00am", location: "School hall", description: "Fizzing volcanoes, cardboard robots and paper planes. Families are welcome to visit every stand.", emoji: "🔬" },
      { id: "evt_3", title: "Open Morning for Parents", date: daysFromNow(18), time: "10:00am to 12:30pm", location: "All classrooms", description: "Meet your child's teachers, see their sketchbooks and try an art lesson yourself.", emoji: "👨‍👩‍👧" },
      { id: "evt_4", title: "End of Term Art Exhibition", date: daysFromNow(60), time: "11:00am", location: "School hall", description: "Every pupil's best work framed and on show, with music from the school choir and prize giving.", emoji: "🖼️" },
      { id: "evt_5", title: "New Pupils' Play-and-Draw Morning", date: "2026-09-05", time: "9:00am", location: "Creative studio", description: "The last assessment morning for new pupils joining in 2026/2027.", emoji: "📝" },
    ],
  };
}
