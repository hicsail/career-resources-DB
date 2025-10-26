export function sortByStringKey<T>(key: keyof T): (a: T, b: T) => number {
  return (a, b) => {
    const va = (a?.[key] ?? '').toString().trim().toLowerCase();
    const vb = (b?.[key] ?? '').toString().trim().toLowerCase();
    if (!va && !vb) return 0;
    if (!va) return 1;
    if (!vb) return -1;
    return va.localeCompare(vb);
  };
}