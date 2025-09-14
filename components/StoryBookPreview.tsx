"use client";

import { StoredStory } from "@/lib/story-storage";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import RegenerationControls from "./RegenerationControls";

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
  const [showRegenerationControls, setShowRegenerationControls] =
    useState(false);
  const [currentStory, setCurrentStory] = useState<StoredStory>(story);

  // Total pages including cover page
  const totalPages = currentStory.pages.length + 1; // +1 for cover page

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

  // Function to generate dynamic background gradient based on favorite color
  const getBackgroundGradient = (favoriteColor?: string) => {
    if (!favoriteColor) {
      // Fallback to default gradient
      return "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500";
    }

    const color = favoriteColor.toLowerCase();

    // Color-specific gradients
    const colorGradients: { [key: string]: string } = {
      red: "bg-gradient-to-br from-red-400 via-pink-500 to-rose-500",
      blue: "bg-gradient-to-br from-blue-400 via-cyan-500 to-indigo-500",
      green: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500",
      yellow: "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500",
      purple: "bg-gradient-to-br from-purple-400 via-violet-500 to-fuchsia-500",
      pink: "bg-gradient-to-br from-pink-400 via-rose-500 to-red-400",
      orange: "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500",
      black: "bg-gradient-to-br from-gray-700 via-slate-800 to-black",
      white: "bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300",
      brown: "bg-gradient-to-br from-amber-600 via-orange-700 to-red-800",
      gray: "bg-gradient-to-br from-gray-400 via-slate-500 to-gray-600",
      turquoise: "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500",
      lime: "bg-gradient-to-br from-lime-400 via-green-500 to-emerald-500",
      indigo: "bg-gradient-to-br from-indigo-400 via-purple-500 to-violet-500",
      coral: "bg-gradient-to-br from-orange-400 via-red-400 to-pink-500",
      gold: "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500",
      silver: "bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500",
      magenta: "bg-gradient-to-br from-fuchsia-400 via-pink-500 to-rose-500",
      cyan: "bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-500",
      violet: "bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500",
    };

    return (
      colorGradients[color] ||
      "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
    );
  };

  const renderCoverPage = () => (
    <div
      className={`h-full ${getBackgroundGradient(
        currentStory.favoriteColor
      )} flex flex-col items-center justify-center text-white p-8 rounded-lg shadow-2xl`}
    >
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-shadow-lg font-child">
          {currentStory.title}
        </h1>
        <div className="mb-6">
          <p className="text-lg md:text-xl opacity-90 font-child">
            A Story About {currentStory.childName}
          </p>
          <p className="text-sm md:text-base opacity-75 mt-2 font-child">
            Age {currentStory.childAge}
          </p>
        </div>
        <div className="text-xs md:text-sm opacity-60 mt-8">
          <p>Created with AI • Personalized Story</p>
          <p className="mt-1">
            {new Date(currentStory.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStoryPage = (pageIndex: number) => {
    const page = currentStory.pages[pageIndex];
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
              <p className="text-gray-800 leading-relaxed text-xl lg:text-2xl xl:text-3xl font-bold tracking-wide font-child">
                {page.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleRegenerationComplete = (updatedStory: StoredStory) => {
    setCurrentStory(updatedStory);
    setImageLoadErrors(new Set()); // Reset image errors for new images
    // Optionally call the parent's onRegenerate callback
    if (onRegenerate) {
      onRegenerate();
    }
  };

  const handleRegenerationError = (error: string) => {
    console.error("Regeneration error:", error);
    // You could show a toast notification here
    alert("Failed to regenerate content: " + error);
  };

  const handleDownload = async () => {
    try {
      // Create a simple HTML version of the storybook for download
      const htmlContent = generateStoryHTML();

      // Create a blob with the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Create a temporary download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentStory.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_storybook.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download storybook. Please try again.");
    }
  };

  const generateStoryHTML = () => {
    const coverPageHTML = `
      <div class="page cover-page" data-page="0" style="
        min-height: 100vh; 
        background: linear-gradient(135deg, 
          ${getGradientColors(currentStory.favoriteColor).from}, 
          ${getGradientColors(currentStory.favoriteColor).via}, 
          ${getGradientColors(currentStory.favoriteColor).to}); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        text-align: center; 
        padding: 2rem;
        position: relative;
      ">
        <div>
          <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem; font-family: 'Comic Sans MS', cursive;">
            ${currentStory.title}
          </h1>
          <p style="font-size: 1.5rem; margin-bottom: 0.5rem; font-family: 'Comic Sans MS', cursive;">
            A Story About ${currentStory.childName}
          </p>
          <p style="font-size: 1.25rem; margin-bottom: 2rem; font-family: 'Comic Sans MS', cursive;">
            Age ${currentStory.childAge}
          </p>
          <p style="font-size: 0.875rem; opacity: 0.8;">
            Created with AI • Personalized Story<br>
            ${new Date(currentStory.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <!-- Turn page hint for cover -->
        <div class="turn-hint" style="
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          animation: bounce 2s infinite;
        ">
          👉 Swipe or click to turn page
        </div>
      </div>
    `;

    const pagesHTML = currentStory.pages
      .map(
        (page, index) => `
      <div class="page story-page" data-page="${index + 1}">
        <div class="image-section">
          ${
            page.imageUrl
              ? `
            <img src="${page.imageUrl}" 
                 alt="Illustration for page ${page.pageNumber}" />
          `
              : `
            <div style="
              width: 100%; 
              height: 300px; 
              background: linear-gradient(135deg, #f3f4f6, #e5e7eb); 
              border-radius: 8px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: #6b7280;
            ">
              <p>Illustration for Page ${page.pageNumber}</p>
            </div>
          `
          }
        </div>
        <div class="text-section">
          <div style="text-align: right; font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
            Page ${page.pageNumber}
          </div>
          <p style="
            font-size: 1.5rem; 
            line-height: 1.8; 
            font-weight: bold; 
            letter-spacing: 0.025em; 
            color: #1f2937;
            font-family: 'Comic Sans MS', cursive;
          ">
            ${page.text}
          </p>
        </div>
        
        ${index === 0 ? `
        <!-- Turn page hint for first story page -->
        <div class="turn-hint" style="
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0,0,0,0.1);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          animation: bounce 2s infinite;
        ">
          👉 Keep swiping to read more
        </div>
        ` : ''}
      </div>
    `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${currentStory.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Comic Sans MS', cursive, system-ui;
            overflow: hidden;
            background: #f0f0f0;
            height: 100vh;
            width: 100vw;
          }
          
          .storybook-container {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .page {
            min-width: 100vw;
            width: 100vw;
            height: 100vh;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          
          .page.turning {
            transform: scale(0.95);
            filter: brightness(0.9);
            z-index: 10;
          }
          
          .navigation {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            background: rgba(0,0,0,0.8);
            padding: 10px 20px;
            border-radius: 25px;
            z-index: 1000;
            gap: 15px;
          }
          
          .nav-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 16px;
            min-width: 40px;
          }
          
          .nav-btn:hover:not(:disabled) {
            background: rgba(255,255,255,0.3);
            transform: scale(1.05);
          }
          
          .nav-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          
          .page-indicator {
            color: white;
            font-size: 14px;
            min-width: 100px;
            text-align: center;
          }
          
          .page-dots {
            display: flex;
            gap: 5px;
          }
          
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .dot.active {
            background: white;
            transform: scale(1.2);
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
          .turn-hint {
            animation: bounce 2s infinite;
          }
          
          /* Story page specific styling */
          .story-page {
            padding: 2rem;
          }
          
          .story-page .image-section {
            width: 50%;
            padding-right: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .story-page .text-section {
            width: 50%;
            padding-left: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .story-page img {
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 8px;
          }
          
          /* Mobile responsive styles */
          @media screen and (max-width: 768px) {
            .story-page {
              flex-direction: column !important;
              padding: 1rem !important;
              overflow-y: auto;
            }
            
            .story-page .image-section,
            .story-page .text-section {
              width: 100% !important;
              padding: 0 !important;
            }
            
            .story-page .image-section {
              margin-bottom: 1.5rem !important;
              max-height: 40vh;
            }
            
            .story-page .text-section > div:first-child {
              text-align: center !important;
            }
            
            .story-page .text-section p {
              font-size: 1.25rem !important;
              text-align: center !important;
              line-height: 1.6 !important;
            }
            
            .turn-hint {
              font-size: 12px !important;
              bottom: 70px !important;
              right: 10px !important;
              padding: 6px 12px !important;
            }
            
            .navigation {
              bottom: 10px;
              padding: 8px 16px;
              gap: 10px;
            }
            
            .nav-btn {
              padding: 6px 10px;
              font-size: 14px;
              min-width: 35px;
            }
            
            .page-indicator {
              font-size: 12px;
              min-width: 80px;
            }
          }
          
          /* Tablet responsive styles */
          @media screen and (max-width: 1024px) and (min-width: 769px) {
            .story-page {
              padding: 1.5rem !important;
            }
            
            .story-page .image-section {
              padding-right: 1rem !important;
            }
            
            .story-page .text-section {
              padding-left: 1rem !important;
            }
          }
          
          /* Hide hints after 10 seconds */
          .turn-hint {
            animation: bounce 2s infinite, fadeOut 1s ease-in-out 10s forwards;
          }
          
          @keyframes fadeOut {
            to {
              opacity: 0;
              pointer-events: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="storybook-container" id="storybook">
          ${coverPageHTML}
          ${pagesHTML}
        </div>
        
        <div class="navigation">
          <button class="nav-btn" id="prevBtn" onclick="previousPage()">‹</button>
          <div class="page-indicator">
            <span id="currentPageText">Cover</span>
          </div>
          <div class="page-dots" id="pageDots"></div>
          <button class="nav-btn" id="nextBtn" onclick="nextPage()">›</button>
        </div>
        
        <script>
          let currentPage = 0;
          const totalPages = ${currentStory.pages.length + 1};
          const container = document.getElementById('storybook');
          const pages = document.querySelectorAll('.page');
          
          // Initialize
          updateNavigation();
          createPageDots();
          updateDisplay();
          
          // Touch and mouse events
          let startX = 0;
          let startTime = 0;
          let isDragging = false;
          
          container.addEventListener('mousedown', handleStart, { passive: false });
          container.addEventListener('touchstart', handleStart, { passive: false });
          container.addEventListener('mousemove', handleMove, { passive: false });
          container.addEventListener('touchmove', handleMove, { passive: false });
          container.addEventListener('mouseup', handleEnd, { passive: false });
          container.addEventListener('touchend', handleEnd, { passive: false });
          container.addEventListener('click', handleClick, { passive: false });
          
          // Keyboard navigation
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              previousPage();
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              nextPage();
            }
          });
          
          function handleStart(e) {
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            startTime = Date.now();
            isDragging = true;
          }
          
          function handleMove(e) {
            if (!isDragging) return;
            // Allow scrolling on mobile for story pages
            if (window.innerWidth <= 768 && currentPage > 0) {
              return;
            }
            e.preventDefault();
          }
          
          function handleEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const timeDiff = Date.now() - startTime;
            
            // Only trigger page change if it's a quick swipe and significant distance
            if (Math.abs(diffX) > 50 && timeDiff < 500) {
              if (diffX > 0) {
                nextPage();
              } else {
                previousPage();
              }
            }
          }
          
          function handleClick(e) {
            if (isDragging) return;
            
            // Don't interfere with mobile scrolling
            if (window.innerWidth <= 768 && currentPage > 0) {
              return;
            }
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            
            if (x > width * 0.7) {
              nextPage();
            } else if (x < width * 0.3) {
              previousPage();
            }
          }
          
          function nextPage() {
            if (currentPage < totalPages - 1) {
              currentPage++;
              updateDisplay();
            }
          }
          
          function previousPage() {
            if (currentPage > 0) {
              currentPage--;
              updateDisplay();
            }
          }
          
          function goToPage(pageIndex) {
            if (pageIndex >= 0 && pageIndex < totalPages) {
              currentPage = pageIndex;
              updateDisplay();
            }
          }
          
          function updateDisplay() {
            const translateX = -currentPage * 100;
            container.style.transform = \`translateX(\${translateX}vw)\`;
            
            // Add turning animation
            pages.forEach((page, index) => {
              page.classList.remove('turning');
              if (index === currentPage - 1 && currentPage > 0) {
                setTimeout(() => page.classList.add('turning'), 100);
                setTimeout(() => page.classList.remove('turning'), 600);
              }
            });
            
            updateNavigation();
            updatePageDots();
          }
          
          function updateNavigation() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const currentPageText = document.getElementById('currentPageText');
            
            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = currentPage === totalPages - 1;
            
            if (currentPage === 0) {
              currentPageText.textContent = 'Cover';
            } else {
              currentPageText.textContent = \`Page \${currentPage}\`;
            }
          }
          
          function createPageDots() {
            const dotsContainer = document.getElementById('pageDots');
            for (let i = 0; i < totalPages; i++) {
              const dot = document.createElement('div');
              dot.className = 'dot';
              if (i === 0) dot.classList.add('active');
              dot.onclick = () => goToPage(i);
              dotsContainer.appendChild(dot);
            }
          }
          
          function updatePageDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
              dot.classList.toggle('active', index === currentPage);
            });
          }
          
          // Handle window resize
          window.addEventListener('resize', () => {
            updateDisplay();
          });
        </script>
      </body>
      </html>
    `;
  };

  const getGradientColors = (favoriteColor?: string) => {
    if (!favoriteColor) {
      return { from: "#60a5fa", via: "#a855f7", to: "#ec4899" };
    }

    const color = favoriteColor.toLowerCase();

    const colorMappings: {
      [key: string]: { from: string; via: string; to: string };
    } = {
      red: { from: "#f87171", via: "#f472b6", to: "#fb7185" },
      blue: { from: "#60a5fa", via: "#22d3ee", to: "#6366f1" },
      green: { from: "#4ade80", via: "#10b981", to: "#14b8a6" },
      yellow: { from: "#facc15", via: "#f59e0b", to: "#f97316" },
      purple: { from: "#a78bfa", via: "#8b5cf6", to: "#d946ef" },
      pink: { from: "#f472b6", via: "#fb7185", to: "#f87171" },
      orange: { from: "#fb923c", via: "#ef4444", to: "#f472b6" },
      black: { from: "#374151", via: "#1e293b", to: "#000000" },
      white: { from: "#f3f4f6", via: "#e2e8f0", to: "#d1d5db" },
      brown: { from: "#d97706", via: "#ea580c", to: "#dc2626" },
      gray: { from: "#9ca3af", via: "#64748b", to: "#6b7280" },
      turquoise: { from: "#2dd4bf", via: "#22d3ee", to: "#3b82f6" },
      lime: { from: "#a3e635", via: "#22c55e", to: "#10b981" },
      indigo: { from: "#818cf8", via: "#a855f7", to: "#8b5cf6" },
      coral: { from: "#fb923c", via: "#f87171", to: "#f472b6" },
      gold: { from: "#fde047", via: "#fbbf24", to: "#f97316" },
      silver: { from: "#d1d5db", via: "#94a3b8", to: "#9ca3af" },
      magenta: { from: "#e879f9", via: "#f472b6", to: "#fb7185" },
      cyan: { from: "#22d3ee", via: "#14b8a6", to: "#3b82f6" },
      violet: { from: "#8b5cf6", via: "#a855f7", to: "#6366f1" },
    };

    return (
      colorMappings[color] || { from: "#60a5fa", via: "#a855f7", to: "#ec4899" }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800 truncate">
              {currentStory.title}
            </h2>
            <span className="text-sm text-gray-500">
              {currentPage === 0 ? "Cover" : `Page ${currentPage}`} of{" "}
              {totalPages}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setShowRegenerationControls(!showRegenerationControls)
              }
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title="Regeneration options"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Regenerate</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Download story"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Close preview"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Regeneration Controls */}
        {showRegenerationControls && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <RegenerationControls
              story={currentStory}
              onRegenerationComplete={handleRegenerationComplete}
              onError={handleRegenerationError}
            />
          </div>
        )}

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
