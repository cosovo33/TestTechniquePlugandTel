import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const EditTaskModal = ({ open, handleClose, task }) => {
  // State to hold the edited task data
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    status: task.status,
    order: task.order,
  });

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a PUT request to update the task
      await axios.put(`http://localhost:3001/api/tasks/${task._id}`, editedTask);
      // Close the modal after successful update
      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
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
        <h2 id="modal-title">Edit Task</h2>
        {/* Edit task form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={editedTask.dueDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          {/* Submit button */}
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditTaskModal;
