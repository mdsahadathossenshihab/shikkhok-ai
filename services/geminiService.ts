
import { GoogleGenAI, Chat, GenerateContentResponse, Content, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { UserProfile, ChatMessage, RoutineActivity } from "../types";

// Ensure API Key is present
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const createTutorChat = (user: UserProfile, historyMessages: ChatMessage[] = []): Chat => {
  const systemInstruction = `
    You are a friendly, accurate, and knowledgeable Bengali private tutor named "Shikkhok AI" (শিক্ষক এআই).
    
    Current Student Profile:
    - Name: ${user.name}
    - Class: ${user.classLevel}
    - Group: ${user.group}
    - Subject currently studying: ${user.subject?.name}
    ${user.chapter ? `- Specific Chapter/Topic: ${user.chapter}` : ''}
    
    Guidelines:
    1. **ACCURACY IS PARAMOUNT:** If you are not 100% sure about a fact (especially in Science/Math/History), explicitly state that you are unsure or verify it. Do not hallucinate facts.
    2. **LANGUAGE:** Always reply in Bengali (Bangla). You can use English terms in brackets where necessary for clarity (e.g., "কোষ (Cell)").
    3. **LEVEL:** Adjust your complexity based on the class level (${user.classLevel}). For Class 6-8 keep it simple. For 11-12 be more detailed.
    4. **MATH FORMATTING:** 
       - YOU MUST use LaTeX formatting for ALL mathematical expressions.
       - Inline: $a^2 + b^2 = c^2$
       - Block: $$ x = \frac{-b \pm \sqrt{b^2-4ac}}{2a} $$
       - Do NOT use plain text *, /, ^ if a LaTeX alternative exists.
    5. **CALCULATION:** If the student asks for a calculation (Matrix, Vector, etc.), you can solve it step-by-step.
    6. **IMAGES:** If the student sends an image, analyze it carefully. If the image is unclear, ask for a better one.
    7. **SAFETY:** If a topic is sensitive but educational (e.g. reproductive health in Biology, war history), EXPLAIN it in an academic, neutral tone. Do not block it.
    
    Goal: Help the student understand the topic thoroughly using clear, textbook-quality explanations.
  `;

  // Convert stored ChatMessage[] to Gemini Content[] format for history
  const formattedHistory: Content[] = historyMessages
    .filter(msg => !msg.isError) // Remove error messages from context
    .map(msg => {
        const parts: any[] = [{ text: msg.text }];
        
        // If message has image, add it to parts
        if (msg.image) {
            try {
                const [meta, data] = msg.image.split(',');
                const mimeType = meta.split(':')[1].split(';')[0];
                parts.push({
                    inlineData: {
                        mimeType: mimeType,
                        data: data
                    }
                });
            } catch (e) {
                console.error("Error parsing image for history", e);
            }
        }

        return {
            role: msg.role,
            parts: parts
        };
    });

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    history: formattedHistory,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.4, // Lower temperature for more accurate/factual responses
      safetySettings: [
        // Significantly relaxed safety settings for educational context to prevent false positives on biology/history topics
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    },
  });
};

export const sendMessageStream = async (
  chat: Chat, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: string | any
): Promise<AsyncIterable<GenerateContentResponse>> => {
  try {
    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// --- ROUTINE GENERATION ---

export interface RoutineInputs {
    wakeTime: string;
    sleepTime: string;
    isSchoolOpen: boolean;
    schoolStart: string;
    schoolEnd: string;
    coaching: string;
    selectedSubjects: string[];
    routineGoal: string;
}

export const generateStudentRoutine = async (
    user: UserProfile, 
    inputs: RoutineInputs
): Promise<RoutineActivity[]> => {
    
    const schoolSchedule = inputs.isSchoolOpen 
        ? `School/College Time: ${inputs.schoolStart} to ${inputs.schoolEnd}` 
        : `NO SCHOOL TODAY (Full day available for study)`;

    const prompt = `
        Create a highly optimized daily routine (JSON format) for a student in ${user.classLevel} (Group: ${user.group}).
        
        Context:
        1. Wake Up: ${inputs.wakeTime}
        2. Sleep: ${inputs.sleepTime}
        3. ${schoolSchedule}
        4. Private/Coaching: ${inputs.coaching || "None"}
        5. Priority Subjects (Weak): ${inputs.selectedSubjects.length > 0 ? inputs.selectedSubjects.join(", ") : "General Subjects"}
        6. Routine Goal: ${inputs.routineGoal}
        
        Requirements:
        - Since the goal is "${inputs.routineGoal}", prioritize activities that align with this.
        - Include 5 prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) naturally fitted into breaks.
        - Use Pomodoro style breaks for study sessions.
        - Output MUST be a valid JSON Array.
        - Language: Bengali (Bangla).
        - 'type' must be one of: 'study', 'school', 'break', 'sleep', 'prayer'.
        
        JSON Structure:
        [
            { "time": "6:00 AM - 6:30 AM", "activity": "ফজর ও নাস্তা", "type": "prayer" },
            ...
        ]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7
            }
        });
        
        if (response.text) {
            return JSON.parse(response.text) as RoutineActivity[];
        }
        throw new Error("Empty response");
    } catch (error) {
        console.error("Routine Generation Error:", error);
        throw error;
    }
};
