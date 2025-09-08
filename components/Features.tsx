import { Download, Heart, Palette, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Stories",
      description:
        "Advanced AI creates unique narratives tailored to your child's personality and interests.",
      color: "from-yellow-400 to-orange-400",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Custom Illustrations",
      description:
        "Beautiful, consistent artwork generated specifically for your child's story.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Character Diversity",
      description:
        "Create characters that represent your child and their world authentically.",
      color: "from-green-400 to-cyan-400",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Multiple Formats",
      description:
        "Download as PDF, order printed copies, or share digitally with family.",
      color: "from-blue-400 to-indigo-400",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Child-Safe Content",
      description:
        "All stories are age-appropriate with positive messages and values.",
      color: "from-emerald-400 to-teal-400",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Creation",
      description:
        "Generate complete storybooks in minutes, not hours or days.",
      color: "from-amber-400 to-yellow-400",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Powerful Features for Perfect Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to create magical, personalized storybooks that
            your child will treasure forever
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Create Your First Story?
            </h3>
            <p className="text-slate-600 mb-6">
              Join thousands of parents who have already created magical
              memories for their children
            </p>
            <Link
              href="/create"
              className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Start Creating Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
