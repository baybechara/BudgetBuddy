import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalProducts: number;
  todayAdded: number;
  categoriesCount: number;
  botStatus: string;
}

export default function StatsBar() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json() as Promise<Stats>;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Статус бота",
      value: stats?.botStatus === "online" ? "В сети" : "Не в сети",
      icon: "fas fa-circle",
      iconColor: stats?.botStatus === "online" ? "text-accent" : "text-red-500",
      bgColor: stats?.botStatus === "online" ? "bg-accent/10" : "bg-red-100",
      testId: "stat-bot-status"
    },
    {
      label: "Всего товаров",
      value: stats?.totalProducts || 0,
      icon: "fas fa-box",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      testId: "stat-total-products"
    },
    {
      label: "Добавлено сегодня",
      value: stats?.todayAdded || 0,
      icon: "fas fa-plus",
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      testId: "stat-today-added"
    },
    {
      label: "Категорий",
      value: stats?.categoriesCount || 0,
      icon: "fas fa-tags",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      testId: "stat-categories"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{item.label}</p>
              <p className="text-2xl font-bold text-slate-800" data-testid={item.testId}>
                {item.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center`}>
              <i className={`${item.icon} ${item.iconColor}`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
