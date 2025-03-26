export const fetchTrendingPosts = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}) => {
  const response = await fetch(
    `/api/community/trending-posts?cursor=${pageParam}`
  );
  const data = await response.json();
  return data;
};
