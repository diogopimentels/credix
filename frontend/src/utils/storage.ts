export const handleResetData = () => {
    // Keys to PRESERVE (Allowlist)
    const keysToKeep = [
        'auth-storage', // Zustand Auth Store
        'credimestre-theme', // Theme preference
        'clerk-db-jwt', // Clerk (if used)
        'clerk-js-cookie', // Clerk (if used)
    ];

    // Iterate over all keys in localStorage
    Object.keys(localStorage).forEach((key) => {
        if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    });

    // Force reload to reset state
    window.location.reload();
};
