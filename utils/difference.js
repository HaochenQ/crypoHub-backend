module.exports = (newData, oldData) => {
  const difference = (newData - oldData) / oldData;
  return difference.toFixed(6);
};
