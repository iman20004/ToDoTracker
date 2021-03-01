'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, index, item) {
        super();
        this.model = initModel;
        this.index = index;
        this.item = item;

    }

    doTransaction() {
        // UPDATE THE DATA
        this.model.removeItem(this.item);
    }

    undoTransaction() {
        this.model.undoRemoveItem(this.index, this.item);
    }
}