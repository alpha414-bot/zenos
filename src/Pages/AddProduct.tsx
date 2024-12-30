import OrderItem from "@/Components/OrderItem";
import PageMeta from "@/Layouts/PageMeta";
import UserLayout from "@/Layouts/UserLayout";
import { useOrders } from "@/Services/Hooks";
import UserProductsComponent from "@/Pages/Admin/Components/UserProductsComponent";
const AddProduct = () => {
  

  return (
    <UserLayout>
    <UserProductsComponent/>  
    </UserLayout>
  );
};

export default AddProduct;
