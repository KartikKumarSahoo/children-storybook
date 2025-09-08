"use client";

import { StoredStory } from "@/lib/story-storage";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Home,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface StoryBookPreviewProps {
  story: StoredStory;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate?: () => void;
  onDownload?: () => void;
}

export default function StoryBookPreview({
  story,
  onClose,
  onRegenerate,
}: StoryBookPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(
    new Set()
  );

  // Total pages including cover page
  const totalPages = story.pages.length + 1; // +1 for cover page

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = (pageIndex: number) => {
    setIsImageLoading(false);
    setImageLoadErrors((prev) => new Set(prev).add(pageIndex));
  };

  const handleImageLoadStart = () => {
    setIsImageLoading(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevPage();
      } else if (e.key === "ArrowRight") {
        nextPage();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextPage, prevPage, onClose]);

  const renderCoverPage = () => (
    <div className="h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white p-8 rounded-lg shadow-2xl">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-shadow-lg">
          {story.title}
        </h1>
        <div className="mb-6">
          <p className="text-lg md:text-xl opacity-90">
            A Story About {story.childName}
          </p>
          <p className="text-sm md:text-base opacity-75 mt-2">
            Age {story.childAge}
          </p>
        </div>
        <div className="text-xs md:text-sm opacity-60 mt-8">
          <p>Created with AI • Personalized Story</p>
          <p className="mt-1">
            {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStoryPage = (pageIndex: number) => {
    const page = story.pages[pageIndex];
    const hasImage = page.imageUrl && !imageLoadErrors.has(pageIndex);

    return (
      <div className="h-full bg-white flex flex-col lg:flex-row rounded-lg shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 relative">
          {hasImage ? (
            <div className="relative w-full h-full max-w-md max-h-96 lg:max-h-full">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              <Image
                src={page.imageUrl || ""}
                alt={`Illustration for page ${page.pageNumber}`}
                width={400}
                height={300}
                className="w-full h-full object-contain rounded-lg"
                onLoad={handleImageLoad}
                onError={() => handleImageError(pageIndex)}
                onLoadStart={handleImageLoadStart}
                priority={currentPage === 0} // Prioritize cover image
              />
            </div>
          ) : (
            <div className="w-full h-full max-w-md max-h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm">Illustration Loading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="text-right text-sm text-gray-500 font-medium">
              Page {page.pageNumber}
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed text-lg lg:text-xl font-serif">
                {page.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800 truncate">
              {story.title}
            </h2>
            <span className="text-sm text-gray-500">
              {currentPage === 0 ? "Cover" : `Page ${currentPage}`} of{" "}
              {totalPages}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                title="Regenerate story"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            )}
            <button
              onClick={() => {
                /* TODO: Download functionality */
              }}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Download story"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Close preview"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentPage === 0
            ? renderCoverPage()
            : renderStoryPage(currentPage - 1)}
        </div>

        {/* Navigation Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Page Indicators */}
            <div className="flex space-x-1 overflow-x-auto">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    currentPage === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index === 0 ? "C" : index}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
