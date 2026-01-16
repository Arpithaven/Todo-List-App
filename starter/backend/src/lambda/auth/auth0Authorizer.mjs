import Axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import { createLogger } from "../../utils/logger.mjs";

const logger = createLogger("auth");

const auth0Domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;
const issuer = `https://${auth0Domain}/`;
const jwksUrl = `${issuer}.well-known/jwks.json`;

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const jwt = jsonwebtoken.decode(token, { complete: true });

  if (!jwt) {
    throw new Error("Invalid token");
  }

  const response = await Axios.get(jwksUrl);
  const keys = response.data.keys;
  const signingKey = keys.find((key) => key.kid === jwt.header.kid);

  if (!signingKey) {
    throw new Error("Signing key not found");
  }

  const cert = `-----BEGIN CERTIFICATE-----\n${signingKey.x5c[0]}\n-----END CERTIFICATE-----`;

  return jsonwebtoken.verify(token, cert, {
    algorithms: ["RS256"],
    audience,
    issuer,
  });
}

function getToken(authHeader) {
  if (!authHeader) {
    throw new Error("No authentication header");
  }

  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    throw new Error("Invalid authentication header");
  }

  return authHeader.split(" ")[1];
}
