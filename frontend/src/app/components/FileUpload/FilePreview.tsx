"use client";
import { Box } from "@mui/material";
import Image from "next/image";

type FilePreviewProps = {
  url?: string | null;
  variant?: "square" | "circle";
};

function FilePreview(props: FilePreviewProps) {
  const { variant = "circle" } = props;
  if (!props.url) return null;
  const borderRadius = variant === "circle" ? "100%" : 0;
  return (
    <Box
      padding={1}
      bgcolor="white"
      borderRadius={borderRadius}
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box position="relative" sx={{ aspectRatio: 1 }}>
        <Image src={props.url} fill style={{ objectFit: "contain", objectPosition: "center" }} alt="" />
      </Box>
    </Box>
  );
}

export { FilePreview };
