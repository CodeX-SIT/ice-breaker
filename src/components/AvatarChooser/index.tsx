"use client";
import React, { useState } from "react";
import Avatar from "avataaars";
import AvatarPreview, { AvatarProps } from "../AvatarPreview";
import { Tabs, Tab, Box, Grid, Paper } from "@mui/material";

type AvatarPropKey =
  | "topType"
  | "eyeType"
  | "eyebrowType"
  | "accessoriesType"
  | "mouthType"
  | "skinColor"
  | "hairColor"
  | "facialHairType"
  | "facialHairColor"
  | "clotheType"
  | "clotheColor";

const keyHeadingMapping: Record<AvatarPropKey, string> = {
  topType: "Hair",
  eyeType: "Eye",
  eyebrowType: "Eyebrow",
  accessoriesType: "Accessories",
  mouthType: "Mouth",
  skinColor: "Skin",
  hairColor: "Hair Color",
  facialHairType: "Facial Hair",
  facialHairColor: "Facial Hair Color",
  clotheType: "Cloth",
  clotheColor: "Cloth Color",
};

const AvatarChooser = ({
  avatarProps,
  setAvatarProps,
}: {
  avatarProps: AvatarProps;
  setAvatarProps: React.Dispatch<React.SetStateAction<AvatarProps>>;
}) => {
  const [currentTab, setCurrentTab] = useState("topType");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  function updateAvatarProp(prop: string, value: string) {
    setAvatarProps((prevProps) => ({
      ...prevProps,
      [prop]: value,
    }));
  }

  const options = {
    topType: [
      "NoHair",
      "ShortHairDreads01",
      "ShortHairDreads02",
      "ShortHairFrizzle",
      "ShortHairShaggyMullet",
      "ShortHairShortCurly",
      "ShortHairShortFlat",
      "ShortHairShortRound",
      "ShortHairShortWaved",
      "ShortHairSides",
      "ShortHairTheCaesar",
      "ShortHairTheCaesarSidePart",
      "LongHairBigHair",
      "LongHairBob",
      "LongHairBun",
      "LongHairCurly",
      "LongHairCurvy",
      "LongHairDreads",
      "LongHairFrida",
      "LongHairFro",
      "LongHairFroBand",
      "LongHairNotTooLong",
      "LongHairShavedSides",
      "LongHairMiaWallace",
      "LongHairStraight",
      "LongHairStraight2",
      "LongHairStraightStrand",
      "Hat",
      "Hijab",
      "Turban",
      "WinterHat1",
      "WinterHat2",
      "WinterHat3",
      "WinterHat4",
    ],
    accessoriesType: [
      "Blank",
      "Kurt",
      "Prescription01",
      "Prescription02",
      "Round",
      "Sunglasses",
      "Wayfarers",
    ],
    hairColor: [
      "Auburn",
      "Black",
      "Blonde",
      "BlondeGolden",
      "Brown",
      "BrownDark",
      "PastelPink",
      "Blue",
      "Platinum",
      "Red",
      "SilverGray",
    ],
    facialHairType: [
      "Blank",
      "BeardMedium",
      "BeardLight",
      "BeardMajestic",
      "MoustacheFancy",
      "MoustacheMagnum",
    ],
    facialHairColor: [
      "BlondeGolden",
      "Black",
      "Auburn",
      "Brown",
      "BrownDark",
      "Platinum",
    ],
    clotheType: [
      "BlazerShirt",
      "BlazerSweater",
      "CollarSweater",
      "GraphicShirt",
      "Hoodie",
      "Overall",
      "ShirtCrewNeck",
      "ShirtScoopNeck",
      "ShirtVNeck",
    ],
    clotheColor: [
      "Black",
      "Blue01",
      "Blue02",
      "Blue03",
      "Gray01",
      "Gray02",
      "Heather",
      "PastelBlue",
      "PastelGreen",
      "PastelOrange",
      "PastelRed",
      "PastelYellow",
      "Pink",
      "Red",
      "White",
    ],
    eyeType: [
      "Close",
      "Cry",
      "Default",
      "Dizzy",
      "EyeRoll",
      "Happy",
      "Hearts",
      "Side",
      "Squint",
      "Surprised",
      "Wink",
      "WinkWacky",
    ],
    eyebrowType: [
      "Angry",
      "AngryNatural",
      "Default",
      "DefaultNatural",
      "FlatNatural",
      "RaisedExcited",
      "RaisedExcitedNatural",
      "SadConcerned",
      "SadConcernedNatural",
      "UnibrowNatural",
      "UpDown",
      "UpDownNatural",
    ],
    mouthType: [
      "Concerned",
      "Default",
      "Disbelief",
      "Eating",
      "Grimace",
      "Sad",
      "ScreamOpen",
      "Serious",
      "Smile",
      "Tongue",
      "Twinkle",
      "Vomit",
    ],
    skinColor: [
      "Tanned",
      "Yellow",
      "Pale",
      "Light",
      "Brown",
      "DarkBrown",
      "Black",
    ],
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Avatar style={{ width: "150px", height: "150px" }} {...avatarProps} />
      </Paper>
      <Box sx={{ width: "100%", maxWidth: "lg" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="avatar customization tabs"
        >
          {Object.keys(options).map((key) => (
            <Tab
              key={key}
              label={keyHeadingMapping[key as AvatarPropKey]}
              value={key}
            />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {Object.keys(options).map(
            (key) =>
              currentTab === key && (
                <div key={key}>
                  <Grid container spacing={2}>
                    {options[key as AvatarPropKey].map((option) => (
                      <Grid item xs={4} sm={3} md={2} key={option}>
                        <AvatarPreview
                          avatarProps={avatarProps}
                          updateProp={updateAvatarProp}
                          propType={key as AvatarPropKey}
                          value={option}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ),
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AvatarChooser;
