"use client";
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import html2canvas from "html2canvas";
import { Button, Typography } from "@mui/material";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";

type Selfie = {
  mimeType: string;
  data: string;
  id: number;
  assignedId: number;
};

export const MyCollage = ({ selfieData }: { selfieData: Selfie[] }) => {
  const [processing, setProcessing] = useState(false);
  const handleDownload = () => {
    const collageElement = document.getElementById("collage");
    if (collageElement) {
      setProcessing(true);
      html2canvas(collageElement)
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "my-collage.png";
          link.click();
        })
        .finally(() => setProcessing(false));
    }
  };

  return (
    <main>
      <NavBar variant="induction" />
      <div style={{ marginTop: "64px" }}></div>
      <section>
        <div className="gallery" id="collage">
          <div
            style={{
              display: "flex",
              gap: "10px",
              margin: "10px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <img
                style={{ width: "20vh", height: "20vh", objectFit: "cover" }}
                src={`data:${selfieData[0].mimeType};base64,${selfieData[0].data}`}
                alt={`Selfie ${selfieData[0].id}`}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <img
                style={{ width: "100%", height: "20vh", objectFit: "cover" }}
                src={`data:${selfieData[1].mimeType};base64,${selfieData[1].data}`}
                alt={`Selfie ${selfieData[1].id}`}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <img
                style={{ width: "100%", height: "20vh", objectFit: "cover" }}
                src={`data:${selfieData[2].mimeType};base64,${selfieData[2].data}`}
                alt={`Selfie ${selfieData[2].id}`}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              margin: "10px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "30vh",
              }}
            >
              <img
                style={{ width: "auto", height: "30vh", objectFit: "cover" }}
                src={`data:${selfieData[3].mimeType};base64,${selfieData[3].data}`}
                alt={`Selfie ${selfieData[3].id}`}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "30vh",
              }}
            >
              <img
                style={{ width: "auto", height: "30vh", objectFit: "cover" }}
                src={`data:${selfieData[4].mimeType};base64,${selfieData[4].data}`}
                alt={`Selfie ${selfieData[4].id}`}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              margin: "10px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <img
                style={{ width: "20vh", height: "20vh", objectFit: "cover" }}
                src={`data:${selfieData[5].mimeType};base64,${selfieData[5].data}`}
                alt={`Selfie ${selfieData[5].id}`}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <img
                style={{ width: "100%", height: "20vh", objectFit: "cover" }}
                src={`data:${selfieData[6].mimeType};base64,${selfieData[6].data}`}
                alt={`Selfie ${selfieData[6].id}`}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "20vh",
              }}
            >
              <img
                style={{ width: "100%", height: "20vh", objectFit: "cover" }}
                src={`data:${selfieData[7].mimeType};base64,${selfieData[7].data}`}
                alt={`Selfie ${selfieData[7].id}`}
              />
            </div>
          </div>
        </div>
      </section>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleDownload} color="primary" variant="contained" style={{marginBottom: "40px"}}>
          Download Collage
        </Button>
      </div>
      <ErrorSuccessSnackbar
        open={processing}
        response={{ message: "Processing. Please wait", status: 1000 }}
      />
      <Typography
        variant="h6"
        style={{
          textAlign: "center",
          position: "fixed",
          bottom: "0px",
          width: "100%",
          marginBottom: "0px",
          zIndex: -1,
        }}
      >
        Reload page to randomize your collage.
      </Typography>
    </main>
  );
};
