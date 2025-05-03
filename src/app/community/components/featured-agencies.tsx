import type React from "react";
import FeaturedAgenciesCarousel from "./featured-agencies-carousel";
import AgencyManager from "@/lib/managers/agencyManager";

export default async function FeaturedAgencies() {
  const agencies = (await AgencyManager.findTopRanked()).map((a) => ({
    ...a,
    postCount: Number(a.postCount),
    commentCount: Number(a.commentCount),
    score: Number(a.score),
  }));

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
