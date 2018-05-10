/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    maxSpots: 9, // revise limit
    findFreeSpots: function (source) {//finds empty tiles around source
        var p = source.pos;
        var spots = [];
        for (var x = Math.max(p.x - 1, 0); x < Math.min(p.x + 2, 50); x++) {
            for (var y = Math.max(p.y - 1, 0); y < Math.min(p.y + 2, 50); y++) {
                if (Game.getObjectById(source.id).room.lookAt(x, y).filter(function (a) {
                        if (a.type === "terrain" && a.terrain === "wall") {
                            return true;
                        }
                        return false;
                    }).length === 0) {
                    var spot1 = {
                        x: x,
                        y: y,
                        roomName: source.room.name,
                        assigned: false
                    };

                    if (_.filter(Game.creeps, function (creep) {
                            return creep.memory.job.spot && JSON.stringify(spot1) === JSON.stringify(creep.memory.job.spot);
                        }).length > 0) spot1.assigned = true;

                    spots.push(spot1);
                    if (spots.length >= this.maxSpots) return spots;
                }
            }
        }
        return spots;
    },

    placeFlag: function (pos, args) {
        var newName = "Flag" + Memory.lastFlag++;
        Game.rooms[pos.roomName].createFlag(new RoomPosition(pos.x, pos.y, pos.roomName),newName,args.color1,args.color2);
        Game.flags[newName].memory = args.memory;
    },

    genFlags: function (spawn) {
        //currently spawning a storage, 2 towers, 2 containers and a link around spawn
        var x = spawn.pos.x;
        var y = spawn.pos.y;
        var rn = spawn.pos.roomName;

        this.placeFlag({x: x + 1, y: y + 1, roomName: rn}, {
            memory: {type: 'build', structure: STRUCTURE_STORAGE},
            color1: COLOR_ORANGE,
            color2: COLOR_GREEN
        });
        this.placeFlag({x: x + 1, y: y, roomName: rn}, {
            memory: {type: 'build', structure: STRUCTURE_CONTAINER},
            color1: COLOR_ORANGE,
            color2: COLOR_BLUE
        });
        this.placeFlag({x: x - 1, y: y, roomName: rn}, {
            memory: {type: 'build', structure: STRUCTURE_CONTAINER},
            color1: COLOR_ORANGE,
            color2: COLOR_BLUE
        });
        this.placeFlag({x: x + 1, y: y - 1, roomName: rn}, {
            memory: {type: 'build', structure: STRUCTURE_TOWER},
            color1: COLOR_ORANGE,
            color2: COLOR_WHITE
        });
        this.placeFlag({x: x - 1, y: y - 1, roomName: rn}, {
            memory: {type: 'build', structure: STRUCTURE_TOWER},
            color1: COLOR_ORANGE,
            color2: COLOR_WHITE
        });
        this.placeFlag({x: x - 1, y: y + 1, roomName: rn}, {
            memory: {type: 'build', structure: STRUCTURE_LINK},
            color1: COLOR_ORANGE,
            color2: COLOR_CYAN
        });
    },

    initializeMemory: function () {
        if (!Memory.spawningQueue) {
            Memory.spawningQueue = [];
        }
        if (!Memory.jobs) {
            Memory.jobs = [];
        }
        if (!Memory.spawns) {
            Memory.spawns = Game.spawns;
        }
        if (!Memory.freeWorkers) {
            Memory.freeWorkers = [];
        }
        if (!Memory.lastFlag) {
            Memory.lastFlag = 0;
        }
    },

    hash: function (s) {
        /* Simple hash function. */
        var a = 1, c = 0, h, o;
        if (s) {
            a = 0;
            /*jshint plusplus:false bitwise:false*/
            for (h = s.length - 1; h >= 0; h--) {
                o = s.charCodeAt(h);
                a = (a << 6 & 268435455) + o + (o << 14);
                c = a & 266338304;
                a = c !== 0 ? a ^ c >> 21 : a;
            }
        }
        return String(a);
    }
};