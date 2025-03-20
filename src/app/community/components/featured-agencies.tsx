"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define a proper type for agencies
interface Agency {
  id: number;
  rank: number;
  name: string;
  profilePic: string;
  posts: number;
  comments: number;
  likes: number;
}

// Sample data for top agencies
const topAgencies: Agency[] = [
  {
    id: 1,
    rank: 1,
    name: "Stellar Digital",
    profilePic: "/placeholder.svg?height=80&width=80",
    posts: 342,
    comments: 1204,
    likes: 5678,
  },
  {
    id: 2,
    rank: 2,
    name: "Nexus Creative",
    profilePic: "/placeholder.svg?height=80&width=80",
    posts: 287,
    comments: 982,
    likes: 4321,
  },
  {
    id: 3,
    rank: 3,
    name: "Horizon Media",
    profilePic: "/placeholder.svg?height=80&width=80",
    posts: 256,
    comments: 876,
    likes: 3987,
  },
  {
    id: 4,
    rank: 4,
    name: "Pulse Interactive",
    profilePic: "/placeholder.svg?height=80&width=80",
    posts: 198,
    comments: 754,
    likes: 2876,
  },
  {
    id: 5,
    rank: 5,
    name: "Vertex Solutions",
    profilePic: "/placeholder.svg?height=80&width=80",
    posts: 176,
    comments: 623,
    likes: 2543,
  },
];

export default function FeaturedAgencies() {
  const [api, setApi] = useState<unknown>(null); // Replaced `any` with `unknown`
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    if (!api || typeof api !== "object" || !("scrollNext" in api)) return;

    const interval = setInterval(() => {
      (api as { scrollNext: () => void }).scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  // Update current slide index when carousel changes
  useEffect(() => {
    if (!api || typeof api !== "object") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCount((api as { scrollSnapList: () => any }).scrollSnapList().length);
    setCurrent(
      (api as { selectedScrollSnap: () => number }).selectedScrollSnap() + 1
    );

    (api as { on: (event: string, callback: () => void) => void }).on(
      "select",
      () => {
        setCurrent(
          (api as { selectedScrollSnap: () => number }).selectedScrollSnap() + 1
        );
      }
    );
  }, [api]);

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
        Top Ranked Agencies
      </h2>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {topAgencies.map((agency) => (
            <CarouselItem key={agency.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <AgencyCard agency={agency} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {current} of {count}
          </span>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>
      </Carousel>
    </section>
  );
}

function AgencyCard({ agency }: { agency: Agency }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Card
      className="relative overflow-hidden border-0 bg-transparent transition-all duration-300 hover:shadow-soft"
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(91, 154, 255, 0.15), transparent 40%)`,
        }}
      />
      <CardContent className="relative z-10 flex flex-col items-center gap-4 rounded-lg bg-white/90 p-6 backdrop-blur-sm shadow-soft">
        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          #{agency.rank}
        </div>
        <div className="mt-4 flex flex-col items-center">
          <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-primary">
            <Image
              src={agency.profilePic || "/placeholder.svg"}
              alt={agency.name}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{agency.name}</h3>
        </div>
        <div className="flex w-full justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">{agency.posts}</span> posts
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">{agency.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span className="font-medium">{agency.likes}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-white/90 p-4 backdrop-blur-sm shadow-soft">
        <Button
          className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          asChild
        >
          <Link href={`/agency/${agency.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
