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

        if (mem.sources === undefined) {
            mem.sources = spawn.room.find(FIND_SOURCES);
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


        if (spawn.room.controller.level >= 3) {//can build miners
            for (var s in mem.sources) {
                //vaata kas miner on olemas
                //kui ei ole, siis vaata kas saab ehitada
                //kui ei saa ehitada, siis lisa generic miner job
            }
        } else {//vaata mitu kohta on k6rval ja vastavalt sellel lisa toid
            for (var s in mem.sources) {
                var source = mem.sources[s];

                if (source.freeSpots === undefined) {
                    source.freeSpots = utils.findFreeSpots(source);
                }

                for (var i in source.freeSpots) {
                    var spot = source.freeSpots[i];
                    if (!spot.assigned) {//check if spot does not have a miner assigned
                        var job = {
                            type: 'genericMining',
                            receiver: 'worker',
                            spot: spot,
                            target_id: source.id
                        };

                        if (Memory.freeWorkers.length === 0 && Memory.jobs.filter(function (job1) {
                                return JSON.stringify(job1.spot) === JSON.stringify(job.spot);
                            }).length === 0) {//if there is free worker then and there isn't already a job queued then add job
                            Memory.jobs.push(job);
                        } else {//if not then check if a creep has this spot as lastspot i.e. it last mined there
                            var lastWorkers = [];

                            for (var i in Game.creeps) {
                                var creep = Game.creeps[i];
                                if (creep.memory.lastJob !== undefined && JSON.stringify(creep.memory.lastJob) === JSON.stringify(job)) {
                                    lastWorkers.push(creep);
                                }
                            }

                            if (lastWorkers.length > 0) {
                                lastWorkers[0].nextJob = job;
                            } else if (Memory.spawningQueue.filter(function (obj) {
                                    return JSON.stringify(obj.memory.job) === JSON.stringify(job);
                                }).length === 0) {//if no creeps with last job as this spot then add spawning queue if not already spawning
                                Memory.spawningQueue.push({
                                    type: 'worker',
                                    memory: {job: job, spawn: spawn.name, type: 'worker'}
                                });
                            }
                        }
                    }
                }

            }
        }

    },

    miningOp: function (spawn) {

    },

    maintenanceOp: function (spawn) {//builds, repairs and upgrades

    }

};