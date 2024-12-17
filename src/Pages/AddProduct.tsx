import OrderItem from "@/Components/OrderItem";
import PageMeta from "@/Layouts/PageMeta";
import UserLayout from "@/Layouts/UserLayout";
import { useOrders } from "@/Services/Hooks";
import AdminProductsComponent from "@/Pages/Admin/Components/AdminProductsComponent";
const AddProduct = () => {
  

  return (
    <UserLayout>
    <AdminProductsComponent/>  
    </UserLayout>
  );
};

export default AddProduct;
