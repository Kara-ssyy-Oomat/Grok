import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setProductModal, updateCartItems } = useStore();
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
        selectedColor: product.colors[0] || null,
        selectedVariant: product.variants[0] || null,
      });
      return response.json();
    },
    onSuccess: () => {
      // Refresh cart items
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Товар добавлен в корзину",
        description: `${product.name} добавлен в корзину`,
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCartMutation.mutate();
  };

  const handleCardClick = () => {
    setProductModal(product, true);
  };

  const currentPrice = product.salePrice ? Number(product.salePrice) : Number(product.price);
  const originalPrice = product.salePrice ? Number(product.price) : null;
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-shadow duration-300" onClick={handleCardClick}>
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
            -{discount}%
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 left-3 text-gray-400 hover:text-red-500 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ₽{currentPrice.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-gray-500 line-through text-sm">
                ₽{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(Number(product.rating)) ? "fill-current" : ""
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm">({product.reviewCount})</span>
          </div>
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? 
              product.stock < 5 ? `Осталось ${product.stock}` : "В наличии" :
              "Нет в наличии"
            }
          </Badge>
        </div>
        
        <Button
          className="w-full"
          disabled={product.stock === 0 || addToCartMutation.isPending}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Нет в наличии" : "В корзину"}
        </Button>
      </CardContent>
    </Card>
  );
}
