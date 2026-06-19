import { Question, QuestionCategory } from "../types";

// High-quality fallback questions for multiple combinations
const FALLBACK_QUESTIONS: { [key: string]: Question[] } = {
  "Technical_Frontend Developer": [
    {
      question: "Which of the following is a key advantage of utilizing Virtual DOM in React?",
      options: [
        "It directly communicates with databases server-side",
        "It minimizes costly repaint and reflow browser operations by batching updates",
        "It bypasses all modern CSS selectors to render standard XML canvas objects",
        "It provides double-layer client security encryption for local states"
      ],
      correctAnswer: "It minimizes costly repaint and reflow browser operations by batching updates",
      explanation: "React uses the Virtual DOM to compare state changes with a virtual representation, identifying precisely which DOM elements deserve actual browser rendering, which saves heavy repaints."
    },
    {
      question: "How does the 'useCallback' hook optimize performance in standard custom components?",
      options: [
        "By memoizing the computed value of the callback calculation directly",
        "By memoizing the callback function instance itself across separate child re-renders",
        "By force-killing execution of secondary background request loops",
        "By fetching external JSON schemas prior to compiling JSX assemblies"
      ],
      correctAnswer: "By memoizing the callback function instance itself across separate child re-renders",
      explanation: "useCallback caches the function instances across re-renders, preventing unwanted child prop modifications that spark redundant nested styling changes."
    },
    {
      question: "What is the primary difference between 'flex-basis' and standard CSS 'width'?",
      options: [
        "flex-basis determines starting size along the main axis of a flex container before space distribution",
        "width only applies to absolute post-processed viewport containers",
        "flex-basis force-overwrites grid definitions inside Tailwind configurations",
        "width ignores relative font layouts and handles pixel grids globally"
      ],
      correctAnswer: "flex-basis determines starting size along the main axis of a flex container before space distribution",
      explanation: "flex-basis regulates the initial default dimensions of a flex item along whichever axis is specified by 'flex-direction' prior to allocating additional flex shrink properties."
    }
  ],
  "Technical_Java Developer": [
    {
      question: "In Java, what is the key functional difference between a 'HashMap' and a 'ConcurrentHashMap'?",
      options: [
        "HashMap cannot store null values or duplicate keys",
        "ConcurrentHashMap provides concurrent access using bucket-level locking without locking the entire map",
        "ConcurrentHashMap is slower than synchronized Hashtable due to master thread bottlenecks",
        "HashMap forces serialization of multi-threaded application segments with system locks"
      ],
      correctAnswer: "ConcurrentHashMap provides concurrent access using bucket-level locking without locking the entire map",
      explanation: "ConcurrentHashMap utilizes sophisticated segment or bucket level locks, enabling multiple threads to execute reads and write safely and asynchronously without blocking the global table."
    },
    {
      question: "What does the JVM 'Garbage First (G1)' collector prioritize during execution?",
      options: [
        "Shoring up local disk memory to store permanent variables",
        "Optimizing pause-time predictability while maintaining high throughput",
        "Compressing loaded compiled bytecode to fit tiny containers",
        "Forcing standard single-threaded cycles to run sequentially"
      ],
      correctAnswer: "Optimizing pause-time predictability while maintaining high throughput",
      explanation: "G1 segments the heap into equal regions and targets areas mostly filled with garbage first, guaranteeing precise, user-configured minimal pauses."
    }
  ],
  "Aptitude_Easy": [
    {
      question: "A training batch has 25 candidates. If 60% of them cleared the aptitude round, how many did NOT clear?",
      options: ["10 candidates", "12 candidates", "15 candidates", "8 candidates"],
      correctAnswer: "10 candidates",
      explanation: "60% of 25 = 15 candidates cleared. This means 25 - 15 = 10 candidates did not clear the round."
    },
    {
      question: "If a train travels 300 miles in 4 hours, what is its average speed?",
      options: ["60 mph", "75 mph", "80 mph", "70 mph"],
      correctAnswer: "75 mph",
      explanation: "Speed is calculated as distance divided by time. 300 miles / 4 hours = 75 miles per hour."
    }
  ],
  "Communication_Medium": [
    {
      question: "If a client provides vague requirements for a custom feature, what is the best first communication step?",
      options: [
        "Code standard templates based on internal assumptions and deploy immediately",
        "Schedule a clarification call to ask targeted, open-ended questions about their core business goal",
        "Politely ignore the requirements until they submit a structured PDF dossier",
        "File an escalation ticket with management complaining about vague descriptions"
      ],
      correctAnswer: "Schedule a clarification call to ask targeted, open-ended questions about their core business goal",
      explanation: "Clear active listening and proactive, structured clarification meetings clear up engineering ambiguity early, preventing wasted effort or technical misalignment."
    },
    {
      question: "What does using the STAR method stand for when responding to behavioral questions?",
      options: [
        "Strategy, Tactics, Action, Reporting",
        "Situation, Task, Action, Result",
        "Scope, Timeline, Allocation, Review",
        "Status, Training, Aptitude, Recommendation"
      ],
      correctAnswer: "Situation, Task, Action, Result",
      explanation: "The STAR method organizes feedback logically by contextualizing the Situation, describing your Task, demonstrating your Action, and summarizing the quantitative Result."
    }
  ],
  "HR_Medium": [
    {
      question: "How should you address a conflict about solution architecture within a project team?",
      options: [
        "Insist your design is superior and refuse further coordination",
        "Schedule a neutral technical review to weigh pros, cons, complexity, and project timeline objectives",
        "Ask team members to take a secret vote and mock the losing designer",
        "Withdraw from project conversations entirely and work in isolation"
      ],
      correctAnswer: "Schedule a neutral technical review to weigh pros, cons, complexity, and project timeline objectives",
      explanation: "Professional collaboration relies on objective trade-off evaluation tables that evaluate design choices fairly against project scope and maintainability targets."
    }
  ]
};

