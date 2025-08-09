import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import StatsBar from "@/components/stats-bar";
import FilterSidebar from "@/components/filter-sidebar";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@shared/schema";

interface Filters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest"
  });

  // Build query params for API call
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.set("search", filters.search);
  if (filters.category) queryParams.set("category", filters.category);
  if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["/api/products", queryParams.toString()],
    queryFn: async () => {
      const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json() as Promise<Product[]>;
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json() as Promise<string[]>;
    }
  });

  // Sort products based on sortBy filter
  const sortedProducts = [...products].sort((a, b) => {
    switch (filters.sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.title.localeCompare(b.title);
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            filters={filters}
            categories={categories}
            onFilterChange={updateFilter}
            onClearFilters={clearAllFilters}
          />
          
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {filters.category ? `Категория: ${filters.category}` : "Все товары"}
                </h2>
                <p className="text-slate-600 mt-1">
                  {isLoading ? "Загрузка..." : `Показано ${sortedProducts.length} товаров`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="text-sm font-medium text-slate-700">
                    Сортировка:
                  </label>
                  <select
                    id="sort"
                    value={filters.sortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    data-testid="select-sort"
                  >
                    <option value="newest">Новые сначала</option>
                    <option value="oldest">Старые сначала</option>
                    <option value="price-low">Цена: по возрастанию</option>
                    <option value="price-high">Цена: по убыванию</option>
                    <option value="name">По названию А-Я</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Ошибка загрузки</h3>
                <p className="text-slate-600 mb-6">Не удалось загрузить товары</p>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && (
              <>
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <i className="fas fa-search text-slate-400 text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Товары не найдены</h3>
                    <p className="text-slate-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      data-testid="button-clear-filters"
                    >
                      Очистить все фильтры
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
