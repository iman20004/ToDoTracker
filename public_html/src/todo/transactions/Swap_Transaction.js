'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class Swap_Transaction extends jsTPS_Transaction {
    constructor(initModel, item1, item2) {
        super();
        this.model = initModel;
        this.item1 = item1;
        this.item2 = item2;

    }

    doTransaction() {
        // UPDATE THE DATA
        this.model.swapItems(this.item1, this.item2);
    }

    undoTransaction() {
        this.model.swapItems(this.item2, this.item1);
    }
}