export const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString('en-IN')}`;

export const formatNumber = (value) => Number(value).toLocaleString('en-IN');
