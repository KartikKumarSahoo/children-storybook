import { StoryFormData } from "@/components/StoryForm";
import { generateImages, generateStory } from "@/lib/story-generation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData: StoryFormData = await request.json();

    // Validate required fields
    if (!formData.childName || !formData.childAge || !formData.pronoun) {
      return NextResponse.json(
        { error: "Child name, age, and pronoun are required" },
        { status: 400 }
      );
    }

    // Validate age range
    if (formData.childAge < 3 || formData.childAge > 12) {
      return NextResponse.json(
        { error: "Child age must be between 3 and 12 years old" },
        { status: 400 }
      );
    }

    // Generate the story
    console.log("Generating story for:", formData.childName);
    const story = await generateStory(formData);

    // Generate placeholder images
    console.log("Generating images for story...");
    const images = await generateImages(story);

    // Combine story with images
    const storyWithImages = {
      ...story,
      pages: story.pages.map((page, index) => ({
        ...page,
        imageUrl: images[index] || "",
      })),
    };

    return NextResponse.json({
      success: true,
      story: storyWithImages,
    });
  } catch (error) {
    console.error("Error in generate-story API:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to generate story. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Story generation endpoint. Use POST method with form data." },
    { status: 405 }
  );
}
