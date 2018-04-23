var spawnController = require('spawnController');
var utils = require('utils');
var spawner = require('spawner');

module.exports.loop = function () {

    utils.initializeMemory();
    //TODO: check if unused creep in memory
    for(var name in Game.spawns){
        var spawn = Game.spawns[name];
        spawnController.run(spawn);
        spawner.run(spawn);
    }
    
};