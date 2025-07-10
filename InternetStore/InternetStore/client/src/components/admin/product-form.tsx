import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertProductSchema, type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = insertProductSchema.extend({
  colors: z.string().optional(),
  variants: z.string().optional(),
  images: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  { value: "knives", label: "Ножи" },
  { value: "scissors", label: "Ножницы" },
  { value: "accessories", label: "Мелочи" },
  { value: "tape", label: "Скотч" },
];

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      salePrice: product?.salePrice || "",
      category: product?.category || "",
      imageUrl: product?.imageUrl || "",
      images: product?.images?.join(", ") || "",
      stock: product?.stock || 0,
      rating: product?.rating || "5.0",
      reviewCount: product?.reviewCount || 0,
      colors: product?.colors?.join(", ") || "",
      variants: product?.variants?.join(", ") || "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const productData = {
        ...data,
        colors: data.colors ? data.colors.split(",").map(c => c.trim()).filter(Boolean) : [],
        variants: data.variants ? data.variants.split(",").map(v => v.trim()).filter(Boolean) : [],
        images: data.images ? data.images.split(",").map(img => img.trim()).filter(Boolean) : [],
      };
      
      return await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Успех",
        description: "Продукт успешно создан",
      });
      onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать продукт",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const productData = {
        ...data,
        colors: data.colors ? data.colors.split(",").map(c => c.trim()).filter(Boolean) : [],
        variants: data.variants ? data.variants.split(",").map(v => v.trim()).filter(Boolean) : [],
        images: data.images ? data.images.split(",").map(img => img.trim()).filter(Boolean) : [],
      };
      
      return await apiRequest(`/api/products/${product!.id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Успех",
        description: "Продукт успешно обновлен",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить продукт",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (product) {
      updateProductMutation.mutate(data);
    } else {
      createProductMutation.mutate(data);
    }
  };

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Название продукта" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Описание продукта" 
                  className="resize-none" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена</FormLabel>
                <FormControl>
                  <Input placeholder="99 999 ₽" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена со скидкой</FormLabel>
                <FormControl>
                  <Input placeholder="79 999 ₽" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Основное изображение (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дополнительные изображения (URL через запятую)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цвета (через запятую)</FormLabel>
                <FormControl>
                  <Input placeholder="Черный, Белый, Синий" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Варианты (через запятую)</FormLabel>
                <FormControl>
                  <Input placeholder="128GB, 256GB, 512GB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Рейтинг</FormLabel>
                <FormControl>
                  <Input placeholder="4.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviewCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество отзывов</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="123" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Сохранение..." : product ? "Обновить продукт" : "Создать продукт"}
          </Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}