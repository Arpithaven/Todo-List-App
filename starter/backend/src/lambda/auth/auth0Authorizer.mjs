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
    logger.info("Authorizer event", { event });

    const authHeader = event.authorizationToken;
    const jwtToken = await verifyToken(authHeader);

    const userId = jwtToken.sub;

    return {
      principalId: userId,
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
      context: {
        userId, // 👈 THIS is what CRUD lambdas read
      },
    };
  } catch (error) {
    logger.error("Authorization failed", { error });

    return {
      principalId: "unauthorized",
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

  const decodedJwt = jsonwebtoken.decode(token, { complete: true });
  if (!decodedJwt) {
    throw new Error("Invalid JWT token");
  }

  const response = await Axios.get(jwksUrl);
  const signingKey = response.data.keys.find(
    (key) => key.kid === decodedJwt.header.kid
  );

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
    throw new Error("Missing Authorization header");
  }

  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    throw new Error("Invalid Authorization header");
  }

  return authHeader.split(" ")[1];
}
