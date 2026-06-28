import React from "react";
import CreditCartClient, { type PaymentInfo } from "./CreditCartClient";
import type { PaymentMethodType, BankAccount, Address } from "../types";

// Exporting PaymentInfo for use in other components
export type { PaymentInfo };

interface CreditCartProps {
  onComplete: (paymentInfo: PaymentInfo) => void;
  orderData?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  };
  paymentInfo?: PaymentInfo;
  selectedAddress?: Address | null;
}

/**
 * CreditCart component following "Server Components by Default" philosophy.
 * It stays as a thin wrapper that could potentially handle server-side data fetching
 * or meta-tags if needed in the future.
 */
const CreditCart = (props: CreditCartProps) => {
  return <CreditCartClient {...props} />;
};

export default CreditCart;
