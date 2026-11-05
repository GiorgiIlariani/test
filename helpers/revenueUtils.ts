export const defaultOrder = {
  Q1: {
    forecast: 'desc',
    actual: 'desc',
    delta: 'desc',
    months: Array.from(Array(12).keys())?.map(() => ({
      forecast: 'desc',
      actual: 'desc',
      delta: 'desc',
    })),
  },
  Q2: {
    forecast: 'desc',
    actual: 'desc',
    delta: 'desc',
    months: Array.from(Array(12).keys())?.map(() => ({
      forecast: 'desc',
      actual: 'desc',
      delta: 'desc',
    })),
  },
  Q3: {
    forecast: 'desc',
    actual: 'desc',
    delta: 'desc',
    months: Array.from(Array(12).keys())?.map(() => ({
      forecast: 'desc',
      actual: 'desc',
      delta: 'desc',
    })),
  },
  Q4: {
    forecast: 'desc',
    actual: 'desc',
    delta: 'desc',
    months: Array.from(Array(12).keys())?.map(() => ({
      forecast: 'desc',
      actual: 'desc',
      delta: 'desc',
    })),
  },
  total: {
    forecast: 'desc',
    actual: 'desc',
    delta: 'desc',
    months: Array.from(Array(12).keys())?.map(() => ({
      forecast: 'desc',
      actual: 'desc',
      delta: 'desc',
    })),
  },
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4', 'total'];
