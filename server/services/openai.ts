import OpenAI from "openai";
import { Survey, Response } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

const AI_MENTORS = {
  MarcusAI: {
    name: "Marcus Aurelius",
    specialty: "Stoic wisdom & leadership insights",
    personality: "Philosophical, reflective, focused on virtue and duty"
  },
  MayaAI: {
    name: "Maya Angelou", 
    specialty: "Emotional intelligence & empathy",
    personality: "Compassionate, wise, focused on human connection and growth"
  },
  SteveAI: {
    name: "Steve Jobs",
    specialty: "Innovation & perfectionism", 
    personality: "Direct, perfectionist, focused on excellence and innovation"
  },
  KobeAI: {
    name: "Kobe Bryant",
    specialty: "Mamba mentality & excellence",
    personality: "Competitive, disciplined, focused on continuous improvement"
  },
  MandelaAI: {
    name: "Nelson Mandela",
    specialty: "Reconciliation & moral courage",
    personality: "Patient, forgiving, focused on unity and moral leadership"
  },
  KobunAI: {
    name: "Kobun Chino",
    specialty: "Zen wisdom & mindfulness",
    personality: "Mindful, present, focused on awareness and simplicity"
  }
};

export async function generateReport(
  survey: Survey & { invitations: any[] },
  responses: Response[],
  userName: string
): Promise<any> {
  try {
    const mentor = AI_MENTORS[survey.aiMentor as keyof typeof AI_MENTORS];
    
    // Organize responses by question and calculate metrics
    const responseAnalysis = analyzeResponses(responses);
    
    // Generate personality analysis
    const personalityAnalysis = await generatePersonalityAnalysis(responseAnalysis, userName, mentor);
    
    // Generate strengths and blind spots
    const strengthsAndBlindSpots = await generateStrengthsAndBlindSpots(responseAnalysis, userName, mentor);
    
    // Generate mentor commentary
    const mentorCommentary = await generateMentorCommentary(responseAnalysis, userName, mentor);
    
    // Generate action steps
    const actionSteps = await generateActionSteps(responseAnalysis, userName, mentor);
    
    return {
      personality: personalityAnalysis,
      strengths: strengthsAndBlindSpots.strengths,
      blindSpots: strengthsAndBlindSpots.blindSpots,
      mentorCommentary,
      actionSteps,
      metadata: {
        totalResponses: survey.invitations.filter(inv => inv.status === "completed").length,
        focusAreas: survey.focusAreas,
        mentor: mentor.name,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate AI report: " + (error as Error).message);
  }
}

function analyzeResponses(responses: Response[]) {
  const questionGroups: Record<string, any[]> = {};
  
  responses.forEach(response => {
    if (!questionGroups[response.questionId]) {
      questionGroups[response.questionId] = [];
    }
    questionGroups[response.questionId].push(response.answer);
  });
  
  return questionGroups;
}

async function generatePersonalityAnalysis(
  responseAnalysis: Record<string, any[]>,
  userName: string,
  mentor: any
): Promise<any> {
  const prompt = `As ${mentor.name}, analyze the 360-degree feedback for ${userName} and provide a personality assessment. 

  Feedback data: ${JSON.stringify(responseAnalysis)}
  
  Based on the feedback patterns, provide a JSON response with:
  {
    "mbtiInference": "XXXX",
    "mbtiDescription": "Brief description",
    "coreArchetype": "The [Role] [Type]", 
    "archetypeDescription": "Brief description",
    "keyTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
    "personalitySummary": "2-3 sentence summary of personality"
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      {
        role: "system",
        content: `You are ${mentor.name}. ${mentor.personality}. Analyze feedback with your unique perspective and wisdom.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

async function generateStrengthsAndBlindSpots(
  responseAnalysis: Record<string, any[]>,
  userName: string, 
  mentor: any
): Promise<any> {
  const prompt = `As ${mentor.name}, identify ${userName}'s key strengths and blind spots from this 360-degree feedback.

  Feedback data: ${JSON.stringify(responseAnalysis)}
  
  Provide a JSON response with:
  {
    "strengths": [
      {
        "title": "Strength Name",
        "description": "How this strength manifests",
        "frequency": "Mentioned by X/Y respondents"
      }
    ],
    "blindSpots": [
      {
        "title": "Blind Spot Name", 
        "description": "How this shows up",
        "frequency": "Noted by X/Y respondents"
      }
    ]
  }
  
  Provide 3-4 strengths and 2-3 blind spots based on the feedback patterns.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      {
        role: "system", 
        content: `You are ${mentor.name}. ${mentor.personality}. Focus on actionable insights.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

async function generateMentorCommentary(
  responseAnalysis: Record<string, any[]>,
  userName: string,
  mentor: any
): Promise<string> {
  const prompt = `As ${mentor.name}, provide a thoughtful, personalized commentary on ${userName}'s 360-degree feedback. 

  Feedback data: ${JSON.stringify(responseAnalysis)}
  
  Write 2-3 sentences in your voice and style, offering wisdom and perspective that only you could provide. Make it personal and actionable.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      {
        role: "system",
        content: `You are ${mentor.name}. ${mentor.personality}. Speak in your authentic voice with your characteristic wisdom and perspective.`
      },
      {
        role: "user", 
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content || "";
}

async function generateActionSteps(
  responseAnalysis: Record<string, any[]>,
  userName: string,
  mentor: any
): Promise<any> {
  const prompt = `As ${mentor.name}, create a practical growth roadmap for ${userName} based on this feedback.

  Feedback data: ${JSON.stringify(responseAnalysis)}
  
  Provide a JSON response with:
  {
    "thisWeek": [
      "Specific action item",
      "Another specific action"
    ],
    "thisMonth": [
      "Medium-term goal",
      "Another monthly goal"
    ],
    "nextQuarter": [
      "Long-term development area",
      "Strategic improvement"
    ]
  }
  
  Focus on 3-4 actionable items per timeframe, specific to the feedback patterns.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      {
        role: "system",
        content: `You are ${mentor.name}. ${mentor.personality}. Provide practical, actionable advice in your style.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}
