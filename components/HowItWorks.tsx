import { BookOpen, Download, User, Wand2 } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: <User className="w-8 h-8" />,
      title: "Tell Us About Your Child",
      description:
        "Share your child's name, age, appearance, interests, and personality traits. The more details, the more personalized the story!",
      details: [
        "Basic info (name, age, appearance)",
        "Favorite activities and hobbies",
        "Personality traits and characteristics",
        "Friends or family to include",
      ],
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "Choose Story Elements",
      description:
        "Select themes, settings, and any specific lessons or morals you'd like woven into the adventure.",
      details: [
        "Story themes (adventure, fantasy, sci-fi)",
        "Settings and environments",
        "Educational elements or morals",
        "Length and complexity level",
      ],
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "AI Creates Your Story",
      description:
        "Our advanced AI generates a unique narrative and creates beautiful, consistent illustrations in just minutes.",
      details: [
        "Original story creation",
        "Character design and consistency",
        "Professional-quality illustrations",
        "Age-appropriate content review",
      ],
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Download & Enjoy",
      description:
        "Receive your personalized storybook as a high-quality PDF, ready to read, print, or share with family.",
      details: [
        "High-resolution PDF download",
        "Print-ready format",
        "Digital sharing options",
        "Option to order printed copies",
      ],
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Creating your child&apos;s personalized storybook is simple and
            takes just minutes
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl text-white">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500 mb-1">
                      Step {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-lg text-slate-600 mb-6">
                  {step.description}
                </p>

                <div className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-xs font-bold">
                          ✓
                        </span>
                      </div>
                      <span className="text-slate-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div
                className={
                  index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                }
              >
                <div className="relative">
                  {/* Main visual container */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg">
                    <div className="aspect-square bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      {/* Step-specific visuals */}
                      {index === 0 && (
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto flex items-center justify-center">
                            <span className="text-3xl">👧</span>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-2 text-xs">
                              <div className="text-slate-600">Name: Emma</div>
                            </div>
                            <div className="bg-white rounded-lg p-2 text-xs">
                              <div className="text-slate-600">
                                Loves: Dragons 🐉
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {index === 1 && (
                        <div className="text-center space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-purple-200 rounded-lg p-3 text-center">
                              <span className="text-lg">🏰</span>
                              <div className="text-xs mt-1 text-slate-600">
                                Fantasy
                              </div>
                            </div>
                            <div className="bg-blue-200 rounded-lg p-3 text-center">
                              <span className="text-lg">🚀</span>
                              <div className="text-xs mt-1 text-slate-600">
                                Space
                              </div>
                            </div>
                            <div className="bg-green-200 rounded-lg p-3 text-center">
                              <span className="text-lg">🌳</span>
                              <div className="text-xs mt-1 text-slate-600">
                                Nature
                              </div>
                            </div>
                            <div className="bg-yellow-200 rounded-lg p-3 text-center">
                              <span className="text-lg">⭐</span>
                              <div className="text-xs mt-1 text-slate-600">
                                Magic
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-purple-300 rounded-full mx-auto flex items-center justify-center animate-spin">
                            <Wand2 className="w-8 h-8 text-purple-700" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                            <div className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse delay-100"></div>
                            <div className="h-2 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full animate-pulse delay-200"></div>
                          </div>
                          <div className="text-xs text-slate-600">
                            Creating magic...
                          </div>
                        </div>
                      )}

                      {index === 3 && (
                        <div className="text-center space-y-4">
                          <div className="w-20 h-24 bg-white rounded-lg shadow-lg mx-auto flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-lg">📖</span>
                              <div className="text-xs text-slate-600 mt-1">
                                Emma&apos;s
                                <br />
                                Adventure
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Download className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xs">📧</span>
                            </div>
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 text-xs">
                                🖨️
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connecting line to next step */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-16 bg-gradient-to-b from-slate-300 to-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Start the Magic?
            </h3>
            <p className="text-slate-600 mb-6">
              Create your child&apos;s first personalized storybook in just a
              few minutes
            </p>
            <Link
              href="/create"
              className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Begin Your Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
