'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userName = localStorage.getItem('deyshop_user_name');

    // 🌟 SAME PORT 4000 USE KIYA HAI 🌟
    axios.get('http://localhost:4000/api/orders')
      .then((res) => {
        // Sirf is logged-in user ke orders filter kar rahe hain
        const userOrders = res.data.filter((order: any) => order.customerName === userName);
        setOrders(userOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-50"><div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold mb-8 transition bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <ArrowLeft size={18} /> Back to Store
        </Link>

        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-sm p-16 text-center border border-slate-100">
            <Package size={64} className="mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-black text-slate-800 mb-2">No orders yet!</h2>
            <p className="text-slate-500">Looks like you haven't bought anything from Deyshop.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 transition hover:shadow-md">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-slate-900 font-black">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {order.status === 'Pending' && <Clock size={12} className="inline mr-1" />}
                      {order.status === 'Shipped' && <Truck size={12} className="inline mr-1" />}
                      {order.status === 'Delivered' && <CheckCircle size={12} className="inline mr-1" />}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain mix-blend-multiply" />
                      <div>
                        <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                        <p className="text-orange-600 font-black">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="font-bold text-slate-500">Total Amount Paid</span>
                  <span className="text-2xl font-black text-slate-900">₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}