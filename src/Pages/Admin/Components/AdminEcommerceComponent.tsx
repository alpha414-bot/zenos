import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUsers, FaDollarSign, FaBox, FaInbox } from 'react-icons/fa';
import { getProductData } from '@/Services/Queries/ProductQuery';

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
    lowStockProducts: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        await getProductData((data: ProductData[]) => {
          console.log('Fetched products:', data); // Debug log
          
          // Calculate dashboard stats
          const activeProducts = data.filter(p => p.status === 'active').length;
          const lowStock = data.filter(p => p.stock < 10).length;
          const totalValue = data.reduce((sum, product) => sum + (product.price * product.stock), 0);
          
          setStats({
            totalProducts: data.length,
            activeProducts,
            lowStockProducts: lowStock,
            totalValue
          });
          
          setLoading(false);
        }, null, true); // true for admin access
      } catch (error) {
        console.error('Error fetching product stats:', error);
        setLoading(false);
      }
    };

    fetchProductStats();
  }, []);

  return (
    <section data-scroll data-scroll-speed=".05" id="AdminEcommerceSection">
      <div className="pb-2 border-b-2 border-gray-500 mb-4">
        <h4 className="text-3xl font-bold text-gray-800">Ecommerce Overview</h4>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-full">
                <FaBox className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Total Products</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalProducts.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-full">
                <FaDollarSign className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Inventory Value</p>
                <h3 className="text-2xl font-bold text-gray-800">
                ₦{stats.totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500 rounded-full">
                <FaBox className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Active Products</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.activeProducts.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-400">
                  {((stats.activeProducts / stats.totalProducts) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-500 rounded-full">
                <FaInbox className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.lowStockProducts.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-400">
                  {((stats.lowStockProducts / stats.totalProducts) * 100).toFixed(1)}% of total
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