/*
right now functions as a controller for spawns
should run every idk 10 secs
later add support for more than one spawn per room
*/

var utils = require("utils");


module.exports = {
    run: function (spawn) {

        if (!Memory.spawns[spawn.name]) {
            console.log("didn't add spawn to memory");
            Memory.spawns[spawn.name] = Game.spawns[spawn.name];
        }

        var mem = Memory.spawns[spawn.name];

        if (!mem.oneTime) {//stuff to do only on setup, maybe move to another place
            mem.oneTime = true;

            var sources = spawn.room.find(FIND_SOURCES);
            for (var i in sources) {
                console.log('Flagging source');
                utils.flagSources(sources[i], spawn.name);
            }
        }


        if (mem.creeps === undefined) {//if spawning new creep then should probably add creep manually to mem because this does not update automatically
            mem.creeps = {};
            for (var i in Game.creeps) {
                if (Game.creeps[i].memory.spawn === undefined) throw "Creep does not have spawn in memory";
                if (Game.creeps[i].memory.spawn === spawn.name) {
                    mem.creeps[i] = Game.creeps[i];
                }
            }
        }

        this.miningOp(spawn);

        this.maintenanceOp(spawn);

    },

    miningOp: function (spawn) {
        //TODO: if spawning miners then first job should be move to target flag
        var unassigned = _.filter(Game.flags, function (flag) {
            return Memory.flags[flag.name].type === 'miningSpot' && Memory.flags[flag.name].spawn === spawn.name && Memory.flags[flag.name].assignedMiner === null;
        });

        //console.log(unassigned[0]);
        if (unassigned.length > 0) {//checks if have to spawn miner and then spawns one
            var flag = unassigned.pop();
            if (_.filter(Memory.spawningQueue, function (obj) {
                    return JSON.stringify(obj.memory.job.spot) === JSON.stringify(flag.pos);
                }).length === 0) {//place miner in queue
                var job = {
                    type: 'mining',
                    receiver: 'miner',
                    spot: flag.pos,
                    target_id: Memory.flags[flag.name].source_id
                };
                var name = utils.genCreepName();
                Memory.flags[flag.name].assignedMiner = name;
                Memory.spawningQueue.push({
                    type: 'miner',
                    name: name,
                    memory: {
                        job: {type: 'move', toPos: job.spot, nextJob: job},
                        spawn: spawn.name,
                        type: 'miner',
                        trackTime: true,
                        spawnTime: Game.time
                    }
                });
            }

        }


    },

    maintenanceOp: function (spawn) {//builds, repairs and upgrades

    }

};