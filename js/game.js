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
        createInstance: function (event) {
            event = event || window.event;
            
            //m (make)
            if(event.keyCode !== 77) {
                return;
            }
			
            game.activeGameObject = game.core.getInstanceOf(global.gameObjects.City);

            activeGameObject.xPos = 10;
            activeGameObject.yPos = 20;
        },
    };
    
    game.core.eventAggregator.subscribe(game.core.events.start, game.start);
    }(this));
