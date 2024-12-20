const express = require('express');
const router = express.Router();

const { Todo } = require('../models/models');

// Fetch all Todo items 
router.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id
        });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong! Please try again later.", error: err })
    }
})

// Create a new Todo item
router.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new Todo({
            title,
            description,
            user: req.user.id
        });
        await newTodo.save();
        res.status(201).json({ message: "New to-do item is created successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error on creating a to-do item. Please try again later.", error: err });
    }
});

// Update a to-do item
router.put('/todos/:id', async (req, res) => {
    const { title, description, completed } = req.body;
    try {
        const toBeUpdated = await Todo.findById(req.params.id);
        if (toBeUpdated) {
            //Some checkes to update only if there is proper value
            if (title != undefined) {
                toBeUpdated.title = title;
            }
            if (description != undefined) {
                toBeUpdated.description = description;
            }
            if (completed != undefined) {
                toBeUpdated.completed = completed;
            }

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
router.delete('/todos/:id', async (req, res) => {
    try {
        let result = await Todo.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ message: "Todo item has been deleted successfully!" });
        } else {
            res.status(404).json({ message: "Requested to-do item cannot be found for delete." })
        }
    } catch (err) {
        res.status(500).json({ message: "Error on deleting a to-do item. Please try again later.", error: err });
    }
})

module.exports = router;