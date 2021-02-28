'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class UpdateDescription_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldText, newText, ind) {
        super();
        this.model = initModel;
        this.oldText = oldText;
        this.newText = newText;
        this.ind = ind;
    }

    doTransaction() {
        // UPDATE THE DATA
        this.model.updateDesc(this.ind, this.newText);
    }

    undoTransaction() {
        this.model.redoUpdateDesc(this.ind, this.oldText);
    }
}