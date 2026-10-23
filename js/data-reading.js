/* ============================================================
   data-reading.js — passage + soal Reading
   tipe: mcq | tfng | match | fill | short
   ============================================================ */
const READING_LIST = [
  {
    id: "re1", level: "beginner",
    title: "The History of the Bicycle",
    passageHTML: `
      <p>The bicycle is one of the most efficient forms of transport ever invented. It is cheap, quiet, and produces no pollution. Although the modern bicycle looks simple, it took more than a century of invention to develop.</p>
      <p>The first pedal-powered bicycle appeared in the <strong>1860s in France</strong>. It was called the velocipede, but people nicknamed it the "boneshaker" because its rigid, heavy frame made rides extremely bumpy and uncomfortable.</p>
      <p>In the 1870s, the penny-farthing became popular. It had a huge front wheel and a small rear wheel, which made it fast but dangerous. Riders often fell from great heights.</p>
      <p>The turning point came in <strong>1885</strong> with the invention of the "safety bicycle," which had two wheels of equal size and a <strong>chain drive</strong>. It was much safer and easier to ride, and it quickly replaced older designs.</p>
      <p>By the early 1900s, mass production had made bicycles affordable for ordinary people. Today, cycling is encouraged in many cities for both health and environmental reasons.</p>`,
    source: "Adapted from public encyclopaedia entries.",
    questions: [
      { type: "tfng", q: "The first pedal bicycle was invented in France.", answer: "true" },
      { type: "tfng", q: "The boneshaker was comfortable to ride.", answer: "false" },
      { type: "tfng", q: "Bicycles were widely used by armies in the 19th century.", answer: "notgiven" },
      { type: "tfng", q: "The safety bicycle had a chain drive.", answer: "true" },
      { type: "mcq", q: "Why was the velocipede called the 'boneshaker'?",
        options: ["Because of its big front wheel", "Because of its rigid, uncomfortable frame", "Because it was very fast", "Because it was made of bones"], answer: 1 },
      { type: "mcq", q: "Which of the following made the safety bicycle safer than the penny-farthing?",
        options: ["Two wheels of equal size", "A smaller rear wheel", "A heavier frame", "No chain drive"], answer: 0 },
    ],
  },

  {
    id: "re2", level: "advanced",
    title: "Urban Green Spaces",
    passageHTML: `
      <p><strong>A.</strong> As cities grow denser, green spaces — parks, gardens, and tree-lined streets — are becoming increasingly precious. They are no longer seen as mere decoration but as essential infrastructure for urban life.</p>
      <p><strong>B.</strong> Research consistently shows that spending time in nature reduces stress, lowers blood pressure, and improves mental well-being. Even a short walk in a park can noticeably lift a person's mood.</p>
      <p><strong>C.</strong> Beyond individual health, vegetation helps regulate city temperatures. Trees provide shade and release moisture, which can lower surrounding air temperatures by several degrees during heat waves, a phenomenon known as the urban cooling effect.</p>
      <p><strong>D.</strong> Green spaces also act as natural drains. Soil and plant roots absorb rainwater, reducing the risk of flooding in areas covered by impermeable surfaces such as roads and pavements.</p>
      <p><strong>E.</strong> Nevertheless, urban planners face a dilemma. Land in cities is expensive, and the demand for housing and commercial buildings is intense. Sometimes, green space must compete with development.</p>
      <p><strong>F.</strong> Many cities are therefore adopting innovative solutions, such as rooftop gardens, vertical walls, and pocket parks built on small unused plots. These approaches show that greenery can be integrated even where space is scarce.</p>`,
    source: "Adapted for educational purposes.",
    headings: [
      "The cooling effect of vegetation",
      "The conflict between development and nature",
      "Why parks improve mental health",
      "How green spaces help prevent flooding",
      "Innovative ways to add greenery in crowded cities",
      "The history of city planning",
      "The economic value of public parks",
      "Why green spaces are vital urban infrastructure",
    ],
    questions: [
      { type: "match", q: "Match each paragraph (A–F) to the most suitable heading.", items: [
        { label: "Paragraph A", correct: 7 },
        { label: "Paragraph B", correct: 2 },
        { label: "Paragraph C", correct: 0 },
        { label: "Paragraph D", correct: 3 },
        { label: "Paragraph E", correct: 1 },
        { label: "Paragraph F", correct: 4 },
      ] },
    ],
  },

  {
    id: "re3", level: "expert",
    title: "Modern Sleep Research",
    passageHTML: `
      <p>For decades, scientists assumed that sleep was a passive state in which the brain simply switched off. Modern research has overturned this view. During sleep, the brain performs essential maintenance: it consolidates memories, clears metabolic waste, and restores energy.</p>
      <p>One of the most significant discoveries is the role of the <strong>glymphatic system</strong>, a network that flushes toxins from the brain during deep sleep. This process is thought to protect against neurological disorders.</p>
      <p>Sleep also occurs in cycles. A typical night includes several cycles, each lasting about <strong>90 minutes</strong>. Each cycle moves through light sleep, deep sleep, and rapid eye movement (REM) sleep, when most dreaming happens.</p>
      <p>Despite its obvious benefits, sleep is widely neglected. Modern lifestyles — screen time, irregular schedules, and caffeine — have shortened the average sleep duration. Researchers warn that chronic sleep deprivation is linked to weakened immunity, impaired judgment, and increased risk of chronic illness.</p>
      <p>Sleep experts therefore recommend consistent bedtimes, limiting light exposure before bed, and creating a cool, dark sleeping environment. Ironically, many people ignore this advice because they believe sleep is 'wasted time.'</p>`,
    source: "Adapted from popular science summaries.",
    questions: [
      { type: "fill", text: "The brain's maintenance work during sleep includes consolidating _____ and clearing metabolic _____. Research shows that sleep occurs in cycles of around _____ minutes. In addition, the _____ system removes toxins from the brain.",
        blanks: [
          { answer: "memories", alt: ["memory"] },
          { answer: "waste", alt: ["wastes"] },
          { answer: "90", alt: ["ninety"] },
          { answer: "glymphatic", alt: ["glymphatic system"] },
        ] },
      { type: "mcq", q: "Which of the following was once the prevailing view of sleep?",
        options: ["It is a time for active brain repair", "It is a passive state when the brain switches off", "It only occurs during REM cycles", "It damages metabolic waste"], answer: 1 },
      { type: "short", q: "What method do researchers recommend to improve sleep quality regarding bedtime?",
        answer: "consistent bedtimes", alt: ["consistent bedtime", "regular bedtimes", "keeping a consistent bedtime"] },
      { type: "short", q: "Name one modern factor that has shortened average sleep duration.",
        answer: "screen time", alt: ["screen time and irregular schedules", "irregular schedules", "caffeine", "screens", "caffeine consumption"] },
    ],
  },

  {
    id: "re4", level: "intermediate",
    title: "A Short History of Coffee",
    passageHTML: `
      <p>The coffee plant is believed to have been <strong>first cultivated in the highlands of Ethiopia</strong>, where legend says a goat herder noticed his animals becoming unusually energetic after eating certain berries.</p>
      <p>From Ethiopia, coffee spread into Arabia, where it was roasted and brewed as a drink. By the <strong>17th century</strong>, coffeehouses had appeared across Europe, and the beverage quickly became a global commodity.</p>
      <p>Today, coffee is grown in more than fifty countries, mostly near the equator. However, the industry faces challenges, including volatile prices and the livelihoods of smallholder farmers.</p>
      <p>To address this, schemes such as Fairtrade aim to guarantee farmers a minimum price for their beans, although <strong>not all producers are covered</strong> by such certifications.</p>
      <p>Health research paints a nuanced picture. Moderate consumption has been linked to a lower risk of certain conditions, but heavy intake can cause insomnia and anxiety in sensitive individuals.</p>`,
    source: "Adapted for educational purposes.",
    questions: [
      { type: "tfng", q: "Coffee was first cultivated in Ethiopia.", answer: "true" },
      { type: "tfng", q: "Coffee reached Europe before the 16th century.", answer: "false" },
      { type: "tfng", q: "All coffee farmers are protected by Fairtrade certification.", answer: "false" },
      { type: "fill", text: "By the _____ century, coffeehouses had appeared across Europe. Coffee spread first into _____ before reaching Europe.",
        blanks: [
          { answer: "17th", alt: ["seventeenth", "17", "seventeenth century"] },
          { answer: "Arabia", alt: ["arabia"] },
        ] },
    ],
  },

  {
    id: "re5", level: "advanced",
    title: "Micro-farming in Cities",
    passageHTML: `
      <p><strong>A.</strong> Urban farming, often called micro-farming, refers to growing food in small spaces within cities — on rooftops, balconies, and vacant lots.</p>
      <p><strong>B.</strong> Supporters argue it improves food security and shortens supply chains, reducing the environmental cost of transporting food over long distances.</p>
      <p><strong>C.</strong> It also creates green jobs and strengthens community ties, as neighbours collaborate in shared gardens and learn valuable skills.</p>
      <p><strong>D.</strong> Critics, however, point out that yields are small and that city land is expensive, making micro-farming economically unviable at a large scale.</p>
      <p><strong>E.</strong> There is also the challenge of contamination: urban soil may contain heavy metals, which requires careful testing and remediation before planting.</p>
      <p><strong>F.</strong> Nonetheless, pilot projects in several cities suggest that, with the right support and technology, urban farms can thrive and even turn a modest profit.</p>`,
    source: "Adapted from urban planning literature.",
    headings: [
      "Defining urban micro-farming",
      "Environmental and food-security benefits",
      "Social and employment advantages",
      "Economic doubts about viability",
      "Concerns about soil contamination",
      "Encouraging results from pilot projects",
    ],
    questions: [
      { type: "match", q: "Match each paragraph (A–F) to the most suitable heading.", items: [
        { label: "Paragraph A", correct: 0 },
        { label: "Paragraph B", correct: 1 },
        { label: "Paragraph C", correct: 2 },
        { label: "Paragraph D", correct: 3 },
        { label: "Paragraph E", correct: 4 },
        { label: "Paragraph F", correct: 5 },
      ] },
      { type: "mcq", q: "Which of the following is cited as an economic barrier to micro-farming?",
        options: ["The high cost of city land", "A lack of water", "Too much sun", "The price of seeds"], answer: 0 },
      { type: "tfng", q: "Micro-farming is only possible in rural areas.", answer: "false" },
    ],
  },

  {
    id: "re6", level: "expert",
    title: "How Cognitive Biases Shape Decisions",
    passageHTML: `
      <p>Cognitive biases are systematic patterns of deviation from rationality in judgement. Far from being rare errors, they are pervasive and influence everything from consumer choices to major policy decisions.</p>
      <p>One of the most studied is the <strong>anchoring effect</strong>, whereby people rely too heavily on the first piece of information they receive. For example, a listed price can anchor a buyer's perception of a later offer, even when the initial figure is arbitrary.</p>
      <p>A second example is <strong>confirmation bias</strong>, the tendency to search for, interpret, and remember information in ways that confirm pre-existing beliefs. This makes people dismiss evidence that contradicts their views.</p>
      <p><strong>Loss aversion</strong>, another powerful bias, describes how losses are perceived as roughly twice as painful as equivalent gains are pleasurable. This asymmetry helps explain why investors hold onto losing stocks for too long.</p>
      <p>Importantly, biases are not always harmful. In many everyday situations, they serve as mental shortcuts that allow quick decisions. Problems arise mainly when choices are complex and high-stakes, where unchecked biases lead to systematic mistakes.</p>`,
    source: "Adapted from behavioural economics summaries.",
    questions: [
      { type: "fill", text: "The anchoring effect makes people rely too heavily on the first piece of _____. Confirmation bias makes people dismiss _____ that contradicts their beliefs. Loss aversion says losses feel about _____ as painful as gains are pleasurable.",
        blanks: [
          { answer: "information", alt: ["info"] },
          { answer: "evidence", alt: ["facts", "information"] },
          { answer: "twice", alt: ["twice as"] },
        ] },
      { type: "mcq", q: "According to the text, when are biases most problematic?",
        options: ["When choices are simple and routine", "When choices are complex and high-stakes", "Whenever any decision is made", "Never — they are always helpful"], answer: 1 },
      { type: "short", q: "Which bias explains why investors hold onto losing stocks?",
        answer: "loss aversion", alt: ["loss"] },
    ],
  },

  {
    id: "re7", level: "beginner",
    title: "The Honeybee",
    passageHTML: `
      <p>Honeybees are among the most important insects on Earth. They pollinate about one-third of the food crops we eat, from apples to almonds.</p>
      <p>A hive is run by a single <strong>queen bee</strong>, who lays thousands of eggs. <strong>Worker bees</strong>, which are all female, collect nectar and pollen, feed the young, and guard the hive.</p>
      <p>Honeybees communicate using a special "waggle dance." By moving in a figure-of-eight pattern, a worker tells other bees the <strong>direction and distance</strong> of a food source.</p>
      <p>However, bee populations are declining due to pesticides, disease, and loss of habitat. Scientists warn that without bees, many crops would fail.</p>`,
    source: "Adapted for educational purposes.",
    questions: [
      { type: "tfng", q: "Honeybees are important because they pollinate many food crops.", answer: "true" },
      { type: "tfng", q: "Every bee in the hive is female.", answer: "false" },
      { type: "mcq", q: "What does the waggle dance communicate?",
        options: ["The age of the queen", "The direction and distance of food", "The time of day", "The outside temperature"], answer: 1 },
      { type: "short", q: "Which bee lays the eggs in a hive?",
        answer: "queen", alt: ["queen bee", "the queen"] },
    ],
  },

  {
    id: "re8", level: "intermediate",
    title: "Why We Dream",
    passageHTML: `
      <p>Dreaming occurs mainly during rapid eye movement (REM) sleep, a stage when the brain is highly active but the body is relaxed.</p>
      <p>Scientists have proposed several theories. One prominent idea, the <strong>activation-synthesis model</strong>, suggests dreams arise from the brain trying to make sense of random signals during sleep.</p>
      <p>Another theory focuses on emotional regulation: dreaming may help people process worries and memories, <strong>reducing stress and improving mood</strong>.</p>
      <p>Evidence shows that people who are deprived of REM sleep often report <strong>memory problems</strong>, suggesting that dreaming supports learning and consolidation.</p>
      <p>Still, experts admit that much remains unknown, and no single theory fully explains the purpose of dreams.</p>`,
    source: "Adapted from popular science summaries.",
    questions: [
      { type: "tfng", q: "Dreaming only happens during REM sleep.", answer: "false" },
      { type: "tfng", q: "The activation-synthesis model claims dreams are meaningful messages from the subconscious.", answer: "false" },
      { type: "fill", text: "Dreaming may help regulate emotions and improve _____. People deprived of REM sleep often report _____ problems.",
        blanks: [
          { answer: "mood", alt: [] },
          { answer: "memory", alt: ["memories"] },
        ] },
      { type: "mcq", q: "What do people deprived of REM sleep often report?",
        options: ["Vivid dreams", "Memory problems", "Increased creativity", "Better mood"], answer: 1 },
    ],
  },

  {
    id: "re9", level: "advanced",
    title: "The Rise of Remote Work",
    passageHTML: `
      <p>The shift to remote work, accelerated by the pandemic, has reshaped labour markets worldwide. Many firms now offer hybrid arrangements, blending office and home work.</p>
      <p>Proponents argue that remote work boosts productivity and wellbeing. Employees save commuting time, and companies reduce office costs.</p>
      <p>Critics counter that remote work can erode company culture and hinder collaboration. Some studies also link it to <strong>loneliness and burnout</strong> among younger workers.</p>
      <p>Data suggests outcomes depend heavily on context: while knowledge workers often thrive remotely, those in customer-facing or manual roles cannot work from home.</p>
      <p>Looking ahead, most economists expect <strong>hybrid models</strong> to become the norm, though the ideal balance remains contested.</p>`,
    source: "Adapted from economics articles.",
    questions: [
      { type: "tfng", q: "Remote work became widespread because of the pandemic.", answer: "true" },
      { type: "tfng", q: "All types of jobs can be done remotely.", answer: "false" },
      { type: "fill", text: "Most economists expect _____ models to become the norm. Remote work can sometimes cause loneliness and _____ among younger workers.",
        blanks: [
          { answer: "hybrid", alt: ["hybrid work"] },
          { answer: "burnout", alt: ["burn-out"] },
        ] },
      { type: "short", q: "According to critics, what problem has been linked to remote work among younger workers?",
        answer: "burnout", alt: ["loneliness", "isolation"] },
    ],
  },

  {
    id: "re10", level: "expert",
    title: "The Science of Motivation",
    passageHTML: `
      <p>Motivation is often divided into intrinsic and extrinsic forms. <strong>Intrinsic motivation</strong> comes from within — doing a task for its own interest or satisfaction. <strong>Extrinsic motivation</strong> relies on external rewards, such as pay, grades, or praise.</p>
      <p>Research shows that intrinsic motivation tends to produce higher-quality and more creative work. Interestingly, offering external rewards for an inherently enjoyable task can sometimes reduce intrinsic motivation — a phenomenon known as the <strong>overjustification effect</strong>.</p>
      <p>Autonomy, competence, and relatedness are three psychological needs that, when met, strengthen intrinsic motivation. This framework, drawn from self-determination theory, explains why controlling workplace environments often backfire.</p>
      <p>However, extrinsic motivators still matter. Clear targets, recognition, and fair incentives can channel effort, especially for tasks that are not intrinsically interesting.</p>`,
    source: "Adapted from psychology summaries.",
    questions: [
      { type: "fill", text: "Intrinsic motivation comes from within; extrinsic relies on external _____. Giving rewards for enjoyable tasks can reduce intrinsic motivation — the _____ effect.",
        blanks: [
          { answer: "rewards", alt: ["reward"] },
          { answer: "overjustification", alt: ["over-justification"] },
        ] },
      { type: "mcq", q: "According to self-determination theory, which of the following is NOT one of the three psychological needs?",
        options: ["Autonomy", "Competence", "Relatedness", "Salary"], answer: 3 },
      { type: "short", q: "What phenomenon describes the reduction of intrinsic motivation after offering external rewards?",
        answer: "overjustification effect", alt: ["overjustification", "the overjustification effect"] },
    ],
  },
];
