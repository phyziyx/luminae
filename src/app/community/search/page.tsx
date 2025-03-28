"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SearchResults from "./components/search-results"
import NoResults from "./components/no-results"
import SearchBar from "./components/searchbar"

// Mock search function - in a real app, this would call your API
const performSearch = async (query: string, sort: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Return empty results for empty query
  if (!query.trim()) return { results: [], total: 0 }

  // Generate mock results
  const results = Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
    id: i + 1,
    title: `${query} - Search Result ${i + 1}`,
    snippet: `This is a preview of the content related to "${query}". Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    category: ["Design", "Development", "Marketing", "Business", "Technology"][Math.floor(Math.random() * 5)],
    author: ["Alex Johnson", "Sarah Thompson", "Michael Chen", "Emily Rodriguez", "David Kim"][
      Math.floor(Math.random() * 5)
    ],
    date: `${Math.floor(Math.random() * 30) + 1} days ago`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 50),
  }))

  // Sort results based on the selected option
  if (sort === "likes") {
    results.sort((a, b) => b.likes - a.likes)
  } else if (sort === "comments") {
    results.sort((a, b) => b.comments - a.comments)
  }
  // Default is already by recency (as they're generated)

  return { results, total: results.length }
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("recent")
  interface SearchResult {
    id: number
    title: string
    snippet: string
    category: string
    author: string
    date: string
    likes: number
    comments: number
  }
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Handle search when query or sort changes
  useEffect(() => {
    const search = async () => {
      if (!searchQuery) return

      setIsSearching(true)
      const { results, total } = await performSearch(searchQuery, sortOption)
      setResults(results)
      setTotal(total)
      setIsSearching(false)
    }

    search()
  }, [searchQuery, sortOption])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(query)
    setHasSearched(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
            Search <span className="text-[#5B9AFF] dark:text-[#7BABFF]">Results</span>
            <div className="mt-2 h-1 w-48 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
            Find posts, discussions, and insights from our community members.
          </p>
        </div>

        <SearchBar handleSearch={handleSearch} />

        {/* Results Section */}
        {hasSearched && (
          <div>
            {/* Results Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="text-gray-600 dark:text-gray-300">
                {isSearching
                  ? "Searching..."
                  : total > 0
                    ? `Found ${total} result${total === 1 ? "" : "s"} for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`}
              </div>

              {total > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="likes">Most Liked</SelectItem>
                      <SelectItem value="comments">Most Commented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Results Content */}
            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent dark:border-primary-light dark:border-t-transparent"></div>
              </div>
            ) : total > 0 ? (
              <SearchResults results={results} />
            ) : (
              <NoResults query={searchQuery} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

