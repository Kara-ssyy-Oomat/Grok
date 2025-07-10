import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import ProductModal from "@/components/product/product-modal";
import CartSidebar from "@/components/cart/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Package, Archive, Zap } from "lucide-react";
import type { Product } from "@shared/schema";

const categories = [
  { id: "knives", name: "Ножи", icon: Zap, count: 45 },
  { id: "scissors", name: "Ножницы", icon: Scissors, count: 32 },
  { id: "accessories", name: "Мелочи", icon: Package, count: 128 },
  { id: "tape", name: "Скотч", icon: Archive, count: 67 },
];

export default function Home() {
  const { searchQuery, selectedCategory, setSelectedCategory } = useStore();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Featured Products */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold">
              {selectedCategory ? 
                categories.find(c => c.id === selectedCategory)?.name || 'Товары' :
                'Рекомендуемые товары'
              }
            </h3>
            <div className="flex space-x-4">
              <Button 
                variant={!selectedCategory ? "default" : "outline"}
                onClick={() => setSelectedCategory('')}
              >
                Все
              </Button>
              {categories.map(cat => (
                <Button 
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-t-xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Товары не найдены</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ProductModal />
      <CartSidebar />
    </div>
  );
}
