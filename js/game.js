; (function (global, undefined) {

    var game = global.game = {
        core: global.core,
        run: function (options) {
            global.core.start(options);
        },
        start: function () {
            $(document).on('keyup', game.createInstance);
            $(document).on('keyup', game.moveLeft);
            $(document).on('keyup', game.moveRight);
        },
        activeBox: null,
        createInstance: function (event) {
            event = event || window.event;
            
            //space
            if(event.keyCode !== 77) {
                return;
            }
			
            game.activeBox = game.core.getInstanceOf(global.gameObjects.Dotter);
        },
        moveLeft: function (event) {
            event = event || window.event;
            
            if (event.keyCode !== 37) {
                return;
            }
            
            game.activeBox.moveLeft();
        },
        moveRight: function (event) {
            event = event || window.event;
            
            if (event.keyCode !== 39) {
                return;
            }
            
            game.activeBox.moveRight();
        }
    };
    
    game.core.eventAggregator.subscribe(game.core.events.start, game.start);
    }(this));