// Global generic list used when no specific combination is found
const GENERIC_QUESTIONS: Question[] = [
  {
    question: "Which of the following describes the core goal of continuous integration (CI) environments?",
    options: [
      "To automate testing and validation processes on every user code check-in",
      "To deploy direct staging builds automatically directly to the user client base",
      "To bypass version control tools using safe direct-link peer transfers",
      "To monitor physical server hardware temperatures during peak load periods"
    ],
    correctAnswer: "To automate testing and validation processes on every user code check-in",
    explanation: "Continuous integration focuses on early automated merges, lint reviews, and compiled builds on centralized repositories to reduce development friction."
  },
  {
    question: "What is the primary benefit of designing highly cohesive modules in software engineering?",
    options: [
      "It allows code to execute concurrently without explicit thread locks",
      "It makes the module highly focused on a single responsibility, which improves readability and maintenance",
      "It guarantees that API endpoints resolve with zero latency",
      "It reduces CSS stylesheet payload size inside frontend projects"
    ],
    correctAnswer: "It makes the module highly focused on a single responsibility, which improves readability and maintenance",
    explanation: "Cohesion measures internal strength. A highly cohesive unit focuses on one clear, robust outcome, making it isolated for testing and future edits."
  },
  {
    question: "How do you handle scope creep when a client requests un-scoped sprint changes?",
    options: [
      "Agree immediately to secure client endorsement regardless of team capacity",
      "Document the request, outline development impacts, and present formal scope adjustment options for trade-offs",
      "Reject the request immediately without communicating feedback",
      "Delay existing sprint deliverables without updating key stakeholders"
    ],
    correctAnswer: "Document the request, outline development impacts, and present formal scope adjustment options for trade-offs",
    explanation: "Managing scope requires clear analytical trade-offs, making the client aware of impacts on schedules so decisions are made jointly."
  }
];

export async function fetchAIQuestions(
  category: QuestionCategory,
  role: string,
  difficulty: "Easy" | "Medium" | "Hard"
): Promise<Question[]> {
  try {
    const response = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, role, difficulty })
    });
    
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    
    const result = await response.json();
    if (result.success && result.questions && result.questions.length > 0) {
      return result.questions;
    }
    
    // Fallback if success is false but didn't throw (or returned fallback: true)
    console.log("Using rich offline developer bank for category: " + category);
  } catch (err) {
    console.warn("Error contacting API, utilizing premium local questions:", err);
  }
  
  // Rich Fallback logic based on requested criteria
  const comboKey = `${category}_${role}`;
  if (FALLBACK_QUESTIONS[comboKey]) {
    return FALLBACK_QUESTIONS[comboKey];
  }
  
  const categoryKey = `${category}_${difficulty}`;
  if (FALLBACK_QUESTIONS[categoryKey]) {
    return FALLBACK_QUESTIONS[categoryKey];
  }
  
  // Check if any role questions match
  const rolePrefix = `Technical_${role}`;
  if (FALLBACK_QUESTIONS[rolePrefix]) {
    return FALLBACK_QUESTIONS[rolePrefix];
  }

  // Check if any category fallback exists
  const matchingCatKeys = Object.keys(FALLBACK_QUESTIONS).filter(k => k.startsWith(category));
  if (matchingCatKeys.length > 0) {
    return FALLBACK_QUESTIONS[matchingCatKeys[0]];
  }

  return GENERIC_QUESTIONS;
}
