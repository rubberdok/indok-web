"use client";

export default function Blog() {
  return (
    <div style={{ width: "100%" }}>
      <div
        contentEditable
        style={{
          width: "100%",
          minWidth: "100%",
          minHeight: 90,
          maxWidth: 400,
          maxHeight: 300,
          overflow: "hidden",
          resize: "both",
        }}
      >
        n sdck
      </div>
      <br />
    </div>
  );
}
