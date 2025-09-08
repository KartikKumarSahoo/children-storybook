import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-yellow-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-yellow-100/20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/storybook-creator-logo.png"
                alt="Storybook Creator Logo"
                width={300}
                height={200}
                className="w-auto h-24 sm:h-32 object-contain"
                priority
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-blue-800 border border-blue-200">
              <Sparkles className="w-4 h-4" />
              Powered by AI Magic
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              Create{" "}
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                Magical Stories
              </span>{" "}
              Just for Your Child
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Transform your child into the hero of their own personalized
              storybook. Our AI creates unique illustrations and narratives
              tailored to their interests, traits, and imagination.
            </p>

            {/* Key benefits */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Personalized Characters
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                AI-Generated Art
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Unique Stories
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/create">
                <button
                  className="group bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                  aria-label="Start creating your child's personalized storybook"
                >
                  Create Your Story
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <button
                className="border-2 border-yellow-400 hover:border-yellow-500 text-yellow-600 hover:text-yellow-700 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:bg-yellow-50"
                aria-label="View example storybooks"
              >
                See Examples
              </button>
            </div>
          </div>

          {/* Right column - Hero image */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-300 rounded-full opacity-70 animate-pulse delay-1000"></div>

              {/* Main hero image placeholder */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/5] bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-yellow-200 rounded-full mx-auto flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-yellow-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-slate-800">
                        Your Child&apos;s Adventure
                      </div>
                      <div className="text-sm text-slate-600">
                        Personalized just for them
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating story elements */}
              <div className="absolute top-8 -right-8 bg-white rounded-lg shadow-lg p-3 transform -rotate-12 animate-bounce">
                <div className="text-2xl">🚀</div>
              </div>
              <div className="absolute bottom-8 -left-8 bg-white rounded-lg shadow-lg p-3 transform rotate-12 animate-bounce delay-500">
                <div className="text-2xl">🌟</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
