function hasWord(q, keyword) {
  const normalize = (s) => s.replace(/['\u2019]/g, "").trim();
  const nq = normalize(q);
  const nk = normalize(keyword);
  if (!nk) return false;
  const escaped = nk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^a-z])" + escaped + "([^a-z]|$)", "i").test(nq);
}

function scoreKeywords(q, keywords) {
  let score = 0;
  for (const k of keywords) {
    if (hasWord(q, k)) score += k.trim().split(/\s+/).length;
  }
  return score;
}

const SKILL_KNOWN = [
  {
    name: "Manual Testing",
    percent: "90%",
    aliases: ["manual testing", "manual test", "test cases", "test case", "test scenario",
      "test scenarios", "black box", "functional testing", "regression testing",
      "smoke testing", "sanity testing", "stlc", "sdlc"],
    extra: "Her strongest skill — writing test scenarios and cases from requirements and executing them with discipline."
  },
  {
    name: "Automation Testing (Selenium)",
    percent: "85%",
    aliases: ["selenium", "selenium webdriver", "automation", "automation testing",
      "testng", "hybrid framework", "page object model", "pom", "apache poi",
      "webdriver", "automated testing", "sdet"],
    extra: "Used to build a hybrid Selenium + TestNG framework with POM and Apache POI data-driven tests on Shop Cart."
  },
  {
    name: "API Testing (Postman)",
    percent: "80%",
    aliases: ["postman", "api testing", "api test", "rest api testing", "api validation",
      "collections", "api"],
    extra: "Covers request validation, collections, and checking APIs as part of her SDET training."
  },
  {
    name: "SQL",
    percent: "75%",
    aliases: ["sql", "database", "queries", "joins", "db testing", "database testing"],
    extra: "Used for validating data and supporting backend checks during testing."
  },
  {
    name: "Core Java",
    percent: "75%",
    aliases: ["java", "core java", "java programming", "oops", "object oriented"],
    extra: "The language behind her Selenium automation scripts and hybrid framework."
  },
];

const SKILL_UNKNOWN = [
  "python", "django", "fastapi", "c++", "cpp", "c programming", "c#", "golang",
  "react", "angular", "vue", "next.js", "node", "express",
  "aws", "azure", "gcp", "docker", "kubernetes", "devops",
  "php", "laravel", "ruby", "swift", "kotlin", "flutter", "react native",
  "mongodb", "firebase", "redis", "kafka", "graphql",
  "tensorflow", "pytorch", "deep learning", "nlp",
  "blockchain", "cybersecurity", "ethical hacking",
  "unity", "embedded systems"
];

function bestSkillMatch(q) {
  let best = null, bestScore = 0;
  for (const s of SKILL_KNOWN) {
    const sc = scoreKeywords(q, s.aliases);
    if (sc > bestScore) { best = s; bestScore = sc; }
  }
  return { entry: best, score: bestScore };
}
function bestUnknownSkillMatch(q) {
  let best = null, bestScore = 0;
  for (const kw of SKILL_UNKNOWN) {
    if (hasWord(q, kw)) {
      const sc = kw.split(/\s+/).length;
      if (sc > bestScore) { best = kw; bestScore = sc; }
    }
  }
  return { keyword: best, score: bestScore };
}

const SKILL_INTENT_WORDS = ["know", "skill", "skills", "experience", "worked with", "used",
  "familiar", "expert", "proficient", "good at", "does she", "do you", "can she",
  "can you", "have you", "has she"];

const SKILLS_LIST_KEYWORDS = ["skill", "skills", "skillset", "skill set", "tech stack",
  "technology", "technologies", "language", "languages", "framework", "frameworks",
  "proficient", "proficiency", "good at", "expertise", "strength", "strengths",
  "arsenal", "toolkit", "testing toolkit", "what can she do", "what can you do",
  "her skills", "your skills", "competencies", "tools she uses"];

function skillsAnswer(question) {
  const q = question.toLowerCase();

  const known = bestSkillMatch(q);
  const unknown = bestUnknownSkillMatch(q);
  const listScore = scoreKeywords(q, SKILLS_LIST_KEYWORDS);

  if (known.score > 0 && known.score >= unknown.score && known.score >= listScore) {
    const s = known.entry;
    const pct = s.percent ? ` She's rated at ${s.percent} proficiency.` : "";
    return `Yes, Pooja knows ${s.name}.${pct} ${s.extra}`;
  }

  if (unknown.score > 0 && unknown.score >= listScore &&
      scoreKeywords(q, SKILL_INTENT_WORDS) > 0) {
    return `Pooja hasn't listed ${unknown.keyword} as one of her skills — it isn't part of her current testing stack.`;
  }

  if (listScore > 0) {
    return "Manual Testing – 90%, Automation Testing (Selenium) – 85%, API Testing (Postman) – 80%, SQL – 75%, Core Java – 75%. Tools include Eclipse, VS Code, Postman, Jira, and JMeter. Ask me about any one of these for more detail!";
  }
  return null;
}

