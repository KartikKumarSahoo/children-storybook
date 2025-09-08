"use client";

import StoryBookPreview from "@/components/StoryBookPreview";
import StoryForm from "@/components/StoryForm";
import { StoredStory } from "@/lib/story-storage";
import { useState } from "react";

export default function CreateStoryPage() {
  const [selectedStory, setSelectedStory] = useState<StoredStory | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleStoryCreated = (story: StoredStory) => {
    setSelectedStory(story);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedStory(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Create Your Child&apos;s
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Magical Story
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your child and we&apos;ll create a personalized
              storybook just for them!
            </p>
          </div>
          <StoryForm onStoryCreated={handleStoryCreated} />
        </div>
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
