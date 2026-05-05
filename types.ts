
export interface LearningPath {
  careerGoal: string;
  duration: string;
  difficulty: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: string[];
  weeklyAssignment: {
    title: string;
    description: string;
  };
}

export interface AssessmentResult {
  skillGaps: string[];
  recommendedStartingPoint: string;
  strengths: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
  dateEarned: string;
}

export interface Certificate {
  id: string;
  title: string;
  dateEarned: string;
  careerPath: string;
}

export interface UserProgress {
  completedModules: string[];
  quizScores: Record<string, number>;
  totalLearningTime: number;
  badges: Badge[];
  certificates: Certificate[];
  activePath?: LearningPath;
}

export interface Student {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  progress: UserProgress;
}
