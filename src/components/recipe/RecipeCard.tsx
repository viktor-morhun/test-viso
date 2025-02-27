import React from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "../../types/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
  isSelected: boolean;
  onSelect: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSelected,
  onSelect,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.idMeal}`);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div
      className={`w-full max-w-[360px] h-[350px] p-5 rounded-[20px] overflow-hidden lg:hover:shadow-md transition-shadow lg:cursor-pointer ${
        isSelected ? "bg-blue-50 shadow-md" : "bg-gray-50"
      }`}
      onClick={handleCardClick}
    >
      <div className="relative h-[200px] w-full">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
        />
      </div>

      <div className="mt-[14px]">
        <h3 className="text-[18px] font-semibold leading-[21px] text-gray-800 line-clamp-1">
          {recipe.strMeal}
        </h3>

        <div className="flex items-center mt-1.5">
          <span className="px-2 py-0.5 bg-blue-100 rounded-md text-xs text-blue-600">
            {recipe.strCategory}
          </span>
          <span className="px-2 py-0.5 bg-blue-100 rounded-md text-xs text-blue-600 ml-2">
            {recipe.strArea}
          </span>
        </div>

        <div className="mt-2.5 flex justify-center items-center">
          <button
            className={`px-3 lg:cursor-pointer py-1 rounded-full w-full h-10 text-xs ${
              isSelected
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={handleSelectClick}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;