const EMAIL_ONLY_KEYWORDS = ["email", "e-mail", "mail", "gmail", "mail id", "mail address",
  "email address", "email id", "send a mail", "send an email", "drop a mail",
  "mail her", "email her", "write to her", "your email", "her email"];
const PHONE_ONLY_KEYWORDS = ["phone number", "mobile number", "contact number", "cell number",
  "whatsapp number", "call number", "phone no", "mobile no", "her number", "your number",
  "call her", "phone her", "dial", "give me her number", "mobile", "cell phone"];
const GENERAL_CONTACT_KEYWORDS = ["contact", "connect", "reach", "reach out", "reach her",
  "get in touch", "let's connect", "lets connect", "talk to her",
  "message her", "how to contact", "how do i contact", "contact info", "contact details"];

function contactAnswer(question) {
  const q = question.toLowerCase();
  const emailScore = scoreKeywords(q, EMAIL_ONLY_KEYWORDS);
  const phoneScore = scoreKeywords(q, PHONE_ONLY_KEYWORDS);
  const generalScore = scoreKeywords(q, GENERAL_CONTACT_KEYWORDS);
  const best = Math.max(emailScore, phoneScore, generalScore);
  if (best === 0) return { text: null, score: 0 };

  if (emailScore === best) {
    return { text: "You can email Pooja at poojaprakasan00@gmail.com.", score: best };
  }
  if (phoneScore === best) {
    return { text: "You can call or WhatsApp Pooja at +91 90372 38826.", score: best };
  }
  return { text: "You can reach Pooja by email at poojaprakasan00@gmail.com or by phone/WhatsApp at +91 90372 38826.", score: best };
}

