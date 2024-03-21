"use client";

import { InsertDriveFile } from "@mui/icons-material";
import { TextField, TextFieldProps } from "@mui/material";
import React, { ChangeEvent, useRef } from "react";

type Props = {
  value?: string;
  onChange?: (file: File) => void;
} & Omit<TextFieldProps, "value" | "onChange">;

const FileUploadField = React.forwardRef<HTMLDivElement, Props>(
  ({ value, onChange, ...textFieldProps }: Props, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function onAddDocumentClick() {
      fileInputRef.current?.click();
    }

    function handleAddDocument(event: ChangeEvent<HTMLInputElement>) {
      const uploadedFile = event.target.files?.[0];
      if (uploadedFile) onChange?.(uploadedFile);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    return (
      <>
        <input hidden type="file" ref={fileInputRef} onChange={handleAddDocument} />
        <TextField
          ref={ref}
          value={value ?? "Legg til dokument"}
          onClick={onAddDocumentClick}
          type="button"
          label="Dokument"
          placeholder="Legg til dokument"
          inputMode="none"
          inputProps={{
            style: {
              cursor: "pointer",
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: <InsertDriveFile />,
          }}
          {...textFieldProps}
        />
      </>
    );
  }
);

export { FileUploadField };
