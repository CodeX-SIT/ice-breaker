import { CircularProgress } from "@mui/material";

export default async function Loading() {
  return (
    <section className="flex h-screen w-screen justify-center items-center">
      <CircularProgress />
    </section>
  );
}
