"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
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
  const markdownComponents: Components = {
    h1: ({ node: _node, ...props }) => (
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2" {...props} />
    ),
    h2: ({ node: _node, ...props }) => (
      <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2" {...props} />
    ),
    h3: ({ node: _node, ...props }) => (
      <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2" {...props} />
    ),
    h4: ({ node: _node, ...props }) => (
      <h4 className="text-base font-bold text-gray-900 mt-3 mb-1" {...props} />
    ),
    h5: ({ node: _node, ...props }) => (
      <h5 className="text-sm font-bold text-gray-900 mt-2 mb-1" {...props} />
    ),
    h6: ({ node: _node, ...props }) => (
      <h6 className="text-sm font-semibold text-gray-700 mt-2 mb-1" {...props} />
    ),
    p: ({ node: _node, ...props }) => (
      <p className="text-gray-800 mb-3 leading-relaxed" {...props} />
    ),
    a: ({ node: _node, ...props }) => (
      <a
        className="text-blue-600 hover:text-blue-800 underline break-words"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    strong: ({ node: _node, ...props }) => (
      <strong className="font-bold text-gray-900" {...props} />
    ),
    em: ({ node: _node, ...props }) => (
      <em className="italic text-gray-800" {...props} />
    ),
    code: ({ node: _node, inline, ...props }) =>
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
    pre: ({ node: _node, ...props }) => (
      <pre
        className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-3 font-mono text-sm"
        {...props}
      />
    ),
    blockquote: ({ node: _node, ...props }) => (
      <blockquote
        className="border-l-4 border-blue-600 pl-4 py-2 text-gray-700 italic my-3 bg-blue-50 rounded"
        {...props}
      />
    ),
    ul: ({ node: _node, ...props }) => (
      <ul className="list-disc list-inside text-gray-800 mb-3 ml-2" {...props} />
    ),
    ol: ({ node: _node, ...props }) => (
      <ol className="list-decimal list-inside text-gray-800 mb-3 ml-2" {...props} />
    ),
    li: ({ node: _node, ...props }) => (
      <li className="text-gray-800 mb-1" {...props} />
    ),
    table: ({ node: _node, ...props }) => (
      <div className="overflow-x-auto mb-3">
        <table
          className="border-collapse border border-gray-300 w-full text-sm text-gray-800"
          {...props}
        />
      </div>
    ),
    thead: ({ node: _node, ...props }) => (
      <thead className="bg-gray-100 border-b border-gray-300" {...props} />
    ),
    tbody: ({ node: _node, ...props }) => <tbody {...props} />,
    tr: ({ node: _node, ...props }) => (
      <tr className="border-b border-gray-300 hover:bg-gray-50" {...props} />
    ),
    td: ({ node: _node, ...props }) => (
      <td className="border border-gray-300 px-3 py-2" {...props} />
    ),
    th: ({ node: _node, ...props }) => (
      <th className="border border-gray-300 px-3 py-2 font-bold text-left" {...props} />
    ),
    hr: ({ node: _node, ...props }) => (
      <hr className="my-4 border-t-2 border-gray-300" {...props} />
    ),
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
