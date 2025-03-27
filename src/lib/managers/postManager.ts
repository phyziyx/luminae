interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  comments: number;
  likes: number;
  relativeDate: string;
}

interface TrendingPosts {
  posts: Post[];
  nextCursor: number | undefined;
}

export const fetchTrendingPosts = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}) => {
  const response = await fetch(
    `/api/community/trending-posts?cursor=${pageParam}`
  );
  const data: TrendingPosts = await response.json();
  return data;
};

interface CategoryPosts {
  posts: Post[];
  nextCursor: number | undefined;
}

export async function fetchCategoryPosts({
  category,
  pageParam = 0,
}: {
  category: string;
  pageParam?: number;
}) {
  const response = await fetch(
    `/api/community/category?name=${category}&page=${pageParam}`
  );
  const data: CategoryPosts = await response.json();
  return data;
}
