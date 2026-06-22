'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';

export default function UserLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); setMessage('');
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const url = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
    const bodyData = isLogin ? { email, password } : { name, email, password, role: 'Customer' };

    try {
      const res = await axios.post(url, bodyData);
      const data = res.data;

      if (isLogin) {
        localStorage.setItem('deyshop_user_token', data.token);
        localStorage.setItem('deyshop_user_name', data.user.name);
        router.push('/'); 
      } else {
        setMessage('Account created! Please switch to login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Authentication failed. Is backend running on 4000?');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white shadow-2xl shadow-orange-100 rounded-3xl flex max-w-4xl w-full overflow-hidden min-h-[550px] border border-slate-100"
      >
        {/* Left Side (Modern Gradient Branding) */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-orange-500 to-pink-500 w-2/5 p-10 text-white relative overflow-hidden">
          <div className="z-10">
            <h1 className="text-4xl font-black italic tracking-tighter mb-2">DEYSHOP</h1>
            <h2 className="text-3xl font-bold mb-4 mt-8 leading-tight">{isLogin ? 'Welcome\nBack!' : 'Join the\nFuture.'}</h2>
            <p className="text-white/80 font-medium">
              {isLogin ? 'Access your orders, wishlist, and exclusive Deyshop recommendations.' : 'Sign up to experience premium smart home utility curated for you.'}
            </p>
          </div>
          {/* Abstract background circles */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 -right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-3/5 p-10 flex flex-col justify-center bg-white relative">
          <Link href="/" className="absolute top-6 right-8 text-sm text-slate-400 font-bold hover:text-orange-500 transition">✕ Close</Link>
          
          <div className="w-full max-w-sm mx-auto space-y-8">
            <div className="text-center md:text-left mb-8">
              <h3 className="text-2xl font-black text-slate-800">{isLogin ? 'Secure Login' : 'Create Account'}</h3>
              <p className="text-slate-500 text-sm mt-1">Unlock premium Deyshop features</p>
            </div>

            {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-green-50 text-green-700 text-sm font-bold rounded-xl">{message}</motion.div>}
            {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</motion.div>}

            <form className="space-y-5">
              {!isLogin && (
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition font-bold text-slate-900 placeholder-slate-500" 
                />
              )}
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition font-bold text-slate-900 placeholder-slate-500" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition font-bold text-slate-900 placeholder-slate-500" 
              />
              
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                type="button" 
                onClick={handleSubmit}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-orange-500 transition-colors"
              >
                {isLogin ? 'Login to Account' : 'Sign Up Now'}
              </motion.button>
            </form>

            <div className="text-center mt-6">
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="text-orange-600 font-bold text-sm hover:underline">
                {isLogin ? 'New to Deyshop? Create an account' : 'Already a member? Log in'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}