
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  BarChart2, 
  User, 
  Search, 
  Settings, 
  LayoutDashboard, 
  Trophy, 
  LogOut,
  Zap,
  Users
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CareerGuide from './pages/CareerGuide';
import SkillAssessment from './pages/SkillAssessment';
import Profile from './pages/Profile';
import { Student, Badge, Certificate, LearningPath } from './types';

const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Alex Thompson',
    bio: 'Data Science Enthusiast • Pro Learner',
    avatar: 'https://picsum.photos/seed/user1/200',
    progress: {
      completedModules: [],
      quizScores: {},
      totalLearningTime: 156.4,
      badges: [
        { id: '1', label: '14 Day Streak', icon: '🔥', color: 'bg-orange-100', dateEarned: '2024-03-01' }
      ],
      certificates: [
        { id: '1', title: 'Introduction to Excel', dateEarned: '2023-10-20', careerPath: 'Data Analyst' }
      ]
    }
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeStudentId, setActiveStudentId] = useState<string>(INITIAL_STUDENTS[0].id);
  const [preSelectedCareer, setPreSelectedCareer] = useState<string | null>(null);

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  const updateActiveStudent = (updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === activeStudentId ? { ...s, ...updates } : s));
  };

  const updateProgress = (progressUpdate: Partial<typeof activeStudent.progress>) => {
    setStudents(prev => prev.map(s => 
      s.id === activeStudentId 
        ? { ...s, progress: { ...s.progress, ...progressUpdate } } 
        : s
    ));
  };

  const addBadge = (badge: Badge) => {
    const currentBadges = activeStudent.progress.badges;
    updateProgress({
      badges: [...currentBadges.filter(b => b.id !== badge.id), badge]
    });
  };

  const addCertificate = (cert: Certificate) => {
    const currentCerts = activeStudent.progress.certificates;
    updateProgress({
      certificates: [...currentCerts.filter(c => c.id !== cert.id), cert]
    });
  };

  const setActivePath = (path: LearningPath | null) => {
    updateProgress({ activePath: path || undefined });
  };

  const handleAddNewStudent = (name: string) => {
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name,
      bio: 'New Learner',
      avatar: `https://picsum.photos/seed/${Date.now()}/200`,
      progress: {
        completedModules: [],
        quizScores: {},
        totalLearningTime: 0,
        badges: [],
        certificates: []
      }
    };
    setStudents(prev => [...prev, newStudent]);
    setActiveStudentId(newStudent.id);
    setActiveTab('profile');
  };

  const handleDeleteStudent = (id: string) => {
    if (students.length <= 1) {
      alert("Cannot delete the only student profile.");
      return;
    }
    const newStudents = students.filter(s => s.id !== id);
    setStudents(newStudents);
    if (activeStudentId === id) {
      setActiveStudentId(newStudents[0].id);
    }
  };

  const handleNavigate = (tab: string, career?: string) => {
    if (career) {
      setPreSelectedCareer(career);
    } else if (tab !== 'guide') {
      setPreSelectedCareer(null);
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} userProgress={activeStudent.progress} studentName={activeStudent.name} />;
      case 'guide':
        return <CareerGuide 
          userProgress={activeStudent.progress} 
          onAwardCertificate={addCertificate} 
          onSetPath={setActivePath}
          preSelectedCareer={preSelectedCareer}
          onClearPreSelected={() => setPreSelectedCareer(null)}
        />;
      case 'assess':
        return <SkillAssessment onAwardBadge={addBadge} />;
      case 'profile':
        return <Profile 
          student={activeStudent}
          allStudents={students}
          onUpdateStudent={updateActiveStudent}
          onSwitchStudent={setActiveStudentId}
          onAddStudent={handleAddNewStudent}
          onDeleteStudent={handleDeleteStudent}
          onNavigate={handleNavigate} 
        />;
      default:
        return <Dashboard onNavigate={handleNavigate} userProgress={activeStudent.progress} studentName={activeStudent.name} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg cursor-pointer" onClick={() => handleNavigate('dashboard')}>
            <Zap className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-800 cursor-pointer" onClick={() => handleNavigate('dashboard')}>EduGenius AI</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            expanded={isSidebarOpen} 
            onClick={() => handleNavigate('dashboard')} 
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Career Path" 
            active={activeTab === 'guide'} 
            expanded={isSidebarOpen} 
            onClick={() => handleNavigate('guide')} 
          />
          <NavItem 
            icon={<BarChart2 size={20} />} 
            label="Skill Assessment" 
            active={activeTab === 'assess'} 
            expanded={isSidebarOpen} 
            onClick={() => handleNavigate('assess')} 
          />
          <NavItem 
            icon={<User size={20} />} 
            label="My Profile" 
            active={activeTab === 'profile'} 
            expanded={isSidebarOpen} 
            onClick={() => handleNavigate('profile')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div 
            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all ${isSidebarOpen ? '' : 'justify-center'}`}
            onClick={() => handleNavigate('profile')}
          >
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
               <img src={activeStudent.avatar} alt="Current Student" className="w-full h-full object-cover" />
             </div>
             {isSidebarOpen && (
               <div className="overflow-hidden">
                 <p className="text-xs font-bold text-slate-800 truncate">{activeStudent.name}</p>
                 <p className="text-[10px] text-slate-400 truncate">Settings & Profile</p>
               </div>
             )}
          </div>
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={false} 
            expanded={isSidebarOpen} 
            onClick={() => {}} 
          />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 text-slate-400">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search courses, mentors, topics..." 
              className="bg-transparent border-none outline-none text-sm w-64 text-slate-600 focus:ring-0"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-700 font-medium text-sm">
              <Trophy size={16} />
              <span>{1240 + (activeStudent.progress.badges.length * 100)} XP</span>
            </div>
            <button onClick={() => handleNavigate('profile')} className="transition-transform hover:scale-105 active:scale-95">
              <img 
                src={activeStudent.avatar} 
                className="w-8 h-8 rounded-full border border-slate-200" 
                alt="Avatar" 
              />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, expanded, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
    }`}
  >
    <span className="shrink-0">{icon}</span>
    {expanded && <span className="font-medium whitespace-nowrap">{label}</span>}
  </button>
);

export default App;
