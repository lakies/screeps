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
                case 'genericMiner':
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

    },

    hauler: function (creep) {

    },

    mover: function (creep) {

    }


};