const KB = [
  {
    keywords: ["btech", "b.tech", "college", "university", "degree", "graduat", "bachelor",
      "computer science", "which college", "where did she study", "where did you study",
      "which university", "what did she study", "college name", "undergrad"],
    answer: "Pooja completed her B.Tech in Computer Science & Engineering at Universal Engineering College, Thrissur (2021 – 2025), graduating with a CGPA of 7.1."
  },
  {
    keywords: ["12th", "plus two", "higher secondary", "school", "intermediate", "10th",
      "high school", "class 12", "class 10", "hsc", "secondary education", "sslc"],
    answer: "Higher Secondary: GFVHSS Kaipamangalam, Thrissur (2019–2021) with 90%. Secondary: OLFGHS Mathilakam, Thrissur (2019) with 88%."
  },
  {
    keywords: ["education", "study", "qualification", "academic", "background", "education history",
      "educational qualification", "academic background"],
    answer: "Education: B.Tech in CSE, Universal Engineering College, Thrissur (2021–2025, CGPA 7.1). Higher Secondary at GFVHSS Kaipamangalam (2019–2021, 90%). Secondary at OLFGHS Mathilakam (2019, 88%)."
  },
  {
    keywords: ["cgpa", "gpa", "what is her cgpa", "final cgpa", "b.tech cgpa"],
    answer: "Pooja graduated with a CGPA of 7.1 in her B.Tech (Computer Science & Engineering, 2021–2025)."
  },
  {
    keywords: ["percentage", "12th marks", "12th percentage", "higher secondary marks",
      "hsc percentage", "school percentage", "10th marks", "sslc"],
    answer: "Pooja scored 90% in Higher Secondary and 88% in Secondary education."
  },
  {
    keywords: ["qspiders", "sdet", "certification", "training", "training program",
      "software development engineer in testing", "btm"],
    answer: "Pooja completed SDET (Software Development Engineer in Testing) training at QSpiders, BTM — covering manual testing, API testing with Postman, and Selenium automation frameworks."
  },
  {
    keywords: ["current job", "current role", "current company", "where does she work",
      "working now", "present job", "currently doing", "career", "internship",
      "what is she doing now"],
    answer: "Pooja is currently focused on SDET training at QSpiders, BTM, and is open to Software Testing / QA / SDET roles."
  },
  {
    keywords: ["work", "job", "experience", "company", "employ", "role", "profession",
      "occupation", "employment"],
    answer: "Pooja is an aspiring Software Tester with SDET training from QSpiders, BTM. She has hands-on project experience in Selenium automation and a face-recognition voting system."
  },
  {
    keywords: ["shop cart", "ecommerce", "e-commerce", "shopping cart", "hybrid framework",
      "selenium project", "automation project"],
    answer: "Shop Cart is an e-commerce testing project where Pooja built a hybrid automation framework with Java, Selenium WebDriver, TestNG, Apache POI, and Page Object Model. She automated Login, Product Search, Shopping Cart, Wishlist, and Checkout."
  },
  {
    keywords: ["voting", "face recognition", "online voting", "voting system"],
    answer: "Online Voting System Using Face Recognition — a project that uses face recognition for secure authentication so a person cannot vote more than once."
  },
  {
    keywords: ["projects", "project", "what projects", "featured projects", "main projects"],
    answer: "Pooja's featured work includes Shop Cart, a Selenium hybrid-framework automation project for an e-commerce app, and an Online Voting System using face recognition."
  },
  {
    keywords: ["all projects", "github repo", "repositories", "full project list"],
    answer: "You can browse Pooja's projects on GitHub: github.com/poojakp2003"
  },
  {
    keywords: ["hire", "hiring", "available for work", "open to work", "opportunit",
      "looking for a job", "recruit", "collaborat", "is she open", "job opening"],
    answer: "Pooja is open to Software Testing roles. Reach her at poojaprakasan00@gmail.com or LinkedIn: linkedin.com/in/pooja-k-p-a5b6bb38b"
  },
  {
    keywords: ["why should we hire", "why hire her", "what makes her a good fit",
      "what makes her stand out"],
    answer: "Pooja combines strong manual testing (90%) with Selenium automation (85%), Postman API testing, SQL, and Core Java, plus an SDET program at QSpiders and a hybrid-framework e-commerce project — a solid profile for QA / SDET roles."
  },
  {
    keywords: ["where is she based", "location", "based in", "live in", "city",
      "where does she live", "which city", "hometown", "thrissur", "bengaluru", "bangalore"],
    answer: "Pooja is based in Bengaluru, Karnataka. She completed her education in Thrissur."
  },
  {
    keywords: ["github", "linkedin", "social media", "social links", "her github",
      "her linkedin", "social profiles"],
    answer: "GitHub: github.com/poojakp2003 | LinkedIn: linkedin.com/in/pooja-k-p-a5b6bb38b"
  },
  {
    keywords: ["whatsapp"],
    answer: "You can message Pooja on WhatsApp at +91 90372 38826, or via wa.me/9037238826."
  },
  {
    keywords: ["who is", "about her", "introduce", "tell me about", "what does she do",
      "what does pooja do", "brief about her", "tell me about pooja", "her intro",
      "elevator pitch"],
    answer: "This is Pooja K P — an aspiring Software Tester and SDET trainee skilled in manual testing, Selenium automation, API testing with Postman, SQL, and Core Java."
  },
  {
    keywords: ["name", "her name", "full name", "what is her name"],
    answer: "Her name is Pooja K P."
  },
  {
    keywords: ["jira", "jmeter", "eclipse", "vs code", "visual studio code", "tools"],
    answer: "Her toolkit includes Eclipse IDE, VS Code, Postman, Jira for defect tracking, and JMeter for performance testing basics."
  },
  {
    keywords: ["achievement", "stats", "highlight", "accomplishment"],
    answer: "Quick stats: SDET certification training, 2+ testing projects, 7.1 B.Tech CGPA, 90% in Higher Secondary."
  },
  {
    keywords: ["resume", "cv", "download resume", "download cv", "resume link"],
    answer: "You can download Pooja's resume from the Resume button on the homepage, or email her at poojaprakasan00@gmail.com."
  },
  {
    keywords: ["neon reflex", "game", "the game", "play the game", "hidden game", "reflex game", "mini game"],
    answer: "That's Neon Reflex, a fast-paced reaction mini-game built into the Contact section — tap or click the glowing targets as fast as you can to test your reflexes and set a high score!"
  },
  {
    keywords: ["who are you", "are you ai", "are you a bot", "your name tina",
      "what is tina", "who is tina"],
    answer: "I'm Tina, an AI assistant built into Pooja's portfolio to answer questions about her education, training, skills, and projects."
  },
  {
    keywords: ["salary", "expected salary", "ctc", "compensation", "notice period"],
    answer: "That's best discussed directly with Pooja — reach out via email at poojaprakasan00@gmail.com or phone/WhatsApp at +91 90372 38826."
  },
];

