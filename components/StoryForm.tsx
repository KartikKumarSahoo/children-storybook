"use client";

import { AGE_APPROPRIATE_VALUES, getAgeGroup } from "@/lib/predefined-values";
import { StoredStory, storyStorage } from "@/lib/story-storage";
import { Calendar, Heart, Palette, Sparkles, Star, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LoadingOverlay from "./LoadingOverlay";

export interface StoryFormData {
  childName: string;
  childAge: number;
  pronoun: string;
  traits: string[];
  interests: string[];
  physicalTraits: {
    hairColor: string;
    eyeColor: string;
    favoriteColor: string;
  };
  storyTheme: string;
  storyLength: string;
}

interface StoryFormProps {
  onStoryCreated?: (story: StoredStory) => void;
}

export default function StoryForm({ onStoryCreated }: StoryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<StoryFormData>({
    defaultValues: {
      childName: "",
      childAge: 5,
      pronoun: "she/her",
      traits: [],
      interests: [],
      physicalTraits: {
        hairColor: "",
        eyeColor: "",
        favoriteColor: "",
      },
      storyTheme: "adventure",
      storyLength: "medium",
    },
  });

  const watchedValues = watch();

  // Determine current age group and available options for selects
  const currentAge = (watchedValues?.childAge as number) ?? 6;
  const ageGroup = getAgeGroup(Number(currentAge));
  const hairOptions =
    AGE_APPROPRIATE_VALUES[ageGroup].physicalTraits.hairColors;
  const eyeOptions = AGE_APPROPRIATE_VALUES[ageGroup].physicalTraits.eyeColors;
  const colorOptions =
    AGE_APPROPRIATE_VALUES[ageGroup].physicalTraits.favoriteColors;
  const traitOptions = AGE_APPROPRIATE_VALUES[ageGroup].traits;
  const interestOptions = AGE_APPROPRIATE_VALUES[ageGroup].interests;

  const handleAutoFill = async () => {
    try {
      const response = await fetch(
        `/api/auto-fill-details?childAge=${watchedValues.childAge}`
      );
      const data = await response.json();

      if (data.success) {
        setValue("traits", data.suggestions.traits);
        setValue("interests", data.suggestions.interests);
        setValue("physicalTraits", data.suggestions.physicalTraits);
      }
    } catch (error) {
      console.error("Error auto-filling details:", error);
    }
  };

  const onSubmit = async (data: StoryFormData) => {
    setIsGenerating(true);
    try {
      console.log("Generating story with data:", data);

      // Call the story generation API
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate story");
      }

      const result = await response.json();

      if (result.success && result.story) {
        console.log("Story generated successfully:", result.story);

        // Store the story in IndexedDB instead of localStorage
        try {
          const storyId = await storyStorage.saveStory({
            title: result.story.title,
            characterDescription: result.story.characterDescription,
            pages: result.story.pages.map(
              (page: {
                pageNumber: number;
                text: string;
                imagePrompt: string;
                imageUrl?: string;
              }) => ({
                pageNumber: page.pageNumber,
                text: page.text,
                imagePrompt: page.imagePrompt,
                imageUrl: page.imageUrl,
              })
            ),
            childName: data.childName,
            childAge: data.childAge,
            pronoun: data.pronoun,
            favoriteColor: data.physicalTraits.favoriteColor,
          });

          console.log("Story saved to IndexedDB with ID:", storyId);

          // Get the complete story object to pass to the callback
          const savedStory = await storyStorage.getStory(storyId);

          if (savedStory && onStoryCreated) {
            // Call the callback to trigger preview
            onStoryCreated(savedStory);
          } else {
            // Fallback: show success message if no callback provided
            alert(
              `Story "${result.story.title}" generated and saved successfully! Story ID: ${storyId}`
            );
          }
        } catch (storageError) {
          console.error("Error saving to IndexedDB:", storageError);
          // Fallback: still show success but mention storage issue
          alert(
            `Story "${result.story.title}" generated successfully, but there was an issue saving it locally. The story is still available in this session.`
          );
        }
      } else {
        throw new Error("Invalid response from story generation");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate story. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Required Fields Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <User className="w-5 h-5 text-blue-600" />
            Tell us about your child <span className="text-red-500">*</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Child Name */}
            <div>
              <label
                htmlFor="childName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Child&apos;s Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("childName", {
                  required: "Please enter your child's name",
                })}
                type="text"
                id="childName"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                placeholder="Enter your child's name"
              />
              {errors.childName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.childName.message}
                </p>
              )}
            </div>

            {/* Child Age */}
            <div>
              <label
                htmlFor="childAge"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Age <span className="text-red-500">*</span>
              </label>
              <input
                {...register("childAge", {
                  required: "Please enter your child's age",
                  min: { value: 3, message: "Age must be at least 3" },
                  max: { value: 12, message: "Age must be 12 or under" },
                })}
                type="number"
                id="childAge"
                min="3"
                max="12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                placeholder="5"
              />
              {errors.childAge && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.childAge.message}
                </p>
              )}
            </div>

            {/* Pronoun */}
            <div>
              <label
                htmlFor="pronoun"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pronoun <span className="text-red-500">*</span>
              </label>
              <select
                {...register("pronoun", {
                  required: "Please select a pronoun",
                })}
                id="pronoun"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900"
              >
                <option value="he/him">He/Him</option>
                <option value="she/her">She/Her</option>
                <option value="they/them">They/Them</option>
              </select>
              {errors.pronoun && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pronoun.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Auto-Fill Section */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              Additional Details{" "}
              <span className="text-sm font-normal text-gray-500">
                (optional)
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Auto-Fill Details
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Personality Traits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart className="w-4 h-4 inline mr-1" />
                Personality Traits
              </label>
              <div className="space-y-2">
                {traitOptions.map((trait) => (
                  <label key={trait} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={trait}
                      {...register("traits")}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {trait.charAt(0).toUpperCase() + trait.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Interests
              </label>
              <div className="space-y-2">
                {interestOptions.map((interest) => (
                  <label key={interest} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={interest}
                      {...register("interests")}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {interest.charAt(0).toUpperCase() + interest.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Physical Traits */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="w-4 h-4 inline mr-1" />
              Physical Traits
            </label>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="hairColor"
                  className="block text-xs text-gray-600 mb-1"
                >
                  Hair Color
                </label>
                <select
                  {...register("physicalTraits.hairColor")}
                  id="hairColor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select...</option>
                  {hairOptions.map((hc) => (
                    <option key={hc} value={hc}>
                      {hc.charAt(0).toUpperCase() + hc.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="eyeColor"
                  className="block text-xs text-gray-600 mb-1"
                >
                  Eye Color
                </label>
                <select
                  {...register("physicalTraits.eyeColor")}
                  id="eyeColor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select...</option>
                  {eyeOptions.map((ec) => (
                    <option key={ec} value={ec}>
                      {ec.charAt(0).toUpperCase() + ec.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="favoriteColor"
                  className="block text-xs text-gray-600 mb-1"
                >
                  Favorite Color
                </label>
                <select
                  {...register("physicalTraits.favoriteColor")}
                  id="favoriteColor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select...</option>
                  {colorOptions.map((cc) => (
                    <option key={cc} value={cc}>
                      {cc.charAt(0).toUpperCase() + cc.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Story Options */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
            <Calendar className="w-5 h-5 text-green-600" />
            Story Options
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="storyTheme"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Theme
              </label>
              <select
                {...register("storyTheme")}
                id="storyTheme"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="adventure">Adventure</option>
                <option value="friendship">Friendship</option>
                <option value="learning">Learning</option>
                <option value="fantasy">Fantasy</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="storyLength"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Length
              </label>
              <select
                {...register("storyLength")}
                id="storyLength"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="short">Short (6-8 pages)</option>
                <option value="medium">Medium (10-12 pages)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={!isValid || isGenerating}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? "Creating..." : "Create My Story"}
          </button>
        </div>
      </form>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isGenerating}
        message="Creating your magical story..."
      />
    </div>
  );
}
