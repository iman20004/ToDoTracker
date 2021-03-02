'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class UpdateStatus_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldS, newS, id) {
        super();
        this.model = initModel;
        this.id = id;
        this.oldS = oldS;
        this.newS = newS;
    }

    doTransaction() {
        // UPDATE THE DATA
        this.model.updateStatus(this.id, this.newS);
    }

    undoTransaction() {
        this.model.redoUpdateStatus(this.id, this.oldS);
    }
}