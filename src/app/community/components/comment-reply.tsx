// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { ThumbsUp } from "lucide-react";
// import { MarkdownRenderer } from "./markdown-renderer";

// export default function CommentReply({ reply }: { reply: any }) {
//   return (
//     <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="mb-2 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="h-6 w-6 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-primary dark:text-primary-light font-medium text-xs">
//             {reply.author.charAt(0)}
//           </div>
//           <div>
//             <div className="font-medium text-gray-800 dark:text-gray-200">
//               {reply.author}
//             </div>
//             <div className="text-xs text-gray-500 dark:text-gray-400">
//               {reply.date}
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-1">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
//                 >
//                   <ThumbsUp className="h-3 w-3" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Like this reply</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//           <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
//             {reply.likes}
//           </span>
//         </div>
//       </div>
//       <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//         <MarkdownRenderer content={reply.content} />
//       </div>
//     </div>
//   );
// }
