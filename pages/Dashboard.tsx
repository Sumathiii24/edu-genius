
import React from 'react';
import { BookOpen, Target, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProgress } from '../types';

const data = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 4.1 },
  { name: 'Wed', hours: 3.2 },
  { name: 'Thu', hours: 1.8 },
  { name: 'Fri', hours: 5.6 },
  { name: 'Sat', hours: 2.3 },
  { name: 'Sun', hours: 0.5 },
];

interface DashboardProps {
  onNavigate: (tab: string) => void;
  userProgress: UserProgress;
  studentName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userProgress, studentName }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {studentName}! 👋</h1>
          <p className="text-slate-500 mt-1">You've earned {userProgress.badges.length} badges and {userProgress.certificates.length} certificates so far.</p>
        </div>
        <button 
          onClick={() => onNavigate('guide')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          <Sparkles size={18} />
          Continue Learning
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<BookOpen className="text-blue-600" />} 
          title="Learning Achievements" 
          value={String(userProgress.badges.length + userProgress.certificates.length)} 
          subtitle="Total awards" 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Target className="text-emerald-600" />} 
          title="Skill Points" 
          value={String(1240 + userProgress.badges.length * 100)} 
          subtitle="XP Gained" 
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<TrendingUp className="text-amber-600" />} 
          title="Study Hours" 
          value={String(userProgress.totalLearningTime)} 
          subtitle="Keep it up!" 
          color="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Learning Intensity (Past 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Your Current Path</h3>
            <button onClick={() => onNavigate('guide')} className="text-indigo-600 text-sm font-semibold flex items-center gap-1">
              {userProgress.activePath ? 'Change Path' : 'Select Path'} <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {userProgress.activePath ? (
              <>
                <PathStep active title={userProgress.activePath.modules[0].title} category={userProgress.activePath.careerGoal} progress={25} />
                <PathStep title={userProgress.activePath.modules[1]?.title || 'Upcoming Module'} category={userProgress.activePath.careerGoal} progress={0} />
              </>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">No active career path selected.</p>
                <button 
                  onClick={() => onNavigate('guide')}
                  className="mt-3 text-indigo-600 font-bold text-xs hover:underline"
                >
                  Choose Your Career Now
                </button>
              </div>
            )}
            
            <div className="mt-8 p-4 bg-indigo-600 rounded-xl text-white">
              <h4 className="font-bold text-sm mb-1 italic opacity-90">Ready for Assessment?</h4>
              <p className="text-xs mb-3 opacity-80">Test your latest skills to unlock a new badge.</p>
              <button 
                onClick={() => onNavigate('assess')}
                className="w-full bg-white text-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{icon: React.ReactNode, title: string, value: string, subtitle: string, color: string}> = ({ icon, title, value, subtitle, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-3xl font-bold text-slate-800">{value}</span>
      <span className="text-slate-400 text-xs font-medium">{subtitle}</span>
    </div>
  </div>
);

const PathStep: React.FC<{active?: boolean, title: string, category: string, progress: number}> = ({ active, title, category, progress }) => (
  <div className={`p-4 rounded-xl border ${active ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 bg-white'} flex items-center gap-4`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
      <BookOpen size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={`text-sm font-bold truncate ${active ? 'text-indigo-900' : 'text-slate-700'}`}>{title}</h4>
      <p className="text-xs text-slate-500">{category}</p>
      {active && (
        <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all" style={{width: `${progress}%`}}></div>
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;
