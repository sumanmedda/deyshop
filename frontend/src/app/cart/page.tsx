'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Trash2, ShieldCheck, Truck, User } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🌟 NAYA: Auth States 🌟
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('deyshop_cart') || '[]');
    setCartItems(cart);

    // 🌟 Check if user has an active token (Logged In) 🌟
    const token = localStorage.getItem('deyshop_user_token');
    const name = localStorage.getItem('deyshop_user_name');

    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
      setUserEmail('customer@deyshop.com'); // Ideally, user email should be saved in localstorage during login
    }
  }, []);

  const removeFromCart = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('deyshop_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckoutAction = async () => {
    // 🌟 AGAR LOGIN NAHI HAI TOH LOGIN PAGE PE BHEJO 🌟
    if (!isLoggedIn) {
      alert("Please login to your account to place an order!");
      router.push('/login');
      return;
    }

    if (!address) return alert("Please enter your delivery address!");
    setLoading(true);
    
    try {
      const payload = {
        customerName: userName,
        customerEmail: userEmail,
        shippingAddress: address,
        items: cartItems,
        totalAmount: totalAmount
      };

      await axios.post('http://localhost:4000/api/orders', payload);
      
      alert("🎉 Order Placed Successfully! Deyshop will deliver it soon.");
      localStorage.removeItem('deyshop_cart');
      window.dispatchEvent(new Event('storage'));
      
      // 🌟 ORDER PLACE HONE KE BAAD SEEDHA MY ORDERS PAGE PE BHEJO 🌟
      router.push('/my-orders');
    } catch (err: any) {
      console.error("❌ FRONTEND ERROR:", err);
      alert(`Order failed: ${err.response?.data?.msg || err.message}`);
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold transition bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-sm p-16 text-center border border-slate-100">
            <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" className="w-32 h-32 mx-auto mb-6 opacity-30 grayscale" alt="Empty Cart" />
            <h2 className="text-2xl font-black text-slate-800 mb-2">Your cart is empty!</h2>
            <p className="text-slate-500 mb-8 font-medium">Add premium items from Deyshop to your cart.</p>
            <Link href="/" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black shadow-lg hover:bg-orange-600 transition">Explore Store</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 group hover:border-orange-200 transition">
                  <div className="w-24 h-24 bg-slate-50 rounded-xl p-2 flex-shrink-0 border border-slate-100">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-orange-600 font-black text-xl mt-1">₹{item.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition">
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 h-max sticky top-24">
              <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Order Summary</h3>
              
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Delivery Address</label>
                <textarea 
                  value={address} onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Enter your full address..." 
                  disabled={!isLoggedIn} // Agar login nahi hai toh address box disable kar do
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition font-bold text-slate-900 placeholder:text-slate-400 resize-none h-24 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {!isLoggedIn && <p className="text-xs text-red-500 font-bold mt-2">Login required to enter address.</p>}
              </div>

              <div className="flex justify-between mb-4 font-medium text-slate-600">
                <span>Items ({cartItems.length})</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between mb-6 font-medium text-slate-600">
                <span>Delivery</span>
                <span className="text-green-600 font-bold flex items-center gap-1"><Truck size={16}/> FREE</span>
              </div>
              <div className="flex justify-between font-black text-2xl text-slate-900 border-t border-slate-100 pt-6 mb-8">
                <span>Total</span>
                <span className="text-orange-600">₹{totalAmount}</span>
              </div>
              
              <button 
                onClick={handleCheckoutAction} 
                disabled={loading} 
                className={`w-full text-white py-5 rounded-xl font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${isLoggedIn ? 'bg-slate-900 hover:bg-orange-600 hover:shadow-orange-500/30' : 'bg-orange-600 hover:bg-orange-700'}`}
              >
                {loading ? 'Processing...' : isLoggedIn ? <><ShieldCheck /> Place Order (COD)</> : <><User /> Login to Checkout</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}