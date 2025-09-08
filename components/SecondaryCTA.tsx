import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SecondaryCTA() {
  return (
    <>
      {/* Mid-page CTA - Try Now */}
      <section className="py-16 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Create Your Child&apos;s First Story?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of parents who are already creating magical,
              personalized stories for their children.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/create"
                className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-105 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Start Creating Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                View Sample Stories
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-blue-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-current" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>First story is free</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Ready in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA - Final conversion */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Value proposition */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                  Give Your Child the Gift of Their Own Story
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Create lasting memories with personalized stories that
                  celebrate who your child is. Watch their eyes light up as they
                  become the hero of their very own adventure.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-green-600 text-sm font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Instant Digital Download
                      </div>
                      <div className="text-slate-600 text-sm">
                        Get your story immediately after creation
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-green-600 text-sm font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Print-Ready Quality
                      </div>
                      <div className="text-slate-600 text-sm">
                        High-resolution images perfect for printing
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-green-600 text-sm font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Unlimited Revisions
                      </div>
                      <div className="text-slate-600 text-sm">
                        Adjust and perfect until it&apos;s just right
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/create"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Create Your Story Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="border-2 border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-full hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                    See Pricing Plans
                  </button>
                </div>
              </div>

              {/* Right side - Social proof and testimonials */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-bold">SM</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Sarah M.
                      </div>
                      <div className="text-sm text-slate-500">Mother of 2</div>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">
                    &ldquo;My daughter asks for her personalized story every
                    single night. She loves seeing herself as the brave princess
                    who saves the day. This app is absolutely magical!&rdquo;
                  </p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">MT</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        Ms. Thompson
                      </div>
                      <div className="text-sm text-slate-500">
                        3rd Grade Teacher
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">
                    &ldquo;I use this for my classroom reading program. The kids
                    are so much more engaged when they see themselves in the
                    stories. Reading scores have improved dramatically!&rdquo;
                  </p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-2">
                      10,000+
                    </div>
                    <div className="text-slate-600 mb-4">
                      Happy families worldwide
                    </div>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-slate-600 mt-2">
                      4.9/5 average rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
