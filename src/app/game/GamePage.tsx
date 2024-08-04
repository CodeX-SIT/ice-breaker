import SelfAvatar from "./SelfAvatar";

export default function GamePage({ userId }: { userId: string }) {
  
  return (
    <>
      <SelfAvatar userId={userId} />
    </>
  );
}
