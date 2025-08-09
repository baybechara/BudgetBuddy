interface Filters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

interface FilterSidebarProps {
  filters: Filters;
  categories: string[];
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({ filters, categories, onFilterChange, onClearFilters }: FilterSidebarProps) {
  return (
    <aside className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
        <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
          <i className="fas fa-filter mr-2 text-primary"></i>
          Фильтры и поиск
        </h2>
        
        {/* Search Input */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
            Поиск товаров
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Поиск по названию или описанию..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              data-testid="input-search"
            />
            <i className="fas fa-search absolute left-3 top-3.5 text-slate-400"></i>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
            Категория
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            data-testid="select-category"
          >
            <option value="">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Диапазон цен (сом)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Мин"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 text-sm"
                data-testid="input-min-price"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Макс"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 text-sm"
                data-testid="input-max-price"
              />
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Быстрые фильтры
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary focus:ring-primary"
                data-testid="checkbox-new-today"
                onChange={(e) => {
                  // This would need more complex state management for multiple quick filters
                  console.log("New today filter:", e.target.checked);
                }}
              />
              <span className="ml-2 text-sm text-slate-600">Новые сегодня</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary focus:ring-primary"
                data-testid="checkbox-with-image"
                onChange={(e) => {
                  console.log("With images filter:", e.target.checked);
                }}
              />
              <span className="ml-2 text-sm text-slate-600">С фотографиями</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary focus:ring-primary"
                data-testid="checkbox-under-price"
                onChange={(e) => {
                  if (e.target.checked) {
                    onFilterChange("maxPrice", "5000");
                  } else {
                    onFilterChange("maxPrice", "");
                  }
                }}
              />
              <span className="ml-2 text-sm text-slate-600">До 5000 сом</span>
            </label>
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors duration-200 text-sm font-medium"
          data-testid="button-clear-all-filters"
        >
          <i className="fas fa-times mr-2"></i>
          Очистить все фильтры
        </button>
      </div>
    </aside>
  );
}
