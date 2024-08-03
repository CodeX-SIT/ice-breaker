"use server";

import _HobbiesPage from "./HobbiesPage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function HobbiesPage() {
  await checkAuthAndRedirect();

  return <_HobbiesPage />;
}
