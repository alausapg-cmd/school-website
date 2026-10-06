import type { AttendanceRecord, DB, Result, User } from "./types";

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

const PASSWORD = "sunshine";

const p4 = [
  ["Zainab Bello", "🦊"],
  ["Chidi Okeke", "🐯"],
  ["Tomi Adewale", "🐼"],
  ["David Mensah", "🦁"],
  ["Amara Nwosu", "🦄"],
  ["Ibrahim Musa", "🐸"],
] as const;
const p5 = [
  ["Kemi Johnson", "🐨"],
  ["Emeka Obi", "🐙"],
  ["Fatima Sani", "🦋"],
  ["Joshua Etim", "🐬"],
  ["Ngozi Eze", "🐝"],
  ["Seyi Coker", "🦉"],
] as const;

function students(list: readonly (readonly [string, string])[], classId: string, start: number): User[] {
  return list.map(([name, avatar], i) => ({
    id: `stu_${start + i}`,
    name,
    avatar,
    role: "student",
    classId,
    email: i === 0 && classId === "p4" ? "student@sunshine.test" : `${name.split(" ")[0].toLowerCase()}@sunshine.test`,
    password: PASSWORD,
  }));
}

export function buildSeed(): DB {
  const users: User[] = [
    { id: "adm_1", name: "Mrs Funmi Adeyemi", email: "admin@sunshine.test", password: PASSWORD, role: "admin", avatar: "👑" },
    {
      id: "tch_1",
      name: "Mrs Adaeze Okafor",
      email: "teacher@sunshine.test",
      password: PASSWORD,
      role: "teacher",
      avatar: "🌻",
      classIds: ["p4", "p5"],
      subjectIds: ["maths", "english", "social"],
    },
    {
      id: "tch_2",
      name: "Mr Tunde Bakare",
      email: "science@sunshine.test",
      password: PASSWORD,
      role: "teacher",
      avatar: "🔬",
      classIds: ["p4", "p5"],
      subjectIds: ["science", "computer", "arts"],
    },
    ...students(p4, "p4", 1),
    ...students(p5, "p5", 7),
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

  const subjectsForResults = ["maths", "english", "science", "social", "arts", "computer"];
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

  return {
    users,
    classes: [
      { id: "p4", name: "Primary 4 Sunflowers", emoji: "🌻" },
      { id: "p5", name: "Primary 5 Rainbows", emoji: "🌈" },
    ],
    subjects: [
      { id: "maths", name: "Mathematics", emoji: "🔢", color: "#3B82F6" },
      { id: "english", name: "English", emoji: "📖", color: "#EF5DA8" },
      { id: "science", name: "Basic Science", emoji: "🔬", color: "#22C55E" },
      { id: "social", name: "Social Studies", emoji: "🌍", color: "#F59E0B" },
      { id: "arts", name: "Creative Arts", emoji: "🎨", color: "#A855F7" },
      { id: "computer", name: "Computer Studies", emoji: "💻", color: "#06B6D4" },
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
        body: "A noun is a naming word. It names a person, place, animal or thing.\n\nPerson: teacher, Zainab, doctor\nPlace: Lagos, school, market\nAnimal: goat, parrot, fish\nThing: pencil, ball, chair\n\nHomework idea: find 5 nouns in your bedroom!",
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
        title: "Our Science Fair was a blast! 🚀",
        summary: "Volcanoes, solar ovens and a robot that waters plants. Our young scientists amazed everyone.",
        body: "Last Friday the school hall turned into a laboratory as over 120 pupils showed off their science projects.\n\nPrimary 5 Rainbows won the overall prize with a robot that waters plants when the soil gets dry. Primary 4 Sunflowers impressed the judges with a solar oven that baked real biscuits!\n\nA big thank you to the parents who came to cheer, and to Mr Bakare for organising the day.",
        date: daysFromNow(-5),
        emoji: "🔬",
        color: "#22C55E",
      },
      {
        id: "news_2",
        title: "Welcome back for First Term",
        summary: "A warm welcome to new and returning families for the 2026/2027 session.",
        body: "We are so happy to welcome everyone back! This term we have new reading corners in every classroom, a refreshed playground and two new clubs: Chess Club and Little Chefs.\n\nPlease remember that school starts at 7:30am and pupils should come with their water bottles every day.",
        date: daysFromNow(-20),
        emoji: "🎒",
        color: "#3B82F6",
      },
      {
        id: "news_3",
        title: "Inter-house sports: Yellow House takes the cup 🏆",
        summary: "Races, relays and a very loud cheering squad. Congratulations to Yellow House!",
        body: "What a day! Yellow House won the inter-house sports cup with 214 points, just ahead of Blue House with 201.\n\nSpecial mention to Kemi Johnson from Primary 5, who won three races in a row.",
        date: daysFromNow(-40),
        emoji: "🏃",
        color: "#F59E0B",
      },
    ],
    events: [
      { id: "evt_1", title: "Independence Day Cultural Parade", date: daysFromNow(4), time: "9:00am", location: "School field", description: "Come dressed in your cultural attire! Songs, dances and food from across Nigeria.", emoji: "🇳🇬" },
      { id: "evt_2", title: "Parents' Open Day", date: daysFromNow(11), time: "10:00am to 1:00pm", location: "All classrooms", description: "Meet your child's teachers, see their work and visit our new reading corners.", emoji: "👨‍👩‍👧" },
      { id: "evt_3", title: "Spelling Bee Finals", date: daysFromNow(18), time: "11:00am", location: "School hall", description: "Our best spellers from Primary 3 to 6 compete for the golden bee trophy.", emoji: "🐝" },
      { id: "evt_4", title: "Christmas Carol & End of Term Party", date: daysFromNow(60), time: "12:00pm", location: "School hall", description: "Carols, a nativity play and lots of fun to close the term.", emoji: "🎄" },
      { id: "evt_5", title: "Science Fair", date: daysFromNow(-5), time: "9:00am", location: "School hall", description: "Pupils showed off amazing science projects.", emoji: "🔬" },
    ],
  };
}
