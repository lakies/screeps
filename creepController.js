/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepController');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep){
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

    genericMiner: function (creep) {
        var job = creep.memory.job;
        if(!creep.memory.target){
            creep.memory.target = job.target_id;
        }
        if(!creep.memory.targetSpot){
            creep.memory.targetSpot = new RoomPosition(job.spot.x,job.spot.y,job.spot.room);
        }

        if(creep.pos.isEqualTo(new RoomPosition(job.spot.x,job.spot.y,job.spot.room))){//maybe this new object generation is too costly each time, make an internal var if arrived?
            var result = creep.harvest(Game.getObjectById(creep.memory.target));
            if(result !== 0 && result !== -4){
                console.log('Failed to harvest: error ' + result);
            }
        }else{

            console.log(creep.moveTo(new RoomPosition(job.spot.x,job.spot.y,job.spot.room)));
        }
    },

    hauler: function (creep) {

    },

    mover: function (creep) {

    }


};