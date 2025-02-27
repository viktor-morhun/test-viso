import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Recipe } from "../types/Recipe";
import {
  searchMealsByName,
  getMealsByLetter,
  getInitialRecipes,
} from "../services/mealDbService";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export const useRecipes = (recipesPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progressiveLoadingState, setProgressiveLoadingState] = useState({
    currentLetterIndex: 0,
    isLoadingMore: false,
    completedLetters: new Set<string>(),
    partialRecipes: [] as Recipe[],
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ["searchRecipes", searchTerm],
    queryFn: () => searchMealsByName(searchTerm),
    enabled: Boolean(searchTerm.trim()),
  });

  const { data: initialRecipes = [], isLoading: isInitialLoading } = useQuery({
    queryKey: ["initialRecipes"],
    queryFn: getInitialRecipes,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (searchTerm.trim()) {
      return;
    }

    const loadNextBatch = async () => {
      if (
        progressiveLoadingState.isLoadingMore ||
        progressiveLoadingState.currentLetterIndex >= alphabet.length
      ) {
        return;
      }

      setProgressiveLoadingState((prev) => ({ ...prev, isLoadingMore: true }));

      const letter = alphabet[progressiveLoadingState.currentLetterIndex];

      try {
        const newRecipes = await getMealsByLetter(letter);

        const updatedRecipes = [...progressiveLoadingState.partialRecipes];
        const existingIds = new Set(updatedRecipes.map((r) => r.idMeal));

        newRecipes.forEach((recipe) => {
          if (!existingIds.has(recipe.idMeal)) {
            updatedRecipes.push(recipe);
            existingIds.add(recipe.idMeal);
          }
        });

        const completedLetters = new Set(
          progressiveLoadingState.completedLetters
        );
        completedLetters.add(letter);

        const progress = (completedLetters.size / alphabet.length) * 100;
        setLoadingProgress(progress);

        setProgressiveLoadingState({
          currentLetterIndex: progressiveLoadingState.currentLetterIndex + 1,
          isLoadingMore: false,
          completedLetters,
          partialRecipes: updatedRecipes,
        });
      } catch (error) {
        console.error(`Error loading recipes for letter ${letter}:`, error);
        setProgressiveLoadingState((prev) => ({
          ...prev,
          currentLetterIndex: prev.currentLetterIndex + 1,
          isLoadingMore: false,
        }));
      }
    };

    if (progressiveLoadingState.currentLetterIndex < alphabet.length) {
      loadNextBatch();
    }
  }, [
    progressiveLoadingState.currentLetterIndex,
    progressiveLoadingState.isLoadingMore,
    searchTerm,
  ]);

  const allRecipes = useMemo(() => {
    if (searchTerm.trim()) {
      return searchResults;
    }

    if (progressiveLoadingState.partialRecipes.length > 0) {
      return progressiveLoadingState.partialRecipes;
    }

    return initialRecipes;
  }, [
    searchTerm,
    searchResults,
    progressiveLoadingState.partialRecipes,
    initialRecipes,
  ]);

  const isLoading = useMemo(() => {
    if (searchTerm.trim()) {
      return isSearching;
    }

    return (
      progressiveLoadingState.currentLetterIndex < alphabet.length ||
      isInitialLoading
    );
  }, [
    searchTerm,
    isSearching,
    progressiveLoadingState.currentLetterIndex,
    isInitialLoading,
  ]);

  const filteredRecipes = useMemo(() => {
    if (selectedCategory) {
      return allRecipes.filter(
        (recipe) => recipe.strCategory === selectedCategory
      );
    }
    return allRecipes;
  }, [allRecipes, selectedCategory]);

  const totalRecipes = filteredRecipes.length;
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * recipesPerPage;
    return filteredRecipes.slice(startIndex, startIndex + recipesPerPage);
  }, [filteredRecipes, currentPage, recipesPerPage]);

  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    // Classic if-else spaghetti
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  return {
    recipes: paginatedRecipes,
    allRecipes,
    isLoading,
    isPartialData: isLoading && allRecipes.length > 0,
    loadingProgress,
    currentPage,
    totalPages,
    totalRecipes,
    goToPage,
    nextPage,
    prevPage,
    pageNumbers,
    setSelectedCategory,
    selectedCategory,
    setSearchTerm,
  };
};
