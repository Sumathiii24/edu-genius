
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, CheckCircle, FileText, Calendar, Zap, MessageSquare, PartyPopper, RotateCcw, Award, ClipboardCheck, BookOpen } from 'lucide-react';
import { generateLearningPath } from '../geminiService';
import { LearningPath, UserProgress, Certificate } from '../types';

interface CareerGuideProps {
  userProgress: UserProgress;
  onAwardCertificate: (cert: Certificate) => void;
  onSetPath: (path: LearningPath | null) => void;
  preSelectedCareer?: string | null;
  onClearPreSelected?: () => void;
}

const CareerGuide: React.FC<CareerGuideProps> = ({ 
  userProgress, 
  onAwardCertificate, 
  onSetPath,
  preSelectedCareer,
  onClearPreSelected
}) => {
  const [career, setCareer] = useState('');
  const [experience, setExperience] = useState('');
  const [path, setPath] = useState<LearningPath | null>(userProgress.activePath || null);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [completedInSession, setCompletedInSession] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (path) {
      setSelectedModule(0);
    }
  }, [path]);

  // Handle pre-selected career from deep links (e.g., from Profile)
  useEffect(() => {
    if (preSelectedCareer && !path) {
      setCareer(preSelectedCareer);
      // Optional: Auto-trigger generation if we wanted to be very aggressive
      // handleGenerate(); 
    }
  }, [preSelectedCareer, path]);

  const handleGenerate = async () => {
    if (!career) return;
    setLoading(true);
    try {
      const generated = await generateLearningPath(career, experience || 'Beginner');
      setPath(generated);
      onSetPath(generated);
      if (onClearPreSelected) onClearPreSelected();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = () => {
    if (!path || selectedModule === null) return;
    
    const moduleId = path.modules[selectedModule].id;
    if (!completedInSession.includes(moduleId)) {
      setCompletedInSession([...completedInSession, moduleId]);
    }

    // Check if this was the last module
    if (selectedModule === path.modules.length - 1) {
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        title: `${path.careerGoal} Mastery Certification`,
        dateEarned: new Date().toISOString().split('T')[0],
        careerPath: path.careerGoal
      };
      onAwardCertificate(newCert);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    } else {
      setSelectedModule(selectedModule + 1);
    }
  };

  const handleChangePath = () => {
    const confirmChange = window.confirm("Are you sure you want to change your career path? Your current progress will be reset.");
    if (confirmChange) {
      setPath(null);
      onSetPath(null);
      setCareer('');
      setExperience('');
      setCompletedInSession([]);
      if (onClearPreSelected) onClearPreSelected();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
          <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl border-4 border-indigo-400 flex flex-col items-center animate-bounce">
            <PartyPopper size={64} className="text-indigo-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 text-center">Journey Complete!</h2>
            <p className="text-slate-600 font-medium mt-2 text-center">New Mastery Certificate added to your profile.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">AI Career Architect</h1>
          <p className="text-slate-500 mt-1">Design your career path. Step-by-step guidance from entry to mastery.</p>
        </div>
        {path && (
          <button 
            onClick={handleChangePath}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-100 transition-all font-bold text-sm shadow-sm"
          >
            <RotateCcw size={16} />
            Reset Journey
          </button>
        )}
      </div>

      {!path ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
          <div className="space-y-6">
            <div className="text-center mb-4">
               <h3 className="text-xl font-bold text-slate-800">What is your dream career?</h3>
               <p className="text-slate-500 text-sm">Our AI will evaluate your goals and build a custom step-by-step guide.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Career</label>
              <input 
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                placeholder="e.g. Data Analyst, UI/UX Designer, Blockchain Engineer..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Context / Skills</label>
              <textarea 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. I have 2 years of experience in Marketing. I want to transition into data analysis using Python..."
                rows={3}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading || !career}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              Generate Personalized Path
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step-by-Step Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Zap className="text-indigo-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{path.careerGoal}</h3>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{path.difficulty} • {path.duration}</p>
                </div>
              </div>
              
              <div className="relative space-y-6">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-100"></div>
                {path.modules.map((m, idx) => (
                  <button 
                    key={m.id} 
                    onClick={() => setSelectedModule(idx)}
                    className={`relative w-full flex items-center gap-4 text-left transition-all group ${selectedModule === idx ? 'scale-102' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-colors ${
                      completedInSession.includes(m.id) 
                        ? 'bg-emerald-500 text-white border-emerald-100' 
                        : selectedModule === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {completedInSession.includes(m.id) ? <CheckCircle size={20} /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xs font-bold ${selectedModule === idx ? 'text-indigo-600 font-extrabold' : 'text-slate-600'}`}>{m.title}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <FileText size={10} className="text-slate-400" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Skill Evaluation Ready</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">Progress</span>
                  <span className="text-xs font-bold text-indigo-600">{Math.round((completedInSession.length / path.modules.length) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000" 
                    style={{width: `${(completedInSession.length / path.modules.length) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Module Content & Evaluations */}
          <div className="lg:col-span-8 space-y-6">
            {selectedModule !== null && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BookOpen size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-indigo-100 uppercase tracking-widest text-[10px] font-bold">
                      <Calendar size={12} />
                      <span>Stage {selectedModule + 1} of {path.modules.length}</span>
                    </div>
                    <h2 className="text-3xl font-bold">{path.modules[selectedModule].title}</h2>
                    <p className="mt-3 text-indigo-100/90 leading-relaxed max-w-2xl text-base">{path.modules[selectedModule].description}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Topics Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                        <CheckCircle className="text-emerald-500" size={20} />
                        Detailed Topics
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">GUIDED CONTENT</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {path.modules[selectedModule].topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-slate-700 text-sm font-medium border border-slate-100 hover:border-indigo-100 transition-all group">
                          <div className="w-2 h-2 rounded-full bg-indigo-300 group-hover:bg-indigo-500"></div>
                          {topic}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Skills Evaluation Section */}
                  <section className="p-8 bg-amber-50 rounded-3xl border border-amber-200 shadow-inner">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-amber-900 flex items-center gap-2 text-lg">
                        <ClipboardCheck size={22} className="text-amber-600" />
                        Evaluating Learning Skill
                      </h3>
                      <div className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-tight">
                        Required Assignment
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-amber-900 font-extrabold text-base mb-2 underline decoration-amber-300 decoration-2 underline-offset-4">
                          {path.modules[selectedModule].weeklyAssignment.title}
                        </p>
                        <p className="text-amber-800 text-sm leading-relaxed bg-white/50 p-4 rounded-xl border border-amber-100">
                          {path.modules[selectedModule].weeklyAssignment.description}
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3 pt-2">
                        <button className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-200">
                          <FileText size={18} />
                          Upload Solution
                        </button>
                        <button className="flex-1 bg-white text-amber-700 border border-amber-200 px-6 py-3 rounded-xl text-sm font-bold hover:bg-amber-50 transition-all flex items-center justify-center gap-2">
                          <Award size={18} />
                          Review Evaluation Rubric
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Navigation / Completion */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all text-sm font-bold group">
                      <MessageSquare size={18} className="group-hover:scale-110" />
                      Ask AI Mentor for clarification
                    </button>
                    <button 
                      onClick={handleCompleteModule}
                      className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-indigo-100"
                    >
                      {selectedModule === path.modules.length - 1 ? (
                        <>
                          <Award size={20} />
                          Complete Course & Get Certificate
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerGuide;
