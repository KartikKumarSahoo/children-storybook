"use client";

import { StoredStory } from "@/lib/story-storage";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Heart,
  Palette,
  RotateCcw,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { StoryFormData } from "./StoryForm";

interface StoryModificationInterfaceProps {
  story: StoredStory;
  onModify: (modifiedParams: Partial<StoryFormData>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

interface ModificationSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
}

export default function StoryModificationInterface({
  story,
  onModify,
  onCancel,
  isOpen,
}: StoryModificationInterfaceProps) {
  const [modifiedParams, setModifiedParams] = useState<Partial<StoryFormData>>(
    {}
  );
  const [sections, setSections] = useState<ModificationSection[]>([
    {
      id: "character",
      title: "Character Details",
      icon: <User className="w-4 h-4" />,
      isExpanded: true,
    },
    {
      id: "story",
      title: "Story Settings",
      icon: <BookOpen className="w-4 h-4" />,
      isExpanded: false,
    },
    {
      id: "interests",
      title: "Interests & Themes",
      icon: <Heart className="w-4 h-4" />,
      isExpanded: false,
    },
    {
      id: "appearance",
      title: "Character Appearance",
      icon: <Palette className="w-4 h-4" />,
      isExpanded: false,
    },
  ]);

  const [newInterest, setNewInterest] = useState("");
  const [previewChanges, setPreviewChanges] = useState(false);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const updateParam = <K extends keyof StoryFormData>(
    key: K,
    value: StoryFormData[K]
  ) => {
    setModifiedParams((prev) => ({ ...prev, [key]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      const currentInterests = modifiedParams.interests || [];
      updateParam("interests", [...currentInterests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    const currentInterests = modifiedParams.interests || [];
    updateParam(
      "interests",
      currentInterests.filter((_, i) => i !== index)
    );
  };

  const resetToOriginal = () => {
    setModifiedParams({});
    setPreviewChanges(false);
  };

  const handleSubmit = () => {
    onModify(modifiedParams);
  };

  const hasChanges = Object.keys(modifiedParams).length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Modify Story</h2>
              <p className="text-sm text-gray-500">
                Customize &ldquo;{story.title}&rdquo; for {story.childName}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Close modification interface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Character Details Section */}
          {sections.find((s) => s.id === "character")?.isExpanded && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("character")}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">
                    Character Details
                  </h3>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="child-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Child&apos;s Name
                  </label>
                  <input
                    id="child-name"
                    type="text"
                    value={modifiedParams.childName ?? story.childName}
                    onChange={(e) => updateParam("childName", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter child's name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="child-age"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age
                  </label>
                  <select
                    id="child-age"
                    value={modifiedParams.childAge ?? story.childAge}
                    onChange={(e) =>
                      updateParam("childAge", parseInt(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                      <option key={age} value={age}>
                        {age} years old
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Character Details Section Toggle */}
          {!sections.find((s) => s.id === "character")?.isExpanded && (
            <button
              onClick={() => toggleSection("character")}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-800">
                  Character Details
                </h3>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* Story Settings Section */}
          {sections.find((s) => s.id === "story")?.isExpanded && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("story")}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <h3 className="font-semibold text-gray-800">
                    Story Settings
                  </h3>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="story-theme"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Story Theme
                  </label>
                  <select
                    id="story-theme"
                    value={modifiedParams.storyTheme ?? "adventure"}
                    onChange={(e) =>
                      updateParam(
                        "storyTheme",
                        e.target.value as StoryFormData["storyTheme"]
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Story Length
                  </label>
                  <select
                    id="story-length"
                    value={modifiedParams.storyLength ?? "medium"}
                    onChange={(e) =>
                      updateParam(
                        "storyLength",
                        e.target.value as StoryFormData["storyLength"]
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="short">Short (3-4 pages)</option>
                    <option value="medium">Medium (5-7 pages)</option>
                    <option value="long">Long (8-10 pages)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Story Settings Section Toggle */}
          {!sections.find((s) => s.id === "story")?.isExpanded && (
            <button
              onClick={() => toggleSection("story")}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-gray-800">Story Settings</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* Interests Section */}
          {sections.find((s) => s.id === "interests")?.isExpanded && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("interests")}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <h3 className="font-semibold text-gray-800">
                    Interests & Themes
                  </h3>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Interests
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addInterest()}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., dragons, space, animals"
                  />
                  <button
                    onClick={addInterest}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(modifiedParams.interests || []).map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        title={`Remove ${interest}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interests Section Toggle */}
          {!sections.find((s) => s.id === "interests")?.isExpanded && (
            <button
              onClick={() => toggleSection("interests")}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-gray-800">
                  Interests & Themes
                </h3>
                {(modifiedParams.interests || []).length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {(modifiedParams.interests || []).length}
                  </span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* Character Appearance Section */}
          {sections.find((s) => s.id === "appearance")?.isExpanded && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("appearance")}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">
                    Character Appearance
                  </h3>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hair Color
                  </label>
                  <input
                    type="text"
                    value={modifiedParams.physicalTraits?.hairColor ?? ""}
                    onChange={(e) =>
                      updateParam("physicalTraits", {
                        ...modifiedParams.physicalTraits,
                        hairColor: e.target.value,
                        eyeColor: modifiedParams.physicalTraits?.eyeColor ?? "",
                        favoriteColor:
                          modifiedParams.physicalTraits?.favoriteColor ?? "",
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., brown"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eye Color
                  </label>
                  <input
                    type="text"
                    value={modifiedParams.physicalTraits?.eyeColor ?? ""}
                    onChange={(e) =>
                      updateParam("physicalTraits", {
                        ...modifiedParams.physicalTraits,
                        hairColor:
                          modifiedParams.physicalTraits?.hairColor ?? "",
                        eyeColor: e.target.value,
                        favoriteColor:
                          modifiedParams.physicalTraits?.favoriteColor ?? "",
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Favorite Color
                  </label>
                  <input
                    type="text"
                    value={modifiedParams.physicalTraits?.favoriteColor ?? ""}
                    onChange={(e) =>
                      updateParam("physicalTraits", {
                        ...modifiedParams.physicalTraits,
                        hairColor:
                          modifiedParams.physicalTraits?.hairColor ?? "",
                        eyeColor: modifiedParams.physicalTraits?.eyeColor ?? "",
                        favoriteColor: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., red"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Character Appearance Section Toggle */}
          {!sections.find((s) => s.id === "appearance")?.isExpanded && (
            <button
              onClick={() => toggleSection("appearance")}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-gray-800">
                  Character Appearance
                </h3>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* Preview Changes */}
          {hasChanges && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Changes Summary</h4>
                </div>
                <button
                  onClick={() => setPreviewChanges(!previewChanges)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {previewChanges ? "Hide" : "Show"} Details
                </button>
              </div>

              {previewChanges && (
                <div className="text-sm text-blue-700 space-y-1">
                  {Object.entries(modifiedParams).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <span>
                        {Array.isArray(value)
                          ? value.join(", ")
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={resetToOriginal}
              disabled={!hasChanges}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!hasChanges}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Apply Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
