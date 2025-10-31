"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer - Renders markdown content with proper styling
 * Supports GitHub Flavored Markdown (tables, strikethrough, etc.)
 */
export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-bold text-gray-900 mt-3 mb-1" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-sm font-bold text-gray-900 mt-2 mb-1" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-sm font-semibold text-gray-700 mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-800 mb-3 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 hover:text-blue-800 underline break-words"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-gray-800" {...props} />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code
                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              />
            ) : (
              <code
                className="bg-gray-900 text-gray-100 p-3 rounded-lg block font-mono text-sm mb-3 overflow-x-auto"
                {...props}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre
              className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-3 font-mono text-sm"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-600 pl-4 py-2 text-gray-700 italic my-3 bg-blue-50 rounded"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside text-gray-800 mb-3 ml-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside text-gray-800 mb-3 ml-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-800 mb-1" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-3">
              <table
                className="border-collapse border border-gray-300 w-full text-sm text-gray-800"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-100 border-b border-gray-300" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-gray-300 hover:bg-gray-50" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-3 py-2" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 px-3 py-2 font-bold text-left" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-t-2 border-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
