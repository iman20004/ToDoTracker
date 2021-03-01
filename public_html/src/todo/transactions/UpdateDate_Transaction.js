'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class UpdateDate_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldDate, newDate, ind) {
        super();
        this.model = initModel;
        this.oldDate = oldDate;
        this.newDate = newDate;
        this.ind = ind;
    }

    doTransaction() {
        // UPDATE THE DATA
        this.model.updateDate(this.ind, this.newDate);
    }

    undoTransaction() {
        this.model.redoUpdateDate(this.ind, this.oldDate);
    }
}