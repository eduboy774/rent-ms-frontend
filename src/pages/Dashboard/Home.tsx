import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_SUMMARY } from "../../graphql/queries";
import { HouseRental } from "../../types/house-rentals";
import Badge from "../../components/ui/badge/Badge";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const { data, loading, error } = useQuery(GET_DASHBOARD_SUMMARY, {
    fetchPolicy: "network-only",
  });

  const summary = data?.getDashboardSummary?.data;

  const activeRentals = summary?.activeRentals ?? [];
  const pendingRentals = summary?.pendingRentals ?? [];
  const expiredRentals = summary?.expiredRentals ?? [];
  const totalRentals = summary?.totalRentals ?? 0;
  const recentRentals = activeRentals.slice(0, 6);

  const metrics = [
    {
      label: "Total Houses",
      value: summary?.totalHouses ?? 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      color: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    },
    {
      label: "Total Renters",
      value: summary?.totalRenters ?? 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H9m6 0a5.972 5.972 0 00-.786-3.07M9 19.128A9.38 9.38 0 016.375 19.5a9.337 9.337 0 01-4.121-.952 4.125 4.125 0 017.533-2.493M9 19.128v-.003c0-1.113.285-2.16.786-3.07m0 0A5.972 5.972 0 0112 15c1.151 0 2.234.321 3.152.886M12 12a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    },
    {
      label: "Active Rentals",
      value: summary?.activeRentalsCount ?? 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      ),
      color: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400",
    },
    {
      label: "Total Users",
      value: summary?.totalUsers ?? 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    },
  ];

  function getInitials(name: string) {
    return name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "";
  }

  const statusColor = (status: string): "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "ACTIVE": return "success";
      case "PENDING": return "warning";
      case "EXPIRED": return "error";
      case "TERMINATED": return "error";
      default: return "info";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Failed to load dashboard. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Dashboard - Rental Management System"
        description="Rental Management System Dashboard"
      />

      <div className="space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${m.color}`}>
                {m.icon}
              </div>
              <div className="mt-5">
                <span className="text-sm text-gray-500 dark:text-gray-400">{m.label}</span>
                <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{m.value}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Recent Rentals */}
          <div className="col-span-12 xl:col-span-8">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 lg:px-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Rentals</h3>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Latest house rental agreements</p>
                </div>
              </div>

              {recentRentals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5M10.5 21H3m1.5 0h1.5m-1.5 0v-3.675c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H4.5m-.75 4.5h11.25" />
                  </svg>
                  <p className="text-sm font-medium">No rentals yet</p>
                </div>
              ) : (
                <div className="max-w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                        <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">House</th>
                        <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Renter</th>
                        <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Amount</th>
                        <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Duration</th>
                        <th className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {recentRentals.map((rental: HouseRental) => (
                        <tr key={rental.uuid} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                {getInitials(rental.house?.name ?? "")}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{rental.house?.name}</p>
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                  {rental.owner?.userFirstName} {rental.owner?.userLastName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {rental.renter?.fullName ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {rental.amount ? `TZS ${Number(rental.amount).toLocaleString()}` : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
                              {rental.duration ?? "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <Badge size="sm" color={statusColor(rental.status)}>
                              {rental.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="col-span-12 xl:col-span-4 space-y-4 md:space-y-6">
            {/* Rental Status Breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rental Overview</h3>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Status breakdown</p>

              <div className="mt-5 space-y-4">
                {/* Progress bar */}
                {totalRentals > 0 && (
                  <div className="flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    {activeRentals.length > 0 && (
                      <div
                        className="bg-green-500 transition-all"
                        style={{ width: `${(activeRentals.length / totalRentals) * 100}%` }}
                      />
                    )}
                    {pendingRentals.length > 0 && (
                      <div
                        className="bg-yellow-500 transition-all"
                        style={{ width: `${(pendingRentals.length / totalRentals) * 100}%` }}
                      />
                    )}
                    {expiredRentals.length > 0 && (
                      <div
                        className="bg-red-500 transition-all"
                        style={{ width: `${(expiredRentals.length / totalRentals) * 100}%` }}
                      />
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Active</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{activeRentals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{pendingRentals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Expired</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{expiredRentals.length}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{totalRentals}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Info</h3>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">System overview</p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active Houses</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {(summary?.houses ?? []).filter((h: any) => h.isActive).length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active Renters</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {(summary?.renters ?? []).filter((r: any) => r.isActive).length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Auto-Renew Rentals</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activeRentals.filter((r: any) => r.autoRenew).length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active Users</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {(summary?.users ?? []).filter((u: any) => u.profileIsActive).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
