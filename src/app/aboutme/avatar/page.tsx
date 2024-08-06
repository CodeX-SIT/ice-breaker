import dynamic from "next/dynamic";
import React from "react";
import _AvatarPage from "./AvatarPage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { Avatar } from "@/database";

const AvatarChooser = dynamic(() => import("@/components/AvatarChooser"), {
  ssr: false,
});

export default async function AvatarPage() {
  const session = await checkAuthAndRedirect();
  const userId = session?.user?.id!;

  const previousAvatar = await Avatar.findOne({ where: { userId } });

  return (
    <_AvatarPage
      userId={userId}
      previousAvatar={previousAvatar ? previousAvatar.get() : null}
    />
  );
}
