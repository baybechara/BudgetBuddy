export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-800">TradingBot</h1>
            <span className="text-sm text-slate-500 hidden sm:inline">Marketplace</span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a 
              href="#" 
              className="text-slate-600 hover:text-primary transition-colors duration-200"
              data-testid="link-analytics"
            >
              <i className="fas fa-chart-line mr-2"></i>
              <span className="hidden sm:inline">Продавцы</span>
            </a>
            <a 
              href="#" 
              className="text-slate-600 hover:text-primary transition-colors duration-200"
              data-testid="link-settings"
            >
              <i className="fas fa-cog mr-2"></i>
              <span className="hidden sm:inline">Настройки</span>
            </a>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
              data-testid="button-connect-bot"
            >
              <i className="fas fa-plus mr-2"></i>
              Подключить бота
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
