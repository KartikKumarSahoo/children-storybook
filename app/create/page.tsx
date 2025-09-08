import StoryForm from "@/components/StoryForm";

export default function CreateStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Create Your Child&apos;s
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                {" "}
                Magical Story
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about your child and we&apos;ll create a personalized
              storybook just for them!
            </p>
          </div>
          <StoryForm />
        </div>
      </div>
    </div>
  );
}
