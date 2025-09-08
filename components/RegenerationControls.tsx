"use client";

import {
  regenerationCache,
  RegenerationCacheKey,
} from "@/lib/regeneration-cache";
import { StoredStory } from "@/lib/story-storage";
import {
  Edit,
  FileText,
  ImageIcon,
  Loader2,
  RefreshCw,
  Settings,
} from "lucide-react";
import React, { useState } from "react";
import { StoryFormData } from "./StoryForm";
import StoryModificationInterface from "./StoryModificationInterface";

interface RegenerationControlsProps {
  story: StoredStory;
  onRegenerationComplete?: (updatedStory: StoredStory) => void;
  onError?: (error: string) => void;
}

type RegenerationType = "story" | "images" | "page";
type StoryTheme =
  | "adventure"
  | "friendship"
  | "mystery"
  | "fantasy"
  | "educational";
type StoryLength = "short" | "medium" | "long";

export default function RegenerationControls({
  story,
  onRegenerationComplete,
  onError,
}: RegenerationControlsProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationType, setRegenerationType] =
    useState<RegenerationType>("images");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModificationInterface, setShowModificationInterface] =
    useState(false);
  const [modifiedParams, setModifiedParams] = useState<Partial<StoryFormData>>(
    {}
  );
  const [cacheStatus, setCacheStatus] = useState<{
    hasCachedResult: boolean;
    cacheAge?: number;
  }>({ hasCachedResult: false });

  const checkCacheStatus = React.useCallback(() => {
    const cacheKey: RegenerationCacheKey = {
      storyId: story.id,
      regenerationType,
      ...(regenerationType === "page" && { pageNumbers: selectedPages }),
      ...(regenerationType === "story" && { modifiedParams }),
    };

    const cachedEntry = regenerationCache.get(cacheKey);
    if (cachedEntry) {
      const ageInMinutes = Math.floor(
        (Date.now() - cachedEntry.timestamp) / (1000 * 60)
      );
      setCacheStatus({ hasCachedResult: true, cacheAge: ageInMinutes });
    } else {
      setCacheStatus({ hasCachedResult: false });
    }
  }, [story.id, regenerationType, selectedPages, modifiedParams]);

  React.useEffect(() => {
    checkCacheStatus();
  }, [checkCacheStatus]);

  const handleRegenerate = async (useCached = false) => {
    const cacheKey: RegenerationCacheKey = {
      storyId: story.id,
      regenerationType,
      ...(regenerationType === "page" && { pageNumbers: selectedPages }),
      ...(regenerationType === "story" && { modifiedParams }),
    };

    // Check cache first if not forcing fresh generation
    if (useCached) {
      const cachedEntry = regenerationCache.get(cacheKey);
      if (cachedEntry && onRegenerationComplete) {
        onRegenerationComplete(cachedEntry.result);
        return;
      }
    }

    setIsRegenerating(true);
    try {
      const requestBody = {
        storyId: story.id,
        regenerationType,
        ...(regenerationType === "page" && { pageNumbers: selectedPages }),
        ...(regenerationType === "story" && { modifiedParams }),
        originalCharacterDescription: story.characterDescription,
        originalStory: story, // Pass the story data to avoid IndexedDB usage on server
      };

      const response = await fetch("/api/regenerate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate content");
      }

      const result = await response.json();

      if (result.success && result.updatedStory) {
        // Cache the result
        regenerationCache.set(cacheKey, result.updatedStory);

        if (onRegenerationComplete) {
          onRegenerationComplete(result.updatedStory);
        }

        // Update cache status
        checkCacheStatus();
      }
    } catch (error) {
      console.error("Error regenerating content:", error);
      if (onError) {
        onError(
          error instanceof Error
            ? error.message
            : "Failed to regenerate content"
        );
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageIndex)
        ? prev.filter((p) => p !== pageIndex)
        : [...prev, pageIndex]
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Regenerate Content
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <Settings className="w-4 h-4" />
          {showAdvanced ? "Hide" : "Show"} Options
        </button>
      </div>

      {/* Regeneration Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          What to regenerate:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setRegenerationType("images")}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              regenerationType === "images"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ImageIcon className="w-4 h-4 mx-auto mb-1" />
            Images Only
          </button>
          <button
            onClick={() => setRegenerationType("story")}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              regenerationType === "story"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4 mx-auto mb-1" />
            Entire Story
          </button>
          <button
            onClick={() => setRegenerationType("page")}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              regenerationType === "page"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <RefreshCw className="w-4 h-4 mx-auto mb-1" />
            Specific Pages
          </button>
        </div>
      </div>

      {/* Page Selection (if page regeneration selected) */}
      {regenerationType === "page" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select pages to regenerate:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {story.pages.map((page, index) => (
              <button
                key={index}
                onClick={() => togglePageSelection(index)}
                className={`p-2 rounded border text-xs font-medium transition-colors ${
                  selectedPages.includes(index)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Page {page.pageNumber}
              </button>
            ))}
          </div>
          {selectedPages.length === 0 && (
            <p className="text-xs text-red-500">
              Please select at least one page
            </p>
          )}
        </div>
      )}

      {/* Advanced Options (if story regeneration selected) */}
      {showAdvanced && regenerationType === "story" && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Modify Story Parameters:
            </h4>
            <button
              onClick={() => setShowModificationInterface(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-3 h-3" />
              <span>Advanced Editor</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="story-theme"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Story Theme
              </label>
              <select
                id="story-theme"
                value={
                  modifiedParams.storyTheme ||
                  (story.characterDescription?.includes("adventure")
                    ? "adventure"
                    : "friendship")
                }
                onChange={(e) =>
                  setModifiedParams((prev) => ({
                    ...prev,
                    storyTheme: e.target.value as StoryTheme,
                  }))
                }
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="adventure">Adventure</option>
                <option value="friendship">Friendship</option>
                <option value="mystery">Mystery</option>
                <option value="fantasy">Fantasy</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="story-length"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                Story Length
              </label>
              <select
                id="story-length"
                value={modifiedParams.storyLength || "medium"}
                onChange={(e) =>
                  setModifiedParams((prev) => ({
                    ...prev,
                    storyLength: e.target.value as StoryLength,
                  }))
                }
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="story-interests"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Add Interests (comma-separated)
            </label>
            <input
              id="story-interests"
              type="text"
              placeholder="e.g., dragons, space, animals"
              value={(modifiedParams.interests || []).join(", ")}
              onChange={(e) =>
                setModifiedParams((prev) => ({
                  ...prev,
                  interests: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            />
          </div>

          {Object.keys(modifiedParams).length > 0 && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <span className="font-medium">Modified parameters:</span>{" "}
              {Object.keys(modifiedParams).join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Story Modification Interface */}
      <StoryModificationInterface
        story={story}
        isOpen={showModificationInterface}
        onModify={(params) => {
          setModifiedParams(params);
          setShowModificationInterface(false);
        }}
        onCancel={() => setShowModificationInterface(false)}
      />

      {/* Cache Status and Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500">
            {regenerationType === "images" && "Only images will be regenerated"}
            {regenerationType === "story" &&
              "Entire story and images will be regenerated"}
            {regenerationType === "page" &&
              `${selectedPages.length} page(s) selected`}
          </div>

          {cacheStatus.hasCachedResult && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <RefreshCw className="w-3 h-3" />
              <span>Cached result available ({cacheStatus.cacheAge}m ago)</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {cacheStatus.hasCachedResult && (
            <button
              onClick={() => handleRegenerate(true)}
              disabled={isRegenerating}
              className="px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Use Cached
            </button>
          )}

          <button
            onClick={() => handleRegenerate(false)}
            disabled={
              isRegenerating ||
              (regenerationType === "page" && selectedPages.length === 0)
            }
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Generate Fresh
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
