module.exports = {
    run: function(creep){//TODO: add check for time to live and do something about it
        if(creep.memory.job !== undefined){
            switch(creep.memory.job.type){
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
            }
        }
    },

    miner: function(creep){

    },

    genericMiner: function (creep) {//TODO: maybe replace spots with flags
        var job = creep.memory.job;

        if(creep.pos.isEqualTo(new RoomPosition(job.spot.x,job.spot.y,job.spot.room))){//maybe this new object generation is too costly each time, make an internal var if arrived?
            var result = creep.harvest(Game.getObjectById(job.target_id));
            if(result !== 0 && result !== -4){
                console.log('Failed to harvest: error ' + result);
            }
        }else{
            console.log(creep.moveTo(new RoomPosition(job.spot.x,job.spot.y,job.spot.room)));//don't need to console log every time probs
        }

        if(creep.carry.energy === creep.carryCapacity){
            creep.memory.lastSpot = job.spot;
            for(var i in Memory.spawns[creep.memory.spawn].sources){
                for(var u in Memory.spawns[creep.memory.spawn].sources[i].freeSpots){
                    var spot1 =  Memory.spawns[creep.memory.spawn].sources[i].freeSpots[u];
                    if(JSON.stringify(job.spot) === JSON.stringify(spot1)){
                        spot1.assigned = false;
                        creep.memory.lastSpot.assigned = false;
                        break;
                    }
                }
            }
            creep.memory.job = {type: 'hauler'};
        }
    },

    hauler: function (creep) {
        //TODO: first check for empty structures, then if full upgrade controller
        //TODO: note down somewhere how many energy is delivered to a structure to avoid overfilling
    },

    mover: function (creep) {

    },

    upgrader: function (creep){

    }



};