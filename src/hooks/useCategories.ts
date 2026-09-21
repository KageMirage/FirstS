import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  fetchCategories, 
  fetchChildCategories, 
  setActivePill, 
  setSelectedCategory 
} from '../store/slices/categoriesSlice';
import { Category } from '../types/api';

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const { 
    categories, 
    childCategories, 
    featuredCategories, 
    topPills, 
    activePillId, 
    selectedCategory, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.categories);

  const setPill = useCallback((pillId: string) => {
    dispatch(setActivePill(pillId));
  }, [dispatch]);

  const selectCategory = useCallback((cat: Category | null) => {
    dispatch(setSelectedCategory(cat));
  }, [dispatch]);

  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      dispatch(fetchCategories());
    }
    if (childCategories.length === 0) {
      dispatch(fetchChildCategories());
    }
  }, [dispatch, categories.length, childCategories.length, isLoading]);

  return {
    categories,
    childCategories,
    featuredCategories,
    topPills,
    activePillId,
    selectedCategory,
    isLoading,
    error,
    setPill,
    selectCategory,
  };
};
