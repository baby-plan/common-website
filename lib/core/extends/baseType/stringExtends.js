String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g,
    function (m, i) {
      return args[i];
    });
};