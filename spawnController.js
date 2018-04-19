/*
right now functions as a controller for spawns
should run every idk 10 secs
later add support for more than one spawn per room
*/

var utils = require("utils");

module.exports = {
    run: function(spawn){

        var mem = Memory.spawns[spawn.name];

        if(mem.sources === undefined){
            mem.sources = spawn.room.find(FIND_SOURCES);
        }

        if(mem.creeps === undefined){//if spawning new creep then should probably add creep manually to mem because this does not update automatically
            mem.creeps = {};
            for(var i in Game.creeps){
                if(Game.creeps[i].memory.spawn === undefined) throw "Creep does not have spawn in memory";
                if(Game.creeps[i].memory.spawn === spawn.name){
                    mem.creeps[i] = Game.creeps[i];
                }
            }
        }

        if(spawn.room.controller.level >= 3){//can build miners
            for(var s in mem.sources){
                //vaata kas miner on olemas
                //kui ei ole, siis vaata kas saab ehitada
                //kui ei saa ehitada, siis lisa generic miner job
            }
        }else{//vaata mitu kohta on kÃµrval ja vastavalt sellel lisa tÃ¶id
            for(var s in mem.sources){
                var source = mem.sources[s];

                if(source.freeSpots === undefined){
                    source.freeSpots = utils.findFreeSpots(source);
                }

                for(var i in source.freeSpots){
                    var spot = source.freeSpots[i];
                    if(spot.assigned === null){//check if spot does not have a miner assigned
                        if(Memory.freeWorkers.length === 0 && Memory.jobs.filter(function (job) {
                                return job.spot !== undefined && job.spot === spot;
                            }).length === 0){//if there is free worker then add there is not already a job queued then add job
                            Memory.jobs.push({
                                type: 'genericMining',
                                receiver: 'worker',
                                spot: spot,
                                target: source
                            });
                        }else{//if not then check if a creep has this spot as lastspot i.e. it last mined there
                            var lastWorkers = mem.creeps.filter(function (creep) {
                                return creep.memory.lastSpot !== undefined && creep.memory.lastSpot === spot;
                            });

                            if(lastWorkers.length > 0){
                                Memory
                            }
                        }
                    }
                }

            }
        }

    }
};