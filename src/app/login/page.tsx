import LoginClient from "./LoginClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap | Zmr Elektronik",
  description: "Zmr Elektronik hesabınıza giriş yapın.",
};

const LoginPage = () => {
  return <LoginClient />;
};

export default LoginPage;
