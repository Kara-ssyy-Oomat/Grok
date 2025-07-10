import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-4">TechStore</h4>
            <p className="text-gray-400 mb-4">
              Ваш надежный партнер в мире современных технологий
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Информация</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Доставка</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Возврат</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Гарантия</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Контакты</h5>
            <ul className="space-y-2 text-gray-400">
              <li>Телефон: 0555332133</li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Поддержка</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Подписка</h5>
            <p className="text-gray-400 mb-4">
              Получайте новости о скидках и новинках
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <Input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TechStore. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
