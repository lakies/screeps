var spawnController = require('spawnController');
var utils = require('utils');
var spawner = require('spawner');
var creepController = require('creepController');

const profiler = require('profiler');
profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function() {

        utils.initializeMemory();
        //TODO: check if unused creep in memory
        for (var name in Game.spawns) {
            var spawn = Game.spawns[name];
            spawnController.run(spawn);
            spawner.run(spawn);
        }

        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            creepController.run(creep);
        }
    });
};