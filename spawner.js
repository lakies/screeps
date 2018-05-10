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
            return x.indexOf(b.type) - x.indexOf(a.type);
        });
    },

    run: function (spawn) {//add back to mem if cant spawn
        if(spawn.spawning) return;
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

                    for (var i = 0; i < Math.min(Math.floor(spawn.energyCapacity / (BODYPART_COST.work * 2 + BODYPART_COST.move)), 3); i++) {
                        body = body.concat([MOVE,WORK,WORK]);
                    }
                    break;
                case 'hauler':
                    for (var i = 0; i < Math.min(Math.floor(spawn.energyCapacity / (BODYPART_COST.carry + BODYPART_COST.move)), 8); i++) {//may need more than 8
                        body = body.concat([MOVE,CARRY]);
                    }
                    break;
            }

            var name;
            if(newCreep.name){
                name = newCreep.name;
            }else{
                name = utils.genCreepName();
            }

            var result = spawn.spawnCreep(body, name, {memory: memory, dryRun: true});
            console.log(result);
            if (result === 0) {
                console.log('Creep ' + name + ' spawning with code ' + result);
                spawn.spawnCreep(body, name, {memory: memory});
            } else {
                Memory.spawningQueue.push(newCreep);
            }


        }
    }
};