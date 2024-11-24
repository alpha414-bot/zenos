import OrderItem from "@/Components/OrderItem";
import { useOrders } from "@/Services/Hook";

const Orders = () => {
  const { data: OrderData } = useOrders();

  return (
    <>
      <h3 className="text-4xl font-bold tracking-wider">My Orders</h3>
      <div className="mt-4 space-y-8">
        {OrderData?.map((item, index) => {
          return <OrderItem order={item} key={index} />;
        })}
      </div>
    </>
  );
};

export default Orders;
