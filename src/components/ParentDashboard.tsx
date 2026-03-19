import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Target, AlertCircle, CheckCircle2, Award, Trophy } from 'lucide-react';
import { StudentProfile, Subject } from '../types';
import { CHILD_FRIENDLY_DIFFICULTY, getPromotionRecommendation } from '../services/adaptiveEngine';
import { Star } from 'lucide-react';

interface ParentDashboardProps {
  profile: StudentProfile;
  onBack: () => void;
}

export const ParentDashboard = ({ profile, onBack }: ParentDashboardProps) => {
  const subjects: Subject[] = ['Math', 'ELA', 'Science'];
  const promotionRec = getPromotionRecommendation(profile);

  return (
    <div className="p-6 space-y-8 pb-24 max-w-2xl mx-auto">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-md text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
      </header>

      {/* Promotion Recommendation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Award className="text-yellow-300" />
            Weekly Progress Report
          </h2>
          <p className="text-indigo-50 font-medium leading-relaxed">
            {promotionRec}
          </p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={120} />
        </div>
      </motion.section>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-3xl shadow-lg">
          <span className="text-xs font-bold uppercase opacity-80">Questions Done</span>
          <div className="text-3xl font-bold">{profile.totalQuestionsAnswered}</div>
        </div>
        <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-lg">
          <span className="text-xs font-bold uppercase opacity-80">Overall Accuracy</span>
          <div className="text-3xl font-bold">
            {profile.totalQuestionsAnswered > 0 
              ? Math.round((profile.correctAnswers / profile.totalQuestionsAnswered) * 100) 
              : 0}%
          </div>
        </div>
      </div>

      {/* Subject Levels */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-blue-500" />
          Current Levels
        </h2>
        <div className="space-y-3">
          {subjects.map(sub => (
            <div key={sub} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-700">{sub}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                sub === 'Math' ? 'bg-blue-100 text-blue-600' :
                sub === 'ELA' ? 'bg-purple-100 text-purple-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                {CHILD_FRIENDLY_DIFFICULTY[profile.currentDifficulty[sub]]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={20} />
            Strong Topics
          </h2>
          <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 min-h-[100px]">
            {profile.strongTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.strongTopics.map(topic => (
                  <span key={topic} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm border border-emerald-100">
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-emerald-400 text-sm italic">Keep practicing to find your strengths!</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-orange-600">
            <AlertCircle size={20} />
            Needs Practice
          </h2>
          <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100 min-h-[100px]">
            {profile.weakTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.weakTopics.map(topic => (
                  <span key={topic} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm border border-orange-100">
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-orange-400 text-sm italic">No weak areas identified yet. Great job!</p>
            )}
          </div>
        </section>
      </div>

      {/* Mastery Stars */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" />
          Topic Mastery
        </h2>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          {Object.keys(profile.masteryStars).length > 0 ? (
            Object.entries(profile.masteryStars).map(([topic, stars]) => (
              <div key={topic} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-gray-700">{topic}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic text-center">Complete quizzes to earn mastery stars!</p>
          )}
        </div>
      </section>

      {/* Recommended Plan */}
      <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-blue-50">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="text-blue-500" />
          Recommended Study Plan
        </h2>
        <div className="space-y-4">
          {profile.weakTopics.length > 0 ? (
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <Award size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-800">Focus on {profile.weakTopics[0]}</p>
                <p className="text-sm text-gray-500">Your child is struggling with this topic. Try a Focus Mode session together!</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <Award size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-800">Keep up the momentum!</p>
                <p className="text-sm text-gray-500">Your child is doing great. Encourage them to try a mixed subject quiz today.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
