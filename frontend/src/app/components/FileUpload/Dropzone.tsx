"use client";
import { FileUploadOutlined, InsertDriveFileRounded } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  ButtonBaseProps,
  CircularProgress,
  CircularProgressProps,
  FormHelperText,
  Stack,
  Theme,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import cl from "clsx";
import React, { HTMLProps, useImperativeHandle } from "react";
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
  error?: boolean;
  helperText?: string;
} & Pick<ButtonBaseProps, "disabled" | "sx"> &
  HTMLProps<HTMLInputElement>;

function getColor(
  theme: Theme,
  color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" = "primary"
) {
  if (color === "inherit") return { main: "inherit", mainChannel: "inherit" };
  return { main: theme.vars.palette[color].main, mainChannel: theme.vars.palette[color].mainChannel };
}

const DropzoneContainer = styled(ButtonBase)<Props>(({ theme: t, fullWidth, color }) => ({
  padding: t.spacing(2),
  width: fullWidth ? "100%" : undefined,
  color: getColor(t, color).main,
  borderColor: getColor(t, color).main,
  borderStyle: "dashed",
  borderRadius: t.shape.borderRadius,
  borderWidth: 2,
  transition: "background-color 0.3s",
  "&.Mui-selected": {
    bgcolor: `rgb(${getColor(t, color).mainChannel} / ${t.vars.palette.action.selectedOpacity})`,
  },
  "&.Mui-hover": {
    bgcolor: `rgb(${getColor(t, color).mainChannel} / ${t.vars.palette.action.hoverOpacity})`,
  },
  "&.Mui-disabled": {
    color: t.vars.palette.action.disabled,
    borderColor: t.vars.palette.action.disabled,
  },
  "&.Mui-error": {
    borderColor: t.vars.palette.error.main,
  },
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  minHeight: "100px",
  minWidth: "13rem",
}));

const Dropzone = React.forwardRef<HTMLInputElement, Props>(function Dropzone(props, ref) {
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
    error,
    helperText,
    ...inputProps
  } = props;
  function onDrop(acceptedFiles: File[]) {
    onFilesChange?.(acceptedFiles);
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
    isFileDialogActive,
    isFocused,
    inputRef,
  } = useDropzone({
    maxSize,
    onDrop,
    multiple,
    disabled,
    onDropRejected: onFilesRejected,
    preventDropOnDocument: true,
  });

  const className = cl({
    "Mui-hover": isDragActive,
    "Mui-selected": isFileDialogActive,
    "Mui-focused": isFocused,
    "Mui-error": fileRejections.length > 0 || props.error,
  });

  /**
   * React Dropzone does not provide a way to pass a ref to the input element,
   * so we need to use `useImperativeHandle` to expose the input ref to the parent component.
   */
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current, [inputRef]);

  return (
    <>
      <DropzoneContainer
        {...getRootProps({
          onClick: () => {},
          className,
          disabled,
        })}
        color={color}
        sx={sx}
      >
        <input {...getInputProps({ ...inputProps })} />
        <InnerDropzone
          loading={loading}
          progress={progress}
          acceptedFiles={acceptedFiles}
          fileRejections={fileRejections}
        />
      </DropzoneContainer>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </>
  );
});

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
