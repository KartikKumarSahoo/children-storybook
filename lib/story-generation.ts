import { StoryFormData } from "@/components/StoryForm";
import { getTextModel, IMAGE_CONFIG } from "./genai-client";

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
  characterDescription: string;
}

export function createStoryPrompt(formData: StoryFormData): string {
  const {
    childName,
    childAge,
    pronoun,
    traits,
    interests,
    physicalTraits,
    storyTheme,
    storyLength,
  } = formData;

  const pageCount = storyLength === "short" ? 8 : 12;
  const traitsList = traits.length > 0 ? traits.join(", ") : "curious and kind";
  const interestsList =
    interests.length > 0
      ? interests.join(", ")
      : "adventures and making friends";

  const physicalDesc = [
    physicalTraits.hairColor && `${physicalTraits.hairColor} hair`,
    physicalTraits.eyeColor && `${physicalTraits.eyeColor} eyes`,
    physicalTraits.favoriteColor &&
      `loves the color ${physicalTraits.favoriteColor}`,
  ]
    .filter(Boolean)
    .join(", ");

  return `Create a personalized children's storybook for ${childName}, a ${childAge}-year-old child who is ${traitsList} and loves ${interestsList}. ${childName} uses ${pronoun} pronouns. ${
    physicalDesc ? `${childName} has ${physicalDesc}.` : ""
  }

STORY REQUIREMENTS:
- Theme: ${storyTheme}
- Length: ${pageCount} pages
- Age-appropriate for ${childAge} years old
- ${childName} should be the main character and hero of the story
- Use ${pronoun} pronouns consistently throughout the story
- Include a positive message or lesson
- Keep language simple and engaging for the target age

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "Story title here",
  "characterDescription": "Detailed description of ${childName}'s appearance for consistent image generation, including that ${childName} uses ${pronoun} pronouns",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Story text for page 1 (2-3 sentences max)",
      "imagePrompt": "Detailed prompt for generating illustration for this page"
    },
    ... (continue for all ${pageCount} pages)
  ]
}

IMPORTANT:
- Each page should have 2-3 sentences maximum
- Use ${pronoun} pronouns consistently when referring to ${childName}
- Image prompts should be detailed scene descriptions that include ${childName} and the action/setting
- Example: "${childName} standing in a magical forest with tall, glowing trees and colorful butterflies flying around"
- Include specific details about the scene, lighting, and mood
- Maintain consistent character description throughout
- End with a positive, uplifting conclusion

Generate the story now:`;
}

export function createCharacterConsistencyPrompt(
  characterDescription: string,
  sceneDescription: string
): string {
  return `Create a high-quality children's book illustration showing ${sceneDescription}. 

CHARACTER DETAILS: ${characterDescription}

ILLUSTRATION STYLE:
- Bright, colorful, and cheerful children's book illustration style
- Soft, gentle lighting that creates a warm, inviting atmosphere
- Child-friendly and age-appropriate content
- Clear, simple composition perfect for a storybook page
- Professional children's book artwork quality
- Focus on positive emotions and expressions

TECHNICAL REQUIREMENTS:
- High resolution, suitable for print
- Clean, crisp details with good contrast
- Composition should work well on a book page
- Avoid scary, dark, or inappropriate content
- Use vibrant but harmonious colors
- Maintain consistency with the character's appearance throughout

Create this as a single, beautiful illustration suitable for a children's storybook.`;
}

export async function generateStory(
  formData: StoryFormData
): Promise<GeneratedStory> {
  try {
    const models = getTextModel();
    const prompt = createStoryPrompt(formData);

    const result = await models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    const text = result.text;

    if (!text) {
      throw new Error("No text response received from AI model");
    }

    // Parse JSON response
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd <= jsonStart) {
      throw new Error("Invalid JSON response from AI model");
    }

    const jsonText = text.slice(jsonStart, jsonEnd);
    const storyData = JSON.parse(jsonText);

    return {
      title: storyData.title,
      pages: storyData.pages.map(
        (page: { text?: string; imagePrompt?: string }, index: number) => ({
          pageNumber: index + 1,
          text: page.text || "",
          imagePrompt: page.imagePrompt || "",
        })
      ),
      characterDescription:
        storyData.characterDescription ||
        `${formData.childName}, a ${formData.childAge}-year-old child who uses ${formData.pronoun} pronouns`,
    };
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story. Please try again.");
  }
}

export async function generateImages(story: GeneratedStory): Promise<string[]> {
  try {
    const models = getTextModel();
    const imagePromises = story.pages.map(async (page) => {
      const prompt = createCharacterConsistencyPrompt(
        story.characterDescription,
        page.imagePrompt
      );

      try {
        console.log(`Generating image for page ${page.pageNumber}...`);

        // Use Gemini 2.5 Flash Image Preview (nano banana) for image generation
        const result = await models.generateContent({
          model: IMAGE_CONFIG.model,
          contents: prompt,
        });

        // Check if the response contains image data
        if (result.candidates && result.candidates[0]?.content?.parts) {
          for (const part of result.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              // Convert base64 image data to data URL
              const mimeType = part.inlineData.mimeType || "image/png";
              const imageDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              console.log(`Generated image for page ${page.pageNumber}`);
              return imageDataUrl;
            }
          }
        }

        // Fallback to placeholder if no image data received
        console.log(
          `No image data received for page ${page.pageNumber}, using placeholder`
        );
        return createPlaceholderImage(page);
      } catch (error) {
        console.error(
          `Error generating image for page ${page.pageNumber}:`,
          error
        );
        // Return a fallback placeholder image
        return createPlaceholderImage(page);
      }
    });

    const images = await Promise.all(imagePromises);
    return images;
  } catch (error) {
    console.error("Error generating images:", error);
    // Return placeholder images for all pages as fallback
    return story.pages.map((page) => createPlaceholderImage(page));
  }
}

// Helper function to create placeholder images
function createPlaceholderImage(page: StoryPage): string {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f8ff"/>
      <circle cx="200" cy="150" r="60" fill="#ffeb3b"/>
      <text x="200" y="250" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">
        Page ${page.pageNumber}
      </text>
      <text x="200" y="280" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
        ${page.text.slice(0, 40)}...
      </text>
    </svg>
  `)}`;
}
