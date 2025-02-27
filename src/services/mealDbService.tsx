import axios from "axios";
import { Recipe } from "../types/Recipe";
import { ApiResponse, CategoriesApiResponse } from "../types/ApiResponse";

const API_URL = "https://www.themealdb.com/api/json/v1/1";

let recipeCache: Map<string, Recipe> = new Map();
let categoriesCache: string[] = [];
let allRecipesCache: Recipe[] | null = null;
const letterCacheMap: Map<string, Recipe[]> = new Map();

export const searchMealsByName = async (name: string): Promise<Recipe[]> => {
  try {
    if (!name.trim()) {
      return await getInitialRecipes();
    }

    const response = await axios.get<ApiResponse>(
      `${API_URL}/search.php?s=${name}`
    );
    const recipes = response.data.meals || [];

    recipes.forEach((recipe) => {
      recipeCache.set(recipe.idMeal, recipe);
    });

    return recipes;
  } catch (error) {
    console.error("Error searching meals by name:", error);
    return [];
  }
};

export const getMealById = async (id: string): Promise<Recipe | null> => {
  if (recipeCache.has(id)) {
    return recipeCache.get(id) || null;
  }

  try {
    const response = await axios.get<ApiResponse>(
      `${API_URL}/lookup.php?i=${id}`
    );
    if (!response.data.meals || response.data.meals.length === 0) {
      return null;
    }

    const recipe = response.data.meals[0];
    recipeCache.set(id, recipe);

    return recipe;
  } catch (error) {
    console.error(`Error getting meal with id ${id}:`, error);
    return null;
  }
};

export const getMealsByLetter = async (letter: string): Promise<Recipe[]> => {
  if (letterCacheMap.has(letter)) {
    return letterCacheMap.get(letter) || [];
  }

  try {
    const response = await axios.get<ApiResponse>(
      `${API_URL}/search.php?f=${letter.toLowerCase()}`
    );
    const recipes = response.data.meals || [];

    letterCacheMap.set(letter, recipes);
    recipes.forEach((recipe) => {
      recipeCache.set(recipe.idMeal, recipe);
    });

    return recipes;
  } catch (error) {
    console.error(`Error getting meals by letter ${letter}:`, error);
    return [];
  }
};

export const getAllMealsParallel = async (
  onProgressUpdate?: (progress: number) => void
): Promise<Recipe[]> => {
  if (allRecipesCache) {
    if (onProgressUpdate) {
      onProgressUpdate(100);
    }
    return [...allRecipesCache];
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let allMeals: Recipe[] = [];
  let completedRequests = 0;

  const BATCH_SIZE = 5;

  for (let i = 0; i < alphabet.length; i += BATCH_SIZE) {
    const batch = alphabet.slice(i, i + BATCH_SIZE).split("");

    const batchPromises = batch.map((letter) => getMealsByLetter(letter));
    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach((meals) => {
      allMeals = [...allMeals, ...meals];
    });

    completedRequests += batch.length;
    if (onProgressUpdate) {
      onProgressUpdate((completedRequests / alphabet.length) * 100);
    }
  }

  allRecipesCache = [...allMeals];

  return allMeals;
};

export const getInitialRecipes = async (): Promise<Recipe[]> => {
  const initialLetters = ["a", "b", "c"];

  try {
    const promises = initialLetters.map((letter) => getMealsByLetter(letter));
    const results = await Promise.all(promises);

    return results.flat();
  } catch (error) {
    console.error("Error getting initial recipes:", error);
    return [];
  }
};

export const getAllCategories = async (): Promise<string[]> => {
  if (categoriesCache.length > 0) {
    return [...categoriesCache];
  }

  try {
    const response = await axios.get<CategoriesApiResponse>(
      `${API_URL}/categories.php`
    );
    const categories = response.data.categories.map(
      (category) => category.strCategory
    );

    categoriesCache = [...categories];

    return categories;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};

export const filterByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${API_URL}/filter.php?c=${category}`
    );
    const recipes = response.data.meals || [];

    recipes.forEach((recipe) => {
      recipeCache.set(recipe.idMeal, recipe);
    });

    return recipes;
  } catch (error) {
    console.error(`Error filtering by category ${category}:`, error);
    return [];
  }
};

export const paginateRecipes = (
  recipes: Recipe[],
  page: number,
  pageSize: number
): Recipe[] => {
  const startIndex = (page - 1) * pageSize;
  return recipes.slice(startIndex, startIndex + pageSize);
};

export const getTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};

export const clearCaches = () => {
  recipeCache.clear();
  categoriesCache = [];
  allRecipesCache = null;
  letterCacheMap.clear();
};

export const fetchAllRecipes = searchMealsByName;
export const fetchSingleRecipe = getMealById;
export const fetchCategories = getAllCategories;
export const getAllMealsSequentially = getAllMealsParallel;
