import { useState, useCallback } from 'react';
import { OrderDirectionEnum } from '@/src/types/app.types';

export enum OrderByEnum {
  PRICE = "price",
  RATING = "rating",
  CREATED = "created"
}

export interface AdvancedFilters {
  orderBy: OrderByEnum | "";
  orderDirection: OrderDirectionEnum | "";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  type?: string;
  search?: string;
}

const initialFilters: AdvancedFilters = {
  orderBy: "",
  orderDirection: "",
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  type: "",
  search: "",
};

export const useSortOptions = () => [
  { label: "Predefinito", value: "", orderBy: "", orderDirection: "" },
  // { label: "Prezzo: dal più basso", value: "price_asc", orderBy: OrderByEnum.PRICE, orderDirection: OrderDirectionEnum.ASC },
  // { label: "Prezzo: dal più alto", value: "price_desc", orderBy: OrderByEnum.PRICE, orderDirection: OrderDirectionEnum.DESC },
  // { label: "Valutazione: più alta", value: "rating_desc", orderBy: OrderByEnum.RATING, orderDirection: OrderDirectionEnum.DESC },
  // { label: "Valutazione: più bassa", value: "rating_asc", orderBy: OrderByEnum.RATING, orderDirection: OrderDirectionEnum.ASC },
  { label: "Più recenti", value: "created_desc", orderBy: OrderByEnum.CREATED, orderDirection: OrderDirectionEnum.DESC },
  { label: "Meno recenti", value: "created_asc", orderBy: OrderByEnum.CREATED, orderDirection: OrderDirectionEnum.ASC },
];

export const useRatingOptions = () => [
  { label: "Qualsiasi", value: "" },
  { label: "⭐ 1+ stelle", value: "1" },
  { label: "⭐⭐ 2+ stelle", value: "2" },
  { label: "⭐⭐⭐ 3+ stelle", value: "3" },
  { label: "⭐⭐⭐⭐ 4+ stelle", value: "4" },
  { label: "⭐⭐⭐⭐⭐ 5 stelle", value: "5" },
];

export const useAdvancedFilters = () => {
  const [filters, setFilters] = useState<AdvancedFilters>({
    orderBy: "",
    orderDirection: "",
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    type: "",
    search: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const sortOptions = useSortOptions();

  const updateFilter = useCallback(<K extends keyof AdvancedFilters>(
    key: K, 
    value: AdvancedFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSortOption = useCallback((sortValue: string) => {
    const sortOption = sortOptions.find(option => option.value === sortValue);
    if (sortOption) {
      setFilters(prev => ({
        ...prev,
        orderBy: sortOption.orderBy as OrderByEnum | "",
        orderDirection: sortOption.orderDirection as OrderDirectionEnum | ""
      }));
    }
  }, [sortOptions]);

  const getCurrentSortValue = useCallback(() => {
    if (!filters.orderBy || !filters.orderDirection) return "";
    const sortOption = sortOptions.find(
      option => option.orderBy === filters.orderBy && option.orderDirection === filters.orderDirection
    );
    return sortOption?.value || "";
  }, [filters.orderBy, filters.orderDirection, sortOptions]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some(value => value !== "" && value !== undefined);
  }, [filters]);

  const getSearchParams = useCallback((baseParams: Record<string, any>) => {
    const params = { ...baseParams };
    
    if (filters.orderBy) params.orderBy = filters.orderBy;
    if (filters.orderDirection) params.orderDirection = filters.orderDirection;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.minRating !== undefined) params.minRating = filters.minRating;
    if (filters.type) params.type = filters.type;
    if (filters.search) params.search = filters.search;
    
    return params;
  }, [filters]);

  return {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    updateFilter,
    updateSortOption,
    getCurrentSortValue,
    resetFilters,
    hasActiveFilters: hasActiveFilters(),
    getSearchParams,
  };
};
