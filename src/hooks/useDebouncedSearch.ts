import { useState, useEffect } from 'react';
import { createDebouncer } from '@/src/utils/common.utils';

/**
 * Hook personalizzato per gestire la ricerca con debounce
 * 
 * @param initialValue Valore iniziale del termine di ricerca
 * @param delay Delay del debounce in millisecondi (default: 300ms)
 * @param key Chiave unica per il debouncer (default: 'search')
 * @returns Oggetto con searchTerm, debouncedSearchTerm e setSearchTerm
 */
export const useDebouncedSearch = (
  initialValue = '',
  delay = 300,
  key = 'search'
) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  // Crea un debouncer unico per questa istanza
  const debouncedSearch = createDebouncer(key, delay);

  useEffect(() => {
    debouncedSearch(() => {
      setDebouncedSearchTerm(searchTerm);
    });
  }, [searchTerm, debouncedSearch]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
};

/**
 * Hook personalizzato per gestire filtri multipli con debounce
 * 
 * @param initialFilters Filtri iniziali
 * @param delay Delay del debounce in millisecondi (default: 300ms)
 * @param key Chiave unica per il debouncer (default: 'filters')
 * @returns Oggetto con filters, debouncedFilters e setFilters
 */
export const useDebouncedFilters = <T extends Record<string, any>>(
  initialFilters: T,
  delay = 300,
  key = 'filters'
) => {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<T>(initialFilters);

  // Crea un debouncer unico per questa istanza
  const debouncedFilter = createDebouncer(key, delay);

  useEffect(() => {
    debouncedFilter(() => {
      setDebouncedFilters(filters);
    });
  }, [filters, debouncedFilter]);

  return {
    filters,
    debouncedFilters,
    setFilters,
    updateFilter: (key: keyof T, value: T[keyof T]) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
  };
};

/**
 * Utility per creare filtri di testo comuni
 */
export const createTextFilter = (searchTerm: string) => {
  if (!searchTerm.trim()) return () => true;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return (item: any, fields: string[]) => {
    return fields.some(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value?.toString().toLowerCase().includes(lowercaseSearch);
    });
  };
};

/**
 * Esempio di utilizzo:
 * 
 * ```tsx
 * import { useDebouncedSearch, createTextFilter } from '@/src/hooks/useDebouncedSearch';
 * 
 * function AdminPage() {
 *   const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch('', 300, 'adminUsers');
 *   
 *   const textFilter = createTextFilter(debouncedSearchTerm);
 *   
 *   const filteredItems = items.filter(item => 
 *     textFilter(item, ['name', 'email', 'displayName'])
 *   );
 *   
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Cerca..."
 *     />
 *   );
 * }
 * ```
 */