function bestKBMatch(q) {
  let best = null, bestScore = 0;
  for (const entry of KB) {
    const sc = scoreKeywords(q, entry.keywords);
    if (sc > bestScore) { best = entry; bestScore = sc; }
  }
  return { entry: best, score: bestScore };
}

const SMALLTALK = [
  { keywords: ["rate pooja", "rate your creator", "how super is pooja"],
    answer: "Now I'm not ready to rate my creator" },
  { keywords: ["your current build version", "your version", "version"],
    answer: "v1.0.3" },
  { keywords: ["who made you", "who created you", "who is your creator", "worked on you"],
    answer: "Pooja built me as her AI assistant..." },
  { keywords: ["when he builded you", "when builded you", "date you created", "created date", "your build date"],
    answer: "September 2026" },
  { keywords: ["hi", "hello", "hey", "yo", "hiya", "howdy"],
    answer: "Hey there! I'm Tina. Ask me anything about the portfolio." },
  { keywords: ["good morning"],
    answer: "Hey, good morning, I'm Tina. Have a nice day..." },
  { keywords: ["good afternoon"],
    answer: "Hey, good afternoon, I'm Tina." },
  { keywords: ["good evening"],
    answer: "Hey, good evening, I'm Tina." },
  { keywords: ["good night"],
    answer: "Hey, Good night sweet dreams..." },
  { keywords: ["thank", "thanks", "thx", "appreciate", "cheers"],
    answer: "You're welcome! Let me know if you'd like to know anything else about Pooja's work." },
  { keywords: ["bye", "goodbye", "see you", "cya", "take care"],
    answer: "Take care! Feel free to reach out to Pooja directly at poojaprakasan00@gmail.com if you'd like to connect further." },
  { keywords: ["how are you", "how's it going", "what's up", "how you doing"],
    answer: "Doing great, thanks for asking! I'm here to answer questions about Pooja's portfolio — what would you like to know?" },
  { keywords: ["ok", "okay", "cool", "nice", "great", "alright", "got it", "sounds good"],
    answer: "Glad that helps! Anything else you'd like to know about Pooja?" },
];

function smalltalkMatch(q) {
  for (const entry of SMALLTALK) {
    if (entry.keywords.some((k) => hasWord(q, k))) return entry;
  }
  return null;
}

const PORTFOLIO_SCOPE = [
  "pooja", "resume", "cv", "portfolio", "hire", "hiring", "available",
  "selenium", "java", "postman", "sql", "manual testing", "automation",
  "testng", "jira", "jmeter", "sdet", "qspiders",
  "skill", "skills", "project", "projects", "contact", "connect", "email",
  "phone", "number", "github", "linkedin", "college", "university",
  "cgpa", "work", "job", "experience", "tina", "game", "neon reflex"
];

const FALLBACK = "I can only help with the portfolio. Try rephrasing, or ask about Pooja's skills, training, or projects.";
const OFF_TOPIC = "That's outside what I can help with — I stick to questions about Pooja's portfolio.";

export function findAnswer(question) {
  const q = question.toLowerCase();

  const smalltalk = smalltalkMatch(q);
  if (smalltalk) return smalltalk.answer;

  const skillReply = skillsAnswer(question);
  const skillScore = skillReply ? 3 : 0;

  const contact = contactAnswer(question);
  const kb = bestKBMatch(q);

  const best = Math.max(skillScore, contact.score, kb.score);

  if (best === 0) {
    return PORTFOLIO_SCOPE.some((k) => hasWord(q, k)) ? FALLBACK : OFF_TOPIC;
  }
  if (skillScore === best && skillReply) return skillReply;
  if (contact.score === best && contact.text) return contact.text;
  if (kb.score === best && kb.entry) return kb.entry.answer;

  return PORTFOLIO_SCOPE.some((k) => hasWord(q, k)) ? FALLBACK : OFF_TOPIC;
}

export function isSmalltalk(question) {
  return !!smalltalkMatch(question.toLowerCase());
}

export const THINKING_PHRASES = [
  "Thinking...",
  "Let me check...",
  "Looking that up...",
  "Digging through Pooja's info...",
  "One sec...",
  "Give me a moment...",
  "Searching my notes...",
  "Piecing that together..."
];

export function pickThinkingPhrase(exclude) {
  let phrase;
  do {
    phrase = THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)];
  } while (phrase === exclude && THINKING_PHRASES.length > 1);
  return phrase;
}
