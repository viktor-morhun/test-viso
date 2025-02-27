import React from "react";

const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-[360px] h-[350px] p-5 rounded-[20px] overflow-hidden bg-gray-50 animate-pulse">
      <div className="relative h-[200px] w-full">
        <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-[10px]"></div>
      </div>

      <div className="mt-[14px]">
        <div className="h-[21px] bg-gray-200 rounded-md w-3/4 mb-3"></div>

        <div className="flex items-center mt-1.5">
          <div className="px-2 py-0.5 bg-gray-200 rounded-md h-5 w-16"></div>
          <div className="px-2 py-0.5 bg-gray-200 rounded-md h-5 w-16 ml-2"></div>
        </div>

        <div className="mt-2.5 flex justify-center items-center">
          <div className="px-3 py-1 rounded-full w-full h-10 bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
