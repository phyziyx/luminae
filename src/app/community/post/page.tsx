import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import PostContent from "../components/post-content";
import CommentSection from "../components/comment-section";

// This would typically come from a database or API
const getPostData = (id: string) => {
  // For demo purposes, we'll generate a post based on the ID
  return {
    id: Number.parseInt(id),
    title: `Detailed Post Title ${id}: Understanding the Core Concepts and Best Practices`,
    content: `
# Understanding the Core Concepts

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Key Points to Consider

1. First important point about this topic
2. Second critical concept to understand
3. Third element that ties everything together

> "This is a blockquote highlighting an important insight from the post that readers should pay attention to."

### Practical Applications

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

- Bullet point one about implementation
- Another consideration for real-world usage
- Final thought on practical application

#### Code Example

\`\`\`javascript
// Sample code demonstrating the concept
function implementSolution(data) {
  const result = data.map(item => {
    return {
      ...item,
      processed: true
    };
  });
  
  return result.filter(item => item.isValid);
}
\`\`\`

## Conclusion

In conclusion, these principles form the foundation of effective implementation. By following these guidelines, you'll be able to achieve better results and avoid common pitfalls that many practitioners encounter.

*Thank you for reading this post. If you found it helpful, please consider sharing it with others who might benefit.*
    `,
    author: "Alex Johnson",
    category: "Development",
    comments: 24,
    likes: 156,
    date: "Published on May 15, 2025",
  };
};

export default function PostPage({ params }: { params: { id: string } }) {
  const postData = getPostData(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-gray-600 hover:text-primary"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <PostContent post={postData} />

        <div className="my-12 h-px w-full bg-gray-200"></div>

        <CommentSection postId={params.id} />
      </main>
    </div>
  );
}
