function getItem<T>(key: string) {
  if (typeof window === "undefined") return null;

  const item = window.localStorage.getItem(key);
  return item === null ? item : (JSON.parse(item) as T);
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(key, JSON.stringify(value));
}

export { getItem, setItem };
