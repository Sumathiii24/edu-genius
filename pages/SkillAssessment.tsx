
import React, { useState } from 'react';
import { Search, Loader2, Target, AlertTriangle, Zap, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { assessSkills, generateQuiz } from '../geminiService';
import { AssessmentResult, QuizQuestion, Badge } from '../types';

interface SkillAssessmentProps {
  onAwardBadge: (badge: Badge) => void;
}

const SkillAssessment: React.FC<SkillAssessmentProps> = ({ onAwardBadge }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizTopic, setQuizTopic] = useState('');
  const [showBadgeCelebration, setShowBadgeCelebration] = useState<Badge | null>(null);

  const handleAssess = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await assessSkills(query);
      setResult(res);
      setQuiz(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (topic: string) => {
    setQuizLoading(true);
    setQuizTopic(topic);
    try {
      const q = await generateQuiz(topic);
      setQuiz(q);
    } catch (e) {
      console.error(e);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    // In a real app, calculate score. Here we'll just award the badge for completion.
    const newBadge: Badge = {
      id: `badge-${quizTopic}-${Date.now()}`,
      label: `${quizTopic} Master`,
      icon: '🔍',
      color: 'bg-blue-100',
      dateEarned: new Date().toISOString().split('T')[0]
    };
    
    onAwardBadge(newBadge);
    setShowBadgeCelebration(newBadge);
    setQuiz(null);
    setTimeout(() => setShowBadgeCelebration(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {showBadgeCelebration && (
        <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-right-8 fade-in duration-500">
          <div className="bg-white border-4 border-indigo-400 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className={`w-12 h-12 ${showBadgeCelebration.color} rounded-xl flex items-center justify-center text-2xl`}>
              {showBadgeCelebration.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-lg">New Badge Earned!</h4>
              <p className="text-slate-500 text-sm">You are now a {showBadgeCelebration.label}</p>
            </div>
          </div>
        </div>
      )}

      <header>
        <h1 className="text-3xl font-bold text-slate-800">Personalized Assessment</h1>
        <p className="text-slate-500 mt-1">Discover your strengths and bridge your learning gaps with AI.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you want to learn or your current background..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <button 
          onClick={handleAssess}
          disabled={loading || !query}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" />
                Your Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.strengths.map((s, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-indigo-600 p-8 rounded-2xl shadow-lg shadow-indigo-100 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Target />
                Recommended Path
              </h3>
              <p className="text-indigo-100 leading-relaxed text-lg italic">
                "{result.recommendedStartingPoint}"
              </p>
              <button className="mt-6 w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Start This Journey
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <AlertTriangle className="text-amber-500" />
              Skill Gaps Detected
            </h3>
            <div className="space-y-4">
              {result.skillGaps.map((gap, i) => (
                <div key={i} className="group p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-all">
                  <div>
                    <p className="font-bold text-slate-700">{gap}</p>
                    <p className="text-xs text-slate-400">Target Proficiency: High</p>
                  </div>
                  <button 
                    onClick={() => handleStartQuiz(gap)}
                    className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Award size={14} />
                    Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {quizLoading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-90">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <div className="text-center">
              <h4 className="text-xl font-bold text-slate-800">Generating Adaptive Quiz...</h4>
              <p className="text-slate-500 text-sm">Our AI is hand-picking questions for your specific gaps.</p>
            </div>
          </div>
        </div>
      )}

      {quiz && (
        <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-xl max-w-3xl mx-auto animate-in fade-in slide-in-from-top-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Quick Skill Drill: {quizTopic}</h3>
            <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">5 Questions</div>
          </div>
          <div className="space-y-8">
            {quiz.map((q, idx) => (
              <div key={q.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 mb-4 text-lg">{idx + 1}. {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, i) => (
                    <button key={i} className="p-4 bg-white border border-slate-200 rounded-xl text-left text-sm hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                      <span className="w-6 h-6 inline-flex items-center justify-center rounded bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 font-bold text-[10px] mr-3">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button 
              onClick={handleSubmitQuiz}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all"
            >
              Submit and Claim Badge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAssessment;
