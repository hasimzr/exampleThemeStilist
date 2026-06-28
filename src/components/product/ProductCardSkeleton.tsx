import React from "react";

// Skeleton card mimics ProductCard layout with pulse & optional shimmer
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#fdf8f5] rounded-[28px] overflow-hidden border border-[#f0e6df]/50 relative aspect-[3/4.2] animate-pulse">
      {/* Top Left info placeholder */}
      <div className="absolute top-6 left-6 right-16 z-20 flex flex-col gap-2">
        {/* Category */}
        <div className="h-2.5 bg-[#e8e6e1]/70 rounded w-1/4" />
        {/* Title */}
        <div className="h-4 bg-[#e8e6e1]/70 rounded w-3/4" />
        {/* Price */}
        <div className="h-4 bg-[#e8e6e1]/70 rounded w-1/3" />
        {/* Rating */}
        <div className="h-3 bg-[#e8e6e1]/70 rounded w-1/2" />
      </div>

      {/* Top Right Heart button placeholder */}
      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#e8e6e1]/70" />

      {/* Bottom Right Cart button placeholder */}
      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#e8e6e1]/70" />
    </div>
  );
};

export default ProductCardSkeleton;
