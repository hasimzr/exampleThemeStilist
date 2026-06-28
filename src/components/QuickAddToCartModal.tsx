import React from "react";
import QuickAddToCartModalClient, {
  type QuickAddToCartModalProps,
} from "./QuickAddToCartModalClient";

/**
 * QuickAddToCartModal component following the Next.js "Server Components by Default" philosophy.
 * This component acts as a server-side entry point that renders the interactive client component.
 */
const QuickAddToCartModal = (props: QuickAddToCartModalProps) => {
  return <QuickAddToCartModalClient {...props} />;
};

export default QuickAddToCartModal;
export type { QuickAddToCartModalProps };
