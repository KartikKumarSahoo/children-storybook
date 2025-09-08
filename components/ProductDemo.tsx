"use client";

import { StoredStory } from "@/lib/story-storage";
import { BookOpen, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import StoriesList from "./StoriesList";
import StoryBookPreview from "./StoryBookPreview";
import StoryForm from "./StoryForm";

export default function ProductDemo() {
  const [selectedStory, setSelectedStory] = useState<StoredStory | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStoryCreated = (story: StoredStory) => {
    setSelectedStory(story);
    setIsPreviewOpen(true);
    // Trigger a refresh of the stories list
    setRefreshKey((prev) => prev + 1);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedStory(null);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            See the Magic in Action
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Watch how our AI transforms your child&apos;s details into a
            personalized storybook adventure
          </p>
        </div>

        {/* Demo Flow */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-8 mb-6">
              <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">
                  Child&apos;s Profile
                </div>
                <div className="space-y-2 text-left">
                  <div className="text-xs bg-slate-100 rounded px-2 py-1">
                    Name: Emma
                  </div>
                  <div className="text-xs bg-slate-100 rounded px-2 py-1">
                    Age: 7
                  </div>
                  <div className="text-xs bg-slate-100 rounded px-2 py-1">
                    Loves: Dragons, Space
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              1. Share Details
            </h3>
            <p className="text-slate-600">
              Tell us about your child&apos;s interests and personality
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-8 mb-6">
              <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">
                  AI Creating...
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                  <div className="h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse delay-100"></div>
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              2. AI Magic
            </h3>
            <p className="text-slate-600">
              Our AI crafts a unique story and illustrations just for them
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-100 to-cyan-100 rounded-2xl p-8 mb-6">
              <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-2">
                  Your Storybook
                </div>
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-200 to-pink-200 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-slate-700">
                    Emma&apos;s
                    <br />
                    Space Adventure
                  </span>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              3. Your Story
            </h3>
            <p className="text-slate-600">
              Receive a beautiful, personalized storybook ready to enjoy
            </p>
          </div>
        </div>

        {/* Interactive Story Creation */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              Create Your Story
            </h3>
            <StoryForm onStoryCreated={handleStoryCreated} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              Your Stories
            </h3>
            <StoriesList key={refreshKey} />
          </div>
        </div>

        {/* Sample Book Preview */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Every Story is Unique
              </h3>
              <p className="text-slate-600 mb-6">
                Our AI creates completely original stories tailored to your
                child. No two books are alike, ensuring your child gets a truly
                personal adventure that reflects their interests and
                imagination.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-slate-700">
                    Personalized characters that look like your child
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-slate-700">
                    Stories built around their favorite themes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-slate-700">
                    High-quality illustrations in consistent style
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Book mockup */}
              <div className="relative transform rotate-6 hover:rotate-3 transition-transform duration-500">
                <div className="bg-white rounded-xl shadow-2xl p-6">
                  <div className="aspect-[4/5] bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Sample story content */}
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 bg-yellow-300 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-800">
                          Emma&apos;s Space Adventure
                        </div>
                        <div className="text-xs text-slate-600">
                          Chapter 1: The Magic Rocket
                        </div>
                      </div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-2 right-2 text-lg animate-bounce">
                      ⭐
                    </div>
                    <div className="absolute bottom-2 left-2 text-lg animate-bounce delay-500">
                      🌙
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional floating books */}
              <div className="absolute -top-4 -left-4 transform -rotate-12 opacity-60">
                <div className="bg-white rounded-lg shadow-lg p-3">
                  <div className="w-16 h-20 bg-gradient-to-br from-green-200 to-yellow-200 rounded"></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 transform rotate-12 opacity-60">
                <div className="bg-white rounded-lg shadow-lg p-3">
                  <div className="w-16 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
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
    </section>
  );
}
