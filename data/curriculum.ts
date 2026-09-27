// ---------------------------------------------------------------------------
// Curriculum data for Edu Alt Tech — Future Skills.
// Local structured TypeScript data. Replace this module with a data source
// (API / database) later WITHOUT changing the UI components: they only read
// the exported shapes below.
// ---------------------------------------------------------------------------

export type Level = "FOUNDATION" | "EXPLORER" | "BUILDER" | "ADVANCED";
export type AccentKey = "ai" | "code" | "design" | "stem" | "future" | "data" | "career";

export interface Topic {
  id: string;
  name: string;
  description: string;
  objective: string;
  subtopics: string[];
  activities: string[];
  practice: string[];
  project: string;
  assessment: string;
  outcome: string;
}

export interface CurriculumModule {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  time: string;
  topics: Topic[];
  project: string;
  assessment: string;
}

export interface Subject {
  id: string;
  name: string;
  short: string;
  accent: AccentKey;
  description: string;
  optional: boolean;
  modules: CurriculumModule[];
}

export interface ClassCurriculum {
  id: number;
  className: string;
  level: Level;
  batch: string;
  tagline: string;
  theme: string;
  subjects: Subject[];
  project: { name: string; description: string; deliverables: string[]; outcome: string };
  stats: { subjects: number; modules: number; topics: number; hours: number };
}

// ---------------------------------------------------------------------------
// Seed types — keeps the raw syllabus lists compact & readable.
// ---------------------------------------------------------------------------

interface TopicSeed {
  n: string;
  d?: string;
  o?: string;
  s?: string[];
  a?: string[];
  p?: string[];
  pr?: string;
  as?: string;
  ou?: string;
}
interface ModuleSeed {
  n: string;
  d?: string;
  topics: (string | TopicSeed)[];
}
interface SubjectSeed {
  n: string;
  accent: AccentKey;
  d: string;
  optional?: boolean;
  modules: ModuleSeed[];
}
interface ClassSeed {
  id: number;
  tagline: string;
  theme: string;
  project: { name: string; description: string; deliverables: string[]; outcome: string };
  subjects: SubjectSeed[];
}

// ---------------------------------------------------------------------------
// Content templates (name-flavoured by default, overridable per topic).
// ---------------------------------------------------------------------------

function phaseTopic(name: string): string {
  const low = name.charAt(0).toLowerCase() + name.slice(1);
  return `We explore "${name}" step by step — what ${low} means, how it shows up in the real world, and how to use it with curiosity, care and creativity.`;
}
function introTopic(name: string): string {
  const low = name.charAt(0).toLowerCase() + name.slice(1);
  return `Understand ${low} and apply it in a hands-on, age-appropriate activity.`;
}
function topicSeedToTopic(seed: string | TopicSeed): Topic {
  const s = typeof seed === "string" ? { n: seed } : seed;
  const low = s.n.charAt(0).toLowerCase() + s.n.slice(1);
  return {
    id: slug(s.n),
    name: s.n,
    description: s.d ?? phaseTopic(s.n),
    objective: s.o ?? introTopic(s.n),
    subtopics: s.s ?? [s.n, `Why ${low} matters`, `Everyday examples of ${low}`],
    activities:
      s.a ?? [
        `Hands-on activity: explore ${low} with real examples and simple tools.`,
        `Think-pair-share: spot where we see ${low} at home and at school.`,
      ],
    practice:
      s.p ?? [
        `Quick questions to check understanding of ${low}.`,
        `Draw or write one example of ${low} from your own life.`,
      ],
    project: s.pr ?? `Mini project built around ${low}.`,
    assessment: s.as ?? `In-class check: explain one use of ${low} in your own words.`,
    outcome: s.ou ?? `You can describe ${low} and apply it in a guided task.`,
  };
}

function expandSeed(seed: ClassSeed): ClassCurriculum {
  const subjects: Subject[] = seed.subjects.map((subj) => {
    const modules: CurriculumModule[] = subj.modules.map((m) => {
      const topics = m.topics.map(topicSeedToTopic);
      const sessions = topics.length * 2;
      return {
        id: slug(m.n),
        name: m.n,
        description:
          m.d ??
          `A focused module in ${subj.n}: ${m.n}. Build confidence topic by topic, then apply everything in the module project.`,
        objectives: [
          `Understand the core ideas of ${m.n.toLowerCase()}.`,
          `Apply each topic through guided, practical activities.`,
          `Complete the module project to pull the topics together.`,
        ],
        time: `${topics.length} topics · ~${sessions} sessions`,
        topics,
        project: `Module project: apply ${m.n.toLowerCase()} in a small creative build.`,
        assessment: `Module assessment: demonstrate the skills learned in ${m.n.toLowerCase()}.`,
      };
    });
    return {
      id: slug(subj.n),
      name: subj.n,
      short: shortName(subj.n),
      accent: subj.accent,
      description: subj.d,
      optional: !!subj.optional,
      modules,
    };
  });

  const modules = subjects.reduce((s, x) => s + x.modules.length, 0);
  const topics = subjects.reduce(
    (s, x) => s + x.modules.reduce((t, m) => t + m.topics.length, 0),
    0
  );

  return {
    id: seed.id,
    className: `Class ${seed.id}`,
    level: levelFor(seed.id),
    batch: batchFor(seed.id),
    tagline: seed.tagline,
    theme: seed.theme,
    subjects,
    project: seed.project,
    stats: { subjects: subjects.length, modules, topics, hours: topics * 2 },
  };
}

