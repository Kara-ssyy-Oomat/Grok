import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Heart, ShoppingCart } from "lucide-react";

const categories = [
  { id: "", name: "Все товары" },
  { id: "smartphones", name: "Смартфоны" },
  { id: "laptops", name: "Ноутбуки" },
  { id: "headphones", name: "Наушники" },
  { id: "gaming", name: "Игры" },
];

interface CartItemWithProduct {
  id: number;
  productId: number;
  quantity: number;
  selectedColor?: string;
  selectedVariant?: string;
  product: {
    id: number;
    name: string;
    price: string;
    salePrice?: string;
    imageUrl: string;
    stock: number;
  };
}

export default function Header() {
  const { 
    searchQuery, 
    selectedCategory, 
    setSearchQuery, 
    setSelectedCategory, 
    setCartOpen 
  } = useStore();
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">TechStore</h1>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/admin-login">
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <Heart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="border-t border-gray-200">
          <div className="flex space-x-8 py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-colors ${
                  selectedCategory === category.id
                    ? "text-primary font-medium"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
