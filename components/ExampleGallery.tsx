import { ArrowRight, Star } from "lucide-react";

export default function ExampleGallery() {
  const storyExamples = [
    {
      title: "Emma's Space Adventure",
      theme: "Science Fiction",
      character: "Astronaut Emma",
      description:
        "Join Emma as she discovers a magical planet full of friendly aliens and cosmic wonders.",
      gradient: "from-purple-400 via-blue-400 to-cyan-400",
      icon: "🚀",
      age: "Ages 5-8",
    },
    {
      title: "Alex's Dragon Quest",
      theme: "Fantasy Adventure",
      character: "Knight Alex",
      description:
        "Follow brave Alex on a quest to befriend a lonely dragon and save the enchanted kingdom.",
      gradient: "from-emerald-400 via-green-400 to-teal-400",
      icon: "🐉",
      age: "Ages 6-10",
    },
    {
      title: "Maya's Ocean Discovery",
      theme: "Underwater Adventure",
      character: "Marine Biologist Maya",
      description:
        "Dive deep with Maya to explore coral reefs and make friends with sea creatures.",
      gradient: "from-blue-400 via-cyan-400 to-teal-400",
      icon: "🐠",
      age: "Ages 4-7",
    },
    {
      title: "Zoe's Jungle Safari",
      theme: "Nature Exploration",
      character: "Explorer Zoe",
      description:
        "Trek through the rainforest with Zoe as she learns about wildlife and conservation.",
      gradient: "from-green-400 via-lime-400 to-yellow-400",
      icon: "🦋",
      age: "Ages 5-9",
    },
    {
      title: "Sam's Time Machine",
      theme: "Historical Adventure",
      character: "Inventor Sam",
      description:
        "Travel through time with Sam to meet dinosaurs, ancient civilizations, and more.",
      gradient: "from-orange-400 via-red-400 to-pink-400",
      icon: "⏰",
      age: "Ages 7-11",
    },
    {
      title: "Luna's Magical Forest",
      theme: "Fairy Tale Fantasy",
      character: "Fairy Luna",
      description:
        "Enter an enchanted forest where Luna learns magic and helps woodland creatures.",
      gradient: "from-pink-400 via-purple-400 to-indigo-400",
      icon: "🧚‍♀️",
      age: "Ages 3-6",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Story Examples & Themes
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore the variety of magical adventures we can create for your
            child
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {storyExamples.map((story, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Story Cover */}
              <div
                className={`relative h-48 bg-gradient-to-br ${story.gradient} flex items-center justify-center`}
              >
                <div className="text-6xl mb-4">{story.icon}</div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
                  {story.age}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-sm font-semibold text-slate-800">
                      {story.title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Details */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-full">
                    {story.theme}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {story.character}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {story.description}
                </p>

                <button className="group/btn flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
                  Preview Story
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Story Themes Section */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Popular Story Themes
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our AI can create stories in any theme your child loves. Here are
              some of our most popular categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Adventure", icon: "⛰️", count: "150+ stories" },
              { name: "Fantasy", icon: "🧙‍♂️", count: "200+ stories" },
              { name: "Science", icon: "🔬", count: "80+ stories" },
              { name: "Animals", icon: "🦁", count: "120+ stories" },
              { name: "Space", icon: "🌌", count: "90+ stories" },
              { name: "Ocean", icon: "🌊", count: "70+ stories" },
              { name: "Friendship", icon: "👫", count: "110+ stories" },
              { name: "Family", icon: "👨‍👩‍👧‍👦", count: "85+ stories" },
              { name: "Sports", icon: "⚽", count: "60+ stories" },
              { name: "Music", icon: "🎵", count: "45+ stories" },
              { name: "Art", icon: "🎨", count: "55+ stories" },
              { name: "Cooking", icon: "👨‍🍳", count: "40+ stories" },
            ].map((theme, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">{theme.icon}</div>
                <div className="font-semibold text-slate-800 text-sm mb-1">
                  {theme.name}
                </div>
                <div className="text-xs text-slate-500">{theme.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Character Customization Preview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Every Character is Unique
            </h3>
            <p className="text-slate-600 mb-6">
              Our AI creates characters that truly represent your child,
              including their appearance, personality traits, and interests. No
              generic templates - every illustration is original.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <span className="text-slate-700">
                  Customizable appearance and clothing
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <span className="text-slate-700">
                  Personality traits reflected in the story
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <span className="text-slate-700">
                  Include friends and family members
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <span className="text-slate-700">
                  Consistent character design throughout
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Character variations */}
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-pink-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👧</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Princess Sarah
                </div>
                <div className="text-xs text-slate-600">
                  Age 6, Loves horses
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👦</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Captain Jake
                </div>
                <div className="text-xs text-slate-600">
                  Age 8, Loves pirates
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-lime-100 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👧</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Dr. Maya
                </div>
                <div className="text-xs text-slate-600">
                  Age 7, Loves science
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 text-center">
                <div className="w-16 h-16 bg-yellow-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👦</span>
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Chef Leo
                </div>
                <div className="text-xs text-slate-600">
                  Age 5, Loves cooking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
