'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button list-item");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function() {
            thisController.handleLoadList(newList.id);
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    confirmDeletion() {
        let control = this.controller;
        var modal = document.getElementById("my-modal");
        modal.style.display = "block";

        var confirm = document.getElementById("modal-confirm");

        var cancel = document.getElementById("modal-cancel");
        var close = document.getElementById("modal-close");

        cancel.onclick = (event) => { modal.style.display = "none";}
        close.onclick = (event) => { modal.style.display = "none";}
        confirm.onclick = function(){
            modal.style.display = "none"; 
            control.handleListDeletion();
        }

    }


    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            /*let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                //+ "<input class='task-col' id = 'task-field' type = 'text' onfocus = 'editingField()' onblur =  'defaultLook()' value ='" + listItem.description + "'>"
                                //"<div class='task-col'>" + listItem.description + "</div>"
                                + "<div class='due-date-col'>" + listItem.dueDate + "</div>"
                                //"<div class='due-date-col' id='due-date-picker'> <input type='date' value='" + listItem.dueDate + "'> </div>"
                                + "<div class='status-col'>" + listItem.status + "</div>"
                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";

            itemsListDiv.innerHTML += listItemElement;*/

            // Creating div todo-list-item-x 
            let listItemElement = document.createElement('div')
            listItemElement.id = 'todo-list-item-' + listItem.id
            listItemElement.className = 'list-item-card'

            // Task field
            let task = document.createElement('input')
            task.className = 'task-col input-fields';
            task.id = 'task-field-'+ listItem.id;
            task.type = 'text';
            task.value = listItem.description;
            task.setAttribute( "style" , "border: 0px; background: transparent");

            // Date field
            let date = document.createElement('input');
            date.className = 'due-date-col input-fields';
            date.id = 'date-field-'+ listItem.id;
            date.value = listItem.dueDate;
            date.setAttribute( "style" , "border: 0px; background: transparent");

            // Status field
            let status = document.createElement('input');
            status.className = 'status-col input-fields';
            status.id = 'status-field-'+ listItem.id;
            status.value = listItem.status;
            status.setAttribute( "style" , "border: 0px; background: transparent");

            // Controls div
            let controls = document.createElement('div');
            controls.className = 'list-controls-col';

            // Arrow up 
            let arrowUp = document.createElement('div');
            arrowUp.className = 'list-item-control material-icons';
            arrowUp.innerHTML = 'keyboard_arrow_up';

            // Arrow down
            let arrowDown = document.createElement('div');
            arrowDown.className = 'list-item-control material-icons';
            arrowDown.innerHTML = 'keyboard_arrow_down';

            // Close item
            let close = document.createElement('div');
            close.className = 'list-item-control material-icons';
            close.innerHTML = 'close';


            controls.appendChild(arrowUp);
            controls.appendChild(arrowDown);
            controls.appendChild(close);

            listItemElement.appendChild(task);
            listItemElement.appendChild(date);
            listItemElement.appendChild(status);
            listItemElement.appendChild(controls);
            itemsListDiv.appendChild(listItemElement);


            // Task field events
            task.onfocus = function(event) {
                let field = event.target;
                let current = field.innerHTML;
                field.setAttribute("style", "border: solid 2px #1E90FF; background-color: #5c6066; font-size: 12px; font-weight: 400");
            }

            task.onblur = function(event) {
                let field = event.target;
                let current = field.value;
                listItem.setDescription(current);
                field.setAttribute("style", "border: 0px; background: transparent");
                console.log(listItem.getDescription());
                
            }

            // Date field events
            date.onfocus = function(event) {
                let field = event.target;
                let current = field.innerHTML;
                field.setAttribute("type", "date");
                field.setAttribute("style", "border: solid 2px #1E90FF; background-color: #5c6066; font-size: 12px; font-weight: 400");
            }

            date.onblur = function(event) {
                let field = event.target;
                //let current = field.innerHTML;
                field.setAttribute("type", "");
                field.setAttribute("style", "border: 0px; background: transparent");

            }

            // Status field events
            status.onfocus = function(event) {
                let field = event.target;

                let selector = document.createElement('select')
                selector.value = listItem.status;
                selector.className = 'status-col input-fields';
                let op1 = document.createElement('option');
                op1.innerHTML = "complete";
                selector.appendChild(op1);
                let op2 = document.createElement('option');
                op2.innerHTML = "incomplete";
                selector.appendChild(op2);
                selector.setAttribute("style", "border: solid 2px #1E90FF; background-color: transparent; font-size: 12px; font-weight: 400");
                field.replaceWith(selector);
            }

        }
        
    

    }

    

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}