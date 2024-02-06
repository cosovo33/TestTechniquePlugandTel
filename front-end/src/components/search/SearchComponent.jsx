import React, { useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Divider } from "@mui/material";
import dayjs from "dayjs";
import { Box } from "@mui/material";

{/*To hold the search elements in one component tehn used it in the App.js */}
const SearchComponent = ({ onSearch, onDateSearch, onReset }) => {
  const [searchTerm, setSearchTerm] = useState("");//@searchTerm state to store the value of teh input field
  const [selectedDate, handleDateChange] = useState(dayjs());//sets the value of today as a Date object

  const handleSearch = () => {
    if (searchTerm) {//cehck if searchTerm is empty
      onSearch(searchTerm);//callback to make an axios call for search by keyword API
    } else {
      window.alert("You must include keywords");
    }
  };

  const handleDateSearch = () => {
    if (selectedDate) {
      let stringDate = selectedDate.format("YYYY-MM-DD");//Date formatting to get all the tasks of that specific day ignoring the time data
      onDateSearch(stringDate);                         //Callback to make an axios call to search by date API
    } else {
      window.alert("No date selected");
    }
  };

  return (
    <Stack direction="row" spacing={2} marginBottom={"2%"} alignItems="left">
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);//set the state searchTerm to take the input value

          onReset();                    //callback passed as a prop
                                        //Triggers the reset of the searchTasks state to []
                                        // to display all the tasks instead of the searched tasks
        }}
        InputProps={{                       //to nest a material ui component
          style: { borderRadius: "20px" }, // Set border radius
          endAdornment: (
            <>
              <Divider orientation="vertical" flexItem />
              <Button
                onClick={handleSearch}  //event handler to trigger the handleSearch function
                variant="contained"
                color="secondary"
                style={{
                  borderRadius: "20px",
                  backgroundColor: "white",
                  color: "grey",
                }}
              >
                Keywords
              </Button>
            </>
          ),
        }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={selectedDate}      // we set the date of today by default to be displayed in the input field
          onChange={handleDateChange}//event handler to dispatch the state setter of the date

        />
      </LocalizationProvider>
      <Box
        style={{
          display: "inline-flex", // Ensure center alignment
          alignItems: "center", // Center vertically
        }}
      >
        <ArrowForwardIcon />    {/* an icon of an arrow */}
        <Button
          onClick={()=>{handleDateSearch();onReset()}}
          variant="contained"
          color="primary"
          style={{
            borderRadius: "20px",//to have the circular edges
            backgroundColor: "black",
            color: "grey",
          }}
        >
          Aujourd'hui
        </Button>
      </Box>
    </Stack>
  );
};

export default SearchComponent;
