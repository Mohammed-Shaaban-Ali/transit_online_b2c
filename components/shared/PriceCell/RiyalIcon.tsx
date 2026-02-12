import React from "react";
import riyalIcon from "@/public/riyal.svg";
import Image from "next/image";
type Props = {
  width?: number;
  height?: number;
  className?: string;
};

function RiyalIcon({ width = 22, height = 22, className = "mr-0.5" }: Props) {
  return (
    <Image
      src={riyalIcon}
      alt="riyal icon"
      width={width}
      height={height}
      className={className}
    />
  );
}

export default RiyalIcon;
