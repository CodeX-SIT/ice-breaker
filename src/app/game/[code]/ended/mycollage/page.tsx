import { Selfie, sequelize } from "@/database";
import React from "react";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { MyCollage } from "./MyCollage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { Op } from "sequelize";

const Page = async ({ params }: { params: { code: string } }) => {
  const session = await checkAuthAndRedirect();
  const userId = session?.user?.id!;
  const selfies = await Selfie.findAll({
    include: [
      {
        attributes: ["id", "assignedUserId", "userId"],
        association: "assigned",
        where: {
          [Op.or]: [{ userId }, { assignedUserId: userId }],
        },
        required: true,
        include: [
          {
            attributes: [],
            association: "gameCode",
            where: { code: params.code },
            required: true,
          },
        ],
      },
    ],
    order: [sequelize.fn("RANDOM")],
    limit: 10,
  });
  const selfieData = selfies.map((selfie) => ({
    id: selfie.id,
    mimeType: selfie.mimeType,
    assignedId: selfie.assignedId,
    data: selfie.data ? selfie.data.toString("base64") : "",
  }));

  // Ensure selfieData has exactly 8 items
  while (selfieData.length < 8) {
    selfieData.push({
      id: selfieData.length,
      mimeType: "image/png",
      assignedId: selfieData.length,
      data: "", // This will trigger the use of the default image
    });
  }

  return (
    <>
      <MyCollage selfieData={selfieData}></MyCollage>
    </>
  );
};

export default Page;
