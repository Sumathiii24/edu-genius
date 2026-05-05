
import React, { useState } from 'react';
import { 
  Award, Clock, Star, Book, ChevronRight, Share2, Download, 
  Check, ShieldCheck, Search, X, AlertCircle, Loader2, Edit3, 
  Plus, Users, Save, Trash2, GraduationCap, UserPlus, RefreshCw,
  Cpu, Code, BarChart3, Globe, Sparkles, MapPin, ExternalLink,
  // Fix: Added missing Zap icon import
  Zap
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Student, Certificate, Badge } from '../types';

const skillData = [
  { subject: 'Analysis', A: 120, fullMark: 150 },
  { subject: 'Coding', A: 98, fullMark: 150 },
  { subject: 'Visuals', A: 86, fullMark: 150 },
  { subject: 'Stats', A: 99, fullMark: 150 },
  { subject: 'Logic', A: 85, fullMark: 150 },
  { subject: 'Writing', A: 65, fullMark: 150 },
];

const CAREER_BLUEPRINTS = [
  { name: 'Data Analyst', icon: <BarChart3 className="text-emerald-500" />, desc: 'Master SQL, Python & Visualization' },
  { name: 'AI Engineer', icon: <Cpu className="text-indigo-500" />, desc: 'Deep Learning & Neural Networks' },
  { name: 'Frontend Dev', icon: <Code className="text-blue-500" />, desc: 'React, Design Systems & UX' },
  { name: 'Web3 Expert', icon: <Globe className="text-amber-500" />, desc: 'Solidity & Decentralized Apps' },
];

