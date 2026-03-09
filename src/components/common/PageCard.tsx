import { ReactNode } from "react";

interface PageCardProps {
  title: string;
  count: number;
  countLabel: string;
  onAdd?: () => void;
  addLabel?: string;
  children: ReactNode;
}

export default function PageCard({
  title,
  count,
  countLabel,
  onAdd,
  addLabel,
  children,
}: PageCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {count} total {countLabel}
            {count !== 1 ? "s" : ""}
          </p>
        </div>
        {onAdd && addLabel && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
