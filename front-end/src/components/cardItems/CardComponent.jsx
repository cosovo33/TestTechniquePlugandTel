import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditTaskModal from "../modals/EditTaskModal";
import axios from "axios";

const CardComponent = ({
  _id,
  title,
  dueDate,
  description,
  status,
  order,
  onDeleteTask,
}) => {
  // State for the selected status of the task
  const [selectedItem, setSelectedItem] = useState(status);
  // State for controlling the visibility of the EditTaskModal
  const [openModal, setOpenModal] = useState(false);

  // Function to handle the change in task status
  const handleSelectChange = async (event) => {
    const newStatus = event.target.value;
    setSelectedItem(newStatus);

    try {
      // Make a PUT request to update the task status
      await axios.put(`http://localhost:3001/api/tasks/status/${_id}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Function to handle the click event for editing the task
  const handleEditClick = () => {
    setOpenModal(true);
  };

  // Function to handle closing the EditTaskModal
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const avatarColor =["yellow","red","purple","blue"];// an array with a sring @color for the card Header bgcolor
  const colorIndex = (order - 1) % avatarColor.length;// avatarColor indexes start from 0; order starts from 1
                                                      //when order is greater than avatarcolor.length the modulo makes sure to stay in bound.
  return (
    <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Card header with avatar */}
      
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: avatarColor[colorIndex] }} aria-label="recipe">
            {title[0].toUpperCase()}
          </Avatar>
        }
        title={title}
        subheader={dueDate}
      />
      {/* Card content displaying task description */}
      <CardContent style={{ flex: "1 0 auto" }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      {/* Card actions section */}
      <CardActions style={{ marginTop: "auto" }} disableSpacing>
        {/* Dropdown menu to select task status */}
        <Select
          value={selectedItem}
          onChange={handleSelectChange}
          style={{ marginRight: "auto" }}
        >
          <MenuItem value={"To Do"}>To Do</MenuItem>
          <MenuItem value={"In Progress"}>In Progress</MenuItem>
          <MenuItem value={"Done"}>Done</MenuItem>
        </Select>
        {/* Button to trigger editing the task */}
        <IconButton aria-label="edit" onClick={handleEditClick}>
          <EditNoteIcon fontSize={"large"} />
        </IconButton>
        {/* Button to delete the task */}
        <IconButton aria-label="delete" onClick={onDeleteTask}>
          <DeleteIcon fontSize={"large"} />
        </IconButton>
        {/* EditTaskModal for editing the task */}
        <EditTaskModal
          open={openModal}
          handleClose={handleCloseModal}
          task={{ _id, title, description, dueDate, status, order }}
        />
      </CardActions>
    </Card>
  );
};

export default CardComponent;
