import type React from "react";
import FeaturedAgenciesCarousel from "./featured-agencies-carousel";
import prisma from "@/lib/db";

// const topAgencies: Agency[] = [
//   {
//     id: 1,
//     rank: 1,
//     name: "Stellar Digital",
//     profilePic: "/placeholder.svg?height=80&width=80",
//     posts: 342,
//     comments: 1204,
//     likes: 5678,
//   },
//   {
//     id: 2,
//     rank: 2,
//     name: "Nexus Creative",
//     profilePic: "/placeholder.svg?height=80&width=80",
//     posts: 287,
//     comments: 982,
//     likes: 4321,
//   },
//   {
//     id: 3,
//     rank: 3,
//     name: "Horizon Media",
//     profilePic: "/placeholder.svg?height=80&width=80",
//     posts: 256,
//     comments: 876,
//     likes: 3987,
//   },
//   {
//     id: 4,
//     rank: 4,
//     name: "Pulse Interactive",
//     profilePic: "/placeholder.svg?height=80&width=80",
//     posts: 198,
//     comments: 754,
//     likes: 2876,
//   },
//   {
//     id: 5,
//     rank: 5,
//     name: "Vertex Solutions",
//     profilePic: "/placeholder.svg?height=80&width=80",
//     posts: 176,
//     comments: 623,
//     likes: 2543,
//   },
// ];

export default async function FeaturedAgencies() {
  const agencies = await prisma.agency.findMany({
    take: 5,
    select: {
      id: true,
      agencyLogo: true,
      name: true,
      _count: {
        select: {
          comments: true,
          posts: true,
        },
      },
    },
  });

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
        Top Ranked{" "}
        <span className="text-[#5B9AFF] dark:text-[#3B82F6]">Agencies</span>
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#3B82F6]"></div>
      </h2>
      <FeaturedAgenciesCarousel agencies={agencies} />
    </section>
  );
}
