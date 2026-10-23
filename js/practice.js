/* ============================================================
   practice.js — Bank Latihan (≥100 item per komponen)
   Reading / Listening / Grammar / Speaking / Writing
   (Vocabulary diambil dari data-vocab.js, sudah 120+ kata)
   ============================================================ */
(function () {
  "use strict";
  const P = window.PRACTICE = {};

  const escT = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ============================================================
     READING & LISTENING — generator fakta (112 item masing2)
     ============================================================ */
  function factFactory() {
    const items = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const times = ["8:00", "9:15", "10:30", "12:45", "14:20", "16:05", "18:40", "20:00"];
    const places = ["museum", "library", "gallery", "park", "stadium", "aquarium", "castle", "zoo", "harbour", "garden"];
    const verbs = ["opens", "closes"];
    const stats = ["trees", "books", "visitors", "bikes", "solar panels", "students", "packages", "cups", "seats", "tickets"];
    const numbers = [25, 32, 47, 58, 64, 71, 86, 93, 120, 150, 200, 310, 450, 520, 640, 730, 810, 900, 1020, 1150];
    const names = ["Anna", "James", "Maria", "David", "Sofia", "Peter", "Lina", "Omar", "Grace", "Nina", "Tom", "Rita", "Ali", "Emma", "Leo", "Ivy", "Mia", "Jake", "Rose", "Kai", "Ben", "Zara"];
    const jobs = ["engineer", "nurse", "teacher", "designer", "chef", "pilot", "lawyer", "architect", "researcher", "artist", "manager", "photographer"];
    const landmarks = ["the central station", "the old bridge", "the market square", "the university", "the riverbank", "the clock tower", "the port", "the cathedral", "the stadium", "the airport"];

    for (let i = 0; i < 28; i++) {
      const d = days[i % 7], t = times[(i * 3 + 1) % times.length], pl = places[i % places.length], v = verbs[i % 2];
      const s = "The " + pl + " " + v + " at " + t + " on " + d + "s.";
      items.push({ tag: "schedule", script: s, q: "What time does the " + pl + " " + v + " on " + d + "s?", ans: t, alt: [], kind: "short" });
    }
    for (let i = 0; i < 28; i++) {
      const n = numbers[i % numbers.length], w = stats[i % stats.length];
      const s = "Last year, the survey recorded " + n + " " + w + ".";
      items.push({ tag: "stats", script: s, q: "How many " + w + " were recorded?", ans: String(n), alt: [], kind: "short" });
    }
    for (let i = 0; i < 28; i++) {
      const nm = names[i % names.length], jb = jobs[i % jobs.length];
      const s = "In the interview, " + nm + " said she works as a " + jb + ".";
      items.push({ tag: "role", script: s, q: "Who works as a " + jb + "?", ans: nm, alt: [], kind: "short" });
    }
    for (let i = 0; i < 28; i++) {
      const pl = places[i % places.length], lm = landmarks[i % landmarks.length];
      const s = "The new " + pl + " is located near " + lm + ".";
      items.push({ tag: "loc", script: s, q: "What is the new " + pl + " located near?", ans: lm.replace(/^the\s+/, ""), alt: [lm], kind: "short" });
    }
    return items; // 112 item
  }

  const FACTS = factFactory();

  P.reading = FACTS.map((f, i) => ({
    id: "r" + i,
    passage: f.script,
    q: f.q,
    prompt: "<p><strong>Passage:</strong> " + escT(f.script) + "</p><p><em>" + escT(f.q) + "</em></p>",
    kind: f.kind, answer: f.ans, alt: f.alt,
    why: f.script,
  }));

  P.listening = FACTS.map((f, i) => ({
    id: "l" + i,
    script: f.script,
    prompt: "<p><em>" + escT(f.q) + "</em></p>",
    kind: f.kind, answer: f.ans, alt: f.alt,
    why: f.script,
  }));

  /* ============================================================
     GRAMMAR — 124 item MCQ
     ============================================================ */
  const G = [];
  const g = (p, o, a) => G.push({ prompt: p, kind: "mcq", options: o, answer: a });

  // Articles (12)
  g("She works as ___ engineer.", ["a", "an", "the"], 1);
  g("He is ___ honest man.", ["a", "an", "the"], 1);
  g("They bought ___ new car yesterday.", ["a", "an", "the"], 0);
  g("___ sun rises in the east.", ["A", "An", "The"], 2);
  g("I read ___ interesting article this morning.", ["a", "an", "the"], 1);
  g("We visited ___ museum near the station.", ["a", "an", "the"], 0);
  g("She is ___ only child in her family.", ["a", "an", "the"], 2);
  g("Can you close ___ window, please?", ["a", "an", "the"], 2);
  g("My father is ___ university professor.", ["a", "an", "the"], 0);
  g("It was ___ unforgettable experience.", ["a", "an", "the"], 1);
  g("He gave me ___ useful piece of advice.", ["a", "an", "the"], 0);
  g("Paris is ___ capital of France.", ["a", "an", "the"], 2);

  // Tenses (12)
  g("She ___ (work) in a bank.", ["work", "works", "working"], 1);
  g("They ___ (play) football every weekend.", ["play", "plays", "playing"], 0);
  g("I ___ (go) to Bali last summer.", ["go", "went", "gone"], 1);
  g("We ___ (watch) a film tomorrow night.", ["will watch", "watched", "watch"], 0);
  g("He ___ (live) in London since 2015.", ["lives", "has lived", "lived"], 1);
  g("Look! It ___ (rain) outside now.", ["rains", "is raining", "rained"], 1);
  g("When I arrived, she ___ (cook) dinner.", ["cooks", "was cooking", "cooked"], 1);
  g("I ___ (see) him yesterday at the café.", ["see", "saw", "seen"], 1);
  g("By 2030, they ___ (build) the bridge.", ["build", "will have built", "built"], 1);
  g("She usually ___ (take) the bus to work.", ["take", "takes", "took"], 1);
  g("The train ___ (leave) at 9 o'clock every day.", ["leave", "leaves", "left"], 1);
  g("We ___ (know) each other for ten years.", ["know", "have known", "knew"], 1);

  // Perfect tenses (10)
  g("I ___ (finish) my homework already.", ["finished", "have finished", "was finished"], 1);
  g("She ___ (never/see) snow before.", ["never sees", "has never seen", "never saw"], 1);
  g("They ___ (just/arrive) at the station.", ["just arrive", "have just arrived", "arrived"], 1);
  g("He ___ (not/eat) breakfast this morning.", ["didn't eat", "hasn't eaten", "doesn't eat"], 1);
  g("We ___ (live) here for five years.", ["live", "have lived", "are living"], 1);
  g("By the time we got there, the film ___ (already/start).", ["already started", "had already started", "starts"], 1);
  g("She ___ (be) to Japan twice.", ["is", "has been", "was"], 1);
  g("I ___ (work) here since March.", ["work", "have worked", "am working"], 1);
  g("Have you ever ___ (try) sushi?", ["try", "tried", "trying"], 1);
  g("He ___ (break) his leg last week.", ["breaks", "has broken", "broke"], 2);

  // Conditionals (10)
  g("If it rains, we ___ stay inside.", ["will", "would", "should"], 0);
  g("If I were rich, I ___ travel the world.", ["will", "would", "do"], 1);
  g("If she had studied, she ___ the exam.", ["would pass", "would have passed", "passes"], 1);
  g("Unless you hurry, you ___ miss the bus.", ["will", "would", "can"], 0);
  g("If you heat ice, it ___ .", ["melts", "melted", "would melt"], 0);
  g("If I had known, I ___ come earlier.", ["would have", "would", "will"], 0);
  g("If they invite me, I ___ go.", ["would", "will", "went"], 1);
  g("She would have called if she ___ your number.", ["has", "had", "has had"], 1);
  g("If it were cheaper, more people ___ buy it.", ["will", "would", "are"], 1);
  g("Provided that you practice, you ___ improve.", ["will", "would", "were"], 0);

  // Passive voice (10)
  g("A new hospital ___ built last year.", ["was", "is", "will be"], 0);
  g("Rice ___ grown in many countries.", ["is", "are", "was"], 0);
  g("The report ___ by the manager every week.", ["is written", "writes", "is writing"], 0);
  g("The song ___ sung by millions.", ["is", "was", "are"], 0);
  g("These cookies ___ made by my grandmother.", ["were", "are", "was"], 1);
  g("The test ___ taken by thousands of students each year.", ["is", "are", "was"], 0);
  g("English ___ spoken all over the world.", ["is", "are", "were"], 0);
  g("The letter ___ sent yesterday.", ["is", "was", "were"], 1);
  g("Many books ___ printed every year.", ["is", "are", "was"], 1);
  g("The project ___ completed by next month.", ["will be", "is", "was"], 0);

  // Prepositions (16)
  g("She arrived ___ 5 o'clock.", ["in", "at", "on"], 1);
  g("The meeting is ___ Monday.", ["in", "at", "on"], 2);
  g("I was born ___ July.", ["in", "at", "on"], 0);
  g("We live ___ Jakarta.", ["in", "at", "on"], 0);
  g("He depends ___ his parents.", ["of", "on", "by"], 1);
  g("I'm interested ___ history.", ["on", "for", "in"], 2);
  g("She's good ___ languages.", ["at", "in", "on"], 0);
  g("We travelled ___ train.", ["by", "on", "with"], 0);
  g("They arrived ___ the airport early.", ["at", "in", "to"], 0);
  g("I'll see you ___ Saturday.", ["in", "on", "at"], 1);
  g("He apologised ___ being late.", ["for", "about", "of"], 0);
  g("The shop opens ___ 9 am.", ["in", "at", "on"], 1);
  g("She has worked here ___ 2018.", ["since", "for", "during"], 0);
  g("We waited ___ twenty minutes.", ["since", "for", "during"], 1);
  g("Divide the cake ___ four pieces.", ["into", "among", "between"], 0);
  g("The keys are ___ the table.", ["on", "in", "at"], 0);

  // Conjunctions (12)
  g("It was raining, ___ we stayed home.", ["so", "but", "or"], 0);
  g("He is tired ___ he worked all night.", ["because", "so", "although"], 0);
  g("I like tea ___ I don't like coffee.", ["but", "so", "because"], 0);
  g("You can have tea ___ coffee.", ["or", "and", "but"], 0);
  g("She studied hard ___ she passed.", ["so", "but", "because"], 0);
  g("___ it was cold, we went swimming.", ["Although", "Because", "So"], 0);
  g("He is rich, ___ he isn't happy.", ["so", "yet", "because"], 1);
  g("We'll stay home unless it ___ .", ["stop", "stops", "stopped"], 1);
  g("Both Tom ___ Mary came.", ["or", "and", "but"], 1);
  g("Neither John ___ Peter was there.", ["nor", "or", "and"], 0);
  g("She speaks English ___ French fluently.", ["and", "but", "or"], 0);
  g("I'll call you ___ I arrive.", ["as soon as", "so", "but"], 0);

  // Comparatives (10)
  g("This box is ___ than that one.", ["heavy", "heavier", "heaviest"], 1);
  g("She is the ___ student in the class.", ["good", "better", "best"], 2);
  g("This route is ___ than the other.", ["long", "longer", "longest"], 1);
  g("He runs ___ than his brother.", ["fast", "faster", "fastest"], 1);
  g("This is the ___ film I've seen.", ["good", "better", "best"], 2);
  g("Her house is ___ than mine.", ["big", "bigger", "biggest"], 1);
  g("Maths is ___ difficult than history for me.", ["more", "most", "much"], 0);
  g("That was the ___ boring lecture.", ["more", "most", "much"], 1);
  g("Apples are ___ expensive than mangoes.", ["less", "least", "little"], 0);
  g("He is as tall ___ his father.", ["as", "than", "like"], 0);

  // Modals (12)
  g("You ___ stop at the red light.", ["must", "might", "could"], 0);
  g("___ I borrow your pen?", ["May", "Must", "Shall"], 0);
  g("You ___ not smoke here.", ["must", "may", "should"], 0);
  g("She ___ be at home; the lights are on.", ["must", "can't", "should"], 0);
  g("We ___ wear a helmet when cycling.", ["should", "might", "could"], 0);
  g("He ___ swim when he was five.", ["could", "may", "must"], 0);
  g("It ___ rain later, so take an umbrella.", ["might", "must", "should"], 0);
  g("You ___ see a doctor about that cough.", ["should", "can", "must"], 0);
  g("They ___ finish the project by Friday.", ["must", "might", "should"], 0);
  g("I ___ meet you at noon, but I'm not sure.", ["might", "must", "should"], 0);
  g("You ___ have told me earlier!", ["should", "might", "could"], 0);
  g("Candidates ___ bring a photo ID.", ["must", "might", "would"], 0);

  // Relative clauses (10)
  g("The book ___ I borrowed was fascinating.", ["which", "who", "whom"], 0);
  g("The woman ___ lives next door is a nurse.", ["who", "which", "whose"], 0);
  g("That's the artist ___ painting won the prize.", ["whose", "who", "which"], 0);
  g("The house ___ roof is red belongs to Sam.", ["whose", "which", "that"], 0);
  g("People ___ exercise regularly feel healthier.", ["who", "which", "whom"], 0);
  g("The car ___ he bought is very fast.", ["which", "who", "whose"], 0);
  g("The movie ___ we watched was exciting.", ["that", "who", "whom"], 0);
  g("Anyone ___ arrives late must wait.", ["who", "which", "that"], 0);
  g("The team ___ won the match celebrated.", ["which", "who", "whom"], 1);
  g("I met a friend ___ I hadn't seen for years.", ["whom", "which", "whose"], 0);

  // Quantifiers (10)
  g("There aren't ___ chairs in the room.", ["many", "much", "few"], 0);
  g("How ___ milk do we need?", ["much", "many", "few"], 0);
  g("She has ___ friends in the city.", ["a few", "much", "little"], 0);
  g("We have ___ time left, so hurry.", ["little", "few", "many"], 0);
  g("Would you like ___ tea?", ["some", "any", "few"], 0);
  g("I don't have ___ money with me.", ["any", "some", "much"], 0);
  g("Take ___ apples you want.", ["as many as", "as much as", "such"], 0);
  g("There is ___ water in the bottle.", ["a little", "a few", "many"], 0);
  g("Almost ___ student passed the test.", ["every", "each", "both"], 0);
  g("___ of the twins plays the piano.", ["Both", "All", "Each"], 0);

  // Tandai kategori aturan untuk pembahasan
  const grammarRules = [
    ["Articles: a / an / the", 12],
    ["Tenses dasar (present / past / future)", 12],
    ["Perfect tenses (have/had + V3)", 10],
    ["Conditionals (if ... will/would)", 10],
    ["Passive voice (be + V3)", 10],
    ["Prepositions (in/on/at/for/since, dll.)", 16],
    ["Conjunctions (so/but/because/although, dll.)", 12],
    ["Comparatives & superlatives", 10],
    ["Modals (must/may/should/can, dll.)", 12],
    ["Relative clauses (who/which/that/whose)", 10],
    ["Quantifiers (some/any/much/many/few, dll.)", 10],
  ];
  let gIdx = 0;
  grammarRules.forEach(([label, count]) => {
    for (let i = 0; i < count; i++) { G[gIdx].why = label; gIdx++; }
  });

  P.grammar = G; // 124

  /* ============================================================
     SPEAKING — 115 pertanyaan/topik
     ============================================================ */
  const SP = [];

  // Part 1
  const p1 = [
    "Can you tell me about your hometown?",
    "What do you do in your free time?",
    "Do you prefer living in a house or an apartment? Why?",
    "What is your favourite food and why?",
    "Do you like cooking? Why or why not?",
    "What kind of music do you enjoy?",
    "Do you prefer reading books or watching films?",
    "Where do you usually go on holiday?",
    "How do you usually travel around your city?",
    "How often do you use your phone each day?",
    "Do you like shopping? Why or why not?",
    "What sports do you like to watch or play?",
    "Do you have any pets?",
    "What do you usually do in the morning?",
    "How do you spend your weekends?",
    "Do you know your neighbours well?",
    "What is your favourite colour?",
    "Are you good with numbers?",
    "Do you enjoy taking photographs?",
    "Do you like gardening or plants?",
    "Describe your best friend.",
    "Tell me about your family.",
    "What is your favourite season? Why?",
    "Do you prefer walking or driving?",
    "How much time do you spend online each day?",
    "Do you prefer talking on the phone or texting?",
    "What languages do you speak?",
    "Would you like to live in a big city? Why?",
    "Do you sleep well at night?",
    "What do you dislike about the weather where you live?",
    "Do you like visiting cafes?",
    "Do you enjoy festivals in your country?",
    "What is your favourite time of day?",
    "Do you like meeting new people?",
    "What did you enjoy as a child?",
    "Do you prefer tea or coffee?",
    "How do you relax after a long day?",
    "What is something you want to learn?",
    "Do you prefer indoor or outdoor activities?",
    "What makes you feel happy?",
  ];

  // Part 2 cue cards
  const p2 = [
    "Describe a book you have read that you really enjoyed.",
    "Describe a film you watched recently.",
    "Describe a person you admire.",
    "Describe a place you like to visit.",
    "Describe an object that is important to you.",
    "Describe an event that changed your life.",
    "Describe an unforgettable experience you had.",
    "Describe a job you would like to have.",
    "Describe a skill you would like to learn.",
    "Describe a special meal you had.",
    "Describe a journey that took longer than expected.",
    "Describe a tradition in your country.",
    "Describe an achievement you are proud of.",
    "Describe a child you know well.",
    "Describe a mobile app you use often.",
    "Describe a website you find useful.",
    "Describe a shop you like to visit.",
    "Describe a restaurant you enjoy.",
    "Describe a park or green space you like.",
    "Describe a sport you would like to try.",
    "Describe a teacher who influenced you.",
    "Describe a neighbour you know.",
    "Describe a gift you received.",
    "Describe a festival you celebrated recently.",
    "Describe a celebration in your family.",
    "Describe a time you faced a challenge.",
    "Describe a change you would like to make in your life.",
    "Describe a piece of good news you received.",
    "Describe a photograph that means a lot to you.",
    "Describe a time the weather affected your plans.",
  ];

  // Part 3
  const p3 = [
    "Why do you think education is important for society?",
    "Should university education be free? Why or why not?",
    "How has technology changed the way students learn?",
    "Will online learning ever fully replace classrooms?",
    "What are the disadvantages of children using technology too much?",
    "How can governments make education more equal?",
    "What are the biggest environmental problems today?",
    "Who is more responsible for the environment: individuals or governments?",
    "Can small daily actions really help the environment?",
    "What role should renewable energy play in the future?",
    "Why is public transport important for cities?",
    "Should cities ban cars from their centres?",
    "What makes a city liveable?",
    "How has the way we work changed in recent years?",
    "Will remote work become the norm?",
    "What are the benefits and drawbacks of working from home?",
    "How can people strike a balance between work and life?",
    "What makes a job satisfying?",
    "Why do some people ignore health advice?",
    "How can societies encourage healthier lifestyles?",
    "Should governments ban unhealthy foods?",
    "Is mental health as important as physical health?",
    "What are the benefits of regular exercise?",
    "How has social media changed communication?",
    "Is social media a positive or negative influence?",
    "Should there be limits on social media use for teenagers?",
    "How do you think media should be regulated?",
    "What is the role of journalism in society?",
    "How can people judge whether news is reliable?",
    "Why is it important to preserve cultural traditions?",
    "Does globalisation threaten local cultures?",
    "How can we protect minority languages?",
    "What are the benefits of learning about other cultures?",
    "How does tourism affect local communities?",
    "Is international travel a luxury or a necessity?",
    "What can young people do to improve the future?",
    "Is the world becoming more or less peaceful?",
    "How important is international cooperation?",
    "What is the value of volunteering?",
    "How can we reduce inequality in society?",
  ];

  p1.forEach((q) => SP.push({ part: "1", q }));
  p2.forEach((q) => SP.push({ part: "2", q, cue: true }));
  p3.forEach((q) => SP.push({ part: "3", q }));

  P.speaking = SP; // 40 + 30 + 40 = 110

  /* ============================================================
     WRITING — 60 Task 1 + 55 Task 2 = 115
     ============================================================ */
  const W = [];
  const t1Topics = [
    "energy use in households",
    "monthly rainfall totals in a city",
    "the number of tourists visiting a region",
    "employment by sector in a country",
    "daily screen time for teenagers",
    "water consumption per person",
    "visitor arrivals from 2010 to 2020",
    "online shopping habits by age group",
    "commuting methods in a city",
    "recycling rates by material",
  ];
  const t1Charts = ["bar chart", "line graph", "pie chart", "table", "process diagram", "map"];
  for (let i = 0; i < t1Topics.length; i++) {
    for (let j = 0; j < t1Charts.length; j++) {
      W.push({
        type: "1",
        task: "The " + t1Charts[j] + " below shows " + t1Topics[i] + ". Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        hint: "Overview + 2–3 fitur utama. Gunakan past tense untuk data lampau.",
      });
    }
  }

  const t2 = [
    "Some people think children should start learning a foreign language at primary school, while others believe secondary school is better. Discuss both views and give your opinion.",
    "Governments should spend more on public transport rather than building new roads. To what extent do you agree or disagree?",
    "In many countries, young people spend too much time on social media. What are the causes, and what solutions can you suggest?",
    "University education should be free for everyone. Do you agree or disagree?",
    "Some believe the best way to reduce crime is longer prison sentences. Others favour education and rehabilitation. Discuss both views and give your opinion.",
    "People today are less healthy than in the past. Why do you think this is, and what can be done about it?",
    "Advertising aimed at children should be banned. To what extent do you agree or disagree?",
    "Some prefer living in a big city, while others prefer the countryside. Discuss both views and give your opinion.",
    "Technology makes people more isolated. To what extent do you agree?",
    "Homework should be abolished in primary schools. Do you agree or disagree?",
    "Global tourism can harm local cultures. Discuss both views and give your opinion.",
    "Plastic packaging should be banned. To what extent do you agree or disagree?",
    "Some say childhood is the happiest time of life; others say adulthood is better. Discuss both views.",
    "Artificial intelligence will create more jobs than it destroys. To what extent do you agree?",
    "Paying with cash is better than using digital payments. Do you agree or disagree?",
    "Zoos are cruel and should be closed. Discuss both views and give your opinion.",
    "Healthy eating should be taught in schools. To what extent do you agree or disagree?",
    "Working from home benefits employees more than employers. Discuss both views.",
    "Space exploration is a waste of money. Do you agree or disagree?",
    "Public libraries are no longer necessary in the digital age. Discuss both views and give your opinion.",
    "Young people should be required to do volunteer work. To what extent do you agree or disagree?",
    "Fast food consumption is a major cause of health problems. What are the causes and solutions?",
    "School uniforms should be compulsory in all schools. Do you agree or disagree?",
    "Cities should restrict cars to reduce pollution. Discuss both views and give your opinion.",
    "Exams are the best way to assess students. To what extent do you agree or disagree?",
    "Online learning will replace face-to-face classrooms. Discuss both views and give your opinion.",
    "Governments should fund the arts. Do you agree or disagree?",
    "Nuclear energy is the best solution to climate change. Discuss both views and give your opinion.",
    "Learning practical skills is more important than academic knowledge. To what extent do you agree or disagree?",
    "All children should learn to play a musical instrument. Do you agree or disagree?",
    "Social media has a negative effect on young people's mental health. Discuss both views and give your opinion.",
    "Cities should prioritise pedestrians over cars. To what extent do you agree or disagree?",
    "Tourism is the best way to learn about other cultures. Discuss both views and give your opinion.",
    "Governments should not interfere in what people eat. Do you agree or disagree?",
    "Remote learning has more advantages than disadvantages. To what extent do you agree?",
    "Private cars should be banned in city centres. Discuss both views and give your opinion.",
    "Children should be given more freedom to make decisions. Do you agree or disagree?",
    "The internet has made newspapers unnecessary. To what extent do you agree?",
    "Living alone is better than living with family. Discuss both views and give your opinion.",
    "Gap years before university are a good idea. Do you agree or disagree?",
    "Advertising has a positive role in society. Discuss both views and give your opinion.",
    "Governments should tax unhealthy food and drink. To what extent do you agree?",
    "Warmer relationships with colleagues matter more than high salary. Discuss both views.",
    "Recycling is the individual's responsibility, not the government's. Do you agree or disagree?",
    "Children learn more from failure than from success. Discuss both views and give your opinion.",
    "E-books will replace printed books. To what extent do you agree?",
    "People should move to smaller towns to improve their quality of life. Discuss both views.",
    "Every citizen should perform one year of national service. Do you agree or disagree?",
    "Globalisation benefits everyone equally. Discuss both views and give your opinion.",
    "Cities should invest in parks rather than shopping centres. To what extent do you agree?",
    "Teenagers should have part-time jobs. Discuss both views and give your opinion.",
    "Governments should spend more on prevention than on treatment. Do you agree or disagree?",
    "Travelling alone is better than travelling with a group. Discuss both views.",
    "A university degree is still the best path to success. To what extent do you agree?",
    "Media should be allowed to report on all public figures. Discuss both views and give your opinion.",
  ];
  t2.forEach((task) => W.push({ type: "2", task, hint: "Struktur: intro + body 1 + body 2 + conclusion (min. 250 kata)." }));

  P.writing = W; // 60 + 55 = 115

  P.counts = {
    reading: P.reading.length,
    listening: P.listening.length,
    grammar: P.grammar.length,
    speaking: P.speaking.length,
    writing: P.writing.length,
    vocabulary: VOCAB_SETS.reduce((a, s) => a + s.words.length, 0),
  };
})();
