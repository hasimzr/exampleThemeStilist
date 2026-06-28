import React from "react";
import MyOrdersClient from "./MyOrdersClient";

/**
 * MyOrders component following the Next.js "Server Components by Default" philosophy.
 * This component acts as a server-side entry point that renders the interactive client component.
 * In the future, initial data fetching can be moved here if server-side auth is ready.
 */
const MyOrders = () => {
  return <MyOrdersClient />;
};

export default MyOrders;
