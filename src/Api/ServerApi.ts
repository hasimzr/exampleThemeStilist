// lib/api-server.ts (Veya benzeri bir yere koy)
import axios from "axios";
import { BASE_URL, DEVELOPER_SITE } from "./ApiConstants";

export const ServerApi = async () => {
  const { headers } = await import("next/headers");
  const headerList = await headers();

  const host = headerList.get("host") || "";

  // Backend'in interceptor mantığına uygun origin tespiti
  const origin = host.includes("localhost") ? "localhost" : host.replace("www.", "").split(":")[0];

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Origin": `https://${origin}`,
      "Developer-Site": DEVELOPER_SITE,
      "Authorization": headerList.get("Authorization") || ""
    }
  });
};


