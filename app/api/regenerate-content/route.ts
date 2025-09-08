import { StoryFormData } from "@/components/StoryForm";
import { characterConsistencyTracker } from "@/lib/character-consistency";
import { regenerationValidator } from "@/lib/regeneration-validator";
import { generateImages, generateStory } from "@/lib/story-generation";
import { StoredStory, storyStorage } from "@/lib/story-storage";
import { NextRequest, NextResponse } from "next/server";

interface RegenerateContentRequest {
  storyId: string;
  regenerationType: "story" | "images" | "page";
  pageNumbers?: number[];
  modifiedParams?: {
    childName?: string;
    childAge?: number;
    pronoun?: string;
    interests?: string[];
    storyTheme?: string;
    storyLength?: string;
    characterDescription?: string;
  };
  originalCharacterDescription?: string;
  originalStory?: StoredStory; // Add this for server-side processing
}

export async function POST(request: NextRequest) {
  try {
    const body: RegenerateContentRequest = await request.json();

    // Get the original story for validation - handle server-side environment
    let originalStory;
    try {
      // Check if we're in a browser environment for IndexedDB
      if (typeof window !== "undefined" && typeof indexedDB !== "undefined") {
        originalStory = await storyStorage.getStory(body.storyId);
      } else {
        // On server-side, expect story data to be passed in request
        originalStory = body.originalStory;
      }
    } catch (error) {
      console.warn(
        "IndexedDB not available, using story data from request:",
        error
      );
      originalStory = body.originalStory;
    }

    if (!originalStory) {
      return NextResponse.json(
        { error: "Original story not found or not provided" },
        { status: 404 }
      );
    }

    // Validate the regeneration request
    const validation = regenerationValidator.validateRequest(
      body,
      originalStory
    );

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          validationErrors: validation.errors,
          warnings: validation.warnings,
        },
        { status: 400 }
      );
    }

    // Check character consistency if modifying story parameters
    let consistencyReport = null;
    if (body.regenerationType === "story" && body.modifiedParams) {
      consistencyReport = characterConsistencyTracker.checkConsistency(
        body.storyId,
        body.modifiedParams
      );

      // Add consistency warnings to validation warnings
      if (consistencyReport.warnings.length > 0) {
        validation.warnings.push(...consistencyReport.warnings);
      }

      // If consistency score is very low, add as warning
      if (consistencyReport.consistencyScore < 50) {
        validation.warnings.push(
          `Low character consistency score (${consistencyReport.consistencyScore}%). Consider reviewing changes.`
        );
      }
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn("Regeneration warnings:", validation.warnings);
    }

    const startTime = Date.now();
    let updatedContent: Partial<StoredStory> = {};

    switch (body.regenerationType) {
      case "story":
        // Regenerate entire story with modified parameters
        const modifiedFormData: StoryFormData = {
          childName: body.modifiedParams?.childName || originalStory.childName,
          childAge: body.modifiedParams?.childAge || originalStory.childAge,
          pronoun: body.modifiedParams?.pronoun || originalStory.pronoun,
          traits: [],
          interests: body.modifiedParams?.interests || [],
          physicalTraits: {
            hairColor: "",
            eyeColor: "",
            favoriteColor: "",
          },
          storyTheme:
            (body.modifiedParams?.storyTheme as StoryFormData["storyTheme"]) ||
            "adventure",
          storyLength:
            (body.modifiedParams
              ?.storyLength as StoryFormData["storyLength"]) || "medium",
        };

        // Generate consistent character description
        const consistentDescription =
          characterConsistencyTracker.generateConsistentDescription(
            body.storyId,
            modifiedFormData
          );

        console.log(
          "Regenerating entire story with modified params:",
          modifiedFormData
        );
        console.log(
          "Using consistent character description:",
          consistentDescription
        );

        const newStory = await generateStory(modifiedFormData);
        // Override with consistent character description
        newStory.characterDescription = consistentDescription;

        const newImages = await generateImages(newStory);

        updatedContent = {
          title: newStory.title,
          characterDescription: newStory.characterDescription,
          pages: newStory.pages.map((page, index) => ({
            ...page,
            imageUrl: newImages[index] || undefined,
          })),
        };
        break;

      case "images":
        // Regenerate only images, keeping existing story text
        console.log("Regenerating images for story:", body.storyId);

        const storyForImages = {
          title: originalStory.title,
          characterDescription:
            body.originalCharacterDescription ||
            originalStory.characterDescription,
          pages: originalStory.pages,
        };

        const regeneratedImages = await generateImages(storyForImages);

        updatedContent = {
          pages: originalStory.pages.map((page, index) => ({
            ...page,
            imageUrl: regeneratedImages[index] || page.imageUrl,
          })),
        };
        break;

      case "page":
        // Regenerate specific pages
        console.log("Regenerating pages:", body.pageNumbers);

        // Filter pages to regenerate based on pageNumbers (1-indexed)
        const pagesToRegenerate = originalStory.pages.filter((page) =>
          body.pageNumbers!.includes(page.pageNumber)
        );

        const pageImages = await generateImages({
          title: originalStory.title,
          characterDescription: originalStory.characterDescription,
          pages: pagesToRegenerate,
        });

        updatedContent = {
          pages: originalStory.pages.map((page) => {
            const pageIndex = body.pageNumbers!.indexOf(page.pageNumber);
            if (pageIndex !== -1) {
              return {
                ...page,
                imageUrl: pageImages[pageIndex] || page.imageUrl,
              };
            }
            return page;
          }),
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid regeneration type" },
          { status: 400 }
        );
    }

    // Update the story in storage - handle server-side environment
    let finalUpdatedStory;
    try {
      if (typeof window !== "undefined" && typeof indexedDB !== "undefined") {
        await storyStorage.updateStory(body.storyId, updatedContent);
        finalUpdatedStory = await storyStorage.getStory(body.storyId);
      } else {
        // On server-side, merge updates with original story and return
        finalUpdatedStory = {
          ...originalStory,
          ...updatedContent,
        };
      }
    } catch (error) {
      console.warn(
        "IndexedDB not available, returning merged story data:",
        error
      );
      finalUpdatedStory = {
        ...originalStory,
        ...updatedContent,
      };
    }

    // Track character consistency for future regenerations
    if (finalUpdatedStory) {
      characterConsistencyTracker.trackCharacter(finalUpdatedStory);

      // Add consistency note if there were warnings
      if (consistencyReport && consistencyReport.warnings.length > 0) {
        characterConsistencyTracker.addConsistencyNote(
          body.storyId,
          `Regeneration with ${consistencyReport.warnings.length} consistency warnings`
        );
      }
    }

    // Record the successful regeneration for rate limiting
    regenerationValidator.recordRegeneration(body.storyId);

    const generationTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      updatedStory: finalUpdatedStory,
      generationTime,
      validationWarnings: validation.warnings,
      consistencyReport,
      metadata: validation.metadata,
      message: `Successfully regenerated ${body.regenerationType}`,
    });
  } catch (error) {
    console.error("Error regenerating content:", error);

    if (error instanceof Error && error.message.includes("Rate limit")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to regenerate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Regenerate Content API",
    supportedTypes: ["story", "images", "page"],
    description: "Regenerate story content with validation and caching",
    features: [
      "Content validation",
      "Rate limiting",
      "Metadata generation",
      "Error handling",
    ],
  });
}
