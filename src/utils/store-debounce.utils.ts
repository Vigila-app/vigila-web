import { createDebouncer } from "@/src/utils/common.utils";

/**
 * Utility per creare store actions con debounce integrato
 * 
 * @param storeName Nome dello store per identificazione unica
 * @param delay Delay del debounce in millisecondi (default: 300ms)
 * @returns Oggetto con helper per creare actions debounced
 */
export const createStoreDebouncer = (storeName: string, delay = 300) => {
  const debouncer = createDebouncer(storeName, delay);

  return {
    /**
     * Crea un'azione debounced per operazioni di fetch/get
     * 
     * @param actionName Nome dell'azione
     * @param executor Funzione da eseguire
     * @param force Se true, bypassa il debounce
     * @param uniqueKey Chiave unica per distinguere diverse chiamate della stessa azione
     */
    createDebouncedAction: <T>(
      actionName: string,
      executor: () => Promise<T> | T,
      force = false,
      uniqueKey = ''
    ): Promise<T> => {
      if (force) {
        const result = executor();
        return result instanceof Promise ? result : Promise.resolve(result);
      }

      return new Promise<T>((resolve, reject) => {
        const suffix = uniqueKey ? `${actionName}_${uniqueKey}` : actionName;
        debouncer(() => {
          try {
            const result = executor();
            if (result instanceof Promise) {
              result.then(resolve).catch(reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        }, suffix);
      });
    },

    /**
     * Crea un debouncer dedicato per un'azione specifica
     * 
     * @param actionName Nome dell'azione
     * @returns Funzione debounced per quell'azione specifica
     */
    createActionDebouncer: (actionName: string) => {
      return (callback: () => void, uniqueKey = '') => {
        const suffix = uniqueKey ? `${actionName}_${uniqueKey}` : actionName;
        debouncer(callback, suffix);
      };
    }
  };
};

/**
 * Pattern comune per implementare debounce in store Zustand
 * 
 * Esempio di utilizzo:
 * 
 * ```typescript
 * import { createStoreDebouncer } from '@/src/utils/store-debounce.utils';
 * 
 * const { createDebouncedAction } = createStoreDebouncer('userStore');
 * 
 * // In una action dello store:
 * getUsers: async (force = false) => {
 *   return createDebouncedAction('getUsers', async () => {
 *     const users = await UserService.getUsers();
 *     set({ users });
 *     return users;
 *   }, force);
 * },
 * 
 * getUserDetails: async (userId: string, force = false) => {
 *   return createDebouncedAction('getUserDetails', async () => {
 *     const user = await UserService.getUserDetails(userId);
 *     set(state => ({ 
 *       users: state.users.map(u => u.id === userId ? user : u)
 *     }));
 *     return user;
 *   }, force, userId);
 * }
 * ```
 */
export default createStoreDebouncer;
