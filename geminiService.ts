
import { GoogleGenAI, Type } from "@google/genai";
import { LearningPath, AssessmentResult, QuizQuestion } from "./types";

// Always use process.env.API_KEY directly when initializing the GoogleGenAI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLearningPath = async (careerGoal: string, currentSkills: string): Promise<LearningPath> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a detailed, step-by-step learning path for someone wanting to become a ${careerGoal}. 
    Current skill level: ${currentSkills}. 
    Provide modules with weekly assignments and clear descriptions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          careerGoal: { type: Type.STRING },
          duration: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                weeklyAssignment: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              },
              required: ["id", "title", "description", "topics", "weeklyAssignment"]
            }
          }
        },
        required: ["careerGoal", "duration", "difficulty", "modules"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as LearningPath;
};

export const assessSkills = async (input: string): Promise<AssessmentResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following learning goals and skills to identify gaps and strengths: "${input}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skillGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedStartingPoint: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["skillGaps", "recommendedStartingPoint", "strengths"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AssessmentResult;
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 challenging multiple-choice questions for the topic: ${topic}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of correct option (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as QuizQuestion[];
};
