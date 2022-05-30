'use strict';

class VegiBox {

    constructor(obj) {
        Object.assign(this, obj);
    }

    static createVegiBoxInstance(boxID, vegiID, growerID, harvestDate){
        return new VegiBox({boxID, vegiID, growerID, harvestDate});
    }

    getBoxID(){
        return this.boxID;
    }

    getVegiID(){
        return this.vegiID;
    }

    getGrowerID(){
        return this.growerID;
    }

    getHarvestDate(){
        return this.harvestDate;
    }
}

module.exports = VegiBox;