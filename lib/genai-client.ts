import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Get the Gemini model for text generation
export const getTextModel = () => {
  return genAI.models;
};

// Configuration for story generation
export const STORY_CONFIG = {
  model: "gemini-2.0-flash-001",
  generationConfig: {
    maxOutputTokens: 2000,
    temperature: 0.8,
    topP: 0.9,
    topK: 40,
  },
} as const;

// Configuration for image generation (using Gemini 2.5 Flash Image Preview - "nano banana")
export const IMAGE_CONFIG = {
  model: "gemini-2.5-flash-image-preview",
  generationConfig: {
    maxOutputTokens: 2000,
    temperature: 0.8,
    topP: 0.9,
    topK: 40,
  },
} as const;
