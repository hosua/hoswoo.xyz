interface SetWithTTLProps {
  key: string;
  value?: unknown;
  ttl: number;
}

export const setWithTTL = ({ key, value, ttl }: SetWithTTLProps) => {
  const now = Date.now();
  const item = {
    value,
    expiresAt: now + ttl * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithTTL = <T>({ key }: { key: string }): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = Date.now();

    if (now > item.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const removeWithTTL = ({ key }: { key: string }) => {
  localStorage.removeItem(key);
};
