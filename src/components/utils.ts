export const isNonEmptyArray = (v: unknown): boolean => !!(v && Array.isArray(v) && v.length > 0);
