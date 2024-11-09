module.exports = () => {
  return Array.from({ length: 6 }, () => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].at(Math.floor(Math.random() * 10));
  }).join("");
};
