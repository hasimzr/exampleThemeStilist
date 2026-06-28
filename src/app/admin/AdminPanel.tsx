import React from "react";
import AdminPanelClient from "./AdminPanelClient";
import { AllProductApiServer } from "@/Api/controllers/ProductController";

/**
 * AdminPanel component following the Next.js "Server Components by Default" philosophy.
 * This component handles server-side data fetching for the product list, 
 * improving initial load performance and SEO.
 */
const AdminPanel = async () => {
    let initialProducts = [];

    try {
        // Fetch products on the server side
        const response = await AllProductApiServer(1, 100);
        if (response?.data?.data) {
            initialProducts = response.data.data;
        } else if (Array.isArray(response?.data)) {
            initialProducts = response.data;
        }
    } catch (error) {
        console.error("Failed to fetch products on server:", error);
        // Fallback to empty list; the client component can still try to fetch or show error
    }

    return <AdminPanelClient initialProducts={initialProducts} />;
};

export default AdminPanel;
