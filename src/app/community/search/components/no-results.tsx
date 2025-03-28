import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NoResultsProps {
  query: string
}

export default function NoResults({ query }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-800 p-12 text-center shadow-soft">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
        <Search className="h-10 w-10 text-primary dark:text-primary-light" />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">No results found</h2>

      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-300">
        We couldn&apos;t find any posts matching &quot;<span className="font-medium">{query}</span>&quot;. Try using different keywords
        or check out some popular topics.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          className="border-primary text-primary dark:border-primary-light dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          asChild
        >
          <Link href="/category/design">Design</Link>
        </Button>
        <Button
          variant="outline"
          className="border-primary text-primary dark:border-primary-light dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          asChild
        >
          <Link href="/category/development">Development</Link>
        </Button>
        <Button
          variant="outline"
          className="border-primary text-primary dark:border-primary-light dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
          asChild
        >
          <Link href="/category/marketing">Marketing</Link>
        </Button>
      </div>
    </div>
  )
}

