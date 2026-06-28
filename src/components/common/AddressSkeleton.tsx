const AddressSkeleton = () => {
  return (
    <div className="rounded-xl p-5 bg-white shadow-md flex flex-col gap-3 animate-pulse border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
        </div>
      </div>
      <div className="text-gray-700">
        <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mt-1"></div>
      </div>
      <div className="pt-2 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
};

export default AddressSkeleton;
