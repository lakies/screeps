module.exports = {
    run: function(creep){//TODO: add check for time to live and do something about it
        if(creep.spawning) return;
        if(creep.memory.job !== undefined){
            switch(creep.memory.job.type){
                //Low level
                case 'move':
                    this.move(creep);
                    break;
                //High level
                case 'genericMining':
                    this.genericMiner(creep);
                    break;
                case 'miner':
                    this.miner(creep);
                    break;
                case 'hauler':
                    this.hauler(creep);
                    break;
                case 'mover':
                    this.mover(creep);
                    break;
                case 'upgrader':
                    this.upgrader(creep);
                    break;
            }
        }
    },

    //Low level tasks

    move: function(creep){
        if(!creep.memory.job.toPos){
            console.log('Creep ' + creep.name + ' is moving without target');
            return;
        }
        var job = creep.memory.job;
        var newPos = new RoomPosition(job.toPos.x,job.toPos.y,job.toPos.roomName);

        if(creep.pos.isEqualTo(newPos) || (job.toNear && creep.pos.isNearTo(newPos))){
            creep.memory.job = job.nextJob;//it may be undefined, use that for idle creeps?
        }else{
            creep.moveTo(newPos);
        }

    },


    //High level tasks
    miner: function(creep){

    },

    genericMiner: function (creep) {//TODO: maybe replace spots with flags
        var job = creep.memory.job;
        var result = creep.harvest(Game.getObjectById(job.target_id));

        if(result === ERR_NOT_IN_RANGE){
            creep.memory.job = {type:'move',toPos:job.spot,nextJob:job};
            return;
        }
        if(result !== 0){
            console.log('Failed to harvest: error ' + result);
        }

        if(creep.carry.energy === creep.carryCapacity){
            creep.memory.lastJob = job;
            for(var i in Memory.spawns[creep.memory.spawn].sources){
                for(var u in Memory.spawns[creep.memory.spawn].sources[i].freeSpots){
                    var spot1 =  Memory.spawns[creep.memory.spawn].sources[i].freeSpots[u];
                    if(JSON.stringify(job.spot) === JSON.stringify(spot1)){
                        spot1.assigned = false;
                        creep.memory.lastJob.spot.assigned = false;
                        break;
                    }
                }
            }
            creep.memory.job = {type: 'upgrader'};
        }
    },

    hauler: function (creep) {
        //TODO: first check for empty structures, then if full upgrade controller
        //TODO: note down somewhere how many energy is delivered to a structure to avoid overfilling
    },

    mover: function (creep) {

    },

    upgrader: function (creep){
        var job = creep.memory.job;
        var result = creep.upgradeController(creep.room.controller);

        if(result === ERR_NOT_IN_RANGE){
            creep.memory.job = {type:'move',toPos:creep.room.controller.pos,toNear:true,nextJob:job};
            return;
        }
        if(result === ERR_NOT_ENOUGH_RESOURCES){
            if(creep.memory.type === 'worker'){
                if(creep.memory.lastJob){
                    creep.memory.job = creep.memory.lastJob;
                    creep.memory.lastJob = undefined;
                }else{
                    creep.memory.job === undefined;
                    Memory.freeWorkers.push(creep.name);
                }

            }else{//idk if only workers will ever upgrade, if not then fill this
                console.log('Non-worker is upgrading');
            }
        }else if(result !== 0){
            console.log('Failed to upgrade: error ' + result);
        }


    }



};