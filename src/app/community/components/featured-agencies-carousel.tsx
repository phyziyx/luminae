"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TopRankedAgency } from "@/lib/types";
import Avatar from "@/components/site/avatar";

export default function FeaturedAgenciesCarousel({
  agencies,
}: {
  agencies: Array<TopRankedAgency>;
}) {
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
    <Carousel
      setApi={setApi}
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {agencies.map((agency, index) => (
          <CarouselItem key={agency.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <AgencyCard
                agency={{
                  ...agency,
                  rank: index + 1,
                }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {current} of {count}
        </span>
        <div className="flex gap-2">
          <CarouselPrevious className="bg-white dark:bg-muted/30 static translate-y-0" />
          <CarouselNext className="bg-white dark:bg-muted/30 static translate-y-0" />
        </div>
      </div>
    </Carousel>
  );
}

function AgencyCard({ agency }: { agency: TopRankedAgency }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-transparent transition-all duration-300 hover:shadow-soft">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        // style={{
        //   background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(91, 154, 255, 0.15), transparent 40%)`,
        // }}
      />
      <CardContent className="relative z-10 flex flex-col items-center gap-4 rounded-lg bg-white/90 dark:bg-gray-800/90 p-6 backdrop-blur-sm shadow-soft">
        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary dark:bg-primary-light text-sm font-bold text-primary-foreground dark:text-gray-900">
          #{agency.rank || "0"}
        </div>
        <div className="mt-4 flex flex-col items-center">
          <Avatar
            profileImage={agency.agencyLogo}
            name={agency.name}
            className="mb-3 h-20 w-20 border-4 border-primary dark:border-primary-light"
          />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {agency.name}
          </h3>
        </div>
        <div className="flex w-full justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <span className="font-medium">{agency.postCount}</span> posts
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">{agency.commentCount}</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span className="font-medium">{agency._count.likes}</span>
          </div> */}
        </div>
      </CardContent>
      <CardFooter className="bg-white/90 dark:bg-gray-800/90 p-4 backdrop-blur-sm shadow-soft">
        <Button
          className="w-full bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          asChild
        >
          <Link href={`/community/profile/a-${agency.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
