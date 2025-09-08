/**
 * Character Consistency Tracker
 * Ensures character appearance and traits remain consistent
 * across story regenerations and modifications.
 */

import { StoryFormData } from "../components/StoryForm";
import { StoredStory } from "./story-storage";

export interface CharacterProfile {
  id: string;
  name: string;
  age: number;
  physicalTraits: {
    hairColor: string;
    eyeColor: string;
    favoriteColor: string;
    additionalFeatures?: string[];
  };
  personalityTraits: string[];
  baseCharacterDescription: string;
  consistencyNotes: string[];
  lastUpdated: number;
  version: number;
}

export interface ConsistencyReport {
  isConsistent: boolean;
  warnings: string[];
  suggestions: string[];
  changedTraits: {
    trait: string;
    oldValue: string;
    newValue: string;
    severity: "low" | "medium" | "high";
  }[];
  consistencyScore: number; // 0-100
}

export class CharacterConsistencyTracker {
  private readonly STORAGE_KEY = "character_consistency_profiles";
  private readonly MAX_PROFILES = 50; // Limit stored profiles
  private profiles = new Map<string, CharacterProfile>();

  constructor() {
    this.loadProfiles();
  }

  /**
   * Create or update a character profile from a story
   */
  trackCharacter(story: StoredStory): CharacterProfile {
    const existingProfile = this.profiles.get(story.id);

    const profile: CharacterProfile = {
      id: story.id,
      name: story.childName,
      age: story.childAge,
      physicalTraits: {
        hairColor: this.extractTraitFromDescription(
          story.characterDescription,
          "hair"
        ),
        eyeColor: this.extractTraitFromDescription(
          story.characterDescription,
          "eyes"
        ),
        favoriteColor: this.extractTraitFromDescription(
          story.characterDescription,
          "favorite color"
        ),
        additionalFeatures: this.extractAdditionalFeatures(
          story.characterDescription
        ),
      },
      personalityTraits: this.extractPersonalityTraits(
        story.characterDescription
      ),
      baseCharacterDescription: story.characterDescription,
      consistencyNotes: existingProfile?.consistencyNotes || [],
      lastUpdated: Date.now(),
      version: (existingProfile?.version || 0) + 1,
    };

    this.profiles.set(story.id, profile);
    this.saveProfiles();

    return profile;
  }

  /**
   * Check consistency before regeneration
   */
  checkConsistency(
    storyId: string,
    proposedChanges: Partial<StoryFormData>
  ): ConsistencyReport {
    const profile = this.profiles.get(storyId);

    if (!profile) {
      return {
        isConsistent: true,
        warnings: ["No existing character profile found"],
        suggestions: [],
        changedTraits: [],
        consistencyScore: 100,
      };
    }

    const warnings: string[] = [];
    const suggestions: string[] = [];
    const changedTraits: ConsistencyReport["changedTraits"] = [];

    // Check name changes
    if (
      proposedChanges.childName &&
      proposedChanges.childName !== profile.name
    ) {
      changedTraits.push({
        trait: "name",
        oldValue: profile.name,
        newValue: proposedChanges.childName,
        severity: "high",
      });
      warnings.push(
        `Character name changing from "${profile.name}" to "${proposedChanges.childName}"`
      );
    }

    // Check age changes
    if (proposedChanges.childAge && proposedChanges.childAge !== profile.age) {
      const ageDiff = Math.abs(proposedChanges.childAge - profile.age);
      const severity = ageDiff > 2 ? "high" : ageDiff > 1 ? "medium" : "low";

      changedTraits.push({
        trait: "age",
        oldValue: profile.age.toString(),
        newValue: proposedChanges.childAge.toString(),
        severity,
      });

      if (severity === "high") {
        warnings.push(
          `Significant age change from ${profile.age} to ${proposedChanges.childAge}`
        );
      }
    }

    // Check physical trait changes
    if (proposedChanges.physicalTraits) {
      const { physicalTraits } = proposedChanges;

      if (
        physicalTraits.hairColor &&
        physicalTraits.hairColor !== profile.physicalTraits.hairColor
      ) {
        changedTraits.push({
          trait: "hairColor",
          oldValue: profile.physicalTraits.hairColor || "not specified",
          newValue: physicalTraits.hairColor,
          severity: "medium",
        });
      }

      if (
        physicalTraits.eyeColor &&
        physicalTraits.eyeColor !== profile.physicalTraits.eyeColor
      ) {
        changedTraits.push({
          trait: "eyeColor",
          oldValue: profile.physicalTraits.eyeColor || "not specified",
          newValue: physicalTraits.eyeColor,
          severity: "medium",
        });
      }

      if (
        physicalTraits.favoriteColor &&
        physicalTraits.favoriteColor !== profile.physicalTraits.favoriteColor
      ) {
        changedTraits.push({
          trait: "favoriteColor",
          oldValue: profile.physicalTraits.favoriteColor || "not specified",
          newValue: physicalTraits.favoriteColor,
          severity: "low",
        });
      }
    }

    // Check for contradictory interests
    if (proposedChanges.interests) {
      const contradictions = this.findContradictoryInterests(
        profile.personalityTraits,
        proposedChanges.interests
      );

      contradictions.forEach((contradiction) => {
        warnings.push(
          `Interest "${contradiction.newInterest}" may conflict with character trait "${contradiction.existingTrait}"`
        );
      });
    }

    // Generate suggestions
    if (changedTraits.length > 0) {
      suggestions.push(
        "Consider maintaining character consistency for better story flow"
      );

      if (changedTraits.some((t) => t.severity === "high")) {
        suggestions.push(
          "Major character changes detected - consider creating a new character instead"
        );
      }
    }

    // Calculate consistency score
    const highSeverityCount = changedTraits.filter(
      (t) => t.severity === "high"
    ).length;
    const mediumSeverityCount = changedTraits.filter(
      (t) => t.severity === "medium"
    ).length;
    const lowSeverityCount = changedTraits.filter(
      (t) => t.severity === "low"
    ).length;

    let consistencyScore = 100;
    consistencyScore -= highSeverityCount * 30;
    consistencyScore -= mediumSeverityCount * 15;
    consistencyScore -= lowSeverityCount * 5;
    consistencyScore = Math.max(0, consistencyScore);

    const isConsistent = consistencyScore >= 70 && highSeverityCount === 0;

    return {
      isConsistent,
      warnings,
      suggestions,
      changedTraits,
      consistencyScore,
    };
  }

