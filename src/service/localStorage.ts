/**
 * 由ChatGPT实现的localStorage的封装
 */

interface LocalStorage<T> {
    set: (key: string, value: T) => void;
    get: (key: string) => T | null;
    remove: (key: string) => void;
}

const storage = <T>(): LocalStorage<T> => ({
    set: (key: string, value: T) => {
        try {
            if (typeof window === "undefined") return;
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    },
    get: (key: string) => {
        try {
            if (typeof window === "undefined") return null;
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error("Error getting from localStorage:", error);
            return null;
        }
    },
    remove: (key: string) => {
        try {
            if (typeof window === "undefined") return;
            localStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing from localStorage:", error);
        }
    },
});

export default storage;
