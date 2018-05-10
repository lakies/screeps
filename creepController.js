module.exports = {
    run: function (creep) { //TODO: add check for time to live and do something about it

        if (creep.spawning) return;
        if (creep.memory.job !== undefined) {
            switch (creep.memory.job.type) {
                //Low level
                case 'move':
                    this.move(creep);
                    break;
                //High level
                case 'genericMining':
                    this.genericMiner(creep);
                    break;
                case 'mining':
                    this.miner(creep);
                    break;
                case 'hauling':
                    this.hauler(creep);
                    break;
                case 'moving':
                    this.mover(creep);
                    break;
                case 'upgrading':
                    this.upgrader(creep);
                    break;
            }
        }
    },

    //Low level tasks

    move: function (creep) {
        if (!creep.memory.job.toPos) {
            console.log('Creep ' + creep.name + ' is moving without target');
            return;
        }
        var job = creep.memory.job;
        var newPos = new RoomPosition(job.toPos.x, job.toPos.y, job.toPos.roomName);

        if (creep.pos.isEqualTo(newPos) || (job.toNear && creep.pos.isNearTo(newPos))) {
            creep.memory.job = job.nextJob; //it may be undefined, use that for idle creeps?
            if (creep.memory.trackTime) {
                creep.memory.arriveTime = Game.time - creep.memory.spawnTime;
                creep.memory.trackTime = undefined;
                creep.memory.spawnTime = undefined;
            }
        } else {
            creep.moveTo(newPos);
        }

    },


    //High level tasks
    miner: function (creep) {
        var job = creep.memory.job;

        if (creep.memory.arriveTime > creep.ticksToLive) {
            Game.flags[creep.memory.flag].memory.assignedMiner = null;
        }

        var result = creep.harvest(Game.getObjectById(job.target_id));

        if (result === ERR_NOT_IN_RANGE) {
            creep.memory.job = {type: 'move', toPos: job.spot, nextJob: job}
        }

        if (result !== 0) console.log('Failed to harvest: error ' + result);
    },

    genericMiner: function (creep) {//TODO: remove this entirely
        var job = creep.memory.job;
        var result = creep.harvest(Game.getObjectById(job.target_id));

        if (result === ERR_NOT_IN_RANGE) {
            creep.memory.job = {type: 'move', toPos: job.spot, nextJob: job};
            return;
        }
        if (result !== 0) console.log('Failed to harvest: error ' + result);

        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.lastJob = job;
            for (var i in Memory.spawns[creep.memory.spawn].sources) {
                for (var u in Memory.spawns[creep.memory.spawn].sources[i].freeSpots) {
                    var spot1 = Memory.spawns[creep.memory.spawn].sources[i].freeSpots[u];
                    if (JSON.stringify(job.spot) === JSON.stringify(spot1)) {
                        spot1.assigned = false;
                        creep.memory.lastJob.spot.assigned = false;
                        break;
                    }
                }
            }
            creep.memory.job = {type: 'upgrader'};
        }
    },

    haulerStates: {//use same logic for other types?
        STATE_REFILL: 0,
        STATE_FILL_STRUCTS: 1
    },

    hauler: function (creep) { //job is to get energy from miner and fill structures
        //TODO: first check for empty structures, then if full upgrade controller
        //TODO: note down somewhere how many energy is delivered to a structure to avoid overfilling
        var job = creep.memory.job;

        if (creep.memory.state === this.haulerStates.STATE_REFILL) {
            var target = _.filter(Game.flags[job.targets[job.lastTargetIndex].name].pos.look(), function (obj) {
                return obj.type === 'resource';
            })[0].resource;

            var result = creep.pickup(target);
            if (result === ERR_NOT_IN_RANGE) {
                creep.memory.job = {type: 'move', toPos: target.pos, toNear: true, nextJob: job};
            } else if (result === OK || result === ERR_FULL) {
                job.lastTargetIndex = (job.lastTargetIndex + 1) % job.targets.length;
                if (creep.carry.energy === creep.carryCapacity) {
                    creep.memory.state = this.haulerStates.STATE_FILL_STRUCTS;
                }
            }
        } else if (creep.memory.state === this.haulerStates.STATE_FILL_STRUCTS) {//assumes only energy in containers
            var targets = creep.room.find(FIND_STRUCTURES).filter(function (structure) {
                return (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
            });

            targets.sort(function (a, b) {
                var x = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE];
                return x.indexOf(a.structureType) - x.indexOf(b.structureType);
            });

            var result = creep.transfer(targets[0], RESOURCE_ENERGY);

            if (result === ERR_NOT_IN_RANGE) {
                creep.memory.job = {type: 'move', toPos: targets[0].pos, toNear: true, nextJob: job};
            } else if (result === OK && creep.carry.energy === 0 || result === ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.state = this.haulerStates.STATE_REFILL;
            } else if (result !== OK) {
                console.log('Error in transfer: ', result);
            }
        }
    },

    mover: function (creep) {

    },

    upgrader: function (creep) {
        var job = creep.memory.job;
        var result = creep.upgradeController(creep.room.controller);

        if (result === ERR_NOT_IN_RANGE) {
            creep.memory.job = {type: 'move', toPos: creep.room.controller.pos, toNear: true, nextJob: job};
            return;
        }
        if (result === ERR_NOT_ENOUGH_RESOURCES) {
            if (creep.memory.type === 'worker') {
                if (creep.memory.lastJob) {
                    creep.memory.job = creep.memory.lastJob;
                    creep.memory.lastJob = undefined;
                } else {
                    creep.memory.job = undefined;
                    Memory.freeWorkers.push(creep.name);
                }

            } else {//idk if only workers will ever upgrade, if not then fill this
                console.log('Non-worker is upgrading');
            }
        } else if (result !== 0) {
            console.log('Failed to upgrade: error ' + result);
        }


    }


};