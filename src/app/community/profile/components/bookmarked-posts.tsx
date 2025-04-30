// import Link from "next/link";
// import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";

// /*

// import BookmarkedPostsList from "../components/bookmarked-posts";
// import PostManager from "@/lib/managers/postManager";

// {isOwner && !isAgency && (
//   <div className="mt-8">
//     <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
//       Saved Posts
//     </h2>
//     <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
//     <BookmarkedPostsList posts={bookmarkedPosts} />
//   </div>
// )}

// */

// interface BookmarkedPost {
//   id: string;
//   title: string;
//   createdAt: Date;
//   content?: string;
//   _count: {
//     comments: number;
//   };
// }

// interface BookmarkedPostsListProps {
//   posts: BookmarkedPost[];
// }

// export default function BookmarkedPostsList({
//   posts,
// }: BookmarkedPostsListProps) {
//   return (
//     <div className="space-y-4">
//       {posts.map((post) => (
//         <Card
//           key={post.id}
//           className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft"
//         >
//           <CardContent className="p-5">
//             {/* Post Title */}
//             <Link href={`/community/${post.id}/${post.id}`} className="group">
//               <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-100 transition-colors group-hover:text-primary dark:group-hover:text-primary-light">
//                 {post.title}
//               </h3>
//             </Link>

//             {/* Example snippet/preview of content, if desired */}
//             {post.content && (
//               <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
//                 {post.content}
//               </p>
//             )}
//           </CardContent>

//           {/* Footer with date, likes, comments */}
//           <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10 p-3">
//             <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
//               {/* Created Date */}
//               <div className="flex items-center gap-1">
//                 <Calendar className="h-4 w-4" />
//                 <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//               </div>

//               {/* Like Count */}
//               <div className="flex items-center gap-1">
//                 <ThumbsUp className="h-4 w-4" />
//                 <span>{post._count.likes}</span>
//               </div>

//               {/* Comment Count */}
//               <div className="flex items-center gap-1">
//                 <MessageSquare className="h-4 w-4" />
//                 <span>{post._count.comments}</span>
//               </div>
//             </div>

//             {/* Link to post */}
//             <Link
//               href={`/community/${post.id}/${post.id}`}
//               className="text-sm font-medium text-primary dark:text-primary-light hover:underline"
//             >
//               View Post
//             </Link>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// }
