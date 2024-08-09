import {
  Button,
  CircularProgress,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React from "react";

function SubmitterButton({
  text,
  handleSubmit,
  spinOnDisable = true,
  disable,
  sx = {},
}: {
  text: string;
  handleSubmit?: React.MouseEventHandler<HTMLButtonElement>;
  disable?: boolean;
  spinOnDisable?: boolean;
  sx?: SxProps<Theme>;
}) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={
        Object.keys(sx as {}).length === 0
          ? { m: 2, width: "50%", height: "2rem" }
          : sx
      }
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
