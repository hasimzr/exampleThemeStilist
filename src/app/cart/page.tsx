import CartClient from "./CartClient";
import { Suspense } from "react";

export const metadata = {
  title: "Alışveriş Sepeti | Zmr Elektronik",
  description: "Zmr Elektronik alışveriş sepetinizdeki ürünleri görüntüleyin ve güvenle satın alın.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orderId = typeof params.orderId === "string" ? params.orderId : null;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <CartClient orderIdParam={orderId} />
    </Suspense>
  );
}
