import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUsers, FaDollarSign, FaBox } from 'react-icons/fa';
import { getProductData } from '@/Services/Queries/ProductQuery';
import { collection, query, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase-config';

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  category: string;
  createdAt: any;
}

const AdminEcommerceComponent = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products
        await getProductData((data: ProductData[]) => {
          console.log('Fetched products:', data);
          
          // Calculate product stats
          const activeProducts = data.filter(p => p.status === 'active').length;
          const totalValue = data.reduce((sum, product) => sum + (product.price * product.stock), 0);
          
          // Fetch orders
          const ordersCollection = collection(firestore, "Orders");
          getDocs(ordersCollection).then((orderSnapshot) => {
            const totalOrders = orderSnapshot.size;
            
            setStats({
              totalProducts: data.length,
              activeProducts,
              totalOrders,
              totalValue
            });
            
            setLoading(false);
          });
        }, null, true);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section data-scroll data-scroll-speed=".05" id="AdminEcommerceSection" className="bg-gray-900 p-6 rounded-lg">
      <div className="pb-2 border-b-2 border-orange-500 mb-4">
        <h4 className="text-3xl font-bold text-white">Ecommerce Overview</h4>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg shadow animate-pulse">
              <div className="h-16 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-orange-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500 rounded-full">
                <FaBox className="text-gray-900 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm font-medium">Total Products</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalProducts.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-orange-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500 rounded-full">
                <FaDollarSign className="text-gray-900 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm font-medium">Inventory Value</p>
                <h3 className="text-2xl font-bold text-white">
                  ₦{stats.totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </h3>
              </div>
            </div>
          </div> */}

          <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-orange-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500 rounded-full">
                <FaBox className="text-gray-900 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm font-medium">Active Products</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.activeProducts.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-500">
                  {((stats.activeProducts / stats.totalProducts) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-orange-500/20 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500 rounded-full">
                <FaShoppingCart className="text-gray-900 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalOrders.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-500">
                  All time orders
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminEcommerceComponent;