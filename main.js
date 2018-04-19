//var spawner = require('spawner');
var spawnController = require('spawnController');

module.exports.loop = function () {

    if(Memory.jobs === undefined){
        Memory.jobs = [];
    }
    if(Memory.spawns === undefined){
        Memory.spawns = Game.spawns;
    }

    for(var name in Game.spawns){
        var spawn = Game.spawns[name];
        spawnController.run(spawn);
    }

    
};