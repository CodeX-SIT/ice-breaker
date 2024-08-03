"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#26282f",
    },
    secondary: {
      main: "hsl(0, 0%, 0%)",
    },
    error: {
      main: "hsl(0, 60%, 50%)",
    },
    background: {
      default: "#104",
    },
  },
});

export default theme;
 