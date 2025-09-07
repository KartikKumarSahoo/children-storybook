import { GraduationCap, Heart } from "lucide-react";

export default function Benefits() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Benefits for Parents & Educators
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover how personalized storybooks can transform reading time and
            learning experiences
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* For Parents */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  For Parents
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Boost Reading Engagement
                  </h4>
                  <p className="text-slate-600">
                    Children are 3x more likely to read stories where they are
                    the main character, fostering a love of reading that lasts a
                    lifetime.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Build Self-Confidence
                  </h4>
                  <p className="text-slate-600">
                    Seeing themselves as the hero helps children develop
                    positive self-image and confidence in their abilities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Quality Bonding Time
                  </h4>
                  <p className="text-slate-600">
                    Create special moments reading together while your child
                    sees their dreams come to life on every page.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Celebrate Uniqueness
                  </h4>
                  <p className="text-slate-600">
                    Every child gets to see themselves represented in
                    literature, promoting inclusivity and self-acceptance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Educators */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  For Educators
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Increase Classroom Engagement
                  </h4>
                  <p className="text-slate-600">
                    Students are more attentive and participative when learning
                    through stories that feature their classmates and interests.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Promote Inclusivity
                  </h4>
                  <p className="text-slate-600">
                    Create classroom stories that represent all students,
                    fostering an inclusive environment where everyone feels
                    valued.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Enhance Learning Outcomes
                  </h4>
                  <p className="text-slate-600">
                    Personalized stories improve comprehension and retention by
                    connecting learning to students&apos; personal experiences.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Save Preparation Time
                  </h4>
                  <p className="text-slate-600">
                    Generate custom teaching materials in minutes instead of
                    hours, freeing up time for direct student interaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Placeholder */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              What Parents & Educators Say
            </h3>
            <p className="text-slate-600">
              Real feedback from families and classrooms using our personalized
              storybooks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                &quot;My daughter Sofia was never interested in reading until
                she got her own space adventure story. Now she reads it every
                night!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                <div>
                  <div className="font-semibold text-slate-800">
                    Maria Rodriguez
                  </div>
                  <div className="text-sm text-slate-500">Parent</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                &quot;I use personalized stories in my classroom to teach
                empathy and problem-solving. The engagement is incredible!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"></div>
                <div>
                  <div className="font-semibold text-slate-800">
                    Ms. Sarah Chen
                  </div>
                  <div className="text-sm text-slate-500">
                    3rd Grade Teacher
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                &quot;The quality of the illustrations and story is amazing.
                It&apos;s like having a professional author write just for your
                child.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                <div>
                  <div className="font-semibold text-slate-800">
                    David Thompson
                  </div>
                  <div className="text-sm text-slate-500">Parent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
