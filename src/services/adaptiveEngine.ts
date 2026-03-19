import { Difficulty, Question, StudentProfile, Subject } from '../types';

export const DIFFICULTY_LEVELS: Difficulty[] = ['Beginner', 'Easy', 'Medium', 'Hard'];

export const CHILD_FRIENDLY_DIFFICULTY: { [key in Difficulty]: string } = {
  Beginner: 'Starting Strong',
  Easy: 'Growing',
  Medium: 'Getting Better',
  Hard: 'Milestones Ready',
};

export const getNextDifficulty = (current: Difficulty, direction: 'up' | 'down'): Difficulty => {
  const currentIndex = DIFFICULTY_LEVELS.indexOf(current);
  if (direction === 'up') {
    return DIFFICULTY_LEVELS[Math.min(currentIndex + 1, DIFFICULTY_LEVELS.length - 1)];
  } else {
    return DIFFICULTY_LEVELS[Math.max(currentIndex - 1, 0)];
  }
};

export const updateStudentProfile = (
  profile: StudentProfile,
  question: Question,
  isCorrect: boolean
): StudentProfile => {
  const newProfile = { ...profile };
  const subject = question.subject;
  const topic = question.topic;

  // Track answered question to avoid immediate repeats
  newProfile.answeredQuestionIds = [...new Set([...newProfile.answeredQuestionIds, question.id])].slice(-20);

  // Update rolling accuracy (last 5)
  newProfile.lastAnswers = [...newProfile.lastAnswers, isCorrect].slice(-5);

  // Update basic stats
  newProfile.totalQuestionsAnswered += 1;
  newProfile.lastUpdated = new Date().toISOString();

  if (isCorrect) {
    newProfile.correctAnswers += 1;
    newProfile.streak += 1;
    newProfile.wrongStreak = 0;
    newProfile.confidenceScore = Math.min(newProfile.confidenceScore + 8, 100);
  } else {
    newProfile.wrongAnswers += 1;
    newProfile.streak = 0;
    newProfile.wrongStreak += 1;
    newProfile.confidenceScore = Math.max(newProfile.confidenceScore - 4, 0);
  }

  // Support Mode Trigger: 2 wrong in a row (or 3 in last 5 for safety)
  // User says "2 wrong in a row -> go down 1 level" AND "Show easier recovery questions after a struggle"
  newProfile.isSupportMode = newProfile.wrongStreak >= 2;

  // Update topic accuracy
  if (!newProfile.topicAccuracy[topic]) {
    newProfile.topicAccuracy[topic] = { correct: 0, total: 0 };
  }
  newProfile.topicAccuracy[topic].total += 1;
  if (isCorrect) {
    newProfile.topicAccuracy[topic].correct += 1;
  }

  const topicStats = newProfile.topicAccuracy[topic];
  const accuracy = (topicStats.correct / topicStats.total) * 100;

  // Update topic difficulty (User specific rules)
  if (!newProfile.topicDifficulty[topic]) {
    newProfile.topicDifficulty[topic] = 'Beginner';
  }
  
  const currentTopicDiff = newProfile.topicDifficulty[topic];
  
  // Rule: 2 correct in a row -> go up 1 level
  if (isCorrect && newProfile.streak >= 2) {
    newProfile.topicDifficulty[topic] = getNextDifficulty(currentTopicDiff, 'up');
    newProfile.streak = 0; // Reset streak after level up to require another 2
  }
  
  // Rule: 2 wrong in a row -> go down 1 level
  if (!isCorrect && newProfile.wrongStreak >= 2) {
    newProfile.topicDifficulty[topic] = getNextDifficulty(currentTopicDiff, 'down');
    newProfile.wrongStreak = 0; // Reset after level down
  }

  // Update mastery stars (0-3)
  let stars = 0;
  if (accuracy >= 85 && currentTopicDiff === 'Hard') stars = 3;
  else if (accuracy >= 75 && (currentTopicDiff === 'Medium' || currentTopicDiff === 'Hard')) stars = 2;
  else if (accuracy >= 60) stars = 1;
  newProfile.masteryStars[topic] = Math.max(newProfile.masteryStars[topic] || 0, stars);

  // Update weak/strong topics (User rules: <60% more practice, >80% fewer repeats)
  if (topicStats.total >= 5) {
    if (accuracy < 60) {
      if (!newProfile.weakTopics.includes(topic)) {
        newProfile.weakTopics.push(topic);
        newProfile.strongTopics = newProfile.strongTopics.filter(t => t !== topic);
      }
    } else if (accuracy >= 80) {
      if (!newProfile.strongTopics.includes(topic)) {
        newProfile.strongTopics.push(topic);
        newProfile.weakTopics = newProfile.weakTopics.filter(t => t !== topic);
      }
    }
  }

  // Update subject difficulty (based on current topic difficulty)
  newProfile.currentDifficulty[subject] = newProfile.topicDifficulty[topic];

  return newProfile;
};

