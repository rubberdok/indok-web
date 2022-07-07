import * as crypto from "crypto";
/**
 * Generate a new PKCE S256 transformed code challenge.
 * https://datatracker.ietf.org/doc/html/rfc7636
 */
export const pkce = () => {
  const codeVerifier = crypto.randomBytes(32).toString("base64");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return { codeVerifier, codeChallenge };
};
