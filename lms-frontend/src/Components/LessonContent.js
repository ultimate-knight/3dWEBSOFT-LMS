"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0 border-b border-gray-200 pb-3">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed my-3 text-base">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 my-3 space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-3 space-y-1 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-amber-500 bg-amber-50 text-amber-950 rounded-r-xl px-4 py-3 my-4 text-sm">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="my-8 border-gray-200" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-indigo-600 font-medium underline hover:text-indigo-800"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-")
    if (isBlock) {
      return (
        <code className={`${className} block`} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code
        className="bg-gray-100 text-indigo-800 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-slate-900 text-green-400 rounded-xl p-4 text-sm overflow-x-auto my-4 font-mono">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-200 rounded-lg text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-gray-200 px-3 py-2 text-left font-bold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-gray-200 px-3 py-2">{children}</td>,
}

export default function LessonContent({ content }) {
  if (!content?.trim()) return null

  return (
    <article className="lesson-content max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  )
}