function levelFor(id: number): Level {
  if (id <= 2) return "FOUNDATION";
  if (id <= 5) return "EXPLORER";
  if (id <= 7) return "BUILDER";
  return "ADVANCED";
}
function batchFor(id: number): string {
  if (id <= 2) return "Foundation";
  if (id <= 5) return "Explorer";
  if (id <= 7) return "Builder";
  return "Advanced";
}
function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function shortName(name: string): string {
  if (name.startsWith("AI")) return "AI";
  if (name.startsWith("Coding")) return "Coding";
  if (name.startsWith("Digital Creativity")) return "Design";
  if (name.startsWith("Digital Design")) return "Design";
  if (name.startsWith("STEM")) return "STEM";
  if (name.startsWith("Future")) return "Skills";
  if (name.startsWith("Data")) return "Data";
  if (name.startsWith("Career")) return "Career";
  if (name.startsWith("Entrepreneurship")) return "Startup";
  if (name.startsWith("Product")) return "Product";
  if (name.startsWith("Programming")) return "Coding";
  if (name.startsWith("Software")) return "Software";
  if (name.startsWith("AI/Data")) return "AI/Data";
  return name;
}

// ---------------------------------------------------------------------------
// Seeds: Classes 1–10 (topic lists match the Edu Alt Tech syllabus).
// ---------------------------------------------------------------------------

