; (function (global, undefined) {

    var game = global.game = {
        core: global.core,
        run: function () {
            global.core.start();
        }
    };
}(this));