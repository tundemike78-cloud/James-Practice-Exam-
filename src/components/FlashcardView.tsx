import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardViewProps {
  flashcards: Flashcard[];
  onBack: () => void;
}

export const FlashcardView = ({ flashcards, onBack }: FlashcardViewProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((currentIdx + 1) % flashcards.length);
    }, 150);
  };

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="p-6 text-center space-y-6">
        <h1 className="text-2xl font-bold">No flashcards found!</h1>
        <button onClick={onBack} className="bg-blue-500 text-white px-6 py-2 rounded-full">Back Home</button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-24 flex flex-col items-center">
      <div className="w-full flex justify-between items-center">
        <button onClick={onBack} className="text-blue-600 font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Back
        </button>
        <span className="text-gray-400 font-bold">{currentIdx + 1} / {flashcards.length}</span>
      </div>

      <div className="perspective-1000 w-full max-w-sm h-96 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div 
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-full h-full preserve-3d"
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-4 border-blue-500 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
            <span className={`text-xs font-bold px-2 py-1 rounded-full mb-4 ${
              flashcards[currentIdx].subject === 'Math' ? 'bg-blue-100 text-blue-600' :
              flashcards[currentIdx].subject === 'ELA' ? 'bg-purple-100 text-purple-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {flashcards[currentIdx].subject}
            </span>
            <h2 className="text-3xl font-bold text-gray-800">{flashcards[currentIdx].front}</h2>
            <p className="mt-8 text-blue-400 text-sm font-bold animate-pulse">Tap to flip!</p>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-blue-500 border-4 border-blue-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center rotate-y-180">
            <h2 className="text-3xl font-bold text-white">{flashcards[currentIdx].back}</h2>
            <p className="mt-8 text-blue-200 text-sm font-bold">Tap to flip back</p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="flex-1 bg-white border-2 border-blue-500 text-blue-500 py-4 rounded-2xl font-bold shadow-md"
        >
          Skip
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="flex-1 bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-md"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
