import React, { useEffect, useState } from 'react';

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

// Hook type
interface UseOrdersReturn {
  data: OrderItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

// Custom hook
const useOrders = (): UseOrdersReturn => {
  const [data, setData] = useState<OrderItem[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Implement your actual data fetching logic here
    const fetchOrders = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/orders');
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { data, isLoading, error };
};

// Component Props Types
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface StatusBadgeProps {
  status: OrderItem['status'];
}

interface OrderCardProps {
  order: OrderItem;
}

// Custom Button Component
const Button: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg 
    transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

// Custom Card Component
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

// Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<OrderItem['status'], string> = {
    pending: "bg-yellow-600 text-yellow-100",
    processing: "bg-orange-600 text-orange-100",
    shipped: "bg-purple-600 text-purple-100",
    delivered: "bg-green-600 text-green-100"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Loading Skeleton Component
const Skeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-24 bg-gray-700 rounded-lg mb-4"></div>
  </div>
);

// Order Card Component
const OrderCard: React.FC<OrderCardProps> = ({ order }) => (
  <Card className="mb-4 p-6 hover:bg-gray-750 transition-colors duration-200">
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-4">
          {/* Package Icon */}
          <svg 
            className="h-6 w-6 text-orange-500" 
            fill="none" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <div>
            <h3 className="text-white font-medium">Order #{order.orderNumber}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {/* Calendar Icon */}
              <svg 
                className="h-4 w-4" 
                fill="none" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{order.date}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-sm text-gray-400">
              {item.quantity}x {item.name}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end space-y-3">
        <StatusBadge status={order.status} />
        <div className="text-lg font-semibold text-orange-400">
          ${order.total.toFixed(2)}
        </div>
        <Button className="text-sm">
          View Details 
          <svg 
            className="inline-block ml-2 h-4 w-4" 
            fill="none" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  </Card>
);

// Main Orders Component
const Orders: React.FC = () => {
  const { data: orderData, isLoading } = useOrders();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
          </div>
          
          <div className="p-6">
            <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} />)}
                </div>
              ) : orderData && orderData.length > 0 ? (
                orderData.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-12">
                  <svg 
                    className="mx-auto h-12 w-12 text-gray-500" 
                    fill="none" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-white">No orders found</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Start shopping to see your orders here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Orders;