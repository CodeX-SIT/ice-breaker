import { Gallery } from "@/components/Gallery";
import { Selfie, sequelize } from "@/database";
import NavBar from "@/components/NavBar";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function Page({ params }: { params: { code: string } }) {
  // Fetch 100 random selfies
  const session = await checkAuthAndRedirect();
  const selfies = await Selfie.findAll({
    include: [
      {
        attributes: [],
        association: "assigned",
        include: [
          {
            attributes: [],
            association: "gameCode",
            where: { code: params.code },
            required: true,
          },
        ],
        required: true,
      },
    ],
    order: [sequelize.fn("RANDOM")],
    limit: 100,
  });

  // console.log(
  //   selfies.map((selfie) => {
  //     return selfie.id, selfie.assignedId;
  //   }),
  // );

  const selfieData = selfies.map((selfie) => ({
    id: selfie.id,
    mimeType: selfie.mimeType,
    assignedId: selfie.assignedId,
    data: selfie.data.toString("base64"),
  }));

  return (
    <div>
      <NavBar />
      <div style={{ marginTop: "64px" }}></div>
      <Gallery selfieData={selfieData} />
    </div>
  );
}
