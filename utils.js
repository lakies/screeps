/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    findFreeSpots: function(source){//finds empty tiles around source
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
                    var spot = {
                        x : x,
                        y : y,
                        assigned : null
                    };
                    spots.push(spot);
                }
            }
        }
        return spots;
    }
};