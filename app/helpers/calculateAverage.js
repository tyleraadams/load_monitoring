module.exports = function (arr) {
  if (arr.length) {
    return arr.reduce(function (prevItem, currItem) {
      return prevItem + currItem;
    }) / arr.length;
  }
}
