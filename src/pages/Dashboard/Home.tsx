import { useQuery } from "@apollo/client";
import { Link } from "react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { GET_DASHBOARD_SUMMARY, GET_RENTAL_PAYMENTS } from "../../graphql/queries";
import { HouseRental } from "../../types/house-rentals";
import { RentalPayment } from "../../types/payments";
import Badge from "../../components/ui/badge/Badge";
import { useUserContext } from "../../store/userContext";

export default function Home() {
  const { data, loading, error } = useQuery(GET_DASHBOARD_SUMMARY, {
    fetchPolicy: "network-only",
  });

  const { data: paymentsData, loading: paymentsLoading } = useQuery(GET_RENTAL_PAYMENTS, {
    variables: { filtering: {} },
    fetchPolicy: "network-only",
  });

  const { userProfileAndRoleData } = useUserContext();
  const userFirstName = userProfileAndRoleData?.data?.userProfile?.userFirstName ?? "User";

  const summary = data?.getDashboardSummary?.data;

  const activeRentals = summary?.activeRentals ?? [];
  const pendingRentals = summary?.pendingRentals ?? [];
  const expiredRentals = summary?.expiredRentals ?? [];
  const totalRentals = summary?.totalRentals ?? 0;
  const recentRentals = activeRentals.slice(0, 5);
  
  const payments = paymentsData?.getRentalPayments?.data ?? [];
  const completedPayments = payments.filter((p: RentalPayment) => p.status === 'Completed');
  const totalRevenue = completedPayments.reduce((sum: number, p: RentalPayment) => sum + Number(p.amount), 0);

  const metrics = [
    {
      label: "Total Houses",
      value: summary?.totalHouses ?? 0,
      trend: "+12%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      gradient: "from-orange-500 to-orange-600",
      link: "/houses",
    },
    {
      label: "Total Renters",
      value: summary?.totalRenters ?? 0,
      trend: "+5%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128h9m-6 0a5.972 5.972 0 00-.786-3.07M9 19.128A9.38 9.38 0 016.375 19.5a9.337 9.337 0 01-4.121-.952 4.125 4.125 0 017.533-2.493M9 19.128v-.003c0-1.113.285-2.16.786-3.07m0 0A5.972 5.972 0 0112 15c1.151 0 2.234.321 3.152.886M12 12a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
      gradient: "from-blue-500 to-blue-600",
      link: "/renters",
    },
    {
      label: "Active Rentals",
      value: summary?.activeRentalsCount ?? 0,
      trend: "+8%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-emerald-600",
      link: "/house-rentals",
    },
    {
      label: "Total Revenue",
      value: `TZS ${totalRevenue.toLocaleString()}`,
      trend: "+15%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-violet-500 to-violet-600",
      link: "/payments",
    },
  ];

  const getMonthlyRevenue = (payments: RentalPayment[]) => {
    const completedPayments = payments.filter(p => p.status === 'Completed');
    const monthlyData: Record<string, number> = {};
    
    completedPayments.forEach(payment => {
      const month = new Date(payment.paymentDate).toLocaleString('en-US', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + Number(payment.amount);
    });
    
    return monthlyData;
  };
  
  const monthlyRevenue = getMonthlyRevenue(payments);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonth - 5 + i + 12) % 12;
    return months[idx];
  });
  
  const revenueData = last6Months.map(month => ({
    name: month,
    revenue: monthlyRevenue[month] || 0,
  }));

  const rentalStatusData = [
    { name: "Active", value: activeRentals.length, color: "#10B981" },
    { name: "Pending", value: pendingRentals.length, color: "#F59E0B" },
    { name: "Expired", value: expiredRentals.length, color: "#EF4444" },
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

  const getColorClasses = (color: string) => {
    switch (color) {
      case "orange": return "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30";
      case "blue": return "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30";
      case "emerald": return "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30";
      case "violet": return "bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/30";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  if (loading || paymentsLoading) {
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 shadow-lg md:p-8">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
        
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Welcome back, {userFirstName} 👋
            </h1>
            <p className="mt-2 text-sm text-white/90 md:text-base">
              Manage your properties, track rentals, and monitor payments all in one place.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-sm text-white/80 md:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Link
              to="/house-rentals"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-md transition-all hover:bg-orange-50 hover:shadow-lg active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Rental
            </Link>
          </div>
        </div>
      </div>

   

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <Link
            key={m.label}
            to={m.link}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-900"
          >
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${m.gradient} opacity-10 blur-2xl transition-all group-hover:opacity-20`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.gradient} text-white shadow-lg`}>
                  {m.icon}
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {m.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{m.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{m.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-12 xl:col-span-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Monthly rental revenue trend</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                <span className="text-gray-500 dark:text-gray-400">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    border: '1px solid var(--tooltip-border, #e5e7eb)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rental Status Pie Chart */}
        <div className="col-span-12 xl:col-span-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Rental Status</h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Current breakdown</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rentalStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rentalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {rentalStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Rentals */}
        <div className="col-span-12 xl:col-span-8 rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Rentals</h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Latest house rental agreements</p>
            </div>
            <Link
              to="/house-rentals"
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {recentRentals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5M10.5 21H3m1.5 0h1.5m-1.5 0v-3.675c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H4.5m-.75 4.5h11.25" />
              </svg>
              <p className="text-base font-medium">No rentals yet</p>
              <p className="mt-1 text-sm">Start by creating a new house rental</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">House</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Renter</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {recentRentals.map((rental: HouseRental) => (
                    <tr key={rental.uuid} className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-sm font-bold text-orange-600 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-400">
                            {getInitials(rental.house?.name ?? "")}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{rental.house?.name}</p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                              {rental.owner?.userFirstName} {rental.owner?.userLastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {rental.renter?.fullName ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {rental.amount ? `TZS ${Number(rental.amount).toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-4">
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

        {/* Upcoming Expirations */}
        <div className="col-span-12 xl:col-span-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">System overview</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Houses</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {(summary?.houses ?? []).filter((h: any) => h.isActive).length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Renters</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {(summary?.renters ?? []).filter((r: any) => r.isActive).length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Rentals</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{totalRentals}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Users</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {(summary?.users ?? []).filter((u: any) => u.profileIsActive).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
