import AdminPanel from "./AdminPanel";

export const metadata = {
  title: "Admin Panel | Zmr Elektronik",
  description: "Ürün, sipariş ve istatistik yönetimi - Sadece yetkili erişimi.",
};

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Admin Panel
            </h1>
            <p className="text-gray-500 mt-1 font-medium italic">
              Zmr Elektronik yönetim merkezi
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
            <span className="text-sm font-semibold text-blue-700">Güvenli Oturum</span>
          </div>
        </div>

        <AdminPanel />
      </div>
    </div>
  );
};

export default AdminPage;

