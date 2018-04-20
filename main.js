var spawnController = require('spawnController');
var utils = require('utils');

module.exports.loop = function () {

    utils.initializeMemory();

    for(var name in Game.spawns){
        var spawn = Game.spawns[name];
        spawnController.run(spawn);
    }
    
};