const todoItemContainer = document.getElementById("todo-items-container");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");


const apiUrl = "http://localhost:5000/";

// 1. Fetch All Todos on page reload (Ex: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event),
//also dynamically create elements(checkbox, li element, delete button) for all items in the list of todo - call GET API

//2. Listner on submit event => trigger the post api with data (title and description) to create a new to-do item - call POST API

//3. Add event listener on delete action - call DELETE API

//4. Add event listener on checkbox checked event - call PUT API


