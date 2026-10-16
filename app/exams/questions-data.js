import mathQuestions from "./questions/math.js";
import englishQuestions from "./questions/english.js";
import scienceQuestions from "./questions/science.js";
import artQuestions from "./questions/art.js";
import currentAffairsQuestions from "./questions/current_affairs.js";
import generalKnowledgeQuestions from "./questions/general_knowledge.js";

export const CBT_QUESTION_BANK = {
  math: mathQuestions,
  english: englishQuestions,
  science: scienceQuestions,
  art: artQuestions,
  current_affairs: currentAffairsQuestions,
  general_knowledge: generalKnowledgeQuestions
};

export const CBT_SUBJECTS_METADATA = [
  { id: "math", title: "Mathematics", icon: "fa-calculator", category: "Sciences", desc: "Algebra, arithmetic, geometry, probability, and numerical problem solving." },
  { id: "english", title: "English Language", icon: "fa-book-bookmark", category: "Arts & Languages", desc: "Grammar, vocabulary, spelling, literary devices, and sentence construction." },
  { id: "science", title: "Basic Science", icon: "fa-flask-vial", category: "Sciences", desc: "Physics, chemistry, biology, space, human anatomy, and natural phenomena." },
  { id: "art", title: "Art & Culture", icon: "fa-palette", category: "Humanities", desc: "Visual arts, colors, art history, classical Renaissance, and modern movements." },
  { id: "current_affairs", title: "Current Affairs", icon: "fa-newspaper", category: "Social Sciences", desc: "Global events, world leaders, international organizations, and major milestones." },
  { id: "general_knowledge", title: "General Knowledge", icon: "fa-earth-africa", category: "General Studies", desc: "Geography, landmarks, inventions, world wonders, and general trivia." }
];

export function getCbtAllSubjects() {
  const subjects = CBT_SUBJECTS_METADATA.map((subject) => {
    const questionCount = CBT_QUESTION_BANK[subject.id]?.length || 0;
    return {
      ...subject,
      questionCount,
      maxQuestions: questionCount,
      isCustom: false
    };
  });

  try {
    const customPacks = JSON.parse(localStorage.getItem("cbt_custom_packs") || "[]");
    customPacks.forEach((pack) => {
      if (!pack?.id) return;
      const questionCount = Array.isArray(pack.questions) ? pack.questions.length : 0;
      subjects.push({
        id: pack.id,
        title: pack.title || "Custom Question Pack",
        icon: "fa-sliders",
        category: "Custom Instructor Pack",
        desc: pack.description || `Created by ${pack.creatorName || "Instructor"} (${pack.creatorTag || "@teacher"})`,
        questionCount,
        maxQuestions: questionCount,
        isCustom: true,
        creatorTag: pack.creatorTag || "@teacher",
        creatorName: pack.creatorName || "Instructor",
        durationMinutes: pack.durationMinutes || 30
      });
    });
  } catch (error) {
    console.warn("Could not read custom packs:", error);
  }

  return subjects;
}

export function getCbtSubjectById(subjectId) {
  return getCbtAllSubjects().find((subject) => subject.id === subjectId) || null;
}

export function getCbtQuestionsForSubject(subjectId) {
  let questions = CBT_QUESTION_BANK[subjectId] ? [...CBT_QUESTION_BANK[subjectId]] : [];

  if (questions.length === 0) {
    try {
      const customPacks = JSON.parse(localStorage.getItem("cbt_custom_packs") || "[]");
      const pack = customPacks.find((item) => item.id === subjectId || item.subjectKey === subjectId);
      if (Array.isArray(pack?.questions)) questions = [...pack.questions];
    } catch (error) {
      // Invalid custom pack data is ignored, matching the existing fallback behavior.
    }
  }

  if (questions.length === 0) questions = [...CBT_QUESTION_BANK.general_knowledge];

  return questions.map((question, index) => ({
    id: question.id || `${subjectId}_q${index + 1}`,
    ...question
  }));
}

export function sampleCbtQuestions(subjectId, requestedCount) {
  const bank = getCbtQuestionsForSubject(subjectId);
  const count = Math.min(requestedCount, bank.length);
  const shuffled = [...bank];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}
