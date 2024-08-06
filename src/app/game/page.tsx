import _GamePage from "./GamePage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function GamePage() {
  await checkAuthAndRedirect();

  return <_GamePage />;
}