  /**
   * Generate character description with consistency
   */
  generateConsistentDescription(
    storyId: string,
    baseFormData: StoryFormData
  ): string {
    const profile = this.profiles.get(storyId);

    if (!profile) {
      return this.buildCharacterDescription(baseFormData);
    }

    // Merge existing profile with new data, prioritizing consistency
    const consistentData: StoryFormData = {
      ...baseFormData,
      physicalTraits: {
        hairColor:
          profile.physicalTraits.hairColor ||
          baseFormData.physicalTraits.hairColor,
        eyeColor:
          profile.physicalTraits.eyeColor ||
          baseFormData.physicalTraits.eyeColor,
        favoriteColor:
          profile.physicalTraits.favoriteColor ||
          baseFormData.physicalTraits.favoriteColor,
      },
    };

    return this.buildCharacterDescription(consistentData);
  }

  /**
   * Get character profile for a story
   */
  getProfile(storyId: string): CharacterProfile | undefined {
    return this.profiles.get(storyId);
  }

  /**
   * Add a consistency note to a character profile
   */
  addConsistencyNote(storyId: string, note: string): void {
    const profile = this.profiles.get(storyId);
    if (profile) {
      profile.consistencyNotes.push(`${new Date().toISOString()}: ${note}`);
      profile.lastUpdated = Date.now();
      this.saveProfiles();
    }
  }

  /**
   * Extract physical trait from character description
   */
  private extractTraitFromDescription(
    description: string,
    trait: string
  ): string {
    const patterns = {
      hair: /(?:has|with)\s+(\w+(?:\s+\w+)?)\s+hair/i,
      eyes: /(?:has|with)\s+(\w+(?:\s+\w+)?)\s+eyes/i,
      "favorite color": /(?:favorite|loves)\s+(?:color|colour)\s+is\s+(\w+)/i,
    };

    const pattern = patterns[trait as keyof typeof patterns];
    if (!pattern) return "";

    const match = description.match(pattern);
    return match ? match[1].toLowerCase() : "";
  }

  /**
   * Extract additional physical features
   */
  private extractAdditionalFeatures(description: string): string[] {
    const features: string[] = [];

    // Look for common features
    const featurePatterns = [
      /has\s+(freckles|dimples|glasses|braces)/gi,
      /wears\s+(glasses|braces|a hat)/gi,
      /with\s+(curly|straight|wavy)\s+hair/gi,
    ];

    featurePatterns.forEach((pattern) => {
      const matches = description.match(pattern);
      if (matches) {
        features.push(...matches.map((m) => m.toLowerCase()));
      }
    });

    return [...new Set(features)]; // Remove duplicates
  }

