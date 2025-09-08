"use client";

import { useStoredStories } from "@/hooks/useStoryStorage";
import { StoredStory, storyStorage } from "@/lib/story-storage";
import { BookOpen, Calendar, Eye, Trash2, User } from "lucide-react";
import { useState } from "react";
import StoryBookPreview from "./StoryBookPreview";

export default function StoriesList() {
  const { stories, isLoading, error, refresh } = useStoredStories();
  const [selectedStory, setSelectedStory] = useState<StoredStory | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewStory = (story: StoredStory) => {
    setSelectedStory(story);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedStory(null);
  };

  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (confirm(`Are you sure you want to delete "${storyTitle}"?`)) {
      try {
        await storyStorage.deleteStory(storyId);
        refresh(); // Refresh the list
        alert("Story deleted successfully!");
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete story. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your stories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center text-red-600">
          <p>Error loading stories: {error}</p>
          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center text-gray-600">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
          <p>Create your first personalized children&apos;s storybook!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800">Your Stories</h2>
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
          {stories.length}
        </span>
      </div>

      <div className="space-y-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  {story.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {story.childName} ({story.childAge} years old)
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {story.pages.length} pages
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 text-sm line-clamp-2">
                  {story.pages[0]?.text || "A wonderful adventure awaits..."}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handlePreviewStory(story)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleDeleteStory(story.id, story.title)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Story Preview Modal */}
      {selectedStory && (
        <StoryBookPreview
          story={selectedStory}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onRegenerate={() => {
            // TODO: Implement regeneration logic
            console.log("Regenerate story:", selectedStory.id);
          }}
          onDownload={() => {
            // TODO: Implement download logic
            console.log("Download story:", selectedStory.id);
          }}
        />
      )}
    </div>
  );
}
