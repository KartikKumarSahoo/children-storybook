/**
 * Regeneration Validation System
 * Provides comprehensive validation for regeneration requests,
 * ensuring data integrity and preventing invalid operations.
 */

import { StoryFormData } from "../components/StoryForm";
import { StoredStory } from "./story-storage";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    estimatedDuration?: number;
    costEstimate?: number;
    recommendedAlternatives?: string[];
  };
}

export interface RegenerationRequest {
  storyId: string;
  regenerationType: "story" | "images" | "page";
  pageNumbers?: number[];
  modifiedParams?: Partial<StoryFormData>;
  originalCharacterDescription?: string;
}

export class RegenerationValidator {
  private readonly MAX_PAGE_SELECTION = 10;
  private readonly MIN_STORY_AGE_MINUTES = 2; // Prevent too frequent regenerations
  private readonly MAX_REGENERATIONS_PER_HOUR = 20;
  private readonly MAX_STORY_LENGTH = 10; // Max number of pages

  /**
   * Validate a complete regeneration request
   */
  validateRequest(
    request: RegenerationRequest,
    story: StoredStory
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic request validation
    const basicValidation = this.validateBasicRequest(request);
    errors.push(...basicValidation.errors);
    warnings.push(...basicValidation.warnings);

    // Story existence and state validation
    const storyValidation = this.validateStoryState(request, story);
    errors.push(...storyValidation.errors);
    warnings.push(...storyValidation.warnings);

    // Type-specific validation
    const typeValidation = this.validateRegenerationType(request, story);
    errors.push(...typeValidation.errors);
    warnings.push(...typeValidation.warnings);

    // Rate limiting validation
    const rateLimitValidation = this.validateRateLimit(request.storyId);
    errors.push(...rateLimitValidation.errors);
    warnings.push(...rateLimitValidation.warnings);

    // Generate metadata
    const metadata = this.generateMetadata(request, story);

    return {
      isValid: errors.length === 0,
      errors: [...new Set(errors)], // Remove duplicates
      warnings: [...new Set(warnings)], // Remove duplicates
      metadata,
    };
  }

