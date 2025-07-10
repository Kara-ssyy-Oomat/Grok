import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
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

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  salePrice?: string;
  category: string;
  imageUrl: string;
  images: string[];
  stock: number;
  rating: string;
  reviewCount: number;
  colors: string[];
  variants: string[];
}

interface StoreState {
  // Cart state
  isCartOpen: boolean;
  
  // Product modal state
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  selectedQuantity: number;
  selectedColor: string;
  selectedVariant: string;
  
  // Search and filters
  searchQuery: string;
  selectedCategory: string;
  
  // Actions
  setCartOpen: (open: boolean) => void;
  setProductModal: (product: Product | null, open: boolean) => void;
  setSelectedQuantity: (quantity: number) => void;
  setSelectedColor: (color: string) => void;
  setSelectedVariant: (variant: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      isCartOpen: false,
      selectedProduct: null,
      isProductModalOpen: false,
      selectedQuantity: 1,
      selectedColor: '',
      selectedVariant: '',
      searchQuery: '',
      selectedCategory: '',
      
      // Actions
      setCartOpen: (open) => set({ isCartOpen: open }),
      setProductModal: (product, open) => set({ 
        selectedProduct: product, 
        isProductModalOpen: open,
        selectedQuantity: 1,
        selectedColor: product?.colors[0] || '',
        selectedVariant: product?.variants[0] || '',
      }),
      setSelectedQuantity: (quantity) => set({ selectedQuantity: quantity }),
      setSelectedColor: (color) => set({ selectedColor: color }),
      setSelectedVariant: (variant) => set({ selectedVariant: variant }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: 'techstore-storage',
      partialize: (state) => ({ 
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory 
      }),
    }
  )
);
