import { Gallery } from "@/components/Gallery";
import { Selfie, sequelize } from "@/database";
import NavBar from "@/components/NavBar";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { Button } from "@mui/material";

export default async function Page({ params }: { params: { code: string } }) {
  // Fetch 100 random selfies
  await checkAuthAndRedirect();
  const LIMIT = 100;
  const code = params.code.toLowerCase().trim();
  const selfies = await Selfie.findAll({
    include: [
      {
        attributes: ["userId"], // Fetch userId for grouping
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
    limit: LIMIT * 2,
    order: [sequelize.fn("RANDOM")], // Shuffle the results
  });

  // Group selfies by userId
  const groupedSelfies = selfies.reduce((acc, selfie) => {
    const userId = selfie.assigned!.userId;
    // @ts-ignore
    if (!acc[userId]) acc[userId] = [];
    // @ts-ignore
    acc[userId].push(selfie);
    return acc;
  }, {});

  // Shuffle each group (optional, but recommended)
  for (let userId in groupedSelfies) {
    // @ts-ignore
    groupedSelfies[userId] = groupedSelfies[userId].sort(
      () => 0.5 - Math.random(),
    );
  }

  const evenlyDistributedSelfies = [];
  const limit = selfies.length > LIMIT ? LIMIT : selfies.length;
  while (evenlyDistributedSelfies.length < limit) {
    for (let userId in groupedSelfies) {
      // @ts-ignore
      if (groupedSelfies[userId].length > 0) {
        // @ts-ignore
        evenlyDistributedSelfies.push(groupedSelfies[userId].shift());
        if (evenlyDistributedSelfies.length === limit) break;
      }
    }
  }
  
  // console.log(evenlyDistributedSelfies);

  // console.log(
  //   selfies.map((selfie) => {
  //     return selfie.id, selfie.assignedId;
  //   }),
  // );

  const selfieData = evenlyDistributedSelfies.map((selfie) => ({
    id: selfie.id,
    mimeType: selfie.mimeType,
    assignedId: selfie.assignedId,
    data: selfie.data.toString("base64"),
  }));

  return (
    <div>
      <NavBar variant="induction"/>
      <div style={{ marginTop: "64px" }}></div>
      <Gallery selfieData={selfieData} />
      <div className="text-center mt-5">
        <Button
          variant="contained"
          color="primary"
          href={`/game/${code}/stats`}
          className="reveal"
        >
          View Stats
        </Button>
      </div>
    </div>
  );
}
