"use client";

import StoryBookPreview from "@/components/StoryBookPreview";
import StoryForm from "@/components/StoryForm";
import { StoredStory } from "@/lib/story-storage";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
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
      {/* Header (matches Pricing page) */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">
                StoryBook AI
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

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
