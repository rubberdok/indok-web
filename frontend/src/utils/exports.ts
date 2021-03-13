const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/**
 * Converts the given string to an ArrayBuffer.
 */
function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export const promptDownloadFromPayload = (payload: { filename: string; data: string; contentType: string }) => {
  let blob;
  if (payload.contentType == XLSX_CONTENT_TYPE) {
    blob = new Blob([s2ab(atob(payload.data))], { type: payload.contentType });
  } else {
    blob = new Blob([payload.data], { type: payload.contentType });
  }

  const e = window.document.createElement("a");
  e.href = window.URL.createObjectURL(blob);
  e.download = payload.filename;
  e.style.display = "none";
  document.body.appendChild(e);
  e.click();
  document.body.removeChild(e);
};
