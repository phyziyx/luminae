"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Heading from "./heading";

interface TimelineStep {
  number: number;
  title: string;
  description: string;
  imageSrc: string;
}

export default function VerticalTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sample timeline data
  const timelineSteps: TimelineStep[] = [
    {
      number: 1,
      title: "Create Your Agency",
      description:
        "Just select 'I'm an agency owner', fill out a quick form, and your workspace is ready.",
      imageSrc: "/assets/timeline/step_one.gif",
    },
    {
      number: 2,
      title: "Invite Your Team",
      description:
        "Head to the Teams tab to invite members and assign the exact permissions you want.",
      imageSrc: "/assets/timeline/step_two.gif",
    },
    {
      number: 3,
      title: "Manage Tasks Visually",
      description:
        "Use the Kanban board to create lanes, drag tasks, and assign them to your team.",
      imageSrc: "/assets/timeline/step_three.gif",
    },
    {
      number: 4,
      title: "Track KPIs Instantly",
      description:
        "See earnings, losses, live tickets, clients, and your conversion rate — all in one view.",
      imageSrc: "/assets/timeline/step_four.png",
    },
    {
      number: 5,
      title: "Join the Community",
      description:
        "Set up your profile, share insights, and get your agency seen by thousands.",
      imageSrc: "/assets/timeline/step_five.png",
    },
  ];

  // Animation for timeline line based on scroll position
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const timelinePosition =
        timeline.getBoundingClientRect().top + window.scrollY;
      const timelineHeight = timeline.offsetHeight;

      // Calculate how far down the timeline we've scrolled (0 to 1)
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (scrollPosition - timelinePosition + window.innerHeight * 0.5) /
            (timelineHeight - window.innerHeight * 0.5)
        )
      );

      // Apply the animation to the timeline line
      const timelineLine = timeline.querySelector(
        ".timeline-line"
      ) as HTMLElement;
      if (timelineLine) {
        // Adjust the gradient position based on scroll
        const gradientPosition = 100 - scrollProgress * 100;
        timelineLine.style.backgroundPosition = `center ${gradientPosition}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <Heading>How Luminae Works</Heading>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto dark:text-gray-400">
            From signup to launch, Luminae streamlines your agency&apos;s
            workflow in minutes. Here&apos;s how we help you turn scattered
            systems into a unified, high-converting client experience — without
            the chaos.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto">
          {/* Animated Timeline Line */}
          <div
            className="timeline-line absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-blue-500 to-purple-500 bg-[length:100%_200%]"
            style={{
              animation: "gradientMove 8s linear infinite",
              willChange: "transform, background-position",
            }}
          />

          {/* Timeline Steps */}
          {timelineSteps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-16 md:mb-24 last:mb-0",
                index % 2 !== 0 && "md:flex-row-reverse"
              )}
            >
              {/* Timeline Connector and Number Badge */}
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {step.number}
                </div>
                <div className="w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0"></div>
              </div>

              {/* Content Container */}
              <div className="w-full md:w-[calc(50%-2rem)] pt-10">
                {/* Text Content */}
                <div
                  className="bg-white/30 dark:bg-neutral-800/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg transition-all duration-300 hover:scale-105 dark:text-white"
                  aria-label={`Step ${step.number}: ${step.title}`}
                >
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Image Container */}
              <div className="w-full md:w-[calc(50%-2rem)] pt-10">
                <div className="bg-white/30 dark:bg-neutral-800/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg overflow-hidden transition-all duration-300 hover:scale-105">
                  <Image
                    src={step.imageSrc || "/placeholder.svg"}
                    alt={`Illustration for ${step.title}`}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl object-cover animate-subtle-float"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% {
            background-position: center 0%;
          }
          100% {
            background-position: center 200%;
          }
        }

        .animate-subtle-float {
          animation: subtle-float 6s ease-in-out infinite;
        }

        @keyframes subtle-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
}
