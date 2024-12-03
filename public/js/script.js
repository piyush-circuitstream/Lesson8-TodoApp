document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById('todo-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const todoList = document.getElementById('todoList');

    let editingItemId = null;

    // 1. Fetch All Todos on page reload (Ex: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event),
    //also dynamically create elements(checkbox, li element, delete button) for all items in the list of todo - call GET API
    fetchTodos();

    //Handle form submission to create new to-do item or update existing to-do item
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = titleInput.value;
        const description = descriptionInput.value;

        if (editingItemId) {
            //Updating existing item
            fetch(`/todos/${editingItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            })
                .then(res => res.json())
                .then(() => {
                    editingItemId = null; //Reset edit mode
                    titleInput.value = '';
                    descriptionInput.value = '';
                    fetchTodos();
                })
                .catch(err => console.error('Error on updating todo item: ', err));

        } else {
            //Creating a new to-do item
            const newTodo = {
                title,
                description
            };

            console.log(JSON.stringify(newTodo));
            //2. Listner on submit event => trigger the post api with data (title and description) to create a new to-do item - call POST API
            fetch('/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            })
                .then(res => res.json())
                .then(todo => {
                    titleInput.value = '';
                    descriptionInput.value = '';
                    fetchTodos();
                })
                .catch(err => console.error('Error creating todo item: ', err));
        }
    });


    //Function to fetch all todo items and display them
    function fetchTodos() {
        fetch('/todos')
            .then(res => res.json())
            .then(todos => {
                todoList.innerHTML = '';
                todos.forEach(todo => {
                    const todoItem = document.createElement('li');

                    //Create a checkbox for completed status
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = todo.completed;
                    checkbox.addEventListener('change', function () {
                        toggleComplete(todo._id, todo.completed);
                    });

                    //Create a span for title and description
                    const textSpan = document.createElement('span');
                    textSpan.textContent = `${todo.title} - ${todo.description}`

                    // Apply strikethrough if the todo is completed
                    if (todo.completed) {
                        textSpan.style.textDecoration = 'line-through';
                    }

                    //Create a delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.onclick = function () {
                        deleteTodo(todo._id);
                    }

                    //Create a edit button
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Edit';
                    editBtn.onclick = function () {
                        editTodo(todo._id, todo.title, todo.description);
                    }

                    //Append checkbox, text, delete and edit button to the list item
                    todoItem.appendChild(checkbox);
                    todoItem.appendChild(textSpan);
                    todoItem.appendChild(editBtn);
                    todoItem.appendChild(deleteBtn);

                    todoList.appendChild(todoItem);
                });
            })
            .catch(err => console.error('Error on fetching all todo items: ', err));
    }

    //3. Add event listener on delete action - call DELETE API
    window.deleteTodo = function (id) {
        fetch(`/todos/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchTodos())
            .catch(err => console.error('Error on deleting todo item: ', err));
    };

    //4. Add event listener on checkbox checked event - call PUT API
    window.toggleComplete = function (id, completed) {
        fetch(`/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !completed })
        })
            .then(res => res.json())
            .then(() => fetchTodos())
            .catch(err => console.error('Error on updating todo item: ', err));
    }

    window.editTodo = function (id, title, description) {
        titleInput.value = title;
        descriptionInput.value = description;

        // Set editingItemId for edit operation
        editingItemId = id;
    }
});
