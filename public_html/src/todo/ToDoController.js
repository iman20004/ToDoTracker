'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            appModel.getConfirmation();
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        } 
        document.getElementById("close-list-button").onmousedown = function() {
            appModel.closeCurrentList();
        }  

    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    handleListDeletion(){
        this.model.removeCurrentList();
    }

    handleDescChange(oldText, newText, id) {
        this.model.UpdateDescriptionTransaction(oldText,newText, id);
    }

    handleDateChange(oldDate, newDate, id){
        this.model.UpdateDateTransaction(oldDate,newDate, id);
    }

    handleSwap(index1, index2){
        this.model.SwapTransaction(index1, index2);
    }

    handleDeleteItem(itemID) {
        this.model.DeleteItemTransaction(itemID);
    }

    handleStatusChange(oldStat, newStat, id) {
        this.model.UpdateStatusTransaction(oldStat,newStat, id );
    }
}