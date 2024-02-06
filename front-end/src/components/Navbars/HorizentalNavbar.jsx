import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
const horizontalTheme = createTheme({
  //styling the theme to pass it as a render prop
  palette: {
    primary: {
      main: "#e7e7e7", //setting the color of the horizental bar
    },
  },
});

const HorizontalNavbar = () => {
  return (
    <ThemeProvider theme={horizontalTheme}>{/*theme provider to pass our theme prop created above*/}
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"// the size of a h6 title
            component="div"
            sx={{ flexGrow: 1, marginLeft: "4%" }}// applying the override of style
            textAlign="left"// align the text to the left of the wraping element
          >
            Horizontal Navbar
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default HorizontalNavbar;
