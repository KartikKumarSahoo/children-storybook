import { ArrowLeft, BookOpen, Check, Star } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our AI storybook creator",
      features: [
        "3 free stories per month",
        "Basic customization options",
        "Standard AI-generated illustrations",
        "PDF download",
        "Community support",
      ],
      limitations: [
        "Limited character customization",
        "Watermarked images",
      ],
      buttonText: "Get Started Free",
      buttonStyle: "bg-gray-600 hover:bg-gray-700",
      popular: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Unlimited storytelling for growing families",
      features: [
        "Unlimited stories",
        "Advanced character customization",
        "High-quality AI illustrations",
        "Multiple export formats (PDF, HTML, EPUB)",
        "Priority support",
        "Story revision & regeneration",
        "Custom illustration styles",
        "Family story library",
      ],
      limitations: [],
      buttonText: "Start Premium",
      buttonStyle: "bg-purple-600 hover:bg-purple-700",
      popular: true,
    },
    {
      name: "Family",
      price: "$19.99",
      period: "per month",
      description: "Perfect for larger families and educators",
      features: [
        "Everything in Premium",
        "Up to 6 family accounts",
        "Bulk story creation",
        "Educational content templates",
        "Advanced analytics",
        "White-label options",
        "API access",
        "Dedicated account manager",
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonStyle: "bg-green-600 hover:bg-green-700",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
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

      {/* Hero Section */}
      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Storytelling
            </span>{" "}
            Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create magical, personalized stories for your children with our AI-powered platform.
            Start free and upgrade as your storytelling needs grow.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular
                  ? "ring-2 ring-purple-600 scale-105 md:scale-110"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, limitationIndex) => (
                  <div key={limitationIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-500 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan at any time?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens to my stories if I cancel?
              </h3>
              <p className="text-gray-600">
                Your stories remain accessible for 30 days after cancellation. You can download them during this period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial for premium plans?
              </h3>
              <p className="text-gray-600">
                Yes! All premium plans come with a 7-day free trial. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does the AI generate stories?
              </h3>
              <p className="text-gray-600">
                Our AI uses advanced language models trained on children&apos;s literature to create age-appropriate, engaging stories based on your inputs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold">StoryBook AI</span>
          </div>
          <p className="text-gray-400">
            Creating magical stories for children everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}