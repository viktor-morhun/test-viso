import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "../types/Recipe";

const SELECTED_RECIPES_KEY = "selectedRecipes";

const getInitialSelectedRecipes = (): Recipe[] => {
  const stored = localStorage.getItem(SELECTED_RECIPES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveSelectedRecipes = (recipes: Recipe[]): void => {
  localStorage.setItem(SELECTED_RECIPES_KEY, JSON.stringify(recipes));
};

export const useRecipeSelection = () => {
  const queryClient = useQueryClient();

  const { data: selectedRecipes = [] } = useQuery({
    queryKey: [SELECTED_RECIPES_KEY],
    queryFn: getInitialSelectedRecipes,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: getInitialSelectedRecipes,
  });

  const { mutate: toggleRecipeSelection } = useMutation({
    mutationFn: async (recipe: Recipe) => {
      const isSelected = selectedRecipes.some(
        (r) => r.idMeal === recipe.idMeal
      );
      const updatedRecipes = isSelected
        ? selectedRecipes.filter((r) => r.idMeal !== recipe.idMeal)
        : [...selectedRecipes, recipe];

      saveSelectedRecipes(updatedRecipes);
      return updatedRecipes;
    },
    onSuccess: (updatedRecipes) => {
      queryClient.setQueryData([SELECTED_RECIPES_KEY], updatedRecipes);
    },
  });

  const { mutate: clearSelections } = useMutation({
    mutationFn: async () => {
      saveSelectedRecipes([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData([SELECTED_RECIPES_KEY], []);
    },
  });

  return {
    selectedRecipes,
    toggleRecipeSelection,
    clearSelections,
  };
};
