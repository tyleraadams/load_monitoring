'use strict';
module.exports.poll = function (fn, interval) {
    (function p() {
        fn();
        setTimeout(p, interval);
    })();
};
