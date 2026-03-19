import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, HelpCircle, Lightbulb, CheckCircle2, XCircle, Sparkles, Star, TrendingUp, Heart } from 'lucide-react';
import { Question, StudentProfile, Subject, Difficulty } from '../types';
import { getNextQuestion, updateStudentProfile, CHILD_FRIENDLY_DIFFICULTY } from '../services/adaptiveEngine';

interface QuizViewProps {
  questionBank: Question[];
  studentProfile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onBack: () => void;
  onAddStar: () => void;
  subject?: Subject;
}

export const QuizView = ({ 
  questionBank, 
  studentProfile, 
  onUpdateProfile, 
  onBack, 
  onAddStar,
  subject 
}: QuizViewProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<{question: Question, isCorrect: boolean}[]>([]);

  const QUIZ_LENGTH = 10;

  // Initialize first question
  useEffect(() => {
    if (!currentQuestion && questionBank.length > 0) {
      const nextQ = getNextQuestion(questionBank, studentProfile, subject || 'Math');
      setCurrentQuestion(nextQ);
      if (studentProfile.isSupportMode) {
        setShowHint(true);
      }
    }
  }, [questionBank, studentProfile, subject, currentQuestion, studentProfile.isSupportMode]);

  const handleAnswer = (option: string) => {
    if (!currentQuestion) return;
    
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      onAddStar();
    }
    
    // Update session history
    setSessionHistory(prev => [...prev, { question: currentQuestion, isCorrect }]);
    
    // Update student profile using adaptive logic
    const updatedProfile = updateStudentProfile(studentProfile, currentQuestion, isCorrect);
    onUpdateProfile(updatedProfile);
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (questionsAnswered + 1 < QUIZ_LENGTH) {
      setQuestionsAnswered(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setShowHint(false);
      
      // Get next adaptive question
      const nextQ = getNextQuestion(questionBank, studentProfile, subject || 'Math');
      setCurrentQuestion(nextQ);
      if (studentProfile.isSupportMode) {
        setShowHint(true);
      }
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    const weakTopicsInSession = Array.from(new Set(sessionHistory.filter(h => !h.isCorrect).map(h => h.question.topic))) as string[];
    const strongTopicsInSession = Array.from(new Set(sessionHistory.filter(h => h.isCorrect).map(h => h.question.topic))) as string[];

    return (
      <div className="p-6 text-center space-y-8 pb-24 max-w-2xl mx-auto">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-yellow-100 p-12 rounded-full w-48 h-48 flex items-center justify-center mx-auto shadow-inner"
        >
          <Trophy size={80} className="text-yellow-500" />
        </motion.div>
        
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Quiz Finished!</h1>
          <p className="text-xl text-gray-500 mt-2">You scored {score} out of {QUIZ_LENGTH}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 text-left">
            <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-2">
              <CheckCircle2 size={20} /> Strong Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {strongTopicsInSession.length > 0 ? strongTopicsInSession.map(topic => (
                <div key={topic} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-emerald-600 shadow-sm flex items-center gap-1">
                  {topic}
                  {studentProfile.masteryStars[topic] > 0 && (
                    <div className="flex">
                      {[...Array(studentProfile.masteryStars[topic])].map((_, i) => (
                        <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              )) : <span className="text-emerald-500 italic text-sm">Keep practicing!</span>}
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-100 text-left">
            <h3 className="font-bold text-orange-700 flex items-center gap-2 mb-2">
              <HelpCircle size={20} /> Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {weakTopicsInSession.length > 0 ? weakTopicsInSession.map(topic => (
                <div key={topic} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-orange-600 shadow-sm flex items-center gap-1">
                  {topic}
                  {studentProfile.masteryStars[topic] > 0 && (
                    <div className="flex">
                      {[...Array(studentProfile.masteryStars[topic])].map((_, i) => (
                        <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              )) : <span className="text-orange-500 italic text-sm">None! You're a pro!</span>}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-blue-50">
          <p className="text-lg font-bold text-blue-600">Great work! You earned {score} stars! ⭐</p>
          <p className="text-sm text-gray-500 mt-1">Your level is now: {CHILD_FRIENDLY_DIFFICULTY[studentProfile.currentDifficulty[subject || 'Math']]}</p>
        </div>

        <button 
          onClick={onBack}
          className="w-full bg-blue-500 text-white py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="p-6 text-center space-y-8 pb-24">
        <div className="animate-pulse bg-blue-100 p-12 rounded-full w-48 h-48 flex items-center justify-center mx-auto">
          <Sparkles size={80} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Loading your quiz...</h1>
        <p className="text-gray-500">We're picking the perfect questions for you!</p>
      </div>
    );
  }

  const currentDiffLabel = CHILD_FRIENDLY_DIFFICULTY[currentQuestion.difficulty];

  return (
    <div className="p-6 space-y-6 pb-24 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-700">
          <ArrowLeft size={20} /> Quit
        </button>
        <div className="flex flex-col items-end">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
            Question {questionsAnswered + 1} / {QUIZ_LENGTH}
          </span>
          <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
            Level: {currentDiffLabel}
          </span>
        </div>
      </div>

      {/* Progress Bar & Confidence Meter */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quiz Progress</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp size={10} /> Confidence: {studentProfile.confidenceScore}%
          </span>
        </div>
        <div className="grid grid-cols-10 gap-1 h-2">
          <div className="col-span-7 bg-gray-100 rounded-full overflow-hidden shadow-inner flex">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((questionsAnswered + 1) / QUIZ_LENGTH) * 100}%` }}
              className="bg-blue-500 h-full"
            />
          </div>
          <div className="col-span-3 bg-gray-100 rounded-full overflow-hidden shadow-inner flex">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${studentProfile.confidenceScore}%` }}
              className="bg-emerald-400 h-full"
            />
          </div>
        </div>
      </div>

      {studentProfile.isSupportMode && !showResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-50 border-2 border-pink-100 p-4 rounded-2xl flex items-center gap-3 text-pink-700 shadow-sm"
        >
          <div className="bg-pink-200 p-2 rounded-full">
            <Heart size={20} className="fill-pink-500 text-pink-500" />
          </div>
          <div>
            <p className="font-bold text-sm">You're doing great!</p>
            <p className="text-xs opacity-80">Take your time. I've added a hint to help you out! ✨</p>
          </div>
        </motion.div>
      )}

      <motion.div 
        key={currentQuestion.id}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border-2 border-orange-50 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-6">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            currentQuestion.subject === 'Math' ? 'bg-blue-100 text-blue-600' :
            currentQuestion.subject === 'ELA' ? 'bg-purple-100 text-purple-600' :
            'bg-emerald-100 text-emerald-600'
          }`}>
            {currentQuestion.subject} • {currentQuestion.topic}
          </span>
          
          {currentQuestion.hint && !showHint && !showResult && (
            <button 
              onClick={() => setShowHint(true)}
              className="text-amber-500 flex items-center gap-1 text-xs font-bold hover:text-amber-600"
            >
              <Lightbulb size={14} /> Need a hint?
            </button>
          )}
        </div>

        {currentQuestion.passage && (
          <div className="bg-blue-50/50 p-5 rounded-2xl mb-6 text-sm italic border-l-4 border-blue-400 leading-relaxed text-gray-700">
            {currentQuestion.passage}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
          {currentQuestion.text}
        </h2>

        {showHint && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-amber-50 p-4 rounded-2xl mb-6 border-l-4 border-amber-400 text-sm text-amber-800 font-medium"
          >
            💡 <strong>Hint:</strong> {currentQuestion.hint}
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button 
              key={option}
              disabled={!!selectedOption}
              onClick={() => handleAnswer(option)}
              className={`p-5 rounded-2xl text-left font-bold border-2 transition-all transform active:scale-[0.98] ${
                selectedOption === option 
                  ? (option === currentQuestion.correctAnswer ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-red-100 border-red-500 text-red-700')
                  : (selectedOption && option === currentQuestion.correctAnswer ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md')
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {showResult && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className={`p-6 rounded-3xl font-bold text-center shadow-lg ${selectedOption === currentQuestion.correctAnswer ? 'text-emerald-700 bg-emerald-50 border-2 border-emerald-100' : 'text-red-700 bg-red-50 border-2 border-red-100'}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {selectedOption === currentQuestion.correctAnswer ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
              <span className="text-xl">{selectedOption === currentQuestion.correctAnswer ? 'Correct! +1 Star ⭐' : 'Not quite!'}</span>
            </div>
            <p className="text-sm font-medium opacity-90 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
          
          <button 
            onClick={handleNext}
            className="w-full bg-blue-500 text-white py-5 rounded-2xl text-xl font-bold shadow-xl hover:bg-blue-600 transition-all transform active:translate-y-1"
          >
            {questionsAnswered + 1 === QUIZ_LENGTH ? 'Finish Quiz' : 'Next Question'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
