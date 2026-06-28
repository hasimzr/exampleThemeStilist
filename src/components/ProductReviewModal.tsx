import React from "react";
import ProductReviewModalClient, { type ProductReviewModalProps } from "./ProductReviewModalClient";

/**
 * ProductReviewModal component following the Next.js "Server Components by Default" philosophy.
 * This component acts as a server-side entry point that renders the interactive client component.
 */
const ProductReviewModal = (props: ProductReviewModalProps) => {
  return <ProductReviewModalClient {...props} />;
};

export default ProductReviewModal;
export type { ProductReviewModalProps };
