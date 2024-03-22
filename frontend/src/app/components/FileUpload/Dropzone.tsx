"use client";
import { FileUploadOutlined, InsertDriveFileRounded } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  ButtonBaseProps,
  CircularProgress,
  CircularProgressProps,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import cl from "clsx";
import { FileRejection, useDropzone } from "react-dropzone";
import { MB_16 } from "./useFileUpload";

type Props = {
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  multiple?: boolean;
  loading?: boolean;
  progress?: {
    [fileName: string]: number;
  };
  maxSize?: number;
  fullWidth?: boolean;
  onFilesChange?: (files: File[]) => void;
  onFilesRejected?: (fileRejections: FileRejection[]) => void;
} & Pick<ButtonBaseProps, "disabled" | "sx">;

function Dropzone(props: Props) {
  const {
    color = "primary",
    sx,
    disabled,
    multiple,
    loading,
    progress,
    onFilesChange,
    maxSize = MB_16,
    onFilesRejected,
    fullWidth,
    ...boxProps
  } = props;
  function onDrop(acceptedFiles: File[]) {
    onFilesChange?.(acceptedFiles);
  }

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections, isFileDialogActive, isFocused } =
    useDropzone({
      maxSize,
      onDrop,
      multiple,
      disabled,
      onDropRejected: onFilesRejected,
    });
  const className = cl({
    "Mui-hover": isDragActive,
    "Mui-selected": isFileDialogActive,
    "Mui-focused": isFocused,
    "Mui-error": fileRejections.length > 0,
  });

  function getColor(
    theme: Theme,
    color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" = "primary"
  ) {
    if (color === "inherit") return { main: "inherit", mainChannel: "inherit" };
    return { main: theme.vars.palette[color].main, mainChannel: theme.vars.palette[color].mainChannel };
  }

  return (
    <>
      <ButtonBase
        {...getRootProps()}
        className={className}
        disabled={disabled}
        sx={(theme) => ({
          padding: theme.spacing(2),
          width: fullWidth ? "100%" : undefined,
          color: getColor(theme, color).main,
          borderColor: getColor(theme, color).main,
          borderStyle: "dashed",
          borderRadius: theme.shape.borderRadius,
          borderWidth: 2,
          transition: "background-color 0.3s",
          "&.Mui-selected": {
            bgcolor: `rgb(${getColor(theme, color).mainChannel} / ${theme.vars.palette.action.selectedOpacity})`,
          },
          "&.Mui-hover": {
            bgcolor: `rgb(${getColor(theme, color).mainChannel} / ${theme.vars.palette.action.hoverOpacity})`,
          },
          "&.Mui-disabled": {
            color: theme.vars.palette.action.disabled,
            borderColor: theme.vars.palette.action.disabled,
          },
          "&.Mui-error": {
            borderColor: theme.vars.palette.error.main,
          },
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          minHeight: "100px",
          minWidth: "13rem",
        })}
        {...boxProps}
      >
        <input {...getInputProps()} />
        <InnerDropzone
          loading={loading}
          progress={progress}
          acceptedFiles={acceptedFiles}
          fileRejections={fileRejections}
        />
      </ButtonBase>
    </>
  );
}

export { Dropzone };

type InnerDropzoneProps = {
  loading?: boolean;
  acceptedFiles: File[];
  fileRejections?: FileRejection[];
  progress?: { [fileName: string]: number };
};

function InnerDropzone(props: InnerDropzoneProps) {
  const { loading, acceptedFiles, progress, fileRejections } = props;

  if (fileRejections?.length) {
    return (
      <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
        {fileRejections.map((fileRejection) => (
          <Typography key={fileRejection.file.name} color="error">
            {fileRejection.file.name} - {fileRejection.errors.map((error) => error.message).join(", ")}
          </Typography>
        ))}
      </Stack>
    );
  }

  if (acceptedFiles.length === 1) {
    const file = acceptedFiles[0];

    return (
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        {loading && <CircularProgressWithLabel color="inherit" value={progress?.[file.name]} />}
        <InsertDriveFileRounded />
        <Typography>{acceptedFiles[0].name}</Typography>
      </Stack>
    );
  }
  if (acceptedFiles.length > 1) {
    return (
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <InsertDriveFileRounded />
        <Typography>{acceptedFiles.length} files</Typography>
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
      <FileUploadOutlined />
      <Typography>Dra og slipp filer</Typography>
    </Stack>
  );
}

function CircularProgressWithLabel(props: CircularProgressProps & { value?: number }) {
  if (!props.value) return <CircularProgress color="inherit" />;
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
