'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import UpdateDescription_Transaction from './transactions/UpdateDescription_Transaction.js'
import UpdateDate_Transaction from './transactions/UpdateDate_Transaction.js'
import Swap_Transaction from './transactions/Swap_Transaction.js'
import UpdateStatus_Transaction from './transactions/UpdateStatus_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'
import ToDoView from './ToDoView.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    UpdateDescriptionTransaction(oldD,newD, id) {
        let transaction = new UpdateDescription_Transaction(this, oldD, newD, id);
        this.tps.addTransaction(transaction);
    }

    UpdateDateTransaction(oldDat,newDat, id) {
        let transaction = new UpdateDate_Transaction(this, oldDat, newDat, id);
        this.tps.addTransaction(transaction);
    }

    SwapTransaction(item1, item2) {
        let transaction = new Swap_Transaction(this, item1, item2);
        this.tps.addTransaction(transaction);
    }

    UpdateStatusTransaction(oldStatus,newStatus, id ) {
        let transaction = new UpdateStatus_Transaction(this, oldStatus, newStatus, id);
        this.tps.addTransaction(transaction);
    }

    DeleteItemTransaction(itemID) {
        let listIndex = -1;
        for (let i = 0; (i < this.currentList.items.length); i++) {
            if (this.currentList.items[i].id === itemID)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let item = this.currentList.getItemAtIndex(listIndex);
            let transaction = new DeleteItem_Transaction(this, listIndex, item);
            this.tps.addTransaction(transaction);
        }
        
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        this.tps.clearAllTransactions();
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        this.tps.clearAllTransactions();

        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            // mywork below line
            this.currentList.setTime();
            this.view.refreshLists(this.toDoLists);
            this.view.viewList(this.currentList);
        }
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    getConfirmation(){
        this.view.confirmDeletion();
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {

        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }

        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
    }

    updateDesc(descID, newDesc) {
        let listIndex = -1;
        for (let i = 0; (i < this.currentList.items.length); i++) {
            if (this.currentList.items[i].id === descID)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let itemDesc = this.currentList.getItemAtIndex(listIndex);
            itemDesc.setDescription(newDesc);
            this.view.viewList(this.currentList);
        }
        
    }

    redoUpdateDesc(descID, oldDesc) {
        let listIndex = -1;
        for (let i = 0; (i < this.currentList.items.length); i++) {
            if (this.currentList.items[i].id === descID)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let itemDesc = this.currentList.getItemAtIndex(listIndex);
            itemDesc.setDescription(oldDesc);
            this.view.viewList(this.currentList);
        }
    }

    updateDate(dateID, newDate) {
        let listIndex = -1;
        for (let i = 0; (i < this.currentList.items.length); i++) {
            if (this.currentList.items[i].id === dateID)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let item = this.currentList.getItemAtIndex(listIndex);
            item.setDueDate(newDate);
            this.view.viewList(this.currentList);
        }
    }

    redoUpdateDate(dateID, oldDate) {
        let listIndex = -1;
        for (let i = 0; (i < this.currentList.items.length); i++) {
            if (this.currentList.items[i].id === dateID)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let item = this.currentList.getItemAtIndex(listIndex);
            item.setDueDate(oldDate);
            this.view.viewList(this.currentList);
        }
    }

    updateStatus(statusID, newStatus) {
        let listIndex = -1;
        for (let i = 0; (i < this.currentList.items.length); i++) {
            if (this.currentList.items[i].id === statusID)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let item = this.currentList.getItemAtIndex(listIndex);
            item.setStatus(newStatus);
            this.view.viewList(this.currentList);
        }
    }

    redoUpdateStatus(statusID, oldStatus) {
        let listIndex = -1;
        for (let i = 0; (i < this.currentList.items.length); i++) {
            if (this.currentList.items[i].id === statusID)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let item = this.currentList.getItemAtIndex(listIndex);
            item.setStatus(oldStatus);
            this.view.viewList(this.currentList);
        }
    }

    swapItems(firstInd, secondInd) {
        var item = this.currentList.getItemAtIndex(firstInd); 
        this.currentList.items[firstInd] = this.currentList.items[secondInd];
        this.currentList.items[secondInd] = item;
        this.view.viewList(this.currentList);
    }

    undoRemoveItem(index, item) {
        this.currentList.items.splice(index, 0, item);
        this.view.viewList(this.currentList);
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
        document.getElementById("add-item-button").disabled = true;
        document.getElementById("delete-list-button").disabled = true;
        document.getElementById("close-list-button").disabled = true;
        document.getElementById("undo-button").disabled = true;
        document.getElementById("redo-button").disabled = true;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    } 

    closeCurrentList() {
        this.currentList = null;
        this.tps.clearAllTransactions();
        this.view.clearItemsList();
        document.getElementById("add-list-button").disabled = false;
        document.getElementById("add-item-button").disabled = true;
        document.getElementById("delete-list-button").disabled = true;
        document.getElementById("close-list-button").disabled = true;
    }
}