const SEEDS: ClassSeed[] = [
  {
    id: 1,
    tagline: "The very first steps into a world of smart machines.",
    theme: "from-pink-400 via-rose-400 to-orange-400",
    project: {
      name: "Creative Activity",
      description:
        "Every young explorer builds their first digital creation — a drawing, a story card or a simple hand-coded flow of instructions.",
      deliverables: ["A printed or digital artwork", "A short story you can tell aloud", "A friendly share with the class"],
      outcome: "Confidence using computers and smart tools — and the joy of creating something yourself.",
    },
    subjects: [
      {
        n: "AI & Artificial Intelligence",
        accent: "ai",
        d: "Discover what makes objects and machines 'smart', and meet the idea of Artificial Intelligence for the first time.",
        modules: [
          {
            n: "Technology Around Us",
            topics: ["Technology Around Us", "Smart and Non-Smart Objects", "Computers"],
          },
          {
            n: "Introduction to AI",
            topics: ["Introduction to AI", "AI in Daily Life", "Robots"],
          },
          { n: "Patterns & Recognition", topics: ["Patterns", "Recognition"] },
          { n: "AI Safety", topics: ["AI Safety"] },
        ],
      },
      {
        n: "Coding & Game Development",
        accent: "code",
        d: "Learn to give precise instructions — the first habit of every programmer — and tell interactive stories with simple block coding.",
        modules: [
          {
            n: "Instructions & Sequencing",
            topics: ["Instructions", "Sequencing", "Directions"],
          },
          { n: "Patterns & Algorithms", topics: ["Patterns", "Algorithms", "Unplugged Coding"] },
          { n: "Block Coding & Stories", topics: ["Block Coding Introduction", "Interactive Stories"] },
        ],
      },
      {
        n: "Digital Creativity & Design",
        accent: "design",
        d: "Explore digital drawing, colour and shape to create artwork and simple digital stories.",
        modules: [
          { n: "Digital Drawing", topics: ["Digital Drawing", "Shapes", "Colours", "Digital Colouring"] },
          { n: "Posters & Stories", topics: ["Posters", "Digital Storytelling"] },
        ],
      },
      {
        n: "STEM Innovation & Entrepreneurship",
        accent: "stem",
        d: "Look closely at the world like a young scientist — observe, build simple structures and try your own experiments.",
        modules: [
          { n: "Observe & Build", topics: ["Observation", "Simple Machines", "Building", "Structures"] },
          { n: "Materials & Experiments", topics: ["Materials", "Experiments", "Simple Inventions"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Build the super-skills that make learning stick — listening, speaking, teamwork, creativity and confidence.",
        modules: [
          { n: "Listening & Speaking", topics: ["Listening", "Speaking"] },
          { n: "Stories & Questions", topics: ["Storytelling", "Asking Questions"] },
          { n: "Teamwork & Confidence", topics: ["Teamwork", "Creativity", "Confidence"] },
        ],
      },
    ],
  },
  {
    id: 2,
    tagline: "Level up the basics — stories, games, patterns and simple logic.",
    theme: "from-fuchsia-400 via-purple-400 to-indigo-400",
    project: {
      name: "Interactive Story",
      description:
        "Plan and build an interactive story with block coding — the reader makes choices that change what happens next.",
      deliverables: ["A storyboard of the tale", "A playable block-code story", "A live story walk-through"],
      outcome: "Sequencing, events and creative confidence — your story works because your instructions work.",
    },
    subjects: [
      {
        n: "AI & Artificial Intelligence",
        accent: "ai",
        d: "Notice AI working all around you — from smart devices to predictions — and compare human and machine intelligence.",
        modules: [
          { n: "AI & Everyday Life", topics: ["AI Introduction", "AI in Daily Life", "Smart Devices"] },
          { n: "Patterns & Prediction", topics: ["Patterns", "Prediction"] },
          { n: "Robots & Human Intelligence", topics: ["Robots", "Human Intelligence vs AI"] },
          { n: "AI Safety", topics: ["AI Safety"] },
        ],
      },
      {
        n: "Coding & Game Development",
        accent: "code",
        d: "Move from instructions to real program thinking — loops, conditions, debugging and simple games.",
        modules: [
          { n: "Algorithms & Sequences", topics: ["Algorithms", "Sequencing", "Patterns"] },
          { n: "Loops & Conditions", topics: ["Loops", "Conditions through games"] },
          { n: "Build & Fix", topics: ["Debugging", "Block Coding"] },
          { n: "Stories & Games", topics: ["Interactive Stories", "Simple Games"] },
        ],
      },
      {
        n: "Digital Creativity & Design",
        accent: "design",
        d: "Level up your digital art — illustration, colour, typography, storyboards, animation and digital cards.",
        modules: [
          { n: "Illustration & Colour", topics: ["Digital Illustration", "Colour", "Typography"] },
          { n: "Posters & Storyboards", topics: ["Posters", "Storyboarding"] },
          { n: "Animation & Cards", topics: ["Animation", "Digital Cards"] },
        ],
      },
      {
        n: "STEM Innovation & Entrepreneurship",
        accent: "stem",
        d: "Identify real problems, invent simple solutions, build and test — and learn how recycling protects our environment.",
        modules: [
          { n: "Problems & Inventions", topics: ["Problem Identification", "Simple Inventions", "Build and Test"] },
          { n: "Structures & Materials", topics: ["Structures", "Materials"] },
          { n: "Environment & Recycling", topics: ["Environment", "Recycling"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Introduce yourself with confidence, tell better stories, and grow empathy and teamwork.",
        modules: [
          { n: "Introduce Yourself", topics: ["Self Introduction", "Storytelling", "Public Speaking"] },
          { n: "Listen & Work Together", topics: ["Listening", "Teamwork"] },
          { n: "Empathy & Confidence", topics: ["Empathy", "Confidence"] },
        ],
      },
    ],
  },
  {
    id: 3,
    tagline: "The official launch of your Future Skills journey.",
    theme: "from-violet-500 via-purple-500 to-fuchsia-500",
    project: {
      name: "Simple Game / Digital Story",
      description:
        "Build your first playable game or digital story — with characters, events, simple loops and a story that you control.",
      deliverables: ["A working block-coded game or story", "Characters and a setting you designed", "A short demo to the class"],
      outcome: "From instructions to interaction — your first program that someone else can play.",
    },
    subjects: [
      {
        n: "AI & Artificial Intelligence",
        accent: "ai",
        d: "Meet AI properly: what it is, how it recognises images and voices, and how recommendations read your choices.",
        modules: [
          {
            n: "Introduction to AI",
            topics: [
              {
                n: "What is AI?",
                d: "Understand the basic idea of Artificial Intelligence — machines that can think, learn and decide like a helper.",
                o: "Understand the basic idea of Artificial Intelligence.",
                s: ["What is intelligence?", "What is a machine?", "What makes a machine 'smart'?"],
                a: ["Identify smart machines around us."],
                p: ["Simple concept questions about AI."],
                pr: "AI Around My Home — spot and sort smart machines.",
                as: "Name three smart machines and say why they are smart.",
                ou: "Explain what makes a machine 'smart' in your own words.",
              },
              "AI Around Us",
              "Human Intelligence vs Machine Intelligence",
            ],
          },
          {
            n: "Patterns & Classification",
            topics: ["Patterns", "Classification", "Image Recognition", "Voice Recognition"],
          },
          { n: "Recommendations & Robots", topics: ["Recommendation Systems", "Robots"] },
          { n: "AI Safety", topics: ["AI Safety"] },
        ],
      },
      {
        n: "Coding & Game Development",
        accent: "code",
        d: "Bring characters to life with events, animation, loops and simple conditions — and debug until the story plays perfectly.",
        modules: [
          { n: "Algorithms & Sequencing", topics: ["Algorithms", "Sequencing"] },
          { n: "Events & Characters", topics: ["Events", "Characters", "Animation"] },
          { n: "Loops & Conditions", topics: ["Loops", "Simple Conditions"] },
          { n: "Build & Debug", topics: ["Debugging", "Story-Based Games"] },
        ],
      },
      {
        n: "Digital Creativity & Design",
        accent: "design",
        d: "Design with intention — colour, typography, images, posters, animation and simple presentations.",
        modules: [
          { n: "Drawing with Purpose", topics: ["Digital Drawing", "Colour", "Typography"] },
          { n: "Posters & Stories", topics: ["Posters", "Digital Storytelling", "Images"] },
          { n: "Animation & Presentation", topics: ["Animation", "Presentations"] },
        ],
      },
      {
        n: "STEM Innovation & Entrepreneurship",
        accent: "stem",
        d: "Understand what STEM is and follow the creator loop: observe, brainstorm, build, test and improve.",
        modules: [
          { n: "What is STEM?", topics: ["What is STEM?", "Observation", "Problem Identification"] },
          { n: "Brainstorm & Design", topics: ["Brainstorming", "Simple Machines", "Structures"] },
          { n: "Experiment & Improve", topics: ["Experiments", "Build-Test-Improve"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Talk, listen, question and solve — then present your ideas so the classroom actually listens.",
        modules: [
          {
            n: "Talk & Listen",
            topics: ["Self Introduction", "Listening", "Speaking", { n: "Storytelling", pr: "Tell a 1-minute story with a beginning, middle and end." }],
          },
          { n: "Question & Solve", topics: ["Asking Questions", "Problem Solving", "Teamwork"] },
          { n: "Present With Confidence", topics: ["Presentation"] },
        ],
      },
    ],
  },
  {
    id: 4,
    tagline: "Go deeper — games, design and responsible AI.",
    theme: "from-cyan-500 via-sky-500 to-blue-500",
    project: {
      name: "Educational Game / Prototype",
      description:
        "Design an educational game that teaches one idea — scoring, levels, coordinates — and prototype it with a small team.",
      deliverables: ["A game design sheet", "A playable prototype with scoring or levels", "A testing note: what you fixed and why"],
      outcome: "You design like a maker: build a prototype, test it, and improve it with real feedback.",
    },
    subjects: [
      {
        n: "AI & Artificial Intelligence",
        accent: "ai",
        d: "See AI working in the real world — chatbots, computer vision and speech recognition — and learn to use it responsibly.",
        modules: [
          { n: "AI in the Real World", topics: ["AI Applications", "Data", "Information"] },
          { n: "Patterns & Prediction", topics: ["Patterns", "Classification", "Prediction"] },
          { n: "Talking & Seeing Machines", topics: ["Chatbots", "Computer Vision", "Speech Recognition"] },
          { n: "Responsible AI", topics: ["AI Ethics", "Privacy", "Responsible AI"] },
        ],
      },
      {
        n: "Coding & Game Development",
        accent: "code",
        d: "Level up program design — variables, events, coordinates, game mechanics — and build games people want to play.",
        modules: [
          { n: "Variables & Events", topics: ["Variables Introduction", "Events"] },
          { n: "Loops & Conditions", topics: ["Loops", "Conditions"] },
          { n: "Game Mechanics", topics: ["Coordinates", "Game Mechanics", "Scoring", "Levels"] },
          { n: "Design & Debug", topics: ["Debugging", "Game Design"] },
        ],
      },
      {
        n: "Digital Creativity & Design",
        accent: "design",
        d: "Think like a designer — colour theory, typography, layout, branding and the first taste of interface design.",
        modules: [
          { n: "Design Fundamentals", topics: ["Graphic Design", "Colour Theory", "Typography", "Layout"] },
          { n: "Infographics & Branding", topics: ["Infographics", "Branding"] },
          { n: "Present & UI", topics: ["Presentation", "UI Introduction"] },
        ],
      },
      {
        n: "STEM Innovation & Entrepreneurship",
        accent: "stem",
        d: "Follow the design-thinking loop — empathy, problem identification, brainstorming, prototype, test, improve.",
        modules: [
          { n: "Design Thinking", topics: ["Design Thinking", "Empathy", "Problem Identification"] },
          { n: "Ideate & Prototype", topics: ["Brainstorming", "Prototype"] },
          { n: "Test & Improve", topics: ["Testing", "Improvement", "Sustainability"] },
          { n: "Entrepreneurship", topics: ["Entrepreneurship Introduction"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Present with purpose, collaborate on teams, make decisions and give feedback that helps people improve.",
        modules: [
          { n: "Speak & Present", topics: ["Public Speaking", "Presentation"] },
          { n: "Lead & Decide", topics: ["Collaboration", "Leadership", "Critical Thinking", "Decision Making"] },
          { n: "Feedback", topics: ["Feedback"] },
        ],
      },
    ],
  },
  {
    id: 5,
    tagline: "True explorers — first contact with machine learning.",
    theme: "from-emerald-500 via-teal-500 to-cyan-500",
    project: {
      name: "Student Innovation Project",
      description:
        "The full creator journey in one project: research a problem, design a solution, prototype it and pitch it.",
      deliverables: ["Problem statement & research", "A working prototype", "A 3-minute pitch with business basics"],
      outcome: "You can take an idea from 'I wonder…' to a prototype and a pitch.",
    },
    subjects: [
      {
        n: "AI & Artificial Intelligence",
        accent: "ai",
        d: "Meet machine learning, training data, computer vision, NLP and generative AI — and the ethics that keep AI fair.",
        modules: [
          { n: "AI Fundamentals", topics: ["AI Fundamentals", "Data", "Data Collection"] },
          { n: "Machine Learning", topics: ["Classification", "Patterns", "Machine Learning Concept", "Training Data"] },
          { n: "Seeing & Understanding", topics: ["Computer Vision", "NLP Introduction"] },
          { n: "Generative AI", topics: ["Generative AI Introduction", "Prompt Basics"] },
          { n: "Responsible AI", topics: ["AI Ethics", "Bias", "Privacy", "Responsible AI"] },
        ],
      },
      {
        n: "Coding & Game Development",
        accent: "code",
        d: "Think computationally — variables, conditions, loops, functions, events, coordinates — and test games properly.",
        modules: [
          { n: "Computational Thinking", topics: ["Computational Thinking", "Algorithms"] },
          { n: "Variables & Logic", topics: ["Variables", "Conditions"] },
          { n: "Loops & Functions", topics: ["Loops", "Functions Introduction"] },
          { n: "Events & Coordinates", topics: ["Events", "Coordinates"] },
          { n: "Game Design & Testing", topics: ["Game Mechanics", "Debugging", "User Interaction", "Game Testing"] },
        ],
      },
      {
        n: "Digital Creativity & Design",
        accent: "design",
        d: "Build a visual identity — logos, branding, infographics — plus storyboards, video and your first digital portfolio.",
        modules: [
          { n: "Design Systems", topics: ["Graphic Design", "Colour Theory", "Typography", "Branding", "Logo Design"] },
          { n: "Infographics & UI", topics: ["Infographics", "UI/UX Introduction"] },
          { n: "Story & Video", topics: ["Storyboarding", "Video Basics"] },
          { n: "Portfolio", topics: ["Digital Portfolio"] },
        ],
      },
      {
        n: "STEM Innovation & Entrepreneurship",
        accent: "stem",
        d: "Research a real problem, then build, iterate and sustain a product customers would actually want.",
        modules: [
          { n: "Design Thinking", topics: ["Design Thinking", "Empathy"] },
          { n: "Research & Define", topics: ["Research", "Problem Statement"] },
          { n: "Ideate & Prototype", topics: ["Ideation", "Prototype"] },
          { n: "Test & Sustain", topics: ["Testing", "Iteration", "Sustainability"] },
          { n: "Build a Business", topics: ["Customer", "Product", "Value Proposition", "Business Model Basics", "Pitching"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Speak, think critically, lead, negotiate, manage time — and pitch ideas that land.",
        modules: [
          { n: "Speak & Inspire", topics: ["Public Speaking", "Storytelling"] },
          { n: "Think & Solve", topics: ["Critical Thinking", "Problem Solving"] },
          { n: "Lead & Collaborate", topics: ["Collaboration", "Leadership", "Negotiation", "Time Management"] },
          { n: "Set & Pitch", topics: ["Goal Setting", "Pitching"] },
        ],
      },
    ],
  },
  {
    id: 6,
    tagline: "Builder level — you start creating real things.",
    theme: "from-blue-600 via-indigo-600 to-violet-600",
    project: {
      name: "AI + STEM School Problem Project",
      description:
        "Combine AI and STEM to solve a real school problem — collect data, prototype the fix, test it, pitch it.",
      deliverables: ["A defined school problem", "An AI + STEM prototype", "Testing results and a pitch"],
      outcome: "Real engineering thinking: data, prototypes and improvement — aimed at a problem that matters to your school.",
    },
    subjects: [
      {
        n: "AI & Data",
        accent: "ai",
        d: "Handle data like a scientist and train machines — collection, types, representation, analysis, ML concepts and responsible AI.",
        modules: [
          { n: "AI Fundamentals", topics: ["AI Fundamentals", "AI Applications"] },
          { n: "Working with Data", topics: ["Data", "Data Collection", "Data Types", "Data Representation", "Data Analysis", "Patterns"] },
          { n: "Machine Learning", topics: ["Machine Learning Concepts", "Training Data", "Testing Data", "Classification"] },
          { n: "Seeing, Hearing & Creating", topics: ["Computer Vision", "NLP", "Generative AI", "Prompt Engineering Basics"] },
          { n: "Responsible AI", topics: ["AI Ethics", "Bias", "Privacy", "Safety"] },
        ],
      },
      {
        n: "Coding & Game Development",
        accent: "code",
        d: "Move into real programming — computational thinking, flowcharts, conditions, functions and the first taste of Python.",
        modules: [
          { n: "Computational Thinking", topics: ["Computational Thinking", "Algorithms", "Flowcharts"] },
          { n: "Python Foundations", topics: ["Variables", "Data Types", "Conditions"] },
          { n: "Loops, Functions & Lists", topics: ["Loops", "Functions", "Lists"] },
          { n: "Events & Games", topics: ["Events", "Debugging", "Game Mechanics", "Game Testing"] },
          { n: "Python Introduction", topics: ["Python Introduction"] },
        ],
      },
      {
        n: "Digital Creativity & Design",
        accent: "design",
        d: "Design principles, wireframes and user journeys — and craft real digital illustration, video, branding and a portfolio.",
        modules: [
          { n: "Design Principles", topics: ["Design Principles", "Colour Theory", "Typography", "Graphic Design"] },
          { n: "UI/UX & Wireframes", topics: ["UI/UX", "Wireframes", "User Journeys"] },
          { n: "Digital Craft", topics: ["Digital Illustration", "Video", "Branding"] },
          { n: "Portfolio", topics: ["Portfolio"] },
        ],
      },
      {
        n: "STEM Innovation & Entrepreneurship",
        accent: "stem",
        d: "Full design thinking with engineering thinking — customer discovery, business models and pitching an impact.",
        modules: [
          { n: "Design Thinking", topics: ["Design Thinking", "Empathy"] },
          { n: "Research & Define", topics: ["Problem Research", "Problem Statement", "Ideation"] },
          { n: "Prototype & Test", topics: ["Prototyping", "Testing", "Iteration", "Engineering Thinking"] },
          { n: "Business & Pitch", topics: ["Sustainability", "Customer Discovery", "Value Proposition", "Business Model", "Pitching"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Critical thinking, research, debate and digital citizenship — communication that works in any team.",
        modules: [
          { n: "Think Critically", topics: ["Critical Thinking", "Problem Solving", "Research"] },
          { n: "Communicate & Lead", topics: ["Communication", "Collaboration", "Leadership", "Decision Making", "Time Management"] },
          { n: "Present & Debate", topics: ["Presentation", "Debate", "Digital Citizenship"] },
        ],
      },
    ],
  },
  {
    id: 7,
    tagline: "Level up into Python, UX research and startup thinking.",
    theme: "from-slate-600 via-slate-700 to-slate-900",
    project: {
      name: "Python Application / Startup Concept",
      description:
        "Build a small Python application AND shape it into a startup concept — validate the need, model the business, pitch it.",
      deliverables: ["A working Python application", "A startup concept with customer & model", "A pitch deck"],
      outcome: "You ship something real and can explain who it serves and why they would pay for it.",
    },
    subjects: [
      {
        n: "AI & Data",
        accent: "ai",
        d: "Clean, visualise and use data — full ML workflow, vision and language, prompt engineering, and staying safe with AI.",
        modules: [
          { n: "Data Science", topics: ["Data Collection", "Data Cleaning", "Data Visualization"] },
          { n: "Machine Learning Workflow", topics: ["Machine Learning Workflow", "Classification", "Prediction"] },
          { n: "Vision & Language", topics: ["Computer Vision", "NLP", "Generative AI"] },
          { n: "Tools & Prompting", topics: ["Prompt Engineering", "AI Tools", "Deepfakes"] },
          { n: "Safe & Responsible AI", topics: ["AI Ethics", "Bias", "Privacy", "Cyber Safety"] },
        ],
      },
      {
        n: "Coding & Game Development",
        accent: "code",
        d: "Serious Python — variables, types, conditions, loops, functions, lists, dictionaries and strings — plus debugging and APIs.",
        modules: [
          { n: "Python Deep Dive", topics: ["Python", "Variables", "Data Types", "Conditions", "Loops"] },
          { n: "Functions & Structures", topics: ["Functions", "Lists", "Dictionaries", "Strings"] },
          { n: "Debug & Algorithms", topics: ["Debugging", "Algorithms", "Basic Data Structures"] },
          { n: "Games & APIs", topics: ["Game Programming", "APIs Introduction"] },
        ],
      },
      {
        n: "Digital Creativity & Design",
        accent: "design",
        d: "Advanced design with real user research — UX, wireframes, prototypes, mobile & web design, animation and a portfolio.",
        modules: [
          { n: "Advanced Design", topics: ["Advanced Graphic Design", "Branding"] },
          { n: "UX Research", topics: ["User Research", "UI/UX", "Wireframes", "Prototypes"] },
          { n: "Mobile & Web", topics: ["Mobile App Design", "Web Design"] },
          { n: "Motion & Portfolio", topics: ["Video", "Animation", "Portfolio"] },
        ],
      },
      {
        n: "Entrepreneurship",
        accent: "career",
        d: "Research markets, validate problems, model the business, price it, market it and build a pitch deck.",
        modules: [
          { n: "Market Research", topics: ["Market Research", "Customer Persona", "Problem Validation", "Competitor Research"] },
          { n: "MVP & Model", topics: ["MVP", "Business Model", "Pricing"] },
          { n: "Go to Market", topics: ["Marketing", "Branding", "Pitch Deck"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Debate, negotiate, interview, communicate professionally and present a sharp digital portfolio.",
        modules: [
          { n: "Speak & Debate", topics: ["Public Speaking", "Debate", "Group Discussion"] },
          { n: "Research & Lead", topics: ["Research", "Leadership", "Negotiation"] },
          { n: "Professional & Pitch", topics: ["Interview Skills", "Professional Communication", "Digital Portfolio", "Pitching"] },
        ],
      },
    ],
  },
  {
    id: 8,
    tagline: "Advanced — machine learning, digital products and careers.",
    theme: "from-cyan-700 via-teal-700 to-blue-700",
    project: {
      name: "Working Digital Product",
      description:
        "Build a working digital product through a full product lifecycle — research, wireframe, prototype, build and launch-ready polish.",
      deliverables: ["User research & personas", "Wireframes and a polished UI", "A working, testable product", "A product portfolio entry"],
      outcome: "You ship a product users can use and you can defend the choices behind it.",
    },
    subjects: [
      {
        n: "AI & Artificial Intelligence",
        accent: "ai",
        d: "Machine learning done properly — supervised & unsupervised learning, features, labels, model evaluation, agents and ethics.",
        modules: [
          { n: "Machine Learning", topics: ["Machine Learning", "Supervised Learning", "Unsupervised Learning Concept"] },
          { n: "Data & Models", topics: ["Data Preparation", "Features and Labels", "Classification", "Prediction", "Model Evaluation"] },
          { n: "Vision & Language", topics: ["Computer Vision", "NLP"] },
          { n: "Generative AI & Agents", topics: ["Generative AI", "Prompt Engineering", "AI Agents Introduction"] },
          { n: "Responsible AI", topics: ["AI Ethics", "Bias", "Responsible AI"] },
        ],
      },
      {
        n: "Programming",
        accent: "code",
        d: "Serious software skills — advanced Python, OOP, Git, APIs, web basics, game development and the software lifecycle.",
        modules: [
          { n: "Python Mastery", topics: ["Python", "Functions", "Lists", "Dictionaries", "File Handling"] },
          { n: "Algorithms & OOP", topics: ["Algorithms", "OOP Concepts", "Debugging"] },
          { n: "Git & APIs", topics: ["Git/GitHub Introduction", "APIs"] },
          { n: "Web & Games", topics: ["Web Development Basics", "Game Development"] },
          { n: "Software Lifecycle", topics: ["Software Lifecycle"] },
        ],
      },
      {
        n: "Product Design",
        accent: "design",
        d: "Design thinking to product portfolio — research, personas, journeys, wireframes, UI, UX, prototyping and accessibility.",
        modules: [
          { n: "Design Thinking", topics: ["Design Thinking", "User Research", "Personas"] },
          { n: "UI & UX", topics: ["User Journeys", "Wireframes", "UI", "UX"] },
          { n: "Prototyping", topics: ["Prototypes", "Mobile App Design", "Web Design"] },
          { n: "Brand & Portfolio", topics: ["Accessibility", "Branding", "Product Portfolio"] },
        ],
      },
      {
        n: "Entrepreneurship",
        accent: "career",
        d: "Discover problems, validate market fit, build an MVP with a real business model — then market, sell and pitch.",
        modules: [
          { n: "Discover & Validate", topics: ["Problem Discovery", "Market Research", "Customer Persona", "Product-Market Fit Concept"] },
          { n: "Build MVP & Model", topics: ["MVP", "Business Model", "Revenue", "Pricing"] },
          { n: "Market & Pitch", topics: ["Marketing", "Sales", "Pitch Deck"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Lead teams, manage, negotiate, interview well and build your personal brand and pitch.",
        modules: [
          { n: "Lead & Manage", topics: ["Leadership", "Team Management", "Public Speaking", "Debate"] },
          { n: "Research & Negotiate", topics: ["Research", "Negotiation", "Interview Skills"] },
          { n: "Brand & Pitch", topics: ["Professional Communication", "Personal Branding", "Pitching"] },
        ],
      },
    ],
  },
  {
    id: 9,
    tagline: "Own a project end to end — from data to a working product.",
    theme: "from-indigo-700 via-blue-800 to-slate-800",
    project: {
      name: "AI / Data / Software Product",
      description:
        "A capstone-grade product: collect and analyse real data, train an AI or build software on it, and launch a tested product.",
      deliverables: ["A data pipeline and analysis", "An AI model or software feature", "A tested product build", "A final presentation"],
      outcome: "You own the whole stack of a data-driven product — data, code and delivery.",
    },
    subjects: [
      {
        n: "AI & Data Science",
        accent: "data",
        d: "Python for data, statistics, the full ML workflow, generative AI, and an AI project you run yourself.",
        modules: [
          { n: "Python for Data", topics: ["Python for Data", "Data Collection", "Data Cleaning"] },
          { n: "Analyze & Visualize", topics: ["Data Visualization", "Statistics Basics"] },
          { n: "Machine Learning Workflow", topics: ["Machine Learning Workflow", "Classification", "Regression Concept", "Model Evaluation"] },
          { n: "Generative AI", topics: ["Generative AI", "Prompt Engineering", "AI Applications"] },
          { n: "AI Project & Ethics", topics: ["AI Ethics", "AI Project"] },
        ],
      },
      {
        n: "Software Development",
        accent: "code",
        d: "Advanced Python, OOP, data structures, Git, APIs, databases and application development with testing and debugging.",
        modules: [
          { n: "Advanced Python", topics: ["Advanced Python", "Functions", "Modules"] },
          { n: "OOP & Structures", topics: ["OOP", "Data Structures", "Algorithms"] },
          { n: "Git, APIs & Web", topics: ["Git/GitHub", "APIs", "Web Development"] },
          { n: "Databases & Apps", topics: ["Databases", "Application Development"] },
          { n: "Testing & Debugging", topics: ["Testing", "Debugging"] },
        ],
      },
      {
        n: "Product Design",
        accent: "design",
        d: "UX foundation, design systems, prototyping, user testing and a polished portfolio of product work.",
        modules: [
          { n: "UX Foundation", topics: ["UI/UX", "User Research", "Personas", "Wireframes"] },
          { n: "Prototype & Systems", topics: ["Prototypes", "Design Systems", "Web/Mobile Design"] },
          { n: "Brand & Test", topics: ["Branding", "Accessibility", "User Testing", "Portfolio"] },
        ],
      },
      {
        n: "Entrepreneurship",
        accent: "career",
        d: "Customer interviews, market and competitor research, the Business Model Canvas, revenue and finance basics.",
        modules: [
          { n: "Discover", topics: ["Problem Discovery", "Customer Interviews", "Market Research", "Competitor Analysis"] },
          { n: "Model & Finance", topics: ["MVP", "Business Model Canvas", "Revenue Model", "Pricing", "Finance Basics"] },
          { n: "Launch & Pitch", topics: ["Marketing", "Sales", "Pitch Deck"] },
        ],
      },
      {
        n: "Future Skills & Communication",
        accent: "future",
        d: "Critical thinking, debate, interviewing, resumes and goal setting — career-ready communication.",
        modules: [
          { n: "Think & Lead", topics: ["Critical Thinking", "Leadership", "Communication", "Collaboration"] },
          { n: "Research & Debate", topics: ["Research", "Debate", "Presentation"] },
          { n: "Career Ready", topics: ["Interview Preparation", "Resume Basics", "Personal Branding", "Goal Setting"] },
        ],
      },
    ],
  },
  {
    id: 10,
    tagline: "Capstone: your product and your pitch.",
    theme: "from-gray-900 via-slate-900 to-black",
    project: {
      name: "Capstone Product + Business Pitch",
      description:
        "The grand finale — design, build and ship a complete product, then pitch it investor-style with real business numbers.",
      deliverables: ["A production-quality product", "A complete business pitch deck", "An investor-style live presentation", "A portfolio that lands you an opportunity"],
      outcome: "You graduate the journey as a creator: a product you built, a business you modelled, and a pitch that convinces.",
    },
    subjects: [
      {
        n: "AI/Data",
        accent: "ai",
        d: "Advanced AI concepts, the ML workflow, data analysis, generative AI, agents and your capstone AI project.",
        modules: [
          { n: "Advanced AI", topics: ["Advanced AI Concepts"] },
          { n: "ML Workflow & Analysis", topics: ["Machine Learning Workflow", "Data Analysis", "Data Visualization"] },
          { n: "Generative AI & Agents", topics: ["AI Applications", "Generative AI", "Prompt Engineering", "AI Agents"] },
          { n: "Responsible AI & Capstone", topics: ["Responsible AI", "AI Ethics", "Capstone AI Project"] },
        ],
      },
      {
        n: "Software",
        accent: "code",
        d: "Advanced programming, architecture, databases, Git, testing and deployment — ship-grade engineering.",
        modules: [
          { n: "Python Foundations", topics: ["Python", "Advanced Programming"] },
          { n: "Structures & Algorithms", topics: ["Data Structures", "Algorithms"] },
          { n: "APIs & Databases", topics: ["APIs", "Databases"] },
          { n: "Web/App & Git", topics: ["Web/App Development", "Git/GitHub"] },
          { n: "Architecture & Ship", topics: ["Software Architecture Basics", "Testing", "Deployment Concepts"] },
        ],
      },
      {
        n: "Product Design",
        accent: "design",
        d: "Advanced UI/UX, usability testing, design systems, product branding and a presentation-ready portfolio.",
        modules: [
          { n: "Advanced UI/UX", topics: ["Advanced UI/UX", "Product Research"] },
          { n: "Prototype & Test", topics: ["Prototyping", "Usability Testing"] },
          { n: "Brand & Product", topics: ["Design Systems", "Product Branding", "Product Presentation", "Portfolio"] },
        ],
      },
      {
        n: "Entrepreneurship",
        accent: "career",
        d: "Startup ideation, customer validation, MVP, revenue, pricing, finance — and an investor-style pitch.",
        modules: [
          { n: "Startup Ideation", topics: ["Startup Ideation", "Market Research", "Customer Validation"] },
          { n: "Build the Product", topics: ["MVP", "Business Model", "Revenue", "Pricing"] },
          { n: "Launch & Fund", topics: ["Marketing", "Sales", "Finance", "Pitch Deck", "Investor-Style Presentation"] },
        ],
      },
      {
        n: "Career & Communication",
        accent: "future",
        d: "Your professional self — interviews, resume, portfolio, digital presence — plus leadership and negotiation.",
        modules: [
          { n: "Speak & Interview", topics: ["Public Speaking", "Interview Skills"] },
          { n: "Your Brand", topics: ["Resume", "Portfolio", "Professional Email", "Digital Presence"] },
          { n: "Lead & Plan", topics: ["Leadership", "Negotiation", "Career Exploration", "Goal Setting"] },
        ],
      },
    ],
  },
];

export const curriculumData: ClassCurriculum[] = SEEDS.map(expandSeed);

export function getClass(id: number): ClassCurriculum | undefined {
  return curriculumData.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Level metadata (headers, chips, gradients, icon accent colour).
// ---------------------------------------------------------------------------

export const LEVEL_META: Record<
  Level,
  {
    batch: string;
    subtitle: string;
    chip: string;
    text: string;
    grad: string;
    dot: string;
  }
> = {
  FOUNDATION: {
    batch: "Foundation",
    subtitle: "A playful first meeting with smart machines, creativity and teamwork.",
    chip: "bg-amber-100 text-amber-700 border-amber-200",
    text: "text-amber-700",
    grad: "from-amber-100 via-rose-50 to-pink-50",
    dot: "bg-amber-400",
  },
  EXPLORER: {
    batch: "Explorer",
    subtitle: "Build real skills — coding, AI, design and pitching ideas.",
    chip: "bg-violet-100 text-violet-700 border-violet-200",
    text: "text-violet-700",
    grad: "from-violet-100 via-sky-50 to-emerald-50",
    dot: "bg-violet-500",
  },
  BUILDER: {
    batch: "Builder",
    subtitle: "Create real things — Python, design research and startup thinking.",
    chip: "bg-blue-100 text-blue-700 border-blue-200",
    text: "text-blue-700",
    grad: "from-blue-100 via-slate-50 to-cyan-50",
    dot: "bg-blue-500",
  },
  ADVANCED: {
    batch: "Advanced",
    subtitle: "Ship working products and pitch them like a founder.",
    chip: "bg-slate-800 text-white border-slate-900",
    text: "text-slate-900",
    grad: "from-slate-900 via-navy to-cyan-900",
    dot: "bg-cyan-500",
  },
};

export const SUBJECT_ACCENTS: Record<
  AccentKey,
  {
    name: string;
    text: string;
    soft: string;
    border: string;
    dot: string;
    grad: string;
    chip: string;
  }
> = {
  ai: {
    name: "AI",
    text: "text-violet-700",
    soft: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    grad: "from-violet-500 to-purple-600",
    chip: "bg-violet-100 text-violet-700",
  },
  code: {
    name: "Coding",
    text: "text-teal-700",
    soft: "bg-teal-50",
    border: "border-teal-200",
    dot: "bg-teal-500",
    grad: "from-teal-500 to-emerald-600",
    chip: "bg-teal-100 text-teal-700",
  },
  design: {
    name: "Design",
    text: "text-rose-700",
    soft: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
    grad: "from-rose-500 to-pink-600",
    chip: "bg-rose-100 text-rose-700",
  },
  stem: {
    name: "STEM",
    text: "text-amber-700",
    soft: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    grad: "from-amber-500 to-orange-600",
    chip: "bg-amber-100 text-amber-700",
  },
  future: {
    name: "Future Skills",
    text: "text-sky-700",
    soft: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
    grad: "from-sky-500 to-blue-600",
    chip: "bg-sky-100 text-sky-700",
  },
  data: {
    name: "Data",
    text: "text-cyan-700",
    soft: "bg-cyan-50",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
    grad: "from-cyan-500 to-teal-600",
    chip: "bg-cyan-100 text-cyan-700",
  },
  career: {
    name: "Career",
    text: "text-emerald-700",
    soft: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    grad: "from-emerald-500 to-green-600",
    chip: "bg-emerald-100 text-emerald-700",
  },
};

export const PIPELINE = [
  "BATCH",
  "CLASS",
  "SUBJECT",
  "MODULE",
  "TOPIC",
  "LESSON",
  "ACTIVITY",
  "PROJECT",
  "ASSESSMENT",
];