  /**
   * Validate basic request structure
   */
  private validateBasicRequest(request: RegenerationRequest): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!request.storyId || request.storyId.trim() === "") {
      errors.push("Story ID is required");
    }

    if (!request.regenerationType) {
      errors.push("Regeneration type is required");
    }

    // Valid regeneration types
    const validTypes = ["story", "images", "page"];
    if (
      request.regenerationType &&
      !validTypes.includes(request.regenerationType)
    ) {
      errors.push(
        `Invalid regeneration type. Must be one of: ${validTypes.join(", ")}`
      );
    }

    // Page-specific validation
    if (request.regenerationType === "page") {
      if (!request.pageNumbers || request.pageNumbers.length === 0) {
        errors.push("Page numbers are required for page regeneration");
      } else {
        // Validate page numbers
        if (
          request.pageNumbers.some((num) => num < 1 || !Number.isInteger(num))
        ) {
          errors.push("Page numbers must be positive integers starting from 1");
        }

        if (request.pageNumbers.length > this.MAX_PAGE_SELECTION) {
          errors.push(
            `Cannot regenerate more than ${this.MAX_PAGE_SELECTION} pages at once`
          );
        }

        // Check for duplicates
        const uniquePages = new Set(request.pageNumbers);
        if (uniquePages.size !== request.pageNumbers.length) {
          warnings.push("Duplicate page numbers detected and will be ignored");
        }
      }
    }

    // Story regeneration with modified parameters
    if (request.regenerationType === "story" && request.modifiedParams) {
      const paramValidation = this.validateModifiedParams(
        request.modifiedParams
      );
      errors.push(...paramValidation.errors);
      warnings.push(...paramValidation.warnings);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate modified story parameters
   */
  private validateModifiedParams(
    params: Partial<StoryFormData>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate story theme
    if (params.storyTheme) {
      const validThemes = [
        "adventure",
        "friendship",
        "mystery",
        "fantasy",
        "educational",
      ];
      if (!validThemes.includes(params.storyTheme)) {
        errors.push(
          `Invalid story theme. Must be one of: ${validThemes.join(", ")}`
        );
      }
    }

    // Validate story length
    if (params.storyLength) {
      const validLengths = ["short", "medium", "long"];
      if (!validLengths.includes(params.storyLength)) {
        errors.push(
          `Invalid story length. Must be one of: ${validLengths.join(", ")}`
        );
      }
    }

    // Validate interests
    if (params.interests) {
      if (!Array.isArray(params.interests)) {
        errors.push("Interests must be an array of strings");
      } else {
        if (params.interests.length > 10) {
          warnings.push(
            "Too many interests specified. Only the first 10 will be used."
          );
        }

        // Check for empty or invalid interests
        const invalidInterests = params.interests.filter(
          (interest) =>
            typeof interest !== "string" || interest.trim().length === 0
        );
        if (invalidInterests.length > 0) {
          warnings.push("Empty or invalid interests will be ignored");
        }
      }
    }

    // Validate child name (if provided)
    if (params.childName !== undefined) {
      if (
        typeof params.childName !== "string" ||
        params.childName.trim().length === 0
      ) {
        errors.push("Child name must be a non-empty string");
      } else if (params.childName.length > 50) {
        warnings.push("Child name is very long and may affect story quality");
      }
    }

    // Validate child age (if provided)
    if (params.childAge !== undefined) {
      if (
        !Number.isInteger(params.childAge) ||
        params.childAge < 3 ||
        params.childAge > 12
      ) {
        errors.push("Child age must be an integer between 3 and 12");
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate story state and existence
   */
  private validateStoryState(
    request: RegenerationRequest,
    story: StoredStory
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!story) {
      errors.push("Story not found");
      return { isValid: false, errors, warnings };
    }

    // Check if story ID matches
    if (story.id !== request.storyId) {
      errors.push("Story ID mismatch");
    }

    // Check story structure
    if (!story.pages || story.pages.length === 0) {
      errors.push("Story has no pages to regenerate");
    }

    // Check if story is too new (prevent rapid regenerations)
    const storyAge = Date.now() - new Date(story.createdAt).getTime();
    const ageInMinutes = storyAge / (1000 * 60);

    if (ageInMinutes < this.MIN_STORY_AGE_MINUTES) {
      warnings.push(
        `Story is very new (${
          Math.round(ageInMinutes * 10) / 10
        } minutes old). Consider waiting before regenerating.`
      );
    }

    // Check story length
    if (story.pages.length > this.MAX_STORY_LENGTH) {
      warnings.push(
        "Story is quite long. Regeneration may take longer than usual."
      );
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate regeneration type against story content
   */
  private validateRegenerationType(
    request: RegenerationRequest,
    story: StoredStory
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!story) return { isValid: false, errors, warnings };

    switch (request.regenerationType) {
      case "page":
        if (request.pageNumbers) {
          // Check if requested pages exist
          const maxPageNumber = Math.max(
            ...story.pages.map((p) => p.pageNumber)
          );
          const invalidPages = request.pageNumbers.filter(
            (num) => num > maxPageNumber
          );

          if (invalidPages.length > 0) {
            errors.push(
              `Page numbers ${invalidPages.join(
                ", "
              )} do not exist. Story has ${maxPageNumber} pages.`
            );
          }

          // Warn about regenerating pages with no images
          const pagesWithoutImages = request.pageNumbers.filter((pageNum) => {
            const page = story.pages.find((p) => p.pageNumber === pageNum);
            return !page?.imageUrl;
          });

          if (pagesWithoutImages.length > 0) {
            warnings.push(
              `Pages ${pagesWithoutImages.join(", ")} currently have no images.`
            );
          }
        }
        break;

      case "images":
        // Check if story has any images to regenerate
        const pagesWithImages = story.pages.filter((page) => page.imageUrl);
        if (pagesWithImages.length === 0) {
          warnings.push(
            "Story currently has no images to regenerate. New images will be generated."
          );
        }
        break;

      case "story":
        // Check if significant changes are being made
        if (
          request.modifiedParams &&
          Object.keys(request.modifiedParams).length === 0
        ) {
          warnings.push(
            "No modified parameters provided. Story will be regenerated with the same parameters."
          );
        }
        break;
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate rate limiting
   */
  private validateRateLimit(storyId: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Get regeneration history from localStorage
      const storageKey = `regeneration_history_${storyId}`;
      const historyData = localStorage.getItem(storageKey);

      if (historyData) {
        const history: number[] = JSON.parse(historyData);
        const oneHourAgo = Date.now() - 60 * 60 * 1000;

        // Filter recent regenerations
        const recentRegenerations = history.filter(
          (timestamp) => timestamp > oneHourAgo
        );

        if (recentRegenerations.length >= this.MAX_REGENERATIONS_PER_HOUR) {
          errors.push(
            `Rate limit exceeded. Maximum ${this.MAX_REGENERATIONS_PER_HOUR} regenerations per hour allowed.`
          );
        } else if (
          recentRegenerations.length >=
          this.MAX_REGENERATIONS_PER_HOUR * 0.8
        ) {
          warnings.push(
            `Approaching rate limit (${recentRegenerations.length}/${this.MAX_REGENERATIONS_PER_HOUR} per hour).`
          );
        }
      }
    } catch (error) {
      // If we can't check rate limits, just warn
      warnings.push(
        "Unable to verify rate limits. Please avoid excessive regenerations."
      );
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Generate metadata about the regeneration request
   */
  private generateMetadata(
    request: RegenerationRequest,
    story: StoredStory
  ): ValidationResult["metadata"] {
    if (!story) return {};

    let estimatedDuration = 0;
    let costEstimate = 0;

    switch (request.regenerationType) {
      case "images":
        estimatedDuration = story.pages.length * 10; // 10 seconds per image
        costEstimate = story.pages.length * 0.1; // $0.10 per image
        break;
      case "page":
        const pageCount = request.pageNumbers?.length || 0;
        estimatedDuration = pageCount * 15; // 15 seconds per page (text + image)
        costEstimate = pageCount * 0.15; // $0.15 per page
        break;
      case "story":
        estimatedDuration = story.pages.length * 20; // 20 seconds per page for full regeneration
        costEstimate = story.pages.length * 0.2; // $0.20 per page for full regeneration
        break;
    }

    const recommendedAlternatives: string[] = [];

    if (request.regenerationType === "story" && story.pages.length > 5) {
      recommendedAlternatives.push(
        "Consider regenerating specific pages instead of the entire story"
      );
    }

    if (
      request.regenerationType === "page" &&
      request.pageNumbers &&
      request.pageNumbers.length > 3
    ) {
      recommendedAlternatives.push(
        "Consider regenerating images only for faster results"
      );
    }

    return {
      estimatedDuration: Math.round(estimatedDuration),
      costEstimate: Math.round(costEstimate * 100) / 100, // Round to 2 decimal places
      recommendedAlternatives:
        recommendedAlternatives.length > 0
          ? recommendedAlternatives
          : undefined,
    };
  }

  /**
   * Record a successful regeneration for rate limiting
   */
  recordRegeneration(storyId: string): void {
    try {
      const storageKey = `regeneration_history_${storyId}`;
      const historyData = localStorage.getItem(storageKey);

      let history: number[] = historyData ? JSON.parse(historyData) : [];

      // Add current timestamp
      history.push(Date.now());

      // Clean up old entries (older than 24 hours)
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      history = history.filter((timestamp) => timestamp > oneDayAgo);

      // Save updated history
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch {
      console.warn("Failed to record regeneration history");
    }
  }
}

// Singleton instance
export const regenerationValidator = new RegenerationValidator();
