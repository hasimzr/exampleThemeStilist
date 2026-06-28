import React from "react";
import CartClientContent from "./CartClientContent";

interface CartClientProps {
    orderIdParam?: string | null;
}

/**
 * CartClient component following the Next.js "Server Components by Default" philosophy.
 * Acts as a server-side entry point for the shopping cart page.
 */
const CartClient = ({ orderIdParam }: CartClientProps) => {
    return <CartClientContent orderIdParam={orderIdParam} />;
};

export default CartClient;
