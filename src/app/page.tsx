import NavBar from "@/components/NavBar";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function Home() {
  await checkAuthAndRedirect();
  return <NavBar />;
}
