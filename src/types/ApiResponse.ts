import { Recipe } from "./Recipe";

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface ApiResponse {
  meals: Array<Recipe>;
}

export interface CategoriesApiResponse {
  categories: Array<Category>;
}
