import AdminLayout from "@/Layouts/AdminLayout";
import PageMeta from "@/Layouts/PageMeta";
import AdminProductsComponent from "./Components/AdminProductsComponent";
import AdminUsersComponent from "./Components/AdminUsersComponent";
import AdminEcommerceComponent from "./Components/AdminEcommerceComponent";
import AdminDashoardComponent from "./Components/AdminDashboardComponent";

const AdminDashoard = () => {
  // useImportScript("")
  return (
    <AdminLayout>
      <PageMeta
        title="Dashboard - Administrator"
        description="Administrator dashboard to manage users, products and inventory"
      >
        <div className="py-4 space-y-24">
          <AdminDashoardComponent />
          <AdminEcommerceComponent />
          <AdminUsersComponent />
          <AdminProductsComponent />
        </div>
      </PageMeta>
    </AdminLayout>
  );
};

export default AdminDashoard;
