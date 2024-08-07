import AdminStats from "./live/liveStats";
import TopThree from "@/app/game/[code]/stats/TopThree";

export default function Page({ params }: { params: { code: string } }) {
  const code = params.code;
  return (
    <>
      {/* <AdminStats code={code} /> */}
      <TopThree code={code} />
    </>
  );
}
