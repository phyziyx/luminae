"use client";
import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/prism";
// import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content?: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1: (props) => (
          <h1
            className="mb-4 mt-6 text-3xl font-bold text-gray-800 dark:text-gray-100"
            {...props}
          />
        ),
        h2: (props) => (
          <h2
            className="mb-3 mt-5 text-2xl font-bold text-gray-800 dark:text-gray-100"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="mb-3 mt-4 text-xl font-bold text-gray-800 dark:text-gray-100"
            {...props}
          />
        ),
        h4: (props) => (
          <h4
            className="mb-2 mt-4 text-lg font-bold text-gray-800 dark:text-gray-100"
            {...props}
          />
        ),
        p: (props) => (
          <p
            className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"
            {...props}
          />
        ),
        a: (props) => (
          <a
            className="text-primary dark:text-primary-light hover:underline"
            {...props}
          />
        ),
        ul: (props) => <ul className="mb-4 ml-6 list-disc" {...props} />,
        ol: (props) => <ol className="mb-4 ml-6 list-decimal" {...props} />,
        li: (props) => (
          <li className="mb-1 text-gray-700 dark:text-gray-300" {...props} />
        ),
        blockquote: (props) => (
          <blockquote
            className="mb-4 border-l-4 border-primary/30 dark:border-primary-light/30 bg-primary/5 dark:bg-primary-light/5 p-4 italic text-gray-700 dark:text-gray-300"
            {...props}
          />
        ),
        code: ({ children, ...props }) => {
          // const match = /language-(\w+)/.exec(className || "");
          // return !inline && match ? (
          //   <SyntaxHighlighter
          //     style={tomorrow}
          //     language={match[1]}
          //     PreTag="div"
          //     className="mb-4 rounded-md"
          //     {...props}
          //   >
          //     {String(children).replace(/\n$/, "")}
          //   </SyntaxHighlighter>
          // ) : (
          return (
            <code
              className="rounded-md bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-sm text-gray-800 dark:text-gray-200"
              {...props}
            >
              {children}
            </code>
          );
        },
        strong: (props) => <strong className="font-bold" {...props} />,
        em: (props) => <em className="italic" {...props} />,
        hr: (props) => (
          <hr
            className="my-6 border-gray-200 dark:border-gray-700"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
