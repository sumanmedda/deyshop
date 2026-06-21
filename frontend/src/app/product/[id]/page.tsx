'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, Star, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    axios.get(`${API_URL}/api/products`)
      .then(res => {
        const found = res.data.find((p: any) => p._id === id);
        setProduct(found);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('deyshop_cart') || '[]');
    const isExists = cart.find((item: any) => item._id === product._id);
    
    if (!isExists) {
      cart.push(product);
      localStorage.setItem('deyshop_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage')); // Navbar ko update karne ke liye event
      router.push('/cart');
    } else {
      alert("This item is already in your cart!");
      router.push('/cart');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;
  if (!product) return <div className="min-h-screen flex justify-center items-center bg-slate-50 text-2xl font-black text-slate-800">Product Not Found</div>;

  const discount = product.actualPrice && product.actualPrice > product.price 
    ? Math.round(((product.actualPrice - product.price) / product.actualPrice) * 100) 
    : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Simple Header */}
      <nav className="bg-white shadow-sm border-b border-slate-200 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-500">DEYSHOP</Link>
          <Link href="/cart" className="bg-slate-100 p-2 rounded-full hover:bg-orange-100 text-slate-800 hover:text-orange-600 transition"><ShoppingCart size={20}/></Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-10 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold mb-8 transition bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <ArrowLeft size={18} /> Back to Store
        </Link>

        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Section */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-50 rounded-[2rem] p-10 flex justify-center items-center relative aspect-square border border-slate-100">
            {product.isHotDeal && (
              <span className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Flame size={16} className="animate-pulse"/> HOT DEAL
              </span>
            )}
            <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain drop-shadow-2xl mix-blend-multiply hover:scale-105 transition-transform duration-500" />
          </motion.div>

          {/* Product Info Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="text-orange-600 font-black tracking-widest uppercase text-sm mb-4">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1 text-yellow-400 fill-yellow-400"><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/></div>
              <span className="text-slate-400 text-sm font-bold ml-2">(124 Reviews)</span>
            </div>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-slate-100">
              <span className="text-5xl font-black text-slate-900">₹{product.price}</span>
              {product.actualPrice && (
                <div className="flex flex-col pb-1">
                  <span className="text-xl text-slate-400 line-through font-bold">₹{product.actualPrice}</span>
                  {discount && <span className="text-sm font-black text-green-500">{discount}% OFF</span>}
                </div>
              )}
            </div>

            <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="bg-green-100 p-2 rounded-full text-green-600"><ShieldCheck size={24} /></div>
                <span className="font-bold text-slate-700 text-sm">Brand<br/>Warranty</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Truck size={24} /></div>
                <span className="font-bold text-slate-700 text-sm">Fast<br/>Delivery</span>
              </div>
            </div>

            <button onClick={addToCart} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-500/30 active:scale-95">
              <ShoppingCart size={24} /> Add to Cart Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}