  /**
   * Extract personality traits from description
   */
  private extractPersonalityTraits(description: string): string[] {
    const traits: string[] = [];

    const traitPatterns = [
      /is\s+(brave|kind|curious|adventurous|shy|outgoing|creative|smart|funny|helpful)/gi,
      /loves\s+(reading|playing|exploring|learning|animals|nature)/gi,
    ];

    traitPatterns.forEach((pattern) => {
      const matches = description.match(pattern);
      if (matches) {
        traits.push(...matches.map((m) => m.toLowerCase()));
      }
    });

    return [...new Set(traits)]; // Remove duplicates
  }

  /**
   * Find contradictory interests
   */
  private findContradictoryInterests(
    existingTraits: string[],
    newInterests: string[]
  ): Array<{ existingTrait: string; newInterest: string }> {
    const contradictions: Array<{
      existingTrait: string;
      newInterest: string;
    }> = [];

    // Define some basic contradictions
    const contradictionMap = {
      shy: ["performing", "stage", "spotlight"],
      quiet: ["loud music", "concerts", "parties"],
      indoors: ["hiking", "camping", "outdoor sports"],
      gentle: ["fighting", "wrestling", "combat sports"],
    };

    existingTraits.forEach((trait) => {
      const contradictoryInterests =
        contradictionMap[trait as keyof typeof contradictionMap];
      if (contradictoryInterests) {
        newInterests.forEach((interest) => {
          if (
            contradictoryInterests.some((ci) =>
              interest.toLowerCase().includes(ci)
            )
          ) {
            contradictions.push({
              existingTrait: trait,
              newInterest: interest,
            });
          }
        });
      }
    });

    return contradictions;
  }

  /**
   * Build character description from form data
   */
  private buildCharacterDescription(formData: StoryFormData): string {
    const parts: string[] = [];

    parts.push(`${formData.childName} is a ${formData.childAge}-year-old`);

    if (formData.physicalTraits.hairColor) {
      parts.push(`with ${formData.physicalTraits.hairColor} hair`);
    }

    if (formData.physicalTraits.eyeColor) {
      parts.push(`and ${formData.physicalTraits.eyeColor} eyes`);
    }

    if (formData.traits && formData.traits.length > 0) {
      parts.push(`who is ${formData.traits.join(", ")}`);
    }

    if (formData.interests && formData.interests.length > 0) {
      parts.push(`and loves ${formData.interests.join(", ")}`);
    }

    if (formData.physicalTraits.favoriteColor) {
      parts.push(
        `Their favorite color is ${formData.physicalTraits.favoriteColor}`
      );
    }

    return parts.join(" ") + ".";
  }

  /**
   * Load profiles from localStorage (browser only)
   */
  private loadProfiles(): void {
    try {
      // Check if we're in a browser environment
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const profilesArray: CharacterProfile[] = JSON.parse(stored);
          profilesArray.forEach((profile) => {
            this.profiles.set(profile.id, profile);
          });
        }
      }
      // In server-side environment, profiles map remains empty
      // This is fine since we can still track consistency for the current session
    } catch (error) {
      console.warn("Failed to load character profiles:", error);
    }
  }

  /**
   * Save profiles to localStorage (browser only)
   */
  private saveProfiles(): void {
    try {
      // Check if we're in a browser environment
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        const profilesArray = Array.from(this.profiles.values());

        // Sort by last updated and keep only recent profiles
        const sortedProfiles = profilesArray
          .sort((a, b) => b.lastUpdated - a.lastUpdated)
          .slice(0, this.MAX_PROFILES);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sortedProfiles));
      }
    } catch (error) {
      console.warn("Failed to save character profiles:", error);
    }
  }

  /**
   * Clear all profiles (for testing/reset)
   */
  clearProfiles(): void {
    this.profiles.clear();
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (error) {
        console.warn("Failed to clear character profiles:", error);
      }
    }
  }

  /**
   * Get consistency statistics
   */
  getConsistencyStats(): {
    totalProfiles: number;
    averageVersion: number;
    mostConsistentCharacter?: string;
    totalConsistencyNotes: number;
  } {
    const profiles = Array.from(this.profiles.values());

    if (profiles.length === 0) {
      return { totalProfiles: 0, averageVersion: 0, totalConsistencyNotes: 0 };
    }

    const totalVersions = profiles.reduce((sum, p) => sum + p.version, 0);
    const averageVersion = totalVersions / profiles.length;

    const mostConsistentCharacter = profiles.sort(
      (a, b) => a.consistencyNotes.length - b.consistencyNotes.length
    )[0]?.name;

    const totalConsistencyNotes = profiles.reduce(
      (sum, p) => sum + p.consistencyNotes.length,
      0
    );

    return {
      totalProfiles: profiles.length,
      averageVersion: Math.round(averageVersion * 10) / 10,
      mostConsistentCharacter,
      totalConsistencyNotes,
    };
  }
}

// Singleton instance
export const characterConsistencyTracker = new CharacterConsistencyTracker();
