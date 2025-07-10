import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useStore } from "@/lib/store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Minus, Plus, ShoppingCart, Heart, Share, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProductModal() {
  const {
    selectedProduct,
    isProductModalOpen,
    selectedQuantity,
    selectedColor,
    selectedVariant,
    setProductModal,
    setSelectedQuantity,
    setSelectedColor,
    setSelectedVariant,
  } = useStore();
  
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) return;
      
      const response = await apiRequest("POST", "/api/cart", {
        productId: selectedProduct.id,
        quantity: selectedQuantity,
        selectedColor: selectedColor || null,
        selectedVariant: selectedVariant || null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Товар добавлен в корзину",
        description: `${selectedProduct?.name} добавлен в корзину`,
      });
      setProductModal(null, false);
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
        variant: "destructive",
      });
    },
  });

  if (!selectedProduct) return null;

  const currentPrice = selectedProduct.salePrice ? 
    Number(selectedProduct.salePrice) : Number(selectedProduct.price);
  const originalPrice = selectedProduct.salePrice ? Number(selectedProduct.price) : null;
  const discount = originalPrice ? 
    Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const handleClose = () => {
    setProductModal(null, false);
  };

  const handleAddToCart = () => {
    if (selectedProduct.stock === 0) return;
    addToCartMutation.mutate();
  };

  const increaseQuantity = () => {
    if (selectedQuantity < selectedProduct.stock) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  return (
    <Dialog open={isProductModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="relative mb-4">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-96 object-cover rounded-xl"
                />
                {discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                    -{discount}%
                  </Badge>
                )}
              </div>
              
              {selectedProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-primary"
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(Number(selectedProduct.rating)) ? "fill-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({selectedProduct.reviewCount} отзывов)</span>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-gray-900 mr-4">
                  ₽{currentPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through mr-3">
                      ₽{originalPrice.toLocaleString()}
                    </span>
                    <Badge className="bg-red-100 text-red-600">-{discount}%</Badge>
                  </>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
              
              {/* Color Selection */}
              {selectedProduct.colors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Цвет:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Variant Selection */}
              {selectedProduct.variants.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Вариант:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedProduct.variants.map((variant) => (
                      <Button
                        key={variant}
                        variant={selectedVariant === variant ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decreaseQuantity}
                    disabled={selectedQuantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{selectedQuantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={increaseQuantity}
                    disabled={selectedQuantity >= selectedProduct.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  className="flex-1"
                  disabled={selectedProduct.stock === 0 || addToCartMutation.isPending}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {selectedProduct.stock === 0 ? "Нет в наличии" : "Добавить в корзину"}
                </Button>
              </div>
              
              {/* Additional Actions */}
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  В избранное
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="h-4 w-4 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
