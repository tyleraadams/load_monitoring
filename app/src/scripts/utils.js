module.exports.poll = function (fn, callback, errback, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    (function p() {
      if(fn()) {
          callback();
      } else {
          errback(new Error('timed out for ' + fn + ': ' + arguments));
      }
      setTimeout(p, interval);
    })();
}
