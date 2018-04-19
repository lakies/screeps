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

        if(mem.creeps === undefined){
            //mem.creeps = mõtle välja kuidas creepe filtreerida
        }

        if(spawn.room.controller.level >= 3){//can build miners
            for(var s in mem.sources){
                //vaata kas miner on olemas
                //kui ei ole, siis vaata kas saab ehitada
                //kui ei saa ehitada, siis lisa generic miner job
            }
        }else{//vaata mitu kohta on kõrval ja vastavalt sellel lisa töid
            for(var s in mem.sources){
                var source = mem.sources[s];

                if(source.freeSpots === undefined){
                    source.freeSpots = utils.findFreeSpots(source);
                }

                for(var i in source.freeSpots){

                }

            }
        }

    }
};