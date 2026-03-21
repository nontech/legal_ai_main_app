"use client";

import type { ComponentPropsWithoutRef, FC } from "react";
import ReactMarkdown from "react-markdown";
import type { Components, ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** Tighter spacing and smaller type for callouts (e.g. dispute banner). */
  compact?: boolean;
}

type CodeProps = ComponentPropsWithoutRef<"code"> &
  ExtraProps & {
    inline?: boolean;
  };

const CodeRenderer: FC<CodeProps> = ({ inline, node: _node, ...props }) =>
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
  );

const CodeRendererCompact: FC<CodeProps> = ({ inline, node: _node, ...props }) =>
  inline ? (
    <code
      className="rounded bg-amber-100/80 px-1 py-0.5 font-mono text-[11px] text-amber-950"
      {...props}
    />
  ) : (
    <code
      className="mb-2 block overflow-x-auto rounded-lg bg-slate-900 p-2 font-mono text-xs text-slate-100"
      {...props}
    />
  );

/**
 * MarkdownRenderer - Renders markdown content with proper styling
 * Supports GitHub Flavored Markdown (tables, strikethrough, etc.)
 */
export default function MarkdownRenderer({
  content,
  className = "",
  compact = false,
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
    code: CodeRenderer,
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

  const compactComponents: Components = {
    h1: ({ node: _node, ...props }) => (
      <h1
        className="mt-2 mb-1 text-base font-semibold leading-snug text-slate-900 first:mt-0"
        {...props}
      />
    ),
    h2: ({ node: _node, ...props }) => (
      <h2
        className="mt-2 mb-1 text-sm font-semibold leading-snug text-slate-900 first:mt-0"
        {...props}
      />
    ),
    h3: ({ node: _node, ...props }) => (
      <h3
        className="mt-1.5 mb-1 text-sm font-semibold text-slate-900 first:mt-0"
        {...props}
      />
    ),
    h4: ({ node: _node, ...props }) => (
      <h4 className="mt-1.5 mb-0.5 text-sm font-semibold text-slate-900" {...props} />
    ),
    h5: ({ node: _node, ...props }) => (
      <h5 className="mt-1 mb-0.5 text-xs font-semibold text-slate-800" {...props} />
    ),
    h6: ({ node: _node, ...props }) => (
      <h6 className="mt-1 mb-0.5 text-xs font-semibold text-slate-700" {...props} />
    ),
    p: ({ node: _node, ...props }) => (
      <p className="mb-1.5 text-sm leading-relaxed text-slate-900 last:mb-0" {...props} />
    ),
    a: ({ node: _node, ...props }) => (
      <a
        className="break-words text-primary-700 underline hover:text-primary-800"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    strong: ({ node: _node, ...props }) => (
      <strong className="font-semibold text-slate-900" {...props} />
    ),
    em: ({ node: _node, ...props }) => (
      <em className="italic text-slate-800" {...props} />
    ),
    code: CodeRendererCompact,
    pre: ({ node: _node, ...props }) => (
      <pre
        className="mb-2 overflow-x-auto rounded-lg bg-slate-900 p-2 font-mono text-xs text-slate-100"
        {...props}
      />
    ),
    blockquote: ({ node: _node, ...props }) => (
      <blockquote
        className="my-2 border-l-4 border-amber-400 bg-amber-100/40 py-1 pl-3 text-sm italic text-slate-800"
        {...props}
      />
    ),
    ul: ({ node: _node, ...props }) => (
      <ul className="mb-1.5 ml-3 list-disc text-sm text-slate-800 last:mb-0" {...props} />
    ),
    ol: ({ node: _node, ...props }) => (
      <ol className="mb-1.5 ml-3 list-decimal text-sm text-slate-800 last:mb-0" {...props} />
    ),
    li: ({ node: _node, ...props }) => (
      <li className="mb-0.5 text-slate-800" {...props} />
    ),
    table: ({ node: _node, ...props }) => (
      <div className="mb-2 overflow-x-auto">
        <table
          className="w-full border-collapse border border-slate-300 text-xs text-slate-800"
          {...props}
        />
      </div>
    ),
    thead: ({ node: _node, ...props }) => (
      <thead className="border-b border-slate-300 bg-slate-100" {...props} />
    ),
    tbody: ({ node: _node, ...props }) => <tbody {...props} />,
    tr: ({ node: _node, ...props }) => (
      <tr className="border-b border-slate-200" {...props} />
    ),
    td: ({ node: _node, ...props }) => (
      <td className="border border-slate-200 px-2 py-1" {...props} />
    ),
    th: ({ node: _node, ...props }) => (
      <th className="border border-slate-200 px-2 py-1 text-left font-semibold" {...props} />
    ),
    hr: ({ node: _node, ...props }) => (
      <hr className="my-2 border-t border-amber-200/80" {...props} />
    ),
  };

  const components = compact ? compactComponents : markdownComponents;

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
