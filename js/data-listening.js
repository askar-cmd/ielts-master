/* ============================================================
   data-listening.js — latihan Listening (dibacakan via TTS)
   tipe: mcq | tfng | fill | short
   ============================================================ */
const LISTENING_LIST = [
  {
    id: "le1", level: "beginner",
    title: "Form Filling — Registrasi",
    intro: "Anda akan mendengar percakapan pendaftaran di klub olahraga. Isi informasi yang hilang.",
    script: `
      Receptionist: Good morning, City Sports Club. How can I help you?
      Caller: Hi, I'd like to register for a membership.
      Receptionist: Certainly. Could I have your name, please?
      Caller: Yes, it's Sarah Jenkins. That's J-E-N-K-I-N-S.
      Receptionist: Thank you, Sarah. And can I take a contact number?
      Caller: Of course, it's zero seven seven zero, nine four five, three two one eight.
      Receptionist: Great. And your date of birth?
      Caller: The fourteenth of June, nineteen ninety-five.
      Receptionist: Perfect. And which class are you interested in?
      Caller: The spin class on Tuesday evenings.
      Receptionist: Wonderful. Your first session is free.
    `,
    questions: [
      { type: "fill", text: "Name: Sarah _____. Contact number: 0770 945 3218. Date of birth: 14th _____ 1995. Interested class: _____ class on Tuesdays.",
        blanks: [
          { answer: "Jenkins", alt: [] },
          { answer: "June", alt: [] },
          { answer: "spin", alt: ["Spin"] },
        ] },
      { type: "mcq", q: "When is the caller's chosen class held?",
        options: ["Monday mornings", "Tuesday evenings", "Saturday afternoons", "Sunday mornings"], answer: 1 },
      { type: "short", q: "What is the caller's surname?",
        answer: "Jenkins", alt: ["sarah jenkins"] },
    ],
  },

  {
    id: "le2", level: "advanced",
    title: "Monolog — Distraktor & Inference",
    intro: "Dengarkan pengumuman perpustakaan. Beberapa informsi dikoreksi. Perhatikan baik-baik.",
    script: `
      Welcome to the Central Library. I'd like to tell you about our new opening hours. From Monday to Friday, we used to open at nine in the morning... actually, we've changed that — we now open at eight-thirty. On weekends, we are open from ten in the morning until four in the afternoon.
      Please note that there are no longer any fines for overdue books, but you must renew them online before the due date.
      Our children's section has moved from the second floor... sorry, it is now on the first floor, next to the café.
      For study rooms, you can book them up to one week in advance by using the app.
    `,
    questions: [
      { type: "mcq", q: "What time does the library open on weekdays now?",
        options: ["9:00 a.m.", "8:30 a.m.", "10:00 a.m.", "4:00 p.m."], answer: 1 },
      { type: "tfng", q: "The library still charges fines for overdue books.", answer: "false" },
      { type: "short", q: "On which floor is the children's section now located?",
        answer: "first floor", alt: ["1st floor", "first", "floor one"] },
      { type: "short", q: "How far in advance can study rooms be booked?",
        answer: "one week", alt: ["a week", "1 week", "up to one week"] },
    ],
  },

  {
    id: "le3", level: "expert",
    title: "Kuliah — Full Test Simulation",
    intro: "Dengarkan kutipan kuliah tentang energi terbarukan, lalu jawab pertanyaan.",
    script: `
      Good morning everyone. Today I want to focus on the global transition towards renewable energy.
      In 2023, renewable sources accounted for roughly thirty percent of global electricity generation, with solar and wind leading the growth. The International Energy Agency predicts that by 2025, renewables will overtake coal as the world's largest source of electricity.
      One key driver is the dramatic fall in costs. The price of solar modules has dropped by nearly ninety percent since 2010, making solar competitive with fossil fuels in many regions.
      However, challenges remain. Energy storage is still expensive, and grid infrastructure in developing nations lags behind. Furthermore, some countries continue to subsidise fossil fuels, which slows the transition.
      In conclusion, while the momentum is encouraging, the pace of change must accelerate to meet climate targets.
    `,
    questions: [
      { type: "fill", text: "In 2023, renewables provided about _____ percent of global electricity. Solar and _____ led the growth. Solar module prices have fallen by nearly _____ percent since 2010.",
        blanks: [
          { answer: "30", alt: ["thirty", "30%", "thirty percent"] },
          { answer: "wind", alt: ["Wind"] },
          { answer: "90", alt: ["ninety", "90%", "ninety percent"] },
        ] },
      { type: "mcq", q: "According to the IEA, what will happen by 2025?",
        options: ["Coal will double", "Renewables will overtake coal as the largest electricity source", "Solar will become too expensive", "All fossil fuel subsidies will end"], answer: 1 },
      { type: "short", q: "Name one challenge mentioned that slows the energy transition.",
        answer: "energy storage", alt: ["expensive energy storage", "storage", "grid infrastructure", "fossil fuel subsidies", "subsidies"] },
    ],
  },

  {
    id: "le4", level: "intermediate",
    title: "Percakapan — Mendaftar Kursus",
    intro: "Dengarkan percakapan pendaftaran kursus bahasa Inggris malam hari, lalu jawab pertanyaan.",
    script: `
      Receptionist: Good afternoon, Northgate College. How can I help?
      Student: Hi, I'd like to enrol in an evening English course.
      Receptionist: Certainly. We have elementary, intermediate, and advanced levels.
      Student: Intermediate, please.
      Receptionist: Classes run four times a week, from seven to nine in the evening. The fee is one hundred and eighty pounds per term.
      Student: That sounds good. Do I need to buy books?
      Receptionist: The textbook costs twenty-five pounds, and there is a ten pound registration fee.
      Student: Fine. When does the course begin?
      Receptionist: Next Monday, the fifth of March.
    `,
    questions: [
      { type: "mcq", q: "Which level did the student choose?",
        options: ["Elementary", "Intermediate", "Advanced", "Beginner"], answer: 1 },
      { type: "short", q: "What is the cost of the textbook?",
        answer: "25", alt: ["25 pounds", "twenty five pounds", "£25", "twenty-five"] },
      { type: "fill", text: "Registration fee: £_____. The course fee is £_____ per term. Classes run from 7 to 9 in the evening.",
        blanks: [
          { answer: "10", alt: ["ten"] },
          { answer: "180", alt: ["one hundred and eighty", "a hundred and eighty"] },
        ] },
    ],
  },

  {
    id: "le5", level: "beginner",
    title: "Form Filling — Kartu Perpustakaan",
    intro: "Dengarkan percakapan pendaftaran kartu perpustakaan, lalu isi informasi yang hilang.",
    script: `
      Clerk: Good morning, City Library. How can I help you?
      Man: Hi, I'd like to get a library card.
      Clerk: Sure. Can I have your full name?
      Man: Yes, it's Mark Thompson. That's T-H-O-M-P-S-O-N.
      Clerk: Thank you, Mark. And your date of birth?
      Man: The third of April, nineteen eighty-eight.
      Clerk: Great. What's your postcode?
      Man: It's B one two P N.
      Clerk: Perfect. Which area are you most interested in?
      Man: Mainly history and travel books.
    `,
    questions: [
      { type: "fill", text: "Name: Mark _____. Date of birth: 3rd April 1988. Postcode: B1 2PN. Interested in: history and _____ books.",
        blanks: [
          { answer: "Thompson", alt: [] },
          { answer: "travel", alt: ["Travel"] },
        ] },
      { type: "short", q: "What is the man's surname?",
        answer: "Thompson", alt: ["mark thompson"] },
      { type: "mcq", q: "What type of books is the man most interested in?",
        options: ["Science fiction", "History and travel", "Romance", "Crime"], answer: 1 },
    ],
  },

  {
    id: "le6", level: "intermediate",
    title: "Percakapan — Memesan Liburan",
    intro: "Dengarkan percakapan dengan agen perjalanan, lalu jawab pertanyaan.",
    script: `
      Agent: Good afternoon, Planet Travel. How may I assist you?
      Client: I'd like to book a holiday to Greece.
      Agent: Certainly. When would you like to go?
      Client: In August, ideally the second week.
      Agent: We have a package to the island of Crete for eight nights, priced at six hundred and forty pounds per person.
      Client: Does that include meals?
      Agent: Yes, breakfast and dinner are included. Flights are extra.
      Client: And what about insurance?
      Agent: It's thirty-five pounds per person.
    `,
    questions: [
      { type: "mcq", q: "When does the client want to travel?",
        options: ["The first week of May", "The second week of August", "September", "December"], answer: 1 },
      { type: "short", q: "What is the price per person for the package?",
        answer: "640", alt: ["six hundred and forty pounds", "£640", "six hundred and forty"] },
      { type: "fill", text: "Insurance costs £_____ per person. The package includes breakfast and _____.",
        blanks: [
          { answer: "35", alt: ["thirty five", "thirty-five"] },
          { answer: "dinner", alt: ["Dinner"] },
        ] },
    ],
  },

  {
    id: "le7", level: "advanced",
    title: "Monolog — Pengumuman Fakultas",
    intro: "Dengarkan pengumuman mingguan fakultas sains. Perhatikan tanggal, ruangan, dan kewajiban.",
    script: `
      Welcome, everyone. This is the weekly announcement for the Faculty of Science.
      First, the library will be closed next Monday for maintenance. Please plan your study time accordingly.
      Second, the deadline for research project proposals has been extended to Friday, the twenty-eighth of June. The original deadline was the twenty-first, so that gives you an extra week.
      Third, the guest lecture on climate modelling by Professor Adebayo has moved from room two hundred and fourteen to the main hall. It starts at three o'clock.
      Finally, a reminder that lab safety training is mandatory for all new students before they can use the laboratories.
    `,
    questions: [
      { type: "mcq", q: "When will the library be closed?",
        options: ["Next Monday", "Friday 28th June", "Tomorrow", "Next month"], answer: 0 },
      { type: "fill", text: "The new deadline for proposals is Friday 28th June. The guest lecture has moved to the main _____ and starts at 3pm.",
        blanks: [
          { answer: "hall", alt: ["Hall"] },
        ] },
      { type: "tfng", q: "Lab safety training is optional for new students.", answer: "false" },
    ],
  },

  {
    id: "le8", level: "expert",
    title: "Kuliah — Urbanisasi Global",
    intro: "Dengarkan kutipan kuliah tentang urbanisasi, lalu jawab pertanyaan.",
    script: `
      Today we examine the uneven pace of urbanisation across the developing world.
      By 2050, the United Nations projects that nearly seventy percent of the global population will live in cities, up from about fifty-six percent today.
      However, growth is not uniform. Cities in sub-Saharan Africa and South Asia are expanding fastest, often through informal settlements where housing, sanitation, and transport lag behind.
      This rapid growth creates both opportunities and risks. On one hand, cities concentrate talent and innovation, driving economic output. On the other, congestion and pollution rise sharply as infrastructure fails to keep pace.
      One emerging solution is compact city planning, which promotes higher-density development and public transport to curb sprawl. Critics note that density alone does not guarantee affordability or liveability.
    `,
    questions: [
      { type: "fill", text: "By 2050, about _____ percent of the global population will live in cities. The fastest growth is in sub-Saharan Africa and _____ Asia. Compact city planning promotes higher-_____ development.",
        blanks: [
          { answer: "70", alt: ["seventy"] },
          { answer: "South", alt: ["south"] },
          { answer: "density", alt: ["Density"] },
        ] },
      { type: "mcq", q: "What is cited as a drawback of rapid urban growth?",
        options: ["Congestion and pollution", "Too much public transport", "Declining innovation", "A fall in population"], answer: 0 },
      { type: "short", q: "Which planning approach aims to curb urban sprawl?",
        answer: "compact city planning", alt: ["compact planning", "density"] },
    ],
  },
];

