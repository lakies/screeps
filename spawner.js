/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */

var utils = require('utils');

module.exports = {
    priority: ['worker', 'miner', 'hauler'],

    sortMem: function () {
        Memory.spawningQueue.sort(function (a, b) {
            var x = ['worker', 'miner', 'hauler'];
            return x.indexOf(a.type) - x.indexOf(b.type);
        });
    },

    run: function (spawn) {//add back to mem if cant spawn
        this.sortMem();

        var newCreep = Memory.spawningQueue.pop();

        if (newCreep) {
            var body = [];
            var memory = newCreep.memory;
            switch (newCreep.type) {//TODO: add other types aswell
                case 'worker':
                    var bodyBase = [WORK, CARRY, MOVE];

                    for (var i = 0; i < Math.floor(spawn.energyCapacity / 200); i++) {
                        body = body.concat(bodyBase);
                    }
                    break;
                case 'miner':
                    body.push(MOVE);
                    for (var i = 0; i < Math.min((spawn.energyCapacity - Constants.BODYPART_COST.move)); i++) {

                    }
                    break;
            }
            var name = utils.hash(JSON.stringify(memory) + Date.now());

            var result = spawn.spawnCreep(body, name, {memory: memory, dryRun: true});

            if (result === 0) {
                console.log('Creep ' + name + ' spawning with code ' + result);
                spawn.spawnCreep(body, name, {memory: memory});
            } else {
                Memory.spawningQueue.push(newCreep);
            }


        }
    }
};