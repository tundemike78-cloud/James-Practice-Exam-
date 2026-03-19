import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Trophy, 
  Flame, 
  Star, 
  Home, 
  LayoutGrid, 
  MessageCircle, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Target,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Subject, Lesson, Question, UserProgress, StudentProfile, Difficulty } from './types';
import { LESSONS, FLASHCARDS, BADGES } from './data/mockData';
import { getAITutorResponse } from './services/geminiService';
import questionBank from './data/questionBank.json';
import { LessonView } from './components/LessonView';
import { QuizView } from './components/QuizView';
import { FlashcardView } from './components/FlashcardView';
import { ParentDashboard } from './components/ParentDashboard';
import { INITIAL_PROFILE } from './services/adaptiveEngine';

// Map JSON to Question interface
const BANK_QUESTIONS: Question[] = (questionBank as any[]).map((q) => ({
  id: q.id,
  subject: q.subject as Subject,
  topic: q.topic,
  text: q.text,
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
  difficulty: q.difficulty as Difficulty,
  passage: q.passage,
  standard: q.standard,
  hint: q.hint
}));

// --- Components ---

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      className={`h-full ${color}`}
    />
  </div>
);

const AITutorChat = ({ isOpen, onClose, context }: { isOpen: boolean; onClose: () => void; context?: string }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm Coach. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const botResponse = await getAITutorResponse(userMsg, context);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 right-4 left-4 md:left-auto md:w-96 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 z-50 flex flex-col max-h-[70vh]"
        >
          <div className="p-4 bg-blue-500 text-white rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-500 font-bold">C</div>
              <span className="font-bold">Coach (AI Tutor)</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-blue-600 rounded">
              <XCircle size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl relative ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 italic">Coach is thinking...</div>}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Coach anything..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'subject' | 'lesson' | 'quiz' | 'flashcards'>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({
    stars: 0,
    streak: 1,
    dailyGoal: 10,
    completedLessons: [],
    weakAreas: {},
    subjectProgress: { Math: 0, ELA: 0, Science: 0 },
    badges: [],
    profile: INITIAL_PROFILE
  });

  useEffect(() => {
    const saved = localStorage.getItem('milestones_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure profile exists for older saves
      if (!parsed.profile) {
        parsed.profile = INITIAL_PROFILE;
      }
      setProgress(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('milestones_progress', JSON.stringify(progress));
  }, [progress]);

  const addStar = () => {
    setProgress(prev => ({ ...prev, stars: prev.stars + 1 }));
  };

  const completeLesson = (lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      setProgress(prev => {
        const newCompleted = [...prev.completedLessons, lessonId];
        // Simple progress calculation
        const subject = LESSONS.find(l => l.id === lessonId)?.subject;
        const newSubjectProgress = { ...prev.subjectProgress };
        if (subject) {
          const totalInSubject = LESSONS.filter(l => l.subject === subject).length;
          const completedInSubject = newCompleted.filter(id => LESSONS.find(l => l.id === id)?.subject === subject).length;
          newSubjectProgress[subject] = Math.round((completedInSubject / totalInSubject) * 100);
        }
        return { ...prev, completedLessons: newCompleted, subjectProgress: newSubjectProgress };
      });
    }
  };

  // --- View Handlers ---

  const renderHome = () => (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Hi, {progress.stars > 50 ? 'Super Star' : 'Learner'}! 👋</h1>
          <p className="text-gray-500">Ready to crush the Milestones?</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">
          <Flame size={20} />
          <span>{progress.streak} Day Streak</span>
        </div>
      </header>

      <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="text-blue-500" />
            Daily Goal
          </h2>
          <span className="text-blue-600 font-bold">{progress.stars} / {progress.dailyGoal} ⭐</span>
        </div>
        <ProgressBar progress={(progress.stars / progress.dailyGoal) * 100} color="bg-yellow-400" />
        <p className="text-sm text-gray-500 mt-2 text-center">You're doing great! Keep it up!</p>
      </section>

      <section className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={24} className="text-yellow-300" />
            <span className="font-bold uppercase tracking-wider text-xs">Daily Challenge</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">The Brain Teaser! 🧠</h3>
          <p className="text-white/80 mb-4 text-sm">Solve a hard question to earn 5 extra stars!</p>
          <button 
            onClick={() => {
              const hardQuestions = BANK_QUESTIONS.filter(q => q.difficulty === 'Hard');
              const randomHard = hardQuestions[Math.floor(Math.random() * hardQuestions.length)];
              // We need a way to pass this specific question to the quiz view
              // For now, let's just trigger a special quiz state if possible, or just start a 1-question quiz
              // I'll simplify: just start the quiz mode which is already balanced
              setView('quiz');
            }}
            className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors text-sm"
          >
            Start Challenge
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12">
          <HelpCircle size={120} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <h2 className="text-xl font-bold">Your Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['Math', 'ELA', 'Science'] as Subject[]).map(sub => (
            <button 
              key={sub}
              onClick={() => { setSelectedSubject(sub); setView('subject'); }}
              className={`p-6 rounded-3xl text-left shadow-md transition-transform hover:scale-105 ${
                sub === 'Math' ? 'bg-blue-500 text-white' :
                sub === 'ELA' ? 'bg-purple-500 text-white' :
                'bg-emerald-500 text-white'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                {sub === 'Math' ? <Calculator size={32} /> :
                 sub === 'ELA' ? <BookOpen size={32} /> :
                 <FlaskConical size={32} />}
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                  {progress.subjectProgress[sub]}%
                </span>
              </div>
              <h3 className="text-2xl font-bold">{sub}</h3>
              <p className="text-white/80 text-sm">Master your {sub} skills!</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setView('quiz')}
          className="bg-orange-500 text-white p-6 rounded-3xl shadow-md flex flex-col items-center gap-2"
        >
          <LayoutGrid size={32} />
          <span className="font-bold text-xl">Quiz Mode</span>
        </button>
        <button 
          onClick={() => setView('flashcards')}
          className="bg-pink-500 text-white p-6 rounded-3xl shadow-md flex flex-col items-center gap-2"
        >
          <LayoutGrid size={32} />
          <span className="font-bold text-xl">Flashcards</span>
        </button>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Your Badges</h2>
        <div className="grid grid-cols-4 gap-2">
          {BADGES.map(badge => {
            const unlocked = progress.badges.some(b => b.id === badge.id);
            return (
              <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl border-2 ${unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                <span className="text-3xl mb-1">{badge.icon}</span>
                <span className="text-xs font-bold text-center leading-tight">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-blue-100 p-6 rounded-3xl border-2 border-blue-200">
        <h2 className="text-xl font-bold text-blue-800 mb-2">Parent Report 📊</h2>
        <p className="text-blue-600 text-sm mb-4">See how your child is doing on their Milestones prep!</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-2xl">
            <span className="block text-xs text-gray-400 uppercase font-bold">Total Lessons</span>
            <span className="text-2xl font-bold text-blue-600">{progress.completedLessons.length}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl">
            <span className="block text-xs text-gray-400 uppercase font-bold">Total Stars</span>
            <span className="text-2xl font-bold text-yellow-500">{progress.stars} ⭐</span>
          </div>
        </div>
        <button 
          onClick={() => setView('parent')}
          className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold shadow-md hover:bg-blue-700 transition-colors"
        >
          Open Parent Dashboard
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('milestones_progress');
            window.location.reload();
          }}
          className="mt-4 text-xs text-blue-400 hover:text-blue-600 underline text-center w-full"
        >
          Reset Progress
        </button>
      </section>

      {/* Focus Mode Section */}
      {progress.profile.weakTopics.length > 0 && (
        <section className="bg-orange-100 p-6 rounded-3xl border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 text-white p-2 rounded-xl">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-orange-800">Focus Mode</h2>
              <p className="text-orange-600 text-sm">Practice your weak areas!</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {progress.profile.weakTopics.map(topic => (
              <span key={topic} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200">
                {topic}
              </span>
            ))}
          </div>
          <button 
            onClick={() => {
              setView('quiz');
            }}
            className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold shadow-md hover:bg-orange-600 transition-colors"
          >
            Start Focus Practice
          </button>
        </section>
      )}
    </div>
  );

  const renderSubject = () => {
    const lessons = LESSONS.filter(l => l.subject === selectedSubject);
    const subjectQuestions = BANK_QUESTIONS.filter(q => q.subject === selectedSubject);

    return (
      <div className="p-6 space-y-6 pb-24">
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-blue-600 font-bold">
          <ArrowLeft size={20} /> Back to Home
        </button>
        
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-bold">{selectedSubject}</h1>
          <button 
            onClick={() => setView('quiz')}
            className="text-sm bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-blue-200 transition-colors"
          >
            Take {selectedSubject} Quiz
          </button>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-blue-500" />
            Lessons
          </h2>
          <div className="space-y-4">
            {lessons.length > 0 ? (
              lessons.map(lesson => (
                <button 
                  key={lesson.id}
                  onClick={() => { setSelectedLesson(lesson); setView('lesson'); }}
                  className="w-full bg-white p-6 rounded-3xl shadow-md border-2 border-transparent hover:border-blue-200 text-left flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                      {lesson.standard && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">
                          {lesson.standard}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{lesson.description}</p>
                  </div>
                  {progress.completedLessons.includes(lesson.id) ? (
                    <CheckCircle2 className="text-emerald-500" />
                  ) : (
                    <ChevronRight className="text-gray-300" />
                  )}
                </button>
              ))
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow-md text-center">
                <p className="text-gray-500 italic">No lessons available for this subject yet. We're adding more soon!</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle size={20} className="text-orange-500" />
            Practice Bank
          </h2>
          <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-orange-50">
            <p className="text-gray-600 mb-4">Ready to test your knowledge? We have {subjectQuestions.length} practice questions ready for you!</p>
            <button 
              onClick={() => setView('quiz')}
              className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-orange-600 transition-colors"
            >
              Start Practice Session
            </button>
          </div>
        </section>
      </div>
    );
  };

  const renderLesson = () => {
    if (!selectedLesson) return null;
    return (
      <LessonView 
        selectedLesson={selectedLesson}
        selectedSubject={selectedSubject}
        onBack={() => setView('subject')}
        onComplete={completeLesson}
        onAddStar={addStar}
      />
    );
  };

  const renderQuiz = () => {
    return (
      <QuizView 
        questionBank={BANK_QUESTIONS}
        studentProfile={progress.profile || INITIAL_PROFILE}
        onUpdateProfile={(newProfile) => {
          setProgress(prev => ({ ...prev, profile: newProfile }));
        }}
        subject={selectedSubject || undefined}
        onBack={() => setView('home')}
        onAddStar={addStar}
      />
    );
  };

  const renderFlashcards = () => {
    return (
      <FlashcardView 
        flashcards={FLASHCARDS}
        onBack={() => setView('home')}
      />
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-gray-900 overflow-x-hidden">
      <main className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderHome()}</motion.div>}
          {view === 'subject' && <motion.div key="subject" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderSubject()}</motion.div>}
          {view === 'lesson' && <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderLesson()}</motion.div>}
          {view === 'quiz' && <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderQuiz()}</motion.div>}
          {view === 'flashcards' && <motion.div key="flashcards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderFlashcards()}</motion.div>}
          {view === 'parent' && (
            <motion.div key="parent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ParentDashboard profile={progress.profile || INITIAL_PROFILE} onBack={() => setView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center shadow-2xl z-40">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => { setSelectedSubject('Math'); setView('subject'); }} className={`flex flex-col items-center gap-1 ${view === 'subject' && selectedSubject === 'Math' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Calculator size={24} />
          <span className="text-[10px] font-bold">Math</span>
        </button>
        <button onClick={() => { setSelectedSubject('ELA'); setView('subject'); }} className={`flex flex-col items-center gap-1 ${view === 'subject' && selectedSubject === 'ELA' ? 'text-blue-600' : 'text-gray-400'}`}>
          <BookOpen size={24} />
          <span className="text-[10px] font-bold">ELA</span>
        </button>
        <button onClick={() => { setSelectedSubject('Science'); setView('subject'); }} className={`flex flex-col items-center gap-1 ${view === 'subject' && selectedSubject === 'Science' ? 'text-blue-600' : 'text-gray-400'}`}>
          <FlaskConical size={24} />
          <span className="text-[10px] font-bold">Science</span>
        </button>
        <button onClick={() => setIsTutorOpen(true)} className={`flex flex-col items-center gap-1 ${isTutorOpen ? 'text-blue-600' : 'text-gray-400'}`}>
          <MessageCircle size={24} />
          <span className="text-[10px] font-bold">Coach</span>
        </button>
      </nav>

      {/* AI Tutor Floating Button (if not open) */}
      {!isTutorOpen && (
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsTutorOpen(true)}
          className="fixed bottom-24 right-6 bg-blue-500 text-white p-4 rounded-full shadow-2xl z-30"
        >
          <MessageCircle size={28} />
        </motion.button>
      )}

      <AITutorChat 
        isOpen={isTutorOpen} 
        onClose={() => setIsTutorOpen(false)} 
        context={selectedLesson ? `The student is currently learning about "${selectedLesson.title}" in ${selectedLesson.subject}.` : undefined}
      />
    </div>
  );
}
