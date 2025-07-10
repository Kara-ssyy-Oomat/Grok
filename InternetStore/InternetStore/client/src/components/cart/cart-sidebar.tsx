import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

export default function CartSidebar() {
  const { isCartOpen, setCartOpen } = useStore();
  const { toast } = useToast();

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      if (quantity === 0) {
        await apiRequest("DELETE", `/api/cart/${id}`);
      } else {
        await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить корзину",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Товар удален",
        description: "Товар удален из корзины",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        order: {
          customerName: "Покупатель",
          customerEmail: "customer@example.com",
          customerPhone: "+7 (000) 000-00-00",
          address: "Адрес доставки",
          total: total.toString(),
          createdAt: new Date().toISOString(),
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.price,
          selectedColor: item.selectedColor,
          selectedVariant: item.selectedVariant,
        })),
      };
      
      await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setCartOpen(false);
      toast({
        title: "Заказ оформлен",
        description: "Ваш заказ успешно оформлен",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ",
        variant: "destructive",
      });
    },
  });

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: number) => {
    removeItemMutation.mutate(id);
  };

  const handleCheckout = () => {
    createOrderMutation.mutate();
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.product.salePrice ? 
      Number(item.product.salePrice) : Number(item.product.price);
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Корзина пуста</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => {
                const currentPrice = item.product.salePrice ? 
                  Number(item.product.salePrice) : Number(item.product.price);
                
                return (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        ₽{currentPrice.toLocaleString()}
                      </p>
                      {item.selectedColor && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.selectedColor}
                        </Badge>
                      )}
                      {item.selectedVariant && (
                        <Badge variant="secondary" className="text-xs mt-1 ml-1">
                          {item.selectedVariant}
                        </Badge>
                      )}
                      
                      <div className="flex items-center mt-2 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updateQuantityMutation.isPending}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updateQuantityMutation.isPending || item.quantity >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 p-2"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeItemMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            
            {/* Cart Footer */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Итого:</span>
                <span className="font-bold text-xl">₽{total.toLocaleString()}</span>
              </div>
              
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Оформление..." : "Оформить заказ"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCartOpen(false)}
              >
                Продолжить покупки
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
