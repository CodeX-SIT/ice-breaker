import GamePage from "./GamePage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function Page({ params }: { params: { code: string } }) {
  await checkAuthAndRedirect();

  const code = params.code;

  return <GamePage code={code} />;
}
