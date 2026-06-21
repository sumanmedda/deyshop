'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, User, ChevronDown, Flame, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

// 15 Premium Banners Array
const banners = [
  { img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200", title: "Smart Kitchen Sale", sub: "Up to 60% Off" },
  { img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200", title: "Modern Aesthetics", sub: "Premium Upgrades" },
  { img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1200", title: "Chef's Choice", sub: "Pro Equipment" },
  { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200", title: "Smart Home Tech", sub: "Future Living" },
  { img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=1200", title: "Luxury Decor", sub: "Elevate Your Space" },
  { img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200", title: "Minimalist Interiors", sub: "Clean & Fresh" },
  { img: "https://images.unsplash.com/photo-1583847268964-b28ce8f25f97?w=1200", title: "Dining Essentials", sub: "Host in Style" },
  { img: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200", title: "Kitchen Makeover", sub: "Trending Now" },
  { img: "https://images.unsplash.com/photo-1512152596585-65fb18a9fc44?w=1200", title: "Cozy Living", sub: "Winter Collection" },
  { img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200", title: "Premium Cookware", sub: "Built to Last" },
  { img: "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=1200", title: "Crystal Glassware", sub: "Elegant Dining" },
  { img: "https://images.unsplash.com/photo-1610527003928-47ef0db77994?w=1200", title: "Automated Appliances", sub: "Save Time" },
  { img: "https://images.unsplash.com/photo-1556909211-36987dac7b4d?w=1200", title: "Baking Supplies", sub: "For the Sweet Tooth" },
  { img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200", title: "Pristine Setup", sub: "White & Gold" },
  { img: "https://images.unsplash.com/photo-1521783593447-5702b9bfd26a?w=1200", title: "Handcrafted Decor", sub: "Unique Finds" }
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  
  // 🌟 NAYA: Search State 🌟
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🌟 NAYA: Carousel State 🌟
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Carousel Auto-Slider (Changes every 4 seconds)
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('deyshop_user_name');
    if (loggedInUser) setUserName(loggedInUser);

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('deyshop_cart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    // 🌟 LOCALHOST KO HATAA KE 127.0.0.1 KIYA AUR 10 SECONDS TIMEOUT LAGAYA 🌟
    axios.get('http://127.0.0.1:4000/api/products', { timeout: 10000 })
      .then((res) => { 
        setProducts(res.data); 
        setLoading(false); 
      })
      .catch((err) => { 
        console.error("❌ BACKEND ERROR:", err); 
        setLoading(false); // Agar fail bhi hua, toh spinner band ho jayega
      });

    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('deyshop_user_token');
    localStorage.removeItem('deyshop_user_name');
    setUserName(null);
  };

  // 🌟 NAYA: Live Search Filtering 🌟
  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* NAVBAR */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <Link href="/" className="flex flex-col min-w-max cursor-pointer">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-500 text-3xl font-black italic tracking-tighter leading-none">DEYSHOP</h1>
            <p className="text-[9px] text-slate-500 font-black tracking-[0.3em] mt-1">ENTERPRISES</p>
          </Link>

          {/* 🌟 FIXED SEARCH BAR 🌟 */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search premium kitchenware, smart appliances..." 
              className="w-full py-3 pl-12 pr-6 rounded-full text-slate-800 bg-slate-100/50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm font-medium transition-all" 
            />
          </div>

          <div className="flex items-center gap-6 font-bold text-sm">
            {userName ? (
              <div onClick={() => setShowUserMenu(!showUserMenu)} className="relative flex items-center gap-2 cursor-pointer text-slate-800 bg-slate-100 px-4 py-2 rounded-full">
                <div className="w-6 h-6 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full text-white flex items-center justify-center text-xs">{userName.charAt(0)}</div> 
                <span className="hidden md:block">{userName}</span> <ChevronDown size={14} />
                
                {/* Mobile Friendly Dropdown */}
                {showUserMenu && (
                  <div className="absolute top-12 right-0 bg-white shadow-2xl rounded-2xl w-48 border border-slate-100 overflow-hidden z-50">
                    <Link href="/my-orders" className="block p-4 hover:bg-slate-50 cursor-pointer text-slate-700 transition font-bold">My Orders</Link>
                    <div onClick={handleLogout} className="p-4 hover:bg-red-50 text-red-600 border-t cursor-pointer transition font-bold">Logout</div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-2 text-slate-800 hover:text-orange-600">
                <User size={20} /> Login
              </Link>
            )}

            <Link href="/cart" className="flex items-center gap-2 text-slate-800 bg-slate-100 w-10 h-10 rounded-full justify-center transition hover:bg-orange-50 relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex justify-center items-center rounded-full font-black border-2 border-white">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 space-y-12">
        
        {/* 🌟 15-SLIDE CAROUSEL BANNER 🌟 */}
        <div className="w-full h-[400px] rounded-[2.5rem] shadow-2xl relative overflow-hidden bg-slate-900 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={bannerIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent z-10"></div>
              <img src={banners[bannerIndex].img} className="w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Banner" />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-10 md:p-16 w-full md:w-1/2">
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] mb-6 w-max rounded-full flex items-center gap-2">
                  <Zap size={14} className="text-yellow-400" /> {banners[bannerIndex].sub}
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                  {banners[bannerIndex].title.split(' ')[0]} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                    {banners[bannerIndex].title.split(' ').slice(1).join(' ')}
                  </span>
                </h2>
                <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all w-max flex items-center gap-3">
                  Shop Now <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === bannerIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/50'}`}></div>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div id="products-section" className="pt-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Trending Now'}
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-orange-500"></div></div>
          ) : filteredProducts.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-800">No products found</h3>
              <p className="text-slate-500 font-medium mt-2">Try searching for something else.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product._id}`} key={product._id}>
                  <div className="bg-white group cursor-pointer border border-slate-100 hover:border-orange-200 p-4 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                    
                    {product.isHotDeal && (
                      <div className="absolute top-4 right-4 z-20">
                         <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Flame size={12} /> HOT
                         </span>
                      </div>
                    )}

                    <div className="w-full h-56 bg-slate-50/50 rounded-[1.5rem] flex items-center justify-center mb-6 overflow-hidden">
                      <img src={product.imageUrl} alt={product.name} className="max-h-48 object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                    </div>

                    <div className="px-2 flex-1 flex flex-col">
                      {/* STATIC 4.8 RATING REMOVED AS REQUESTED */}
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{product.category}</span>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 line-clamp-2 leading-snug mb-4">{product.name}</h3>
                      
                      <div className="mt-auto flex items-end gap-3 flex-wrap pt-4 border-t border-slate-100">
                        <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                        {product.actualPrice && <span className="text-sm text-slate-400 line-through font-medium mb-1">₹{product.actualPrice}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}