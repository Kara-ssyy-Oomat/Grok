import { 
  products, 
  cartItems, 
  orders, 
  orderItems,
  type Product, 
  type InsertProduct, 
  type CartItem, 
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Cart
  getCartItems(): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(): Promise<void>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentProductId: number;
  private currentCartId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentProductId = 1;
    this.currentCartId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Кухонный нож Santoku 18см",
        description: "Острый японский нож Santoku для универсального использования на кухне.",
        price: "2500",
        salePrice: "1990",
        category: "knives",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0a9ba2fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 25,
        rating: "4.8",
        reviewCount: 89,
        colors: ["Черный", "Серый"],
        variants: ["15см", "18см", "21см"]
      },
      {
        name: "Набор кухонных ножей 6 шт",
        description: "Профессиональный набор кухонных ножей из нержавеющей стали.",
        price: "8500",
        category: "knives",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0a9ba2fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 12,
        rating: "4.9",
        reviewCount: 45,
        colors: ["Серебристый"],
        variants: ["6 шт", "8 шт", "12 шт"]
      },
      {
        name: "Портновские ножницы 25см",
        description: "Профессиональные портновские ножницы для точного кроя ткани.",
        price: "1800",
        category: "scissors",
        imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031d342?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 18,
        rating: "4.7",
        reviewCount: 67,
        colors: ["Серебристый", "Черный"],
        variants: ["20см", "25см", "30см"]
      },
      {
        name: "Канцелярские ножницы офисные",
        description: "Удобные ножницы для офисной работы и дома.",
        price: "350",
        category: "scissors",
        imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031d342?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 45,
        rating: "4.5",
        reviewCount: 123,
        colors: ["Синий", "Красный", "Черный"],
        variants: ["Маленькие", "Средние", "Большие"]
      },
      {
        name: "Скотч упаковочный прозрачный",
        description: "Прочный упаковочный скотч для запечатывания коробок и посылок.",
        price: "120",
        category: "tape",
        imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 100,
        rating: "4.6",
        reviewCount: 89,
        colors: ["Прозрачный"],
        variants: ["48мм", "50мм", "72мм"]
      },
      {
        name: "Двусторонний скотч",
        description: "Сверхпрочный двусторонний скотч для монтажа и склеивания.",
        price: "250",
        category: "tape",
        imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 65,
        rating: "4.8",
        reviewCount: 156,
        colors: ["Белый"],
        variants: ["12мм", "19мм", "25мм"]
      },
      {
        name: "Набор канцелярских принадлежностей",
        description: "Полный набор для офиса: скрепки, кнопки, резинки, стикеры.",
        price: "890",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 32,
        rating: "4.4",
        reviewCount: 78,
        colors: ["Разноцветный"],
        variants: ["Базовый", "Расширенный", "Премиум"]
      },
      {
        name: "Органайзер для мелочей",
        description: "Удобный пластиковый органайзер с отделениями для хранения мелочей.",
        price: "650",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: [],
        stock: 28,
        rating: "4.7",
        reviewCount: 92,
        colors: ["Белый", "Серый", "Синий"],
        variants: ["Маленький", "Средний", "Большой"]
      }
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      const productWithDefaults: Product = {
        ...product,
        id,
        salePrice: product.salePrice || null,
        isActive: product.isActive ?? true,
        rating: product.rating || "0",
        images: product.images || [],
        stock: product.stock ?? 0,
        reviewCount: product.reviewCount ?? 0,
        colors: product.colors || [],
        variants: product.variants || [],
      };
      this.products.set(id, productWithDefaults);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      p => p.isActive && p.category === category
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      p => p.isActive && (
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      )
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      salePrice: insertProduct.salePrice || null,
      isActive: insertProduct.isActive ?? true,
      rating: insertProduct.rating || "0",
      images: insertProduct.images || [],
      colors: insertProduct.colors || [],
      variants: insertProduct.variants || [],
      stock: insertProduct.stock ?? 0,
      reviewCount: insertProduct.reviewCount ?? 0,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, update: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { ...product, ...update };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getCartItems(): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values());
    const result = [];
    
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        result.push({ ...item, product });
      }
    }
    
    return result;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists with same product and options
    const existingItem = Array.from(this.cartItems.values()).find(
      item => 
        item.productId === insertItem.productId &&
        item.selectedColor === insertItem.selectedColor &&
        item.selectedVariant === insertItem.selectedVariant
    );

    if (existingItem) {
      existingItem.quantity += insertItem.quantity ?? 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = this.currentCartId++;
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      quantity: insertItem.quantity ?? 1,
      selectedColor: insertItem.selectedColor || null,
      selectedVariant: insertItem.selectedVariant || null,
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }
    
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(): Promise<void> {
    this.cartItems.clear();
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderId = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id: orderId,
      status: insertOrder.status || "pending",
    };
    this.orders.set(orderId, order);

    // Create order items
    for (const item of items) {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = { 
        ...item, 
        id: orderItemId, 
        orderId,
        selectedColor: item.selectedColor || null,
        selectedVariant: item.selectedVariant || null,
      };
      this.orderItems.set(orderItemId, orderItem);
    }

    return order;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const orderItems = Array.from(this.orderItems.values()).filter(item => item.orderId === id);
    const items = [];

    for (const item of orderItems) {
      const product = this.products.get(item.productId);
      if (product) {
        items.push({ ...item, product });
      }
    }

    return { ...order, items };
  }
}

export const storage = new MemStorage();
