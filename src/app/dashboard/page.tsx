import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Hesabım | Zmr Elektronik",
  description: "Zmr Elektronik kullanıcı hesabı üzerinden siparişlerinizi, adreslerinizi ve profil bilgilerinizi yönetebilirsiniz.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Dashboard = async ({ searchParams }: PageProps) => {
  const resolvedParams = await searchParams;
  const activeTab = (resolvedParams?.tab as string) || "orders";

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-8">
          Hesabım
        </h1>
        <DashboardClient initialTab={activeTab} />
      </div>
    </div>
  );
};

export default Dashboard;
