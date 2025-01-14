import AdminLayout from "@/Layouts/AdminLayout";
import PageMeta from "@/Layouts/PageMeta";
import AdminEcommerceComponent from "./Components/AdminEcommerceComponent";
import AdminProductsComponent from "./Components/AdminProductsComponent";
import AdminUsersComponent from "./Components/AdminUsersComponent";

const AdminDashoard = () => {
  // useImportScript("")
  return (
    <AdminLayout>
      <PageMeta
        title="Dashboard - Administrator"
        description="Administrator dashboard to manage users, products and inventory"
      >
        <div className="py-4 space-y-24">
          <AdminEcommerceComponent />
          <AdminUsersComponent />
          <AdminProductsComponent />
        </div>
      </PageMeta>
    </AdminLayout>
  );
};

export default AdminDashoard;
