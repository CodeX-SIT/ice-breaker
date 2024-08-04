"use client";
import React from "react";
import Avatar from "avataaars";

// Define the type for the keys of the avatarProps object
type AvatarPropKey =
  | "avatarStyle"
  | "topType"
  | "accessoriesType"
  | "hairColor"
  | "facialHairType"
  | "facialHairColor"
  | "clotheType"
  | "clotheColor"
  | "eyeType"
  | "eyebrowType"
  | "mouthType"
  | "skinColor";

export interface AvatarProps {
  avatarStyle: string;
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
}

interface AvatarPreviewProps {
  avatarProps: AvatarProps;
  updateProp: (prop: AvatarPropKey, value: string) => void;
  propType: AvatarPropKey;
  value: string;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  avatarProps,
  updateProp,
  propType,
  value,
}) => {
  return (
    <div
      onClick={() => updateProp(propType, value)}
      style={{ cursor: "pointer", margin: "5px" }}
    >
      <Avatar
        {...avatarProps}
        {...{ [propType]: value }}
        style={{ width: "50px", height: "50px", margin: "0 auto" }}
      />
    </div>
  );
};

export default AvatarPreview;
