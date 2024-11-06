/* eslint-disable @typescript-eslint/no-explicit-any */
function isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      console.error((e as Error).message);
      return false;
    }
    return true;
  }
  
//   export const localStorageHealthCheck = async (): Promise<void> => {
//     for (let i = 0; i < localStorage.length; ++i) {
//       try {
//         const result = window.localStorage.getItem(localStorage.key(i) as string);
//         if (!isJsonString(result as string)) {
//           window.localStorage.removeItem(localStorage.key(i) as string);
//         }
//         if (result && Object.keys(result).length === 0) {
//           window.localStorage.removeItem(localStorage.key(i) as string);
//         }
//       } catch (error) {
//         window.localStorage.clear();
//         console.error('window.localStorage Exception occurred:', error);
//       }
//     }
//   };
  
  export const storePersist = {
    set: (key: string, state: any): void => {
      window.localStorage.setItem(key, JSON.stringify(state));
    },
    get: (key: string): any | false => {
      const result = window.localStorage.getItem(key);
      if (!result) {
        return false;
      } else {
        if (!isJsonString(result)) {
          window.localStorage.removeItem(key);
          return false;
        } else return JSON.parse(result);
      }
    },
    remove: (key: string): void => {
      window.localStorage.removeItem(key);
    },
    getAll: (): Storage => {
      return window.localStorage;
    },
    clear: (): void => {
      window.localStorage.clear();
    },
  };

  export const LOCAL_STORAGE_KEY = {
    LOGIN_DETAILS: 'LOGIN_DETAILS'
  }
  
  export default storePersist;
  
  