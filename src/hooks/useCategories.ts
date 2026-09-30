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
    isCategoriesLoaded,
    isChildLoading,
    isChildCategoriesLoaded,
    error 
  } = useAppSelector((state) => state.categories);

  const setPill = useCallback((pillId: string) => {
    dispatch(setActivePill(pillId));
  }, [dispatch]);

  const selectCategory = useCallback((cat: Category | null) => {
    dispatch(setSelectedCategory(cat));
  }, [dispatch]);

  useEffect(() => {
    if (!isCategoriesLoaded && !isLoading) {
      dispatch(fetchCategories());
    }
    if (!isChildCategoriesLoaded && !isChildLoading) {
      dispatch(fetchChildCategories());
    }
  }, [dispatch, isCategoriesLoaded, isChildCategoriesLoaded, isLoading, isChildLoading]);

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
