import React from "react";
import OrderDrawerClient, { type OrderDrawerProps } from "./OrderDrawerClient";

/**
 * OrderDrawer component following the Next.js "Server Components by Default" philosophy.
 * This component acts as a server-side entry point that renders the interactive client component.
 */
const OrderDrawer = (props: OrderDrawerProps) => {
  return <OrderDrawerClient {...props} />;
};

export default OrderDrawer;
export type { OrderDrawerProps };
