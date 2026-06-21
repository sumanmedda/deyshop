'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, PlusCircle, ShieldCheck, User, AlertCircle, Trash2, Pencil, Flame, X, ShoppingBag } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [mode, setMode] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Product States
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(''); 
  const [prodActualPrice, setProdActualPrice] = useState(''); 
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [isHotDeal, setIsHotDeal] = useState(false); 
  const [editId, setEditId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  // 🌟 Orders & Tabs State 🌟
  const [activeTab, setActiveTab] = useState('products'); // 'products' ya 'orders'
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('deyshop_admin_token');
    if (savedToken) setToken(savedToken);
    setIsLoading(false);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/products');
      setProducts(res.data);
    } catch (err: any) { 
      console.error("Error fetching products", err.message); 
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:4000/api/orders', { headers: { 'Authorization': token } });
      setOrders(res.data);
    } catch (err: any) { console.error("Error fetching orders", err.message); }
  };

  // Jab token mile toh dono fetch kar lo
  useEffect(() => { 
    if (token) { 
      fetchProducts(); 
      fetchOrders(); 
    } 
  }, [token]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`http://127.0.0.1:4000/api/orders/${id}`, { status: newStatus }, { headers: { 'Authorization': token } });
      fetchOrders(); // Status change hone ke baad list update karo
      setMessage('Order status updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setError('Error updating order status'); }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', { 
        name, email, password, role: 'Admin' 
      });
      setMessage('Admin Account created! Please login.'); 
      setMode('login');
    } catch (err: any) { 
      setError(err.response?.data?.msg || err.message || 'Registration failed!'); 
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      
      if (res.data.user.role !== 'Admin' && res.data.user.role !== 'Shop Manager') {
        setError('Access Denied: You are not an Admin!'); return;
      }
      
      localStorage.setItem('deyshop_admin_token', res.data.token);
      setToken(res.data.token); 
    } catch (err: any) { 
      setError(err.response?.data?.msg || err.message || 'Invalid Credentials!'); 
    }
  };

  const handleLogout = () => { localStorage.removeItem('deyshop_admin_token'); setToken(''); };
  const resetForm = () => { setProdName(''); setProdPrice(''); setProdActualPrice(''); setProdDesc(''); setProdImg(''); setIsHotDeal(false); setEditId(null); };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const url = editId ? `http://localhost:4000/api/products/${editId}` : 'http://localhost:4000/api/products';
      const config = { headers: { 'Authorization': token } };
      const bodyData = { 
        name: prodName, price: Number(prodPrice), 
        actualPrice: prodActualPrice ? Number(prodActualPrice) : undefined, 
        isHotDeal, description: prodDesc, imageUrl: prodImg, category: 'Home & Kitchen' 
      };

      if (editId) {
        await axios.put(url, bodyData, config);
        setMessage('Product updated successfully!');
      } else {
        await axios.post(url, bodyData, config);
        setMessage('Product published successfully!');
      }
      resetForm(); fetchProducts(); 
    } catch (err: any) { setError(err.response?.data?.msg || 'Connection failed.'); }
  };

  const handleEditClick = (product: any) => { 
    setEditId(product._id); setProdName(product.name); setProdPrice(product.price); 
    setProdActualPrice(product.actualPrice || ''); setProdDesc(product.description); 
    setProdImg(product.imageUrl); setIsHotDeal(product.isHotDeal || false); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`, { headers: { 'Authorization': token } });
      setMessage('Deleted successfully.'); fetchProducts(); 
    } catch (err: any) { setError('Error deleting product.'); }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;

  // ===================== LOGIN UI =====================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200">
          <div className="flex justify-center mb-6 text-orange-500"><ShieldCheck size={56} /></div>
          <h2 className="text-3xl font-black text-center text-slate-900 mb-6 uppercase tracking-wider">Deyshop Admin</h2>
          
          {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-xl text-center font-bold text-sm">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-100 text-red-800 flex items-center gap-2 justify-center rounded-xl font-bold text-sm"><AlertCircle size={18} /> {error}</div>}
          
          <form className="space-y-5">
            {mode === 'register' && <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 border border-slate-300 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-orange-500 font-medium" required />}
            <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border border-slate-300 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-orange-500 font-medium" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border border-slate-300 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-orange-500 font-medium" required />
            
            <button 
              type="button" 
              onClick={mode === 'login' ? handleLogin : handleRegister}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95"
            >
              {mode === 'login' ? 'Secure Login' : 'Create Admin Account'}
            </button>
          </form>
          
          <p className="text-center mt-6 text-sm font-bold text-slate-500 cursor-pointer hover:text-orange-600" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage(''); }}>
            {mode === 'login' ? "New here? Create Admin Account" : "Already have an account? Login"}
          </p>
        </motion.div>
      </div>
    );
  }

  // ===================== DASHBOARD UI =====================
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600"><User size={28} /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Control Panel</h1>
              <p className="text-sm font-bold text-slate-500">Manage Deyshop Enterprise</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 hover:text-red-600 transition">Logout</button>
        </header>

        {message && <div className="p-4 bg-green-100 border border-green-300 text-green-800 font-bold rounded-xl text-center shadow-sm">{message}</div>}
        {error && <div className="p-4 bg-red-100 border border-red-300 text-red-800 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"><AlertCircle /> {error}</div>}

        {/* 🌟 TABS NAVIGATION 🌟 */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-6 py-3 rounded-full font-black text-sm transition flex items-center gap-2 ${activeTab === 'products' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Package size={18}/> Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-6 py-3 rounded-full font-black text-sm transition flex items-center gap-2 ${activeTab === 'orders' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
          >
            <ShoppingBag size={18}/> View Orders {orders.length > 0 && <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs">{orders.length}</span>}
          </button>
        </div>

        {/* ===================== TAB: PRODUCTS ===================== */}
        {activeTab === 'products' && (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative">
              {editId && <button onClick={resetForm} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 flex items-center gap-2 font-bold text-sm bg-slate-100 p-2 rounded-lg"><X size={16} /> Cancel Edit</button>}
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                {editId ? <Pencil className="text-orange-500" size={28} /> : <PlusCircle className="text-orange-500" size={28} />}
                <h2 className="text-2xl font-black text-slate-800">{editId ? 'Edit Product' : 'Add New Product'}</h2>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Product Name" value={prodName} onChange={e => setProdName(e.target.value)} className="p-4 text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 outline-none md:col-span-2" required />
                <div className="flex flex-col gap-2"><label className="text-sm font-bold text-slate-600">Sale Price (Customer pays this)</label><input type="number" placeholder="₹ Sale Price" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="p-4 text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 outline-none" required /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-bold text-slate-600">Actual Price / MRP (Optional)</label><input type="number" placeholder="₹ Actual Price" value={prodActualPrice} onChange={e => setProdActualPrice(e.target.value)} className="p-4 text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 outline-none" /></div>
                <input type="text" placeholder="Image URL" value={prodImg} onChange={e => setProdImg(e.target.value)} className="p-4 text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl md:col-span-2 font-medium focus:ring-2 focus:ring-orange-500 outline-none" required />
                <textarea placeholder="Product Description..." value={prodDesc} onChange={e => setProdDesc(e.target.value)} className="p-4 text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl md:col-span-2 h-32 font-medium focus:ring-2 focus:ring-orange-500 outline-none resize-none" required />
                <label className="md:col-span-2 flex items-center gap-3 p-4 border border-orange-200 bg-orange-50 rounded-2xl cursor-pointer hover:bg-orange-100 transition">
                  <input type="checkbox" checked={isHotDeal} onChange={e => setIsHotDeal(e.target.checked)} className="w-6 h-6 accent-orange-600 cursor-pointer" />
                  <span className="font-bold text-orange-800 flex items-center gap-2">Enable Hot Deal Badge <Flame size={20} className="text-orange-600" /></span>
            </label>
                <button type="submit" className={`md:col-span-2 text-white font-black text-lg py-5 rounded-2xl transition flex justify-center items-center gap-2 shadow-xl ${editId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-900 hover:bg-orange-600'} active:scale-95`}>
                  {editId ? <Pencil size={24} /> : <Package size={24} />} {editId ? 'Update Product Details' : 'Publish Product'}
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">Manage Live Products ({products.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.length === 0 ? <p className="text-slate-500 font-medium">No products added yet.</p> : products.map((product) => (
                  <div key={product._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl gap-4">
                    <div className="flex items-center gap-4">
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-slate-200 bg-white" />
                      <div>
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">{product.name} {product.isHotDeal && <Flame size={16} className="text-orange-500" />}</h3>
                        <div className="flex items-center gap-2"><p className="text-orange-600 font-black">₹{product.price}</p>{product.actualPrice && <p className="text-slate-400 text-sm line-through">₹{product.actualPrice}</p>}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditClick(product)} className="p-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-800 hover:text-white transition"><Pencil size={20} /></button>
                      <button onClick={() => handleDelete(product._id)} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ===================== TAB: ORDERS ===================== */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">Customer Orders</h2>
            {orders.length === 0 ? <p className="text-slate-500 font-medium">No orders received yet.</p> : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row gap-6 justify-between">
                    <div>
                      <h3 className="font-black text-lg text-slate-900">{order.customerName}</h3>
                      <p className="text-sm text-slate-500 mb-2 font-medium">Address: {order.shippingAddress}</p>
                      <p className="text-orange-600 font-black mb-4">Total Bill: ₹{order.totalAmount}</p>
                      <div className="flex gap-2 flex-wrap">
                        {order.items.map((item:any, i:number) => (
                          <span key={i} className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-md font-bold text-slate-700 shadow-sm">{item.name}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between min-w-[150px]">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {order.status}
                      </span>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 bg-white outline-none cursor-pointer hover:border-orange-500 transition"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}