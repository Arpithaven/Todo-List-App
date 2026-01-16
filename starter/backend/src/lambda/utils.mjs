import { parseUserId } from "../auth/utils.mjs";

export function getUserId(event) {
  const authHeader = event.headers.Authorization || event.headers.authorization;

  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  const jwtToken = authHeader.split(" ")[1];
  return parseUserId(jwtToken);
}
