import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";

function SubmitterButton({
  text,
  handleSubmit,
  spinOnDisable = true,
  disable,
}: {
  text: string;
  handleSubmit?: React.MouseEventHandler<HTMLButtonElement>;
  disable?: boolean;
  spinOnDisable?: boolean;
}) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ m: 2, width: "50%", height: "2rem" }}
      onClick={handleSubmit}
      disabled={disable}
    >
      <div className="flex items-center align-middle">
        {disable && spinOnDisable && (
          <CircularProgress size={"1.5rem"} sx={{ mr: 1 }} />
        )}
        {!disable && <Typography>{text}</Typography>}
      </div>
    </Button>
  );
}

export default SubmitterButton;
