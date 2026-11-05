export const percentage = (amount?: number, total?: number) => {
  if (!amount) amount = 0;

  if (total === 0) return 0;

  if (!total) total = 1;

  if (amount > total) return 100;

  return Math.round((amount / total) * 100);
};
