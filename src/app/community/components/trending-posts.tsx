import PostManager from "@/lib/managers/postManager";
import PostCardLarge from "./post-card-large";

export default async function TrendingPosts() {
  const trendingPosts = await PostManager.findTrending();

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {/* No trending posts */}
        {trendingPosts?.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No trending posts found...
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {trendingPosts?.map((post) => (
                <PostCardLarge key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty section - add dark mode just in case you style it later */}
      <div className="mt-8 text-center flex justify-center items-center flex-col dark:bg-gray-900"></div>
    </>
  );
}
