import LiveStats from "./liveStats";
import TopThree from "@/app/game/[code]/stats/TopThree";

export default function Page({ params }: { params: { code: string } }) {
  const code = params.code;
  return (
    <>
      <LiveStats code={code} />
      {/* <TopThree code={code} /> */}
    </>
  );
}
