import React, { useRef, useState } from "react";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { MAX_IMAGE_SIZE_MB } from "@/constants";
import SubmitterButton from "../Button/SubmitterButton";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function GameForm({
  code,
  assignedId,
  handleSnackbar,
  resetAssigned,
}: {
  code: string;
  assignedId: number;
  handleSnackbar: (open: boolean, status?: number, message?: string) => void;
  resetAssigned: () => void;
}) {
  const [name, setName] = useState("");
  const [selfie, setSelfie] = useState<File>();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [disableSkip, setDisableSkip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSelfieChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (image.size < 1024 * 1024 * MAX_IMAGE_SIZE_MB) {
        // image is less than 0.5 MB
        return setSelfie(image);
      }
      handleSnackbar(true, 1000, "Compressing...");
      const compressedSelfie = await compressImage(image);
      if (!compressedSelfie) {
        handleSnackbar(true, 400, "Compression Failed.");
        setTimeout(() => handleSnackbar(false), 1000);
        return;
      }
      handleSnackbar(false, 200, "Compressed");
      setSelfie(compressedSelfie);
    }
  };

  const compressImage = async (image: File) => {
    const options = {
      maxSizeMB: MAX_IMAGE_SIZE_MB,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    try {
      const compressedImage = await imageCompression(image, options);
      return compressedImage;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (!selfie) {
      handleSnackbar(true, 400, "Selfie not uploaded.");
      setTimeout(() => handleSnackbar(false), 1000);
      return;
    }

    formData.append("selfie", selfie as Blob);
    formData.append("assignedId", assignedId.toString());

    handleSnackbar(true, 1000, "Submitting...");
    setDisableSubmit(true);
    await axios
      .post(`/api/user/game/${code}`, formData)
      .then(() => {
        handleSnackbar(true, 200, "Submitted.");
        setTimeout(() => handleSnackbar(false), 1000);
        resetAssigned();
        setName("");
        setSelfie(undefined);
      })
      .catch((error) => {
        const data = error.response.data;
        if (data.code === "INVALID_NAME") {
          handleSnackbar(true, 400, "Incorrect name.");
          setTimeout(() => handleSnackbar(false), 1000);
          return;
        } else {
          console.error(data);
          handleSnackbar(true, 500, data?.code);
          setTimeout(() => handleSnackbar(false), 1000);
        }
        console.error(error);
      })
      .finally(() => setDisableSubmit(false));
  };

  const handleSkip = async () => {
    setDisableSkip(true);
    handleSnackbar(true, 1000, "Skipping...");
    axios
      .get(`/api/user/game/${code}/skip/${assignedId}`)
      .then(() => {
        resetAssigned();
        handleSnackbar(false, 200, "Skipped.");
      })
      .catch((error) => {
        handleSnackbar(false, 500, "Skip failed.");
        console.error(error);
      })
      .finally(() => setDisableSkip(false));
  };
  //TODO: Upload from camera
  return (
    <Box
      component="form"
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 4,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button variant="contained" component="label">
        Upload Selfie
        <VisuallyHiddenInput
          type="file"
          ref={fileInputRef}
          onChange={handleSelfieChange}
          accept="image/png, image/jpeg"
        />
      </Button>
      {selfie && <Typography>{selfie.name}</Typography>}
      <SubmitterButton
        text="Submit"
        sx={{ width: "100%" }}
        disable={disableSubmit}
        handleSubmit={handleSubmit}
        spinOnDisable={true}
      />
      <SubmitterButton
        text="Skip"
        disable={disableSkip}
        handleSubmit={handleSkip}
        spinOnDisable={true}
        sx={{
          width: "100%",
          backgroundColor: "white",
          color: "black",
          ":hover": { backgroundColor: "black", color: "white" },
        }}
      />
    </Box>
  );
}
