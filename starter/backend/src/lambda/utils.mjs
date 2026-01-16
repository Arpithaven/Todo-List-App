import { parseUserId } from "../auth/utils.mjs";

export function getUserId(event) {
  return event.requestContext.authorizer.userId;
}
