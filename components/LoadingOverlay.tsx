import Image from "next/image";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isVisible,
  message = "Creating your magical story...",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Background magical elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-2xl text-yellow-300 animate-pulse">
          📚
        </div>
        <div className="absolute top-20 right-20 text-xl text-blue-300 animate-pulse [animation-delay:0.5s]">
          ✍️
        </div>
        <div className="absolute bottom-20 left-20 text-2xl text-pink-300 animate-pulse [animation-delay:1s]">
          🌟
        </div>
        <div className="absolute bottom-10 right-10 text-xl text-purple-300 animate-pulse [animation-delay:1.5s]">
          📖
        </div>
        <div className="absolute top-1/2 left-5 text-lg text-green-300 animate-pulse [animation-delay:2s]">
          🎨
        </div>
        <div className="absolute top-1/3 right-5 text-lg text-orange-300 animate-pulse [animation-delay:2.5s]">
          🖋️
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md mx-4 relative">
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto relative">
            <Image
              src="/storybook.png"
              alt="Creating storybook"
              fill
              className="object-contain animate-pulse"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          {/* Floating sparkles animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-4 text-yellow-400 animate-bounce">
              ✨
            </div>
            <div className="absolute top-8 right-6 text-blue-400 animate-bounce [animation-delay:0.3s]">
              ⭐
            </div>
            <div className="absolute bottom-6 left-8 text-pink-400 animate-bounce [animation-delay:0.6s]">
              ✨
            </div>
            <div className="absolute bottom-2 right-4 text-purple-400 animate-bounce [animation-delay:0.9s]">
              ⭐
            </div>
            <div className="absolute top-1/2 left-2 text-green-400 animate-bounce [animation-delay:1.2s]">
              ✨
            </div>
            <div className="absolute top-1/2 right-2 text-orange-400 animate-bounce [animation-delay:1.5s]">
              ⭐
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-800 mb-2">{message}</h3>
        <p className="text-slate-600 text-sm">This may take a few moments...</p>

        {/* Progress dots animation */}
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>
    </div>
  );
}
