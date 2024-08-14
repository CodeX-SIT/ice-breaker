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
    success: {
      main: "hsl(120, 100%, 60%)",
    },
    info: {
      main: "hsl(0, 100%, 100%)",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
