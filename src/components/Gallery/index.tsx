"use client";
import React, { useEffect, useCallback } from "react";
import "./embla.css"; // Include your custom styles here
import Marquee from "react-fast-marquee";
import { CircularProgress } from "@mui/material";

type Selfie = {
  mimeType: string;
  data: string;
  id: number;
  assignedId: number;
};
const chunkArray = (array: Selfie[], numChunks: number): Selfie[][] => {
  const chunkSize = Math.ceil(array.length / numChunks);
  return Array.from({ length: numChunks }, (_, i) =>
    array.slice(i * chunkSize, i * chunkSize + chunkSize),
  );
};

export const Gallery = ({ selfieData }: { selfieData: Selfie[] }) => {
  const [loading, setLoading] = React.useState(true);

  // Split the data into 4 chunks
  const chunks = chunkArray(selfieData, 4);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (!selfieData.length) return <div>No selfies found.</div>;
  if (loading)
    return (
      <section className="flex h-screen w-screen justify-center items-center">
        <CircularProgress />
      </section>
    );

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#26282f",
        }}
      >
        <div>
          <Marquee>
            <div className="embla__container">
              {chunks[0].map((selfie) => (
                <div className="embla__slide" key={selfie.id}>
                  <img
                    className="embla__img"
                    src={`data:${selfie.mimeType};base64,${selfie.data}`}
                    alt={`Selfie ${selfie.id}`}
                  />
                </div>
              ))}
            </div>
          </Marquee>
          <Marquee direction="right">
            <div className="embla__container">
              {chunks[1].map((selfie) => (
                <div className="embla__slide" key={selfie.id}>
                  <img
                    className="embla__img"
                    src={`data:${selfie.mimeType};base64,${selfie.data}`}
                    alt={`Selfie ${selfie.id}`}
                  />
                </div>
              ))}
            </div>
          </Marquee>
          <Marquee>
            <div className="embla__container">
              {chunks[2].map((selfie) => (
                <div className="embla__slide" key={selfie.id}>
                  <img
                    className="embla__img"
                    src={`data:${selfie.mimeType};base64,${selfie.data}`}
                    alt={`Selfie ${selfie.id}`}
                  />
                </div>
              ))}
            </div>
          </Marquee>
          <Marquee direction="right">
            <div className="embla__container">
              {chunks[3].map((selfie) => (
                <div className="embla__slide" key={selfie.id}>
                  <img
                    className="embla__img"
                    src={`data:${selfie.mimeType};base64,${selfie.data}`}
                    alt={`Selfie ${selfie.id}`}
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </>
  );
};

// export const Gallery = ({ selfieData }: { selfieData: Selfie[] }) => {

//   if (!selfieData.length) return <div>No selfies found.</div>;

//   return (
//     <>
//       <Marquee>
//         <div className="embla__container">
//           {selfieData.map((selfie) => (
//             <div className="embla__slide" key={selfie.id}>
//               <img
//                 className="embla__img"
//                 src={`data:${selfie.mimeType};base64,${selfie.data}`}
//                 alt={`Selfie ${selfie.id}`}
//               />
//             </div>
//           ))}
//         </div>
//       </Marquee>

//     </>
//   );
// };
