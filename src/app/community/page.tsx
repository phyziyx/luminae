import TwoColumnLayout from "./components/categories";
import FeaturedAgencies from "./components/featured-agencies";
import SearchSection from "./components/search-section";
import TrendingPostsSection from "./components/trending-posts-section";

export default async function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8">
        <FeaturedAgencies />
        <SearchSection />
        <TrendingPostsSection />
        <TwoColumnLayout />
      </main>
    </div>
  );
}
