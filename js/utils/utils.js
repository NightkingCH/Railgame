; (function (global, undefined) {
    var utils = global.utils = {
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
}(this));