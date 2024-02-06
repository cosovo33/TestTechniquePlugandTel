import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const CreateTaskModal = ({ open, handleClose, fetchData, lastOrder }) => {
  // State to hold the new task data
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "To Do",
    order: lastOrder, // Get the last order from props
  });

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to create a new task
      await axios.post("http://localhost:3001/api/tasks", newTask);
      // Fetch updated tasks after creating a new task
      fetchData();
      // Close the modal
      handleClose();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
        }}
      >
        {/* Modal title */}
        <h2 id="modal-title">Create New Task</h2>
        {/* Create task form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newTask.description}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={newTask.dueDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            disabled
            label="Order"
            name="order"
            type="number"
            value={newTask.order}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          {/* Submit button */}
          <Button type="submit" variant="contained" color="primary">
            Create Task
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateTaskModal;