interface ProfileProps {
  student: Student;
  allStudents: Student[];
  onUpdateStudent: (updates: Partial<Student>) => void;
  onSwitchStudent: (id: string) => void;
  onAddStudent: (name: string) => void;
  onDeleteStudent: (id: string) => void;
  onNavigate: (tab: string, career?: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  student, 
  allStudents, 
  onUpdateStudent, 
  onSwitchStudent, 
  onAddStudent, 
  onDeleteStudent,
  onNavigate 
}) => {
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSwitchModalOpen, setSwitchModalOpen] = useState(false);
  
  const [editName, setEditName] = useState(student.name);
  const [editBio, setEditBio] = useState(student.bio);
  const [editAvatar, setEditAvatar] = useState(student.avatar);
  const [newStudentName, setNewStudentName] = useState('');

  const [verifyId, setVerifyId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<Certificate | 'invalid' | null>(null);

  const handleUpdate = () => {
    if (editName.trim()) {
      onUpdateStudent({ name: editName, bio: editBio, avatar: editAvatar });
      setEditModalOpen(false);
      triggerToast("Profile updated successfully!");
    }
  };

  const handleRefreshAvatar = () => {
    const newSeed = Math.floor(Math.random() * 10000);
    setEditAvatar(`https://picsum.photos/seed/${newSeed}/200`);
  };

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
      setSwitchModalOpen(false);
      triggerToast("New student profile created!");
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this student profile? This cannot be undone.")) {
      onDeleteStudent(id);
      triggerToast("Student profile deleted.");
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const runVerification = () => {
    if (!verifyId.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      const found = student.progress.certificates.find(c => c.id === verifyId.trim());
      setVerificationResult(found || 'invalid');
      setIsVerifying(false);
    }, 1500);
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `${student.name} - EduGenius AI Profile`,
      text: `Check out my learning achievements on EduGenius AI!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
    } else {
      await navigator.clipboard.writeText(shareData.url);
      triggerToast("Profile link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative pb-12">
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <Check size={18} className="text-emerald-400" />
            <span className="text-sm font-medium">{showToast}</span>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Edit Student Details</h3>
                <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
             </div>
             <div className="space-y-5">
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div className="relative">
                    <img src={editAvatar} className="w-20 h-20 rounded-2xl border-2 border-slate-100 shadow-sm" alt="Edit Preview" />
                    <button 
                      onClick={handleRefreshAvatar}
                      className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg border-2 border-white hover:scale-110 transition-transform"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Change Avatar</span>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                   <input 
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Short Professional Bio</label>
                   <textarea 
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium" 
                   />
                </div>
                <button 
                  onClick={handleUpdate}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all"
                >
                  <Save size={18} />
                  Update Profile
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Enhanced Switch/Add Student Modal */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Select Learner Profile</h3>
                    <p className="text-slate-500 text-sm font-medium">Continue your journey where you left off</p>
                  </div>
                </div>
                <button onClick={() => setSwitchModalOpen(false)} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all hover:rotate-90"><X size={22}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {allStudents.map(s => (
                    <div key={s.id} className="relative group">
                      <button 
                        onClick={() => { onSwitchStudent(s.id); setSwitchModalOpen(false); }}
                        className={`w-full flex items-start gap-4 p-5 rounded-3xl border transition-all text-left ${
                          s.id === student.id 
                            ? 'border-indigo-600 bg-indigo-50/60 ring-4 ring-indigo-50 shadow-inner' 
                            : 'border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-xl hover:shadow-slate-100 bg-slate-50/50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img 
                            src={s.avatar} 
                            className={`w-20 h-20 rounded-2xl border-4 shadow-md transition-all object-cover ${
                              s.id === student.id ? 'border-indigo-500 ring-2 ring-white scale-105' : 'border-white'
                            }`} 
                            alt={s.name}
                          />
                          {s.id === student.id && (
                            <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg border-4 border-white">
                              <Check size={14} strokeWidth={4} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                           <div className="flex items-center gap-2 mb-1">
                             <p className={`text-lg font-bold truncate leading-none ${s.id === student.id ? 'text-indigo-900' : 'text-slate-800'}`}>{s.name}</p>
                           </div>
                           <p className="text-xs text-slate-500 line-clamp-2 font-medium mb-3">{s.bio}</p>
                           <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-white/80 border border-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                                <Award size={10} className="text-amber-500" />
                                {s.progress.certificates.length} Certs
                              </div>
                              {s.progress.activePath && (
                                <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2 py-1 rounded-lg shadow-sm">
                                  <Zap size={10} fill="currentColor" />
                                  ACTIVE PATH
                                </div>
                              )}
                           </div>
                        </div>
                      </button>
                      
                      {s.id !== student.id && (
                        <button 
                          onClick={(e) => handleDelete(e, s.id)}
                          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20"
                          title="Delete Profile"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="pt-8 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-5 text-slate-500">
                  <UserPlus size={20} className="text-indigo-600" />
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-800">Enroll New Learner</p>
                </div>
                <div className="flex gap-4">
                   <div className="relative flex-1">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                      placeholder="Enter full name for new profile..."
                      value={newStudentName}
                      onChange={e => setNewStudentName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-sm" 
                     />
                   </div>
                   <button 
                    onClick={handleAddStudent}
                    disabled={!newStudentName.trim()}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                   >
                     <Plus size={22} />
                     <span className="hidden sm:inline">Add Student</span>
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Verification Modal (Identical Logic) */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><ShieldCheck size={20} /></div>
                <h3 className="text-xl font-bold text-slate-800">Credential Verification</h3>
              </div>
              <button onClick={() => setVerifyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6">
              {!verificationResult && !isVerifying ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" value={verifyId} onChange={(e) => setVerifyId(e.target.value)}
                      placeholder="e.g. cert-171234567..."
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <button onClick={runVerification} disabled={!verifyId.trim()} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 disabled:opacity-50">Verify Identity</button>
                </div>
              ) : isVerifying ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-indigo-600" size={48} />
                  <p className="text-slate-500 font-medium">Validating on blockchain registry...</p>
                </div>
              ) : verificationResult === 'invalid' ? (
                <div className="py-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center"><AlertCircle size={32} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Certificate Not Found</h4>
                    <p className="text-slate-500 text-sm mt-1">Check the ID and try again. Ensure the certificate belongs to this student.</p>
                  </div>
                  <button onClick={() => setVerificationResult(null)} className="text-indigo-600 font-bold hover:underline">Try another ID</button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100"><Check size={24} /></div>
                    <div>
                      <h4 className="font-bold text-emerald-800">Authentic & Verified</h4>
                      <p className="text-emerald-600 text-xs">Credential ID: {verificationResult.id}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Recipient</span>
                      <span className="font-bold text-slate-800">{student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Course Path</span>
                      <span className="font-bold text-indigo-600">{verificationResult.careerPath}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Award Date</span>
                      <span className="font-bold text-slate-800">{verificationResult.dateEarned}</span>
                    </div>
                  </div>
                  <button onClick={() => setVerifyModalOpen(false)} className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all">Close Result</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
          <GraduationCap size={200} />
        </div>
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="relative group">
            <img 
              src={student.avatar} 
              className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-2xl object-cover ring-1 ring-slate-100" 
              alt="Profile" 
            />
            <button 
              onClick={() => {
                setEditName(student.name);
                setEditBio(student.bio);
                setEditAvatar(student.avatar);
                setEditModalOpen(true);
              }}
              className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl border-4 border-white hover:scale-110 active:scale-95 transition-all shadow-xl"
            >
              <Edit3 size={18} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{student.name}</h1>
              {student.progress.certificates.length > 0 && (
                <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-amber-200 uppercase tracking-tighter">Certified</div>
              )}
            </div>
            <p className="text-slate-500 font-medium text-lg mt-1 max-w-md">{student.bio}</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-xl">
                <Star size={16} className="text-indigo-600 fill-indigo-600" />
                <span className="text-xs font-bold text-indigo-700">Level {Math.floor(student.progress.badges.length * 2.5 + 5)}</span>
              </div>
              <button 
                onClick={() => setSwitchModalOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <Users size={14} />
                Switch Learner
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 relative z-10">
          <button 
            onClick={() => setVerifyModalOpen(true)} 
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-all font-bold text-sm shadow-sm group"
          >
            <ShieldCheck size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
            Verify ID
          </button>
          <button 
            onClick={handleShareProfile} 
            className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Share2 size={20} />
          </button>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            <Download size={20} />
            Export Portfolio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Blueprint Gallery */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Choose New Career Path</h3>
                <p className="text-slate-400 text-xs font-medium">Select a blueprint to instantly generate your journey.</p>
              </div>
              <Sparkles size={20} className="text-indigo-400 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAREER_BLUEPRINTS.map((bp) => (
                <button 
                  key={bp.name}
                  onClick={() => onNavigate('guide', bp.name)}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group text-left"
                >
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                    {bp.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{bp.name}</h4>
                    <p className="text-slate-500 text-[11px] mt-1">{bp.desc}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 mt-3 group-hover:translate-x-1 transition-transform">
                      START BLUEPRINT <ChevronRight size={12} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-8">Skill Competency Map</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name={student.name} dataKey="A" stroke="#4f46e5" strokeWidth={3} fill="#4f46e5" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Learning Credentials ({student.progress.certificates.length})</h3>
            <div className="space-y-4">
              {student.progress.certificates.map(cert => (
                <div key={cert.id} className="flex items-start gap-4 p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 group transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                    <Book size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 truncate leading-tight mb-1">{cert.title}</h4>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('guide', cert.careerPath); }} 
                        className="text-[10px] text-indigo-600 font-extrabold hover:underline flex items-center gap-1 uppercase tracking-tighter"
                      >
                        {cert.careerPath} <ExternalLink size={8} />
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Issued: {cert.dateEarned}</p>
                  </div>
                </div>
              ))}
              {student.progress.certificates.length === 0 && (
                <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-xs italic">Complete a career path to receive your first professional credential.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Achievement Badges ({student.progress.badges.length})</h3>
            <div className="grid grid-cols-3 gap-6">
              {student.progress.badges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center gap-2 group">
                  <div className={`w-14 h-14 ${badge.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{badge.label}</span>
                </div>
              ))}
              {student.progress.badges.length === 0 && <p className="text-slate-400 text-xs col-span-3 italic text-center">No badges yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
