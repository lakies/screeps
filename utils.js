/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    maxSpots: 1,
    findFreeSpots: function(source){//finds empty tiles around source, maybe limit to 4
        var p = source.pos;
        var spots = [];
        for(var x = Math.max(p.x - 1,0); x < Math.min(p.x + 2, 50); x++){
            for(var y = Math.max(p.y - 1,0); y < Math.min(p.y + 2, 50); y++){
                if(Game.getObjectById(source.id).room.lookAt(x,y).filter(function(a){
                    if(a.type === "terrain" && a.terrain === "wall"){
                        return true;
                    }
                    return false;
                }).length === 0){
                    var spot1 = {
                        x : x,
                        y : y,
                        room : source.room.name,
                        assigned : false
                    };

                    if(_.filter(Game.creeps,function (creep) {
                            return creep.memory.job.spot && JSON.stringify(spot1) === JSON.stringify(creep.memory.job.spot);
                        }).length > 0) spot1.assigned = true;

                    spots.push(spot1);
                    if(spots.length >= this.maxSpots) return spots;
                }
            }
        }
        return spots;
    },

    initializeMemory: function(){
        if(!Memory.spawningQueue){
            Memory.spawningQueue = [];
        }
        if(!Memory.jobs){
            Memory.jobs = [];
        }
        if(!Memory.spawns){
            Memory.spawns = Game.spawns;
        }
        if(!Memory.freeWorkers){
            Memory.freeWorkers = [];
        }
    },

    hash: function(s) {
        /* Simple hash function. */
        var a = 1, c = 0, h, o;
        if (s) {
            a = 0;
            /*jshint plusplus:false bitwise:false*/
            for (h = s.length - 1; h >= 0; h--) {
                o = s.charCodeAt(h);
                a = (a<<6&268435455) + o + (o<<14);
                c = a & 266338304;
                a = c!==0?a^c>>21:a;
            }
        }
        return String(a);
    }
};