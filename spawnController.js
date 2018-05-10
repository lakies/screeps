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

        if(!mem.oneTime){//stuff to do only on setup, maybe move to another place
            mem.oneTime = true;

            var sources = spawn.room.find(FIND_SOURCES);
            for(var i in sources){
                console.log('Flagging source');
                utils.flagSources(sources[i],spawn.name);
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
        var unassigned = _.filter(Game.flags,function (flag) {
            return Memory.flags[flag.name].spawn === spawn.name && Memory.flags[flag.name].assignedMiner === null;
        });

        if(unassigned.length > 0){

        }
    },

    maintenanceOp: function (spawn) {//builds, repairs and upgrades

    }

};