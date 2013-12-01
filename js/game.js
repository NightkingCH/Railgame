; (function (global, undefined) {

    var game = global.game = {
        core: global.core,
        run: function (options) {
            global.core.start(options);
        }
    };
}(this));