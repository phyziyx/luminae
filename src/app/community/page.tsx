import Navigation from "../(home)/components/navigation";
import Categories from "./components/categories";
import FeaturedAgencies from "./components/featured-agencies";
import SearchSection from "./components/search-section";
import TrendingPosts from "./components/trending-posts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation user={!!userId} />
      <main className="container mx-auto px-4 py-8">
        <FeaturedAgencies />
        <SearchSection />
        <TrendingPosts />
        <Categories />
      </main>
    </div>
  );
}
