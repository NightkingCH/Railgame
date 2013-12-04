; (function (global, undefined) {
    var gameObjects = global.gameObjects = {};

    var core = global.core = {
        animateFrame: window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null,
        eventAggregator: global.eventAggregator,
        /*
        * All possible events
        */
        events: global.gameEvents,
        exit: false,
        startTime: null,
        frameStartTime: null,
        currentTime: function () {
            return new Date().getTime();
        },
        deltaTime: null,
        calcDeltaTime: function () {
            return core.currentTime() - core.startTime;
        },
        deltaDelay: 0,
        maxFramesPerSecond: 60,
        /*
        * Informs all object to init and starts the mainloop
        */
        start: function (options) {
            core.startTime = new Date().getTime();
            core.frameStartTime = core.startTime;

            core.deltaDelay = (options && options.deltaDelay) || 1000.0 / core.maxFramesPerSecond;
            
            core.eventAggregator.publish(core.events.start, core);
            
            core.animateFrame.call(window, core.run);//start recursiv loop
        },
        /*
        * Mainloop
        */
        run: function () {
            
            //exit game, called from stop-function
            if (core.exit) {
                core.eventAggregator.publish(core.events.stop, core);
                return;
            }
            
            core.deltaTime = core.calcDeltaTime();
            
            if (core.deltaTime < core.deltaDelay){
                core.animateFrame.call(window, core.run); //recursiv loop

                return;
            }
            
            core.startTime = core.currentTime();
            
            core.eventAggregator.publish(core.events.update, core);
            core.eventAggregator.publish(core.events.beforeDraw, core);
            core.eventAggregator.publish(core.events.draw, core);
            core.eventAggregator.publish(core.events.afterDraw, core);
            core.eventAggregator.publish(core.events.lateUpdate, core);
            
            core.animateFrame.call(window, core.run); //recursiv loop
        },
        /*
        * Stops the game
        */
        stop: function () {
            core.exit = true;
        },
		instancedGameObjects: [],
		getInstanceOf: function(ctor, args){
		    var gameObject = new ctor(args);
		    
			gameObject.uid = core.getGuid();

			gameObject.start();
			
			core.instancedGameObjects.push(gameObject);
			
			return gameObject;
		},
		getObjectById: function (uid) {

		    if (!uid)
		        return null;

		    var index = -1;

		    for (var i = 0; i < core.instancedGameObjects.length; ++i) {
		        if (core.instancedGameObjects[i].uid !== uid)
		            continue;

		        index = i;
		        break;
		    }

		    if (index === -1)
		        return null;

		    var result = core.instancedGameObjects.splice(index, 1);
		    
		    if (result.length <= 0)
		        return null;
		    
		    return result[0];
		},
		getObjectsByType: function (type) {

		    if (!type)
		        return null;

		    var gameObjectsByType = [];

		    for (var i = 0; i < core.instancedGameObjects.length; ++i) {
		        if (core.instancedGameObjects[i].type !== type)
		            continue;

		        gameObjectsByType.push(core.instancedGameObjects[i]);
		    }

		    return gameObjectsByType;
		},
		removeGameObject: function(gameObject){
			if(!gameObject)
				return false;
		
			if(!gameObject.uid)
				return false;
				
			var index = -1;	
		
			for (var i = 0; i < core.instancedGameObjects.length; ++i) {
				if(core.instancedGameObjects[i].uid !==  gameObject.uid)
					continue;
					
					index = i;
				break;	
			}
			
			if(index === -1)
				return false;
				
			core.instancedGameObjects.splice(index, 1);
			
			core.eventAggregator.publish(core.events.gameObjectRemoved, core, gameObject);
			
			if(gameObject.stop)
				gameObject.stop();
				
			gameObject = null;
			
			delete gameObject;
			
			return true;
		},
		//nice solution: http://stackoverflow.com/a/2117523
		getGuid: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		},
        getGridsize: function(){
            return {
                width: 10,
                height: 10
            };
        },
        getMouseOffset: function(){
            return {
                width: 10,
                height: 10
            };
        },

    };
}(this));