; (function (global, undefined) {

    var game = global.game = {
        core: global.core,
        run: function (options) {
            global.core.start(options);
        },
        start: function () {
            $(document).on('keyup', game.createInstance);
        },
        activeGameObject: null,
		createStation: function(){
			game.core.getInstanceOf(global.gameObjects.Station);
		},
		createTrain: function(){
			game.core.getInstanceOf(global.gameObjects.Train, { positions: [{ x: 10, y: 20 }, { x: 10, y: 400 }] });
		}
    };

    game.core.eventAggregator.subscribe(game.core.events.start, game.start);
}(this));