/* ============================================================
   Listening tambahan: 20 soal per level (80 item total)
   TTS-friendly script + soal otomatis (tfng / mcq / fill / short)
   ============================================================ */
(function () {
  const names = ["Anna","John","Maria","David","Sofia","Peter","Lina","Omar","Grace","Nina","Tom","Rita","Ali","Emma","Leo","Ivy","Mia","Jake","Rose","Kai"];
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dates = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th"];
  const years = ["2023","2024","2025"];
  const times = ["8:00","9:15","10:30","11:45","13:00","14:20","15:30","16:45","17:10","18:00","19:30","20:00"];
  const phones = ["08123456789","08198765432","08111222333","08144455566","08177788899"];
  const cities = ["Jakarta","Bandung","Surabaya","Yogyakarta","Bali","Medan","Makassar","Denpasar"];

  const mcq = (q, opts, ans) => ({ type: "mcq", q, options: opts, answer: ans });
  const tfng = (q, ans) => ({ type: "tfng", q, answer: ans });
  const fill = (text, blanks) => ({ type: "fill", text, blanks });
  const short = (q, ans, alt) => ({ type: "short", q, answer: ans, alt: alt || [] });

  const extra = [];

  /* ---------- HELPER: generate 20 items for one level ---------- */
  function genLevel(level, themes) {
    const out = [];
    themes.forEach((theme, ti) => {
      for (let v = 0; v < 4; v++) {
        const i = ti * 4 + v; // 0..19
        const name = names[i % names.length];
        const day = days[i % days.length];
        const date = dates[i % dates.length];
        const month = months[i % months.length];
        const year = years[i % years.length];
        const time = times[i % times.length];
        const phone = phones[i % phones.length];
        const city = cities[i % cities.length];
        const script = theme.script({ name, day, date, month, year, time, phone, city });
        const qs = theme.questions({ name, day, date, month, year, time, phone, city });
        out.push({
          id: "lp_" + level + "_" + String(i + 1).padStart(2, "0"),
          level: level,
          title: theme.title + " " + (i + 1),
          intro: theme.intro,
          script: script,
          questions: qs,
        });
      }
    });
    return out;
  }

  /* ============ BEGINNER ============ */
  const bThemes = [
    {
      title: "Hotel Booking", intro: "Dengarkan percakapan pemesanan kamar hotel.",
      script: ({ name, day, date, month, year, phone }) =>
        `Receptionist: Good afternoon, Grand Hotel. How can I help you?\nGuest: Hi, I'd like to book a room for two nights.\nReceptionist: Certainly. May I have your name?\nGuest: Yes, it's ${name}.\nReceptionist: Your phone number?\nGuest: It's ${phone}.\nReceptionist: When do you arrive?\nGuest: ${day}, the ${date} of ${month}, ${year}.`,
      questions: ({ name, phone, day, date, month, year }) => [
        tfng(`The guest's name is ${name}.`, true),
        tfng(`The guest wants to stay for three nights.`, false),
        mcq("What is the guest's phone number?", [phone, phones[(names.indexOf(name)+1)%phones.length], phones[(names.indexOf(name)+2)%phones.length]], 0),
        fill("Arrival: ${day}, ${date} ${month} ${year}. Phone: ${phone}.", [{answer:day},{answer:date},{answer:month},{answer:year},{answer:phone}]),
        short("How many nights does the guest want?", "two", ["2", "two nights"]),
      ],
    },
    {
      title: "Restaurant Order", intro: "Dengarkan pemesanan makanan di restoran.",
      script: ({ name, day, date, month, year, time }) =>
        `Waiter: Good evening. Table for two?\nCustomer: Yes, please. My name is ${name}.\nWaiter: Sure, ${name}. Would you like to order now?\nCustomer: Yes, I'd like the grilled chicken and a glass of orange juice.\nWaiter: Coming right up. Is that for here or to go?\nCustomer: For here, please.`,
      questions: ({ name }) => [
        tfng(`The customer's name is ${name}.`, true),
        tfng(`The customer ordered fish.`, false),
        mcq("What drink did the customer order?", ["Orange juice", "Coffee", "Tea", "Water"], 0),
        fill("Customer: ${name}. Order: grilled chicken and a glass of orange juice.", [{answer:name}]),
        short("Is the food for here or to go?", "for here", ["here"]),
      ],
    },
    {
      title: "Shop Purchase", intro: "Dengarkan percakapan belanja di toko.",
      script: ({ name, day, date, month, year }) =>
        `Clerk: Hello, can I help you find anything?\nShopper: Hi, I'm looking for a blue shirt, size medium.\nClerk: We have those over there. Anything else?\nShopper: No, just the shirt. How much is it?\nClerk: It's seventy-five thousand rupiah. Cash or card?\nShopper: Card, please.`,
      questions: () => [
        tfng("The shopper wants a blue shirt, size medium.", true),
        tfng("The shirt costs seventy thousand rupiah.", false),
        mcq("How does the shopper pay?", ["Cash", "Card", "Transfer", "Cheque"], 1),
        fill("Item: blue shirt, size medium. Price: seventy-five thousand rupiah. Payment: card.", [{answer:"blue shirt"},{answer:"medium"},{answer:"seventy-five thousand rupiah"},{answer:"card"}]),
        short("What color shirt does the shopper want?", "blue", ["Blue"]),
      ],
    },
    {
      title: "Asking Direction", intro: "Dengarkan seseorang menanyakan arah di jalan.",
      script: ({ city }) =>
        `Tourist: Excuse me, where is the nearest train station?\nLocal: Go straight for two blocks, then turn left. You'll see it on the right.\nTourist: Is it far from here?\nLocal: Not really, about five minutes on foot.\nTourist: Thank you very much!`,
      questions: () => [
        tfng("The tourist wants to go to the train station.", true),
        tfng("The station is on the left after two blocks.", false),
        mcq("How long does it take to walk to the station?", ["Two minutes", "Five minutes", "Ten minutes", "Twenty minutes"], 1),
        fill("Direction: go straight for two blocks, then turn left. Station on the right.", [{answer:"two blocks"},{answer:"left"},{answer:"right"}]),
        short("Where should the tourist turn after two blocks?", "left", ["Left"]),
      ],
    },
    {
      title: "Doctor Appointment", intro: "Dengarkan janji temu ke dokter.",
      script: ({ name, day, date, month, year, time }) =>
        `Receptionist: City Clinic, how may I help you?\nPatient: Hello, I'd like to make an appointment with Dr. Smith.\nReceptionist: Of course. Your name, please?\nPatient: ${name}.\nReceptionist: How about ${day}, ${date} of ${month}, at ${time}?\nPatient: That works. Thank you.`,
      questions: ({ name, day, date, month, year, time }) => [
        tfng(`The patient's name is ${name}.`, true),
        tfng(`The appointment is with Dr. Jones.`, false),
        mcq("What time is the appointment?", [time, times[(times.indexOf(time)+1)%times.length], times[(times.indexOf(time)+2)%times.length]], 0),
        fill("Patient: ${name}. Doctor: Dr. Smith. Time: ${time}. Date: ${date} ${month} ${year}.", [{answer:name},{answer:time},{answer:date},{answer:month},{answer:year}]),
        short("Which doctor does the patient want to see?", "Dr. Smith", ["Smith"]),
      ],
    },
  ];
  extra.push(...genLevel("beginner", bThemes));

  /* ============ INTERMEDIATE ============ */
  const iThemes = [
    {
      title: "Train Announcement", intro: "Dengarkan pengumuman di stasiun kereta api.",
      script: ({ city, time, day }) =>
        `Attention passengers. Train number 102 to ${city} is now boarding at platform 4. The train departs at ${time} on ${day}. Please have your ticket ready. For passengers going to Bandung, your train is delayed by twenty minutes due to track maintenance.`,
      questions: ({ city, time, day }) => [
        tfng(`Train 102 goes to ${city}.`, true),
        tfng(`The train to Bandung leaves on time.`, false),
        mcq("Which platform is train 102 at?", ["Platform 2", "Platform 4", "Platform 6", "Platform 8"], 1),
        fill("Train 102 to ${city} departs at ${time} on ${day} from platform 4.", [{answer:city},{answer:time},{answer:day}]),
        short("How many minutes is the Bandung train delayed?", "twenty", ["20", "twenty minutes"]),
      ],
    },
    {
      title: "Job Interview", intro: "Dengarkan wawancara kerja.",
      script: ({ name, city }) =>
        `Interviewer: Welcome, ${name}. Tell me about your experience.\nCandidate: Thank you. I've worked in customer service for three years in ${city}.\nInterviewer: Why do you want to work here?\nCandidate: I admire your company's reputation and I want to grow professionally.\nInterviewer: When can you start?\nCandidate: I can start next month.`,
      questions: ({ name, city }) => [
        tfng(`The candidate has worked for three years.`, true),
        tfng(`The candidate worked in Jakarta.`, city !== "Jakarta"),
        mcq("Where did the candidate work?", [city, cities[(cities.indexOf(city)+1)%cities.length], cities[(cities.indexOf(city)+2)%cities.length]], 0),
        fill("Candidate: ${name}. Experience: three years in customer service in ${city}. Start: next month.", [{answer:name},{answer:city}]),
        short("When can the candidate start working?", "next month", ["next month"]),
      ],
    },
    {
      title: "Library Rules", intro: "Dengarkan aturan perpustakaan.",
      script: () =>
        `Welcome to the Central Library. Please note: silence is required in the reading area. Food and drinks are not allowed inside. You may borrow up to five books for two weeks. Late returns will be fined five thousand rupiah per day.`,
      questions: () => [
        tfng("Food and drinks are allowed inside the library.", false),
        tfng("You may borrow up to five books.", true),
        mcq("How long can you borrow books?", ["One week", "Two weeks", "Three weeks", "One month"], 1),
        fill("Rules: silence in reading area. No food or drinks. Borrow up to five books for two weeks. Fine: five thousand rupiah per day.", [{answer:"five"},{answer:"two weeks"},{answer:"five thousand rupiah"}]),
        short("What is the fine for late returns per day?", "five thousand rupiah", ["5000", "five thousand"]),
      ],
    },
    {
      title: "Weather Report", intro: "Dengarkan ramalan cuaca.",
      script: ({ city }) =>
        `Good evening. Here is the weather forecast for ${city}. Tomorrow will be cloudy with a high of twenty-eight degrees and a low of twenty degrees. There is a sixty percent chance of rain in the afternoon. Please bring an umbrella if you go out.`,
      questions: ({ city }) => [
        tfng(`The forecast is for ${city}.`, true),
        tfng(`Tomorrow will be sunny all day.`, false),
        mcq("What is the high temperature tomorrow?", ["Twenty degrees", "Twenty-eight degrees", "Thirty degrees", "Thirty-five degrees"], 1),
        fill("${city} tomorrow: cloudy, high ${high} degrees, low ${low} degrees, ${chance}% chance of rain.", [{answer:city},{answer:"twenty-eight"},{answer:"twenty"},{answer:"sixty"}]),
        short("What should people bring if they go out?", "umbrella", ["an umbrella"]),
      ],
    },
    {
      title: "Apartment Rental", intro: "Dengarkan percakapan sewa apartemen.",
      script: ({ name, phone, day, date, month, year }) =>
        `Agent: Hello, Sunshine Apartments. How can I help?\nCaller: Hi, I'm interested in the two-bedroom apartment.\nAgent: Great. May I have your name and number?\nCaller: It's ${name}, ${phone}.\nAgent: When can you move in?\nCaller: ${day}, the ${date} of ${month}, ${year} works for me.`,
      questions: ({ name, phone, day, date, month, year }) => [
        tfng(`The caller wants a two-bedroom apartment.`, true),
        tfng(`The caller's name is Budi.`, name !== "Budi"),
        mcq("What is the caller's phone number?", [phone, phones[(phones.indexOf(phone)+1)%phones.length], phones[(phones.indexOf(phone)+2)%phones.length]], 0),
        fill("Caller: ${name}, ${phone}. Move in: ${day}, ${date} ${month} ${year}.", [{answer:name},{answer:phone},{answer:day},{answer:date},{answer:month},{answer:year}]),
        short("What type of apartment is the caller interested in?", "two-bedroom", ["two bedroom", "2-bedroom"]),
      ],
    },
  ];
  extra.push(...genLevel("intermediate", iThemes));

  /* ============ ADVANCED ============ */
  const aThemes = [
    {
      title: "University Lecture", intro: "Dengarkan potongan kuliah di universitas.",
      script: ({ name, city, year }) =>
        `Good morning, everyone. Today's lecture by Professor ${name} focuses on urban development in ${city} since ${year}. We will examine population growth, infrastructure challenges, and sustainable solutions. Please read chapter four before next week's seminar.`,
      questions: ({ name, city, year }) => [
        tfng(`Today's lecture is by Professor ${name}.`, true),
        tfng(`The lecture focuses on rural development.`, false),
        mcq("Which city is discussed?", [city, cities[(cities.indexOf(city)+1)%cities.length]], 0),
        fill("Lecture by Professor ${name} on urban development in ${city} since ${year}.", [{answer:name},{answer:city},{answer:year}]),
        short("Which chapter should students read before the seminar?", "chapter four", ["4", "chapter 4"]),
      ],
    },
    {
      title: "Business Meeting", intro: "Dengarkan rapat bisnis singkat.",
      script: ({ name, city, time }) =>
        `Chair: Let's begin. I'd like to welcome Ms. ${name} from our ${city} office. The agenda today: quarterly results, new product launch, and budget for next quarter. We start at ${time} sharp. Ms. ${name}, please present the quarterly results first.`,
      questions: ({ name, city, time }) => [
        tfng(`Ms. ${name} is from the ${city} office.`, true),
        tfng(`The meeting starts at nine o'clock.`, time !== "9:00"),
        mcq("What is NOT on the agenda?", ["Quarterly results", "New product launch", "Employee bonuses", "Budget for next quarter"], 2),
        fill("Attendee: Ms. ${name} from ${city}. Start time: ${time}. Agenda: results, product launch, budget.", [{answer:name},{answer:city},{answer:time}]),
        short("Who presents the quarterly results first?", "Ms. " + name, [name]),
      ],
    },
    {
      title: "News Interview", intro: "Dengarkan wawancara berita singkat.",
      script: ({ name, city }) =>
        `Reporter: Thank you for joining us, ${name}. You've lived in ${city} for twenty years. How has the city changed?\nResident: It's grown enormously. More buildings, more people, but also more traffic and pollution. Still, I love living here.`,
      questions: ({ name, city }) => [
        tfng(`${name} has lived in ${city} for twenty years.`, true),
        tfng(`The resident dislikes living in the city.`, false),
        mcq("What has increased enormously?", ["Buildings and people", "Parks and trees", "Quiet streets", "Job opportunities"], 0),
        fill("${name} has lived in ${city} for twenty years. Changes: more buildings, more people, more traffic, more pollution.", [{answer:name},{answer:city}]),
        short("How long has the resident lived in the city?", "twenty years", ["20 years", "twenty"]),
      ],
    },
    {
      title: "Scientific Talk", intro: "Dengarkan presentasi ilmiah pendek.",
      script: () =>
        `Our research shows that regular exercise improves memory and reduces stress. We tested one hundred students over three months. Those who exercised three times a week scored significantly higher on memory tests than those who did not.`,
      questions: () => [
        tfng("The research tested one hundred students.", true),
        tfng("Students who did not exercise scored higher.", false),
        mcq("How often did the successful group exercise?", ["Once a week", "Twice a week", "Three times a week", "Every day"], 2),
        fill("Study: one hundred students, three months. Exercise three times a week improved memory and reduced stress.", [{answer:"one hundred"},{answer:"three months"},{answer:"three times a week"}]),
        short("What did exercise improve according to the research?", "memory", ["Memory"]),
      ],
    },
    {
      title: "Tour Guide Speech", intro: "Dengarkan pidato pemandu wisata.",
      script: ({ city }) =>
        `Welcome to the old city of ${city}. This bridge was built in the nineteenth century and is one of our most famous landmarks. On your right, you can see the museum, which opens at nine every morning. Please stay with the group.`,
      questions: ({ city }) => [
        tfng(`The bridge was built in the nineteenth century.`, true),
        tfng(`The museum opens at ten every morning.`, false),
        mcq("What is on the right?", ["The bridge", "The museum", "The park", "The station"], 1),
        fill("Welcome to ${city}. Bridge built in the nineteenth century. Museum opens at nine every morning.", [{answer:city}]),
        short("What time does the museum open?", "nine", ["9", "9:00", "nine o'clock"]),
      ],
    },
  ];
  extra.push(...genLevel("advanced", aThemes));

  /* ============ EXPERT ============ */
  const eThemes = [
    {
      title: "Academic Seminar", intro: "Dengarkan diskusi seminar akademik.",
      script: ({ name, city }) =>
        `Moderator: Our next speaker, Dr. ${name}, will discuss climate resilience in coastal cities like ${city}. Dr. ${name}, the floor is yours.\nSpeaker: Thank you. Rising sea levels threaten infrastructure, especially in low-lying areas. Adaptation is no longer optional—it is urgent.`,
      questions: ({ name, city }) => [
        tfng(`Dr. ${name} discusses climate resilience in ${city}.`, true),
        tfng(`Adaptation is optional according to the speaker.`, false),
        mcq("What threatens infrastructure in coastal cities?", ["Rising sea levels", "Earthquakes", "Volcanoes", "Forest fires"], 0),
        fill("Speaker: Dr. ${name}. Topic: climate resilience in coastal cities like ${city}. Threat: rising sea levels.", [{answer:name},{answer:city}]),
        short("Is adaptation optional or urgent according to the speaker?", "urgent", ["Urgent"]),
      ],
    },
    {
      title: "Legal Consultation", intro: "Dengarkan konsultasi hukum singkat.",
      script: ({ name, city }) =>
        `Client: Good morning, I need advice about a contract dispute in ${city}.\nLawyer: Good morning, ${name}. Please explain the situation. Did you sign a written agreement?\nClient: Yes, but the other party breached the terms last month.\nLawyer: We can file a claim. Bring the contract to our office tomorrow at ten.`,
      questions: ({ name, city }) => [
        tfng(`The contract dispute is in ${city}.`, true),
        tfng(`The client did not sign a written agreement.`, false),
        mcq("When should the client bring the contract?", ["Today", "Tomorrow at ten", "Next week", "Never"], 1),
        fill("Client: ${name}. Issue: contract dispute in ${city}. Agreement: written. Breach: last month. Appointment: tomorrow at ten.", [{answer:name},{answer:city}]),
        short("What did the other party do last month?", "breached the terms", ["breach", "breached the contract"]),
      ],
    },
    {
      title: "Medical Consultation", intro: "Dengarkan konsultasi medis.",
      script: ({ name }) =>
        `Doctor: Hello ${name}, I've reviewed your test results. Your cholesterol is slightly high, but your blood pressure is normal. I recommend more exercise and less fatty food. Come back in three months for a follow-up.\nPatient: Thank you, doctor.`,
      questions: ({ name }) => [
        tfng(`The patient's name is ${name}.`, true),
        tfng(`The patient's blood pressure is high.`, false),
        mcq("What is slightly high?", ["Blood pressure", "Cholesterol", "Blood sugar", "Weight"], 1),
        fill("Patient: ${name}. Cholesterol: slightly high. Blood pressure: normal. Advice: more exercise, less fatty food. Follow-up: three months.", [{answer:name}]),
        short("When should the patient return for follow-up?", "three months", ["3 months", "three month"]),
      ],
    },
    {
      title: "Philosophical Discussion", intro: "Dengarkan diskusi filsipah singkat.",
      script: () =>
        `Speaker A: Do you think happiness is something we find, or something we create?\nSpeaker B: I believe we create it through our choices and relationships. Happiness isn't a destination; it's a way of traveling.`,
      questions: () => [
        tfng("Speaker B believes happiness is a destination.", false),
        tfng("Speaker B believes we create happiness through choices.", true),
        mcq("What is happiness NOT, according to Speaker B?", ["A destination", "A way of traveling", "Created through choices", "Related to relationships"], 0),
        fill("Speaker B: Happiness is not a destination; it's a way of traveling. Created through choices and relationships.", [{answer:"destination"},{answer:"choices"},{answer:"relationships"}]),
        short("According to Speaker B, how do we create happiness?", "through our choices and relationships", ["choices and relationships"]),
      ],
    },
    {
      title: "Economic Analysis", intro: "Dengarkan analisis ekonomi singkat.",
      script: ({ city }) =>
        `Analyst: The economy of ${city} grew by five percent last year, driven by tourism and technology. However, inflation rose to four percent, which concerns small business owners. Investment in green energy is expected to increase next year.`,
      questions: ({ city }) => [
        tfng(`${city}'s economy grew by five percent last year.`, true),
        tfng(`Inflation fell to two percent.`, false),
        mcq("What drove the city's economic growth?", ["Tourism and technology", "Agriculture and mining", "Manufacturing only", "Oil exports"], 0),
        fill("${city} economy: grew five percent last year. Drivers: tourism and technology. Inflation: four percent. Next year: more green energy investment.", [{answer:city}]),
        short("What rose to four percent according to the analyst?", "inflation", ["Inflation"]),
      ],
    },
  ];
  extra.push(...genLevel("expert", eThemes));

  LISTENING_LIST.push(...extra);
})();

