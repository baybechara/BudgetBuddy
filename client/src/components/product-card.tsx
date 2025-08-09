import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (priceInCents: number) => {
    return `${priceInCents.toLocaleString()} сом`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Электроника": "text-blue-600 bg-blue-100",
      "Одежда": "text-purple-600 bg-purple-100",
      "Дом и сад": "text-green-600 bg-green-100",
      "Спорт": "text-orange-600 bg-orange-100",
      "Книги": "text-amber-600 bg-amber-100",
      "Автомобили": "text-red-600 bg-red-100",
      "Красота": "text-pink-600 bg-pink-100",
      "Игрушки": "text-indigo-600 bg-indigo-100"
    };
    return colors[category as keyof typeof colors] || "text-slate-600 bg-slate-100";
  };

  const isNewProduct = () => {
    const today = new Date();
    const productDate = new Date(product.createdAt);
    const timeDiff = today.getTime() - productDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff < 1;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group" data-testid={`card-product-${product.id}`}>
      {/* Product Image */}
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div className={`w-full h-full flex items-center justify-center ${product.image ? 'hidden' : ''}`}>
          <div className="text-center">
            <i className="fas fa-image text-slate-400 text-4xl mb-2"></i>
            <p className="text-slate-500 text-sm">Нет изображения</p>
          </div>
        </div>
        
        {/* New badge */}
        {isNewProduct() && (
          <div className="absolute top-3 right-3">
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
              Новый
            </span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
          <button className="text-slate-400 hover:text-red-500 transition-colors duration-200" data-testid={`button-favorite-${product.id}`}>
            <i className="far fa-heart"></i>
          </button>
        </div>
        
        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2" data-testid={`text-title-${product.id}`}>
          {product.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-3 line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-slate-800" data-testid={`text-price-${product.id}`}>
            {formatPrice(product.price)}
          </span>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium" data-testid={`button-view-details-${product.id}`}>
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
}
