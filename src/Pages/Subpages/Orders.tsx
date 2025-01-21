import React from 'react';
import UserLayout from '@/Layouts/UserLayout';
import PageMeta from '@/Layouts/PageMeta';
import { useOrders } from '@/Services/Hooks';
import OrderItem from "@/Components/OrderItem";

// Types
interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Custom Card Component with improved styling
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/30 ${className}`}>
    {children}
  </div>
);

// Enhanced Loading Skeleton Component
const Skeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-28 bg-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-700/20"></div>
  </div>
);

// Main Orders Component
const Orders: React.FC = () => {
  const { data: OrderData, isLoading } = useOrders();

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageMeta
            title="User - My Orders"
            description="View, Manage and place your order"
          >
            <div className="mb-8">
              <h3 className="text-4xl font-bold tracking-tight text-white mb-2">
                My Orders
              </h3>
              <p className="text-gray-400">
                View and manage all your orders in one place
              </p>
            </div>

            <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:border-gray-600/50">
              <div className="p-8 border-b border-gray-700/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <svg 
                        className="h-6 w-6 text-orange-500" 
                        fill="none" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">
                        Order History
                      </h4>
                      <p className="text-sm text-gray-400">
                        {OrderData ? `${OrderData.length} orders found` : 'Loading orders...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                  {isLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((i) => <Skeleton key={i} />)}
                    </div>
                  ) : OrderData && OrderData.length > 0 ? (
                    <div className="space-y-6">
                      {OrderData.map((item, index) => (
                        <div 
                          key={index}
                          className="transform transition-all duration-300 hover:scale-[1.01]"
                        >
                          <OrderItem order={item} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-gray-800/50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <svg 
                          className="h-8 w-8 text-gray-500" 
                          fill="none" 
                          strokeWidth="2" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-400 max-w-sm mx-auto">
                        Looks like you haven't placed any orders yet. Start shopping to see your orders here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </PageMeta>
        </div>
      </div>
    </UserLayout>
  );
};

export default Orders;