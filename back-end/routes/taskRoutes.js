const express = require("express");
const router = express.Router();
const Task = require("../model/task");
const taskValidationSchema = require("../validation/taskValidationSchema");

// Create a new task
router.post("/tasks", async (req, res) => {
  try {
    // Validate the incoming task data
    const { error, value } = taskValidationSchema.validate(req.body);//validation agint validationschema(check validation folder)
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if a task with the same order value already exists
    const { order } = value;//get the order attribut from the value object(task)
    const existingTask = await Task.findOne({ order });
    if (existingTask) {
      return res.status(400).json({ message: "A task with the same order already exists" });
    }

    // Save the new task
    const task = new Task(value);//creation of a task object, @value:task passed via request
    await task.save();//persist the task object in the database as a document
    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating task" });
  }
});

//Get all tasks sorted by order
router.get("/tasks", async (req, res) => {
  try {
    // Retrieve all tasks sorted by order
    const tasks = await Task.find().sort({ order: 1 });//find all the tasks and sort by order (1:ascending,-1:descending)
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving tasks" });
  }
});

// Get a single task by ID
router.get("/tasks/:id", async (req, res) => {//@req = task._id // @response= task object// Url=/api/tasks/:id
  const { id } = req.params;
  try {
    // Find task by ID
    const task = await Task.findById(id);// search the task having the same _id as param id and returns a task object
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(task);
  } catch (error) {// if an internal exception occurs
    console.error(error);
    return res.status(500).json({ message: "Error retrieving task" });
  }
});

// Route to update the status of a task by its ID
router.put('/tasks/status/:id', async (req, res) => {
  const { id } = req.params;//@ _id of the task to chaneg, param passed via request object
  const { status } = req.body;//@ new status, param passed via request object

  try {
    // Find the task by its ID
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the status of the task
    task.status = status;
    await task.save(); //Persistence function from mongoose 

    // Send a success response
    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a task by ID
router.put("/tasks/:id", async (req, res) => { //@task object (missing _id, can't be modified)
  const { id } = req.params;//@ _id of the task to modify
  try {
    // Validate the incoming task data
    const { error, value } = taskValidationSchema.validate(req.body);//validate against validationschema(check validation folder)
    if (error) {
      return res.status(400).json({ message: error.details[0].message });//return a bad request status with an error
    }

    // Update the task
    const task = await Task.findByIdAndUpdate(id, value, { new: true });// find the task by @id and update the fields with the @valuequery
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating task" });
  }
});

// Delete a task by ID
router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;//@_id of the task to delete, passed via req
  try {
    // Find and delete the task by ID
    const task = await Task.findByIdAndDelete(id);//creates a find and delete by id  query, @id
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting task" });
  }
});

// Route to filter tasks by date
router.get("/tasks/by-date/:date", async (req, res) => {
  const { date } = req.params;//@duedate of the task, Date Format
  try {
    // Find tasks with due dates equal to the target date
    const tasks = await Task.find({ dueDate: date });// find query that return a list of documents matching the filter 
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching tasks by date" });
  }
});

// Route to filter tasks by status
router.get("/tasks/by-status/:status", async (req, res) => {
  const { status } = req.params;
  try {
    // Find tasks with the specified status
    const tasks = await Task.find({ status });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks by status" });
  }
});

// Route to search tasks by keyword in title and description
router.get("/tasks/search/:keyword", async (req, res) => {
  const { keyword } = req.params;
  try {
    // Search tasks by keyword in title and description
    const tasks = await Task.find({
      $or: [//a MongoDB operator that performs a logical OR operation on an array of two or more expressions
        { title: { $regex: new RegExp(keyword, "i") } },//@keyword obtained via searchTerm inputfield
        { description: { $regex: new RegExp(keyword, "i") } },//$regex is a MongoDb query condition, i option means case-insensitive
      ],
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching tasks by keyword" });
  }
});

// Route to switch the order attribute between two tasks
router.put("/tasks/switch-order/:id", async (req, res) => {// in order to persist the order of the displayed tasks in front after Drag and drop
  const { id } = req.params; //@ _id of the task to update its order
  const { newOrder } = req.body;//@ newOrder is the new value of order attribut

  try {
    // Find the task with the provided ID
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the task with the new order
    const existingTaskWithNewOrder = await Task.findOne({ order: newOrder });// returns a one task document having the newOrder value(order is a unique number)
    if (!existingTaskWithNewOrder) { //case of a neworder value that dosen't exist
      return res.status(400).json({ message: "No task with the new order exists" });
    }

    // Swap the order between the current task and the task with the new order
    const currentOrder = task.order;//@currentOrder is a temp constant to prevent losing the old order of the task
    task.order = existingTaskWithNewOrder.order;//@ new order value overriding the old order value
    existingTaskWithNewOrder.order = currentOrder;//Affection of the old order to the task we swapped with(avoiding conflict)

    // Save both tasks with the new order values
    await task.save();
    await existingTaskWithNewOrder.save();

    return res.status(200).json({ message: "Order switched successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error switching order" });
  }
});

module.exports = router;
