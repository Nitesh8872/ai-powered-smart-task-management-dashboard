// LocalStorage interaction helpers
export const storage = {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear(),
    
    getToken: () => localStorage.getItem("token"),
    getRefreshToken: () => localStorage.getItem("refreshToken"),
    setTokens: (token, refreshToken) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
    },
    clearTokens: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
    }
};
