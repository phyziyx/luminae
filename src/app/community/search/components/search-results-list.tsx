import InfiniteScrollContainer from "@/components/site/infinite-scroll-container";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import NoResults from "./no-results";
import { CategoryPost } from "@/lib/types";
import SearchItemCard from "./search-item-card";
import { WifiOff } from "lucide-react";

export default function SearchResultsList({
  searchResults,
  isFetching,
  hasNextPage,
  fetchNextPage,
  isPending,
  isError,
  isFetchingNextPage,
  searchQuery,
}: {
  searchResults: CategoryPost[];
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isPending: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  searchQuery: string;
}) {
  if (isPending) {
    // Fetching for the first time...
    return <LoadingSpinner />;
  }

  if (!isError && !isFetching && searchResults.length === 0) {
    // No results found
    return <NoResults query={searchQuery} />;
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {searchResults.map((result) => (
        <SearchItemCard key={result.id} result={result} />
      ))}

      {isError && (
        <div className="flex flex-col items-center align-middle justify-center py-4 text-gray-500 dark:text-gray-100 gap-4">
          Error loading search results! Please try again later...
          <WifiOff size={52} />
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4 text-primary">
          <LoadingSpinner />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}
