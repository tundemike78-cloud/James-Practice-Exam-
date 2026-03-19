import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Lesson, Subject } from '../types';

interface LessonViewProps {
  selectedLesson: Lesson;
  selectedSubject: Subject | null;
  onBack: () => void;
  onComplete: (lessonId: string) => void;
  onAddStar: () => void;
}

export const LessonView = ({ 
  selectedLesson, 
  selectedSubject, 
  onBack, 
  onComplete, 
  onAddStar 
}: LessonViewProps) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(-1); // -1 means showing lesson content
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleNext = () => {
    if (currentQuestionIdx < selectedLesson.practiceQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      onComplete(selectedLesson.id);
      onBack();
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === selectedLesson.practiceQuestions[currentQuestionIdx].correctAnswer) {
      onAddStar();
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold">
        <ArrowLeft size={20} /> Back to {selectedSubject}
      </button>

      {currentQuestionIdx === -1 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-blue-500 text-white p-8 rounded-3xl shadow-xl">
            <h1 className="text-3xl font-bold mb-4">{selectedLesson.title}</h1>
            <p className="text-lg leading-relaxed">{selectedLesson.explanation}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-blue-100">
            <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <HelpCircle /> Let's see an example:
            </h2>
            <div className="bg-gray-50 p-4 rounded-2xl mb-4 italic">
              "{selectedLesson.example.question}"
            </div>
            <div className="space-y-2">
              <p className="font-bold text-emerald-600">Answer: {selectedLesson.example.answer}</p>
              <p className="text-gray-600">{selectedLesson.example.explanation}</p>
            </div>
          </div>

          <button 
            onClick={() => setCurrentQuestionIdx(0)}
            className="w-full bg-blue-500 text-white py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-blue-600 transition-colors"
          >
            Start Practice! 🚀
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key={currentQuestionIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center text-sm font-bold text-gray-400">
            <span>Practice Question {currentQuestionIdx + 1} of {selectedLesson.practiceQuestions.length}</span>
            <div className="flex gap-1">
              {selectedLesson.practiceQuestions.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= currentQuestionIdx ? 'bg-blue-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-blue-50">
            {selectedLesson.practiceQuestions[currentQuestionIdx].passage && (
              <div className="bg-gray-50 p-4 rounded-2xl mb-6 text-sm italic border-l-4 border-blue-500">
                {selectedLesson.practiceQuestions[currentQuestionIdx].passage}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              {selectedLesson.practiceQuestions[currentQuestionIdx].text}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {selectedLesson.practiceQuestions[currentQuestionIdx].options.map(option => (
                <button 
                  key={option}
                  disabled={!!selectedOption}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 rounded-2xl text-left font-bold border-2 transition-all ${
                    selectedOption === option 
                      ? (option === selectedLesson.practiceQuestions[currentQuestionIdx].correctAnswer ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-red-100 border-red-500 text-red-700')
                      : (selectedOption && option === selectedLesson.practiceQuestions[currentQuestionIdx].correctAnswer ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white border-gray-100 hover:border-blue-200')
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl shadow-md ${
                selectedOption === selectedLesson.practiceQuestions[currentQuestionIdx].correctAnswer 
                  ? 'bg-emerald-50 border-2 border-emerald-100' 
                  : 'bg-red-50 border-2 border-red-100'
              }`}
            >
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                {selectedOption === selectedLesson.practiceQuestions[currentQuestionIdx].correctAnswer 
                  ? <><CheckCircle2 className="text-emerald-500" /> Great job!</>
                  : <><XCircle className="text-red-500" /> Not quite, but good try!</>}
              </h3>
              <p className="text-gray-700">{selectedLesson.practiceQuestions[currentQuestionIdx].explanation}</p>
              <button 
                onClick={handleNext}
                className="mt-4 w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600"
              >
                {currentQuestionIdx === selectedLesson.practiceQuestions.length - 1 ? 'Finish Lesson!' : 'Next Question'}
              </button>
            </motion.div>
          )}

          {!showExplanation && selectedLesson.practiceQuestions[currentQuestionIdx].hint && (
            <div className="text-center">
              <button 
                onClick={() => setShowHint(!showHint)}
                className="text-blue-500 font-bold flex items-center gap-2 mx-auto"
              >
                <HelpCircle size={18} /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
              {showHint && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-gray-500 italic"
                >
                  {selectedLesson.practiceQuestions[currentQuestionIdx].hint}
                </motion.p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
