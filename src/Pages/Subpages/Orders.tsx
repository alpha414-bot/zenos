import OrderItem from "@/Components/OrderItem";
import PageMeta from "@/Layouts/PageMeta";
import UserLayout from "@/Layouts/UserLayout";
import { useOrders } from "@/Services/Hooks";

const Orders = () => {
  const { data: OrderData } = useOrders();

  return (
    <UserLayout>
      <PageMeta
        title="User - My Orders"
        description="View, Manage and place your order"
      >
        <h3 className="text-4xl font-bold tracking-wider">My Orders</h3>
        <div className="mt-4 space-y-8">
          {OrderData?.map((item, index) => {
            return <OrderItem order={item} key={index} />;
          })}
        </div>
      </PageMeta>
    </UserLayout>
  );
};

export default Orders;
