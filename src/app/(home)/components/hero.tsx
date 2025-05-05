import { Button } from "@/components/ui/button";
import PreviewImage from "./preview";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background gradient with dark mode support */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-black dark:to-black">
        {/* Light mode gradient blurs */}
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/4 -translate-y-1/2 rounded-full bg-purple-400/20 blur-3xl"></div>
        <div className="absolute right-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-3xl"></div>

        {/* Dark mode gradient glows with blend modes */}
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/4 -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl mix-blend-lighten hidden dark:block"></div>
        <div className="absolute right-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-indigo-500/15 blur-3xl mix-blend-lighten hidden dark:block"></div>
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl mix-blend-lighten hidden dark:block"></div>
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center md:px-6">
        {/* New feature badge with improved glassmorphism */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-1.5 backdrop-blur-md shadow-sm relative overflow-hidden transition-all duration-300 hover:bg-white/30 hover:shadow-2xl hover:cursor-pointer dark:bg-neutral-800/40 dark:border-white/10">
          {/* Subtle inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
          <span className="rounded-full bg-[#3b82f6] px-2 py-0.5 text-xs font-medium text-white relative z-10 dark:bg-[#3b82f6]">
            New
          </span>
          <span className="text-sm font-medium text-gray-700 relative z-10 dark:text-neutral-200">
            We&apos;ve just released a new feature →
          </span>
        </div>

        {/* Headline with dark mode support */}
        <h1 className="mb-4 max-w-4xl text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl md:text-6xl dark:text-white">
          Boost Your{" "}
          <span className="bg-gradient-to-r from-[#3b82f6] to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Productivity,
          </span>
          <br />
          Simplify Your Life
        </h1>

        {/* Subheading with dark mode support */}
        <p className="mb-8 max-w-2xl text-lg text-gray-500 dark:text-neutral-400">
          We&apos;re here to simplify the intricacies of your life, providing a
          user-friendly platform that not only manages your tasks effortlessly
          but also enhances your overall efficiency.
        </p>

        {/* CTA Buttons with enhanced hover effects */}
        <div className="mb-16 flex flex-wrap justify-center gap-4">
          {/* Get Started Button */}
          <Button
            size="lg"
            className="rounded-full bg-[#3b82f6] px-8 text-white font-medium transition-all duration-300 ease-in-out
               hover:scale-105 hover:bg-gradient-to-r hover:from-[#3b82f6] hover:to-indigo-600
               hover:shadow-lg dark:bg-[#3b82f6] dark:hover:from-blue-500 dark:hover:to-purple-600"
          >
            Get Started
          </Button>

          {/* Preview Platform Button */}
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border border-transparent bg-transparent px-8 font-medium relative group overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(to right, #3b82f6, #6366f1)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <span className="bg-gradient-to-r from-[#3b82f6] to-indigo-500 bg-clip-text text-transparent transition-all duration-300 dark:from-blue-400 dark:to-purple-400">
              Preview Platform
            </span>
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#3b82f6] to-indigo-500 -z-10"></div>
          </Button>
        </div>

        {/* Dashboard Preview - Static Image in Enhanced Glassmorphism Container */}
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/50 bg-white/20 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:shadow-2xl hover:cursor-pointer dark:bg-neutral-800/30 dark:border-white/10">
          <div className="rounded-xl overflow-hidden">
            <PreviewImage />
          </div>
        </div>
      </div>
    </section>
  );
}
