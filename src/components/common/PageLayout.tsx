import { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const routeLabels: Record<string, string> = {
  home: "Dashboard",
  houses: "Houses",
  renters: "Tenants",
  users: "Users",
  profile: "My Profile",
  "house-rentals": "House Rentals",
  payments: "Payments",
  notifications: "Notifications",
  calendar: "Calendar",
};

export default function PageLayout({
  title,
  description,
  children,
  actions,
}: PageLayoutProps) {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] || segment.replace(/-/g, " ");
    return { label, path };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link
              to="/home"
              className="hover:text-orange-500 transition-colors"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.path} className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 dark:text-white font-medium capitalize">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-orange-500 transition-colors capitalize"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
