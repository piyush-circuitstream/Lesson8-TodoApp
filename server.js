const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(express.static('public'));

//Connection of mongoDB
mongoose.connect('mongodb://localhost:27017/')
    .then((data) => {
        console.log("My database is connected!")
    }).catch((err) => {
        console.error("Error connecting to MongoDB: ", err);
    });

// Serve the index.html for default route
app.get('/', (req, res) => {
    res.sendFile(__dirname, './views/index.html');
});

// Fetch all Todo items 
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong! Please try again later.", error: err })
    }
})

// Create a new Todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new Todo({
            title,
            description
        });
        await newTodo.save();
        res.status(201).json({ message: "New to-do item is created successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error on creating a to-do item. Please try again later.", error: err });
    }
});

// Update a to-do item
app.put('/todos/:id', async (req, res) => {
    const { title, description, completed } = req.body;
    try {
        const toBeUpdated = Todo.findById(req.params.id);
        if (toBeUpdated) {
            toBeUpdated.title = title;
            toBeUpdated.description = description;
            toBeUpdated.completed = completed;

            await toBeUpdated.save();
            res.status(200).json(toBeUpdated);
        } else {
            res.status(404).json({ message: "Requested to-do item cannot be found for update." });
        }

    } catch (err) {
        res.status(500).json({ message: "Error on updating a to-do item. Please try again later.", error: err });
    }
});

// Delete a to-do item
app.delete('/todos/:id', async (req, res) => {
    try {
        let result = Todo.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ message: "Todo item has been deleted successfully!" });
        } else {
            res.status(404).json({ message: "Requested to-do item cannot be found for delete." })
        }
    } catch (err) {
        res.status(500).json({ message: "Error on deleting a to-do item. Please try again later.", error: err });
    }
})

//server listening to the requests
app.listen(PORT, () => {
    console.log(`My server is listening to ${PORT}`)
});