import { GoogleGenAI, PersonGeneration } from "@google/genai";

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

// Configuration for Imagen model
export const IMAGEN_CONFIG = {
  model: "imagen-4.0-generate-001",
  config: {
    numberOfImages: 1,
    aspectRatio: "1:1" as const,
    personGeneration: PersonGeneration.ALLOW_ALL, // Allow generation of children for storybook
    sampleImageSize: "1K" as const,
  },
} as const;

// Check if Imagen should be used based on environment variable
export const shouldUseImagen = (): boolean => {
  return process.env.ENABLE_IMAGE_GENERATION_WITH_IMAGEN === "true";
};