export const getNextQuestion = (
  questions: Question[],
  profile: StudentProfile,
  subject: Subject
): Question => {
  // Support mode: Force Easy/Beginner question
  if (profile.isSupportMode) {
    const easyQuestions = questions.filter(q => 
      q.subject === subject && 
      (q.difficulty === 'Beginner' || q.difficulty === 'Easy')
    );
    if (easyQuestions.length > 0) {
      return easyQuestions[Math.floor(Math.random() * easyQuestions.length)];
    }
  }

  // Normal mode: Use topic-specific difficulty
  const availableTopics = Array.from(new Set(questions.filter(q => q.subject === subject).map(q => q.topic)));
  
  // Rule: Accuracy below 60% in one topic -> more practice in that topic
  // Rule: Accuracy above 80% in one topic -> fewer repeats
  
  let targetTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
  
  // Prioritize weak topics (more practice)
  if (profile.weakTopics.length > 0 && Math.random() > 0.3) {
    const weakInSubject = profile.weakTopics.filter(t => questions.some(q => q.topic === t && q.subject === subject));
    if (weakInSubject.length > 0) {
      targetTopic = weakInSubject[Math.floor(Math.random() * weakInSubject.length)];
    }
  }
  
  // Deprioritize strong topics (fewer repeats)
  if (profile.strongTopics.includes(targetTopic) && Math.random() > 0.7) {
    const otherTopics = availableTopics.filter(t => !profile.strongTopics.includes(t));
    if (otherTopics.length > 0) {
      targetTopic = otherTopics[Math.floor(Math.random() * otherTopics.length)];
    }
  }

  const topicDiff = profile.topicDifficulty[targetTopic] || profile.currentDifficulty[subject];
  
  // Filter questions by topic and difficulty, avoiding recent repeats
  let eligibleQuestions = questions.filter(q => 
    q.subject === subject && 
    q.topic === targetTopic && 
    q.difficulty === topicDiff &&
    !profile.answeredQuestionIds.includes(q.id)
  );

  // Fallback if no questions for that specific topic/difficulty that haven't been answered recently
  if (eligibleQuestions.length === 0) {
    eligibleQuestions = questions.filter(q => 
      q.subject === subject && 
      q.topic === targetTopic && 
      q.difficulty === topicDiff
    );
  }
  
  if (eligibleQuestions.length === 0) {
    eligibleQuestions = questions.filter(q => q.subject === subject && q.difficulty === topicDiff);
  }
  
  if (eligibleQuestions.length === 0) {
    eligibleQuestions = questions.filter(q => q.subject === subject);
  }

  return eligibleQuestions[Math.floor(Math.random() * eligibleQuestions.length)];
};

export const getPromotionRecommendation = (profile: StudentProfile): string => {
  const totalAccuracy = profile.totalQuestionsAnswered > 0 
    ? (profile.correctAnswers / profile.totalQuestionsAnswered) * 100 
    : 0;
  
  const hardTopics = Object.entries(profile.topicDifficulty).filter(([_, diff]) => diff === 'Hard').length;
  const totalTopics = Object.keys(profile.topicDifficulty).length;

  if (totalAccuracy > 85 && hardTopics >= totalTopics * 0.5 && profile.totalQuestionsAnswered > 50) {
    return "Ready for Grade 5! 🚀 Your child has mastered over half the topics at the highest level. We recommend moving to Grade 5 content next week.";
  } else if (totalAccuracy > 70 && profile.totalQuestionsAnswered > 20) {
    return "Great progress! 🌟 Keep focusing on the 'Needs Practice' areas to reach full Grade 5 readiness. Another week of Grade 4 review will build perfect confidence.";
  } else {
    return "Building a strong foundation! 🌱 Focus on completing more lessons and daily quizzes to unlock higher difficulty levels.";
  }
};

export const INITIAL_PROFILE: StudentProfile = {
  studentName: 'Student',
  grade: 4,
  currentDifficulty: {
    Math: 'Beginner',
    ELA: 'Beginner',
    Science: 'Beginner',
  },
  topicDifficulty: {},
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  streak: 0,
  wrongStreak: 0,
  weakTopics: [],
  strongTopics: [],
  topicAccuracy: {},
  confidenceScore: 50,
  lastAnswers: [],
  masteryStars: {},
  isSupportMode: false,
  lastUpdated: new Date().toISOString(),
  answeredQuestionIds: [],
};
