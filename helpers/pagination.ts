export const getPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 0) return [];

  const delta = 1;
  const range: (number | string)[] = [];

  for (let i = 0; i < totalPages; i++) {
    if (
      i === 0 ||
      i === totalPages - 1 ||
      (i >= currentPage - delta && i <= currentPage + delta) //
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
};
