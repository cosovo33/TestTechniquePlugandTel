import React, { useState, useEffect } from "react";
import axios from "axios";
import HorizontalNavbar from "./components/Navbars/HorizentalNavbar";
import VerticalNavbar from "./components/Navbars/VerticalNavbar";
import { Box, Fab } from "@mui/material";
import CardComponent from "./components/cardItems/CardComponent";
import SearchComponent from "./components/search/SearchComponent";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CreateTaskModal from "./components/modals/CreateTaskModal";
import "./App.css";
import { useMemo } from "react";

function App() {
  // State variables
  const [tasks, setTasks] = useState([]); // @tasks: All the tasks stored in the database
  const [searchTasks, setSearchTasks] = useState([]); // @searchTasks: state to store the result of the search queries(by date or keywords)
  const [openModal, setOpenModal] = useState(false); // @openModal: to set Modal visibility, false --> closed

  // Fetch All tasks sorted from the server
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/tasks");//axios.get(URL)
      setTasks(response.data);// sets the tasks with the data received from the response of the server
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Search tasks by keyword
  const searchByKeyword = async (str) => {//@str : string to use as a keyword for searching
    try {
      const response = await axios.get(
        `http://localhost:3001/api/tasks/search/${str}`
      );
      setSearchTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Reset search results
  const resetSearch = () => {
    setSearchTasks([]);//set the searchTasks state to an empty array
  };

  // Search tasks by date
  const searchByDate = async (str) => {//@str: isoString holding the date value to search
    try {
      const response = await axios.get(
        `http://localhost:3001/api/tasks/by-date/${str}`
      );
      if (response.data.length === 0) {
        window.alert("No tasks found for the selected date");
      } else {
        setSearchTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Delete a task
  const handleDelete = async (taskId) => {//called in a child component when clicking the bin Icon in bottom right of task card
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));//force rerender after the deletion of the task card
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open the modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const memorizedTasks = useMemo(() => { //use memo hook for caching and otimisation
    return searchTasks.length > 0 ? searchTasks : tasks;// return searchTasks if not empty or else return tasks
  }, [searchTasks, tasks]);//triggered when searchTasks or tasks is changed to calculate the difference
  

  // Apply a side effect
  useEffect(() => {
    fetchData();// fetch all tasks on mount of the component(after 1st render and only applied once)
  }, []);

  return (
    <>
      {/* Render navigation bars */}
      <VerticalNavbar />
      <HorizontalNavbar />
      
      {/* Main content area */}
      <Box marginLeft={"5%"} width="auto" marginTop={"2%"} flex="1">
        {/* Search component */}
        <SearchComponent
          onSearch={searchByKeyword}
          onDateSearch={searchByDate}
          onReset={resetSearch}
        />

        {/* Render cards */}
        <Box display="flex" flexWrap="wrap" justifyContent="space-around">
          {memorizedTasks.map((task) => (
            <Box key={task._id} width="18%" marginBottom="20px">
              <CardComponent
                key={task._id}//each child of a list must have a unique key 
                onDeleteTask={() => handleDelete(task._id)}//pass handleDelete as a prop for the child component
                {...task}//task prop
              />
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Floating action button to open modal */}
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleOpenModal}
      >
        <NoteAddIcon />
      </Fab>
      
      {/* Render create task modal */}
      {openModal && (
        <CreateTaskModal
          open={openModal}
          handleClose={handleCloseModal}
          fetchData={fetchData}
          lastOrder={tasks.length > 0 ? tasks[tasks.length - 1].order + 1 : 1}
        />
      )}
    </>
  );
}

export default App;
